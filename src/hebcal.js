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
import {Locale} from './locale';
import {HDate, months} from './hdate';
import {HebrewDateEvent} from './HebrewDateEvent';
import {MoladEvent} from './molad';
import {HolidayEvent, getHolidaysForYear, getSedra} from './holidays';
import {flags} from './event';
import {OmerEvent} from './omer';
import {ParshaEvent} from './ParshaEvent';
import {greg as g} from './greg';
import {DafYomiEvent} from './dafyomi';
import {Location} from './location';
import {makeCandleEvent, HavdalahEvent, makeFastStartEnd,
  makeWeekdayChanukahCandleLighting} from './candles';
import {version as pkgVersion} from '../package.json';
import './locale-ashkenazi';
import './locale-he';
import {MishnaYomiEvent} from './MishnaYomiEvent';
import {MinshnaYomiIndex} from './mishnaYomi';

const FRI = 5;
const SAT = 6;

const NISAN = months.NISAN;
// const IYYAR = months.IYYAR;
const SIVAN = months.SIVAN;
// const TAMUZ = months.TAMUZ;
// const AV = months.AV;
const ELUL = months.ELUL;
const TISHREI = months.TISHREI;
const CHESHVAN = months.CHESHVAN;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const SHVAT = months.SHVAT;
const ADAR_I = months.ADAR_I;
const ADAR_II = months.ADAR_II;

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
const OMER_COUNT = flags.OMER_COUNT;
const SHABBAT_MEVARCHIM = flags.SHABBAT_MEVARCHIM;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;

const unrecognizedAlreadyWarned = Object.create(null);
const RECOGNIZED_OPTIONS = {
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
  sedrot: 1,
  il: 1,
  noMinorFast: 1,
  noModern: 1,
  shabbatMevarchim: 1,
  noRoshChodesh: 1,
  noSpecialShabbat: 1,
  noHolidays: 1,
  dafyomi: 1,
  mishnaYomi: 1,
  omer: 1,
  molad: 1,
  ashkenazi: 1,
  locale: 1,
  addHebrewDates: 1,
  addHebrewDatesForEvents: 1,
  appendHebrewToSubject: 1,
  mask: 1,
  userMask: 1,
};

/**
 * @private
 * @param {HebrewCalendar.Options} options
 */
function warnUnrecognizedOptions(options) {
  Object.keys(options).forEach((k) => {
    if (typeof RECOGNIZED_OPTIONS[k] === 'undefined' && !unrecognizedAlreadyWarned[k]) {
      console.warn(`Ignoring unrecognized HebrewCalendar option: ${k}`);
      unrecognizedAlreadyWarned[k] = true;
    }
  });
}

/**
 * A bit like Object.assign(), but just a shallow copy
 * @private
 * @param {any} target
 * @param {any} source
 * @return {any}
 */
function shallowCopy(target, source) {
  Object.keys(source).forEach((k) => target[k] = source[k]);
  return target;
}

/**
 * Modifies options in-place
 * @private
 * @param {HebrewCalendar.Options} options
 */
function checkCandleOptions(options) {
  if (!options.candlelighting) {
    return;
  }
  if (typeof options.location === 'undefined' || !options.location instanceof Location) {
    throw new TypeError('options.candlelighting requires valid options.location');
  }
  if (typeof options.havdalahMins === 'number' && typeof options.havdalahDeg === 'number') {
    throw new TypeError('options.havdalahMins and options.havdalahDeg are mutually exclusive');
  }

  let min = parseInt(options.candleLightingMins, 10) || 18;
  if (options.location && options.location.getIsrael() &&
      options.location.getShortName() === 'Jerusalem' &&
      Math.abs(min) === 18) {
    min = 40;
  }
  options.candleLightingMins = -1 * Math.abs(min);

  if (typeof options.havdalahMins === 'number') {
    options.havdalahMins = Math.abs(options.havdalahMins);
  } else if (typeof options.havdalahDeg === 'number') {
    options.havdalahDeg = Math.abs(options.havdalahDeg);
  } else {
    options.havdalahDeg = 8.5;
  }
}

