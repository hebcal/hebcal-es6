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
import {months, days, monthsInHebYear, daysInHebMonth, getMonthName, dayOnOrBefore, hebLeapYear} from './common';
import {HDate} from './hdate';
import {gettext, getTranslation} from './locale';
import {Event, flags} from './event';

// for byte optimizations
const TISHREI = months.TISHREI;
const KISLEV = months.KISLEV;
const NISAN = months.NISAN;
const SAT = days.SAT;

/**
 * @param {number} day
 * @return {string}
 */
function chanukah(day) {
  return `Chanukah: ${day} Candles`;
}

const CHAG = flags.CHAG;
const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
const CHUL_ONLY = flags.CHUL_ONLY;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MINOR_FAST = flags.MINOR_FAST;
const SPECIAL_SHABBAT = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY = flags.MODERN_HOLIDAY;
const MAJOR_FAST = flags.MAJOR_FAST;

const __cache = new Map();

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
export class HolidayEvent extends Event {
  /**
   * Constructs Holiday event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} desc Description (not translated)
   * @param {number} [mask=0] optional holiday flags
   * @param {Object} [attrs={}]
   */
  constructor(date, desc, mask, attrs) {
    super(date, desc, mask, attrs);
  }
  /** @return {string} */
  basename() {
    let s = this.getDesc().replace(/ \d{4}$/, '')
        .replace(/ \(CH''M\)$/, '')
        .replace(/ \(Hoshana Raba\)$/, '');
    if (s != 'Rosh Chodesh Adar II') {
      s = s.replace(/ [IV]+$/, '');
    }
    s = s.replace(/: \d Candles?$/, '')
        .replace(/: 8th Day$/, '')
        .replace(/^Erev /, '');
    return s;
  }
  /**
   * @param {string} locale
   * @return {string}
   */
  renderFullOrBasename(locale) {
    const str = getTranslation(this.getDesc(), locale);
    if (typeof str == 'string') return str;
    return getTranslation(this.basename(), locale);
  }
  /** @return {string} */
  url() {
    return 'https://www.hebcal.com/holidays/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-');
  }
}

const roshChodeshStr = 'Rosh Chodesh';

/** Represents Rosh Chodesh, the beginning of a new month */
export class RoshChodeshEvent extends HolidayEvent {
  /**
   * Constructs Rosh Chodesh event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} monthName Hebrew month name (not translated)
   */
  constructor(date, monthName) {
    super(date, `${roshChodeshStr} ${monthName}`, flags.ROSH_CHODESH);
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const monthName = this.getDesc().substring(roshChodeshStr.length + 1);
    return gettext(roshChodeshStr, locale) + ' ' + gettext(monthName, locale);
  }
  /** @return {string} */
  basename() {
    return this.getDesc();
  }
}

const mevarchimChodeshStr = 'Shabbat Mevarchim Chodesh';

/** Represents Mevarchim haChodesh, the announcement of the new month */
export class MevarchimChodeshEvent extends Event {
  /**
   * Constructs Mevarchim haChodesh event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} monthName Hebrew month name (not translated)
   */
  constructor(date, monthName) {
    super(date, `${mevarchimChodeshStr} ${monthName}`, flags.SHABBAT_MEVARCHIM);
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const monthName = this.getDesc().substring(mevarchimChodeshStr.length + 1);
    return gettext(mevarchimChodeshStr, locale) + ' ' + gettext(monthName, locale);
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    const str = this.render(locale);
    const space = str.indexOf(' ');
    return str.substring(space + 1);
  }
}

/**
 * Returns a Map for the year indexed by HDate.toString()
 * @param {number} year Hebrew year
 * @return {Map<string,Event[]>}
 */
