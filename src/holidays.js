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
import HDate from "./hdate";
import { gettext } from 'ttag';

let __cache = {};

// for byte optimizations
const TISHREI = months.TISHREI;
const KISLEV = months.KISLEV;
const NISAN = months.NISAN;
const SAT = days.SAT;

function Chanukah(day) {
  return `Chanukah: ${day} Candles`;
}

const USER_EVENT          = 1;
const LIGHT_CANDLES       = 2;
const YOM_TOV_ENDS        = 4;
const CHUL_ONLY           = 8;  // chutz l'aretz (Diaspora)
const IL_ONLY             = 16;   // b'aretz (Israel)
const LIGHT_CANDLES_TZEIS = 32;

export const masks = {
  USER_EVENT,
  LIGHT_CANDLES,
  YOM_TOV_ENDS,
  CHUL_ONLY,
  IL_ONLY,
  LIGHT_CANDLES_TZEIS,
};

export class Event {
  constructor(date, desc, mask) {
    this.date = new HDate(date);
    this.desc = desc;
    this.mask = mask;
  }

  isUserEvent() {
    return Boolean(this.mask & USER_EVENT);
  }

  isLightCandles() {
    return Boolean(this.mask & LIGHT_CANDLES);
  }

  isYomTovEnds() {
    return Boolean(this.mask & YOM_TOV_ENDS);
  }

  isIsraelOnly() {
    return (this.mask & IL_ONLY) || !(this.mask & CHUL_ONLY);
  }

  isDiasporaOnly() {
    return (this.mask & CHUL_ONLY) || !(this.mask & IL_ONLY);
  }

  getDesc() {
    return gettext(this.desc);
  }

  /*
  candleLighting() {
    const date = this.date;
    if (this.LIGHT_CANDLES) {
      return new Date(date.sunset() - Event.candleLighting * 60 * 1000);
    } else if (this.LIGHT_CANDLES_TZEIS) {
      return date.getZemanim().tzeit;
    }
    return null;
  }

  havdalah() {
    if (this.YOM_TOV_ENDS) {
      return new Date(
        this.date.sunset().getTime() + Event.havdalah * 60 * 1000
      );
    }
    return null;
  }
  */
}

/*
Event.candleLighting = 18;

Event.havdalah = 42;
*/

