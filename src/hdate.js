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
import {greg as g} from './greg';
import {mod} from './greg';
import {gematriya} from './gematriya';
import {Locale} from './locale';

const NISAN = 1;
const IYYAR = 2;
const SIVAN = 3;
const TAMUZ = 4;
const AV = 5;
const ELUL = 6;
const TISHREI = 7;
const CHESHVAN = 8;
const KISLEV = 9;
const TEVET = 10;
const SHVAT = 11;
const ADAR_I = 12;
const ADAR_II = 13;

/**
 * Hebrew months of the year (NISAN=1, TISHREI=7)
 * @readonly
 * @enum {number}
 */
export const months = {
  /** Nissan / ניסן */
  NISAN: 1,
  /** Iyyar / אייר */
  IYYAR: 2,
  /** Sivan / סיון */
  SIVAN: 3,
  /** Tamuz (sometimes Tammuz) / תמוז */
  TAMUZ: 4,
  /** Av / אב */
  AV: 5,
  /** Elul / אלול */
  ELUL: 6,
  /** Tishrei / תִשְׁרֵי */
  TISHREI: 7,
  /** Cheshvan / חשון */
  CHESHVAN: 8,
  /** Kislev / כסלו */
  KISLEV: 9,
  /** Tevet / טבת */
  TEVET: 10,
  /** Sh'vat / שבט */
  SHVAT: 11,
  /** Adar or Adar Rishon / אדר */
  ADAR_I: 12,
  /** Adar Sheini (only on leap years) / אדר ב׳ */
  ADAR_II: 13,
};

const monthNames0 = [
  '',
  'Nisan',
  'Iyyar',
  'Sivan',
  'Tamuz',
  'Av',
  'Elul',
  'Tishrei',
  'Cheshvan',
  'Kislev',
  'Tevet',
  'Sh\'vat',
];

/**
 * Transliterations of Hebrew month names.
 * Regular years are index 0 and leap years are index 1.
 * @private
 */
const monthNames = [
  monthNames0.concat([
    'Adar',
    'Nisan',
  ]),
  monthNames0.concat([
    'Adar I',
    'Adar II',
    'Nisan',
  ]),
];

// eslint-disable-next-line require-jsdoc
function throwTypeError(msg) {
  throw new TypeError(msg);
}

const edCache = Object.create(null);

const EPOCH = -1373428;
// Avg year length in the cycle (19 solar years with 235 lunar months)
const AVG_HEBYEAR_DAYS = 365.24682220597794;

const UNITS_DAY = 'day';
const UNITS_WEEK = 'week';
const UNITS_MONTH = 'month';
const UNITS_YEAR = 'year';
const UNITS_SINGLE = {d: UNITS_DAY, w: UNITS_WEEK, M: UNITS_MONTH, y: UNITS_YEAR};
const UNITS_VALID = {day: UNITS_DAY, week: UNITS_WEEK, month: UNITS_MONTH, year: UNITS_YEAR};

/**
 * A simple Hebrew date object with numeric fields `yy`, `mm`, and `dd`
 * @typedef {Object} SimpleHebrewDate
 * @property {number} yy Hebrew year
 * @property {number} mm Hebrew month of year (1=NISAN, 7=TISHREI)
 * @property {number} dd Day of month (1-30)
 * @private
 */