/**
 * Options to configure which events are returned
 * @typedef {Object} HebrewCalendar.Options
 * @property {Location} location - latitude/longitude/tzid used for candle-lighting
 * @property {number} year - Gregorian or Hebrew year
 * @property {boolean} isHebrewYear - to interpret year as Hebrew year
 * @property {number} month - Gregorian or Hebrew month (to filter results to a single month)
 * @property {number} numYears - generate calendar for multiple years (default 1)
 * @property {Date|HDate|number} start - use specific start date (requires end date)
 * @property {Date|HDate|number} end - use specific end date (requires start date)
 * @property {boolean} candlelighting - calculate candle-lighting and havdalah times
 * @property {number} candleLightingMins - minutes before sundown to light candles (default 18)
 * @property {number} havdalahMins - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
 *      If `undefined` (the default), calculate Havdalah according to Tzeit Hakochavim -
 *      Nightfall (the point when 3 small stars are observable in the night time sky with
 *      the naked eye). If `0`, Havdalah times are supressed.
 * @property {number} havdalahDeg - degrees for solar depression for Havdalah.
 *      Default is 8.5 degrees for 3 small stars. use 7.083 degress for 3 medium-sized stars.
 *      If `0`, Havdalah times are supressed.
 * @property {boolean} sedrot - calculate parashah hashavua on Saturdays
 * @property {boolean} il - Israeli holiday and sedra schedule
 * @property {boolean} noMinorFast - suppress minor fasts
 * @property {boolean} noModern - suppress modern holidays
 * @property {boolean} noRoshChodesh - suppress Rosh Chodesh
 * @property {boolean} shabbatMevarchim - add Shabbat Mevarchim
 * @property {boolean} noSpecialShabbat - suppress Special Shabbat
 * @property {boolean} noHolidays - suppress regular holidays
 * @property {boolean} dafyomi - include Daf Yomi
 * @property {boolean} mishnaYomi - include Daf Yomi
 * @property {boolean} omer - include Days of the Omer
 * @property {boolean} molad - include event announcing the molad
 * @property {boolean} ashkenazi - use Ashkenazi transliterations for event titles (default Sephardi transliterations)
 * @property {string} locale - translate event titles according to a locale
 *      Default value is `en`, also built-in are `he` and `ashkenazi`.
 *      Additional locales (such as `ru` or `fr`) are provided by the
 *      {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
 * @property {boolean} addHebrewDates - print the Hebrew date for the entire date range
 * @property {boolean} addHebrewDatesForEvents - print the Hebrew date for dates with some events
 * @property {number} mask - use bitmask from `flags` to filter events
 */

/**
 * Gets the R.D. days for a number, Date, or HDate
 * @private
 * @param {Date|HDate|number} d
 * @return {number}
 */
function getAbs(d) {
  if (typeof d == 'number') return d;
  if (g.isDate(d)) return g.greg2abs(d);
  if (HDate.isHDate(d)) return d.abs();
  throw new TypeError(`Invalid date type: ${d}`);
}

/**
 * Parse options object to determine start & end days
 * @private
 * @param {HebrewCalendar.Options} options
 * @return {number[]}
 */
