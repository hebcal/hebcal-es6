/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {
  getBirthdayHD,
  getYahrzeitHD,
  abs2greg,
  months,
  HDate,
  Locale,
} from '@hebcal/hdate';
import './locale'; // Adds Hebrew and Ashkenazic translations
import {CalOptions} from './CalOptions';
import {version as pkgVersion} from './pkgVersion';
import {DailyLearning} from './DailyLearning';
import {HebrewDateEvent} from './HebrewDateEvent';
import {ParshaEvent} from './ParshaEvent';
import {
  makeCandleEvent,
  makeFastStartEnd,
  makeWeekdayChanukahCandleLighting,
} from './candles';
import {TimedEvent, HavdalahEvent} from './TimedEvent';
import {Event, flags} from './event';
import {Sedra, getSedra_} from './sedra';
import {hallel_} from './hallel';
import {getHolidaysForYear_, HolidayYearMap} from './holidays';
import {MevarchimChodeshEvent} from './MevarchimChodeshEvent';
import {HolidayEvent} from './HolidayEvent';
import {Location} from './location';
import {Molad, MoladEvent} from './molad';
import {OmerEvent} from './omer';
import {reformatTimeStr} from './reformatTimeStr';
import {TachanunResult, tachanun_} from './tachanun';
import {Zmanim} from './zmanim';
import {getStartAndEnd} from './getStartAndEnd';

const FRI = 5;
const SAT = 6;

const NISAN = months.NISAN;
const SIVAN = months.SIVAN;
const ELUL = months.ELUL;
const TISHREI = months.TISHREI;

const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
const CHUL_ONLY = flags.CHUL_ONLY;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MINOR_FAST = flags.MINOR_FAST;
const SPECIAL_SHABBAT = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY = flags.MODERN_HOLIDAY;
const MAJOR_FAST = flags.MAJOR_FAST;
const ROSH_CHODESH = flags.ROSH_CHODESH;
const PARSHA_HASHAVUA = flags.PARSHA_HASHAVUA;
const DAF_YOMI = flags.DAF_YOMI;
const MISHNA_YOMI = flags.MISHNA_YOMI;
const NACH_YOMI = flags.NACH_YOMI;
const YERUSHALMI_YOMI = flags.YERUSHALMI_YOMI;
const OMER_COUNT = flags.OMER_COUNT;
const SHABBAT_MEVARCHIM = flags.SHABBAT_MEVARCHIM;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;
const YOM_KIPPUR_KATAN = flags.YOM_KIPPUR_KATAN;

const unrecognizedAlreadyWarned = new Set();
type StringIntMap = {
  [x: string]: number;
};
const RECOGNIZED_OPTIONS: StringIntMap = {
  location: 1,
  year: 1,
  isHebrewYear: 1,
  month: 1,
  numYears: 1,
  start: 1,
  end: 1,
  candlelighting: 1,
  candleLightingMins: 1,
  havdalahMins: 1,
  havdalahDeg: 1,
  fastEndDeg: 1,
  sedrot: 1,
  il: 1,
  noMinorFast: 1,
  noModern: 1,
  shabbatMevarchim: 1,
  noRoshChodesh: 1,
  noSpecialShabbat: 1,
  noHolidays: 1,
  omer: 1,
  molad: 1,
  ashkenazi: 1,
  locale: 1,
  addHebrewDates: 1,
  addHebrewDatesForEvents: 1,
  appendHebrewToSubject: 1,
  mask: 1,
  yomKippurKatan: 1,
  hour12: 1,
  dailyLearning: 1,
  useElevation: 1,
};

/**
 * @private
 */
function warnUnrecognizedOptions(options: CalOptions) {
  for (const k of Object.keys(options)) {
    if (
      typeof RECOGNIZED_OPTIONS[k] === 'undefined' &&
      !unrecognizedAlreadyWarned.has(k)
    ) {
      console.warn(`Ignoring unrecognized HebrewCalendar option: ${k}`);
      unrecognizedAlreadyWarned.add(k);
    }
  }
}

const israelCityOffset: StringIntMap = {
  Jerusalem: 40,
  Haifa: 30,
  "Zikhron Ya'aqov": 30,
  "Zikhron Ya'akov": 30,
  'Zikhron Yaakov': 30,
  "Zichron Ya'akov": 30,
  'Zichron Yaakov': 30,
};

