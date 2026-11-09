import {HDate, months} from '@hebcal/hdate';
import {Event} from './event.js';
import {holidayDesc as hdesc} from './staticHolidays.js';

const NONE = 0;
const HALF = 1;
const WHOLE = 2;

/** @internal */
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
    if (
      // Chanukah's Hallel starts on 25 Kislev; the "1 Candle" event is
      // on the evening of 24 Kislev, before the first morning of Chanukah
      (desc.startsWith('Chanukah') && desc !== hdesc.CHANUKAH_1_CANDLE) ||
      desc.startsWith('Shavuot') ||
      desc.startsWith('Sukkot') ||
      desc === hdesc.SHMINI_ATZERET ||
      desc === hdesc.SIMCHAT_TORAH ||
      (month === months.NISAN &&
        (mday === 15 || mday === 16) &&
        ev.hasFlag('CHAG')) || // Pesach
      desc === hdesc.YOM_HAATZMA_UT ||
      desc === hdesc.YOM_YERUSHALAYIM
    ) {
      return WHOLE;
    }

    if (
      ev.hasFlag('ROSH_CHODESH') ||
      (desc.startsWith('Pesach') &&
        desc !== hdesc.PESACH_I &&
        desc !== hdesc.PESACH_II &&
        desc !== hdesc.PESACH_SHENI)
    ) {
      return HALF;
    }
  }

  return NONE;
}
