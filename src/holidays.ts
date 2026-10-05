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
import {HDate, months} from '@hebcal/hdate';
import QuickLRU from 'quick-lru';
import {flags} from './event.js';
import {modernHolidaysForYear} from './modern.js';
import {getSedra} from './sedra.js';
import {staticHolidays, holidayDesc as hdesc} from './staticHolidays.js';
import {YomKippurKatanEvent} from './YomKippurKatanEvent.js';
import {
  HolidayEvent,
  ChanukahEvent,
  AsaraBTevetEvent,
  RoshHashanaEvent,
  RoshChodeshEvent,
} from './HolidayEvent.js';

/**
 * Returns an array of holiday Events that occur on the given date, or
 * `undefined` if no holidays occur that day.
 *
 * When `il` is omitted, both Diaspora-only and Israel-only events are
 * returned (e.g. on the second day of a Yom Tov, both `"Pesach II"` for
 * Diaspora and any Israel-only events). Pass `true` or `false` to filter
 * to a single schedule.
 * @example
 * import {getHolidaysOnDate, HDate, months} from '@hebcal/core';
 * const events = getHolidaysOnDate(new HDate(15, months.NISAN, 5784), false);
 * events?.map(ev => ev.getDesc()); // ['Pesach I']
 * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
 * @param [il] use the Israeli schedule for holidays
 */
export function getHolidaysOnDate(
  date: HDate | Date | number,
  il?: boolean
): HolidayEvent[] | undefined {
  const hd = HDate.isHDate(date) ? date : new HDate(date);
  const hdStr = hd.toString();
  const yearMap = getHolidaysForYear_(hd.getFullYear());
  const events = yearMap.get(hdStr);
  // if il isn't a boolean return both diaspora + IL for day
  if (il === undefined || events === undefined) {
    return events;
  }
  return events.filter(ev => ev.observedIn(il));
}

const {
  CHAG,
  LIGHT_CANDLES_TZEIS,
  CHANUKAH_CANDLES,
  BEHAB,
  MINOR_FAST,
  SPECIAL_SHABBAT,
  MAJOR_FAST,
  MINOR_HOLIDAY,
  EREV,
} = flags;

const SUN = 0;
const TUE = 2;
const THU = 4;
const FRI = 5;
const SAT = 6;

const {NISAN, IYYAR, TAMUZ, AV, TISHREI, CHESHVAN, KISLEV, TEVET, ADAR_I, ADAR_II} =
  months;

/**
 * Holidays for an entire Hebrew year, indexed by `HDate.toString()`
 * (e.g. `'15 Nisan 5784'`). Returned by
 * {@link HebrewCalendar.getHolidaysForYear}. Because a single date can carry
 * more than one event, each key maps to an array. Entries are *not* filtered
 * by Israel vs. Diaspora — inspect `flags.IL_ONLY` / `flags.CHUL_ONLY`.
 */
export type HolidayYearMap = Map<string, HolidayEvent[]>;
const yearCache = new QuickLRU<number, HolidayYearMap>({maxSize: 120});

function addToMap(map: HolidayYearMap, ...events: HolidayEvent[]): void {
  for (const ev of events) {
    const key = ev.date.toString();
    const arr = map.get(key);
    if (arr !== undefined) {
      if (arr[0].hasFlag('EREV')) {
        arr.unshift(ev);
      } else {
        arr.push(ev);
      }
    } else {
      map.set(key, [ev]);
    }
  }
}

function addStaticHolidays(map: HolidayYearMap, year: number): void {
  for (const h of staticHolidays) {
    const hd = new HDate(h.dd, h.mm, year);
    const attrs: {emoji?: string; cholHaMoedDay?: number} = {};
    if (h.emoji) attrs.emoji = h.emoji;
    if (h.chmDay) attrs.cholHaMoedDay = h.chmDay;
    addToMap(map, new HolidayEvent(hd, h.desc, h.flags, attrs));
  }
}

function addTishreiHolidays(map: HolidayYearMap, year: number, RH: HDate): void {
  // standard holidays that don't shift based on year
  addToMap(map, new RoshHashanaEvent(RH, year, CHAG | LIGHT_CANDLES_TZEIS));
  const tzomGedaliahDay: number = RH.getDay() === THU ? 4 : 3;
  addToMap(
    map,
    new HolidayEvent(
      new HDate(tzomGedaliahDay, TISHREI, year),
      hdesc.TZOM_GEDALIAH,
      MINOR_FAST
    ),
    // first SAT after RH
    new HolidayEvent(
      new HDate(HDate.dayOnOrBefore(SAT, 7 + RH.abs())),
      hdesc.SHABBAT_SHUVA,
      SPECIAL_SHABBAT
    )
  );
}