/** Represents a Hebrew date */
export class HDate {
  /**
   * Create a Hebrew date. There are 3 basic forms for the `HDate()` constructor.
   *
   * 1. No parameters - represents the current Hebrew date at time of instantiation
   * 2. One parameter
   *    * `Date` - represents the Hebrew date corresponding to the Gregorian date using
   *       local time. Hours, minutes, seconds and milliseconds are ignored.
   *    * `HDate` - clones a copy of the given Hebrew date
   *    * `number` - Converts absolute R.D. days to Hebrew date.
   *       R.D. 1 == the imaginary date January 1, 1 (Gregorian)
   * 3. Three parameters: Hebrew day, Hebrew month, Hebrew year. Hebrew day should
   *    be a number between 1-30, Hebrew month can be a number or string, and
   *    Hebrew year is always a number.
   * @example
   * import {HDate, months} from '@hebcal/core';
   *
   * const hd1 = new HDate();
   * const hd2 = new HDate(new Date(2008, 10, 13));
   * const hd3 = new HDate(15, 'Cheshvan', 5769);
   * const hd4 = new HDate(15, months.CHESHVAN, 5769);
   * const hd5 = new HDate(733359); // ==> 15 Cheshvan 5769
   * const monthName = 'אייר';
   * const hd6 = new HDate(5, monthName, 5773);
   * @param {number|Date|HDate} [day] - Day of month (1-30) if a `number`.
   *   If a `Date` is specified, represents the Hebrew date corresponding to the
   *   Gregorian date using local time.
   *   If an `HDate` is specified, clones a copy of the given Hebrew date.
   * @param {number|string} [month] - Hebrew month of year (1=NISAN, 7=TISHREI)
   * @param {number} [year] - Hebrew year
   */
  constructor(day, month, year) {
    if (arguments.length == 2 || arguments.length > 3) {
      throw new TypeError('HDate constructor requires 0, 1 or 3 arguments');
    }
    if (arguments.length == 3) {
      // Hebrew day, Hebrew month, Hebrew year
      /**
       * @private
       * @type {number}
       */
      this.day = this.month = 1;
      /**
       * @private
       * @type {number}
       */
      this.year = +year;
      if (isNaN(this.year)) {
        throw new TypeError(`HDate called with bad year argument: ${year}`);
      }
      this.setMonth(month); // will throw if we can't parse
      this.setDate(+day);
      if (isNaN(this.day)) {
        throw new TypeError(`HDate called with bad day argument: ${day}`);
      }
    } else {
      // 0 arguments
      if (typeof day === 'undefined') {
        day = new Date();
      }
      // 1 argument
      const abs0 = (typeof day === 'number' && !isNaN(day)) ? day :
        g.isDate(day) ? g.greg2abs(day) :
        HDate.isHDate(day) ? {dd: day.day, mm: day.month, yy: day.year} :
        throwTypeError(`HDate called with bad argument: ${day}`);
      const isNumber = typeof abs0 === 'number';
      const d = isNumber ? HDate.abs2hebrew(abs0) : abs0;
      /**
       * @private
       * @type {number}
       */
      this.day = d.dd;
      /**
       * @private
       * @type {number}
       */
      this.month = d.mm;
      /**
       * @private
       * @type {number}
       */
      this.year = d.yy;
      if (isNumber) {
        /**
         * @private
         * @type {number}
         */
        this.abs0 = abs0;
      }
    }
  }

  /**
   * Gets the Hebrew year of this Hebrew date
   * @return {number}
   */
  getFullYear() {
    return this.year;
  }

  /**
   * Tests if this date occurs during a leap year
   * @return {boolean}
   */
  isLeapYear() {
    return HDate.isLeapYear(this.year);
  }

  /**
   * Gets the Hebrew month (1=NISAN, 7=TISHREI) of this Hebrew date
   * @return {number}
   */
  getMonth() {
    return this.month;
  }

  /**
   * The Tishrei-based month of the date. 1 is Tishrei, 7 is Nisan, 13 is Elul in a leap year
   * @return {number}
   */
  getTishreiMonth() {
    const nummonths = HDate.monthsInYear(this.getFullYear());
    return (this.getMonth() + nummonths - 6) % nummonths || nummonths;
  }

  /**
   * Number of days in the month of this Hebrew date
   * @return {number}
   */
  daysInMonth() {
    return HDate.daysInMonth(this.getMonth(), this.getFullYear());
  }

  /**
   * Gets the day within the month (1-30)
   * @return {number}
   */
  getDate() {
    return this.day;
  }

  /**
   * Gets the day of the week. 0=Sunday, 6=Saturday
   * @return {number}
   */
  getDay() {
    return mod(this.abs(), 7);
  }

  /**
   * Sets the year of the date. Returns the object it was called upon.
   * @private
   * @deprecated
   * @param {number} year
   * @return {HDate}
   */
  setFullYear(year) {
    this.year = year;
    fix(this);
    return this;
  }

  /**
   * Sets the day of the month of the date. Returns the object it was called upon
   * @private
   * @param {number} month
   * @return {HDate}
   */
  setMonth(month) {
    this.month = HDate.monthNum(month);
    fix(this);
    return this;
  }

