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
 * Hebrew date utility functions.
 * @namespace
 */
export const common = {
  /**
   * Hebrew months of the year (NISAN=1, TISHREI=7)
   * @readonly
   * @enum {number}
   */
  months: {
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
  },

  /**
   * Days of the week (SUN=0, SAT=6)
   * @readonly
   * @enum {number}
   */
  days: {
    /** Sunday */
    SUN: 0,
    /** Monday */
    MON: 1,
    /** Tuesday */
    TUE: 2,
    /** Wednesday */
    WED: 3,
    /** Thursday */
    THU: 4,
    /** Friday */
    FRI: 5,
    /** Saturday */
    SAT: 6,
  },

  /**
   * Transliterations of Hebrew month names.
   * Regular years are index 0 and leap years are index 1.
   * @example
   * common.monthNames[0][common.months.ADAR_I] // "Adar"
   * common.monthNames[1][common.months.ADAR_I] // "Adar I"
   * common.monthNames[1][common.months.ADAR_II] // "Adar II"
   * @readonly
   */
  monthNames: [
    monthNames0.concat([
      'Adar',
      'Nisan',
    ]),
    monthNames0.concat([
      'Adar I',
      'Adar II',
      'Nisan',
    ]),
  ],

  /**
   * Returns true if Hebrew year is a leap year
   * @param {number} year Hebrew year
   * @return {boolean}
   */
  hebLeapYear: function(year) {
    return (1 + year * 7) % 19 < 7;
  },

  /**
   * Number of months in this Hebrew year (either 12 or 13 depending on leap year)
   * @param {number} year Hebrew year
   * @return {number}
   */
  monthsInHebYear: function(year) {
    return 12 + this.hebLeapYear(year); // boolean is cast to 1 or 0
  },

  /**
   * Number of days in Hebrew month in a given year (29 or 30)
   * @param {number} month Hebrew month (e.g. months.TISHREI)
   * @param {number} year Hebrew year
   * @return {number}
   */
  daysInHebMonth: function(month, year) {
    if (month == IYYAR ||
      month == TAMUZ ||
      month == ELUL ||
      month == TEVET ||
      month == ADAR_II ||
      (month == ADAR_I && !this.hebLeapYear(year)) ||
      (month == CHESHVAN && !this.longCheshvan(year)) ||
      (month == KISLEV && this.shortKislev(year))) {
      return 29;
    } else {
      return 30;
    }
  },

  /**
   * Returns a transliterated string name of Hebrew month in year,
   * for example 'Elul' or 'Cheshvan'.
   * @param {number} month Hebrew month (e.g. months.TISHREI)
   * @param {number} year Hebrew year
   * @return {string}
   */
  getMonthName: function(month, year) {
    if (typeof month !== 'number' || month < 1 || month > 14) {
      throw new TypeError(`bad month argument ${month}`);
    }
    return this.monthNames[+this.hebLeapYear(year)][month];
  },


  /**
   * Returns the Hebrew month number (NISAN=1, TISHREI=7)
   * @param {number|string} month A number, or Hebrew month name string
   * @return {number}
   */
  monthNum: function(month) {
    return typeof month === 'number' ?
    month :
    month.charCodeAt(0) >= 48 && month.charCodeAt(0) <= 57 ? /* number */
    parseInt(month, 10) :
    this.monthFromName(month);
  },

  /**
   * Days from sunday prior to start of Hebrew calendar to mean
   * conjunction of Tishrei in Hebrew YEAR
   * @param {number} year Hebrew year
   * @return {number}
   */
  hebElapsedDays: function(year) {
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
        (2 == day % 7 && parts >= 9924 && !this.hebLeapYear(year)) ||
        (1 == day % 7 && parts >= 16789 && this.hebLeapYear(year - 1)));

    return altDay + (altDay % 7 === 0 || altDay % 7 == 3 || altDay % 7 == 5);
  },

  /**
   * Number of days in the hebrew YEAR
   * @param {number} year Hebrew year
   * @return {number}
   */
  daysInYear: function(year) {
    return this.hebElapsedDays(year + 1) - this.hebElapsedDays(year);
  },

  /**
   * true if Cheshvan is long in Hebrew year
   * @param {number} year Hebrew year
   * @return {boolean}
   */
  longCheshvan: function(year) {
    return this.daysInYear(year) % 10 == 5;
  },

  /**
   * true if Kislev is short in Hebrew year
   * @param {number} year Hebrew year
   * @return {boolean}
   */
  shortKislev: function(year) {
    return this.daysInYear(year) % 10 == 3;
  },

  /**
   * Converts Hebrew month string name to numeric
   * @param {string} c monthName
   * @return {number}
   */
  monthFromName: function(c) {
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
  },

  /**
   * Note: Applying this function to d+6 gives us the DAYNAME on or after an
   * absolute day d. Similarly, applying it to d+3 gives the DAYNAME nearest to
   * absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
   * date d, and applying it to d+7 gives the DAYNAME following absolute date d.
   * @param {number} dayOfWeek
   * @param {number} absdate
   * @return {number}
   */
  dayOnOrBefore: function(dayOfWeek, absdate) {
    return absdate - ((absdate - dayOfWeek) % 7);
  },

  /**
   * Returns an array from start to end
   * @private
   * @param {number} start beginning number, inclusive
   * @param {number} end ending number, inclusive
   * @param {number} [step=1]
   * @return {number[]}
   */
  range: function(start, end, step = 1) {
    if (step < 0) {
      step = 0 - step;
    }

    const arr = [];
    let i = start;
    if (start < end) {
      for (; i <= end; i += step) {
        arr.push(i);
      }
    } else {
      for (; i >= end; i -= step) {
        arr.push(i);
      }
    }
    return arr;
  },
};
