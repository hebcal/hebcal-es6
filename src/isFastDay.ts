import {HDate} from '@hebcal/hdate';
import {getHolidaysOnDate} from './holidays.js';

/**
 * Returns `true` if the given date is observed as a major or minor fast day.
 *
 * Major fasts: Yom Kippur, Tish'a B'Av.
 * Minor fasts: Tzom Gedaliah, Asara B'Tevet, Ta'anit Esther, Ta'anit
 * Bechorot, Tzom Tammuz (plus BeHaB fasts when enabled).
 *
 * Erev Tish'a B'Av — even though the fast begins at sunset — is *not*
 * counted here: only the actual fast day itself returns `true`.
 * Postponed fasts return `true` on the actual observed date (e.g. when
 * 17 Tammuz falls on Shabbat and is observed on the 18th).
 * @example
 * import {isFastDay, HDate, months} from '@hebcal/core';
 * isFastDay(new HDate(10, months.TISHREI, 5784)); // true  (Yom Kippur)
 * isFastDay(new HDate(11, months.TISHREI, 5784)); // false
 * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
 * @param il optional; use the Israeli schedule for holidays (default Diaspora)
 * @return `true` if the date is a major or minor fast day
 */
export function isFastDay(date: HDate | Date | number, il?: boolean): boolean {
  const events = getHolidaysOnDate(date, il) || [];
  const fastDay = events.find(
    ev =>
      (ev.hasFlag('MAJOR_FAST') || ev.hasFlag('MINOR_FAST')) && !ev.hasFlag('EREV')
  );
  return Boolean(fastDay);
}
