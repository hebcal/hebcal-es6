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
import {locale as l} from './locale';
import {common} from './common';
import {HDate, hebrew2abs, HebrewDateEvent} from './hdate';
import {MoladEvent} from './molad';
import {holidays} from './holidays';
import {flags} from './event';
import {OmerEvent} from './omer';
import {Sedra, ParshaEvent} from './sedra';
import {greg as g} from './greg';
import {DafYomiEvent, dafyomi} from './dafyomi';
import {Location} from './location';
import {makeCandleEvent, HavdalahEvent} from './candles';

const months = common.months;
const FRI = common.days.FRI;
const SAT = common.days.SAT;

/**
 * @private
 * @param {HebcalOptions} options
 * @return {number}
 */
function getCandleLightingMinutes(options) {
  if (!options.candlelighting) {
    return undefined;
  }
  const location = options.location || {};
  let min = 18;
  if (location.il && typeof location.name !== 'undefined' && location.name === 'Jerusalem') {
    min = 40;
  }
  if (typeof location.candleLightingMins === 'number') {
    min = Math.abs(candleLightingMins);
  }
  return -1 * min;
}

/**
 * Options to configure which events are returned
 * @typedef {Object} HebcalOptions
 * @property {Location} location - latitude/longitude/tzid used for candle-lighting
 * @property {number} year - Gregorian or Hebrew year
 * @property {boolean} isHebrewYear - to interpret year as Hebrew year
 * @property {number} month - Gregorian or Hebrew month (to filter results to a single month)
 * @property {number} numYears - generate calendar for multiple years (default 1)
 * @property {Date|HDate|number} start - use specific start date (requires end date)
 * @property {Date|HDate|number} end - use specific end date (requires start date)
 * @property {boolean} candlelighting - calculate candle-lighting and havdalah times
 * @property {number} candleLightingMins - minutes before sundown to light candles (default 18)
 * @property {number} havdalahMins - minutes after sundown for Havdalah (typical values are 42, 50, or 72)
 * @property {boolean} havdalahTzeit - calculate Havdalah according to Tzeit Hakochavim -
 *      Nightfall (the point when 3 small stars are observable in the night time sky with
 *      the naked eye). Defaults to `true` unless havdalahMins is specified
 * @property {boolean} sedrot - calculate parashah hashavua on Saturdays
 * @property {boolean} il - Israeli holiday and sedra schedule
 * @property {boolean} noMinorFast - suppress minor fasts
 * @property {boolean} noModern - suppress modern holidays
 * @property {boolean} noRoshChodesh - suppress Rosh Chodesh
 * @property {boolean} shabbatMevarchim - add Shabbat Mevarchim
 * @property {boolean} noSpecialShabbat - suppress Special Shabbat
 * @property {boolean} noHolidays - suppress regular holidays
 * @property {boolean} dafyomi - include Daf Yomi
 * @property {boolean} omer - include Days of the Omer
 * @property {boolean} molad - include event announcing the molad
 * @property {boolean} ashkenazi - use Ashkenazi transliterations for event titles (default Sephardi transliterations)
 * @property {string} locale - translate event titles according to a locale
 *      (one of `fi`, `fr`, `he`, `hu`, `pl`, `ru`,
 *      `ashkenazi`, `ashkenazi_litvish`, `ashkenazi_poylish`, `ashkenazi_standard`)
 * @property {boolean} hour12 - use 12-hour time (1-12) instead of default 24-hour time (0-23)
 * @property {boolean} addHebrewDates - print the Hebrew date for the entire date range
 * @property {boolean} addHebrewDatesForEvents - print the Hebrew date for dates with some events
 */

/**
 * Gets the Julian absolute days for a number, Date, or HDate
 * @private
 * @param {Date|HDate|number} d
 * @return {number}
 */
function getAbs(d) {
  if (typeof d == 'number') return d;
  if (d instanceof Date) return g.greg2abs(d);
  if (d instanceof HDate) return d.abs();
  throw new TypeError(`Invalid date type: ${d}`);
}

/**
 * Parse options object to determine start & end days
 * @private
 * @param {HebcalOptions} options
 * @return {number[]}
 */