function addChanukahAndTevet(map: HolidayYearMap, year: number): void {
  const rchTevet = HDate.shortKislev(year)
    ? new HDate(1, TEVET, year)
    : new HDate(30, KISLEV, year);
  addToMap(
    map,
    new HolidayEvent(rchTevet, hdesc.CHAG_HABANOT, MINOR_HOLIDAY),
    new ChanukahEvent(
      new HDate(24, KISLEV, year),
      hdesc.CHANUKAH_1_CANDLE,
      EREV | MINOR_HOLIDAY | CHANUKAH_CANDLES,
      undefined
    )
  );
  // yes, we know Kislev 30-32 are wrong
  // HDate() corrects the month automatically
  for (let candles = 2; candles <= 8; candles++) {
    const hd = new HDate(23 + candles, KISLEV, year);
    addToMap(
      map,
      new ChanukahEvent(
        hd,
        `Chanukah: ${candles} Candles`,
        MINOR_HOLIDAY | CHANUKAH_CANDLES,
        candles - 1
      )
    );
  }
  addToMap(
    map,
    new ChanukahEvent(
      new HDate(32, KISLEV, year),
      hdesc.CHANUKAH_8TH_DAY,
      MINOR_HOLIDAY,
      8
    ),
    new AsaraBTevetEvent(new HDate(10, TEVET, year), hdesc.ASARA_BTEVET, MINOR_FAST)
  );
}

function addPesachSeasonHolidays(
  map: HolidayYearMap,
  year: number,
  pesach: HDate
): void {
  const pesachAbs = pesach.abs();
  const haChodeshAbs = HDate.dayOnOrBefore(SAT, pesachAbs - 14);
  addToMap(
    map,
    new HolidayEvent(
      new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 43)),
      hdesc.SHABBAT_SHEKALIM,
      SPECIAL_SHABBAT
    ),
    new HolidayEvent(
      new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 30)),
      hdesc.SHABBAT_ZACHOR,
      SPECIAL_SHABBAT
    ),
    new HolidayEvent(
      new HDate(pesachAbs - (pesach.getDay() === TUE ? 33 : 31)),
      hdesc.TAANIT_ESTHER,
      MINOR_FAST
    ),
    new HolidayEvent(
      new HDate(haChodeshAbs - 7),
      hdesc.SHABBAT_PARAH,
      SPECIAL_SHABBAT
    ),
    new HolidayEvent(
      new HDate(haChodeshAbs),
      hdesc.SHABBAT_HACHODESH,
      SPECIAL_SHABBAT
    ),
    new HolidayEvent(
      new HDate(HDate.dayOnOrBefore(SAT, pesachAbs - 1)),
      hdesc.SHABBAT_HAGADOL,
      SPECIAL_SHABBAT
    ),
    new HolidayEvent(
      // if the fast falls on Shabbat, move to Thursday
      pesach.prev().getDay() === SAT
        ? pesach.onOrBefore(THU)
        : new HDate(14, NISAN, year),
      hdesc.TAANIT_BECHOROT,
      MINOR_FAST
    )
  );
}

function addLeilSelichot(map: HolidayYearMap, year: number): void {
  addToMap(
    map,
    new HolidayEvent(
      new HDate(
        HDate.dayOnOrBefore(SAT, new HDate(1, TISHREI, year + 1).abs() - 4)
      ),
      hdesc.LEIL_SELICHOT,
      MINOR_HOLIDAY,
      {emoji: '🕍'}
    )
  );
}

function addPurimVariants(map: HolidayYearMap, year: number, pesach: HDate): void {
  if (pesach.getDay() === SUN) {
    addToMap(
      map,
      new HolidayEvent(
        new HDate(16, ADAR_II, year),
        hdesc.PURIM_MESHULASH,
        MINOR_HOLIDAY
      )
    );
  }
  if (HDate.isLeapYear(year)) {
    addToMap(
      map,
      new HolidayEvent(
        new HDate(14, ADAR_I, year),
        hdesc.PURIM_KATAN,
        MINOR_HOLIDAY,
        {emoji: '🎭️'}
      ),
      new HolidayEvent(
        new HDate(15, ADAR_I, year),
        hdesc.SHUSHAN_PURIM_KATAN,
        MINOR_HOLIDAY,
        {emoji: '🎭️'}
      )
    );
  }
}

