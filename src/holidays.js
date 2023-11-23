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
import {Event, flags} from './event';
import {MoladEvent} from './molad';
import {Sedra} from './sedra';
import {dateYomHaZikaron, dateYomHaShoah} from './modern';
import {staticHolidays, staticModernHolidays} from './staticHolidays';

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
export class HolidayEvent extends Event {
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
  /** @return {string[]} */
  getCategories() {
    if (this.cholHaMoedDay) {
      return ['holiday', 'major', 'cholhamoed'];
    }
    const cats = super.getCategories();
    if (cats[0] !== 'unknown') {
      return cats;
    }
    const desc = this.getDesc();
    // Don't depend on flags.MINOR_HOLIDAY always being set
    switch (desc) {
      case 'Lag BaOmer':
      case 'Leil Selichot':
      case 'Pesach Sheni':
      case 'Erev Purim':
      case 'Purim Katan':
      case 'Shushan Purim':
      case 'Tu B\'Av':
      case 'Tu BiShvat':
      case 'Rosh Hashana LaBehemot':
        return ['holiday', 'minor'];
      default:
        return ['holiday', 'major'];
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
    return this.emoji || '🌒';
  }
}

/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to override the `url()` method.
 */
export class AsaraBTevetEvent extends HolidayEvent {
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
    this.memo = molad.render('en');
  }
  /** @return {string} */
  basename() {
    return this.getDesc();
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

/** Represents Rosh Hashana, the Jewish New Year */
export class RoshHashanaEvent extends HolidayEvent {
  /**
   * @private
   * @param {HDate} date Hebrew date event occurs
   * @param {number} hyear Hebrew year
   * @param {number} mask optional holiday flags
   */
  constructor(date, hyear, mask) {
    super(date, `Rosh Hashana ${hyear}`, mask);
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
  /** @return {string} */
  getEmoji() {
    return '🍏🍯';
  }
}

const ykk = 'Yom Kippur Katan';

/** YKK is minor day of atonement on the day preceeding each Rosh Chodesh */
export class YomKippurKatanEvent extends HolidayEvent {
  /**
   * @private
   * @param {HDate} date Hebrew date event occurs
   * @param {string} nextMonthName name of the upcoming month
   */
  constructor(date, nextMonthName) {
    super(date, `${ykk} ${nextMonthName}`, flags.MINOR_FAST | flags.YOM_KIPPUR_KATAN);
    this.nextMonthName = nextMonthName;
    this.memo = `Minor Day of Atonement on the day preceeding Rosh Chodesh ${nextMonthName}`;
  }
  /** @return {string} */
  basename() {
    return this.getDesc();
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext(ykk, locale) + ' ' + Locale.gettext(this.nextMonthName, locale);
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext(ykk, locale);
  }
  /** @return {string} */
  url() {
    return undefined;
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
// const IYYAR = months.IYYAR;
// const SIVAN = months.SIVAN;
const TAMUZ = months.TAMUZ;
const AV = months.AV;
const ELUL = months.ELUL;
const TISHREI = months.TISHREI;
// const CHESHVAN = months.CHESHVAN;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
// const SHVAT = months.SHVAT;
const ADAR_I = months.ADAR_I;
// const ADAR_II = months.ADAR_II;

const CHAG = flags.CHAG;
// const LIGHT_CANDLES = flags.LIGHT_CANDLES;
// const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
// const CHUL_ONLY = flags.CHUL_ONLY;
// const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MINOR_FAST = flags.MINOR_FAST;
const SPECIAL_SHABBAT = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY = flags.MODERN_HOLIDAY;
const MAJOR_FAST = flags.MAJOR_FAST;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
// const CHOL_HAMOED = flags.CHOL_HAMOED;

/**
 * Avoid dependency on ES6 Map object
 * @private
 */
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

const sedraCache = new SimpleMap();

/**
 * @private
 * @param {number} hyear
 * @param {boolean} il
 * @return {Sedra}
 */
export function getSedra_(hyear, il) {
  const cacheKey = `${hyear}-${il ? 1 : 0}`;
  let sedra = sedraCache.get(cacheKey);
  if (!sedra) {
    sedra = new Sedra(hyear, il);
    sedraCache.set(cacheKey, sedra);
  }
  return sedra;
}

const emojiIsraelFlag = {emoji: '🇮🇱'};
const chanukahEmoji = '🕎';
const yearCache = new Map();

const KEYCAP_DIGITS = [
  '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣',
  '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣',
];

/**
 * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
 * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
 * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
 * @private
 * @param {number} year Hebrew year
 * @return {Map<string,Event[]>}
 */
export function getHolidaysForYear_(year) {
  if (typeof year !== 'number') {
    throw new TypeError(`bad Hebrew year: ${year}`);
  } else if (year < 1 || year > 32658) {
    throw new RangeError(`Hebrew year ${year} out of range 1-32658`);
  }
  const cached = yearCache.get(year);
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
      const arr = h.get(key);
      if (typeof arr === 'object') {
        if (arr[0].getFlags() & flags.EREV) {
          arr.unshift(ev);
        } else {
          arr.push(ev);
        }
      } else {
        h.set(key, [ev]);
      }
    });
  }

  staticHolidays.forEach((h) => {
    const hd = new HDate(h.dd, h.mm, year);
    const ev = new HolidayEvent(hd, h.desc, h.flags);
    if (h.emoji) ev.emoji = h.emoji;
    if (h.chmDay) ev.cholHaMoedDay = h.chmDay;
    add(ev);
  });

  // standard holidays that don't shift based on year
  add(new RoshHashanaEvent(RH, year, CHAG | LIGHT_CANDLES_TZEIS));

  // Variable date holidays
  add(new HolidayEvent(new HDate(3 + (RH.getDay() == THU), TISHREI, year),
      'Tzom Gedaliah', MINOR_FAST));
  // first SAT after RH
  add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, 7 + RH.abs())), 'Shabbat Shuva', SPECIAL_SHABBAT));
  const rchTevet = HDate.shortKislev(year) ?
    new HDate(1, TEVET, year) : new HDate(30, KISLEV, year);
  add(new HolidayEvent(rchTevet, 'Chag HaBanot', MINOR_HOLIDAY));
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
  );
  const pesachAbs = pesach.abs();
  add(
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 43)), 'Shabbat Shekalim', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 30)), 'Shabbat Zachor', SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(pesachAbs - (pesach.getDay() == TUE ? 33 : 31)),
          'Ta\'anit Esther', MINOR_FAST),
  );
  add(
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
  add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)),
      'Leil Selichot', MINOR_HOLIDAY, {emoji: '🕍'}));

  if (pesach.getDay() == SUN) {
    add(new HolidayEvent(new HDate(16, months.ADAR_II, year), 'Purim Meshulash', MINOR_HOLIDAY));
  }

  if (HDate.isLeapYear(year)) {
    add(new HolidayEvent(new HDate(14, ADAR_I, year), 'Purim Katan', MINOR_HOLIDAY, {emoji: '🎭️'}));
    add(new HolidayEvent(new HDate(15, ADAR_I, year), 'Shushan Purim Katan', MINOR_HOLIDAY, {emoji: '🎭️'}));
  }

  const nisan27dt = dateYomHaShoah(year);
  if (nisan27dt) {
    add(new HolidayEvent(nisan27dt, 'Yom HaShoah', MODERN_HOLIDAY));
  }

  const yomHaZikaronDt = dateYomHaZikaron(year);
  if (yomHaZikaronDt) {
    add(
        new HolidayEvent(yomHaZikaronDt, 'Yom HaZikaron', MODERN_HOLIDAY, emojiIsraelFlag),
        new HolidayEvent(yomHaZikaronDt.next(), 'Yom HaAtzma\'ut', MODERN_HOLIDAY, emojiIsraelFlag),
    );
  }

  staticModernHolidays.forEach((h) => {
    if (year >= h.firstYear) {
      let hd = new HDate(h.dd, h.mm, year);
      const dow = hd.getDay();
      if (h.friSatMovetoThu && (dow === FRI || dow === SAT)) {
        hd = hd.onOrBefore(THU);
      } else if (h.friPostponeToSun && dow === FRI) {
        hd = new HDate(hd.abs() + 2);
      } else if (h.satPostponeToSun && dow === SAT) {
        hd = hd.next();
      }
      const mask = h.chul ? MODERN_HOLIDAY : (MODERN_HOLIDAY | flags.IL_ONLY);
      const ev = new HolidayEvent(hd, h.desc, mask);
      if (!h.suppressEmoji) {
        ev.emoji = '🇮🇱';
      }
      add(ev);
    }
  });

  let tamuz17 = new HDate(17, TAMUZ, year);
  let tamuz17attrs;
  if (tamuz17.getDay() == SAT) {
    tamuz17 = new HDate(18, TAMUZ, year);
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
  const av9abs = av9dt.abs();
  add(
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, av9abs)), 'Shabbat Chazon', SPECIAL_SHABBAT),
      new HolidayEvent(av9dt.prev(), 'Erev Tish\'a B\'Av', EREV | MAJOR_FAST, av9attrs),
      new HolidayEvent(av9dt, av9title, MAJOR_FAST, av9attrs),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, av9abs + 7)), 'Shabbat Nachamu', SPECIAL_SHABBAT),
  );

  const monthsInYear = HDate.monthsInYear(year);
  for (let month = 1; month <= monthsInYear; month++) {
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

  // Begin: Yom Kippur Katan
  // start at Iyyar because one may not fast during Nisan
  for (let month = months.IYYAR; month <= monthsInYear; month++) {
    const nextMonth = month + 1;
    // Yom Kippur Katan is not observed on the day before Rosh Hashanah.
    // Not observed prior to Rosh Chodesh Cheshvan because Yom Kippur has just passed.
    // Not observed before Rosh Chodesh Tevet, because that day is Hanukkah.
    if (nextMonth === months.TISHREI || nextMonth === months.CHESHVAN || nextMonth === months.TEVET) {
      continue;
    }
    let ykk = new HDate(29, month, year);
    const dow = ykk.getDay();
    if (dow === FRI || dow === SAT) {
      ykk = ykk.onOrBefore(THU);
    }

    const nextMonthName = HDate.getMonthName(nextMonth, year);
    const ev = new YomKippurKatanEvent(ykk, nextMonthName);
    add(ev);
  }

  const sedra = getSedra_(year, false);
  const beshalachHd = sedra.find(15);
  add(new HolidayEvent(beshalachHd, 'Shabbat Shirah', SPECIAL_SHABBAT));

  // Birkat Hachamah appears only once every 28 years
  const birkatHaChama = getBirkatHaChama(year);
  if (birkatHaChama) {
    const hd = new HDate(birkatHaChama);
    add(new HolidayEvent(hd, 'Birkat Hachamah', MINOR_HOLIDAY, {emoji: '☀️'}));
  }

  yearCache.set(year, h);
  return h;
}

/**
 * Birkat Hachamah appears only once every 28 years.
 * Although almost always in Nisan, it can occur in Adar II.
 *   - 27 Adar II 5461 (Gregorian year 1701)
 *   - 29 Adar II 5993 (Gregorian year 2233)
 *
 * Due to drift, this will eventually slip into Iyyar
 *   - 2 Iyyar 7141 (Gregorian year 3381)
 * @private
 * @param {number} year
 * @return {number}
 */
function getBirkatHaChama(year) {
  const leap = HDate.isLeapYear(year);
  const startMonth = leap ? months.ADAR_II : NISAN;
  const startDay = leap ? 20 : 1;
  const baseRd = HDate.hebrew2abs(year, startMonth, startDay);
  for (let day = 0; day <= 40; day++) {
    const abs = baseRd + day;
    const elapsed = abs + 1373429;
    if (elapsed % 10227 == 172) {
      return abs;
    }
  }
  return 0;
}