function getStartAndEnd(options) {
  if ((options.start && !options.end) || (options.end && !options.start)) {
    throw new TypeError('Both options.start and options.end are required');
  } else if (options.start && options.end) {
    return [getAbs(options.start), getAbs(options.end)];
  }
  const isHebrewYear = Boolean(options.isHebrewYear);
  const theYear = options.year ? Number(options.year) :
    isHebrewYear ? new HDate().getFullYear() : new Date().getFullYear();
  let theMonth = NaN;
  if (options.month) {
    if (isHebrewYear) {
      theMonth = common.monthNum(options.month);
    } else {
      theMonth = options.month;
    }
  }
  if (isHebrewYear) {
    const startDate = new HDate(1, theMonth || months.TISHREI, theYear);
    const startAbs = startDate.abs();
    const numYears = Number(options.numYears) || 1;
    const endAbs = options.month ?
        startAbs + startDate.daysInMonth() :
        new HDate(1, months.TISHREI, theYear + numYears).abs() - 1;
    return [startAbs, endAbs];
  } else {
    const gregMonth = options.month ? theMonth - 1 : 0;
    const startGreg = new Date(theYear, gregMonth, 1);
    const startAbs = g.greg2abs(startGreg);
    const numYears = Number(options.numYears) || 1;
    const endAbs = options.month ?
        startAbs + g.daysInGregMonth(theMonth, theYear) - 1 :
        g.greg2abs(new Date(theYear + numYears, 0, 1)) - 1;
    return [startAbs, endAbs];
  }
}

/**
 * @private
 * @param {number} hyear
 * @return {number[]}
 */
function getOmerStartAndEnd(hyear) {
  return [
    hebrew2abs({yy: hyear, mm: months.NISAN, dd: 16}),
    hebrew2abs({yy: hyear, mm: months.SIVAN, dd: 5}),
  ];
}

/**
 * Mask to filter Holiday array
 * @private
 * @param {HebcalOptions} options
 * @return {number}
 */
function getMaskFromOptions(options) {
  const il = options.il || (options.location && options.location.il) || false;
  let mask = 0;

  // default options
  if (!options.noHolidays) {
    mask |= flags.ROSH_CHODESH |
                flags.YOM_TOV_ENDS |
                flags.MINOR_FAST |
                flags.SPECIAL_SHABBAT |
                flags.MODERN_HOLIDAY |
                flags.MAJOR_FAST |
                flags.LIGHT_CANDLES |
                flags.LIGHT_CANDLES_TZEIS |
                flags.CHANUKAH_CANDLES;
  }

  if (options.candlelighting) {
    mask |= flags.LIGHT_CANDLES |
                flags.LIGHT_CANDLES_TZEIS |
                flags.CHANUKAH_CANDLES;
  }

  // suppression of defaults
  if (options.noRoshChodesh) {
    mask &= ~flags.ROSH_CHODESH;
  }

  if (options.noModern) {
    mask &= ~flags.MODERN_HOLIDAY;
  }

  if (options.noMinorFast) {
    mask &= ~flags.MINOR_FAST;
  }

  if (options.noSpecialShabbat) {
    mask &= ~flags.SPECIAL_SHABBAT;
    mask &= ~flags.SHABBAT_MEVARCHIM;
  }

  if (il) {
    mask |= flags.IL_ONLY;
  } else {
    mask |= flags.CHUL_ONLY;
  }

  // non-default options
  if (options.sedrot) {
    mask |= flags.PARSHA_HASHAVUA;
  }

  if (options.dafyomi) {
    mask |= flags.DAF_YOMI;
  }

  if (options.omer) {
    mask |= flags.OMER_COUNT;
  }

  if (options.shabbatMevarchim) {
    mask |= flags.SHABBAT_MEVARCHIM;
  }

  return mask;
}

/**
 * Generates a list of holidays and other hebrew date events based on `options`.
 * This is the main interface to the `@hebcal/core` library, and can be used to
 * retrieve holidays, rosh chodesh, candle lighting & havdalah times,
 * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
 * Event names can be rendered in several languges using the `locale` option.
 * @private
 * @param {HebcalOptions} [options={}]
 * @return {Event[]}
 */
