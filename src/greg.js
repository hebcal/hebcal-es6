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

import {abs2greg, dayOfYear, daysInMonth, greg2abs, isDate, isLeapYear} from './greg0';

/**
 * Gregorian date helper functions.
 */
export class greg {
  /**
   * Long names of the Gregorian months (1='January', 12='December')
   * @readonly
   * @type {string[]}
   */
  static monthNames = [
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
  ];

  /**
   * Returns true if the Gregorian year is a leap year
   * @param {number} year Gregorian year
   * @return {boolean}
   */
  static isLeapYear(year) {
    return isLeapYear(year);
  }

  /**
   * Number of days in the Gregorian month for given year
   * @param {number} month Gregorian month (1=January, 12=December)
   * @param {number} year Gregorian year
   * @return {number}
   */
  static daysInMonth(month, year) {
    return daysInMonth(month, year);
  }

  /**
   * Returns true if the object is a Javascript Date
   * @param {Object} obj
   * @return {boolean}
   */
  static isDate(obj) {
    return isDate(obj);
  }

  /**
   * Returns number of days since January 1 of that year
   * @param {Date} date Gregorian date
   * @return {number}
   */
  static dayOfYear(date) {
    return dayOfYear(date);
  }

  /**
   * Converts Gregorian date to absolute R.D. (Rata Die) days
   * @param {Date} date Gregorian date
   * @return {number}
   */
  static greg2abs(date) {
    return greg2abs(date);
  }

  /**
   * Converts from Rata Die (R.D. number) to Gregorian date.
   * See the footnote on page 384 of ``Calendrical Calculations, Part II:
   * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
   * Clamen, Software--Practice and Experience, Volume 23, Number 4
   * (April, 1993), pages 383-404 for an explanation.
   * @param {number} theDate - R.D. number of days
   * @return {Date}
   */
  static abs2greg(theDate) {
    return abs2greg(theDate);
  }
}
