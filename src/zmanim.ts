import 'temporal-polyfill/global';
import {GeoLocation, NOAACalculator} from '@hebcal/noaa';
import {HDate, getPseudoISO, getTimezoneOffset, isDate, pad2} from '@hebcal/hdate';
import {Molad} from './molad.js';

/**
 * Converts an instant to a `Date`, discarding milliseconds.
 *
 * Zmanim are read out to the minute, and every accessor here reduces to an
 * instant, so we ask `@hebcal/noaa` for epoch milliseconds rather than a
 * `Temporal.ZonedDateTime`. Resolving the IANA zone to build a
 * `ZonedDateTime` costs roughly 750ns and nothing downstream uses it, which
 * made it the single most expensive step in a sunrise/sunset calculation.
 * @private
 */
function millisToDate(millis: number): Date {
  const res = new Date(millis);
  res.setMilliseconds(0);
  return res;
}

/**
 * The zenith of astronomical sunrise and sunset. The sun is 90° from the vertical 0°
 */
const GEOMETRIC_ZENITH: number = 90;

/**
 * The zenith of 1.583° below geometric zenith (90°). This calculation is used for
 * calculating _netz amiti_ (sunrise) and _shkiah amiti_ (sunset) based on the opinion of the
 * [Baal Hatanya](https://en.wikipedia.org/wiki/Shneur_Zalman_of_Liadi).
 *
 * @see Zmanim.sunriseBaalHatanya
 * @see Zmanim.sunsetBaalHatanya
 */
const ZENITH_1_POINT_583: number = GEOMETRIC_ZENITH + 1.583;

/**
 * The zenith of civil twilight; the sun is 6° below the horizon.
 * Matches `NOAACalculator.CIVIL_ZENITH`.
 */
const CIVIL_ZENITH: number = GEOMETRIC_ZENITH + 6;

/**
 * Length of one temporal (halachic) hour in milliseconds, i.e. one twelfth of
 * the day. Mirrors `NOAACalculator.getTemporalHour()`, including its floor, so
 * that results stay identical to the `ZonedDateTime` code path.
 * @private
 */
function temporalHourMillis(startOfDay: number, endOfDay: number): number {
  return Math.floor((endOfDay - startOfDay) / 12);
}

/**
 * Calculate halachic times (zmanim / זְמַנִּים) for a given day and location.
 * Calculations are available for tzeit / tzais (nightfall),
 * shkiah (sunset) and more.
 *
 * Zmanim are estimated using an algorithm published by the US National Oceanic
 * and Atmospheric Administration. The NOAA solar calculator is based on equations
 * from _Astronomical Algorithms_ by Jean Meeus.
 *
 * The sunrise and sunset results are theoretically accurate to within a minute for
 * locations between +/- 72° latitude, and within 10 minutes outside of those latitudes.
 * However, due to variations in atmospheric composition, temperature, pressure and
 * conditions, observed values may vary from calculations.
 * https://gml.noaa.gov/grad/solcalc/calcdetails.html
 *
 * @example
 * import {GeoLocation, Zmanim} from '@hebcal/core';
 * const latitude = 41.822232;
 * const longitude = -71.448292;
 * const tzid = 'America/New_York';
 * const friday = new Date(2023, 8, 8);
 * const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
 * const zmanim = new Zmanim(gloc, friday, false);
 * const candleLighting = zmanim.sunsetOffset(-18, true);
 * const timeStr = Zmanim.formatISOWithTimeZone(tzid, candleLighting);
 * // '2023-09-08T18:49:00-04:00'
 */
