import {HDate} from '@hebcal/hdate';
import {Event} from './event';

type LearningCalendar = {
  fn: (hd: HDate, il: boolean) => Event | null;
  startDate?: HDate;
};
const cals = new Map<string, LearningCalendar>();

/**
 * Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.
 *
 * Learning schedules are provided by the `@hebcal/learning` package.
 */
export class DailyLearning {
  /**
   * Register a new learning calendar.
   * @param name case insensitive
   * @param calendar a function that returns an `Event` or `null`
   * @param startDate the first date for which this calendar is valid
   */
  static addCalendar(
    name: string,
    calendar: (hd: HDate, il: boolean) => Event | null,
    startDate?: HDate
  ) {
    if (typeof calendar !== 'function') {
      throw new TypeError(`Invalid calendar function: ${calendar}`);
    }
    cals.set(name.toLowerCase(), {
      fn: calendar,
      startDate: startDate,
    });
  }

  /**
   * Returns an event from daily calendar for a given date. Returns `null` if there
   * is no learning from this calendar on this date.
   * @param name case insensitive
   * @param hd Hebrew Date
   * @param il true for Israel, false for Diaspora
   */
  static lookup(name: string, hd: HDate, il: boolean): Event | null {
    const cal = cals.get(name.toLowerCase());
    if (typeof cal === 'object') {
      return cal.fn(hd, il);
    }
    return null;
  }

  static getStartDate(name: string): HDate | undefined {
    const cal = cals.get(name.toLowerCase());
    if (typeof cal === 'object') {
      return cal.startDate;
    }
    return undefined;
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
