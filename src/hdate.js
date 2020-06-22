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
  dayOnOrBefore, daysInHebMonth, getMonthName,
  hebElapsedDays, hebLeapYear,
  monthNum, months, monthsInHebYear,
} from './common';
import {greg2abs, abs2greg} from './greg';
import {Event, flags} from './event';
import gematriya from 'gematriya';
import numeral from 'numeral';
import {gettext} from './locale';

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
   * const hd = new HDate();
   * const hd = new HDate(new Date(2008, 10, 13));
   * const hd = new HDate(15, 'Cheshvan', 5769);
   * const hd = new HDate(5, 'אייר', 5773);
   * const hd = new HDate(733359); // ==> 15 Cheshvan 5769
   * @param {number|Date|HDate} [day] - Day of month (1-30) if a `number`.
   *   If a `Date` is specified, represents the Hebrew date corresponding to the
   *   Gregorian date using local time.
   *   If an `HDate` is specified, clones a copy of the given Hebrew date.
   * @param {number} [month] - Hebrew month of year (1=NISAN, 7=TISHREI)
   * @param {number} [year] - Hebrew year
   */
  constructor(day, month, year) {
    if (!arguments.length) {
      const d = abs2hebrew(greg2abs(new Date()));
      this.day = d.dd;
      this.month = d.mm;
      this.year = d.yy;
    } else if (arguments.length == 1) {
      if (day instanceof Date) {
        const d = abs2hebrew(greg2abs(day));
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
      this.setMonth(monthNum(month));
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
    return hebLeapYear(this.year);
  }

  /**
   * Gets the Hebrew month (1=NISAN, 7=TISHREI) of this Hebrew date
   * @return {number}
   */
  getMonth() {
    return this.month;
  }

  /** @return {number} */
  getTishreiMonth() {
    const nummonths = monthsInHebYear(this.getFullYear());
    return (this.getMonth() + nummonths - 6) % nummonths || nummonths;
  }

  /**
   * Number of days in the month of this Hebrew date
   * @return {number}
   */
  daysInMonth() {
    return daysInHebMonth(this.getMonth(), this.getFullYear());
  }

  /**
   * Gets the day within the month (1-30)
   * @return {number}
   */
  getDate() {
    return this.day;
  }

  /**
   * Gets the day of the week, using local time.
   * @return {number}
   */
  getDay() {
    return this.greg().getDay();
  }

  /**
   * @param {number} year
   * @return {HDate}
   */
  setFullYear(year) {
    this.year = year;
    fix(this);
    return this;
  }

  /**
   * @param {number} month
   * @return {HDate}
   */
  setMonth(month) {
    this.month = monthNum(month);
    fix(this);
    return this;
  }

  /**
   * @param {number} month
   * @return {HDate}
   */
  setTishreiMonth(month) {
    return this.setMonth((month + 6) % monthsInHebYear(this.getFullYear()) || 13);
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
    return abs2greg(hebrew2abs(this));
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
    return getMonthName(this.getMonth(), this.getFullYear());
  }

  /**
   * Returns translated/transliterated Hebrew date, e.g. `'15 Cheshvan 5769'`.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const day = this.getDate();
    const fullYear = this.getFullYear();
    const monthName = gettext(this.getMonthName(), locale);
    return `${day} ${monthName} ${fullYear}`;
  }

  /**
   *
   * @param {number} day day of week
   * @return {HDate}
   */
  before(day) {
    return onOrBefore(day, this, -1);
  }

  /**
   *
   * @param {number} day day of week
   * @return {HDate}
   */
  onOrBefore(day) {
    return onOrBefore(day, this, 0);
  }

  /**
   *
   * @param {number} day day of week
   * @return {HDate}
   */
  nearest(day) {
    return onOrBefore(day, this, 3);
  }

  /**
   *
   * @param {number} day day of week
   * @return {HDate}
   */
  onOrAfter(day) {
    return onOrBefore(day, this, 6);
  }

  /**
   *
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
}

HDate.prototype.toString = function hdateToString() {
  const day = this.getDate();
  const fullYear = this.getFullYear();
  const monthName = this.getMonthName();
  return `${day} ${monthName} ${fullYear}`;
};


// eslint-disable-next-line require-jsdoc
function fix(date) {
  fixMonth(date);
  fixDate(date);
}

// eslint-disable-next-line require-jsdoc
function fixDate(date) {
  if (date.day < 1) {
    if (date.month == months.TISHREI) {
      date.year -= 1;
    }
    date.day += daysInHebMonth(date.month, date.year);
    date.month -= 1;
    fix(date);
  }
  if (date.day > daysInHebMonth(date.month, date.year)) {
    if (date.month == months.ELUL) {
      date.year += 1;
    }
    date.day -= daysInHebMonth(date.month, date.year);
    date.month += 1;
    fix(date);
  }
  fixMonth(date);
}

// eslint-disable-next-line require-jsdoc
function fixMonth(date) {
  if (date.month == months.ADAR_II && !date.isLeapYear()) {
    date.month -= 1; // to Adar I
    fix(date);
  }
  if (date.month < 1) {
    date.month += monthsInHebYear(date.year);
    date.year -= 1;
    fix(date);
  }
  if (date.month > monthsInHebYear(date.year)) {
    date.month -= monthsInHebYear(date.year);
    date.year += 1;
    fix(date);
  }
}

/**
 * @param {number} day
 * @param {HDate} t
 * @param {number} offset
 * @return {HDate}
 */
function onOrBefore(day, t, offset) {
  return new HDate(dayOnOrBefore(day, t.abs() + offset));
}

/**
 * A simple Hebrew date
 * @typedef {Object} SimpleHebrewDate
 * @property {number} yy Hebrew year
 * @property {number} mm Hebrew month of year (1=NISAN, 7=TISHREI)
 * @property {number} dd Day of month (1-30)
 */

/**
 * Converts Hebrew date to absolute Julian days.
 * The absolute date is the number of days elapsed since the (imaginary)
 * Gregorian date Sunday, December 31, 1 BC.
 * @param {(HDate|SimpleHebrewDate)} d Hebrew Date
 * @return {number}
 */
export function hebrew2abs(d) {
  const isHDate = d instanceof HDate;
  let tempabs = isHDate ? d.getDate() : d.dd;
  const month = isHDate ? d.getMonth() : d.mm;
  const year = isHDate ? d.getFullYear() : d.yy;

  if (month < months.TISHREI) {
    for (let m = months.TISHREI; m <= monthsInHebYear(year); m++) {
      tempabs += daysInHebMonth(m, year);
    }

    for (let m = months.NISAN; m < month; m++) {
      tempabs += daysInHebMonth(m, year);
    }
  } else {
    for (let m = months.TISHREI; m < month; m++) {
      tempabs += daysInHebMonth(m, year);
    }
  }

  return hebElapsedDays(year) - 1373429 + tempabs;
}

/**
 * Converts absolute Julian days to Hebrew date
 * @param {number} d absolute Julian days
 * @return {SimpleHebrewDate}
 */
export function abs2hebrew(d) {
  if (d >= 10555144) {
    throw new RangeError(`parameter to abs2hebrew ${d} out of range`);
  }

  const gregdate = abs2greg(d);
  let year = 3760 + gregdate.getFullYear();
  const hebdate = {
    dd: 1,
    mm: months.TISHREI,
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
    month = months.TISHREI;
  }

  while (hebdate.mm = month,
  hebdate.dd = daysInHebMonth(month, year),
  hebdate.yy = year,
  d > hebrew2abs(hebdate)) {
    month = (month % monthsInHebYear(year)) + 1;
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
   * @param {string} locale
   */
  constructor(date, locale) {
    super(date, date.toString(), flags.HEBREW_DATE, {locale});
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || this.getAttrs().locale || '';
    const hd = this.getDate();
    const fullYear = hd.getFullYear();
    const monthName = gettext(hd.getMonthName(), locale0);
    const day = hd.getDate();
    if (locale0 == 'he') {
      return HebrewDateEvent.renderHebrew(day, monthName, fullYear);
    } else {
      const nth = numeral(day).format('ordinal');
      const dayOf = (locale0 && locale0.length == 2) ? '' : ' of';
      return `${nth}${dayOf} ${monthName}, ${fullYear}`;
    }
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
