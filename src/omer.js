import {flags, Event} from './event';
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

const sefirotTranslit = [
  null,
  'Chesed',
  'Gevurah',
  'Tiferet',
  'Netzach',
  'Hod',
  'Yesod',
  'Malkhut',
];

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} omerDay
   */
  constructor(date, omerDay) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT, {omer: omerDay});
    if (omerDay < 1 || omerDay > 49) {
      throw new RangeError(`Invalid Omer day ${omerDay}`);
    }
    this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
    this.daysWithinWeeks = (omerDay % 7) || 7;
    this.memo = [this.sefira('en'), this.sefira('he'), this.sefira('translit')].join('\n');
  }
  /**
   * @param {string} lang
   * @return {string}
   */
  sefira(lang='en') {
    const week = sefirot[this.weekNumber];
    const dayWithinWeek = sefirot[this.daysWithinWeeks];
    switch (lang) {
      case 'he':
        const heWeek = Locale.gettext(week, 'he');
        const heDayWithinWeek = Locale.gettext(dayWithinWeek, 'he');
        const hePrefix = this.weekNumber === 2 || this.weekNumber === 6 ? 'שֶׁבִּ' : 'שֶׁבְּ';
        return `${heDayWithinWeek} ${hePrefix}${heWeek}`.normalize();
      case 'translit':
        const translitWeek = sefirotTranslit[this.weekNumber];
        const translitDayWithinWeek = sefirotTranslit[this.daysWithinWeeks];
        const translitPrefix = this.weekNumber === 2 || this.weekNumber === 6 ? 'shebi' : `sheb'`;
        return `${translitDayWithinWeek} ${translitPrefix}${translitWeek}`;
      case 'en':
      default:
        return `${dayWithinWeek} within ${week}`;
    }
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
    if (typeof this.emoji === 'string') return this.emoji;
    const number = this.omer;
    if (number <= 20) {
      return String.fromCodePoint(9312 + number - 1);
    } else if (number <= 35) {
      // between 21 and 35 inclusive
      return String.fromCodePoint(12881 + number - 21);
    } else {
      // between 36 and 49 inclusive
      return String.fromCodePoint(12977 + number - 36);
    }
  }
  /** @return {number} */
  getWeeks() {
    const day7 = this.daysWithinWeeks === 7;
    return day7 ? this.weekNumber : this.weekNumber - 1;
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
  /** @return {string} */
  url() {
    return `https://www.hebcal.com/omer/${this.getDate().getFullYear()}/${this.omer}`;
  }
}