export class Zmanim {
  private readonly hdate: HDate;
  private readonly plainDate: Temporal.PlainDate;
  private readonly gloc: GeoLocation;
  private readonly noaa: NOAACalculator;
  private useElevation: boolean;
  /**
   * Initialize a Zmanim instance.
   * @param gloc GeoLocation including latitude, longitude, and timezone
   * @param date Regular or Hebrew Date. If `date` is a regular `Date`,
   *    hours, minutes, seconds and milliseconds are ignored.
   * @param useElevation use elevation for calculations (default `false`).
   *    If `true`, use elevation to affect the calculation of all sunrise/sunset based
   *    zmanim. Note: there are some zmanim such as degree-based zmanim that are driven
   *    by the amount of light in the sky and are not impacted by elevation.
   *    These zmanim intentionally do not support elevation adjustment.
   */
  constructor(gloc: GeoLocation, date: Date | HDate, useElevation: boolean) {
    this.hdate = new HDate(date);
    const dt = isDate(date) ? date : this.hdate.greg();
    // The constructor is ~1.8x cheaper than PlainDate.from(), which has to
    // walk a property bag and apply overflow handling. The fields come from a
    // real Date, so they are always in range and never need constraining.
    this.plainDate = new Temporal.PlainDate(
      dt.getFullYear(),
      dt.getMonth() + 1,
      dt.getDate()
    );
    this.gloc = gloc;
    this.noaa = new NOAACalculator(gloc, this.plainDate);
    this.useElevation = Boolean(useElevation);
  }
  /**
   * Returns `true` if this instance uses the location's elevation when
   * calculating sunrise/sunset-based zmanim.
   */
  getUseElevation(): boolean {
    return this.useElevation;
  }
  /**
   * Enables or disables elevation adjustment for sunrise/sunset-based zmanim.
   *
   * Degree-based zmanim (such as {@link alotHaShachar} or {@link tzeit})
   * estimate the amount of light in the sky and are never affected by this
   * setting.
   * @param useElevation `true` to include the location's elevation
   */
  setUseElevation(useElevation: boolean) {
    this.useElevation = useElevation;
  }
  /**
   * Convenience function to get the time when sun is above or below the horizon
   * for a certain angle (in degrees).
   * This function does not support elevation adjustment.
   * @param angle degrees of solar depression below the horizon; for example
   *  `8.5` means the center of the sun is 8.5° below the horizon
   * @param rising `true` for the morning (before sunrise), `false` for the
   *  evening (after sunset)
   */
  timeAtAngle(angle: number, rising: boolean): Date {
    const offsetZenith = GEOMETRIC_ZENITH + angle;
    return millisToDate(
      rising
        ? this.sunriseMillis(offsetZenith, true)
        : this.sunsetMillis(offsetZenith, true)
    );
  }
  /**
   * Sunrise for a given zenith as epoch milliseconds, mirroring what
   * `NOAACalculator.getSunrise()` / `getSeaLevelSunrise()` /
   * `getSunriseOffsetByDegrees()` compute, minus the `ZonedDateTime`.
   *
   * Note that noaa's degree-based accessors pass `adjustForElevation = true`
   * as well; the adjustment is a no-op unless the zenith is exactly
   * {@link GEOMETRIC_ZENITH}, which is why degree-based zmanim are unaffected
   * by elevation.
   * @private
   */
  private sunriseMillis(zenith: number, useElevation: boolean): number {
    const utc = useElevation
      ? this.noaa.getUTCSunrise0(zenith)
      : this.noaa.getUTCSeaLevelSunrise(zenith);
    return this.noaa.getEpochMillisFromTime(utc, true);
  }
  /**
   * Sunset counterpart of {@link sunriseMillis}.
   * @private
   */
  private sunsetMillis(zenith: number, useElevation: boolean): number {
    const utc = useElevation
      ? this.noaa.getUTCSunset0(zenith)
      : this.noaa.getUTCSeaLevelSunset(zenith);
    return this.noaa.getEpochMillisFromTime(utc, false);
  }
  /**
   * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  sunrise(): Date {
    return millisToDate(this.sunriseMillis(GEOMETRIC_ZENITH, this.useElevation));
  }
  /**
   * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon).
   * This function does not support elevation adjustment.
   */
  seaLevelSunrise(): Date {
    return millisToDate(this.sunriseMillis(GEOMETRIC_ZENITH, false));
  }
  /**
   * When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  sunset(): Date {
    return millisToDate(this.sunsetMillis(GEOMETRIC_ZENITH, this.useElevation));
  }
  /**
   * When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
   * This function does not support elevation adjustment.
   */
  seaLevelSunset(): Date {
    return millisToDate(this.sunsetMillis(GEOMETRIC_ZENITH, false));
  }
  /**
   * Civil dawn; Sun is 6° below the horizon in the morning.
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   */
  dawn(): Date {
    return millisToDate(this.sunriseMillis(CIVIL_ZENITH, true));
  }
  /**
   * Civil dusk; Sun is 6° below the horizon in the evening.
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   */
  dusk(): Date {
    return millisToDate(this.sunsetMillis(CIVIL_ZENITH, true));
  }
  /**
   * Returns sunset for the previous day.
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  gregEve(): Date {
    const prev0 = this.plainDate.subtract({days: 1});
    const prev = new Date(prev0.year, prev0.month - 1, prev0.day);
    const zman = new Zmanim(this.gloc, prev, this.useElevation);
    return zman.sunset();
  }
  /**
   * Length in milliseconds of one halachic hour of the night, calculated as
   * one twelfth of the time between the previous day's sunset and this
   * day's sunrise. Used internally by {@link chatzotNight}.
   */
  nightHour(): number {
    return (this.sunrise().getTime() - this.gregEve().getTime()) / 12; // ms in hour
  }
  /**
   * Midday – Chatzot; Sunrise plus 6 halachic hours.
   *
   * Unlike most sunrise/sunset-based zmanim, this is always computed from
   * sea-level sunrise and sunset, so it is not affected by the
   * `useElevation` setting.
   */
  chatzot(): Date {
    const startOfDay = this.sunriseMillis(GEOMETRIC_ZENITH, false);
    const endOfDay = this.sunsetMillis(GEOMETRIC_ZENITH, false);
    // NOAACalculator.getSunTransit(): sunrise plus 6 temporal hours
    return millisToDate(startOfDay + temporalHourMillis(startOfDay, endOfDay) * 6);
  }
  /**
   * Midnight – Chatzot; Sunset plus 6 halachic hours.
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  chatzotNight(): Date {
    return new Date(this.sunrise().getTime() - this.nightHour() * 6);
  }
  /**
   * Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning.
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   */
  alotHaShachar(): Date {
    return this.timeAtAngle(16.1, true);
  }
  /**
   * Dawn – Alot haShachar; calculated as 72 minutes before sunrise or
   * sea level sunrise.
   */
  alotHaShachar72(): Date {
    return this.sunriseOffset(-72, false, false);
  }
  /**
   * Same as {@link alotHaShachar72}, but returns a `Temporal.ZonedDateTime`
   * with seconds precision (instead of a `Date` rounded to the minute), or
   * `null` if sunrise cannot be calculated for this date and location.
   */
  alotHaShachar72zdt(): Temporal.ZonedDateTime | null {
    const zdt = this.useElevation
      ? this.noaa.getSunrise()
      : this.noaa.getSeaLevelSunrise();
    if (!zdt) {
      return null;
    }
    return zdt.subtract({minutes: 72});
  }