  /**
   * @private
   * @param {number} date
   * @return {HDate}
   */
  setDate(date) {
    this.day = date;
    fix(this);
    return this;
  }

  /**
   * Converts to Gregorian date
   * @return {Date}
   */
  greg() {
    return g.abs2greg(this.abs());
  }

  /**
   * Returns R.D. (Rata Die) fixed days.
   * R.D. 1 == Monday, January 1, 1 (Gregorian)
   * Note also that R.D. = Julian Date − 1,721,424.5
   * https://en.wikipedia.org/wiki/Rata_Die#Dershowitz_and_Reingold
   * @return {number}
   */
  abs() {
    if (typeof this.abs0 !== 'number') {
      this.abs0 = HDate.hebrew2abs(this.year, this.month, this.day);
    }
    return this.abs0;
  }

  /**
   * Converts Hebrew date to R.D. (Rata Die) fixed days.
   * R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
   * Calendar.
   * @param {number} year Hebrew year
   * @param {number} month Hebrew month
   * @param {number} day Hebrew date (1-30)
   * @return {number}
   */
  static hebrew2abs(year, month, day) {
    let tempabs = day;

    if (month < TISHREI) {
      for (let m = TISHREI; m <= HDate.monthsInYear(year); m++) {
        tempabs += HDate.daysInMonth(m, year);
      }
      for (let m = NISAN; m < month; m++) {
        tempabs += HDate.daysInMonth(m, year);
      }
    } else {
      for (let m = TISHREI; m < month; m++) {
        tempabs += HDate.daysInMonth(m, year);
      }
    }

    return EPOCH + HDate.elapsedDays(year) + tempabs - 1;
  }

  /**
   * @private
   * @param {number} year
   * @return {number}
   */
  static newYear(year) {
    return EPOCH + HDate.elapsedDays(year) + HDate.newYearDelay(year);
  }

  /**
   * @private
   * @param {number} year
   * @return {number}
   */
  static newYearDelay(year) {
    const ny1 = HDate.elapsedDays(year);
    const ny2 = HDate.elapsedDays(year + 1);
    if (ny2 - ny1 === 356) {
      return 2;
    } else {
      const ny0 = HDate.elapsedDays(year - 1);
      return ny1 - ny0 === 382 ? 1 : 0;
    }
  }

  /**
   * Converts absolute R.D. days to Hebrew date
   * @private
   * @param {number} abs absolute R.D. days
   * @return {SimpleHebrewDate}
   */
  static abs2hebrew(abs) {
    if (typeof abs !== 'number' || isNaN(abs)) {
      throw new TypeError(`invalid parameter to abs2hebrew ${abs}`);
    }
    abs = Math.trunc(abs);

    // first, quickly approximate year
    let year = Math.floor((abs - EPOCH) / AVG_HEBYEAR_DAYS);
    while (HDate.newYear(year) <= abs) {
      ++year;
    }
    --year;

    let month = abs < HDate.hebrew2abs(year, 1, 1) ? 7 : 1;
    while (abs > HDate.hebrew2abs(year, month, HDate.daysInMonth(month, year))) {
      ++month;
    }

    const day = 1 + abs - HDate.hebrew2abs(year, month, 1);
    return {yy: year, mm: month, dd: day};
  }

  /**
   * Returns a transliterated Hebrew month name, e.g. `'Elul'` or `'Cheshvan'`.
   * @return {string}
   */
  getMonthName() {
    return HDate.getMonthName(this.getMonth(), this.getFullYear());
  }

  /**
   * Renders this Hebrew date as a translated or transliterated string,
   * including ordinal e.g. `'15th of Cheshvan, 5769'`.
   * @example
   * import {HDate, months} from '@hebcal/core';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * console.log(hd.render()); // '15th of Cheshvan, 5769'
   * console.log(hd.render('he')); // '15 חֶשְׁוָן, 5769'
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @param {boolean} [showYear=true] Display year (defaults to true).
   * @return {string}
   */
  render(locale=null, showYear=true) {
    const locale0 = locale || Locale.getLocaleName();
    const day = this.getDate();
    const monthName = Locale.gettext(this.getMonthName(), locale0);
    const nth = Locale.ordinal(day, locale0);
    const dayOf = HDate.getDayOfTranslation(locale0);
    const dateStr = `${nth}${dayOf} ${monthName}`;
    if (showYear) {
      const fullYear = this.getFullYear();
      return `${dateStr}, ${fullYear}`;
    } else {
      return dateStr;
    }
  }

