import {HDate, months} from '@hebcal/hdate';
import {dateYomHaZikaron} from './modern.js';

const NONE = 0;
const HALF = 1;
const WHOLE = 2;

/**
 * Determines which form of Hallel (if any) is recited on `hdate`,
 * computed directly from the Hebrew month and day.
 * @internal
 * @param hdate Hebrew date to test
 * @param il use the Israeli holiday schedule
 * @returns 0 for no Hallel, 1 for half Hallel, 2 for whole Hallel
 */
export function hallel_(hdate: HDate, il: boolean): number {
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
