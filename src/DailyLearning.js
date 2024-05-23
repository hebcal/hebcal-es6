/** @private */
const cals = new Map();

/**
 * Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.
 *
 * Learning schedules are provided by the `@hebcal/learning` package.
 */
export class DailyLearning {
  /**
   * Register a new learning calendar.
   * @param {string} name
   * @param {Function} calendar
   */
  static addCalendar(name, calendar) {
    if (typeof calendar !== 'function') {
      throw new TypeError(`Invalid calendar function: ${calendar}`);
    }
    cals.set(name, calendar);
  }

  /**
   * Returns an event from daily calendar for a given date. Returns `null` if there
   * is no learning from this calendar on this date.
   * @param {string} name
   * @param {HDate} hd
   * @param {boolean} il
   * @return {Event | null}
   */
  static lookup(name, hd, il) {
    const fn = cals.get(name);
    if (typeof fn === 'function') {
      return fn(hd, il);
    }
    return null;
  }
}