  /**
   * @private
   * @param {string} locale
   * @return {string}
   */
  static getDayOfTranslation(locale) {
    switch (locale) {
      case 'en':
      case 's':
      case 'a':
      case 'ashkenazi':
        return ' of';
      default:
        break;
    }
    const ofStr = Locale.lookupTranslation('of', locale);
    if (ofStr) {
      return ' ' + ofStr;
    }
    if ('ashkenazi' === locale.substring(0, 9)) {
      return ' of';
    }
    return '';
  }

  /**
   * Renders this Hebrew date in Hebrew gematriya, regardless of locale.
   * @example
   * import {HDate, months} from '@hebcal/core';
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * console.log(ev.renderGematriya()); // 'ט״ו חֶשְׁוָן תשס״ט'
   * @return {string}
   */
  renderGematriya() {
    const d = this.getDate();
    const m = Locale.gettext(this.getMonthName(), 'he');
    const y = this.getFullYear();
    return gematriya(d) + ' ' + m + ' ' + gematriya(y);
  }

  /**
   * Returns an `HDate` representing the a dayNumber before the current date.
   * Sunday=0, Saturday=6
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).before(6).greg() // Sat Feb 15 2014
   * @param {number} day day of week
   * @return {HDate}
   */
  before(day) {
    return onOrBefore(day, this, -1);
  }

  /**
   * Returns an `HDate` representing the a dayNumber on or before the current date.
   * Sunday=0, Saturday=6
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).onOrBefore(6).greg() // Sat Feb 15 2014
   * new HDate(new Date('Saturday February 22, 2014')).onOrBefore(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Sunday February 23, 2014')).onOrBefore(6).greg() // Sat Feb 22 2014
   * @param {number} dow day of week
   * @return {HDate}
   */
  onOrBefore(dow) {
    return onOrBefore(dow, this, 0);
  }

  /**
   * Returns an `HDate` representing the nearest dayNumber to the current date
   * Sunday=0, Saturday=6
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).nearest(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Tuesday February 18, 2014')).nearest(6).greg() // Sat Feb 15 2014
   * @param {number} dow day of week
   * @return {HDate}
   */
  nearest(dow) {
    return onOrBefore(dow, this, 3);
  }

  /**
   * Returns an `HDate` representing the a dayNumber on or after the current date.
   * Sunday=0, Saturday=6
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).onOrAfter(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Saturday February 22, 2014')).onOrAfter(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Sunday February 23, 2014')).onOrAfter(6).greg() // Sat Mar 01 2014
   * @param {number} dow day of week
   * @return {HDate}
   */
  onOrAfter(dow) {
    return onOrBefore(dow, this, 6);
  }

  /**
   * Returns an `HDate` representing the a dayNumber after the current date.
   * Sunday=0, Saturday=6
   * @example
   * new HDate(new Date('Wednesday February 19, 2014')).after(6).greg() // Sat Feb 22 2014
   * new HDate(new Date('Saturday February 22, 2014')).after(6).greg() // Sat Mar 01 2014
   * new HDate(new Date('Sunday February 23, 2014')).after(6).greg() // Sat Mar 01 2014
   * @param {number} day day of week
   * @return {HDate}
   */
  after(day) {
    return onOrBefore(day, this, 7);
  }

  /**
   * Returns the next Hebrew date
   * @return {HDate}
   */
  next() {
    return new HDate(this.abs() + 1);
  }

  /**
   * Returns the previous Hebrew date
   * @return {HDate}
   */
  prev() {
    return new HDate(this.abs() - 1);
  }

