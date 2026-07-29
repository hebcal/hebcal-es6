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

import {birthdayOrAnniversary, yahrzeit, HDate} from '@hebcal/hdate';
import './locale'; // Adds Hebrew and Ashkenazic translations
import {CalOptions} from './CalOptions';
import {version as pkgVersion} from './pkgVersion';
import {Event, flags} from './event';
import {Sedra, getSedra} from './sedra';
import {hallel_} from './hallel';
import {
  getHolidaysForYear_,
  getHolidaysForYearArray,
  getHolidaysOnDate,
  HolidayYearMap,
} from './holidays';
import {HolidayEvent} from './HolidayEvent';
import {reformatTimeStr} from './reformatTimeStr';
import {TachanunResult, tachanun} from './tachanun';
import {calendar} from './calendar';

/**
 * HebrewCalendar is the main interface to the `@hebcal/core` library.
 * This namespace is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
 * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
 * Event names can be rendered in several languges using the `locale` option.
 */
export class HebrewCalendar {
  private constructor() {}
  /**
   * Calculates holidays and other Hebrew calendar events based on {@link CalOptions}.
   *
   * Each holiday is represented by an {@link Event} object which includes a date,
   * a description, flags and optional attributes.
   * If given no options, returns holidays for the Diaspora for the current Gregorian year.
   *
   * This is a convenience wrapper around the standalone {@link calendar} function.
   * See {@link calendar} for the complete list of supported options, the
   * candle-lighting and Havdalah defaults, and notes on locales.
   *
   * @example
   * import {HebrewCalendar, Location} from '@hebcal/core';
   * const options: CalOptions = {
   *   year: 1981,
   *   isHebrewYear: false,
   *   candlelighting: true,
   *   location: Location.lookup('San Francisco'),
   *   sedrot: true,
   *   omer: true,
   * };
   * const events = HebrewCalendar.calendar(options);
   * for (const ev of events) {
   *   const hd = ev.getDate();
   *   const date = hd.greg();
   *   console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
   * }
   */
  static calendar(options: CalOptions = {}): Event[] {
    return calendar(options);
  }

  /**
   * Calculates a birthday or anniversary (non-yahrzeit).
   * Returns `undefined` when `hyear` precedes the original year of `gdate`.
   *
   * When `hyear` is the original year, the original date is returned unchanged —
   * a "0th birthday" is a meaningful thing to ask for. This differs from
   * {@link getYahrzeit}, which returns `undefined` for the original year,
   * because a yahrzeit only has meaning from the first anniversary onward.
   *
   * Hebcal uses the algorithm defined in "Calendrical Calculations"
   * by Edward M. Reingold and Nachum Dershowitz.
   *
   * The birthday of someone born in Adar of an ordinary year or Adar II of
   * a leap year is also always in the last month of the year, be that Adar
   * or Adar II. The birthday in an ordinary year of someone born during the
   * first 29 days of Adar I in a leap year is on the corresponding day of Adar;
   * in a leap year, the birthday occurs in Adar I, as expected.
   *
   * Someone born on the thirtieth day of Marcheshvan, Kislev, or Adar I
   * has his birthday postponed until the first of the following month in
   * years where that day does not occur. [Calendrical Calculations p. 111]
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
   * const hd = HebrewCalendar.getBirthdayOrAnniversary(5780, dt); // '1 Nisan 5780'
   * console.log(hd.greg().toLocaleDateString('en-US')); // '3/26/2020'
   * @param hyear Hebrew year
   * @param gdate Gregorian or Hebrew date of event
   * @returns anniversary occurring in `hyear`
   */
  static getBirthdayOrAnniversary(
    hyear: number,
    gdate: Date | HDate
  ): HDate | undefined {
    return birthdayOrAnniversary(hyear, gdate);
  }

  /**
   * Calculates yahrzeit.
   * `hyear` must be after original `gdate` of death.
   * Returns `undefined` when requested year preceeds or is same as original year.
   *
   * Hebcal uses the algorithm defined in "Calendrical Calculations"
   * by Edward M. Reingold and Nachum Dershowitz.
   *
   * The customary anniversary date of a death is more complicated and depends
   * also on the character of the year in which the first anniversary occurs.
   * There are several cases:
   *
   * * If the date of death is Marcheshvan 30, the anniversary in general depends
   *   on the first anniversary; if that first anniversary was not Marcheshvan 30,
   *   use the day before Kislev 1.
   * * If the date of death is Kislev 30, the anniversary in general again depends
   *   on the first anniversary — if that was not Kislev 30, use the day before
   *   Tevet 1.
   * * If the date of death is Adar II, the anniversary is the same day in the
   *   last month of the Hebrew year (Adar or Adar II).
   * * If the date of death is Adar I 30, the anniversary in a Hebrew year that
   *   is not a leap year (in which Adar only has 29 days) is the last day in
   *   Shevat.
   * * In all other cases, use the normal (that is, same month number) anniversary
   *   of the date of death. [Calendrical Calculations p. 113]
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
   * const hd = HebrewCalendar.getYahrzeit(5780, dt); // '30 Sh\'vat 5780'
   * console.log(hd.greg().toLocaleDateString('en-US')); // '2/25/2020'
   * @param hyear Hebrew year
   * @param gdate Gregorian or Hebrew date of death
   * @returns anniversary occurring in hyear
   */
  static getYahrzeit(hyear: number, gdate: Date | HDate): HDate | undefined {
    return yahrzeit(hyear, gdate);
  }