  /**
   * Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning.
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   */
  misheyakir(): Date {
    return this.timeAtAngle(11.5, true);
  }
  /**
   * Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning.
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   */
  misheyakirMachmir(): Date {
    return this.timeAtAngle(10.2, true);
  }
  private getShaahZmanisBasedZmanMillis(
    startOfDay: number,
    endOfDay: number,
    hours: number
  ): number {
    const offset = Math.trunc(temporalHourMillis(startOfDay, endOfDay) * hours);
    return startOfDay + offset;
  }
  /**
   * Utility method for using elevation-aware sunrise/sunset
   * @param hours number of _shaos zmaniyos_ (solar hours) after sunrise
   */
  private getShaahZmanisBasedZman(hours: number): Date {
    const startOfDay = this.sunriseMillis(GEOMETRIC_ZENITH, this.useElevation);
    const endOfDay = this.sunsetMillis(GEOMETRIC_ZENITH, this.useElevation);
    return millisToDate(
      this.getShaahZmanisBasedZmanMillis(startOfDay, endOfDay, hours)
    );
  }
  /**
   * Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra.
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  sofZmanShma(): Date {
    // Gra
    return this.getShaahZmanisBasedZman(3);
  }
  /**
   * Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra.
   *
   * This method returns the latest *zman tfila* (time to recite the morning prayers)
   * that is 4 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
   * (depending on the `useElevation` setting), according
   * to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).
   *
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  sofZmanTfilla(): Date {
    // Gra
    return this.getShaahZmanisBasedZman(4);
  }
  /**
   * This method returns the latest time for burning _chametz_ on _Erev Pesach_ according to the opinion
   * of the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon). This time is 5 halachic hours into the day, based on
   * the opinion of the GRA that the day is calculated from sunrise to sunset.
   *
   * If elevation is enabled, this function will include elevation in the calculation.
   * @return the `Date` of the latest time for burning _chametz_ on _Erev Pesach_. If the calculation can't be
   *         computed, such as in the Arctic Circle where there is at least one day a year where the sun does not
   *         rise and one where it does not set, an `Invalid Date` will be returned.
   */
  sofZmanBiurChametzGRA(): Date {
    return this.getShaahZmanisBasedZman(5);
  }
  /**
   * Returns a 2-element array with alot (a `Date`, 72 minutes before sunrise)
   * and the length in milliseconds of one halachic hour of the resulting day.
   * Used internally by the Magen Avraham zmanim.
   * @param forceSeaLevel ignore the `useElevation` setting and use sea-level
   *  sunrise and sunset
   */
  getTemporalHour72(forceSeaLevel: boolean): [Date, number] {
    const alot72 = this.sunriseOffset(-72, false, forceSeaLevel);
    const tzeit72 = this.sunsetOffset(72, false, forceSeaLevel);
    const temporalHour = (tzeit72.getTime() - alot72.getTime()) / 12;
    return [alot72, temporalHour];
  }
  /**
   * Returns a 2-element array with alot (a `Date`, when the sun is `angle`
   * degrees below the horizon in the morning) and the length in milliseconds
   * of one halachic hour of the resulting day. Used internally by the
   * degree-based Magen Avraham zmanim.
   * @param angle degrees of solar depression below the horizon
   */
  getTemporalHourByDeg(angle: number): [Date, number] {
    const alot = this.timeAtAngle(angle, true);
    const tzeit = this.timeAtAngle(angle, false);
    const temporalHour = (tzeit.getTime() - alot.getTime()) / 12;
    return [alot, temporalHour];
  }
  /**
   * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
   * Based on the opinion of the MGA that the day is calculated from
   * dawn being fixed 72 minutes before sea-level sunrise, and nightfall is fixed
   * 72 minutes after sea-level sunset.
   */
  sofZmanShmaMGA(): Date {
    // Magen Avraham
    const [alot72, temporalHour] = this.getTemporalHour72(true);
    const offset = Math.floor(3 * temporalHour);
    return new Date(alot72.getTime() + offset);
  }
  /**
   * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
   * Based on the opinion of the MGA that the day is calculated from
   * dawn to nightfall with both being 16.1° below the horizon.
   */
  sofZmanShmaMGA16Point1(): Date {
    const [alot, temporalHour] = this.getTemporalHourByDeg(16.1);
    const offset = Math.floor(3 * temporalHour);
    return new Date(alot.getTime() + offset);
  }
  /**
   * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
   * Based on the opinion of the MGA that the day is calculated from
   * dawn to nightfall with both being 19.8° below the horizon.
   *
   * This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
   * around the equinox / equilux which calculates to 19.8° below geometric zenith.
   * https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/
   */
  sofZmanShmaMGA19Point8(): Date {
    const [alot, temporalHour] = this.getTemporalHourByDeg(19.8);
    const offset = Math.floor(3 * temporalHour);
    return new Date(alot.getTime() + offset);
  }
  /**
   * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham
   */
  sofZmanTfillaMGA(): Date {
    // Magen Avraham
    const [alot72, temporalHour] = this.getTemporalHour72(true);
    const offset = Math.floor(4 * temporalHour);
    return new Date(alot72.getTime() + offset);
  }
  /**
   * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
   * Based on the opinion of the MGA that the day is calculated from
   * dawn to nightfall with both being 16.1° below the horizon.
   */
  sofZmanTfillaMGA16Point1(): Date {
    const [alot, temporalHour] = this.getTemporalHourByDeg(16.1);
    const offset = Math.floor(4 * temporalHour);
    return new Date(alot.getTime() + offset);
  }
  /**
   * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
   * Based on the opinion of the MGA that the day is calculated from
   * dawn to nightfall with both being 19.8° below the horizon.
   *
   * This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
   * around the equinox / equilux which calculates to 19.8° below geometric zenith.
   * https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/
   */
  sofZmanTfillaMGA19Point8(): Date {
    const [alot, temporalHour] = this.getTemporalHourByDeg(19.8);
    const offset = Math.floor(4 * temporalHour);
    return new Date(alot.getTime() + offset);
  }
  /**
   * Earliest Mincha – Mincha Gedola (GRA); Sunrise plus 6.5 halachic hours.
   * If elevation is enabled, this function will include elevation in the calculation.
   *
   * This method returns *mincha gedola*, the earliest time one can pray mincha,
   * that is 6.5 shaos zmaniyos (solar hours) after sunrise or sea level sunrise
   * (depending on the `useElevation` setting), according
   * to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).
   *
   * The Ramba"m is of the opinion that it is better to delay *mincha* until
   * *mincha ketana* while the Ra"sh, Tur, GRA and others are of the
   * opinion that *mincha* can be prayed *lechatchila* starting at *mincha gedola*.
   */
  minchaGedola(): Date {
    return this.getShaahZmanisBasedZman(6.5);
  }
  /**
   * Earliest Mincha – Mincha Gedola (MGA); Sunrise plus 6.5 halachic hours.
   * If elevation is enabled, this function will include elevation in the calculation.
   *
   * This method returns the time of *mincha gedola* according to the Magen Avraham
   * with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
   * This is the earliest time to pray *mincha*.
   */
  minchaGedolaMGA(): Date {
    const [alot72, temporalHour] = this.getTemporalHour72(false);
    const offset = Math.floor(6.5 * temporalHour);
    return new Date(alot72.getTime() + offset);
  }
  /**
   * Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours.
   * If elevation is enabled, this function will include elevation in the calculation.
   *
   * This method returns *mincha ketana*, the preferred earliest time to pray *mincha* in the
   * opinion of the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others,
   * that is 9.5 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
   * (depending on the `useElevation` setting), according
   * to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).
   */
  minchaKetana(): Date {
    return this.getShaahZmanisBasedZman(9.5);
  }
  /**
   * This method returns the time of *mincha ketana* according to the Magen Avraham
   * with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
   * This is the preferred earliest time to pray *mincha* according to the opinion of
   * the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others.
   *
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  minchaKetanaMGA(): Date {
    const [alot72, temporalHour] = this.getTemporalHour72(false);
    return new Date(alot72.getTime() + Math.floor(9.5 * temporalHour));
  }
  /**
   * Plag haMincha; Sunrise plus 10.75 halachic hours.
   * If elevation is enabled, this function will include elevation in the calculation.
   */
  plagHaMincha(): Date {
    return this.getShaahZmanisBasedZman(10.75);
  }
  /**
   * Nightfall – Tzeit HaKochavim; the sun is `angle` degrees below the
   * horizon in the evening.
   *
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   * @param [angle=8.5] optional time for solar depression.
   *   Default is 8.5 degrees for 3 small stars, use 7.083 degrees for 3 medium-sized stars.
   */
  tzeit(angle = 8.5): Date {
    return this.timeAtAngle(angle, false);
  }
  /**
   * Nightfall – Tzeit HaKochavim; calculated as 72 minutes after sunset
   * (or sea-level sunset, depending on the `useElevation` setting).
   *
   * Returns a `Temporal.ZonedDateTime` with seconds precision, or `null` if
   * sunset cannot be calculated for this date and location.
   */
  tzeit72(): Temporal.ZonedDateTime | null {
    const zdt = this.useElevation
      ? this.noaa.getSunset()
      : this.noaa.getSeaLevelSunset();
    if (!zdt) {
      return null;
    }
    return zdt.add({minutes: 72});
  }
  /**
   * Alias for sunrise
   */
  neitzHaChama(): Date {
    return this.sunrise();
  }
  /**
   * Alias for sunset
   */
  shkiah(): Date {
    return this.sunset();
  }
  /**
   * Rabbeinu Tam holds that bein hashmashos is a specific time
   * between sunset and tzeis hakochavim.
   * One opinion on how to calculate this time is that
   * it is 13.5 minutes before tzies 7.083.
   * Because degree-based functions estimate the amount of light in the sky,
   * the result is not impacted by elevation.
   */
  beinHaShmashos(): Date {
    const tzeit = this.tzeit(7.083);
    const millis = tzeit.getTime();
    if (isNaN(millis)) {
      return tzeit;
    }
    return new Date(millis - 13.5 * 60 * 1000);
  }

