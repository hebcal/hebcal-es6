import {HDate} from '@hebcal/hdate';
import {flags} from './event';
import {getHolidaysOnDate} from './holidays';

const FAST_DAY = flags.MAJOR_FAST | flags.MINOR_FAST;
const EREV = flags.EREV;

/**
 * Utility method to determine if the given date is a fast day.
 *
 * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
 * @param il use the Israeli schedule for holidays
 * @return `true` if the date is a major or minor fast day
 */
export function isFastDay(date: HDate | Date | number, il?: boolean): boolean {
  const events = getHolidaysOnDate(date, il) || [];
  const fastDay = events.find(ev => {
    const mask = ev.getFlags();
    return mask & FAST_DAY && !(mask & EREV);
  });
  return Boolean(fastDay);
}