const geoIdCandleOffset: StringIntMap = {
  '281184': 40, // Jerusalem
  '294801': 30, // Haifa
  '293067': 30, // Zikhron Yaakov
};

/**
 * @private
 * @constant
 * This calculation is based on the position of the sun 36 minutes after sunset in Jerusalem
 * around the equinox / equilux, which is 8.5° below geometric zenith.
 * The Ohr Meir considers this the time that 3 small stars are visible,
 * which is later than the required 3 medium stars.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ZmanimCalendar.html#ZENITH_8_POINT_5}
 */
const TZEIT_3SMALL_STARS = 8.5;

/**
 * @private
 * @constant
 * This calculation is based on observation of 3 medium sized stars by Dr. Baruch Cohen
 * in his calendar published in in 1899 in Strasbourg, France.
 * This calculates to 7.0833333° below geometric zenith.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ComplexZmanimCalendar.html#ZENITH_7_POINT_083}
 */
const TZEIT_3MEDIUM_STARS = 7.0833333;

/**
 * Modifies options in-place
 * @private
 */
function checkCandleOptions(options: CalOptions) {
  if (!options.candlelighting) {
    return;
  }
  const location = options.location;
  if (typeof location === 'undefined' || !(location instanceof Location)) {
    throw new TypeError(
      'options.candlelighting requires valid options.location'
    );
  }
  if (
    typeof options.havdalahMins === 'number' &&
    typeof options.havdalahDeg === 'number'
  ) {
    throw new TypeError(
      'options.havdalahMins and options.havdalahDeg are mutually exclusive'
    );
  }

  let min = Number(options.candleLightingMins) || 18;
  if (location.getIsrael() && Math.abs(min) === 18) {
    min = overrideIsraelCandleMins(location, min);
  }
  options.candleLightingMins = -1 * Math.abs(min);

  if (typeof options.havdalahMins === 'number') {
    options.havdalahMins = Math.abs(options.havdalahMins);
  } else if (typeof options.havdalahDeg === 'number') {
    options.havdalahDeg = Math.abs(options.havdalahDeg);
  } else {
    options.havdalahDeg = TZEIT_3SMALL_STARS;
  }
  if (typeof options.fastEndDeg !== 'number') {
    options.fastEndDeg = TZEIT_3MEDIUM_STARS;
  }
}

function overrideIsraelCandleMins(location: Location, min: number) {
  const geoid = location.getGeoId();
  if (geoid) {
    const offset = geoIdCandleOffset[geoid];
    if (typeof offset === 'number') {
      return offset;
    }
  }
  const shortName = location.getShortName();
  if (shortName) {
    const offset = israelCityOffset[shortName];
    if (typeof offset === 'number') {
      return offset;
    }
  }
  return min;
}

/**
 * Mask to filter Holiday array
 * @private
 */
function getMaskFromOptions(options: CalOptions): number {
  if (typeof options.mask === 'number') {
    return setOptionsFromMask(options);
  }
  const il = options.il || options.location?.getIsrael() || false;
  let mask = 0;

  // default options
  if (!options.noHolidays) {
    mask |=
      ROSH_CHODESH |
      YOM_TOV_ENDS |
      MINOR_FAST |
      SPECIAL_SHABBAT |
      MODERN_HOLIDAY |
      MAJOR_FAST |
      MINOR_HOLIDAY |
      EREV |
      CHOL_HAMOED |
      LIGHT_CANDLES |
      LIGHT_CANDLES_TZEIS |
      CHANUKAH_CANDLES;
  }
  if (options.candlelighting) {
    mask |= LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | YOM_TOV_ENDS;
  }
  // suppression of defaults
  if (options.noRoshChodesh) {
    mask &= ~ROSH_CHODESH;
  }
  if (options.noModern) {
    mask &= ~MODERN_HOLIDAY;
  }
  if (options.noMinorFast) {
    mask &= ~MINOR_FAST;
  }
  if (options.noSpecialShabbat) {
    mask &= ~SPECIAL_SHABBAT;
    mask &= ~SHABBAT_MEVARCHIM;
  }
  if (il) {
    mask |= IL_ONLY;
  } else {
    mask |= CHUL_ONLY;
  }
  // non-default options
  if (options.sedrot) {
    mask |= PARSHA_HASHAVUA;
  }
  if (options.omer) {
    mask |= OMER_COUNT;
  }
  if (options.shabbatMevarchim) {
    mask |= SHABBAT_MEVARCHIM;
  }
  if (options.yomKippurKatan) {
    mask |= YOM_KIPPUR_KATAN;
  }
  if (options.dailyLearning) {
    const dailyLearning = options.dailyLearning;
    if (dailyLearning.dafYomi) {
      mask |= DAF_YOMI;
    }
    if (dailyLearning.mishnaYomi) {
      mask |= MISHNA_YOMI;
    }
    if (dailyLearning.nachYomi) {
      mask |= NACH_YOMI;
    }
    if (dailyLearning.yerushalmi) {
      mask |= YERUSHALMI_YOMI;
    }
  }

  return mask;
}