  /**
   * Used by Molad based _zmanim_ to determine if _zmanim_ occur during the current day.
   * @return previous midnight
   */
  private getMidnightLastNight(): Temporal.ZonedDateTime {
    // reset hour, minutes, seconds and millis
    return this.plainDate.toZonedDateTime({
      timeZone: this.gloc.getTimeZone(),
    });
  }

  /**
   * Used by Molad based _zmanim_ to determine if _zmanim_ occur during the current day.
   * @return following midnight
   */
  private getMidnightTonight(): Temporal.ZonedDateTime {
    return this.plainDate.add({days: 1}).toZonedDateTime({
      timeZone: this.gloc.getTimeZone(),
    });
  }

  /**
   * Returns the Date of the _molad_ based time if it occurs on the current date. Since _Kiddush Levana_
   * can only be said during the day, there are parameters to limit it to between _alos_ and _tzais_. If
   * the time occurs between _alos_ and _tzais_, _tzais_ will be returned.
   *
   * @param moladBasedTime
   *            the _molad_ based time such as _molad_, _tchilas_ and _sof zman Kiddush Levana_
   * @param alos
   *            optional start of day to limit _molad_ times to the end of the night before or beginning of the next night.
   *            Ignored if either _alos_ or _tzais_ are null.
   * @param tzais
   *            optional end of day to limit _molad_ times to the end of the night before or beginning of the next night.
   *            Ignored if either _tzais_ or _alos_ are null
   * @param techila
   *            is it the start of _Kiddush Levana_ time or the end? If it is start roll it to the next _tzais_,
   *            and if it is the end, return the end of the previous night (_alos_ passed in). Ignored if either
   *            _alos_ or _tzais_ are null.
   * @return the _molad_ based time. If the _zman_ does not occur during the current date, `null` will be
   *         returned.
   */
  private getMoladBasedTime(
    moladBasedTime: Temporal.ZonedDateTime,
    alos: Temporal.ZonedDateTime | null,
    tzais: Temporal.ZonedDateTime | null,
    techila: boolean
  ): Temporal.ZonedDateTime | null {
    const lastMidnight: Temporal.ZonedDateTime = this.getMidnightLastNight();
    const midnightTonight: Temporal.ZonedDateTime = this.getMidnightTonight();

    if (
      Temporal.ZonedDateTime.compare(moladBasedTime, lastMidnight) < 0 ||
      Temporal.ZonedDateTime.compare(moladBasedTime, midnightTonight) > 0
    ) {
      return null; // Invalid time, bailout
    }
    if (alos === null || tzais === null) {
      return moladBasedTime.withTimeZone(this.gloc.getTimeZone()); // Not enough info to adjust
    }
    if (
      Temporal.ZonedDateTime.compare(moladBasedTime, alos) > 0 &&
      Temporal.ZonedDateTime.compare(moladBasedTime, tzais) < 0
    ) {
      // It's the daytime (after alos but before tzais)
      // get the next/prev night
      return techila ? tzais : alos;
    }
    // It's the night, the provided time is valid
    return moladBasedTime.withTimeZone(this.gloc.getTimeZone());
  }

  /**
   * Returns the latest time of Kiddush Levana according to the
   * [Maharil's](https://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin) opinion that it is calculated as
   * halfway between _molad_ and _molad_. This adds half the 29 days, 12 hours and 793 chalakim time between
   * _molad_ and _molad_ (14 days, 18 hours, 22 minutes and 666 milliseconds) to the month's _molad_.
   *
   * The _sof zman Kiddush Levana_ will be returned even if it occurs during the day, unless both `alos` and
   * `tzais` are supplied.
   *
   * @param alos
   *            the beginning of the Jewish day. If _Kidush Levana_ occurs during the day (starting at _alos_ and
   *            ending at _tzais_), the time returned will be alos. If either the _alos_ or _tzais_ parameters
   *            are null, no daytime adjustment will be made.
   * @param tzais
   *            the end of the Jewish day. If Kidush Levana occurs during the day (starting at alos and ending at
   *            tzais), the time returned will be alos. If either the alos or tzais parameters are null, no daytime
   *            adjustment will be made.
   * @return the `Temporal.ZonedDateTime` representing the moment halfway between molad and molad. If the time
   *         occurs between _alos_ and _tzais_, _alos_ will be returned. If the _zman_ will not occur on this
   *         day, `null` will be returned.
   */
  public getSofZmanKidushLevanaBetweenMoldos(
    alos: Temporal.ZonedDateTime | null = null,
    tzais: Temporal.ZonedDateTime | null = null
  ): Temporal.ZonedDateTime | null {
    const hd = this.hdate;

    // Do not calculate for impossible dates, but account for extreme cases. In the extreme case of Rapa Iti in French
    // Polynesia on Dec 2027 when kiddush Levana 3 days can be said on _Rosh Chodesh_, the sof zman Kiddush Levana
    // will be on the 12th of the Teves. In the case of Anadyr, Russia on Jan, 2071, sof zman Kiddush Levana between the
    // moldos will occur is on the night of 17th of Shevat. See Rabbi Dovid Heber's Shaarei Zmanim chapter 4 (pages 28 and 32).
    if (hd.getDate() < 11 || hd.getDate() > 16) {
      return null;
    }
    const molad = new Molad(hd.getFullYear(), hd.getMonth());
    return this.getMoladBasedTime(
      molad.getSofZmanKidushLevanaBetweenMoldos(),
      alos,
      tzais,
      false
    );
  }