  /**
   * Returns a cloned `HDate` object with a specified amount of time added
   *
   * Units are case insensitive, and support plural and short forms.
   * Note, short forms are case sensitive.
   *
   * | Unit | Shorthand | Description
   * | --- | --- | --- |
   * | `day` | `d` | days |
   * | `week` | `w` | weeks |
   * | `month` | `M` | months |
   * | `year` | `y` | years |
   * @param {number} number
   * @param {string} [units]
   * @return {HDate}
   */
  add(number, units='d') {
    number = parseInt(number, 10);
    if (!number) {
      return new HDate(this);
    }
    units = HDate.standardizeUnits(units);
    if (units === UNITS_DAY) {
      return new HDate(this.abs() + number);
    } else if (units === UNITS_WEEK) {
      return new HDate(this.abs() + (7 * number));
    } else if (units === UNITS_YEAR) {
      return new HDate(this.getDate(), this.getMonth(), this.getFullYear() + number);
    } else if (units === UNITS_MONTH) {
      let hd = new HDate(this);
      const sign = number > 0 ? 1 : -1;
      number = Math.abs(number);
      for (let i = 0; i < number; i++) {
        hd = new HDate(hd.abs() + (sign * hd.daysInMonth()));
      }
      return hd;
    }
  }

  /**
   * @private
   * @param {string} units
   * @return {string}
   */
  static standardizeUnits(units) {
    const full = UNITS_SINGLE[units] || String(units || '').toLowerCase().replace(/s$/, '');
    return UNITS_VALID[full] || throwTypeError(`Invalid units '${units}'`);
  }

  /**
   * Returns a cloned `HDate` object with a specified amount of time subracted
   *
   * Units are case insensitive, and support plural and short forms.
   * Note, short forms are case sensitive.
   *
   * | Unit | Shorthand | Description
   * | --- | --- | --- |
   * | `day` | `d` | days |
   * | `week` | `w` | weeks |
   * | `month` | `M` | months |
   * | `year` | `y` | years |
   * @example
   * import {HDate, months} from '@hebcal/core';
   *
   * const hd1 = new HDate(15, months.CHESHVAN, 5769);
   * const hd2 = hd1.add(1, 'weeks'); // 7 Kislev 5769
   * const hd3 = hd1.add(-3, 'M'); // 30 Av 5768
   * @param {number} number
   * @param {string} [units]
   * @return {HDate}
   */
  subtract(number, units='d') {
    return this.add(number * -1, units);
  }

  /**
   * Returns the difference in days between the two given HDates.
   *
   * The result is positive if `this` date is comes chronologically
   * after the `other` date, and negative
   * if the order of the two dates is reversed.
   *
   * The result is zero if the two dates are identical.
   * @example
   * import {HDate, months} from '@hebcal/core';
   *
   * const hd1 = new HDate(25, months.KISLEV, 5770);
   * const hd2 = new HDate(15, months.CHESHVAN, 5769);
   * const days = hd1.deltaDays(hd2); // 394
   * @param {HDate} other Hebrew date to compare
   * @return {number}
   */
  deltaDays(other) {
    if (!HDate.isHDate(other)) {
      throw new TypeError(`Bad argument: ${other}`);
    }
    return this.abs() - other.abs();
  }

  /**
   * Compares this date to another date, returning `true` if the dates match.
   * @param {HDate} other Hebrew date to compare
   * @return {boolean}
   */
  isSameDate(other) {
    if (HDate.isHDate(other)) {
      return this.year == other.year &&
        this.month == other.month &&
        this.day == other.day;
    }
    return false;
  }

  /** @return {string} */
  toString() {
    const day = this.getDate();
    const fullYear = this.getFullYear();
    const monthName = this.getMonthName();
    return `${day} ${monthName} ${fullYear}`;
  }

  /**
   * Returns true if Hebrew year is a leap year
   * @param {number} year Hebrew year
   * @return {boolean}
   */
  static isLeapYear(year) {
    return (1 + year * 7) % 19 < 7;
  }

  /**
   * Number of months in this Hebrew year (either 12 or 13 depending on leap year)
   * @param {number} year Hebrew year
   * @return {number}
   */
  static monthsInYear(year) {
    return 12 + HDate.isLeapYear(year); // boolean is cast to 1 or 0
  }

  /**
   * Number of days in Hebrew month in a given year (29 or 30)
   * @param {number} month Hebrew month (e.g. months.TISHREI)
   * @param {number} year Hebrew year
   * @return {number}
   */
  static daysInMonth(month, year) {
    if (month == IYYAR ||
      month == TAMUZ ||
      month == ELUL ||
      month == TEVET ||
      month == ADAR_II ||
      (month == ADAR_I && !HDate.isLeapYear(year)) ||
      (month == CHESHVAN && !HDate.longCheshvan(year)) ||
      (month == KISLEV && HDate.shortKislev(year))) {
      return 29;
    } else {
      return 30;
    }
  }