const MASK_LIGHT_CANDLES =
  LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | CHANUKAH_CANDLES | YOM_TOV_ENDS;

const defaultLocation = new Location(0, 0, false, 'UTC');

/**
 * @private
 */
function setOptionsFromMask(options: CalOptions): number {
  const m = options.mask || 0;
  if (m & ROSH_CHODESH) delete options.noRoshChodesh;
  if (m & MODERN_HOLIDAY) delete options.noModern;
  if (m & MINOR_FAST) delete options.noMinorFast;
  if (m & SPECIAL_SHABBAT) delete options.noSpecialShabbat;
  if (m & PARSHA_HASHAVUA) options.sedrot = true;
  if (m & (DAF_YOMI | MISHNA_YOMI | NACH_YOMI | YERUSHALMI_YOMI)) {
    options.dailyLearning = options.dailyLearning || {};
    if (m & DAF_YOMI) {
      options.dailyLearning.dafYomi = true;
    }
    if (m & MISHNA_YOMI) {
      options.dailyLearning.mishnaYomi = true;
    }
    if (m & NACH_YOMI) {
      options.dailyLearning.nachYomi = true;
    }
    if (m & YERUSHALMI_YOMI) {
      options.dailyLearning.yerushalmi = 1;
    }
  }
  if (m & OMER_COUNT) options.omer = true;
  if (m & SHABBAT_MEVARCHIM) options.shabbatMevarchim = true;
  if (m & YOM_KIPPUR_KATAN) options.yomKippurKatan = true;
  return m;
}

/**
 * @private
 */
function observedInIsrael(ev: Event): boolean {
  return ev.observedInIsrael();
}

/**
 * @private
 */
function observedInDiaspora(ev: Event): boolean {
  return ev.observedInDiaspora();
}

/**
 * HebrewCalendar is the main interface to the `@hebcal/core` library.
 * This namespace is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
 * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
 * Event names can be rendered in several languges using the `locale` option.
 */
