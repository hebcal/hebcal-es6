import {HDate, months} from '@hebcal/hdate';
import {dateYomHaZikaron} from './modern.js';

const NONE = 0;
const HALF = 1;
const WHOLE = 2;

/**
 * Determines which form of Hallel (if any) is recited
 * on a given Hebrew date.
 *
 * Returns 0 (none), 1 (half Hallel), or 2 (whole Hallel).
 *
 * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
 * Shmini Atzeret, Simchat Torah, Yom Ha'atzmaut, and Yom Yerushalayim.
 *
 * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
 * Rosh Chodesh Tevet falls during Chanukah, so whole Hallel is said then.
 *
 * The result is computed directly from the Hebrew month and day,
 * without generating holiday events.
 * @example
 * import {hallel, HDate, months} from '@hebcal/core';
 * hallel(new HDate(25, months.KISLEV, 5784), false); // 2 (Chanukah)
 * hallel(new HDate(1, months.SHVAT, 5784), false);   // 1 (Rosh Chodesh)
 * hallel(new HDate(2, months.SHVAT, 5784), false);   // 0
 * hallel(new HDate(16, months.NISAN, 5784), false);  // 2 (Pesach II, Diaspora)
 * hallel(new HDate(16, months.NISAN, 5784), true);   // 1 (Chol HaMoed, Israel)
 * @param hdate Hebrew date to test
 * @param il use the Israeli holiday schedule
 * @returns 0 for no Hallel, 1 for half Hallel, 2 for whole Hallel
 */
export function hallel(hdate: HDate, il: boolean): number {
  const mm = hdate.getMonth();
  const dd = hdate.getDate();
  switch (mm) {
    case months.TISHREI:
      // Sukkot (15-21), Shmini Atzeret (22), Simchat Torah (23, Diaspora)
      if (dd >= 15 && dd <= (il ? 22 : 23)) {
        return WHOLE;
      }
      break;
    case months.KISLEV:
      // Chanukah begins 25 Kislev; the first candle on the evening of
      // 24 Kislev precedes the first morning of Chanukah
      if (dd >= 25) {
        return WHOLE;
      }
      break;
    case months.TEVET: {
      // Chanukah lasts 8 days, ending on 2 Tevet (3 Tevet if Kislev is short)
      const lastDay = HDate.shortKislev(hdate.getFullYear()) ? 3 : 2;
      if (dd <= lastDay) {
        return WHOLE;
      }
      break;
    }
    case months.NISAN:
      // First day(s) of Pesach
      if (dd === 15 || (dd === 16 && !il)) {
        return WHOLE;
      }
      // Remaining days of Pesach
      if (dd >= 16 && dd <= (il ? 21 : 22)) {
        return HALF;
      }
      break;
    case months.IYYAR: {
      const year = hdate.getFullYear();
      // Yom Yerushalayim
      if (dd === 28 && year >= 5727) {
        return WHOLE;
      }
      // Yom Ha'atzmaut, the day after Yom HaZikaron
      const yomHaZikaron = dateYomHaZikaron(year);
      if (yomHaZikaron !== null && dd === yomHaZikaron.getDate() + 1) {
        return WHOLE;
      }
      break;
    }
    case months.SIVAN:
      // Shavuot
      if (dd === 6 || (dd === 7 && !il)) {
        return WHOLE;
      }
      break;
    default:
      break;
  }

  // Rosh Chodesh: the 30th of any month, or the 1st of any month
  // other than Tishrei (Rosh Hashana)
  if (dd === 30 || (dd === 1 && mm !== months.TISHREI)) {
    return HALF;
  }

  return NONE;
}
