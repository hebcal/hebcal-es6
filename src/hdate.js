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
import {common as c} from './common';
import {greg as g} from './greg';
import {Event, flags} from './event';
import gematriya from 'gematriya';
import {locale as l} from './locale';

/** Class representing a Hebrew date */
export class HDate {
  /**
   * Create a Hebrew date. There are 3 basic forms for the `HDate()` constructor.
   *
   * 1. No parameters - represents the current Hebrew date at time of instantiation
   * 2. One parameter
   *    * `Date` - represents the Hebrew date corresponding to the Gregorian date using
   *       local time. Hours, minutes, seconds and milliseconds are ignored.
   *    * `HDate` - clones a copy of the given Hebrew date
   *    * `number` - Converts absolute Julian days to Hebrew date. The absolute Julian
   *       date is the number of days elapsed since the (imaginary) Gregorian date
   *       Sunday, December 31, 1 BC
   * 3. Three parameters: Hebrew day, Hebrew month, Hebrew year. Hebrew day should
   *    be a number between 1-30, Hebrew month can be a number or string, and
   *    Hebrew year is always a number.
   * @example
   * import {HDate, common} from '@hebcal/core';
   *
   * const hd1 = new HDate();
   * const hd2 = new HDate(new Date(2008, 10, 13));
   * const hd3 = new HDate(15, 'Cheshvan', 5769);
   * const hd4 = new HDate(15, common.months.CHESHVAN, 5769);
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
    if (!arguments.length) {
      const d = abs2hebrew(g.greg2abs(new Date()));
      this.day = d.dd;
      this.month = d.mm;
      this.year = d.yy;
    } else if (arguments.length == 1) {
      if (day instanceof Date) {
        const d = abs2hebrew(g.greg2abs(day));
        this.day = d.dd;
        this.month = d.mm;
        this.year = d.yy;
      } else if (typeof day == 'number') {
        const d = abs2hebrew(day);
        this.day = d.dd;
        this.month = d.mm;
        this.year = d.yy;
      } else if (day instanceof HDate) {
        this.day = day.day;
        this.month = day.month;
        this.year = day.year;
      } else {
        throw new TypeError(`HDate called with bad argument: ${day}`);
      }
    } else if (arguments.length == 3) {
      // Hebrew day, Hebrew month, Hebrew year
      this.day = this.month = 1;
      this.year = Number(year);
      this.setMonth(c.monthNum(month));
      this.setDate(Number(day));
    } else {
      throw new TypeError('HDate constructor requires 0, 1 or 3 arguments');
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
    return c.hebLeapYear(this.year);
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
    const nummonths = c.monthsInHebYear(this.getFullYear());
    return (this.getMonth() + nummonths - 6) % nummonths || nummonths;
  }

  /**
   * Number of days in the month of this Hebrew date
   * @return {number}
   */
  daysInMonth() {
    return c.daysInHebMonth(this.getMonth(), this.getFullYear());
  }

  /**
   * Gets the day within the month (1-30)
   * @return {number}
   */
  getDate() {
    return this.day;
  }

  /**
   * Gets the day of the week, using local time. 0=Sunday, 6=Saturday
   * @return {number}
   */
  getDay() {
    return this.greg().getDay();
  }

  /**
   * Sets the year of the date. Returns the object it was called upon.
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
   * @param {number} month
   * @return {HDate}
   */
  setMonth(month) {
    this.month = c.monthNum(month);
    fix(this);
    return this;
  }

  /**
   * Sets the Tishrei-based month of the date. Returns the object it was called upon
   * @param {number} month
   * @return {HDate}
   */
  setTishreiMonth(month) {
    return this.setMonth((month + 6) % c.monthsInHebYear(this.getFullYear()) || 13);
  }

  /**
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
    return g.abs2greg(hebrew2abs(this));
  }

  /**
   * Returns Julian absolute days
   * @return {number}
   */
  abs() {
    return hebrew2abs(this);
  }