export function year(year) {
  if (__cache[year]) {
    return __cache[year];
  }

  const RH = new HDate(1, TISHREI, year);
  const pesach = new HDate(15, NISAN, year);
  let tmpDate;

  const h = {};

  function add(ev) {
    if (Array.isArray(ev)) {
      for (const e of ev) {
        add(e);
      }
    } else {
      if (h[ev.date]) {
        h[ev.date].push(ev);
      } else {
        h[ev.date] = [ev];
      }
    }
  }

  Object.defineProperty(h, "add", { value: add });

  function addEvents(year, arr) {
    for (const a of arr) {
      const [day, month, desc, mask] = a;
      console.debug(day, month, year, desc, mask);
      add(new Event(new HDate(day, month, year), desc, mask));
    }
  }

  // standard holidays that don't shift based on year
  add(new Event(RH, "Rosh Hashana", LIGHT_CANDLES_TZEIS));
  addEvents(year, [
    [2,   TISHREI,    "Rosh Hashana II",   YOM_TOV_ENDS],
    [3 + (RH.getDay() == days.THU),
          TISHREI,    "Tzom Gedaliah",     0], // push off to SUN if RH is THU
    [9,   TISHREI,    "Erev Yom Kippur",   LIGHT_CANDLES],
  ]);
  // first SAT after RH
  add(new Event(new HDate(c.dayOnOrBefore(SAT, 7 + RH.abs())), "Shabbat Shuva", 0));
  addEvents(year, [
    [10,  TISHREI,    "Yom Kippur",         YOM_TOV_ENDS],
    [14,  TISHREI,    "Erev Sukkot",        LIGHT_CANDLES],
    [15,  TISHREI,    "Sukkot I",           LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [15,  TISHREI,    "Sukkot I",           YOM_TOV_ENDS | IL_ONLY],
    [16,  TISHREI,    "Sukkot II",          YOM_TOV_ENDS | CHUL_ONLY],
    [16,  TISHREI,    "Sukkot II (CH''M)",  IL_ONLY],
    [17,  TISHREI,    "Sukkot III (CH''M)", 0],
    [18,  TISHREI,    "Sukkot IV (CH''M)",  0],
    [19,  TISHREI,    "Sukkot V (CH''M)",   0],
    [20,  TISHREI,    "Sukkot VI (CH''M)",  0],
    [21,  TISHREI,    "Sukkot VII (Hoshana Raba)", LIGHT_CANDLES],
    [22,  TISHREI,    "Shmini Atzeret",     LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [22,  TISHREI,    "Shmini Atzeret / Simchat Torah", YOM_TOV_ENDS | IL_ONLY],
    [23,  TISHREI,    "Simchat Torah",      YOM_TOV_ENDS | CHUL_ONLY],
    [24,  KISLEV,     "Chanukah: 1 Candle", 0],
    [25,  KISLEV,     Chanukah(2),          0],
    [26,  KISLEV,     Chanukah(3),          0],
    [27,  KISLEV,     Chanukah(4),          0],
    [28,  KISLEV,     Chanukah(5),          0],
    [29,  KISLEV,     Chanukah(6),          0],
    [30,  KISLEV,     Chanukah(7),          0], // yes, i know these are wrong
    [31,  KISLEV,     Chanukah(8),          0], // HDate() corrects the month automatically
    [32,  KISLEV,     "Chanukah: 8th Day",  0],
    [15,  months.SHVAT, "Tu BiShvat",       0],

  ]);
  const pesachAbs = pesach.abs();
  add([
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 43)), "Shabbat Shekalim", 0),
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 30)), "Shabbat Zachor",   0),
    new Event(new HDate(pesachAbs - (pesach.getDay() == days.TUE ? 33 : 31)),
      "Ta'anit Esther", 0)
  ]);
  addEvents(year, [
    [13,  months.ADAR_II, "Erev Purim",     0],
    [14,  months.ADAR_II, "Purim",          0],
    [15,  months.ADAR_II, "Shushan Purim",  0],
  ]);
  add([
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 14) - 7), "Shabbat Parah", 0),
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 14)), "Shabbat HaChodesh", 0),
    new Event(new HDate(c.dayOnOrBefore(SAT, pesachAbs - 1)),  "Shabbat HaGadol", 0),
    new Event(
      // if the fast falls on Shabbat, move to Thursday
      pesach.prev().getDay() == SAT
        ? pesach.onOrBefore(days.THU)
        : new HDate(14, NISAN, year),
      "Ta'anit Bechorot",
      0
    )
  ]);
  addEvents(year, [
    [14, NISAN,     "Erev Pesach", LIGHT_CANDLES],
    [15, NISAN,     "Pesach I", LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [15, NISAN,     "Pesach I", YOM_TOV_ENDS | IL_ONLY],
    [16, NISAN,     "Pesach II", YOM_TOV_ENDS | CHUL_ONLY],
    [16, NISAN,     "Pesach II (CH''M)", IL_ONLY],
    [16, NISAN,     "Start counting Omer", 0],
    [17, NISAN,     "Pesach III (CH''M)", 0],
    [18, NISAN,     "Pesach IV (CH''M)", 0],
    [19, NISAN,     "Pesach V (CH''M)", 0],
    [20, NISAN,     "Pesach VI (CH''M)", LIGHT_CANDLES],
    [21, NISAN,     "Pesach VII", LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [21, NISAN,     "Pesach VII", YOM_TOV_ENDS | IL_ONLY],
    [22, NISAN,     "Pesach VIII", YOM_TOV_ENDS | CHUL_ONLY],
    [14, months.IYYAR, "Pesach Sheni", 0],
    [18, months.IYYAR, "Lag BaOmer", 0],
    [5,  months.SIVAN, "Erev Shavuot", LIGHT_CANDLES],
    [6,  months.SIVAN, "Shavuot I", LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [6,  months.SIVAN, "Shavuot", YOM_TOV_ENDS | IL_ONLY],
    [7,  months.SIVAN, "Shavuot II", YOM_TOV_ENDS | CHUL_ONLY],
  ]);
  add(new Event(new HDate(c.dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)),
    "Leil Selichot", 0));
  add(new Event(new HDate(29, months.ELUL, year), "Erev Rosh Hashana", LIGHT_CANDLES));

  tmpDate = new HDate(10, months.TEVET, year);
  if (tmpDate.getDay() == SAT) {
    tmpDate = tmpDate.next();
  }
  add(new Event(tmpDate, "Asara B'Tevet", 0));

  if (c.LEAP(year)) {
    add(new Event(new HDate(14, months.ADAR_I, year), "Purim Katan", 0));
  }

  if (year >= 5711) {
    // Yom HaShoah first observed in 1951
    tmpDate = new HDate(27, NISAN, year);
    /* When the actual date of Yom Hashoah falls on a Friday, the
     * state of Israel observes Yom Hashoah on the preceding
     * Thursday. When it falls on a Sunday, Yom Hashoah is observed
     * on the following Monday.
     * http://www.ushmm.org/remembrance/dor/calendar/
     */

    if (tmpDate.getDay() == days.FRI) {
      tmpDate = tmpDate.prev();
    } else if (tmpDate.getDay() == days.SUN) {
      tmpDate = tmpDate.next();
    }

    add(new Event(tmpDate, "Yom HaShoah", 0));
  }

  add(atzmaut(year));

  if (year >= 5727) {
    // Yom Yerushalayim only celebrated after 1967
    add(new Event(new HDate(28, months.IYYAR, year), "Yom Yerushalayim", 0));
  }

  tmpDate = new HDate(17, months.TAMUZ, year);
  if (tmpDate.getDay() == SAT) {
    tmpDate = tmpDate.next();
  }
  add(new Event(tmpDate, "Tzom Tammuz", 0));

  tmpDate = new HDate(9, months.AV, year);
  if (tmpDate.getDay() == SAT) {
    tmpDate = tmpDate.next();
  }

  add(new Event(new HDate(c.dayOnOrBefore(SAT, tmpDate.abs())), "Shabbat Chazon", 0));

  add(new Event(tmpDate.prev(), "Erev Tish'a B'Av", 0));

  add(new Event(tmpDate, "Tish'a B'Av", 0));

  add(new Event(new HDate(c.dayOnOrBefore(SAT, tmpDate.abs() + 7)), "Shabbat Nachamu", 0));

  for (let month = 1; month <= c.MONTH_CNT(year); month++) {
    const monthName = c.monthNames[+c.LEAP(year)][month];
    const desc = `Rosh Chodesh ${monthName}`;
    if (
      (month == NISAN
        ? c.daysInMonth(c.MONTH_CNT(year - 1), year - 1)
        : c.daysInMonth(month - 1, year)) == 30
    ) {
      add(new Event(new HDate(1, month, year), desc, 0));
      add(new Event(new HDate(30, month - 1, year), desc, 0));
    } else if (month !== TISHREI) {
      add(new Event(new HDate(1, month, year), desc, 0));
    }

    if (month == months.ELUL) {
      continue;
    }

    add(new Event(new HDate(29, month, year).onOrBefore(SAT), "Shabbat Mevarchim", 0));
  }

  return (__cache[year] = h);
}

function atzmaut(year) {
  if (year >= 5708) {
    // Yom HaAtzma'ut only celebrated after 1948
    const tmpDate = new HDate(1, months.IYYAR, year);

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
      new Event(tmpDate, "Yom HaZikaron", 0),
      new Event(tmpDate.next(), "Yom HaAtzma'ut", 0),
    ];
  }
  return [];
}

export default {
    masks,
    Event,
    year
};
