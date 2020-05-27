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
import c, { months, days } from "./common";
import { HDate } from "./hdate";
import { gettext } from 'ttag';
import { Event, flags } from "./event";

// for byte optimizations
const TISHREI = months.TISHREI;
const KISLEV = months.KISLEV;
const NISAN = months.NISAN;
const SAT = days.SAT;

function Chanukah(day) {
  return `Chanukah: ${day} Candles`;
}

const CHAG                = flags.CHAG;
const LIGHT_CANDLES       = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS        = flags.YOM_TOV_ENDS;
const CHUL_ONLY           = flags.CHUL_ONLY;
const IL_ONLY             = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES    = flags.CHANUKAH_CANDLES;
const ROSH_CHODESH        = flags.ROSH_CHODESH;
const MINOR_FAST          = flags.MINOR_FAST;
const SPECIAL_SHABBAT     = flags.SPECIAL_SHABBAT;
//const PARSHA_HASHAVUA     = flags.PARSHA_HASHAVUA;
//const DAF_YOMI            = flags.DAF_YOMI;
//const OMER_COUNT          = flags.OMER_COUNT;
const MODERN_HOLIDAY      = flags.MODERN_HOLIDAY;
const MAJOR_FAST          = flags.MAJOR_FAST;
const SHABBAT_MEVARCHIM   = flags.SHABBAT_MEVARCHIM;
//const MOLAD               = flags.MOLAD;
//const USER_EVENT          = flags.USER_EVENT;

const __cache = new Map();

/**
 * Returns an array of Event[] indexed by HDate
 * @param {number} year Hebrew year
 * @returns {Event[][]}
 */