function addSummerFasts(map: HolidayYearMap, year: number): void {
  let tamuz17 = new HDate(17, TAMUZ, year);
  let tamuz17attrs: {observed: boolean} | undefined;
  if (tamuz17.getDay() === SAT) {
    tamuz17 = new HDate(18, TAMUZ, year);
    tamuz17attrs = {observed: true};
  }
  addToMap(
    map,
    new HolidayEvent(tamuz17, hdesc.TZOM_TAMMUZ, MINOR_FAST, tamuz17attrs)
  );

  let av9dt = new HDate(9, AV, year);
  let av9title = hdesc.TISHA_BAV;
  let av9attrs: {observed: boolean} | undefined;
  if (av9dt.getDay() === SAT) {
    av9dt = av9dt.next();
    av9attrs = {observed: true};
    av9title += ' (observed)';
  }
  const av9abs = av9dt.abs();
  addToMap(
    map,
    new HolidayEvent(
      new HDate(HDate.dayOnOrBefore(SAT, av9abs)),
      hdesc.SHABBAT_CHAZON,
      SPECIAL_SHABBAT
    ),
    new HolidayEvent(
      av9dt.prev(),
      hdesc.EREV_TISHA_BAV,
      EREV | MAJOR_FAST,
      av9attrs
    ),
    new HolidayEvent(av9dt, av9title, MAJOR_FAST, av9attrs),
    new HolidayEvent(
      new HDate(HDate.dayOnOrBefore(SAT, av9abs + 7)),
      hdesc.SHABBAT_NACHAMU,
      SPECIAL_SHABBAT
    )
  );
}

function daysInPreviousMonth(month: number, year: number): number {
  return month === NISAN
    ? HDate.daysInMonth(HDate.monthsInYear(year - 1), year - 1)
    : HDate.daysInMonth(month - 1, year);
}

function addRoshChodesh(map: HolidayYearMap, year: number): void {
  const monthsInYear = HDate.monthsInYear(year);
  for (let month = 1; month <= monthsInYear; month++) {
    const monthName = HDate.getMonthName(month, year);
    if (daysInPreviousMonth(month, year) === 30) {
      addToMap(map, new RoshChodeshEvent(new HDate(1, month, year), monthName));
      addToMap(
        map,
        new RoshChodeshEvent(new HDate(30, month - 1, year), monthName)
      );
    } else if (month !== TISHREI) {
      addToMap(map, new RoshChodeshEvent(new HDate(1, month, year), monthName));
    }
  }
}

function addYomKippurKatan(map: HolidayYearMap, year: number): void {
  const monthsInYear = HDate.monthsInYear(year);
  // start at Iyyar because one may not fast during Nisan
  for (let month = IYYAR; month <= monthsInYear; month++) {
    const nextMonth = month + 1;
    // Yom Kippur Katan is not observed on the day before Rosh Hashanah.
    // Not observed prior to Rosh Chodesh Cheshvan because Yom Kippur has just passed.
    // Not observed before Rosh Chodesh Tevet, because that day is Hanukkah.
    if (nextMonth === TISHREI || nextMonth === CHESHVAN || nextMonth === TEVET) {
      continue;
    }
    let ykk = new HDate(29, month, year);
    const dow = ykk.getDay();
    if (dow === FRI || dow === SAT) {
      ykk = ykk.onOrBefore(THU);
    }
    const nextMonthName = HDate.getMonthName(nextMonth, year);
    addToMap(map, new YomKippurKatanEvent(ykk, nextMonthName));
  }
}

function addBehab(map: HolidayYearMap, year: number): void {
  for (const month of [CHESHVAN, IYYAR]) {
    const roshChodesh = new HDate(1, month, year);
    let shabbos = new HDate(HDate.dayOnOrBefore(SAT, roshChodesh.abs() + 6));
    if (shabbos.abs() === roshChodesh.abs()) {
      shabbos = new HDate(shabbos.abs() + 7);
    }
    const fastDays = [2, 5, 9].map(offset => new HDate(shabbos.abs() + offset));
    if (month === IYYAR && fastDays[2].getDate() === 14) {
      fastDays[2] = new HDate(17, IYYAR, year);
    }
    for (const hd of fastDays) {
      addToMap(map, new HolidayEvent(hd, hdesc.TAANIT_BEHAB, MINOR_FAST | BEHAB));
    }
  }
}

