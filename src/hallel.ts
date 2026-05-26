import {HDate, months} from '@hebcal/hdate';
import {Event, flags} from './event';
import {holidayDesc as hdesc} from './staticHolidays';

const NONE = 0;
const HALF = 1;
const WHOLE = 2;

/**
 * @private
 */
export function hallel_(events: Event[], hdate: HDate): number {
  const abs = hdate.abs();
  for (const ev of events) {
    const hd: HDate = ev.getDate();
    if (hd.abs() !== abs) {
      continue;
    }
    const desc = ev.getDesc();
    const month = hd.getMonth();
    const mday = hd.getDate();
    const mask = ev.getFlags();
    if (
      desc.startsWith('Chanukah') ||
      desc.startsWith('Shavuot') ||
      desc.startsWith('Sukkot') ||
      (month === months.NISAN &&
        (mday === 15 || mday === 16) &&
        mask & flags.CHAG) || // Pesach
      desc === hdesc.YOM_HAATZMA_UT ||
      desc === hdesc.YOM_YERUSHALAYIM
    ) {
      return WHOLE;
    }

    if (
      mask & flags.ROSH_CHODESH ||
      (desc.startsWith('Pesach') &&
        desc !== hdesc.PESACH_I &&
        desc !== hdesc.PESACH_II)
    ) {
      return HALF;
    }
  }

  return NONE;
}