  /**
   * Returns a transliterated string name of Hebrew month in year,
   * for example 'Elul' or 'Cheshvan'.
   * @param {number} month Hebrew month (e.g. months.TISHREI)
   * @param {number} year Hebrew year
   * @return {string}
   */
  static getMonthName(month, year) {
    if (typeof month !== 'number' || month < 1 || month > 14) {
      throw new TypeError(`bad month argument ${month}`);
    }
    return monthNames[+HDate.isLeapYear(year)][month];
  }

  /**
   * Returns the Hebrew month number (NISAN=1, TISHREI=7)
   * @param {number|string} month A number, or Hebrew month name string
   * @return {number}
   */
  static monthNum(month) {
    return typeof month === 'number' ?
    month :
    month.charCodeAt(0) >= 48 && month.charCodeAt(0) <= 57 ? /* number */
    parseInt(month, 10) :
    HDate.monthFromName(month);
  }

  /**
   * Days from sunday prior to start of Hebrew calendar to mean
   * conjunction of Tishrei in Hebrew YEAR
   * @param {number} year Hebrew year
   * @return {number}
   */
  static elapsedDays(year) {
    const elapsed = edCache[year] = edCache[year] || HDate.elapsedDays0(year);
    return elapsed;
  }

  /**
   * Days from sunday prior to start of Hebrew calendar to mean
   * conjunction of Tishrei in Hebrew YEAR
   * @private
   * @param {number} year Hebrew year
   * @return {number}
   */
  static elapsedDays0(year) {
    const prevYear = year - 1;
    const mElapsed = 235 * Math.floor(prevYear / 19) + // Months in complete 19 year lunar (Metonic) cycles so far
      12 * (prevYear % 19) + // Regular months in this cycle
      Math.floor(((prevYear % 19) * 7 + 1) / 19); // Leap months this cycle

    const pElapsed = 204 + 793 * (mElapsed % 1080);

    const hElapsed = 5 +
      12 * mElapsed +
      793 * Math.floor(mElapsed / 1080) +
      Math.floor(pElapsed / 1080);

    const parts = (pElapsed % 1080) + 1080 * (hElapsed % 24);

    const day = 1 + 29 * mElapsed + Math.floor(hElapsed / 24);
    const altDay = day +
      (parts >= 19440 ||
        (2 == day % 7 && parts >= 9924 && !HDate.isLeapYear(year)) ||
        (1 == day % 7 && parts >= 16789 && HDate.isLeapYear(prevYear)));

    return altDay + (altDay % 7 === 0 || altDay % 7 == 3 || altDay % 7 == 5);
  }

  /**
   * Number of days in the hebrew YEAR
   * @param {number} year Hebrew year
   * @return {number}
   */
  static daysInYear(year) {
    return HDate.elapsedDays(year + 1) - HDate.elapsedDays(year);
  }

  /**
   * true if Cheshvan is long in Hebrew year
   * @param {number} year Hebrew year
   * @return {boolean}
   */
  static longCheshvan(year) {
    return HDate.daysInYear(year) % 10 == 5;
  }

  /**
   * true if Kislev is short in Hebrew year
   * @param {number} year Hebrew year
   * @return {boolean}
   */
  static shortKislev(year) {
    return HDate.daysInYear(year) % 10 == 3;
  }

