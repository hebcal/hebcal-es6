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
import {Locale} from './locale';
import {HDate, months} from './hdate';
import {Event, flags, KEYCAP_DIGITS} from './event';
import {MoladEvent} from './molad';
import {Sedra} from './sedra';

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
    return this.getDesc().replace(/ \d{4}$/, '')
        .replace(/ \(CH''M\)$/, '')
        .replace(/ \(observed\)$/, '')
        .replace(/ \(Hoshana Raba\)$/, '')
        .replace(/ [IV]+$/, '')
        .replace(/: \d Candles?$/, '')
        .replace(/: 8th Day$/, '')
        .replace(/^Erev /, '');
  }
  /** @return {string} */
  url() {
    const year = this.getDate().greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const url = 'https://www.hebcal.com/holidays/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') + '-' +
      this.urlDateSuffix();
    return (this.getFlags() & flags.IL_ONLY) ? url + '?i=on' : url;
  }
  /** @return {string} */
  urlDateSuffix() {
    const year = this.getDate().greg().getFullYear();
    return year;
  }
  /** @return {string} */
  getEmoji() {
    if (this.emoji) {
      return this.emoji;
    } else if (this.getFlags() & flags.SPECIAL_SHABBAT) {
      return '🕍';
    } else {
      return '✡️';
    }
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
    return Locale.gettext(roshChodeshStr, locale) + ' ' + Locale.gettext(monthName, locale);
  }
  /** @return {string} */
  basename() {
    return this.getDesc();
  }
  /** @return {string} */
  getEmoji() {
    return this.emoji || '🌑';
  }
}

/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to override the `url()` method.
 */
export class AsaraBTevetEvent extends HolidayEvent {
  /**
   * Constructs AsaraBTevetEvent
   * @param {HDate} date Hebrew date event occurs
   * @param {string} desc Description (not translated)
   * @param {number} [mask=0] optional holiday flags
   * @param {Object} [attrs={}]
   */
  constructor(date, desc, mask, attrs) {
    super(date, desc, mask, attrs);
  }
  /** @return {string} */
  urlDateSuffix() {
    const isoDateTime = this.getDate().greg().toISOString();
    const isoDate = isoDateTime.substring(0, isoDateTime.indexOf('T'));
    return isoDate.replace(/-/g, '');
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
    this.monthName = monthName;
    const hyear = date.getFullYear();
    const hmonth = date.getMonth();
    const monNext = (hmonth == HDate.monthsInYear(hyear) ? months.NISAN : hmonth + 1);
    const molad = new MoladEvent(date, hyear, monNext);
    this.memo = molad.render();
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext(mevarchimChodeshStr, locale) + ' ' + Locale.gettext(this.monthName, locale);
  }
}

/**
 * @private
 */
export class RoshHashanaEvent extends HolidayEvent {
  /**
   * @private
   * @param {HDate} date Hebrew date event occurs
   * @param {number} hyear Hebrew year
   * @param {number} mask optional holiday flags
   */
  constructor(date, hyear, mask) {
    super(date, `Rosh Hashana ${hyear}`, mask, {emoji: '🍏🍯'});
    this.hyear = hyear;
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext('Rosh Hashana', locale) + ' ' + this.hyear;
  }
}

const SUN = 0;
// const MON = 1;
const TUE = 2;
// const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

const NISAN = months.NISAN;
const IYYAR = months.IYYAR;
const SIVAN = months.SIVAN;
const TAMUZ = months.TAMUZ;
const AV = months.AV;
const ELUL = months.ELUL;
const TISHREI = months.TISHREI;
const CHESHVAN = months.CHESHVAN;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const SHVAT = months.SHVAT;
const ADAR_I = months.ADAR_I;
const ADAR_II = months.ADAR_II;

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
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;

/** @private */
class SimpleMap {
  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return typeof this[key] !== 'undefined';
  }
  /**
   * @param {string} key
   * @return {any}
   */
  get(key) {
    return this[key];
  }
  /**
   * @param {string} key
   * @param {any} val
   */
  set(key, val) {
    this[key] = val;
  }
  /**
   * @return {string[]}
   */
  keys() {
    return Object.keys(this);
  }
}

/**
 * @private
 * @param {number} day
 * @return {string}
 */