export class HebrewCalendar {
  /**
   * Calculates holidays and other Hebrew calendar events based on {@link CalOptions}.
   *
   * Each holiday is represented by an {@link Event} object which includes a date,
   * a description, flags and optional attributes.
   * If given no options, returns holidays for the Diaspora for the current Gregorian year.
   *
   * The date range returned by this function can be controlled by:
   * * `options.year` - Gregorian (e.g. 1993) or Hebrew year (e.g. 5749)
   * * `options.isHebrewYear` - to interpret `year` as Hebrew year
   * * `options.numYears` - generate calendar for multiple years (default 1)
   * * `options.month` - Gregorian or Hebrew month (to filter results to a single month)
   *
   * Alternatively, specify start and end days with `Date` or {@link HDate} instances:
   * * `options.start` - use specific start date (requires `end` date)
   * * `options.end` - use specific end date (requires `start` date)
   *
   * Unless `options.noHolidays == true`, default holidays include:
   * * Major holidays - Rosh Hashana, Yom Kippur, Pesach, Sukkot, etc.
   * * Minor holidays - Purim, Chanukah, Tu BiShvat, Lag BaOmer, etc.
   * * Minor fasts - Ta'anit Esther, Tzom Gedaliah, etc. (unless `options.noMinorFast`)
   * * Special Shabbatot - Shabbat Shekalim, Zachor, etc. (unless `options.noSpecialShabbat`)
   * * Modern Holidays - Yom HaShoah, Yom HaAtzma'ut, etc. (unless `options.noModern`)
   * * Rosh Chodesh (unless `options.noRoshChodesh`)
   *
   * Holiday and Torah reading schedules differ between Israel and the Disapora.
   * Set `options.il=true` to use the Israeli schedule.
   *
   * Additional non-default event types can be specified:
   * * Parashat HaShavua - weekly Torah Reading on Saturdays (`options.sedrot`)
   * * Counting of the Omer (`options.omer`)
   * * Shabbat Mevarchim HaChodesh on Saturday before Rosh Chodesh (`options.shabbatMevarchim`)
   * * Molad announcement on Saturday before Rosh Chodesh (`options.molad`)
   * * Yom Kippur Katan (`options.yomKippurKatan`)
   *
   * Daily Study of texts are supported by the
   * {@link https://github.com/hebcal/hebcal-learning @hebcal/learning} package,
   * for example:
   * * Babylonian Talmud Daf Yomi (`options.dailyLearning.dafYomi`)
   * * Jerusalem Talmud (Yerushalmi) Yomi (`options.dailyLearning.yerushalmi`)
   * * Mishna Yomi (`options.dailyLearning.mishnaYomi`)
   * * Nach Yomi (`options.dailyLearning.nachYomi`)
   *
   * Candle-lighting and Havdalah times are approximated using latitude and longitude
   * specified by the {@link Location} class. The `Location` class contains a small
   * database of cities with their associated geographic information and time-zone information.
   * If you ever have any doubts about Hebcal's times, consult your local halachic authority.
   * If you enter geographic coordinates above the arctic circle or antarctic circle,
   * the times are guaranteed to be wrong.
   *
   * To add candle-lighting options, set `options.candlelighting=true` and set
   * `options.location` to an instance of `Location`. By default, candle lighting
   * time is 18 minutes before sundown (40 minutes for Jerusalem,
   * 30 minutes for Haifa and Zikhron Ya'akov) and Havdalah is
   * calculated according to Tzeit Hakochavim - Nightfall (the point when 3 small stars
   * are observable in the night time sky with the naked eye). The default Havdalah
   * option (Tzeit Hakochavim) is calculated when the sun is 8.5° below the horizon.
   * These defaults can be changed using these options:
   * * `options.candleLightingMins` - minutes before sundown to light candles
   * * `options.havdalahMins` - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
   *    Havdalah times are suppressed when `options.havdalahMins=0`.
   * * `options.havdalahDeg` - degrees for solar depression for Havdalah.
   *    Default is 8.5 degrees for 3 small stars. Use 7.083 degrees for 3 medium-sized stars.
   *    Havdalah times are suppressed when `options.havdalahDeg=0`.
   *
   * If both `options.candlelighting=true` and `options.location` is specified,
   * Chanukah candle-lighting times and minor fast start/end times will also be generated.
   * Chanukah candle-lighting is at Bein HaShmashos (13.5 minutes before
   * the sun is 7.083° below the horizon in the evening)
   * on weekdays, at regular candle-lighting time on Fridays, and at regular Havdalah time on
   * Saturday night (see above).
   *
   * Minor fasts begin at Alot HaShachar (sun is 16.1° below the horizon in the morning) and
   * end when 3 medium-sized stars are observable in the night sky (sun is 7.083° below the horizon
   * in the evening).
   *
   * Two options also exist for generating an Event with the Hebrew date:
   * * `options.addHebrewDates` - print the Hebrew date for the entire date range
   * * `options.addHebrewDatesForEvents` - print the Hebrew date for dates with some events
   *
   * Lastly, translation and transliteration of event titles is controlled by
   * `options.locale` and the {@link Locale} API.
   * `@hebcal/core` supports three locales by default:
   * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
   * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
   * * `he` - Hebrew (e.g. "שַׁבָּת")
   *
   * Additional locales (such as `ru` or `fr`) are supported by the
   * {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
   *
   * @example
   * import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';
   * const options: CalOptions = {
   *   year: 1981,
   *   isHebrewYear: false,
   *   candlelighting: true,
   *   location: Location.lookup('San Francisco'),
   *   sedrot: true,
   *   omer: true,
   * };
   * const events = HebrewCalendar.calendar(options);
   * for (const ev of events) {
   *   const hd = ev.getDate();
   *   const date = hd.greg();
   *   console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
   * }
   */
  static calendar(options: CalOptions = {}): Event[] {
    options = {...options}; // so we can modify freely
    checkCandleOptions(options);
    const location = (options.location = options.location || defaultLocation);
    const il = (options.il = options.il || location.getIsrael() || false);
    const hasUserMask = typeof options.mask === 'number';
    options.mask = getMaskFromOptions(options);
    if (options.ashkenazi || options.locale) {
      if (options.locale && typeof options.locale !== 'string') {
        throw new TypeError(`Invalid options.locale: ${options.locale}`);
      }
      const locale = options.ashkenazi
        ? 'ashkenazi'
        : (options.locale as string);
      const translationObj = Locale.useLocale(locale);
      if (!translationObj) {
        throw new TypeError(
          `Locale '${locale}' not found; did you forget to import @hebcal/locales?`
        );
      }
    } else {
      Locale.useLocale('en');
    }

    const evts: Event[] = [];
    let sedra: Sedra | undefined;
    let holidaysYear: HolidayYearMap | undefined;
    let beginOmer = -1;
    let endOmer = -1;
    let currentYear = -1;
    const startAndEnd = getStartAndEnd(options);
    warnUnrecognizedOptions(options);
    const startAbs = startAndEnd[0];
    const endAbs = startAndEnd[1];
    const startGreg = abs2greg(startAbs);
    if (startGreg.getFullYear() < 100) {
      options.candlelighting = false;
    }
    for (let abs = startAbs; abs <= endAbs; abs++) {
      const hd = new HDate(abs);
      const hyear = hd.getFullYear();
      if (hyear !== currentYear) {
        currentYear = hyear;
        holidaysYear = getHolidaysForYear_(currentYear);
        if (options.sedrot) {
          sedra = getSedra_(currentYear, il);
        }
        if (options.omer) {
          beginOmer = HDate.hebrew2abs(currentYear, NISAN, 16);
          endOmer = HDate.hebrew2abs(currentYear, SIVAN, 5);
        }
      }
      const prevEventsLength = evts.length;
      const dow = hd.getDay();
      const isFriday = dow === FRI;
      const isSaturday = dow === SAT;
      let candlesEv: TimedEvent | undefined;
      const holidays =
        (holidaysYear as HolidayYearMap).get(hd.toString()) || [];
      for (const ev of holidays) {
        candlesEv = appendHolidayAndRelated(
          candlesEv,
          evts,
          ev,
          options,
          isFriday,
          isSaturday,
          hasUserMask
        );
      }
      if (options.sedrot && isSaturday) {
        const parsha0 = (sedra as Sedra).lookup(abs);
        if (!parsha0.chag) {
          evts.push(new ParshaEvent(hd, parsha0.parsha, il, parsha0.num));
        }
      }
      const dailyLearning = options.dailyLearning;
      if (typeof dailyLearning === 'object') {
        const events = makeDailyLearning(hd, dailyLearning, il);
        evts.push(...events);
      }
      if (options.omer && abs >= beginOmer && abs <= endOmer) {
        const omer = abs - beginOmer + 1;
        const omerEv = makeOmerEvent(hd, omer, options);
        evts.push(omerEv);
      }
      if (isSaturday && (options.molad || options.shabbatMevarchim)) {
        const events = makeMoladAndMevarchimChodesh(hd, options);
        evts.push(...events);
      }
      if (!candlesEv && options.candlelighting && (isFriday || isSaturday)) {
        candlesEv = makeCandleEvent(
          undefined,
          hd,
          options,
          isFriday,
          isSaturday
        );
        if (isFriday && candlesEv && sedra) {
          candlesEv.memo = sedra.getString(abs, options.locale);
        }
      }
      // suppress Havdalah when options.havdalahMins=0 or options.havdalahDeg=0
      if (
        candlesEv instanceof HavdalahEvent &&
        (options.havdalahMins === 0 || options.havdalahDeg === 0)
      ) {
        candlesEv = undefined;
      }
      if (candlesEv) {
        evts.push(candlesEv);
      }
      if (
        options.addHebrewDates ||
        (options.addHebrewDatesForEvents && prevEventsLength !== evts.length)
      ) {
        const e2 = new HebrewDateEvent(hd);
        if (prevEventsLength === evts.length) {
          evts.push(e2);
        } else {
          evts.splice(prevEventsLength, 0, e2);
        }
      }
    }
    return evts;
  }