  /**
   * Converts Hebrew month string name to numeric
   * @param {string} monthName monthName
   * @return {number}
   */
  static monthFromName(monthName) {
    if (typeof monthName === 'number') return monthName;
    const c = monthName.toLowerCase();
    /*
    the Hebrew months are unique to their second letter
    N         Nisan  (November?)
    I         Iyyar
    E        Elul
    C        Cheshvan
    K        Kislev
    1        1Adar
    2        2Adar
    Si Sh     Sivan, Shvat
    Ta Ti Te Tamuz, Tishrei, Tevet
    Av Ad    Av, Adar

    אב אד אי אל   אב אדר אייר אלול
    ח            חשון
    ט            טבת
    כ            כסלו
    נ            ניסן
    ס            סיון
    ש            שבט
    תמ תש        תמוז תשרי
    */
    switch (c[0]) {
      case 'n':
      case 'נ':
        if (c[1] == 'o') {
          break; /* this catches "november" */
        }
        return NISAN;
      case 'i':
        return IYYAR;
      case 'e':
        return ELUL;
      case 'c':
      case 'ח':
        return CHESHVAN;
      case 'k':
      case 'כ':
        return KISLEV;
      case 's':
        switch (c[1]) {
          case 'i':
            return SIVAN;
          case 'h':
            return SHVAT;
          default:
            break;
        }
      case 't':
        switch (c[1]) {
          case 'a':
            return TAMUZ;
          case 'i':
            return TISHREI;
          case 'e':
            return TEVET;
        }
        break;
      case 'a':
        switch (c[1]) {
          case 'v':
            return AV;
          case 'd':
            if (/(1|[^i]i|a|א)$/i.test(monthName)) {
              return ADAR_I;
            }
            return ADAR_II; // else assume sheini
        }
        break;
      case 'ס':
        return SIVAN;
      case 'ט':
        return TEVET;
      case 'ש':
        return SHVAT;
      case 'א':
        switch (c[1]) {
          case 'ב':
            return AV;
          case 'ד':
            if (/(1|[^i]i|a|א)$/i.test(monthName)) {
              return ADAR_I;
            }
            return ADAR_II; // else assume sheini
          case 'י':
            return IYYAR;
          case 'ל':
            return ELUL;
        }
        break;
      case 'ת':
        switch (c[1]) {
          case 'מ':
            return TAMUZ;
          case 'ש':
            return TISHREI;
        }
        break;
    }
    throw new RangeError(`Unable to parse month name: ${monthName}`);
  }

  /**
   * Note: Applying this function to d+6 gives us the DAYNAME on or after an
   * absolute day d. Similarly, applying it to d+3 gives the DAYNAME nearest to
   * absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
   * date d, and applying it to d+7 gives the DAYNAME following absolute date d.
   * @param {number} dayOfWeek
   * @param {number} absdate
   * @return {number}
   */
  static dayOnOrBefore(dayOfWeek, absdate) {
    return absdate - ((absdate - dayOfWeek) % 7);
  }

  /**
   * Tests if the object is an instance of `HDate`
   * @param {any} obj
   * @return {boolean}
   */
  static isHDate(obj) {
    return obj !== null && typeof obj === 'object' &&
      typeof obj.year === 'number' &&
      typeof obj.month === 'number' &&
      typeof obj.day === 'number' &&
      typeof obj.greg === 'function' &&
      typeof obj.abs === 'function';
  }
}

/**
 * @private
 * @param {HDate} date
 */
function fix(date) {
  fixMonth(date);
  fixDate(date);
}

/**
 * @private
 * @param {HDate} date
 */
function fixDate(date) {
  if (date.day < 1) {
    if (date.month == TISHREI) {
      date.year -= 1;
    }
    date.day += HDate.daysInMonth(date.month, date.year);
    date.month -= 1;
    fix(date);
  }
  if (date.day > HDate.daysInMonth(date.month, date.year)) {
    if (date.month == ELUL) {
      date.year += 1;
    }
    date.day -= HDate.daysInMonth(date.month, date.year);
    date.month += 1;
    fix(date);
  }
  fixMonth(date);
}

/**
 * @private
 * @param {HDate} date
 */
function fixMonth(date) {
  if (date.month == ADAR_II && !date.isLeapYear()) {
    date.month -= 1; // to Adar I
    fix(date);
  } else if (date.month < 1) {
    date.month += HDate.monthsInYear(date.year);
    date.year -= 1;
    fix(date);
  } else if (date.month > HDate.monthsInYear(date.year)) {
    date.month -= HDate.monthsInYear(date.year);
    date.year += 1;
    fix(date);
  }
  delete date.abs0;
}

/**
 * @private
 * @param {number} day
 * @param {HDate} t
 * @param {number} offset
 * @return {HDate}
 */
function onOrBefore(day, t, offset) {
  return new HDate(HDate.dayOnOrBefore(day, t.abs() + offset));
}