export function getHolidaysForYear(year) {
  const cached = __cache.get(year);
  if (cached) {
    return cached;
  }

  const RH = new HDate(1, TISHREI, year);
  const pesach = new HDate(15, NISAN, year);

  const h = new Map();
  function add(ev) {
    if (Array.isArray(ev)) {
      for (const e of ev) {
        add(e);
      }
    } else {
      const key = ev.date.toString();
      if (h.has(key)) {
        h.get(key).push(ev);
      } else {
        h.set(key, [ ev ]);
      }
    }
  }

  function addEvents(year, arr) {
    for (const a of arr) {
      const [day, month, desc, mask, attrs] = a;
//      console.debug(day, month, year, desc, mask);
      add(new Event(new HDate(day, month, year), desc, mask, attrs));
    }
  }

  // standard holidays that don't shift based on year
  add(new Event(RH, `Rosh Hashana ${year}`, CHAG | LIGHT_CANDLES_TZEIS));
  addEvents(year, [
    [2,   TISHREI,    "Rosh Hashana II",   CHAG | YOM_TOV_ENDS],
    [3 + (RH.getDay() == days.THU),
          TISHREI,    "Tzom Gedaliah",     MINOR_FAST], // push off to SUN if RH is THU
    [9,   TISHREI,    "Erev Yom Kippur",   LIGHT_CANDLES],
  ]);
  // first SAT after RH
  add(new Event(new HDate(c.dayOnOrBefore(SAT, 7 + RH.abs())), "Shabbat Shuva", 0));
  addEvents(year, [
    [10,  TISHREI,    "Yom Kippur",         CHAG | YOM_TOV_ENDS | MAJOR_FAST],
    [14,  TISHREI,    "Erev Sukkot",        LIGHT_CANDLES],

    // Attributes for Israel and Diaspora are different
    [15,  TISHREI,    "Sukkot I",           CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [16,  TISHREI,    "Sukkot II",          CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [17,  TISHREI,    "Sukkot III (CH''M)", CHUL_ONLY, { cholHaMoedDay: 1 }],
    [18,  TISHREI,    "Sukkot IV (CH''M)",  CHUL_ONLY, { cholHaMoedDay: 2 }],
    [19,  TISHREI,    "Sukkot V (CH''M)",   CHUL_ONLY, { cholHaMoedDay: 3 }],
    [20,  TISHREI,    "Sukkot VI (CH''M)",  CHUL_ONLY, { cholHaMoedDay: 4 }],

    [15,  TISHREI,    "Sukkot I",           CHAG | YOM_TOV_ENDS | IL_ONLY],
    [16,  TISHREI,    "Sukkot II (CH''M)",  IL_ONLY, { cholHaMoedDay: 1 } ],
    [17,  TISHREI,    "Sukkot III (CH''M)", IL_ONLY, { cholHaMoedDay: 2 }],
    [18,  TISHREI,    "Sukkot IV (CH''M)",  IL_ONLY, { cholHaMoedDay: 3 }],
    [19,  TISHREI,    "Sukkot V (CH''M)",   IL_ONLY, { cholHaMoedDay: 4 }],
    [20,  TISHREI,    "Sukkot VI (CH''M)",  IL_ONLY, { cholHaMoedDay: 5 }],
    [21,  TISHREI,    "Sukkot VII (Hoshana Raba)", LIGHT_CANDLES, { cholHaMoedDay: -1 }],
    [22,  TISHREI,    "Shmini Atzeret",     CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
//    [22,  TISHREI,    "Shmini Atzeret / Simchat Torah", YOM_TOV_ENDS | IL_ONLY],
    [22,  TISHREI,    "Shmini Atzeret",     CHAG | YOM_TOV_ENDS | IL_ONLY],
    [23,  TISHREI,    "Simchat Torah",      CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [24,  KISLEV,     "Chanukah: 1 Candle", CHANUKAH_CANDLES],
    [25,  KISLEV,     Chanukah(2),          CHANUKAH_CANDLES, { chanukahDay: 1} ],
    [26,  KISLEV,     Chanukah(3),          CHANUKAH_CANDLES, { chanukahDay: 2} ],
    [27,  KISLEV,     Chanukah(4),          CHANUKAH_CANDLES, { chanukahDay: 3} ],
    [28,  KISLEV,     Chanukah(5),          CHANUKAH_CANDLES, { chanukahDay: 4} ],
    [29,  KISLEV,     Chanukah(6),          CHANUKAH_CANDLES, { chanukahDay: 5} ],
    [30,  KISLEV,     Chanukah(7),          CHANUKAH_CANDLES, { chanukahDay: 6} ], // yes, i know these are wrong
    [31,  KISLEV,     Chanukah(8),          CHANUKAH_CANDLES, { chanukahDay: 7} ], // HDate() corrects the month automatically
    [32,  KISLEV,     "Chanukah: 8th Day",  0, { chanukahDay: 8} ],
    [15,  months.SHVAT, "Tu BiShvat",       0],
  ]);
  const pesachAbs = pesach.abs();
  add([
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 43)), "Shabbat Shekalim", SPECIAL_SHABBAT),
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 30)), "Shabbat Zachor",   SPECIAL_SHABBAT),
    new Event(new HDate(pesachAbs - (pesach.getDay() == days.TUE ? 33 : 31)),
      "Ta'anit Esther", MINOR_FAST)
  ]);
  addEvents(year, [
    [13,  months.ADAR_II, "Erev Purim",     0],
    [14,  months.ADAR_II, "Purim",          0],
    [15,  months.ADAR_II, "Shushan Purim",  0],
  ]);
  add([
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 14) - 7), "Shabbat Parah", SPECIAL_SHABBAT),
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 14)), "Shabbat HaChodesh", SPECIAL_SHABBAT),
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 1)),  "Shabbat HaGadol", SPECIAL_SHABBAT),
    new Event(
      // if the fast falls on Shabbat, move to Thursday
      pesach.prev().getDay() == SAT
        ? pesach.onOrBefore(days.THU)
        : new HDate(14, NISAN, year),
      "Ta'anit Bechorot",
      MINOR_FAST
    )
  ]);
  addEvents(year, [
    [14, NISAN,     "Erev Pesach", LIGHT_CANDLES],

    // Attributes for Israel and Diaspora are different
    [15, NISAN,     "Pesach I", CHAG | YOM_TOV_ENDS | IL_ONLY],
    [16, NISAN,     "Pesach II (CH''M)", IL_ONLY, { cholHaMoedDay: 1 }],
    [17, NISAN,     "Pesach III (CH''M)", IL_ONLY, { cholHaMoedDay: 2 }],
    [18, NISAN,     "Pesach IV (CH''M)", IL_ONLY, { cholHaMoedDay: 3 }],
    [19, NISAN,     "Pesach V (CH''M)", IL_ONLY, { cholHaMoedDay: 4 }],
    [20, NISAN,     "Pesach VI (CH''M)", LIGHT_CANDLES | IL_ONLY, { cholHaMoedDay: 5 }],
    [21, NISAN,     "Pesach VII", CHAG | YOM_TOV_ENDS | IL_ONLY],

    [15, NISAN,     "Pesach I", CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [16, NISAN,     "Pesach II", CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [17, NISAN,     "Pesach III (CH''M)", CHUL_ONLY, { cholHaMoedDay: 1 }],
    [18, NISAN,     "Pesach IV (CH''M)", CHUL_ONLY, { cholHaMoedDay: 2 }],
    [19, NISAN,     "Pesach V (CH''M)", CHUL_ONLY, { cholHaMoedDay: 3 }],
    [20, NISAN,     "Pesach VI (CH''M)", LIGHT_CANDLES | CHUL_ONLY, { cholHaMoedDay: 4 }],
    [21, NISAN,     "Pesach VII", CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [22, NISAN,     "Pesach VIII", CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [14, months.IYYAR, "Pesach Sheni", 0],
    [18, months.IYYAR, "Lag BaOmer", 0],
    [5,  months.SIVAN, "Erev Shavuot", LIGHT_CANDLES],
    [6,  months.SIVAN, "Shavuot", CHAG | YOM_TOV_ENDS | IL_ONLY],
    [6,  months.SIVAN, "Shavuot I", CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [7,  months.SIVAN, "Shavuot II", CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [15, months.AV,    "Tu B'Av", 0],
  ]);
  add(new Event(new HDate(c.dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)),
    "Leil Selichot", 0));
  add(new Event(new HDate(29, months.ELUL, year), "Erev Rosh Hashana", LIGHT_CANDLES));

  let tevet10dt = new HDate(10, months.TEVET, year);
  let tevet10attrs;
  if (tevet10dt.getDay() == SAT) {
    tevet10dt = tevet10dt.next();
    tevet10attrs = { observed: true };
  }
  add(new Event(tevet10dt, "Asara B'Tevet", MINOR_FAST, tevet10attrs));

  if (c.hebLeapYear(year)) {
    add(new Event(new HDate(14, months.ADAR_I, year), "Purim Katan", 0));
  }

  if (year >= 5711) {
    // Yom HaShoah first observed in 1951
    let nisan27dt = new HDate(27, NISAN, year);
    /* When the actual date of Yom Hashoah falls on a Friday, the
     * state of Israel observes Yom Hashoah on the preceding
     * Thursday. When it falls on a Sunday, Yom Hashoah is observed
     * on the following Monday.
     * http://www.ushmm.org/remembrance/dor/calendar/
     */

    if (nisan27dt.getDay() == days.FRI) {
      nisan27dt = nisan27dt.prev();
    } else if (nisan27dt.getDay() == days.SUN) {
      nisan27dt = nisan27dt.next();
    }

    add(new Event(nisan27dt, "Yom HaShoah", MODERN_HOLIDAY));
  }

  add(atzmaut(year));

  if (year >= 5727) {
    // Yom Yerushalayim only celebrated after 1967
    add(new Event(new HDate(28, months.IYYAR, year), "Yom Yerushalayim", MODERN_HOLIDAY));
  }

  if (year >= 5769) {
    add(new Event(new HDate(29, months.CHESHVAN, year), "Sigd", MODERN_HOLIDAY));
  }

  if (year >= 5777) {
    add(new Event(new HDate(7, months.CHESHVAN, year), "Yom HaAliyah", MODERN_HOLIDAY));
  }

  let tamuz17 = new HDate(17, months.TAMUZ, year);
  let tamuz17attrs;
  if (tamuz17.getDay() == SAT) {
    tamuz17 = tamuz17.next();
    tamuz17attrs = { observed: true };
  }
  add(new Event(tamuz17, "Tzom Tammuz", MINOR_FAST, tamuz17attrs));

  let av9dt = new HDate(9, months.AV, year);
  let av9attrs;
  if (av9dt.getDay() == SAT) {
    av9dt = av9dt.next();
    av9attrs = { observed: true };
  }

  add(new Event(new HDate(c.dayOnOrBefore(SAT, av9dt.abs())), "Shabbat Chazon", SPECIAL_SHABBAT));

  add(new Event(av9dt.prev(), "Erev Tish'a B'Av", 0, av9attrs));

  add(new Event(av9dt, "Tish'a B'Av", MAJOR_FAST, av9attrs));

  add(new Event(new HDate(c.dayOnOrBefore(SAT, av9dt.abs() + 7)), "Shabbat Nachamu", SPECIAL_SHABBAT));

  for (let month = 1; month <= c.monthsInHebYear(year); month++) {
    const monthName = c.getMonthName(month, year);
    const desc = gettext("Rosh Chodesh") + " " + gettext(monthName);
    if (
      (month == NISAN
        ? c.daysInHebMonth(c.monthsInHebYear(year - 1), year - 1)
        : c.daysInHebMonth(month - 1, year)) == 30
    ) {
      add(new Event(new HDate(1, month, year), desc, ROSH_CHODESH));
      add(new Event(new HDate(30, month - 1, year), desc, ROSH_CHODESH));
    } else if (month !== TISHREI) {
      add(new Event(new HDate(1, month, year), desc, ROSH_CHODESH));
    }

    if (month == months.ELUL) {
      continue;
    }

    // Don't worry about month overrun; will get "Nisan" for month=14
    const nextMonthName = c.getMonthName(month + 1, year);
    add(new Event(new HDate(29, month, year).onOrBefore(SAT),
        gettext("Shabbat Mevarchim Chodesh") + " " + gettext(nextMonthName),
        SHABBAT_MEVARCHIM));
  }

  __cache.set(year, h);
  return h;
}

function atzmaut(year) {
  if (year >= 5708) {
    // Yom HaAtzma'ut only celebrated after 1948
    let tmpDate = new HDate(1, months.IYYAR, year);

    const pesach = new HDate(15, NISAN, year);

    if (pesach.getDay() == days.SUN) {
      tmpDate.setDate(2);
    } else if (pesach.getDay() == SAT) {
      tmpDate.setDate(3);
    } else if (year < 5764) {
      tmpDate.setDate(4);
    } else if (pesach.getDay() == days.TUE) {
      tmpDate.setDate(5);
    } else {
      tmpDate.setDate(4);
    }

    return [
      new Event(tmpDate, "Yom HaZikaron", MODERN_HOLIDAY),
      new Event(tmpDate.next(), "Yom HaAtzma'ut", MODERN_HOLIDAY),
    ];
  }
  return [];
}

/**
 * Returns an array of Events on this date (or undefined if no events)
 * @param {HDate|Date|number} date Hebrew Date, Gregorian date, or absolute Julian date
 * @returns {Event[]}
 */
export function getHolidaysOnDate(date) {
  const hd = date instanceof HDate ? date : new HDate(date);
  const y = getHolidaysForYear(hd.getFullYear());
  return y.get(hd.toString());
}

export { Event, flags } from './event';

export default {
    getHolidaysOnDate,
    getHolidaysForYear
};