  /**
   * Calculates a birthday or anniversary (non-yahrzeit).
   * `hyear` must be after original `gdate` of anniversary.
   * Returns `undefined` when requested year preceeds or is same as original year.
   *
   * Hebcal uses the algorithm defined in "Calendrical Calculations"
   * by Edward M. Reingold and Nachum Dershowitz.
   *
   * The birthday of someone born in Adar of an ordinary year or Adar II of
   * a leap year is also always in the last month of the year, be that Adar
   * or Adar II. The birthday in an ordinary year of someone born during the
   * first 29 days of Adar I in a leap year is on the corresponding day of Adar;
   * in a leap year, the birthday occurs in Adar I, as expected.
   *
   * Someone born on the thirtieth day of Marcheshvan, Kislev, or Adar I
   * has his birthday postponed until the first of the following month in
   * years where that day does not occur. [Calendrical Calculations p. 111]
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
   * const hd = HebrewCalendar.getBirthdayOrAnniversary(5780, dt); // '1 Nisan 5780'
   * console.log(hd.greg().toLocaleDateString('en-US')); // '3/26/2020'
   * @param hyear Hebrew year
   * @param gdate Gregorian or Hebrew date of event
   * @returns anniversary occurring in `hyear`
   */
  static getBirthdayOrAnniversary(
    hyear: number,
    gdate: Date | HDate
  ): HDate | undefined {
    const dt = getBirthdayHD(hyear, gdate);
    if (typeof dt === 'undefined') {
      return dt;
    }
    return new HDate(dt);
  }

