/*
	Hebcal - A Jewish Calendar Generator
	Copyright (C) 1994-2004  Danny Sadinoff
	Portions Copyright (c) 2002 Michael J. Radwin. All Rights Reserved.

	https://github.com/hebcal/hebcal-es6

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program. If not, see <http://www.gnu.org/licenses/>.

	Danny Sadinoff can be reached at danny@sadinoff.com

	Michael Radwin has made significant contributions as a result of
	maintaining hebcal.com.

	The JavaScript code was completely rewritten in 2014 by Eyal Schachter.
 */
import gematriya from "gematriya";

export const months = {
  NISAN: 1,
  IYYAR: 2,
  SIVAN: 3,
  TAMUZ: 4,
  AV: 5,
  ELUL: 6,
  TISHREI: 7,
  CHESHVAN: 8,
  KISLEV: 9,
  TEVET: 10,
  SHVAT: 11,
  ADAR_I: 12,
  ADAR_II: 13,
};

const monthNames0 = [
  ["", 0, ""],
  ["Nisan", 0, "ניסן"],
  ["Iyyar", 0, "אייר"],
  ["Sivan", 0, "סיון"],
  ["Tamuz", 0, "תמוז"],
  ["Av", 0, "אב"],
  ["Elul", 0, "אלול"],
  ["Tishrei", 0, "תשרי"],
  ["Cheshvan", 0, "חשון"],
  ["Kislev", 0, "כסלו"],
  ["Tevet", 0, "טבת"],
  ["Sh'vat", 0, "שבט"],
];

export const monthNames = [
  monthNames0.concat([
    ["Adar", 0, "אדר"],
    ["Nisan", 0, "ניסן"],
  ]),
  monthNames0.concat([
    ["Adar I", 0, "אדר א'"],
    ["Adar II", 0, "אדר ב'"],
    ["Nisan", 0, "ניסן"],
  ]),
];

export const days = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export function LANG(str, opts) {
  return (opts == "h" && str[2]) || (opts == "a" && str[1]) || str[0];
}

export function LEAP(x) {
  return (1 + x * 7) % 19 < 7;
}

export function MONTH_CNT(x) {
  return 12 + LEAP(x); // boolean is cast to 1 or 0
}

export function daysInMonth(month, year) {
  return (
    30 -
    (month == months.IYYAR ||
      month == months.TAMUZ ||
      month == months.ELUL ||
      month == months.TEVET ||
      month == months.ADAR_II ||
      (month == months.ADAR_I && !LEAP(year)) ||
      (month == months.CHESHVAN && !lngChesh(year)) ||
      (month == months.KISLEV && shrtKis(year)))
  );
}

export function monthNum(month) {
  return typeof month === "number"
    ? month
    : month.charCodeAt(0) >= 1488 &&
      month.charCodeAt(0) <= 1514 &&
      /('|")/.test(month)
    ? gematriya(month)
    : month.charCodeAt(0) >= 48 && month.charCodeAt(0) <= 57 /* number */
    ? parseInt(month, 10)
    : monthFromName(month);
}

export function dayYearNum(str) {
  return typeof str === "number"
    ? str
    : str.charCodeAt(0) >= 1488 && str.charCodeAt(0) <= 1514
    ? gematriya(str, true)
    : parseInt(str, 10);
}

/* Days from sunday prior to start of Hebrew calendar to mean
   conjunction of Tishrei in Hebrew YEAR
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
      (2 == day % 7 && parts >= 9924 && !LEAP(hYear)) ||
      (1 == day % 7 && parts >= 16789 && LEAP(hYear - 1)));

  return alt_day + (alt_day % 7 === 0 || alt_day % 7 == 3 || alt_day % 7 == 5);
}

/* Number of days in the hebrew YEAR */
export function daysInYear(year) {
  return hebElapsedDays(year + 1) - hebElapsedDays(year);
}

/* true if Cheshvan is long in Hebrew YEAR */
export function lngChesh(year) {
  return daysInYear(year) % 10 == 5;
}

/* true if Kislev is short in Hebrew YEAR */
export function shrtKis(year) {
  return daysInYear(year) % 10 == 3;
}

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
    case "n":
    case "נ":
      return c.toLowerCase()[1] == "o" /* this catches "november" */
        ? 0
        : months.NISAN;
    case "i":
      return months.IYYAR;
    case "e":
      return months.ELUL;
    case "c":
    case "ח":
      return months.CHESHVAN;
    case "k":
    case "כ":
      return months.KISLEV;
    case "s":
      switch (c.toLowerCase()[1]) {
        case "i":
          return months.SIVAN;
        case "h":
          return months.SHVAT;
        default:
          return 0;
      }
    case "t":
      switch (c.toLowerCase()[1]) {
        case "a":
          return months.TAMUZ;
        case "i":
          return months.TISHREI;
        case "e":
          return months.TEVET;
      }
      break;
    case "a":
      switch (c.toLowerCase()[1]) {
        case "v":
          return months.AV;
        case "d":
          if (/(1|[^i]i|a|א)$/i.test(c)) {
            return months.ADAR_I;
          }
          return months.ADAR_II; // else assume sheini
      }
      break;
    case "ס":
      return months.SIVAN;
    case "ט":
      return months.TEVET;
    case "ש":
      return months.SHVAT;
    case "א":
      switch (c.toLowerCase()[1]) {
        case "ב":
          return months.AV;
        case "ד":
          if (/(1|[^i]i|a|א)$/i.test(c)) {
            return months.ADAR_I;
          }
          return months.ADAR_II; // else assume sheini
        case "י":
          return months.IYYAR;
        case "ל":
          return months.ELUL;
      }
      break;
    case "ת":
      switch (c.toLowerCase()[1]) {
        case "מ":
          return months.TAMUZ;
        case "ש":
          return months.TISHREI;
      }
      break;
  }
  return 0;
}

/* Note: Applying this function to d+6 gives us the DAYNAME on or after an
 * absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
 * absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
 * date d, and applying it to d+7 gives the DAYNAME following absolute date d.

**/
export function dayOnOrBefore(day_of_week, absdate) {
  return absdate - ((absdate - day_of_week) % 7);
}

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
  monthNames,
  days,
  LANG,
  LEAP,
  MONTH_CNT,
  daysInMonth,
  monthNum,
  dayYearNum,
  hebElapsedDays,
  daysInYear,
  lngChesh,
  shrtKis,
  monthFromName,
  dayOnOrBefore,
  range,
};

export default common;