  /**
   * Returns the latest time of _Kiddush Levana_ calculated as 15 days after the molad. This is the opinion of
   * the Shulchan Aruch (Orach Chaim 426). It should be noted that some opinions hold that the
   * [Rema](https://en.wikipedia.org/wiki/Moses_Isserles), who brings down the opinion of the
   * [Maharil](https://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin) of calculating
   * {@link getSofZmanKidushLevanaBetweenMoldos half way between _molad_ and _molad_}, is of
   * the opinion that the Mechaber agrees to his opinion. Also see the Aruch Hashulchan. For additional details on
   * the subject, see Rabbi Dovid Heber's very detailed write-up in Siman Daled (chapter 4) of
   * [Shaarei Zmanim](https://hebrewbooks.org/53000).
   *
   * The _sof zman Kiddush Levana_ will be returned even if it occurs during the day, unless both `alos` and
   * `tzais` are supplied.
   *
   * @param alos
   *            the beginning of the Jewish day. If either the _alos_ or _tzais_ parameters are null, no daytime
   *            adjustment will be made.
   * @param tzais
   *            the end of the Jewish day. If either the _alos_ or _tzais_ parameters are null, no daytime
   *            adjustment will be made.
   * @return the `Temporal.ZonedDateTime` representing the moment 15 days after the _molad_. If the time occurs
   *         between _alos_ and _tzais_, _alos_ will be returned. If the _zman_ will not occur on this day,
   *         `null` will be returned.
   */
  public getSofZmanKidushLevana15Days(
    alos: Temporal.ZonedDateTime | null = null,
    tzais: Temporal.ZonedDateTime | null = null
  ): Temporal.ZonedDateTime | null {
    const hd = this.hdate;

    // Do not calculate for impossible dates, but account for extreme cases. In the extreme case of Rapa Iti in
    // French Polynesia on Dec 2027 when kiddush Levana 3 days can be said on _Rosh Chodesh_, the sof zman Kiddush
    // Levana will be on the 12th of the Teves. in the case of Anadyr, Russia on Jan, 2071, sof zman kiddush levana will
    // occur after midnight on the 17th of Shevat. See Rabbi Dovid Heber's Shaarei Zmanim chapter 4 (pages 28 and 32).
    if (hd.getDate() < 11 || hd.getDate() > 17) {
      return null;
    }
    const molad = new Molad(hd.getFullYear(), hd.getMonth());
    return this.getMoladBasedTime(
      molad.getSofZmanKidushLevana15Days(),
      alos,
      tzais,
      false
    );
  }

  /**
   * Returns the earliest time of _Kiddush Levana_ according to
   * [Rabbeinu Yonah](https://en.wikipedia.org/wiki/Yonah_Gerondi)'s opinion that it can be said 3 days after the _molad_.
   * If the time of _tchilas zman Kiddush Levana_ occurs during the day (between _alos_ and _tzais_ passed to
   * this method) it will return the following _tzais_. If null is passed for either _alos_ or _tzais_, the actual
   * _tchilas zman Kiddush Levana_ will be returned, regardless of if it is during the day or not.
   *
   * @param alos
   *            the beginning of the Jewish day. If Kidush Levana occurs during the day (starting at _alos_ and ending
   *            at _tzais_), the time returned will be _tzais_. If either the _alos_ or _tzais_ parameters
   *            are null, no daytime adjustment will be made.
   * @param tzais
   *            the end of the Jewish day. If _Kidush Levana_ occurs during the day (starting at _alos_ and ending at
   *            _tzais_), the time returned will be _tzais_. If either the _alos_ or _tzais_ parameters
   *            are null, no daytime adjustment will be made.
   *
   * @return the `Temporal.ZonedDateTime` representing the moment 3 days after the molad. If the time occurs
   *         between _alos_ and _tzais_, _tzais_ will be returned. If the _zman_ will not occur on this day,
   *         `null` will be returned.
   */
  public getTchilasZmanKidushLevana3Days(
    alos: Temporal.ZonedDateTime | null = null,
    tzais: Temporal.ZonedDateTime | null = null
  ): Temporal.ZonedDateTime | null {
    const hd = this.hdate;

    // Do not calculate for impossible dates, but account for extreme cases. Tchilas zman kiddush Levana 3 days for
    // the extreme case of Rapa Iti in French Polynesia on Dec 2027 when kiddush Levana 3 days can be said on the evening
    // of the 30th, the second night of Rosh Chodesh. The 3rd day after the _molad_ will be on the 4th of the month.
    // In the case of Anadyr, Russia on Jan, 2071, when sof zman kiddush levana is on the 17th of the month, the 3rd day
    // from the molad will be on the 5th day of Shevat. See Rabbi Dovid Heber's Shaarei Zmanim chapter 4 (pages 28 and 32).
    if (hd.getDate() > 5 && hd.getDate() < 30) {
      return null;
    }

    const molad = new Molad(hd.getFullYear(), hd.getMonth());
    let zman: Temporal.ZonedDateTime | null = this.getMoladBasedTime(
      molad.getTchilasZmanKidushLevana3Days(),
      alos,
      tzais,
      true
    );

    // Get the following month's zman kiddush Levana for the extreme case of Rapa Iti in French Polynesia on Dec 2027 when
    // kiddush Levana can be said on Rosh Chodesh (the evening of the 30th). See Rabbi Dovid Heber's Shaarei Zmanim chapter 4 (page 32)
    if (zman === null && hd.getDate() === 30) {
      const hd2 = hd.add(1, 'week');
      const molad2 = new Molad(hd2.getFullYear(), hd2.getMonth());
      zman = this.getMoladBasedTime(
        molad2.getTchilasZmanKidushLevana3Days(),
        null,
        null,
        true
      );
    }

    return zman;
  }