  /**
   * Calculates yahrzeit.
   * `hyear` must be after original `gdate` of death.
   * Returns `undefined` when requested year preceeds or is same as original year.
   *
   * Hebcal uses the algorithm defined in "Calendrical Calculations"
   * by Edward M. Reingold and Nachum Dershowitz.
   *
   * The customary anniversary date of a death is more complicated and depends
   * also on the character of the year in which the first anniversary occurs.
   * There are several cases:
   *
   * * If the date of death is Marcheshvan 30, the anniversary in general depends
   *   on the first anniversary; if that first anniversary was not Marcheshvan 30,
   *   use the day before Kislev 1.
   * * If the date of death is Kislev 30, the anniversary in general again depends
   *   on the first anniversary — if that was not Kislev 30, use the day before
   *   Tevet 1.
   * * If the date of death is Adar II, the anniversary is the same day in the
   *   last month of the Hebrew year (Adar or Adar II).
   * * If the date of death is Adar I 30, the anniversary in a Hebrew year that
   *   is not a leap year (in which Adar only has 29 days) is the last day in
   *   Shevat.
   * * In all other cases, use the normal (that is, same month number) anniversary
   *   of the date of death. [Calendrical Calculations p. 113]
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
   * const hd = HebrewCalendar.getYahrzeit(5780, dt); // '30 Sh\'vat 5780'
   * console.log(hd.greg().toLocaleDateString('en-US')); // '2/25/2020'
   * @param hyear Hebrew year
   * @param gdate Gregorian or Hebrew date of death
   * @returns anniversary occurring in hyear
   */
  static getYahrzeit(hyear: number, gdate: Date | HDate): HDate | undefined {
    const dt = getYahrzeitHD(hyear, gdate);
    if (typeof dt === 'undefined') {
      return dt;
    }
    return new HDate(dt);
  }

  /**
   * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
   * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
   * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
   * @param year Hebrew year
   */
  static getHolidaysForYear(year: number): HolidayYearMap {
    return getHolidaysForYear_(year);
  }

  /**
   * Returns an array of holidays for the year
   * @param year Hebrew year
   * @param il use the Israeli schedule for holidays
   */
  static getHolidaysForYearArray(year: number, il: boolean): HolidayEvent[] {
    const yearMap = getHolidaysForYear_(year);
    const startAbs = HDate.hebrew2abs(year, TISHREI, 1);
    const endAbs = HDate.hebrew2abs(year + 1, TISHREI, 1) - 1;
    let events: HolidayEvent[] = [];
    const myFilter = il ? observedInIsrael : observedInDiaspora;
    for (let absDt = startAbs; absDt <= endAbs; absDt++) {
      const hd = new HDate(absDt);
      const holidays = yearMap.get(hd.toString());
      if (holidays) {
        const filtered: HolidayEvent[] = holidays.filter(myFilter);
        events = events.concat(filtered);
      }
    }
    return events;
  }

