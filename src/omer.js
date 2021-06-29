import {flags, Event, KEYCAP_DIGITS} from './event';
import {Locale} from './locale';
import gematriya from 'gematriya';

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} omerDay
   */
  constructor(date, omerDay) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT, {omer: omerDay});
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
}
