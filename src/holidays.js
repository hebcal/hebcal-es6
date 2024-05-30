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
import {HDate, Locale, months} from '@hebcal/hdate';
import QuickLRU from 'quick-lru';
import {flags} from './event';
import {dateYomHaShoah, dateYomHaZikaron} from './modern';
import {getSedra_} from './sedra.js';
import {staticHolidays, staticModernHolidays,
  holidayDesc as hdesc} from './staticHolidays.js';
import {YomKippurKatanEvent} from './YomKippurKatanEvent';
import {HolidayEvent, AsaraBTevetEvent} from './HolidayEvent';

const CHAG = flags.CHAG;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MINOR_FAST = flags.MINOR_FAST;
const SPECIAL_SHABBAT = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY = flags.MODERN_HOLIDAY;
const MAJOR_FAST = flags.MAJOR_FAST;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;

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
    const monthName0 = Locale.gettext(monthName, locale);
    const monthName1 = monthName0.replace(/'/g, '’');
    return Locale.gettext(roshChodeshStr, locale) + ' ' + monthName1;
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

const SUN = 0;
const TUE = 2;
const THU = 4;
const FRI = 5;
const SAT = 6;

export const NISAN = months.NISAN;
const TAMUZ = months.TAMUZ;
const AV = months.AV;
const TISHREI = months.TISHREI;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const ADAR_I = months.ADAR_I;
const ADAR_II = months.ADAR_II;

const emojiIsraelFlag = {emoji: '🇮🇱'};
const chanukahEmoji = '🕎';
const yearCache = new QuickLRU({maxSize: 400});

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

  const map = new Map();
  // eslint-disable-next-line require-jsdoc
  function add(...events) {
    for (const ev of events) {
      const key = ev.date.toString();
      const arr = map.get(key);
      if (typeof arr === 'object') {
        if (arr[0].getFlags() & EREV) {
          arr.unshift(ev);
        } else {
          arr.push(ev);
        }
      } else {
        map.set(key, [ev]);
      }
    }
  }

  for (const h of staticHolidays) {
    const hd = new HDate(h.dd, h.mm, year);
    const ev = new HolidayEvent(hd, h.desc, h.flags);
    if (h.emoji) ev.emoji = h.emoji;
    if (h.chmDay) ev.cholHaMoedDay = h.chmDay;
    add(ev);
  }

  // standard holidays that don't shift based on year
  add(new RoshHashanaEvent(RH, year, CHAG | LIGHT_CANDLES_TZEIS));

  // Variable date holidays
  add(new HolidayEvent(new HDate(3 + (RH.getDay() == THU), TISHREI, year),
      hdesc.TZOM_GEDALIAH, MINOR_FAST));
  // first SAT after RH
  add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, 7 + RH.abs())),
      hdesc.SHABBAT_SHUVA, SPECIAL_SHABBAT));
  const rchTevet = HDate.shortKislev(year) ?
    new HDate(1, TEVET, year) : new HDate(30, KISLEV, year);
  add(new HolidayEvent(rchTevet, hdesc.CHAG_HABANOT, MINOR_HOLIDAY));
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
      hdesc.CHANUKAH_8TH_DAY, MINOR_HOLIDAY, {chanukahDay: 8, emoji: chanukahEmoji}));
  add(
      new AsaraBTevetEvent(new HDate(10, TEVET, year), hdesc.ASARA_BTEVET, MINOR_FAST),
  );
  const pesachAbs = pesach.abs();
  add(
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 43)),
          hdesc.SHABBAT_SHEKALIM, SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 30)),
          hdesc.SHABBAT_ZACHOR, SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(pesachAbs - (pesach.getDay() == TUE ? 33 : 31)),
          hdesc.TAANIT_ESTHER, MINOR_FAST),
  );
  const haChodeshAbs = HDate.dayOnOrBefore(SAT, pesachAbs - 14);
  add(
      new HolidayEvent(new HDate(haChodeshAbs - 7), hdesc.SHABBAT_PARAH, SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(haChodeshAbs), hdesc.SHABBAT_HACHODESH, SPECIAL_SHABBAT),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 1)),
          hdesc.SHABBAT_HAGADOL, SPECIAL_SHABBAT),
      new HolidayEvent(
        // if the fast falls on Shabbat, move to Thursday
        pesach.prev().getDay() == SAT ?
          pesach.onOrBefore(THU) :
          new HDate(14, NISAN, year),
        hdesc.TAANIT_BECHOROT,
        MINOR_FAST,
      ),
  );
  add(new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)),
      hdesc.LEIL_SELICHOT, MINOR_HOLIDAY, {emoji: '🕍'}));

  if (pesach.getDay() == SUN) {
    add(new HolidayEvent(new HDate(16, ADAR_II, year),
        hdesc.PURIM_MESHULASH, MINOR_HOLIDAY));
  }

  if (HDate.isLeapYear(year)) {
    add(new HolidayEvent(new HDate(14, ADAR_I, year),
        hdesc.PURIM_KATAN, MINOR_HOLIDAY, {emoji: '🎭️'}));
    add(new HolidayEvent(new HDate(15, ADAR_I, year),
        hdesc.SHUSHAN_PURIM_KATAN, MINOR_HOLIDAY, {emoji: '🎭️'}));
  }

  const nisan27dt = dateYomHaShoah(year);
  if (nisan27dt) {
    add(new HolidayEvent(nisan27dt, hdesc.YOM_HASHOAH, MODERN_HOLIDAY));
  }

  const yomHaZikaronDt = dateYomHaZikaron(year);
  if (yomHaZikaronDt) {
    add(
        new HolidayEvent(yomHaZikaronDt, hdesc.YOM_HAZIKARON, MODERN_HOLIDAY, emojiIsraelFlag),
        new HolidayEvent(yomHaZikaronDt.next(), hdesc.YOM_HAATZMA_UT, MODERN_HOLIDAY, emojiIsraelFlag),
    );
  }

  for (const h of staticModernHolidays) {
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
      const mask = h.chul ? MODERN_HOLIDAY : (MODERN_HOLIDAY | IL_ONLY);
      const ev = new HolidayEvent(hd, h.desc, mask);
      if (!h.suppressEmoji) {
        ev.emoji = '🇮🇱';
      }
      add(ev);
    }
  }

  let tamuz17 = new HDate(17, TAMUZ, year);
  let tamuz17attrs;
  if (tamuz17.getDay() == SAT) {
    tamuz17 = new HDate(18, TAMUZ, year);
    tamuz17attrs = {observed: true};
  }
  add(new HolidayEvent(tamuz17, hdesc.TZOM_TAMMUZ, MINOR_FAST, tamuz17attrs));

  let av9dt = new HDate(9, AV, year);
  let av9title = hdesc.TISHA_BAV;
  let av9attrs;
  if (av9dt.getDay() == SAT) {
    av9dt = av9dt.next();
    av9attrs = {observed: true};
    av9title += ' (observed)';
  }
  const av9abs = av9dt.abs();
  add(
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, av9abs)),
          hdesc.SHABBAT_CHAZON, SPECIAL_SHABBAT),
      new HolidayEvent(av9dt.prev(), hdesc.EREV_TISHA_BAV, EREV | MAJOR_FAST, av9attrs),
      new HolidayEvent(av9dt, av9title, MAJOR_FAST, av9attrs),
      new HolidayEvent(new HDate(HDate.dayOnOrBefore(SAT, av9abs + 7)),
          hdesc.SHABBAT_NACHAMU, SPECIAL_SHABBAT),
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
  }

  // Begin: Yom Kippur Katan
  // start at Iyyar because one may not fast during Nisan
  for (let month = months.IYYAR; month <= monthsInYear; month++) {
    const nextMonth = month + 1;
    // Yom Kippur Katan is not observed on the day before Rosh Hashanah.
    // Not observed prior to Rosh Chodesh Cheshvan because Yom Kippur has just passed.
    // Not observed before Rosh Chodesh Tevet, because that day is Hanukkah.
    if (nextMonth === TISHREI || nextMonth === months.CHESHVAN || nextMonth === TEVET) {
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
  add(new HolidayEvent(beshalachHd, hdesc.SHABBAT_SHIRAH, SPECIAL_SHABBAT));

  // Birkat Hachamah appears only once every 28 years
  const birkatHaChama = getBirkatHaChama(year);
  if (birkatHaChama) {
    const hd = new HDate(birkatHaChama);
    add(new HolidayEvent(hd, hdesc.BIRKAT_HACHAMAH, MINOR_HOLIDAY, {emoji: '☀️'}));
  }

  yearCache.set(year, map);
  return map;
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
  const startMonth = leap ? ADAR_II : NISAN;
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