/**
 * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
 * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
 * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
 * @internal
 */
export function getHolidaysForYear_(year: number): HolidayYearMap {
  if (typeof year !== 'number') {
    throw new TypeError(`bad Hebrew year: ${year}`);
  }
  if (year < 1 || year > 32658) {
    throw new RangeError(`Hebrew year ${year} out of range 1-32658`);
  }
  const cached = yearCache.get(year);
  if (cached) {
    return cached;
  }

  const RH = new HDate(1, TISHREI, year);
  const pesach = new HDate(15, NISAN, year);
  const map: HolidayYearMap = new Map();

  addStaticHolidays(map, year);
  addTishreiHolidays(map, year, RH);
  addChanukahAndTevet(map, year);
  addPesachSeasonHolidays(map, year, pesach);
  addLeilSelichot(map, year);
  addPurimVariants(map, year, pesach);
  addToMap(map, ...modernHolidaysForYear(year));
  addSummerFasts(map, year);
  addRoshChodesh(map, year);
  addYomKippurKatan(map, year);
  addBehab(map, year);

  const sedra = getSedra(year, false);
  const beshalachHd = sedra.find(15);
  if (beshalachHd === null) {
    throw new Error(`Parashat Beshalach not found in year ${year}`);
  }
  addToMap(
    map,
    new HolidayEvent(beshalachHd, hdesc.SHABBAT_SHIRAH, SPECIAL_SHABBAT)
  );

  // Birkat Hachamah appears only once every 28 years
  const birkatHaChama = getBirkatHaChama(year);
  if (birkatHaChama !== undefined) {
    const hd = new HDate(birkatHaChama);
    addToMap(
      map,
      new HolidayEvent(hd, hdesc.BIRKAT_HACHAMAH, MINOR_HOLIDAY, {emoji: '☀️'})
    );
  }

  yearCache.set(year, map);
  return map;
}

/** 28 years of 365.25 days */
const BIRKAT_HACHAMAH_CYCLE_DAYS = 10227;
const BIRKAT_HACHAMAH_EPOCH_OFFSET = 1373429;
const BIRKAT_HACHAMAH_REMAINDER = 172;

/**
 * Birkat Hachamah appears only once every 28 years.
 * Although almost always in Nisan, it can occur in Adar II.
 *   - 27 Adar II 5461 (Gregorian year 1701)
 *   - 29 Adar II 5993 (Gregorian year 2233)
 *
 * Due to drift, this will eventually slip into Iyyar
 *   - 2 Iyyar 7141 (Gregorian year 3381)
 */
function getBirkatHaChama(year: number): number | undefined {
  const leap = HDate.isLeapYear(year);
  const startMonth = leap ? ADAR_II : NISAN;
  const startDay = leap ? 20 : 1;
  const baseRd = HDate.hebrew2abs(year, startMonth, startDay);
  for (let day = 0; day <= 40; day++) {
    const abs = baseRd + day;
    const elapsed = abs + BIRKAT_HACHAMAH_EPOCH_OFFSET;
    if (elapsed % BIRKAT_HACHAMAH_CYCLE_DAYS === BIRKAT_HACHAMAH_REMAINDER) {
      return abs;
    }
  }
  return undefined;
}

/**
 * Returns a sorted array of holidays observed during the given Hebrew year,
 * filtered by Israel vs. Diaspora schedule.
 *
 * Includes Rosh Chodesh, fasts, special Shabbatot, modern holidays, etc.,
 * but does not generate candle-lighting times, Torah readings, or Omer days.
 * Use {@link calendar} for those.
 * @example
 * import {getHolidaysForYearArray} from '@hebcal/core';
 * const events = getHolidaysForYearArray(5784, false);
 * console.log(events[0].getDesc()); // 'Rosh Hashana 5784'
 * @param year Hebrew year
 * @param il use the Israeli schedule for holidays
 */
export function getHolidaysForYearArray(year: number, il: boolean): HolidayEvent[] {
  const yearMap = getHolidaysForYear_(year);
  const startAbs = HDate.hebrew2abs(year, TISHREI, 1);
  const endAbs = HDate.hebrew2abs(year + 1, TISHREI, 1) - 1;
  const events: HolidayEvent[] = [];
  for (let absDt = startAbs; absDt <= endAbs; absDt++) {
    const hd = new HDate(absDt);
    const holidays = yearMap.get(hd.toString());
    if (holidays) {
      events.push(...holidays.filter(ev => ev.observedIn(il)));
    }
  }
  return events;
}
