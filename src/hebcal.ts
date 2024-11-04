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

import {getBirthdayHD, getYahrzeitHD, HDate, months} from '@hebcal/hdate';
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
   * The date range returned by this function can be controlled by:
   * * `options.year` - Gregorian (e.g. 1993) or Hebrew year (e.g. 5749)
   * * `options.isHebrewYear` - to interpret `year` as Hebrew year
   * * `options.numYears` - generate calendar for multiple years (default 1)
   * * `options.month` - Gregorian or Hebrew month (to filter results to a single month)
   *
   * Alternatively, specify start and end days with `Date` or {@link HDate} instances:
   * * `options.start` - use specific start date (requires `end` date)
   * * `options.end` - use specific end date (requires `start` date)
   *
   * Unless `options.noHolidays == true`, default holidays include:
   * * Major holidays - Rosh Hashana, Yom Kippur, Pesach, Sukkot, etc.
   * * Minor holidays - Purim, Chanukah, Tu BiShvat, Lag BaOmer, etc.
   * * Minor fasts - Ta'anit Esther, Tzom Gedaliah, etc. (unless `options.noMinorFast`)
   * * Special Shabbatot - Shabbat Shekalim, Zachor, etc. (unless `options.noSpecialShabbat`)
   * * Modern Holidays - Yom HaShoah, Yom HaAtzma'ut, etc. (unless `options.noModern`)
   * * Rosh Chodesh (unless `options.noRoshChodesh`)
   *
   * Holiday and Torah reading schedules differ between Israel and the Disapora.
   * Set `options.il=true` to use the Israeli schedule.
   *
   * Additional non-default event types can be specified:
   * * Parashat HaShavua - weekly Torah Reading on Saturdays (`options.sedrot`)
   * * Counting of the Omer (`options.omer`)
   * * Shabbat Mevarchim HaChodesh on Saturday before Rosh Chodesh (`options.shabbatMevarchim`)
   * * Molad announcement on Saturday before Rosh Chodesh (`options.molad`)
   * * Yom Kippur Katan (`options.yomKippurKatan`)
   *
   * Daily Study of texts are supported by the
   * {@link https://github.com/hebcal/hebcal-learning @hebcal/learning} package,
   * for example:
   * * Babylonian Talmud Daf Yomi (`options.dailyLearning.dafYomi`)
   * * Jerusalem Talmud (Yerushalmi) Yomi (`options.dailyLearning.yerushalmi`)
   * * Mishna Yomi (`options.dailyLearning.mishnaYomi`)
   * * Nach Yomi (`options.dailyLearning.nachYomi`)
   *
   * Candle-lighting and Havdalah times are approximated using latitude and longitude
   * specified by the {@link Location} class. The `Location` class contains a small
   * database of cities with their associated geographic information and time-zone information.
   * If you ever have any doubts about Hebcal's times, consult your local halachic authority.
   * If you enter geographic coordinates above the arctic circle or antarctic circle,
   * the times are guaranteed to be wrong.
   *
   * To add candle-lighting options, set `options.candlelighting=true` and set
   * `options.location` to an instance of `Location`. By default, candle lighting
   * time is 18 minutes before sundown (40 minutes for Jerusalem,
   * 30 minutes for Haifa and Zikhron Ya'akov) and Havdalah is
   * calculated according to Tzeit Hakochavim - Nightfall (the point when 3 small stars
   * are observable in the night time sky with the naked eye). The default Havdalah
   * option (Tzeit Hakochavim) is calculated when the sun is 8.5° below the horizon.
   * These defaults can be changed using these options:
   * * `options.candleLightingMins` - minutes before sundown to light candles
   * * `options.havdalahMins` - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
   *    Havdalah times are suppressed when `options.havdalahMins=0`.
   * * `options.havdalahDeg` - degrees for solar depression for Havdalah.
   *    Default is 8.5 degrees for 3 small stars. Use 7.083 degrees for 3 medium-sized stars.
   *    Havdalah times are suppressed when `options.havdalahDeg=0`.
   *
   * If both `options.candlelighting=true` and `options.location` is specified,
   * Chanukah candle-lighting times and minor fast start/end times will also be generated.
   * Chanukah candle-lighting is at Bein HaShmashos (13.5 minutes before
   * the sun is 7.083° below the horizon in the evening)
   * on weekdays, at regular candle-lighting time on Fridays, and at regular Havdalah time on
   * Saturday night (see above).
   *
   * Minor fasts begin at Alot HaShachar (sun is 16.1° below the horizon in the morning) and
   * end when 3 medium-sized stars are observable in the night sky (sun is 7.083° below the horizon
   * in the evening).
   *
   * Two options also exist for generating an Event with the Hebrew date:
   * * `options.addHebrewDates` - print the Hebrew date for the entire date range
   * * `options.addHebrewDatesForEvents` - print the Hebrew date for dates with some events
   *
   * Lastly, translation and transliteration of event titles is controlled by
   * `options.locale` and the {@link Locale} API.
   * `@hebcal/core` supports three locales by default:
   * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
   * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
   * * `he` - Hebrew (e.g. "שַׁבָּת")
   *
   * Additional locales (such as `ru` or `fr`) are supported by the
   * {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
   *
   * @example
   * import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';
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
   * `hyear` must be after original `gdate` of anniversary.
   * Returns `undefined` when requested year preceeds or is same as original year.
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
    const dt = getBirthdayHD(hyear, gdate);
    if (typeof dt === 'undefined') {
      return dt;
    }
    return new HDate(dt);
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
    const dt = getYahrzeitHD(hyear, gdate);
    if (typeof dt === 'undefined') {
      return dt;
    }
    return new HDate(dt);
  }

  /**
   * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
   * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
   * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.
   * @param year Hebrew year
   */
  static getHolidaysForYear(year: number): HolidayYearMap {
    return getHolidaysForYear_(year);
  }

  /**
   * Returns an array of holidays for the year
   * @param year Hebrew year
   * @param il use the Israeli schedule for holidays
   */
  static getHolidaysForYearArray(year: number, il: boolean): HolidayEvent[] {
    return getHolidaysForYearArray(year, il);
  }

  /**
   * Returns an array of Events on this date (or `undefined` if no events)
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
   * Eruv Tavshilin
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
   * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
   * keep as "20:13" for any other locale/country. Uses {@link CalOptions} to determine
   * locale.
   * If `options.hour12` is `false`, locale is ignored and always returns 24-hour time.
   * If `options.hour12` is `true`, locale is ignored and always returns 12-hour time.
   * @param timeStr - original time like "20:30"
   * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
   * @param options
   */
  static reformatTimeStr(
    timeStr: string,
    suffix: string,
    options: CalOptions
  ): string {
    return reformatTimeStr(timeStr, suffix, options);
  }

  static version(): string {
    return pkgVersion;
  }

  /**
   * Convenience function to create an instance of `Sedra` or reuse a previously
   * created and cached instance.
   */
  static getSedra(hyear: number, il: boolean): Sedra {
    return getSedra(hyear, il);
  }

  /**
   * Return a number containing information on what Hallel is said on that day.
   *
   * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
   * Yom Ha'atzmaut, and Yom Yerushalayim.
   *
   * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
   *
   * The number is one of the following values:
   *
   * 0 - No Hallel
   * 1 - Half Hallel
   * 2 - Whole Hallel
   */
  static hallel(hdate: HDate, il: boolean): number {
    const events = getHolidaysForYearArray(hdate.getFullYear(), il);
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