export function getStartAndEnd(options) {
  if ((options.start && !options.end) || (options.end && !options.start)) {
    throw new TypeError('Both options.start and options.end are required');
  } else if (options.start && options.end) {
    return [getAbs(options.start), getAbs(options.end)];
  }
  const isHebrewYear = Boolean(options.isHebrewYear);
  const theYear = typeof options.year !== 'undefined' ? parseInt(options.year, 10) :
    isHebrewYear ? new HDate().getFullYear() : new Date().getFullYear();
  if (isNaN(theYear)) {
    throw new RangeError(`Invalid year ${options.year}`);
  } else if (isHebrewYear && theYear < 1) {
    throw new RangeError(`Invalid Hebrew year ${theYear}`);
  } else if (theYear == 0) {
    throw new RangeError(`Invalid Gregorian year ${theYear}`);
  }
  let theMonth = NaN;
  if (options.month) {
    if (isHebrewYear) {
      theMonth = HDate.monthNum(options.month);
    } else {
      theMonth = options.month;
    }
  }
  const numYears = parseInt(options.numYears, 10) || 1;
  if (isHebrewYear) {
    const startDate = new HDate(1, theMonth || TISHREI, theYear);
    let startAbs = startDate.abs();
    const endAbs = options.month ?
        startAbs + startDate.daysInMonth() :
        new HDate(1, TISHREI, theYear + numYears).abs() - 1;
    // for full Hebrew year, start on Erev Rosh Hashana which
    // is technically in the previous Hebrew year
    // (but conveniently lets us get candle-lighting time for Erev)
    if (!theMonth) {
      startAbs--;
    }
    return [startAbs, endAbs];
  } else {
    const gregMonth = options.month ? theMonth - 1 : 0;
    const startGreg = new Date(theYear, gregMonth, 1);
    if (theYear < 100) {
      startGreg.setFullYear(theYear);
    }
    const startAbs = g.greg2abs(startGreg);
    let endAbs;
    if (options.month) {
      endAbs = startAbs + g.daysInMonth(theMonth, theYear) - 1;
    } else {
      const endYear = theYear + numYears;
      const endGreg = new Date(endYear, 0, 1);
      if (endYear < 100) {
        endGreg.setFullYear(endYear);
      }
      endAbs = g.greg2abs(endGreg) - 1;
    }
    return [startAbs, endAbs];
  }
}

/**
 * Mask to filter Holiday array
 * @private
 * @param {HebrewCalendar.Options} options
 * @return {number}
 */
