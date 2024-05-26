import {gematriya, omerSefira, omerTodayIs, omerEmoji} from '@hebcal/hdate';
import {Event, flags} from './event.js';
import {Locale} from '@hebcal/hdate';

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} omerDay
   */
  constructor(date, omerDay) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT);
    if (omerDay < 1 || omerDay > 49) {
      throw new RangeError(`Invalid Omer day ${omerDay}`);
    }
    this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
    this.daysWithinWeeks = (omerDay % 7) || 7;
    this.omer = omerDay;
  }
  /**
   * @param {string} lang
   * @return {string}
   */
  sefira(lang='en') {
    if (lang !== 'he' && lang !== 'translit') {
      lang = 'en';
    }
    return omerSefira(this.omer, lang);
  }
  /**
   * @todo use gettext()
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const isHebrewLocale = locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
    const omer = this.omer;
    const nth = isHebrewLocale ? gematriya(omer) : Locale.ordinal(omer, locale);
    return nth + ' ' + Locale.gettext('day of the Omer', locale);
  }
  /**
   * Returns translation of "Omer day 22" without ordinal numbers.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext('Omer', locale) + ' ' + Locale.gettext('day', locale) + ' '+ this.omer;
  }
  /** @return {string} */
  getEmoji() {
    if (typeof this.emoji === 'string') return this.emoji;
    return omerEmoji(this.omer);
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
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    if (locale === 'he') {
      return omerTodayIs(this.omer, 'he');
    } else if (locale === 'he-x-nonikud') {
      const str = omerTodayIs(this.omer, 'he');
      return Locale.hebrewStripNikkud(str);
    }
    return omerTodayIs(this.omer, 'en');
  }
  /** @return {string} */
  url() {
    return `https://www.hebcal.com/omer/${this.getDate().getFullYear()}/${this.omer}`;
  }
}
