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
import {Event, flags} from './event';
import gematriya from 'gematriya';
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
   *    * `number` - Converts absolute Julian days to Hebrew date. The absolute Julian
   *       date is the number of days elapsed since the (imaginary) Gregorian date
   *       Sunday, December 31, 1 BC
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
    if (!arguments.length) {
      const d = HDate.abs2hebrew(g.greg2abs(new Date()));
      this.day = d.dd;
      this.month = d.mm;
      this.year = d.yy;
    } else if (arguments.length == 1) {
      if (day instanceof Date) {
        const d = HDate.abs2hebrew(g.greg2abs(day));
        this.day = d.dd;
        this.month = d.mm;
        this.year = d.yy;
      } else if (typeof day == 'number') {
        const d = HDate.abs2hebrew(day);
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
      this.setMonth(HDate.monthNum(month));
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
    this.month = HDate.monthNum(month);
    fix(this);
    return this;
  }

  /**
   * Sets the Tishrei-based month of the date. Returns the object it was called upon
   * @param {number} month
   * @return {HDate}
   */
  setTishreiMonth(month) {
    return this.setMonth((month + 6) % HDate.monthsInYear(this.getFullYear()) || 13);
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
    return g.abs2greg(HDate.hebrew2abs(this.year, this.month, this.day));
  }

  /**
   * Returns Julian absolute days
   * @return {number}
   */
  abs() {
    return HDate.hebrew2abs(this.year, this.month, this.day);
  }

  /**
   * Converts Hebrew date to absolute Julian days.
   * The absolute date is the number of days elapsed since the (imaginary)
   * Gregorian date Sunday, December 31, 1 BC.
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

    return HDate.elapsedDays(year) - 1373429 + tempabs;
  }

  /**
   * Converts absolute Julian days to Hebrew date
   * @private
   * @param {number} d absolute Julian days
   * @return {SimpleHebrewDate}
   */
  static abs2hebrew(d) {
    if (d >= 10555144) {
      throw new RangeError(`parameter to abs2hebrew ${d} out of range`);
    }

    const gregdate = g.abs2greg(d);
    let year = 3760 + gregdate.getFullYear();
    const hebdate = {
      dd: 1,
      mm: TISHREI,
      yy: -1,
    };

    while (hebdate.yy = year + 1, d >= HDate.hebrew2abs(hebdate.yy, hebdate.mm, hebdate.dd)) {
      year++;
    }

    const mmap = [9, 10, 11, 12, 1, 2, 3, 4, 7, 7, 7, 8];
    let month;
    if (year > 4634 && year < 10666) {
      // optimize search
      month = mmap[gregdate.getMonth()];
    } else {
      // we're outside the usual range, so assume nothing about Hebrew/Gregorian calendar drift...
      month = TISHREI;
    }

    while (hebdate.mm = month,
    hebdate.dd = HDate.daysInMonth(month, year),
    hebdate.yy = year,
    d > HDate.hebrew2abs(hebdate.yy, hebdate.mm, hebdate.dd)) {
      month = (month % HDate.monthsInYear(year)) + 1;
    }

    hebdate.dd = 1;
    const day = d - HDate.hebrew2abs(hebdate.yy, hebdate.mm, hebdate.dd) + 1;
    hebdate.dd = day;

    return hebdate;
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
   * console.log(hd.render('he')); // '15 חֶשְׁוָן, 5769'
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || Locale.getLocaleName();
    const day = this.getDate();
    const fullYear = this.getFullYear();
    const monthName = Locale.gettext(this.getMonthName(), locale);
    const nth = Locale.ordinal(day);
    let dayOf = '';
    if (locale0 == 'en' || locale0.startsWith('ashkenazi')) {
      dayOf = ' of';
    } else {
      const ofStr = Locale.lookupTranslation('of', locale0);
      if (ofStr) {
        dayOf = ' ' + ofStr;
      }
    }
    return `${nth}${dayOf} ${monthName}, ${fullYear}`;
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
    // borrowed from original JS
    const mElapsed = 235 * Math.floor((year - 1) / 19) +
      12 * ((year - 1) % 19) +
      Math.floor((((year - 1) % 19) * 7 + 1) / 19);

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
        (1 == day % 7 && parts >= 16789 && HDate.isLeapYear(year - 1)));

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
   * @param {string} c monthName
   * @return {number}
   */
  static monthFromName(c) {
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
    switch (c.toLowerCase()[0]) {
      case 'n':
      case 'נ':
        return c.toLowerCase()[1] == 'o' ? /* this catches "november" */
        0 :
        NISAN;
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
        switch (c.toLowerCase()[1]) {
          case 'i':
            return SIVAN;
          case 'h':
            return SHVAT;
          default:
            return 0;
        }
      case 't':
        switch (c.toLowerCase()[1]) {
          case 'a':
            return TAMUZ;
          case 'i':
            return TISHREI;
          case 'e':
            return TEVET;
        }
        break;
      case 'a':
        switch (c.toLowerCase()[1]) {
          case 'v':
            return AV;
          case 'd':
            if (/(1|[^i]i|a|א)$/i.test(c)) {
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
        switch (c.toLowerCase()[1]) {
          case 'ב':
            return AV;
          case 'ד':
            if (/(1|[^i]i|a|א)$/i.test(c)) {
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
        switch (c.toLowerCase()[1]) {
          case 'מ':
            return TAMUZ;
          case 'ש':
            return TISHREI;
        }
        break;
    }
    return 0;
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
}

// eslint-disable-next-line require-jsdoc
function fix(date) {
  fixMonth(date);
  fixDate(date);
}

// eslint-disable-next-line require-jsdoc
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

// eslint-disable-next-line require-jsdoc
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
}

// eslint-disable-next-line require-jsdoc
function onOrBefore(day, t, offset) {
  return new HDate(HDate.dayOnOrBefore(day, t.abs() + offset));
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
   * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * const ev = new HebrewDateEvent(hd);
   * console.log(ev.render()); // '15th of Cheshvan, 5769'
   * console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || Locale.getLocaleName();
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