function getMaskFromOptions(options) {
  if (typeof options.mask === 'number') {
    const m = options.mask;
    if (m & ROSH_CHODESH) delete options.noRoshChodesh;
    if (m & MODERN_HOLIDAY) delete options.noModern;
    if (m & MINOR_FAST) delete options.noMinorFast;
    if (m & SPECIAL_SHABBAT) delete options.noSpecialShabbat;
    if (m & PARSHA_HASHAVUA) options.sedrot = true;
    if (m & DAF_YOMI) options.dafyomi = true;
    if (m & OMER_COUNT) options.omer = true;
    if (m & SHABBAT_MEVARCHIM) options.shabbatMevarchim = true;
    if (m & flags.MISHNA_YOMI) options.mishnaYomi = true;
    options.userMask = true;
    return m;
  }
  const il = options.il || (options.location && options.location.il) || false;
  let mask = 0;

  // default options
  if (!options.noHolidays) {
    mask |= ROSH_CHODESH | YOM_TOV_ENDS | MINOR_FAST | SPECIAL_SHABBAT | MODERN_HOLIDAY | MAJOR_FAST |
            MINOR_HOLIDAY | EREV | CHOL_HAMOED |
            LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | CHANUKAH_CANDLES;
  }
  if (options.candlelighting) {
    mask |= LIGHT_CANDLES | LIGHT_CANDLES_TZEIS;
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
  if (options.dafyomi) {
    mask |= DAF_YOMI;
  }
  if (options.mishnaYomi) {
    mask |= flags.MISHNA_YOMI;
  }
  if (options.omer) {
    mask |= OMER_COUNT;
  }
  if (options.shabbatMevarchim) {
    mask |= SHABBAT_MEVARCHIM;
  }

  return mask;
}

const MASK_LIGHT_CANDLES =
  LIGHT_CANDLES |
  LIGHT_CANDLES_TZEIS |
  CHANUKAH_CANDLES |
  YOM_TOV_ENDS;

/**
 * HebrewCalendar is the main interface to the `@hebcal/core` library.
 * This namespace is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
 * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
 * Event names can be rendered in several languges using the `locale` option.
 */
export const HebrewCalendar = {
  /** @private */
  defaultLocation: new Location(0, 0, false, 'UTC'),

  /**
   * Calculates holidays and other Hebrew calendar events based on {@link HebrewCalendar.Options}.
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
   * * Daf Yomi (`options.dafyomi`)
   * * Mishna Yomi (`options.mishnaYomi`)
   * * Shabbat Mevarchim HaChodesh on Saturday before Rosh Chodesh (`options.shabbatMevarchim`)
   * * Molad announcement on Saturday before Rosh Chodesh (`options.molad`)
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
   * time is 18 minutes before sundown (40 minutes for Jerusalem) and Havdalah is
   * calculated according to Tzeit Hakochavim - Nightfall (the point when 3 small stars
   * are observable in the night time sky with the naked eye). The default Havdalah
   * option (Tzeit Hakochavim) is calculated when the sun is 8.5° below the horizon.
   * These defaults can be changed using these options:
   * * `options.candleLightingMins` - minutes before sundown to light candles
   * * `options.havdalahMins` - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
   *    Havdalah times are supressed when `options.havdalahMins=0`.
   * * `options.havdalahDeg` - degrees for solar depression for Havdalah.
   *    Default is 8.5 degrees for 3 small stars. Use 7.083 degress for 3 medium-sized stars.
   *    Havdalah times are supressed when `options.havdalahDeg=0`.
   *
   * If both `options.candlelighting=true` and `options.location` is specified,
   * Chanukah candle-lighting times and minor fast start/end times will also be generated.
   * Chanukah candle-lighting is at dusk (when the sun is 6.0° below the horizon in the evening)
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
   * const options = {
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
   *   console.log(date.toLocaleDateString(), ev.render(), hd.toString());
   * }
   * @param {HebrewCalendar.Options} [options={}]
   * @return {Event[]}
   */
  calendar: function(options={}) {
    options = shallowCopy({}, options); // so we can modify freely
    checkCandleOptions(options);
    const location = options.location = options.location || this.defaultLocation;
    const il = options.il = options.il || location.il || false;
    options.mask = getMaskFromOptions(options);
    if (options.ashkenazi || options.locale) {
      if (options.locale && typeof options.locale !== 'string') {
        throw new TypeError(`Invalid options.locale: ${options.locale}`);
      }
      const locale = options.ashkenazi ? 'ashkenazi' : options.locale;
      const translationObj = Locale.useLocale(locale);
      if (!translationObj) {
        throw new TypeError(`Locale '${locale}' not found; did you forget to import @hebcal/locales?`);
      }
    } else {
      Locale.useLocale('en');
    }

    const evts = [];
    let sedra; let holidaysYear; let beginOmer; let endOmer;
    let currentYear = -1;
    const startAndEnd = getStartAndEnd(options);
    warnUnrecognizedOptions(options);
    const startAbs = startAndEnd[0];
    const endAbs = startAndEnd[1];
    const startGreg = g.abs2greg(startAbs);
    if (startGreg.getFullYear() < 100) {
      options.candlelighting = false;
    }
    let mishnaYomiIndex;
    if (options.mishnaYomi) {
      mishnaYomiIndex = new MinshnaYomiIndex();
    }
    for (let abs = startAbs; abs <= endAbs; abs++) {
      const hd = new HDate(abs);
      const hyear = hd.getFullYear();
      if (hyear != currentYear) {
        currentYear = hyear;
        holidaysYear = HebrewCalendar.getHolidaysForYear(currentYear);
        if (options.sedrot && currentYear >= 3762) {
          sedra = getSedra(currentYear, il);
        }
        if (options.omer) {
          beginOmer = HDate.hebrew2abs(currentYear, NISAN, 16);
          endOmer = HDate.hebrew2abs(currentYear, SIVAN, 5);
        }
      }
      const prevEventsLength = evts.length;
      const dow = hd.getDay();
      let candlesEv = undefined;
      const ev = holidaysYear.get(hd.toString()) || [];
      ev.forEach((e) => {
        candlesEv = appendHolidayAndRelated(evts, e, options, candlesEv, dow);
      });
      if (options.sedrot && dow == SAT && hyear >= 3762) {
        const parsha0 = sedra.lookup(abs);
        if (!parsha0.chag) {
          evts.push(new ParshaEvent(hd, parsha0.parsha, il));
        }
      }
      if (options.dafyomi && hyear >= 5684) {
        evts.push(new DafYomiEvent(hd));
      }
      if (options.mishnaYomi && hyear > 5707) {
        const mishnaYomi = mishnaYomiIndex.lookup(abs);
        evts.push(new MishnaYomiEvent(hd, mishnaYomi));
      }
      if (options.omer && abs >= beginOmer && abs <= endOmer) {
        const omer = abs - beginOmer + 1;
        evts.push(new OmerEvent(hd, omer));
      }
      const hmonth = hd.getMonth();
      if (options.molad && dow == SAT && hmonth != ELUL && hd.getDate() >= 23 && hd.getDate() <= 29) {
        const monNext = (hmonth == HDate.monthsInYear(hyear) ? NISAN : hmonth + 1);
        evts.push(new MoladEvent(hd, hyear, monNext));
      }
      if (!candlesEv && options.candlelighting && (dow == FRI || dow == SAT)) {
        candlesEv = makeCandleEvent(undefined, hd, dow, location, options);
        if (dow === FRI && candlesEv && sedra) {
          candlesEv.memo = sedra.getString(abs);
        }
      }
      // suppress Havdalah when options.havdalahMins=0 or options.havdalahDeg=0
      if (candlesEv instanceof HavdalahEvent && (options.havdalahMins === 0 || options.havdalahDeg === 0)) {
        candlesEv = null;
      }
      if (candlesEv) {
        evts.push(candlesEv);
      }
      if (options.addHebrewDates ||
        (options.addHebrewDatesForEvents && prevEventsLength != evts.length)) {
        const e2 = new HebrewDateEvent(hd);
        if (prevEventsLength == evts.length) {
          evts.push(e2);
        } else {
          evts.splice(prevEventsLength, 0, e2);
        }
      }
    }
    return evts;
  },

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
   * @param {number} hyear Hebrew year
   * @param {Date|HDate} gdate Gregorian or Hebrew date of event
   * @return {HDate} anniversary occurring in `hyear`
   */
  getBirthdayOrAnniversary: function(hyear, gdate) {
    const orig = HDate.isHDate(gdate) ? gdate : new HDate(gdate);
    const origYear = orig.getFullYear();
    if (hyear <= origYear) {
      // `Hebrew year ${hyear} occurs on or before original date in ${origYear}`
      return undefined;
    }
    const isOrigLeap = HDate.isLeapYear(origYear);
    let month = orig.getMonth();
    let day = orig.getDate();

    if ((month == ADAR_I && !isOrigLeap) || (month == ADAR_II && isOrigLeap)) {
      month = HDate.monthsInYear(hyear);
    } else if (month == CHESHVAN && day == 30 && !HDate.longCheshvan(hyear)) {
      month = KISLEV;
      day = 1;
    } else if (month == KISLEV && day == 30 && HDate.shortKislev(hyear)) {
      month = TEVET;
      day = 1;
    } else if (month == ADAR_I && day == 30 && isOrigLeap && !HDate.isLeapYear(hyear)) {
      month = NISAN;
      day = 1;
    }

    return new HDate(day, month, hyear);
  },

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
   * @param {number} hyear Hebrew year
   * @param {Date|HDate} gdate Gregorian or Hebrew date of death
   * @return {HDate} anniversary occurring in hyear
   */
  getYahrzeit: function(hyear, gdate) {
    const orig = HDate.isHDate(gdate) ? gdate : new HDate(gdate);
    let hDeath = {
      yy: orig.getFullYear(),
      mm: orig.getMonth(),
      dd: orig.getDate(),
    };
    if (hyear <= hDeath.yy) {
      // `Hebrew year ${hyear} occurs on or before original date in ${hDeath.yy}`
      return undefined;
    }

    if (hDeath.mm == CHESHVAN && hDeath.dd == 30 && !HDate.longCheshvan(hDeath.yy + 1)) {
      // If it's Heshvan 30 it depends on the first anniversary;
      // if that was not Heshvan 30, use the day before Kislev 1.
      hDeath = HDate.abs2hebrew(HDate.hebrew2abs(hyear, KISLEV, 1) - 1);
    } else if (hDeath.mm == KISLEV && hDeath.dd == 30 && HDate.shortKislev(hDeath.yy + 1)) {
      // If it's Kislev 30 it depends on the first anniversary;
      // if that was not Kislev 30, use the day before Teveth 1.
      hDeath = HDate.abs2hebrew(HDate.hebrew2abs(hyear, TEVET, 1) - 1);
    } else if (hDeath.mm == ADAR_II) {
      // If it's Adar II, use the same day in last month of year (Adar or Adar II).
      hDeath.mm = HDate.monthsInYear(hyear);
    } else if (hDeath.mm == ADAR_I && hDeath.dd == 30 && !HDate.isLeapYear(hyear)) {
      // If it's the 30th in Adar I and year is not a leap year
      // (so Adar has only 29 days), use the last day in Shevat.
      hDeath.dd = 30;
      hDeath.mm = SHVAT;
    }
    // In all other cases, use the normal anniversary of the date of death.

    // advance day to rosh chodesh if needed
    if (hDeath.mm == CHESHVAN && hDeath.dd == 30 && !HDate.longCheshvan(hyear)) {
      hDeath.mm = KISLEV;
      hDeath.dd = 1;
    } else if (hDeath.mm == KISLEV && hDeath.dd == 30 && HDate.shortKislev(hyear)) {
      hDeath.mm = TEVET;
      hDeath.dd = 1;
    }

    return new HDate(hDeath.dd, hDeath.mm, hyear);
  },

  /**
   * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
   * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
   * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
   * @function
   * @param {number} year Hebrew year
   * @return {Map<string,Event[]>}
   */
  getHolidaysForYear: getHolidaysForYear,

  /**
   * Returns an array of holidays for the year
   * @param {number} year Hebrew year
   * @param {boolean} il use the Israeli schedule for holidays
   * @return {Event[]}
   */
  getHolidaysForYearArray: function(year, il) {
    const yearMap = HebrewCalendar.getHolidaysForYear(year);
    const startAbs = HDate.hebrew2abs(year, TISHREI, 1);
    const endAbs = HDate.hebrew2abs(year + 1, TISHREI, 1) - 1;
    const events = [];
    for (let absDt = startAbs; absDt <= endAbs; absDt++) {
      const hd = new HDate(absDt);
      const holidays = yearMap.get(hd.toString());
      if (holidays) {
        const filtered = holidays.filter((ev) => (il && ev.observedInIsrael()) || (!il && ev.observedInDiaspora()));
        filtered.forEach((ev) => events.push(ev));
      }
    }
    return events;
  },

  /**
   * Returns an array of Events on this date (or undefined if no events)
   * @param {HDate|Date|number} date Hebrew Date, Gregorian date, or absolute R.D. day number
   * @param {boolean} [il] use the Israeli schedule for holidays
   * @return {Event[]}
   */
  getHolidaysOnDate: function(date, il) {
    const hd = HDate.isHDate(date) ? date : new HDate(date);
    const yearMap = HebrewCalendar.getHolidaysForYear(hd.getFullYear());
    const events = yearMap.get(hd.toString());
    if (typeof il === 'undefined' || typeof events === 'undefined') {
      return events;
    }
    return events.filter((ev) => (il && ev.observedInIsrael()) || (!il && ev.observedInDiaspora()));
  },

  hour12cc: {
    US: 1, CA: 1, BR: 1, AU: 1, NZ: 1, DO: 1, PR: 1, GR: 1, IN: 1, KR: 1, NP: 1, ZA: 1,
  },

  /**
   * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
   * keep as "20:13" for any other locale/country. Uses `HebrewCalendar.Options` to determine
   * locale.
   * @param {string} timeStr - original time like "20:30"
   * @param {string} suffix - "p" or "pm" or " P.M.". Add leading space if you want it
   * @param {HebrewCalendar.Options} options
   * @return {string}
   */
  reformatTimeStr: function(timeStr, suffix, options) {
    if (typeof timeStr !== 'string') throw new TypeError(`Bad timeStr: ${timeStr}`);
    const cc = (options.location && options.location.cc) || (options.il ? 'IL' : 'US');
    if (typeof this.hour12cc[cc] === 'undefined') {
      return timeStr;
    }
    const hm = timeStr.split(':');
    let hour = parseInt(hm[0], 10);
    if (hour < 12 && suffix) {
      suffix = suffix.replace('p', 'a').replace('P', 'A');
    } else if (hour > 12) {
      hour = hour % 12;
    }
    return `${hour}:${hm[1]}${suffix}`;
  },

  /** @return {string} */
  version: function() {
    return pkgVersion;
  },

  /**
   * Convenience function to create an instance of `Sedra` or reuse a previously
   * created and cached instance.
   * @function
   * @param {number} hyear
   * @param {boolean} il
   * @return {Sedra}
   */
  getSedra: getSedra,
};

/**
 * Appends the Event `ev` to the `events` array. Also may add related
 * timed events like candle-lighting or fast start/end
 * @private
 * @param {Event[]} events
 * @param {Event} ev
 * @param {HebrewCalendar.Options} options
 * @param {Event} candlesEv
 * @param {number} dow
 * @return {Event}
 */
function appendHolidayAndRelated(events, ev, options, candlesEv, dow) {
  const eFlags = ev.getFlags();
  const il = options.il;
  const observed = (il && ev.observedInIsrael()) || (!il && ev.observedInDiaspora());
  const mask = options.mask;
  if (observed && ((eFlags & mask) || (!eFlags && !options.userMask))) {
    const location = options.location;
    if (options.candlelighting && eFlags & MASK_LIGHT_CANDLES) {
      const hd = ev.getDate();
      candlesEv = makeCandleEvent(ev, hd, dow, location, options);
      if (eFlags & CHANUKAH_CANDLES && candlesEv && !options.noHolidays) {
        const chanukahEv = (dow === FRI || dow === SAT) ? candlesEv :
          makeWeekdayChanukahCandleLighting(ev, hd, location);
        const attrs = {
          eventTime: chanukahEv.eventTime,
          eventTimeStr: chanukahEv.eventTimeStr,
          location,
        };
        if (ev.chanukahDay) attrs.chanukahDay = ev.chanukahDay;
        if (ev.emoji) attrs.emoji = ev.emoji;
        // Replace Chanukah event with a clone that includes candle lighting time.
        // For clarity, allow a "duplicate" candle lighting event to remain for Shabbat
        ev = new HolidayEvent(ev.getDate(), ev.getDesc(), eFlags, attrs);
        candlesEv = undefined;
      }
    }
    if (!options.noHolidays) {
      if (options.candlelighting && eFlags & (MINOR_FAST | MAJOR_FAST)) {
        ev = makeFastStartEnd(ev, location);
      }
      if (ev.startEvent) {
        events.push(ev.startEvent);
      }
      events.push(ev); // the original event itself
      if (ev.endEvent) {
        events.push(ev.endEvent);
      }
    }
  }
  return candlesEv;
}