  /**
   * Returns the point in time of the _Molad_, if it occurs on this date. For the traditional day of week, hour,
   * minute and chalakim, see {@link Molad} and its {@link Molad.render} method.
   *
   * @return the `Temporal.ZonedDateTime` representing the moment of the molad. If the _molad_ does not occur on
   *         this day, `null` will be returned.
   */
  public getZmanMolad(): Temporal.ZonedDateTime | null {
    const hd = this.hdate;

    // Optimize to not calculate for impossible dates, but account for extreme cases. The molad in the extreme case of Rapa
    // Iti in French Polynesia on Dec 2027 occurs on the night of the 27th of Kislev. In the case of Anadyr, Russia on
    // Jan 2071, the molad will be on the 2nd day of Shevat. See Rabbi Dovid Heber's Shaarei Zmanim chapter 4 (pages 28 and 32).
    if (hd.getDate() > 2 && hd.getDate() < 27) {
      return null;
    }

    const molad = new Molad(hd.getFullYear(), hd.getMonth());
    let zman: Temporal.ZonedDateTime | null = this.getMoladBasedTime(
      molad.getInstant(),
      null,
      null,
      true
    );

    // deal with molad that happens on the end of the previous month
    if (zman === null && hd.getDate() > 26) {
      const hd2 = hd.add(1, 'week');
      const molad2 = new Molad(hd2.getFullYear(), hd2.getMonth());
      zman = this.getMoladBasedTime(molad2.getInstant(), null, null, true);
    }
    return zman;
  }

  /**
   * Returns the earliest time of _Kiddush Levana_ according to the opinions that it should not be said until 7
   * days after the _molad_. The time will be returned even if it occurs during the day when _Kiddush Levana_
   * can't be recited, unless both `alos` and `tzais` are supplied.
   *
   * @param alos
   *            the beginning of the Jewish day. If _Kidush Levana_ occurs during the day (starting at _alos_ and
   *            ending at _tzais_), the time returned will be _tzais_. If either the _alos_ or _tzais_ parameters
   *            are null, no daytime adjustment will be made.
   * @param tzais
   *            the end of the Jewish day. If either the _alos_ or _tzais_ parameters are null, no daytime
   *            adjustment will be made.
   * @return the `Temporal.ZonedDateTime` representing the moment 7 days after the molad. If the _zman_
   *         will not occur on this day, `null` will be returned.
   */
  public getTchilasZmanKidushLevana7Days(
    alos: Temporal.ZonedDateTime | null = null,
    tzais: Temporal.ZonedDateTime | null = null
  ): Temporal.ZonedDateTime | null {
    const hd = this.hdate;

    // Optimize to not calculate for impossible dates, but account for extreme cases. Tchilas zman kiddush Levana 7 days for
    // the extreme case of Rapa Iti in French Polynesia on Jan 2028 (when kiddush Levana 3 days can be said on the evening
    // of the 30th, the second night of Rosh Chodesh), the 7th day after the molad will be on the 4th of the month.
    // In the case of Anadyr, Russia on Jan, 2071, when sof zman kiddush levana is on the 17th of the month, the 7th day
    // from the molad will be on the 9th day of Shevat. See Rabbi Dovid Heber's Shaarei Zmanim chapter 4 (pages 28 and 32).
    if (hd.getDate() < 4 || hd.getDate() > 9) {
      return null;
    }
    const molad = new Molad(hd.getFullYear(), hd.getMonth());
    return this.getMoladBasedTime(
      molad.getTchilasZmanKidushLevana7Days(),
      alos,
      tzais,
      true
    );
  }

  /**
   * A method that returns the [Baal Hatanya](https://en.wikipedia.org/wiki/Shneur_Zalman_of_Liadi)'s
   * _netz amiti_ (sunrise) without
   * elevation adjustment. This forms the base for the Baal Hatanya's dawn-based calculations that are
   * calculated as a dip below the horizon before sunrise.
   *
   * According to the Baal Hatanya, _netz amiti_, or true (halachic) sunrise, is when the top of the sun's
   * disk is visible at an elevation similar to the mountains of Eretz Yisrael. The time is calculated as the point at which
   * the center of the sun's disk is 1.583° below the horizon. This degree-based calculation can be found in Rabbi Shalom
   * DovBer Levine's commentary on
   * [The Baal Hatanya's Seder Hachnasas Shabbos](https://www.chabadlibrary.org/books/pdf/Seder-Hachnosas-Shabbos.pdf).
   * From an elevation of 546 meters, the top of [Har Hacarmel](https://en.wikipedia.org/wiki/Mount_Carmel),
   * the sun disappears when it is 1° 35' or 1.583° below the sea level horizon. This in turn is based on the Gemara
   * [Shabbos 35a](https://hebrewbooks.org/shas.aspx?mesechta=2&daf=35). There are other opinions brought down by
   * Rabbi Levine, including Rabbi Yosef Yitzchok Feigelstock who calculates it as the degrees below the horizon 4 minutes after
   * sunset in Yerushalayim (on the equinox). That is brought down as 1.583°. This is identical to the 1° 35' _zman_
   * and is probably a typo and should be 1.683°. These calculations are used by most
   * [Chabad](https://en.wikipedia.org/wiki/Chabad) calendars that use the Baal Hatanya's _zmanim_. See
   * [About Our Zmanim Calculations @ Chabad.org](https://www.chabad.org/library/article_cdo/aid/3209349/jewish/About-Our-Zmanim-Calculations.htm).
   *
   * Note: _netz amiti_ is used only for calculating certain _zmanim_, and is intentionally unpublished. For
   * practical purposes, daytime _mitzvos_ like _shofar_ and _lulav_ should not be done until after the
   * published time for _netz_ / sunrise.
   *
   * @return the exact sea level _netz amiti_ (sunrise) time. If the calculation can't be
   *         computed, such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
   *         where it does not set, `null` will be returned.
   */
  private getSunriseBaalHatanya(): number {
    return this.sunriseMillis(ZENITH_1_POINT_583, true);
  }