  /**
   * Returns an array of Events on this date (or `undefined` if no events)
   * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
   * @param [il] use the Israeli schedule for holidays
   */
  static getHolidaysOnDate(
    date: HDate | Date | number,
    il?: boolean
  ): HolidayEvent[] | undefined {
    const hd = HDate.isHDate(date) ? (date as HDate) : new HDate(date);
    const hdStr = hd.toString();
    const yearMap = getHolidaysForYear_(hd.getFullYear());
    const events = yearMap.get(hdStr);
    // if il isn't a boolean return both diaspora + IL for day
    if (typeof il === 'undefined' || typeof events === 'undefined') {
      return events;
    }
    const myFilter = il ? observedInIsrael : observedInDiaspora;
    const filtered = events.filter(myFilter);
    return filtered;
  }

  /**
   * Eruv Tavshilin
   */
  static eruvTavshilin(date: Date | HDate, il: boolean): boolean {
    if (date.getDay() < 3 || date.getDay() > 4) {
      return false;
    }
    const today = new HDate(date);
    const friday = today.after(5);
    const tomorrow = today.next();
    if (!isChag(friday, il) || isChag(today, il) || !isChag(tomorrow, il)) {
      return false;
    }
    return true;
  }

  /**
   * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
   * keep as "20:13" for any other locale/country. Uses {@link CalOptions} to determine
   * locale.
   * If `options.hour12` is `false`, locale is ignored and always returns 24-hour time.
   * If `options.hour12` is `true`, locale is ignored and always returns 12-hour time.
   * @param timeStr - original time like "20:30"
   * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
   * @param options
   */
  static reformatTimeStr(
    timeStr: string,
    suffix: string,
    options: CalOptions
  ): string {
    return reformatTimeStr(timeStr, suffix, options);
  }


  static version(): string {
    return pkgVersion;
  }

  /**
   * Convenience function to create an instance of `Sedra` or reuse a previously
   * created and cached instance.
   */
  static getSedra(hyear: number, il: boolean): Sedra {
    return getSedra_(hyear, il);
  }

  /**
   * Return a number containing information on what Hallel is said on that day.
   *
   * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
   * Yom Ha'atzmaut, and Yom Yerushalayim.
   *
   * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
   *
   * The number is one of the following values:
   *
   * 0 - No Hallel
   * 1 - Half Hallel
   * 2 - Whole Hallel
   */
  static hallel(hdate: HDate, il: boolean): number {
    const events = HebrewCalendar.getHolidaysForYearArray(
      hdate.getFullYear(),
      il
    );
    return hallel_(events, hdate);
  }

  /**
   * Return details on what Tachanun (or Tzidchatcha on Shabbat) is said on `hdate`.
   *
   * Tachanun is not said on Rosh Chodesh, the month of Nisan, Lag Baomer,
   * Rosh Chodesh Sivan until Isru Chag, Tisha B'av, 15 Av, Erev Rosh Hashanah,
   * Rosh Hashanah, Erev Yom Kippur until after Simchat Torah, Chanukah,
   * Tu B'shvat, Purim and Shushan Purim, and Purim and Shushan Purim Katan.
   *
   * In some congregations Tachanun is not said until from Rosh Chodesh Sivan
   * until 14th Sivan, Sukkot until after Rosh Chodesh Cheshvan, Pesach Sheini,
   * Yom Ha'atzmaut, and Yom Yerushalayim.
   *
   * Tachanun is not said at Mincha on days before it is not said at Shacharit.
   *
   * Tachanun is not said at Shacharit on Shabbat, but is at Mincha, usually.
   */
  static tachanun(hdate: HDate, il: boolean): TachanunResult {
    return tachanun_(hdate, il);
  }
}

/**
 * @private
 */
function isChag(date: HDate, il: boolean): boolean {
  const events = HebrewCalendar.getHolidaysOnDate(date, il) || [];
  const chag = events.filter(ev => ev.getFlags() & flags.CHAG);
  return chag.length !== 0;
}

/**
 * Appends the Event `ev` to the `events` array. Also may add related
 * timed events like candle-lighting or fast start/end
 * @private
 */
