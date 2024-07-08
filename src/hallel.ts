import {HDate, months} from '@hebcal/hdate';
import {Event, flags} from './event';

const NONE = 0;
const HALF = 1;
const WHOLE = 2;

/**
 * @private
 */
export function hallel_(events: Event[], hdate: HDate): number {
  const whole = events
    .filter(ev => {
      const desc: string = ev.getDesc();
      const hd: HDate = ev.getDate();
      const month = hd.getMonth();
      const mday = hd.getDate();
      return (
        desc.startsWith('Chanukah') ||
        desc.startsWith('Shavuot') ||
        desc.startsWith('Sukkot') ||
        (month === months.NISAN &&
          (mday === 15 || mday === 16) &&
          ev.getFlags() & flags.CHAG) || // Pesach
        desc === "Yom HaAtzma'ut" ||
        desc === 'Yom Yerushalayim'
      );
    })
    .map(ev => {
      return ev.getDate().abs();
    });

  const abs = hdate.abs();
  if (whole.includes(abs)) {
    return WHOLE;
  }

  const half = events
    .filter(ev => {
      const desc = ev.getDesc();
      return (
        ev.getFlags() & flags.ROSH_CHODESH ||
        (desc.startsWith('Pesach') &&
          desc !== 'Pesach I' &&
          desc !== 'Pesach II')
      );
    })
    .map(ev => {
      return ev.getDate().abs();
    });

  if (half.includes(abs)) {
    return HALF;
  }

  return NONE;
}