  /**
   * Returns a transliterated Hebrew month name, e.g. `'Elul'` or `'Cheshvan'`.
   * @return {string}
   */
  getMonthName() {
    return c.getMonthName(this.getMonth(), this.getFullYear());
  }

  /**
   * Renders this Hebrew date as a translated or transliterated string,
   * including ordinal e.g. `'15th of Cheshvan, 5769'`.
   * @example
   * import {HDate, common} from '@hebcal/core';
   *
   * const hd = new HDate(15, common.months.CHESHVAN, 5769);
   * console.log(hd.render()); // '15th of Cheshvan, 5769'
   * console.log(hd.render('he')); // '15 חֶשְׁוָן, 5769'
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || l.getLocaleName();
    const day = this.getDate();
    const fullYear = this.getFullYear();
    const monthName = l.gettext(this.getMonthName(), locale);
    const nth = l.ordinal(day);
    let dayOf = '';
    if (locale0 == 'en' || locale0.startsWith('ashkenazi')) {
      dayOf = ' of';
    } else {
      const ofStr = l.lookupTranslation('of', locale0);
      if (ofStr) {
        dayOf = ' ' + ofStr;
      }
    }
    return `${nth}${dayOf} ${monthName}, ${fullYear}`;
  }

  /**
   * Renders this Hebrew date in Hebrew gematriya, regardless of locale.
   * @example
   * import {HDate, common} from '@hebcal/core';
   * const hd = new HDate(15, common.months.CHESHVAN, 5769);
   * console.log(ev.renderGematriya()); // 'ט״ו חֶשְׁוָן תשס״ט'
   * @return {string}
   */
  renderGematriya() {
    const d = this.getDate();
    const m = l.gettext(this.getMonthName(), 'he');
    const y = this.getFullYear();
    return gematriya(d) + ' ' + m + ' ' + gematriya(y, {limit: 3});
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
   * Compares this date to another date, returning `true` if the dates match.
   * @param {HDate} other Hebrew date to compare
   * @return {boolean}
   */
  isSameDate(other) {
    if (other instanceof HDate) {
      if (other.getFullYear() == -1) {
        other = new HDate(other).setFullYear(this.getFullYear());
      }
      return this.abs() == other.abs();
    }
    return false;
  }

  /** @return {string} */
  toString() {
    const day = this.getDate();
    const fullYear = this.getFullYear();
    const monthName = this.getMonthName();
    return `${day} ${monthName} ${fullYear}`;
  };
}

// eslint-disable-next-line require-jsdoc
function fix(date) {
  fixMonth(date);
  fixDate(date);
}

// eslint-disable-next-line require-jsdoc
function fixDate(date) {
  if (date.day < 1) {
    if (date.month == c.months.TISHREI) {
      date.year -= 1;
    }
    date.day += c.daysInHebMonth(date.month, date.year);
    date.month -= 1;
    fix(date);
  }
  if (date.day > c.daysInHebMonth(date.month, date.year)) {
    if (date.month == c.months.ELUL) {
      date.year += 1;
    }
    date.day -= c.daysInHebMonth(date.month, date.year);
    date.month += 1;
    fix(date);
  }
  fixMonth(date);
}

// eslint-disable-next-line require-jsdoc
function fixMonth(date) {
  if (date.month == c.months.ADAR_II && !date.isLeapYear()) {
    date.month -= 1; // to Adar I
    fix(date);
  }
  if (date.month < 1) {
    date.month += c.monthsInHebYear(date.year);
    date.year -= 1;
    fix(date);
  }
  if (date.month > c.monthsInHebYear(date.year)) {
    date.month -= c.monthsInHebYear(date.year);
    date.year += 1;
    fix(date);
  }
}

// eslint-disable-next-line require-jsdoc
function onOrBefore(day, t, offset) {
  return new HDate(c.dayOnOrBefore(day, t.abs() + offset));
}

/**
 * A simple Hebrew date object with numeric fields `yy`, `mm`, and `dd`
 * @typedef {Object} SimpleHebrewDate
 * @property {number} yy Hebrew year
 * @property {number} mm Hebrew month of year (1=NISAN, 7=TISHREI)
 * @property {number} dd Day of month (1-30)
 */

/**
 * Converts Hebrew date to absolute Julian days.
 * The absolute date is the number of days elapsed since the (imaginary)
 * Gregorian date Sunday, December 31, 1 BC.
 * @private
 * @param {(HDate|SimpleHebrewDate)} d Hebrew Date
 * @return {number}
 */
export function hebrew2abs(d) {
  const isHDate = d instanceof HDate;
  let tempabs = isHDate ? d.getDate() : d.dd;
  const month = isHDate ? d.getMonth() : d.mm;
  const year = isHDate ? d.getFullYear() : d.yy;

  if (month < c.months.TISHREI) {
    for (let m = c.months.TISHREI; m <= c.monthsInHebYear(year); m++) {
      tempabs += c.daysInHebMonth(m, year);
    }

    for (let m = c.months.NISAN; m < month; m++) {
      tempabs += c.daysInHebMonth(m, year);
    }
  } else {
    for (let m = c.months.TISHREI; m < month; m++) {
      tempabs += c.daysInHebMonth(m, year);
    }
  }

  return c.hebElapsedDays(year) - 1373429 + tempabs;
}

/**
 * Converts absolute Julian days to Hebrew date
 * @private
 * @param {number} d absolute Julian days
 * @return {SimpleHebrewDate}
 */
export function abs2hebrew(d) {
  if (d >= 10555144) {
    throw new RangeError(`parameter to abs2hebrew ${d} out of range`);
  }

  const gregdate = g.abs2greg(d);
  let year = 3760 + gregdate.getFullYear();
  const hebdate = {
    dd: 1,
    mm: c.months.TISHREI,
    yy: -1,
  };

  while (hebdate.yy = year + 1, d >= hebrew2abs(hebdate)) {
    year++;
  }

  const mmap = [9, 10, 11, 12, 1, 2, 3, 4, 7, 7, 7, 8];
  let month;
  if (year > 4634 && year < 10666) {
    // optimize search
    month = mmap[gregdate.getMonth()];
  } else {
    // we're outside the usual range, so assume nothing about Hebrew/Gregorian calendar drift...
    month = c.months.TISHREI;
  }

  while (hebdate.mm = month,
  hebdate.dd = c.daysInHebMonth(month, year),
  hebdate.yy = year,
  d > hebrew2abs(hebdate)) {
    month = (month % c.monthsInHebYear(year)) + 1;
  }

  hebdate.dd = 1;
  const day = d - hebrew2abs(hebdate) + 1;
  hebdate.dd = day;

  return hebdate;
}

/** Daily Hebrew date ("11th of Sivan, 5780") */
export class HebrewDateEvent extends Event {
  /**
   * @param {HDate} date
   */
  constructor(date) {
    super(date, date.toString(), flags.HEBREW_DATE);
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @example
   * import {HDate, HebrewDateEvent, common} from '@hebcal/core';
   *
   * const hd = new HDate(15, common.months.CHESHVAN, 5769);
   * const ev = new HebrewDateEvent(hd);
   * console.log(ev.render()); // '15th of Cheshvan, 5769'
   * console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || l.getLocaleName();
    const hd = this.getDate();
    return locale0 == 'he' ? hd.renderGematriya() : hd.render(locale0);
  }
  /**
   * Helper function to render a Hebrew date
   * @param {number} day
   * @param {string} monthName
   * @param {number} fullYear
   * @return {string}
   */
  static renderHebrew(day, monthName, fullYear) {
    return gematriya(day) + ' ' + monthName + ' ' + gematriya(fullYear, {limit: 3});
  }
}
