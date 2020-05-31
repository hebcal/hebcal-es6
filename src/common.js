/* eslint-disable camelcase */
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

/**
 * Days of the week (SUN=0, SAT=6)
 * @readonly
 * @enum {number}
 */
export const days = {
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

export const monthNames = [
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
 * Returns true if Hebrew year is a leap year
 * @param {number} x Hebrew year
 * @return {boolean}
 */
export function hebLeapYear(x) {
  return (1 + x * 7) % 19 < 7;
}

/**
 * Number of months in Hebrew year
 * @param {number} x Hebrew year
 * @return {number}
 */
export function monthsInHebYear(x) {
  return 12 + hebLeapYear(x); // boolean is cast to 1 or 0
}

/**
 * Number of days in Hebrew month in a given year
 * @param {number} month Hebrew month (e.g. months.TISHREI)
 * @param {number} year Hebrew year
 * @return {number}
 */
export function daysInHebMonth(month, year) {
  if (month == months.IYYAR ||
      month == months.TAMUZ ||
      month == months.ELUL ||
      month == months.TEVET ||
      month == months.ADAR_II ||
      (month == months.ADAR_I && !hebLeapYear(year)) ||
      (month == months.CHESHVAN && !longCheshvan(year)) ||
      (month == months.KISLEV && shortKislev(year))) {
    return 29;
  } else {
    return 30;
  }
}

/**
 * Returns an (untranslated) string name of Hebrew month in year
 * @param {number} month Hebrew month (e.g. months.TISHREI)
 * @param {number} year Hebrew year
 * @return {string}
 */
export function getMonthName(month, year) {
  if (typeof month !== 'number' || month < 1 || month > 14) {
    throw new TypeError(`bad month argument ${month}`);
  }
  return monthNames[+hebLeapYear(year)][month];
}


/**
 * Returns the Hebrew month number
 * @param {*} month A number, or Hebrew month name string
 * @return {number}
 */
export function monthNum(month) {
  return typeof month === 'number' ?
    month :
    month.charCodeAt(0) >= 48 && month.charCodeAt(0) <= 57 ? /* number */
    parseInt(month, 10) :
    monthFromName(month);
}

/**
 * Days from sunday prior to start of Hebrew calendar to mean
 * conjunction of Tishrei in Hebrew YEAR
 * @param {number} hYear Hebrew year
 * @return {number}
 */
export function hebElapsedDays(hYear) {
  // borrowed from original JS
  const m_elapsed =
    235 * Math.floor((hYear - 1) / 19) +
    12 * ((hYear - 1) % 19) +
    Math.floor((((hYear - 1) % 19) * 7 + 1) / 19);

  const p_elapsed = 204 + 793 * (m_elapsed % 1080);

  const h_elapsed =
    5 +
    12 * m_elapsed +
    793 * Math.floor(m_elapsed / 1080) +
    Math.floor(p_elapsed / 1080);

  const parts = (p_elapsed % 1080) + 1080 * (h_elapsed % 24);

  const day = 1 + 29 * m_elapsed + Math.floor(h_elapsed / 24);
  const alt_day =
    day +
    (parts >= 19440 ||
      (2 == day % 7 && parts >= 9924 && !hebLeapYear(hYear)) ||
      (1 == day % 7 && parts >= 16789 && hebLeapYear(hYear - 1)));

  return alt_day + (alt_day % 7 === 0 || alt_day % 7 == 3 || alt_day % 7 == 5);
}

/**
 * Number of days in the hebrew YEAR
 * @param {number} year Hebrew year
 * @return {number}
 */
export function daysInYear(year) {
  return hebElapsedDays(year + 1) - hebElapsedDays(year);
}

/**
 * true if Cheshvan is long in Hebrew YEAR
 * @param {number} year Hebrew year
 * @return {boolean}
 */
export function longCheshvan(year) {
  return daysInYear(year) % 10 == 5;
}

/**
 * true if Kislev is short in Hebrew YEAR
 * @param {number} year Hebrew year
 * @return {boolean}
 */
export function shortKislev(year) {
  return daysInYear(year) % 10 == 3;
}

/**
 * Converts Hebrew month string name to numeric
 * @param {string} c monthName
 * @return {number}
 */
export function monthFromName(c) {
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
        months.NISAN;
    case 'i':
      return months.IYYAR;
    case 'e':
      return months.ELUL;
    case 'c':
    case 'ח':
      return months.CHESHVAN;
    case 'k':
    case 'כ':
      return months.KISLEV;
    case 's':
      switch (c.toLowerCase()[1]) {
        case 'i':
          return months.SIVAN;
        case 'h':
          return months.SHVAT;
        default:
          return 0;
      }
    case 't':
      switch (c.toLowerCase()[1]) {
        case 'a':
          return months.TAMUZ;
        case 'i':
          return months.TISHREI;
        case 'e':
          return months.TEVET;
      }
      break;
    case 'a':
      switch (c.toLowerCase()[1]) {
        case 'v':
          return months.AV;
        case 'd':
          if (/(1|[^i]i|a|א)$/i.test(c)) {
            return months.ADAR_I;
          }
          return months.ADAR_II; // else assume sheini
      }
      break;
    case 'ס':
      return months.SIVAN;
    case 'ט':
      return months.TEVET;
    case 'ש':
      return months.SHVAT;
    case 'א':
      switch (c.toLowerCase()[1]) {
        case 'ב':
          return months.AV;
        case 'ד':
          if (/(1|[^i]i|a|א)$/i.test(c)) {
            return months.ADAR_I;
          }
          return months.ADAR_II; // else assume sheini
        case 'י':
          return months.IYYAR;
        case 'ל':
          return months.ELUL;
      }
      break;
    case 'ת':
      switch (c.toLowerCase()[1]) {
        case 'מ':
          return months.TAMUZ;
        case 'ש':
          return months.TISHREI;
      }
      break;
  }
  return 0;
}

/**
 * Note: Applying this function to d+6 gives us the DAYNAME on or after an
 * absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
 * absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
 * date d, and applying it to d+7 gives the DAYNAME following absolute date d.
 * @param {number} day_of_week
 * @param {number} absdate
 * @return {number}
 */
export function dayOnOrBefore(day_of_week, absdate) {
  return absdate - ((absdate - day_of_week) % 7);
}

/**
 * Returns an array from start to end
 * @param {number} start beginning number, inclusive
 * @param {number} end ending number, inclusive
 * @param {number} [step=1]
 * @return {number[]}
 */
export function range(start, end, step = 1) {
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
}

const common = {
  months,
  days,
  hebLeapYear,
  monthsInHebYear,
  getMonthName,
  daysInHebMonth,
  monthNum,
  hebElapsedDays,
  daysInYear,
  longCheshvan,
  shortKislev,
  monthFromName,
  dayOnOrBefore,
  range,
};

export default common;
