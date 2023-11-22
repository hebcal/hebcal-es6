import {Event, flags} from './event';
import {months} from './hdate';
import {gematriya} from './gematriya';
import {Locale} from './locale';

/** Daily Hebrew date ("11th of Sivan, 5780") */
export class HebrewDateEvent extends Event {
  /**
   * @param {HDate} date
   */
  constructor(date) {
    super(date, date.toString(), flags.HEBREW_DATE);
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @example
   * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * const ev = new HebrewDateEvent(hd);
   * console.log(ev.render('en')); // '15th of Cheshvan, 5769'
   * console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
   * @return {string}
   */
  render(locale) {
    const locale1 = locale?.toLowerCase();
    const locale0 = locale1 || Locale.getLocaleName();
    const hd = this.getDate();
    switch (locale0) {
      case 'h':
      case 'he':
      case 'he-x-nonikud':
        const dd = hd.getDate();
        const mm = Locale.gettext(hd.getMonthName(), locale0);
        const yy = hd.getFullYear();
        return gematriya(dd) + ' ' + mm + ' ' + gematriya(yy);
      default:
        return hd.render(locale0, true);
    }
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @example
   * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * const ev = new HebrewDateEvent(hd);
   * console.log(ev.renderBrief()); // '15th of Cheshvan'
   * console.log(ev.renderBrief('he')); // 'ט״ו חֶשְׁוָן'
   * @return {string}
   */
  renderBrief(locale) {
    const locale1 = locale?.toLowerCase();
    const locale0 = locale1 || Locale.getLocaleName();
    const hd = this.getDate();
    if (hd.getMonth() === months.TISHREI && hd.getDate() === 1) {
      return this.render(locale0);
    }
    switch (locale0) {
      case 'h':
      case 'he':
      case 'he-x-nonikud':
        const dd = hd.getDate();
        const mm = Locale.gettext(hd.getMonthName(), locale0);
        return gematriya(dd) + ' ' + mm;
      default:
        return hd.render(locale0, false);
    }
  }
}
