export {HDate, HebrewDateEvent} from './hdate';
export {Event, flags} from './event';
export {Location} from './location';
export {Zmanim} from './zmanim';
export {CandleLightingEvent, HavdalahEvent} from './candles';
export {MoladEvent} from './molad';
export {common} from './common';
export {OmerEvent} from './omer';
export {dafyomi, DafYomiEvent} from './dafyomi';
export {Sedra, parshiot, ParshaEvent} from './sedra';
export {greg} from './greg';
export {holidays, HolidayEvent, RoshChodeshEvent, MevarchimChodeshEvent} from './holidays';
export {locale} from './locale';
import {locale as l} from './locale';
import {greg as g} from './greg';
import {hebrew2abs, abs2hebrew} from './hdate';
import {getBirthdayOrAnniversary, getYahrzeit} from './anniversary';
import {getMolad} from './molad';
import {registerLocation} from './location';
import {makeAnchor, reformatTimeStr} from './url';
import {hebrewCalendar} from './hebcal';
import {registerLocale} from './locale';

/**
 * Main interface to Hebcal
 * @namespace
 */
export const hebcal = {
  /**
   * Generates a list of holidays and other hebrew date events based on `options`.
   * This is the main interface to the `@hebcal/core` library, and can be used to
   * retrieve holidays, rosh chodesh, candle lighting & havdalah times,
   * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
   * Event names can be rendered in several languges using the `locale` option.
   * @function
   * @param {HebcalOptions} [options={}]
   * @return {Event[]}
   */
  hebrewCalendar,
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
   * @function
   * @example
   * import {hebcal} from '@hebcal/core';
   * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
   * const hd = hebcal.getBirthdayOrAnniversary(5780, dt); // '1 Nisan 5780'
   * console.log(hd.greg().toLocaleDateString('en-US')); // '3/26/2020'
   * @param {number} hyear Hebrew year
   * @param {Date|HDate} gdate Gregorian or Hebrew date of event
   * @return {HDate} anniversary occurring in `hyear`
   */
  getBirthdayOrAnniversary,
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
   * @function
   * @example
   * import {hebcal} from '@hebcal/core';
   * const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
   * const hd = hebcal.getYahrzeit(5780, dt); // '30 Sh\'vat 5780'
   * console.log(hd.greg().toLocaleDateString('en-US')); // '2/25/2020'
   * @param {number} hyear Hebrew year
   * @param {Date|HDate} gdate Gregorian or Hebrew date of death
   * @return {HDate} anniversary occurring in hyear
   */
  getYahrzeit,
  // provide these greg.js functions for backwards compatibility only
  // don't add jsdoc because we don't want to publicize them
  greg2abs: g.greg2abs.bind(g),
  abs2greg: g.abs2greg.bind(g),
  // hdate.js
  /**
   * Converts Hebrew date to absolute Julian days.
   * The absolute date is the number of days elapsed since the (imaginary)
   * Gregorian date Sunday, December 31, 1 BC.
   * @function
   * @param {(HDate|SimpleHebrewDate)} d Hebrew Date
   * @return {number}
   */
  hebrew2abs,
  /**
   * Converts absolute Julian days to Hebrew date
   * @function
   * @param {number} d absolute Julian days
   * @return {SimpleHebrewDate}
   */
  abs2hebrew,
  /**
   * Calculates the molad for a Hebrew month
   * @function
   * @param {number} year
   * @param {number} month
   * @return {Molad}
   */
  getMolad,
  /**
   * Helper function to transform a string to make it more usable in a URL or filename.
   * Converts to lowercase and replaces non-word characters with hyphen ('-').
   * @example
   * hebcal.makeAnchor('Rosh Chodesh Adar II') // 'rosh-chodesh-adar-ii'
   * @function
   * @param {string} s
   * @return {string}
   */
  makeAnchor,
  /**
   * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
   * keep as "20:13" for any other locale/country. Uses `HebcalOptions` to determine
   * locale.
   * @function
   * @param {string} timeStr - original time like "20:30"
   * @param {string} suffix - "p" or "pm" or " P.M.". Add leading space if you want it
   * @param {HebcalOptions} options
   * @return {string}
   */
  reformatTimeStr,
  /**
   * Adds a location name for `Location.lookup()` only if the name isn't
   * already being used. Returns `false` if the name is already taken
   * and `true` if successfully added.
   * @function
   * @param {string} cityName
   * @param {Location} location
   * @return {boolean}
   */
  registerLocation,
  // provide these locale.js functions for backwards compatibility only
  // don't add jsdoc because we don't want to publicize them
  registerLocale,
  gettext: l.gettext.bind(l),
  addLocale: l.addLocale.bind(l),
  useLocale: l.useLocale.bind(l),
  hebrewStripNikkud: l.hebrewStripNikkud.bind(l),
};