export function hebrewCalendar(options={}) {
  if (options.candlelighting && (typeof options.location === 'undefined' || !options.location instanceof Location)) {
    throw new TypeError('options.candlelighting requires valid options.location');
  }
  const location = options.location || new Location(0, 0, false);
  const il = options.il || location.il || false;
  const timeFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: location.tzid,
    hour12: Boolean(options.hour12),
    hour: 'numeric',
    minute: 'numeric',
  });
  const candleLightingMinutes = getCandleLightingMinutes(options);
  const havdalahMinutes = options.havdalahMins; // if undefined, use tzeit
  const mask = getMaskFromOptions(options);
  const MASK_LIGHT_CANDLES =
        flags.LIGHT_CANDLES |
        flags.LIGHT_CANDLES_TZEIS |
        flags.CHANUKAH_CANDLES |
        flags.YOM_TOV_ENDS;
  if (options.ashkenazi || options.locale) {
    if (options.locale && typeof options.locale !== 'string') {
      throw new TypeError(`Invalid options.locale: ${options.locale}`);
    }
    const locale = options.ashkenazi ? 'ashkenazi' : options.locale;
    const translationObj = l.useLocale(locale);
    if (!translationObj) {
      throw new TypeError(`Locale '${locale}' not found; did you forget to import @hebcal/locales?`);
    }
  } else {
    l.useLocale('en');
  }

  const events = [];
  let sedra; let holidaysYear; let beginOmer; let endOmer;
  let currentYear = -1;
  const [startAbs, endAbs] = getStartAndEnd(options);
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    const hyear = hd.getFullYear();
    if (hyear != currentYear) {
      currentYear = hyear;
      holidaysYear = holidays.getHolidaysForYear(currentYear);
      if (options.sedrot) {
        sedra = new Sedra(currentYear, il);
      }
      if (options.omer) {
        [beginOmer, endOmer] = getOmerStartAndEnd(currentYear);
      }
    }
    const prevEventsLength = events.length;
    const dow = abs % 7;
    let candlesEv = undefined;
    const ev = holidaysYear.get(hd.toString());
    if (typeof ev !== 'undefined') {
      for (const e of ev) {
        const eFlags = e.getFlags();
        if ((!eFlags || (eFlags & mask)) &&
           ((il && e.observedInIsrael()) || (!il && e.observedInDiaspora()))) {
          if (!options.noHolidays) {
            events.push(e);
          }
          if (options.candlelighting && eFlags & MASK_LIGHT_CANDLES) {
            candlesEv = makeCandleEvent(e, hd, dow, location, timeFormat, candleLightingMinutes, havdalahMinutes);
          }
        }
      }
    }
    if (options.sedrot && dow == SAT) {
      const parsha0 = sedra.lookup(abs);
      if (!parsha0.chag) {
        events.push(new ParshaEvent(hd, parsha0.parsha));
      }
    }
    if (options.dafyomi) {
      const dy = dafyomi.dafyomi(g.abs2greg(abs));
      events.push(new DafYomiEvent(hd, dy));
    }
    if (options.omer && abs >= beginOmer && abs <= endOmer) {
      const omer = abs - beginOmer + 1;
      events.push(new OmerEvent(hd, omer));
    }
    const hmonth = hd.getMonth();
    if (options.molad && dow == SAT && hmonth != months.ELUL && hd.getDate() >= 23 && hd.getDate() <= 29) {
      const monNext = (hmonth == common.monthsInHebYear(hyear) ? months.NISAN : hmonth + 1);
      events.push(new MoladEvent(hd, hyear, monNext));
    }
    if (!candlesEv && options.candlelighting && (dow == FRI || dow == SAT)) {
      candlesEv = makeCandleEvent(undefined, hd, dow, location, timeFormat, candleLightingMinutes, havdalahMinutes);
    }
    // suppress Havdalah when options.havdalahMins=0
    if (candlesEv instanceof HavdalahEvent && typeof options.havdalahMins == 'number' && havdalahMinutes === 0) {
      candlesEv = null;
    }
    if (candlesEv) {
      events.push(candlesEv);
    }
    if (options.addHebrewDates ||
      (options.addHebrewDatesForEvents && prevEventsLength != events.length)) {
      const e2 = new HebrewDateEvent(hd);
      if (prevEventsLength == events.length) {
        events.push(e2);
      } else {
        events.splice(prevEventsLength, 0, e2);
      }
    }
  }

  return events;
}