function appendHolidayAndRelated(
  candlesEv: TimedEvent | undefined,
  events: Event[],
  ev: HolidayEvent,
  options: CalOptions,
  isFriday: boolean,
  isSaturday: boolean,
  hasUserMask: boolean
): TimedEvent | undefined {
  const il = options.il || false;
  if (!ev.observedIn(il)) {
    return candlesEv; // holiday isn't observed here; bail out early
  }
  const eFlags = ev.getFlags();
  if (
    (!options.yomKippurKatan && eFlags & YOM_KIPPUR_KATAN) ||
    (options.noModern && eFlags & MODERN_HOLIDAY)
  ) {
    return candlesEv; // bail out early
  }
  const isMajorFast = Boolean(eFlags & MAJOR_FAST);
  const isMinorFast = Boolean(eFlags & MINOR_FAST);
  if (options.candlelighting && (isMajorFast || isMinorFast)) {
    ev = makeFastStartEnd(ev, options);
    if (
      ev.startEvent &&
      (isMajorFast || (isMinorFast && !options.noMinorFast))
    ) {
      events.push(ev.startEvent);
    }
  }
  if (eFlags & Number(options.mask) || (!eFlags && !hasUserMask)) {
    if (options.candlelighting && eFlags & MASK_LIGHT_CANDLES) {
      const hd = ev.getDate();
      candlesEv = makeCandleEvent(ev, hd, options, isFriday, isSaturday);
      if (eFlags & CHANUKAH_CANDLES && candlesEv && !options.noHolidays) {
        // Replace Chanukah event with a clone that includes candle lighting time.
        // For clarity, allow a "duplicate" candle lighting event to remain for Shabbat
        const chanukahEv = makeWeekdayChanukahCandleLighting(ev, hd, options);
        if (chanukahEv) {
          if (isFriday || isSaturday) {
            chanukahEv.eventTime = candlesEv.eventTime;
            chanukahEv.eventTimeStr = candlesEv.eventTimeStr;
          }
          ev = chanukahEv;
        }
        candlesEv = undefined;
      }
    }
    if (
      !options.noHolidays ||
      (options.yomKippurKatan && eFlags & YOM_KIPPUR_KATAN)
    ) {
      events.push(ev); // the original event itself
    }
  }
  if (ev.endEvent && (isMajorFast || (isMinorFast && !options.noMinorFast))) {
    events.push(ev.endEvent);
  }
  return candlesEv;
}

function makeMoladAndMevarchimChodesh(hd: HDate, options: CalOptions): Event[] {
  const evts: Event[] = [];
  const hmonth = hd.getMonth();
  const hdate = hd.getDate();
  if (hmonth !== ELUL && hdate >= 23 && hdate <= 29) {
    const hyear = hd.getFullYear();
    const monNext = hmonth === HDate.monthsInYear(hyear) ? NISAN : hmonth + 1;
    if (options.molad) {
      evts.push(new MoladEvent(hd, hyear, monNext, options));
    }
    if (options.shabbatMevarchim) {
      const nextMonthName = HDate.getMonthName(monNext, hyear);
      const molad = new Molad(hyear, monNext);
      const memo = molad.render(options.locale || 'en', options);
      evts.push(new MevarchimChodeshEvent(hd, nextMonthName, memo));
    }
  }
  return evts;
}

function dailyLearningName(key: string, val: any): string {
  if (key === 'yerushalmi') {
    return val === 2 ? 'yerushalmi-schottenstein' : 'yerushalmi-vilna';
  }
  return key;
}

function makeDailyLearning(
  hd: HDate,
  dailyLearning: {[x: string]: any},
  il: boolean
): Event[] {
  const evts: Event[] = [];
  for (const [key, val] of Object.entries(dailyLearning)) {
    if (val) {
      const name = dailyLearningName(key, val);
      const learningEv = DailyLearning.lookup(name, hd, il);
      if (learningEv) {
        evts.push(learningEv);
      }
    }
  }
  return evts;
}

function makeOmerEvent(hd: HDate, omerDay: number, options: CalOptions) {
  const omerEv = new OmerEvent(hd, omerDay);
  if (options.candlelighting) {
    const location = options.location as Location;
    const zmanim = new Zmanim(location, hd.prev(), false);
    const tzeit = zmanim.tzeit(7.0833);
    if (!isNaN(tzeit.getTime())) {
      omerEv.alarm = tzeit;
    }
  }
  return omerEv;
}
