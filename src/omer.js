import {flags, Event, KEYCAP_DIGITS} from './event';
import {Locale} from './locale';
import {gematriya} from './gematriya';

const sefirot = [
  null,
  'Lovingkindness',
  'Might',
  'Beauty',
  'Eternity',
  'Splendor',
  'Foundation',
  'Majesty',
];

/*
const sefirotTranslit = {
  Lovingkindness: 'Chesed',
  Might: 'Gevurah',
  Beauty: 'Tiferet',
  Eternity: 'Netzach',
  Splendor: 'Hod',
  Foundation: 'Yesod',
  Majesty: 'Malkhut',
};
*/

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} omerDay
   */
  constructor(date, omerDay) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT, {omer: omerDay});
    this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
    this.daysWithinWeeks = (omerDay % 7) || 7;
    const week = sefirot[this.weekNumber];
    const dayWithinWeek = sefirot[this.daysWithinWeeks];
    const heWeek = Locale.gettext(week, 'he');
    const heDayWithinWeek = Locale.gettext(dayWithinWeek, 'he');
    const hePrefix = 'שֶׁבַּ';
    this.memo = `${dayWithinWeek} that is in ${week} / ${heDayWithinWeek} ${hePrefix}${heWeek}`.normalize();
  }
  /**
   * @todo use gettext()
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const omer = this.omer;
    const nth = (locale == 'he') ? gematriya(omer) : Locale.ordinal(omer, locale);
    return nth + ' ' + Locale.gettext('day of the Omer', locale);
  }
  /**
   * Returns translation of "Omer 22" without ordinal numbers.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext('Omer', locale) + ' ' + this.omer;
  }
  /** @return {string} */
  getEmoji() {
    if (this.emoji) return this.emoji;
    const number = this.omer;
    const ones = number % 10;
    const tens = Math.floor(number / 10);
    return KEYCAP_DIGITS[tens] + KEYCAP_DIGITS[ones];
  }
  /** @return {number} */
  getWeeks() {
    return this.weekNumber;
  }
  /** @return {number} */
  getDaysWithinWeeks() {
    return this.daysWithinWeeks;
  }
  /**
   * @param {string} locale
   * @return {string}
   */
  getTodayIs(locale) {
    const totalDaysStr = (this.omer === 1) ? 'day' : 'days';
    let str = `Today is ${this.omer} ${totalDaysStr}`;
    if (this.weekNumber > 1 || this.omer === 7) {
      const day7 = this.daysWithinWeeks === 7;
      const numWeeks = day7 ? this.weekNumber : this.weekNumber - 1;
      const weeksStr = (numWeeks === 1) ? 'week' : 'weeks';
      str += `, which is ${numWeeks} ${weeksStr}`;
      if (!day7) {
        const daysStr = (this.daysWithinWeeks === 1) ? 'day' : 'days';
        str += ` and ${this.daysWithinWeeks} ${daysStr}`;
      }
    }
    return str + ' of the Omer';
  }
}