  /**
   * A method that returns the [Baal Hatanya](https://en.wikipedia.org/wiki/Shneur_Zalman_of_Liadi)'s
   * _shkiah amiti_ (sunset) without
   * elevation adjustment. This forms the base for the Baal Hatanya's dusk-based calculations that are calculated
   * as a dip below the horizon after sunset.
   *
   * According to the Baal Hatanya, _shkiah amiti_, true (_halachic_) sunset, is when the top of the
   * sun's disk disappears from view at an elevation similar to the mountains of _Eretz Yisrael_.
   * This time is calculated as the point at which the center of the sun's disk is 1.583 degrees below the horizon.
   *
   * Note: _shkiah amiti_ is used only for calculating certain _zmanim_, and is intentionally unpublished. For
   * practical purposes, all daytime mitzvos should be completed before the published time for _shkiah_ / sunset.
   *
   * For further explanation of the calculations used for the Baal Hatanya's _zmanim_ in this library, see
   * [About Our Zmanim Calculations @ Chabad.org](https://www.chabad.org/library/article_cdo/aid/3209349/jewish/About-Our-Zmanim-Calculations.htm).
   *
   * @return the exact sea level _shkiah amiti_ (sunset) time. If the calculation
   *         can't be computed, such as in the Arctic Circle where there is at least one day a year where the sun does not
   *         rise, and one where it does not set, `null` will be returned.
   */
  private getSunsetBaalHatanya(): number {
    return this.sunsetMillis(ZENITH_1_POINT_583, true);
  }

  /**
   * Returns the [Baal Hatanya](https://en.wikipedia.org/wiki/Shneur_Zalman_of_Liadi)'s _alos_
   * (dawn) calculated as the time when the sun is 16.9° below the eastern geometric horizon
   * before {@link sunrise}.
   *
   * The zenith of 16.9° below is based on the calculation that the time between dawn
   * and _netz amiti_ (sunrise) is 72 minutes, the time that it takes to walk 4 mil at 18 minutes
   * a mil ([Rambam](https://en.wikipedia.org/wiki/Maimonides) and others). The sun's position at 72
   * minutes before _netz amiti_ (sunrise) in Jerusalem
   * [around the equinox / equilux](https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/)
   * is 16.9° below geometric zenith.
   *
   * @return the `Date` of dawn. If the calculation can't be computed, such as in northern and southern
   *         locations even south of the Arctic Circle and north of the Antarctic Circle where the sun may not reach
   *         low enough below the horizon for this calculation, an `Invalid Date` will be returned.
   */
  public alosBaalHatanya(): Date {
    return this.timeAtAngle(16.9, true);
  }

  private getShaahZmanisBaalHatanya(hours: number): Date {
    return millisToDate(
      this.getShaahZmanisBasedZmanMillis(
        this.getSunriseBaalHatanya(),
        this.getSunsetBaalHatanya(),
        hours
      )
    );
  }

  /**
   * This method returns the latest _zman krias shema_ (time to recite Shema in the morning). This time is 3
   * _shaos zmaniyos_ (solar hours) after _netz amiti_ (sunrise), based on the opinion of the Baal Hatanya
   * that the day is calculated from _netz amiti_ (sunrise) to _shkiah amiti_ (sunset).
   *
   * @return the `Date` of the latest _zman shema_ according to the Baal Hatanya. If the calculation
   *         can't be computed, such as in the Arctic Circle where there is at least one day a year where the sun does
   *         not rise and one where it does not set, an `Invalid Date` will be returned.
   */
  public sofZmanShmaBaalHatanya(): Date {
    return this.getShaahZmanisBaalHatanya(3);
  }

  /**
   * This method returns the latest _zman tfilah_ (time to recite the morning prayers). This time is 4
   * halachic hours into the day, based on the opinion of the Baal Hatanya that the day is
   * calculated from _netz amiti_ (sunrise) to _shkiah amiti_ (sunset).
   *
   * @return the `Date` of the latest _zman tfilah_. If the calculation can't be computed, such as in
   *         the Arctic Circle where there is at least one day a year where the sun does not rise and one where it does
   *         not set, an `Invalid Date` will be returned.
   */
  public sofZmanTfilaBaalHatanya(): Date {
    return this.getShaahZmanisBaalHatanya(4);
  }

  /**
   * This method returns the time of _mincha gedola_. _Mincha gedola_ is the earliest time one can pray
   * _mincha_. The [Rambam](https://en.wikipedia.org/wiki/Maimonides) is of the opinion that it is
   * better to delay _mincha_ until {@link minchaKetanaBaalHatanya | _mincha ketana_} while the
   * [Ra"sh](https://en.wikipedia.org/wiki/Asher_ben_Jehiel),
   * [Tur](https://en.wikipedia.org/wiki/Jacob_ben_Asher),
   * [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon) and others are of the opinion that _mincha_ can be prayed
   * _lechatchila_ starting at _mincha gedola_. This is calculated as 6.5 sea level solar hours after
   * _netz amiti_ (sunrise), based on the opinion of the Baal Hatanya that the day is calculated from
   * _netz amiti_ (sunrise) to _shkiah amiti_ (sunset).
   * @return the `Date` of the time of _mincha gedola_ according to the Baal Hatanya. If the calculation
   *         can't be computed, such as in the Arctic Circle where there is at least one day a year where the sun does not rise
   *         and one where it does not set, an `Invalid Date` will be returned.
   */
  public minchaGedolaBaalHatanya(): Date {
    return this.getShaahZmanisBaalHatanya(6.5);
  }

  /**
   * This method returns the time of _mincha ketana_. This is the preferred earliest time to pray
   * _mincha_ in the opinion of the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others.
   * For more information on this see the documentation on {@link minchaGedolaBaalHatanya | _mincha gedola_}.
   * This is calculated as 9.5 sea level solar hours after _netz amiti_ (sunrise), based on the opinion of
   * the Baal Hatanya that the day is calculated from _netz amiti_ (sunrise) to _shkiah amiti_ (sunset).
   *
   * @return the `Date` of the time of _mincha ketana_. If the calculation can't be computed, such as
   *         in the Arctic Circle where there is at least one day a year where the sun does not rise and one where it
   *         does not set, an `Invalid Date` will be returned.
   */
  public minchaKetanaBaalHatanya(): Date {
    return this.getShaahZmanisBaalHatanya(9.5);
  }

  /**
   * This method returns the time of _plag hamincha_. This is calculated as 10.75 sea level solar hours
   * after _netz amiti_ (sunrise), based on the opinion of the Baal Hatanya that the day is calculated
   * from _netz amiti_ (sunrise) to _shkiah amiti_ (sunset).
   *
   * @return the `Date` of the time of _plag hamincha_ according to the Baal Hatanya. If the calculation
   *         can't be computed, such as in the Arctic Circle where there is at least one day a year where the sun does
   *         not rise and one where it does not set, an `Invalid Date` will be returned.
   */
  public plagHaminchaBaalHatanya(): Date {
    return this.getShaahZmanisBaalHatanya(10.75);
  }

