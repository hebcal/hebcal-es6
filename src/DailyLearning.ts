import {HDate} from '@hebcal/hdate';
import {Event} from './event';

type LearningCalendar = {
  fn: (hd: HDate, il: boolean) => Event | null;
  startDate?: HDate;
};
const cals = new Map<string, LearningCalendar>();

/**
 * Plug-in registry for daily learning calendars such as Daf Yomi (Bavli),
 * Yerushalmi Yomi, Mishna Yomi, Nach Yomi, etc.
 *
 * `@hebcal/core` itself contains no learning schedules — they are provided
 * by the {@link https://github.com/hebcal/hebcal-learning @hebcal/learning}
 * package, which calls {@link DailyLearning.addCalendar} on import. After
 * `@hebcal/learning` is loaded, `HebrewCalendar.calendar()` will emit
 * learning events when the corresponding `options.dailyLearning` flag is set.
 *
 * @example
 * import '@hebcal/learning';
 * import {DailyLearning, HDate} from '@hebcal/core';
 *
 * const ev = DailyLearning.lookup('dafYomi', new HDate(), false);
 * console.log(ev?.render('en')); // e.g. 'Berakhot 2'
 */
export class DailyLearning {
  /**
   * Registers a new learning calendar.
   *
   * The provided function is called whenever a caller asks for an event
   * from this calendar; if no learning occurs that day (e.g. the date is
   * before the cycle's start) it should return `null`.
   * @example
   * DailyLearning.addCalendar(
   *   'myCalendar',
   *   (hd, il) => new Event(hd, 'Today\'s learning', 0),
   *   new HDate(1, 'Tishrei', 5780),
   * );
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
   * Returns the learning event for the given date from the named calendar,
   * or `null` if there is no learning that day (or the named calendar is
   * not registered).
   * @example
   * import '@hebcal/learning';
   * import {DailyLearning, HDate} from '@hebcal/core';
   * DailyLearning.lookup('dafYomi', new HDate(2024, 1, 15), false);
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

  /**
   * Returns the first Hebrew date for which the named learning calendar
   * is valid (as registered by {@link addCalendar}), or `undefined` if the
   * calendar was not registered with a start date or is not registered at all.
   * @param name case insensitive
   */
  static getStartDate(name: string): HDate | undefined {
    const cal = cals.get(name.toLowerCase());
    if (typeof cal === 'object') {
      return cal.startDate;
    }
    return undefined;
  }

  /**
   * Returns `true` if a learning calendar with the given name has been
   * registered via {@link addCalendar}.
   * @param name case insensitive
   */
  static has(name: string): boolean {
    return cals.has(name.toLowerCase());
  }

  /**
   * Returns the (lower-cased) names of all currently-registered learning
   * calendars.
   */
  static getCalendars(): string[] {
    return Array.from(cals.keys());
  }
}
