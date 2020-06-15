export {HDate} from './hdate';
import {hebrew2abs, abs2hebrew} from './hdate';
export {Event, flags} from './event';
import {getBirthdayOrAnniversary, getYahrzeit} from './anniversary';
export {Location} from './location';
import {registerLocation} from './location';
import {
  months,
  days,
  hebLeapYear,
  monthsInHebYear,
  getMonthName,
  daysInHebMonth,
  monthNum,
  hebElapsedDays,
  daysInYear,
  longCheshvan,
  shortKislev,
  monthFromName,
  dayOnOrBefore,
  range,
} from './common';
/**
 * Common hebrew date routines
 * @namespace
 */
export const common = {
  months,
  days,
  hebLeapYear,
  monthsInHebYear,
  getMonthName,
  daysInHebMonth,
  monthNum,
  hebElapsedDays,
  daysInYear,
  longCheshvan,
  shortKislev,
  monthFromName,
  dayOnOrBefore,
  range,
};
import {dafyomi as getDafYomi, dafname} from './dafyomi';
/**
 * Daf Yomi
 * @namespace
 */
export const dafyomi = {
  dafyomi: getDafYomi,
  dafname,
};
export {Sedra, parshiot} from './sedra';
import {greg2abs, abs2greg} from './greg';
import {
  gregLeapYear,
  daysInGregMonth,
  monthNames,
  dayOfYear,
} from './greg';
/**
 * Gregorian date routines
 * @namespace
 */
export const greg = {
  gregLeapYear,
  daysInGregMonth,
  monthNames,
  dayOfYear,
};
import {getHolidaysOnDate, getHolidaysForYear} from './holidays';
/**
 * Lower-level holidays interface
 * @namespace
 */
export const holidays = {
  getHolidaysOnDate,
  getHolidaysForYear,
};
import {
  makeAnchor,
  getHolidayBasename,
  getShortUrl,
  getEventUrl,
  reformatTimeStr,
} from './url';
import {hebrewCalendar, registerLocale} from './hebcal';
/**
 * Main interface to Hebcal
 * @namespace
 */
export const hebcal = {
  hebrewCalendar,
  registerLocale,
  // anniversary.js
  getBirthdayOrAnniversary, getYahrzeit,
  // greg.js
  greg2abs, abs2greg,
  // hdate.js
  hebrew2abs, abs2hebrew,
  // url.js
  makeAnchor, getHolidayBasename, getShortUrl, getEventUrl, reformatTimeStr,
  // location.js
  registerLocation,
};