function chanukah(day) {
  return `Chanukah: ${day} Candles`;
}

const yearCache = Object.create(null);

/**
 * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
 * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
 * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
 * @private
 * @param {number} year Hebrew year
 * @return {Map<string,Event[]>}
 */
export function getHolidaysForYear(year) {
  if (typeof year !== 'number') {
    throw new TypeError(`bad Hebrew year: ${year}`);
  } else if (year < 1 || year > 32658) {
    throw new RangeError(`Hebrew year ${year} out of range 1-32658`);
  }
  const cached = yearCache[year];
  if (cached) {
    return cached;
  }

  const RH = new HDate(1, TISHREI, year);
  const pesach = new HDate(15, NISAN, year);

  const h = new SimpleMap();
  // eslint-disable-next-line require-jsdoc
  function add(...events) {
    // for (const ev of events) {
    events.forEach((ev) => {
      const key = ev.date.toString();
      if (h.has(key)) {
        h.get(key).push(ev);
      } else {
        h.set(key, [ev]);
      }
    });
  }

  /**
   * @private
   * @param {number} year
   * @param {Object[]} arr
   */
  function addEvents(year, arr) {
    arr.forEach((a) => {
      add(new HolidayEvent(new HDate(a[0], a[1], year), a[2], a[3], a[4]));
    });
  }

  // standard holidays that don't shift based on year
  add(new RoshHashanaEvent(RH, year, CHAG | LIGHT_CANDLES_TZEIS));
  addEvents(year, [
    [2, TISHREI, 'Rosh Hashana II', CHAG | YOM_TOV_ENDS, {emoji: '🍏🍯'}],
    [3 + (RH.getDay() == THU),
      TISHREI, 'Tzom Gedaliah', MINOR_FAST],
    [9, TISHREI, 'Erev Yom Kippur', EREV | LIGHT_CANDLES, {emoji: '📖✍️'}],
  ]);
  // first SAT after RH
  add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, 7 + RH.abs())), 'Shabbat Shuva', SPECIAL_SHABBAT));
  addEvents(year, [
    [10, TISHREI, 'Yom Kippur', CHAG | YOM_TOV_ENDS | MAJOR_FAST, {emoji: '📖✍️'}],
    [14, TISHREI, 'Erev Sukkot', EREV | LIGHT_CANDLES],

    // Attributes for Israel and Diaspora are different
    [15, TISHREI, 'Sukkot I', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [16, TISHREI, 'Sukkot II', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [17, TISHREI, 'Sukkot III (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 1}],
    [18, TISHREI, 'Sukkot IV (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 2}],
    [19, TISHREI, 'Sukkot V (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 3}],
    [20, TISHREI, 'Sukkot VI (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 4}],

    [15, TISHREI, 'Sukkot I', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [16, TISHREI, 'Sukkot II (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 1}],
    [17, TISHREI, 'Sukkot III (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 2}],
    [18, TISHREI, 'Sukkot IV (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 3}],
    [19, TISHREI, 'Sukkot V (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 4}],
    [20, TISHREI, 'Sukkot VI (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 5}],
    [21, TISHREI, 'Sukkot VII (Hoshana Raba)', LIGHT_CANDLES | CHOL_HAMOED, {cholHaMoedDay: -1}],
    [22, TISHREI, 'Shmini Atzeret', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    //    [22,  TISHREI,    "Shmini Atzeret / Simchat Torah", YOM_TOV_ENDS | IL_ONLY],
    [22, TISHREI, 'Shmini Atzeret', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [23, TISHREI, 'Simchat Torah', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
  ]);
  const chanukahEmoji = '🕎';
  add(new HolidayEvent(new HDate(24, KISLEV, year),
      'Chanukah: 1 Candle', EREV | MINOR_HOLIDAY | CHANUKAH_CANDLES,
      {emoji: chanukahEmoji + KEYCAP_DIGITS[1]}));
  // yes, we know Kislev 30-32 are wrong
  // HDate() corrects the month automatically
  for (let candles = 2; candles <= 8; candles++) {
    const hd = new HDate(23 + candles, KISLEV, year);
    add(new HolidayEvent(hd,
        `Chanukah: ${candles} Candles`,
        MINOR_HOLIDAY | CHANUKAH_CANDLES,
        {chanukahDay: candles - 1, emoji: chanukahEmoji + KEYCAP_DIGITS[candles]}));
  }
  add(new HolidayEvent(new HDate(32, KISLEV, year),
      'Chanukah: 8th Day', MINOR_HOLIDAY, {chanukahDay: 8, emoji: chanukahEmoji}));
  add(
      new AsaraBTevetEvent(new HDate(10, TEVET, year), 'Asara B\'Tevet', MINOR_FAST),
      new HolidayEvent(new HDate(15, SHVAT, year), 'Tu BiShvat', MINOR_HOLIDAY, {emoji: '🌳'}),
  );
  const pesachAbs = pesach.abs();
  add(
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 43)), 'Shabbat Shekalim', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 30)), 'Shabbat Zachor', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(pesachAbs - (pesach.getDay() == TUE ? 33 : 31)),
          'Ta\'anit Esther', MINOR_FAST),
  );
  addEvents(year, [
    [13, ADAR_II, 'Erev Purim', EREV | MINOR_HOLIDAY, {emoji: '🎭️📜'}],
    [14, ADAR_II, 'Purim', MINOR_HOLIDAY, {emoji: '🎭️📜'}],
  ]);
  add(
      new HolidayEvent(new HDate(pesachAbs - (pesach.getDay() == SUN ? 28 : 29)), 'Shushan Purim',
          MINOR_HOLIDAY, {emoji: '🎭️📜'}),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 14) - 7), 'Shabbat Parah', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 14)), 'Shabbat HaChodesh', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 1)), 'Shabbat HaGadol', SPECIAL_SHABBAT),
      new HolidayEvent(
        // if the fast falls on Shabbat, move to Thursday
        pesach.prev().getDay() == SAT ?
          pesach.onOrBefore(THU) :
          new HDate(14, NISAN, year),
        'Ta\'anit Bechorot',
        MINOR_FAST,
      ),
  );
  addEvents(year, [
    [14, NISAN, 'Erev Pesach', EREV | LIGHT_CANDLES],

    // Attributes for Israel and Diaspora are different
    [15, NISAN, 'Pesach I', CHAG | YOM_TOV_ENDS | IL_ONLY],
    [16, NISAN, 'Pesach II (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 1}],
    [17, NISAN, 'Pesach III (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 2}],
    [18, NISAN, 'Pesach IV (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 3}],
    [19, NISAN, 'Pesach V (CH\'\'M)', IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 4}],
    [20, NISAN, 'Pesach VI (CH\'\'M)', LIGHT_CANDLES | IL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 5}],
    [21, NISAN, 'Pesach VII', CHAG | YOM_TOV_ENDS | IL_ONLY],

    [15, NISAN, 'Pesach I', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [16, NISAN, 'Pesach II', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [17, NISAN, 'Pesach III (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 1}],
    [18, NISAN, 'Pesach IV (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 2}],
    [19, NISAN, 'Pesach V (CH\'\'M)', CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 3}],
    [20, NISAN, 'Pesach VI (CH\'\'M)', LIGHT_CANDLES | CHUL_ONLY | CHOL_HAMOED, {cholHaMoedDay: 4}],
    [21, NISAN, 'Pesach VII', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY],
    [22, NISAN, 'Pesach VIII', CHAG | YOM_TOV_ENDS | CHUL_ONLY],
    [14, IYYAR, 'Pesach Sheni', MINOR_HOLIDAY],
    [18, IYYAR, 'Lag BaOmer', MINOR_HOLIDAY, {emoji: '🔥'}],
    [5, SIVAN, 'Erev Shavuot', EREV | LIGHT_CANDLES, {emoji: '⛰️🌸'}],
    [6, SIVAN, 'Shavuot', CHAG | YOM_TOV_ENDS | IL_ONLY, {emoji: '⛰️🌸'}],
    [6, SIVAN, 'Shavuot I', CHAG | LIGHT_CANDLES_TZEIS | CHUL_ONLY, {emoji: '⛰️🌸'}],
    [7, SIVAN, 'Shavuot II', CHAG | YOM_TOV_ENDS | CHUL_ONLY, {emoji: '⛰️🌸'}],
    [15, AV, 'Tu B\'Av', MINOR_HOLIDAY, {emoji: '❤️'}],
    [1, ELUL, 'Rosh Hashana LaBehemot', MINOR_HOLIDAY, {emoji: '🐑'}],
  ]);
  add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)),
      'Leil Selichot', MINOR_HOLIDAY, {emoji: '🕍'}));
  add(new HolidayEvent(new HDate(29, ELUL, year), 'Erev Rosh Hashana', EREV | LIGHT_CANDLES, {emoji: '🍏🍯'}));

  if (HDate.isLeapYear(year)) {
    add(new HolidayEvent(new HDate(14, ADAR_I, year), 'Purim Katan', MINOR_HOLIDAY, {emoji: '🎭️'}));
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
    if (nisan27dt.getDay() == FRI) {
      nisan27dt = nisan27dt.prev();
    } else if (nisan27dt.getDay() == SUN) {
      nisan27dt = nisan27dt.next();
    }
    add(new HolidayEvent(nisan27dt, 'Yom HaShoah', MODERN_HOLIDAY));
  }

  if (year >= 5708) {
    // Yom HaAtzma'ut only celebrated after 1948
    const tmpDate = new HDate(1, IYYAR, year);
    const pesach = new HDate(15, NISAN, year);
    if (pesach.getDay() == SUN) {
      tmpDate.setDate(2);
    } else if (pesach.getDay() == SAT) {
      tmpDate.setDate(3);
    } else if (year < 5764) {
      tmpDate.setDate(4);
    } else if (pesach.getDay() == TUE) {
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
    add(new HolidayEvent(new HDate(28, IYYAR, year), 'Yom Yerushalayim', MODERN_HOLIDAY));
  }

  if (year >= 5769) {
    add(new HolidayEvent(new HDate(29, CHESHVAN, year), 'Sigd', MODERN_HOLIDAY));
  }

  if (year >= 5777) {
    add(new HolidayEvent(new HDate(7, CHESHVAN, year), 'Yom HaAliyah', MODERN_HOLIDAY));
  }

  let tamuz17 = new HDate(17, TAMUZ, year);
  let tamuz17attrs;
  if (tamuz17.getDay() == SAT) {
    tamuz17 = tamuz17.next();
    tamuz17attrs = {observed: true};
  }
  add(new HolidayEvent(tamuz17, 'Tzom Tammuz', MINOR_FAST, tamuz17attrs));

  let av9dt = new HDate(9, AV, year);
  let av9title = 'Tish\'a B\'Av';
  let av9attrs;
  if (av9dt.getDay() == SAT) {
    av9dt = av9dt.next();
    av9attrs = {observed: true};
    av9title += ' (observed)';
  }

  add(
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, av9dt.abs())), 'Shabbat Chazon', SPECIAL_SHABBAT),
      new HolidayEvent(av9dt.prev(), 'Erev Tish\'a B\'Av', EREV | MAJOR_FAST, av9attrs),
      new HolidayEvent(av9dt, av9title, MAJOR_FAST, av9attrs),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, av9dt.abs() + 7)), 'Shabbat Nachamu', SPECIAL_SHABBAT),
  );

  for (let month = 1; month <= HDate.monthsInYear(year); month++) {
    const monthName = HDate.getMonthName(month, year);
    if ((month == NISAN ?
        HDate.daysInMonth(HDate.monthsInYear(year - 1), year - 1) :
        HDate.daysInMonth(month - 1, year)) == 30) {
      add(new RoshChodeshEvent(new HDate(1, month, year), monthName));
      add(new RoshChodeshEvent(new HDate(30, month - 1, year), monthName));
    } else if (month !== TISHREI) {
      add(new RoshChodeshEvent(new HDate(1, month, year), monthName));
    }

    if (month == ELUL) {
      continue;
    }

    // Don't worry about month overrun; will get "Nisan" for month=14
    const nextMonthName = HDate.getMonthName(month + 1, year);
    add(new MevarchimChodeshEvent(new HDate(29, month, year).onOrBefore(SAT), nextMonthName));
  }

  const sedra = new Sedra(year, false);
  const beshalachHd = sedra.find(15);
  add(new HolidayEvent(beshalachHd, 'Shabbat Shirah', SPECIAL_SHABBAT));

  yearCache[year] = h;
  return h;
}