  /**
   * A method that returns _tzais_ (nightfall) when the sun is 6° below the western geometric horizon
   * (90°) after {@link sunset}. This is the time the Baal Hatanya calls _shkiah amiti_ plus the
   * interval it takes the sun to descend a further 6°.
   *
   * @return the `Date` of nightfall. If the calculation can't be computed, such as in northern and southern
   *         locations — even south of the Arctic Circle and north of the Antarctic Circle — where the sun may not
   *         reach low enough below the horizon for this calculation, an `Invalid Date` will be returned.
   */
  public tzaisBaalHatanya(): Date {
    return this.timeAtAngle(6, false);
  }

  /**
   * Uses timeFormat to return a date like '20:34'.
   * Returns `XX:XX` if the date is invalid.
   * @param dt the time to format
   * @param timeFormat formatter to use, e.g. from
   *   {@link Location.getTimeFormatter}
   */
  static formatTime(dt: Date, timeFormat: Intl.DateTimeFormat): string {
    if (isNaN(dt.getTime())) {
      return 'XX:XX'; // Invalid Date
    }
    const time = timeFormat.format(dt);
    // Rewrite the h24 midnight ("24:15") that some locales produce. Checking
    // the two leading characters avoids the throwaway array that split(':')
    // allocated on every event; this runs once per timed event, and the
    // Intl.format() call above is already the expensive part.
    if (
      time.charCodeAt(0) === 0x32 && // '2'
      time.charCodeAt(1) === 0x34 && // '4'
      time.charCodeAt(2) === 0x3a // ':'
    ) {
      return '00' + time.substring(2);
    }
    return time;
  }

  /**
   * Discards seconds, rounding to nearest minute.
   * @param dt
   */
  static roundTime(dt: Date): Date {
    const millis = dt.getTime();
    if (isNaN(millis)) {
      return dt;
    }
    // Round up to next minute if needed
    const millisOnly = dt.getMilliseconds();
    const seconds = dt.getSeconds();
    if (seconds === 0 && millisOnly === 0) {
      return dt;
    }
    const secAndMillis = seconds * 1000 + millisOnly;
    const delta = secAndMillis >= 30000 ? 60000 - secAndMillis : -1 * secAndMillis;
    return new Date(millis + delta);
  }

  /**
   * Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")
   * @param tzid
   * @param date
   */
  static timeZoneOffset(tzid: string, date: Date): string {
    const offset = getTimezoneOffset(tzid, date);
    const offsetAbs = Math.abs(offset);
    const hours = Math.floor(offsetAbs / 60);
    const minutes = offsetAbs % 60;
    return (offset < 0 ? '+' : '-') + pad2(hours) + ':' + pad2(minutes);
  }

  /**
   * Returns a string like "2022-04-01T13:06:00-11:00"
   * @param tzid
   * @param date
   */
  static formatISOWithTimeZone(tzid: string, date: Date): string {
    if (isNaN(date.getTime())) {
      return '0000-00-00T00:00:00Z';
    }
    return (
      getPseudoISO(tzid, date).substring(0, 19) + Zmanim.timeZoneOffset(tzid, date)
    );
  }

  /**
   * Returns sunrise + `offset` minutes (either positive or negative).
   * If elevation is enabled, this function will include elevation in the calculation
   *  unless `forceSeaLevel` is `true`.
   * @param offset minutes
   * @param roundMinute round time to nearest minute (default true)
   * @param forceSeaLevel use sea-level sunrise (default false)
   */
  sunriseOffset(offset: number, roundMinute = true, forceSeaLevel = false): Date {
    const sunrise = forceSeaLevel ? this.seaLevelSunrise() : this.sunrise();
    if (isNaN(sunrise.getTime())) {
      return sunrise;
    }
    if (roundMinute) {
      // For positive offsets only, round up to next minute if needed
      if (offset > 0 && sunrise.getSeconds() >= 30) {
        offset++;
      }
      sunrise.setSeconds(0, 0);
    }
    return new Date(sunrise.getTime() + offset * 60 * 1000);
  }

  /**
   * Returns sunset + `offset` minutes (either positive or negative).
   * If elevation is enabled, this function will include elevation in the calculation
   *  unless `forceSeaLevel` is `true`.
   * @param offset minutes
   * @param roundMinute round time to nearest minute (default true)
   * @param forceSeaLevel use sea-level sunset (default false)
   */
  sunsetOffset(offset: number, roundMinute = true, forceSeaLevel = false): Date {
    const sunset = forceSeaLevel ? this.seaLevelSunset() : this.sunset();
    if (isNaN(sunset.getTime())) {
      return sunset;
    }
    if (roundMinute) {
      // For Havdalah only, round up to next minute if needed
      if (offset > 0 && sunset.getSeconds() >= 30) {
        offset++;
      }
      sunset.setSeconds(0, 0);
    }
    return new Date(sunset.getTime() + offset * 60 * 1000);
  }
  /**
   * Returns the Hebrew date relative to the specified location and Gregorian date,
   * taking into consideration whether the time is before or after sunset.
   *
   * For example, if the given date and is `2024-09-22T10:35` (before sunset), and
   * sunset for the specified location is **19:04**, then this function would
   * return a Hebrew date of `19th of Elul, 5784`.
   * If the given date is the same Gregorian day after sunset
   * (for example `2024-09-22T20:07`), this function would return a
   * Hebrew date of `20th of Elul, 5784`.
   * @example
   * import {GeoLocation, Zmanim, HDate} from '@hebcal/core';
   * const latitude = 48.85341;
   * const longitude = 2.3488;
   * const timezone = 'Europe/Paris';
   * const gloc = new GeoLocation(null, latitude, longitude, 0, timezone);
   * const before = Zmanim.makeSunsetAwareHDate(gloc, new Date('2024-09-22T17:38:46.123Z'), false);
   * console.log(before.toString()); // '19 Elul 5784'
   * const after = Zmanim.makeSunsetAwareHDate(gloc, new Date('2024-09-22T23:45:18.345Z'), false);
   * console.log(after.toString()); // '20 Elul 5784'
   */
  static makeSunsetAwareHDate(
    gloc: GeoLocation,
    date: Date,
    useElevation: boolean
  ): HDate {
    const zmanim = new Zmanim(gloc, date, useElevation);
    const sunset = zmanim.sunset();
    let hd = new HDate(date);
    const sunsetMillis = sunset.getTime();
    if (isNaN(sunsetMillis)) {
      return hd;
    }
    if (date.getTime() >= sunsetMillis) {
      hd = hd.next();
    }
    return hd;
  }
}
