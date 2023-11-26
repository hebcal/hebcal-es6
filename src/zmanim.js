import {HDate} from './hdate';
import {getTimezoneOffset, getPseudoISO} from './getTimezoneOffset';
import {greg} from '@hebcal/hdate';
import {throwTypeError} from './throwTypeError';
import 'temporal-polyfill/global';
import {NOAACalculator} from '@hebcal/noaa';

/**
 * @private
 * @param {number} number
 * @return {string}
 */
function pad2(number) {
  if (number < 10) {
    return '0' + number;
  }
  return String(number);
}

/**
 * @private
 * @param {Temporal.ZonedDateTime} zdt
 * @return {Date}
 */
function zdtToDate(zdt) {
  if (zdt === null) {
    return new Date(NaN);
  }
  const res = new Date(zdt.epochMilliseconds);
  res.setMilliseconds(0);
  return res;
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
 * const {GeoLocation, Zmanim} = require('@hebcal/core');
 * const latitude = 41.822232;
 * const longitude = -71.448292;
 * const tzid = 'America/New_York';
 * const friday = new Date(2023, 8, 8);
 * const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
 * const zmanim = new Zmanim(gloc, friday, false);
 * const candleLighting = zmanim.sunsetOffset(-18, true);
 * const timeStr = Zmanim.formatISOWithTimeZone(tzid, candleLighting);
 */
export class Zmanim {
  /**
   * Initialize a Zmanim instance.
   * @param {GeoLocation} gloc GeoLocation including latitude, longitude, and timezone
   * @param {Date|HDate} date Regular or Hebrew Date. If `date` is a regular `Date`,
   *    hours, minutes, seconds and milliseconds are ignored.
   * @param {boolean} useElevation use elevation for calculations (default `false`).
   *    If `true`, use elevation to affect the calculation of all sunrise/sunset based
   *    zmanim. Note: there are some zmanim such as degree-based zmanim that are driven
   *    by the amount of light in the sky and are not impacted by elevation.
   *    These zmanim intentionally do not support elevation adjustment.
   */
  constructor(gloc, date, useElevation) {
    const dt = greg.isDate(date) ? date :
        HDate.isHDate(date) ? date.greg() :
        throwTypeError(`invalid date: ${date}`);
    this.date = dt;
    this.gloc = gloc;
    const plainDate = Temporal.PlainDate.from({
      year: dt.getFullYear(),
      month: dt.getMonth() + 1,
      day: dt.getDate()});
    this.noaa = new NOAACalculator(gloc, plainDate);
    this.useElevation = Boolean(useElevation);
  }
  /**
   * Convenience function to get the time when sun is above or below the horizon
   * for a certain angle (in degrees).
   * @param {number} angle
   * @param {boolean} rising
   * @return {Date}
   */
  timeAtAngle(angle, rising) {
    const offsetZenith = 90 + angle;
    const zdt = rising ? this.noaa.getSunriseOffsetByDegrees(offsetZenith) :
        this.noaa.getSunsetOffsetByDegrees(offsetZenith);
    return zdtToDate(zdt);
  }
  /**
   * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
   * @return {Date}
   */
  sunrise() {
    const zdt = this.useElevation ? this.noaa.getSunrise() : this.noaa.getSeaLevelSunrise();
    return zdtToDate(zdt);
  }
  /**
   * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
   * @return {Date}
   */
  seaLevelSunrise() {
    const zdt = this.noaa.getSeaLevelSunrise();
    return zdtToDate(zdt);
  }
  /**
   * When the upper edge of the Sun disappears below the horizon (0.833° below horizon)
   * @return {Date}
   */
  sunset() {
    const zdt = this.useElevation ? this.noaa.getSunset() : this.noaa.getSeaLevelSunset();
    return zdtToDate(zdt);
  }
  /**
   * When the upper edge of the Sun disappears below the horizon (0.833° below horizon)
   * @return {Date}
   */
  seaLevelSunset() {
    const zdt = this.noaa.getSeaLevelSunset();
    return zdtToDate(zdt);
  }
  /**
   * Civil dawn; Sun is 6° below the horizon in the morning
   * @return {Date}
   */
  dawn() {
    const zdt = this.noaa.getBeginCivilTwilight();
    return zdtToDate(zdt);
  }
  /**
   * Civil dusk; Sun is 6° below the horizon in the evening
   * @return {Date}
   */
  dusk() {
    const zdt = this.noaa.getEndCivilTwilight();
    return zdtToDate(zdt);
  }
  /** @return {Date} */
  gregEve() {
    const prev = new Date(this.date);
    prev.setDate(prev.getDate() - 1);
    const zman = new Zmanim(this.gloc, prev, this.useElevation);
    return zman.sunset();
  }
  /**
   * @private
   * @return {number}
   */
  nightHour() {
    return (this.sunrise() - this.gregEve()) / 12; // ms in hour
  }
  /**
   * Midday – Chatzot; Sunrise plus 6 halachic hours
   * @return {Date}
   */
  chatzot() {
    const zdt = this.noaa.getSunTransit();
    return zdtToDate(zdt);
  }
  /**
   * Midnight – Chatzot; Sunset plus 6 halachic hours
   * @return {Date}
   */
  chatzotNight() {
    return new Date(this.sunrise().getTime() - (this.nightHour() * 6));
  }
  /**
   * Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning
   * @return {Date}
   */
  alotHaShachar() {
    return this.timeAtAngle(16.1, true);
  }
  /**
   * Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning
   * @return {Date}
   */
  misheyakir() {
    return this.timeAtAngle(11.5, true);
  }
  /**
   * Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning
   * @return {Date}
   */
  misheyakirMachmir() {
    return this.timeAtAngle(10.2, true);
  }
  /**
   * Utility method for using elevation-aware sunrise/sunset
   * @private
   * @param {number} hours
   * @return {Date}
   */
  getShaahZmanisBasedZman(hours) {
    const startOfDay = this.noaa.getSunrise();
    const endOfDay = this.noaa.getSunset();
    const temporalHour = this.noaa.getTemporalHour(startOfDay, endOfDay);
    const offset = Math.round(temporalHour * hours);
    const zdt = NOAACalculator.getTimeOffset(startOfDay, offset);
    return zdtToDate(zdt);
  }
  /**
   * Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra
   * @return {Date}
   */
  sofZmanShma() { // Gra
    return this.getShaahZmanisBasedZman(3);
  }
  /**
   * Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra
   * @return {Date}
   */
  sofZmanTfilla() { // Gra
    return this.getShaahZmanisBasedZman(4);
  }
  /**
   * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham
   * @return {Date}
   */
  sofZmanShmaMGA() { // Magen Avraham
    const alot72 = this.sunriseOffset(-72, false, true);
    const tzeit72 = this.sunsetOffset(72, false, true);
    const temporalHour = (tzeit72 - alot72) / 12; // ms in hour
    return new Date(alot72.getTime() + (3 * temporalHour));
  }
  /**
   * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham
   * @return {Date}
   */
  sofZmanTfillaMGA() { // Magen Avraham
    const alot72 = this.sunriseOffset(-72, false, true);
    const tzeit72 = this.sunsetOffset(72, false, true);
    const temporalHour = (tzeit72 - alot72) / 12; // ms in hour
    return new Date(alot72.getTime() + (4 * temporalHour));
  }
  /**
   * Earliest Mincha – Mincha Gedola; Sunrise plus 6.5 halachic hours
   * @return {Date}
   */
  minchaGedola() {
    return this.getShaahZmanisBasedZman(6.5);
  }
  /**
   * Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours
   * @return {Date}
   */
  minchaKetana() {
    return this.getShaahZmanisBasedZman(9.5);
  }
  /**
   * Plag haMincha; Sunrise plus 10.75 halachic hours
   * @return {Date}
   */
  plagHaMincha() {
    return this.getShaahZmanisBasedZman(10.75);
  }
  /**
   * @param {number} [angle=8.5] optional time for solar depression.
   *   Default is 8.5 degrees for 3 small stars, use 7.083 degrees for 3 medium-sized stars.
   * @return {Date}
   */
  tzeit(angle=8.5) {
    return this.timeAtAngle(angle, false);
  }
  /**
   * Alias for sunrise
   * @return {Date}
   */
  neitzHaChama() {
    return this.sunrise();
  }
  /**
   * Alias for sunset
   * @return {Date}
   */
  shkiah() {
    return this.sunset();
  }

  /**
   * Uses timeFormat to return a date like '20:34'
   * @param {Date} dt
   * @param {Intl.DateTimeFormat} timeFormat
   * @return {string}
   */
  static formatTime(dt, timeFormat) {
    const time = timeFormat.format(dt);
    const hm = time.split(':');
    if (hm[0] === '24') {
      return '00:' + hm[1];
    }
    return time;
  }

  /**
   * Discards seconds, rounding to nearest minute.
   * @param {Date} dt
   * @return {Date}
   */
  static roundTime(dt) {
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
    const secAndMillis = (seconds * 1000) + millisOnly;
    const delta = (secAndMillis >= 30000) ? 60000 - secAndMillis : -1 * secAndMillis;
    return new Date(millis + delta);
  }

  /**
   * Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")
   * @param {string} tzid
   * @param {Date} date
   * @return {string}
   */
  static timeZoneOffset(tzid, date) {
    const offset = getTimezoneOffset(tzid, date);
    const offsetAbs = Math.abs(offset);
    const hours = Math.floor(offsetAbs / 60);
    const minutes = offsetAbs % 60;
    return (offset < 0 ? '+' : '-') + pad2(hours) + ':' + pad2(minutes);
  }

  /**
   * Returns a string like "2022-04-01T13:06:00-11:00"
   * @param {string} tzid
   * @param {Date} date
   * @return {string}
   */
  static formatISOWithTimeZone(tzid, date) {
    if (isNaN(date.getTime())) {
      return null;
    }
    return getPseudoISO(tzid, date).substring(0, 19) + Zmanim.timeZoneOffset(tzid, date);
  }

  /**
   * Returns sunrise + `offset` minutes (either positive or negative).
   * @param {number} offset minutes
   * @param {boolean} roundMinute round time to nearest minute (default true)
   * @param {boolean} forceSeaLevel use sea-level sunrise (default false)
   * @return {Date}
   */
  sunriseOffset(offset, roundMinute=true, forceSeaLevel=false) {
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
    return new Date(sunrise.getTime() + (offset * 60 * 1000));
  }

  /**
   * Returns sunset + `offset` minutes (either positive or negative).
   * @param {number} offset minutes
   * @param {boolean} roundMinute round time to nearest minute (default true)
   * @param {boolean} forceSeaLevel use sea-level sunset (default false)
   * @return {Date}
   */
  sunsetOffset(offset, roundMinute=true, forceSeaLevel=false) {
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
    return new Date(sunset.getTime() + (offset * 60 * 1000));
  }
}