  /**
   * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
   * `HDate.toString()`. These events must be filtered for `flags.IL_ONLY`
   * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
   *
   * Includes Rosh Chodesh, fasts, Yom Kippur Katan, Special Shabbatot, etc.,
   * but does not generate candle-lighting times, Torah readings, or Omer days.
   * The result is cached in an internal LRU.
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * const map = HebrewCalendar.getHolidaysForYear(5784);
   * for (const [hdStr, events] of map.entries()) {
   *   for (const ev of events) {
   *     console.log(hdStr, ev.getDesc());
   *   }
   * }
   * @param year Hebrew year
   */
  static getHolidaysForYear(year: number): HolidayYearMap {
    return getHolidaysForYear_(year);
  }

  /**
   * Returns a sorted array of holidays observed during the given Hebrew year.
   *
   * Events are pre-filtered by Israel vs. Diaspora schedule, so callers do not
   * need to inspect `flags.IL_ONLY` / `flags.CHUL_ONLY` themselves.
   * Includes Rosh Chodesh, fasts, modern holidays, special Shabbatot, etc.,
   * but does not generate candle-lighting times, Torah readings, or Omer days.
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * const events = HebrewCalendar.getHolidaysForYearArray(5784, false);
   * console.log(events[0].getDesc()); // 'Rosh Hashana 5784'
   * @param year Hebrew year
   * @param il use the Israeli schedule for holidays
   */
  static getHolidaysForYearArray(year: number, il: boolean): HolidayEvent[] {
    return getHolidaysForYearArray(year, il);
  }

  /**
   * Returns an array of holiday Events that occur on the given date,
   * or `undefined` if no holidays occur that day.
   *
   * When `il` is omitted, both Diaspora-only and Israel-only events are
   * returned; pass `true` or `false` to filter to a single schedule.
   * @example
   * import {HebrewCalendar, HDate, months} from '@hebcal/core';
   * const hd = new HDate(15, months.NISAN, 5784);
   * const events = HebrewCalendar.getHolidaysOnDate(hd, false);
   * console.log(events?.map(ev => ev.getDesc())); // ['Pesach I']
   * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
   * @param [il] use the Israeli schedule for holidays
   */
  static getHolidaysOnDate(
    date: HDate | Date | number,
    il?: boolean
  ): HolidayEvent[] | undefined {
    return getHolidaysOnDate(date, il);
  }

  /**
   * Returns `true` if Eruv Tavshilin should be prepared on the given date.
   *
   * Eruv Tavshilin is prepared when a Yom Tov falls on Friday (so cooking
   * for Shabbat that begins Friday night may continue from Yom Tov into
   * Shabbat). This requires the day before to be a weekday (Wednesday or
   * Thursday), the following Friday to be Yom Tov, and the day after Friday
   * (Shabbat) to also be a sacred day.
   * @example
   * import {HebrewCalendar} from '@hebcal/core';
   * // Wednesday October 16, 2024 is Erev Sukkot 5785. In the Diaspora,
   * // Sukkot I falls on Thursday and Sukkot II on Friday, so Eruv
   * // Tavshilin is prepared on Wednesday:
   * HebrewCalendar.eruvTavshilin(new Date(2024, 9, 16), false); // true
   * // In Israel there is only one day of Yom Tov, so Friday is a weekday:
   * HebrewCalendar.eruvTavshilin(new Date(2024, 9, 16), true); // false
   * @param date Gregorian or Hebrew date to test
   * @param il use the Israeli holiday schedule
   */
  static eruvTavshilin(date: Date | HDate, il: boolean): boolean {
    if (date.getDay() < 3 || date.getDay() > 4) {
      return false;
    }
    const today = new HDate(date);
    const friday = today.after(5);
    const tomorrow = today.next();
    if (!isChag(friday, il) || isChag(today, il) || !isChag(tomorrow, il)) {
      return false;
    }
    return true;
  }

