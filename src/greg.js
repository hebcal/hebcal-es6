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
const monthLengths = [
  [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
];

/**
 * Gregorian date helper functions.
 * @namespace
 */
export const greg = {
  /**
   * Long names of the Gregorian months (1='January', 12='December')
   * @readonly
   * @type {string[]}
   */
  monthNames: [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  /**
   * Returns true if the Gregorian year is a leap year
   * @param {number} year Gregorian year
   * @return {boolean}
   */
  isLeapYear: function(year) {
    return !(year % 4) && (!!(year % 100) || !(year % 400));
  },

  /**
   * Number of days in the Gregorian month for given year
   * @param {number} month Gregorian month (1=January, 12=December)
   * @param {number} year Gregorian year
   * @return {number}
   */
  daysInMonth: function(month, year) {
    // 1 based months
    return monthLengths[+this.isLeapYear(year)][month];
  },

  /**
   * Returns number of days since January 1 of that year
   * @param {Date} date Gregorian date
   * @return {number}
   */
  dayOfYear: function(date) {
    if (typeof date !== 'object' || !date instanceof Date) {
      throw new TypeError('Argument to greg.dayOfYear not a Date');
    }
    let doy = date.getDate() + 31 * date.getMonth();
    if (date.getMonth() > 1) {
      // FEB
      doy -= Math.floor((4 * (date.getMonth() + 1) + 23) / 10);
      if (this.isLeapYear(date.getFullYear())) {
        doy++;
      }
    }
    return doy;
  },

  /**
   * Converts Gregorian date to absolute R.D. (Rata Die) days
   * @param {Date} date Gregorian date
   * @return {number}
   */
  greg2abs: function(date) {
    if (typeof date !== 'object' || !date instanceof Date) {
      throw new TypeError('Argument to greg.greg2abs not a Date');
    }
    const year = date.getFullYear() - 1;
    return (
      this.dayOfYear(date) + // days this year
      365 * year + // + days in prior years
      (Math.floor(year / 4) - // + Julian Leap years
      Math.floor(year / 100) + // - century years
      Math.floor(year / 400))
    ); // + Gregorian leap years
  },

  /**
   * Converts from Rata Die (R.D. number) to Gregorian date.
   * See the footnote on page 384 of ``Calendrical Calculations, Part II:
   * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
   * Clamen, Software--Practice and Experience, Volume 23, Number 4
   * (April, 1993), pages 383-404 for an explanation.
   * @param {number} theDate - R.D. number of days
   * @return {Date}
   */
  abs2greg: function(theDate) {
    if (typeof theDate !== 'number') {
      throw new TypeError('Argument to greg.abs2greg not a Number');
    }
    // calculations copied from original JS code
    const d0 = theDate - 1;
    const n400 = Math.floor(d0 / 146097);
    const d1 = Math.floor(d0 % 146097);
    const n100 = Math.floor(d1 / 36524);
    const d2 = d1 % 36524;
    const n4 = Math.floor(d2 / 1461);
    const d3 = d2 % 1461;
    const n1 = Math.floor(d3 / 365);

    const day = (d3 % 365) + 1;
    let year = 400 * n400 + 100 * n100 + 4 * n4 + n1;

    if (4 == n100 || 4 == n1) {
      const dt = new Date(year, 11, 31);
      if (year < 100) {
        dt.setFullYear(year);
      }
      return dt;
    }

    const dt = new Date(++year, 0, day);
    if (year < 100) {
      dt.setFullYear(year);
    }
    return dt;
  },
};