export function getHolidaysForYear(year) {
  const cached = __cache.get(year);
  if (cached) {
    return cached;
  }

  const RH = new HDate(1, TISHREI, year);
  const pesach = new HDate(15, NISAN, year);

  const h = new Map();
  // eslint-disable-next-line require-jsdoc
  function add(...events) {
    for (const ev of events) {
      const key = ev.date.toString();
      if (h.has(key)) {
        h.get(key).push(ev);
      } else {
        h.set(key, [ev]);
      }
    }
  }

  /**
   * @param {number} year
   * @param {Object[]} arr
   */
  function addEvents(year, arr) {
    for (const a of arr) {
      const [day, month, desc, mask, attrs] = a;
      //      console.debug(day, month, year, desc, mask);
      add(new HolidayEvent(new HDate(day, month, year), desc, mask, attrs));
    }
  }

  // standard holidays that don't shift based on year
  add(new HolidayEvent(RH, `Rosh Hashana ${year}`, CHAG | LIGHT_CANDLES_TZEIS));
  addEvents(year, [
    [2, TISHREI, 'Rosh Hashana II', CHAG | YOM_TOV_ENDS],
    [3 + (RH.getDay() == days.THU),
      TISHREI, 'Tzom Gedaliah', MINOR_FAST], // push off to SUN if RH is THU
    [9, TISHREI, 'Erev Yom Kippur', LIGHT_CANDLES],
  ]);
  // first SAT after RH
  add(new HolidayEvent(new HDate(dayOnOrBefore(SAT, 7 + RH.abs())), 'Shabbat Shuva', SPECIAL_SHABBAT));
  addEvents(year, [
    [10, TISHREI, 'Yom Kippur', CHAG | YOM_TOV_ENDS | MAJOR_FAST],
    [14, TISHREI, 'Erev Sukkot', LIGHT_CANDLES],

    // Attributes for Israel and Diaspora are different
    [15, TISHREI, 'Sukkot I', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [16, TISHREI, 'Sukkot II', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [17, TISHREI, 'Sukkot III (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 1}],
    [18, TISHREI, 'Sukkot IV (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 2}],
    [19, TISHREI, 'Sukkot V (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 3}],
    [20, TISHREI, 'Sukkot VI (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 4}],

    [15, TISHREI, 'Sukkot I', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [16, TISHREI, 'Sukkot II (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 1}],
    [17, TISHREI, 'Sukkot III (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 2}],
    [18, TISHREI, 'Sukkot IV (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 3}],
    [19, TISHREI, 'Sukkot V (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 4}],
    [20, TISHREI, 'Sukkot VI (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 5}],
    [21, TISHREI, 'Sukkot VII (Hoshana Raba)', LIGHT_CANDLES, {cholHaMoedDay: -1}],
    [22, TISHREI, 'Shmini Atzeret', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    //    [22,  TISHREI,    "Shmini Atzeret / Simchat Torah", YOM_TOV_ENDS | IL_ONLY],
    [22, TISHREI, 'Shmini Atzeret', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [23, TISHREI, 'Simchat Torah', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [24, KISLEV, 'Chanukah: 1 Candle', CHANUKAH_CANDLES],
    [25, KISLEV, chanukah(2), CHANUKAH_CANDLES, {chanukahDay: 1}],
    [26, KISLEV, chanukah(3), CHANUKAH_CANDLES, {chanukahDay: 2}],
    [27, KISLEV, chanukah(4), CHANUKAH_CANDLES, {chanukahDay: 3}],
    [28, KISLEV, chanukah(5), CHANUKAH_CANDLES, {chanukahDay: 4}],
    [29, KISLEV, chanukah(6), CHANUKAH_CANDLES, {chanukahDay: 5}],
    [30, KISLEV, chanukah(7), CHANUKAH_CANDLES, {chanukahDay: 6}], // yes, i know these are wrong
    [31, KISLEV, chanukah(8), CHANUKAH_CANDLES, {chanukahDay: 7}], // HDate() corrects the month automatically
    [32, KISLEV, 'Chanukah: 8th Day', 0, {chanukahDay: 8}],
    [15, months.SHVAT, 'Tu BiShvat', 0],
  ]);
  const pesachAbs = pesach.abs();
  add(
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, pesachAbs - 43)), 'Shabbat Shekalim', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, pesachAbs - 30)), 'Shabbat Zachor', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(pesachAbs - (pesach.getDay() == days.TUE ? 33 : 31)),
          'Ta\'anit Esther', MINOR_FAST),
  );
  addEvents(year, [
    [13, months.ADAR_II, 'Erev Purim', 0],
    [14, months.ADAR_II, 'Purim', 0],
    [15, months.ADAR_II, 'Shushan Purim', 0],
  ]);
  add(
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, pesachAbs - 14) - 7), 'Shabbat Parah', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, pesachAbs - 14)), 'Shabbat HaChodesh', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, pesachAbs - 1)), 'Shabbat HaGadol', SPECIAL_SHABBAT),
      new HolidayEvent(
      // if the fast falls on Shabbat, move to Thursday
      pesach.prev().getDay() == SAT ?
        pesach.onOrBefore(days.THU) :
        new HDate(14, NISAN, year),
      'Ta\'anit Bechorot',
      MINOR_FAST,
      ),
  );
  addEvents(year, [
    [14, NISAN, 'Erev Pesach', LIGHT_CANDLES],

    // Attributes for Israel and Diaspora are different
    [15, NISAN, 'Pesach I', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [16, NISAN, 'Pesach II (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 1}],
    [17, NISAN, 'Pesach III (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 2}],
    [18, NISAN, 'Pesach IV (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 3}],
    [19, NISAN, 'Pesach V (CH\'\'M)', IL_ONLY, {cholHaMoedDay: 4}],
    [20, NISAN, 'Pesach VI (CH\'\'M)', LIGHT_CANDLES | IL_ONLY, {cholHaMoedDay: 5}],
    [21, NISAN, 'Pesach VII', CHAG | YOM_TOV_ENDS | IL_ONLY],

    [15, NISAN, 'Pesach I', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [16, NISAN, 'Pesach II', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [17, NISAN, 'Pesach III (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 1}],
    [18, NISAN, 'Pesach IV (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 2}],
    [19, NISAN, 'Pesach V (CH\'\'M)', CHUL_ONLY, {cholHaMoedDay: 3}],
    [20, NISAN, 'Pesach VI (CH\'\'M)', LIGHT_CANDLES | CHUL_ONLY, {cholHaMoedDay: 4}],
    [21, NISAN, 'Pesach VII', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [22, NISAN, 'Pesach VIII', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [14, months.IYYAR, 'Pesach Sheni', 0],
    [18, months.IYYAR, 'Lag BaOmer', 0],
    [5, months.SIVAN, 'Erev Shavuot', LIGHT_CANDLES],
    [6, months.SIVAN, 'Shavuot', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [6, months.SIVAN, 'Shavuot I', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [7, months.SIVAN, 'Shavuot II', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [15, months.AV, 'Tu B\'Av', 0],
  ]);
  add(new HolidayEvent(new HDate(dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)),
      'Leil Selichot', 0));
  add(new HolidayEvent(new HDate(29, months.ELUL, year), 'Erev Rosh Hashana', LIGHT_CANDLES));

  let tevet10dt = new HDate(10, months.TEVET, year);
  let tevet10attrs;
  if (tevet10dt.getDay() == SAT) {
    tevet10dt = tevet10dt.next();
    tevet10attrs = {observed: true};
  }
  add(new HolidayEvent(tevet10dt, 'Asara B\'Tevet', MINOR_FAST, tevet10attrs));

  if (hebLeapYear(year)) {
    add(new HolidayEvent(new HDate(14, months.ADAR_I, year), 'Purim Katan', 0));
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

    add(new HolidayEvent(nisan27dt, 'Yom HaShoah', MODERN_HOLIDAY));
  }

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

    add(
        new HolidayEvent(tmpDate, 'Yom HaZikaron', MODERN_HOLIDAY),
        new HolidayEvent(tmpDate.next(), 'Yom HaAtzma\'ut', MODERN_HOLIDAY),
    );
  }

  if (year >= 5727) {
    // Yom Yerushalayim only celebrated after 1967
    add(new HolidayEvent(new HDate(28, months.IYYAR, year), 'Yom Yerushalayim', MODERN_HOLIDAY));
  }

  if (year >= 5769) {
    add(new HolidayEvent(new HDate(29, months.CHESHVAN, year), 'Sigd', MODERN_HOLIDAY));
  }

  if (year >= 5777) {
    add(new HolidayEvent(new HDate(7, months.CHESHVAN, year), 'Yom HaAliyah', MODERN_HOLIDAY));
  }

  let tamuz17 = new HDate(17, months.TAMUZ, year);
  let tamuz17attrs;
  if (tamuz17.getDay() == SAT) {
    tamuz17 = tamuz17.next();
    tamuz17attrs = {observed: true};
  }
  add(new HolidayEvent(tamuz17, 'Tzom Tammuz', MINOR_FAST, tamuz17attrs));

  let av9dt = new HDate(9, months.AV, year);
  let av9attrs;
  if (av9dt.getDay() == SAT) {
    av9dt = av9dt.next();
    av9attrs = {observed: true};
  }

  add(
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, av9dt.abs())), 'Shabbat Chazon', SPECIAL_SHABBAT),
      new HolidayEvent(av9dt.prev(), 'Erev Tish\'a B\'Av', 0, av9attrs),
      new HolidayEvent(av9dt, 'Tish\'a B\'Av', MAJOR_FAST, av9attrs),
      new HolidayEvent(new HDate(dayOnOrBefore(SAT, av9dt.abs() + 7)), 'Shabbat Nachamu', SPECIAL_SHABBAT),
  );

  for (let month = 1; month <= monthsInHebYear(year); month++) {
    const monthName = getMonthName(month, year);
    if (
      (month == NISAN ?
        daysInHebMonth(monthsInHebYear(year - 1), year - 1) :
        daysInHebMonth(month - 1, year)) == 30
    ) {
      add(new RoshChodeshEvent(new HDate(1, month, year), monthName));
      add(new RoshChodeshEvent(new HDate(30, month - 1, year), monthName));
    } else if (month !== TISHREI) {
      add(new RoshChodeshEvent(new HDate(1, month, year), monthName));
    }

    if (month == months.ELUL) {
      continue;
    }

    // Don't worry about month overrun; will get "Nisan" for month=14
    const nextMonthName = getMonthName(month + 1, year);
    add(new MevarchimChodeshEvent(new HDate(29, month, year).onOrBefore(SAT), nextMonthName));
  }

  __cache.set(year, h);
  return h;
}

/**
 * Returns an array of Events on this date (or undefined if no events)
 * @param {HDate|Date|number} date Hebrew Date, Gregorian date, or absolute Julian date
 * @return {Event[]}
 */
export function getHolidaysOnDate(date) {
  const hd = date instanceof HDate ? date : new HDate(date);
  const y = getHolidaysForYear(hd.getFullYear());
  return y.get(hd.toString());
}
