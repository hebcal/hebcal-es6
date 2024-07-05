import {HDate} from '@hebcal/hdate';
import {Event} from './event';

/** @private */
const cals = new Map<string, Function>();

/**
 * Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.
 *
 * Learning schedules are provided by the `@hebcal/learning` package.
 */
export class DailyLearning {
  /**
   * Register a new learning calendar.
   */
  static addCalendar(name: string, calendar: Function) {
    if (typeof calendar !== 'function') {
      throw new TypeError(`Invalid calendar function: ${calendar}`);
    }
    cals.set(name, calendar);
  }

  /**
   * Returns an event from daily calendar for a given date. Returns `null` if there
   * is no learning from this calendar on this date.
   * @param name
   * @param hd
   * @param il
   */
  static lookup(name: string, hd: HDate, il: boolean): Event | null {
    const fn = cals.get(name);
    if (typeof fn === 'function') {
      return fn(hd, il);
    }
    return null;
  }
}
