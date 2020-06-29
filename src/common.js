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