  /**
   * Helper function to format a 24-hour (00:00-23:59) time string in either
   * 12-hour US format (e.g. `"8:13pm"`) or keep it in 24-hour format (e.g.
   * `"20:13"`) for any other locale or country.
   *
   * The locale (and therefore default behavior) is derived from
   * `options.location` / `options.locale`. The `options.hour12` override
   * takes precedence: if `false`, locale is ignored and the result is always
   * 24-hour; if `true`, locale is ignored and the result is always 12-hour.
   * @example
   * import {HebrewCalendar, Location} from '@hebcal/core';
   * const opts = {location: Location.lookup('Chicago')};
   * HebrewCalendar.reformatTimeStr('20:30', 'pm', opts);          // '8:30pm'
   * HebrewCalendar.reformatTimeStr('20:30', 'pm', {hour12: false}); // '20:30'
   * @param timeStr - original time like "20:30"
   * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
   * @param options optional; `location`, `locale` and `hour12` are consulted
   */
  static reformatTimeStr(
    timeStr: string,
    suffix: string,
    options?: CalOptions
  ): string {
    return reformatTimeStr(timeStr, suffix, options);
  }

  /**
   * Returns the semantic version string of the `@hebcal/core` package
   * (e.g. `"6.8.2"`). Useful for logging or feature detection.
   */
  static version(): string {
    return pkgVersion;
  }

  /**
   * Convenience function to create an instance of {@link Sedra} or reuse a
   * previously created and cached instance for the same year + schedule.
   *
   * Use this in preference to `new Sedra(...)` when calling repeatedly,
   * since an internal LRU cache (~120 entries) avoids recomputing the
   * keviyah-specific reading pattern.
   * @example
   * import {HebrewCalendar, HDate} from '@hebcal/core';
   * const sedra = HebrewCalendar.getSedra(5784, false);
   * const result = sedra.lookup(new HDate(15, 'Cheshvan', 5784));
   * console.log(result.parsha); // ['Vayera']
   * @param hyear Hebrew year
   * @param il Use Israel sedra schedule (`false` for Diaspora)
   */
  static getSedra(hyear: number, il: boolean): Sedra {
    return getSedra(hyear, il);
  }

  /**
   * Determines which form of Hallel (if any) is recited
   * on a given Hebrew date.
   *
   * Returns 0 (none), 1 (half Hallel), or 2 (whole Hallel).
   *
   * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
   * Yom Ha'atzmaut, and Yom Yerushalayim.
   *
   * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
   * @example
   * import {HebrewCalendar, HDate, months} from '@hebcal/core';
   * HebrewCalendar.hallel(new HDate(25, months.KISLEV, 5784), false); // 2 (Chanukah)
   * HebrewCalendar.hallel(new HDate(1, months.SHVAT, 5784), false);   // 1 (Rosh Chodesh)
   * HebrewCalendar.hallel(new HDate(2, months.SHVAT, 5784), false);   // 0
   * @param hdate Hebrew date to test
   * @param il use the Israeli holiday schedule
   * @returns 0 for no Hallel, 1 for half Hallel, 2 for whole Hallel
   */
  static hallel(hdate: HDate, il: boolean): number {
    const events = getHolidaysOnDate(hdate, il);
    if (!events) {
      return 0;
    }
    return hallel_(events, hdate);
  }

  /**
   * Return details on what Tachanun (or Tzidchatcha on Shabbat) is said on `hdate`.
   *
   * Tachanun is not said on Rosh Chodesh, the month of Nisan, Lag Baomer,
   * Rosh Chodesh Sivan until Isru Chag, Tisha B'av, 15 Av, Erev Rosh Hashanah,
   * Rosh Hashanah, Erev Yom Kippur until after Simchat Torah, Chanukah,
   * Tu B'shvat, Purim and Shushan Purim, and Purim and Shushan Purim Katan.
   *
   * In some congregations Tachanun is not said until from Rosh Chodesh Sivan
   * until 14th Sivan, Sukkot until after Rosh Chodesh Cheshvan, Pesach Sheini,
   * Yom Ha'atzmaut, and Yom Yerushalayim.
   *
   * Tachanun is not said at Mincha on days before it is not said at Shacharit.
   *
   * Tachanun is not said at Shacharit on Shabbat, but is at Mincha, usually.
   * @example
   * import {HebrewCalendar, HDate, months} from '@hebcal/core';
   * // Regular weekday — Tachanun is said at both services
   * HebrewCalendar.tachanun(new HDate(4, months.SHVAT, 5784), false);
   * // => { shacharit: true, mincha: true, allCongs: true }
   *
   * // Friday 2 Sh'vat — said at Shacharit, but not at Mincha (erev Shabbat)
   * HebrewCalendar.tachanun(new HDate(2, months.SHVAT, 5784), false);
   * // => { shacharit: true, mincha: false, allCongs: true }
   *
   * // Rosh Chodesh — no Tachanun
   * HebrewCalendar.tachanun(new HDate(1, months.SHVAT, 5784), false);
   * // => { shacharit: false, mincha: false, allCongs: false }
   * @param hdate Hebrew date to test
   * @param il use the Israeli holiday schedule
   */
  static tachanun(hdate: HDate, il: boolean): TachanunResult {
    return tachanun(hdate, il);
  }
}

/**
 * @private
 */
function isChag(date: HDate, il: boolean): boolean {
  const events = getHolidaysOnDate(date, il) || [];
  const chag = events.filter(ev => ev.getFlags() & flags.CHAG);
  return chag.length !== 0;
}
