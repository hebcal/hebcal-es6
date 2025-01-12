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
   * @param name case insensitive
   */
  static addCalendar(name: string, calendar: Function) {
    if (typeof calendar !== 'function') {
      throw new TypeError(`Invalid calendar function: ${calendar}`);
    }
    cals.set(name.toLowerCase(), calendar);
  }

  /**
   * Returns an event from daily calendar for a given date. Returns `null` if there
   * is no learning from this calendar on this date.
   * @param name case insensitive
   * @param hd Hebrew Date
   * @param il true for Israel, false for Diaspora
   */
  static lookup(name: string, hd: HDate, il: boolean): Event | null {
    const fn = cals.get(name.toLowerCase());
    if (typeof fn === 'function') {
      return fn(hd, il);
    }
    return null;
  }

  /**
   * Tests to see if learning calendar has been registered
   * @param name case insensitive
   */
  static has(name: string): boolean {
    return cals.has(name.toLowerCase());
  }

  /** Returns the names of all calendars registered */
  static getCalendars(): string[] {
    return Array.from(cals.keys());
  }
}
