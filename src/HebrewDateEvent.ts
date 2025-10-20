import {HDate, gematriya, months, Locale} from '@hebcal/hdate';
import {Event, flags} from './event';
import './locale'; // Adds Hebrew and Ashkenazic translations

/** Daily Hebrew date ("11th of Sivan, 5780") */
export class HebrewDateEvent extends Event {
  /**
   * @param date
   */
  constructor(date: HDate) {
    super(date, date.toString(), flags.HEBREW_DATE);
  }
  /**
   * @param [locale] Optional locale name (defaults to active locale).
   * @example
   * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * const ev = new HebrewDateEvent(hd);
   * console.log(ev.render('en')); // '15th of Cheshvan, 5769'
   * console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
   */
  render(locale?: string): string {
    const locale1 = locale?.toLowerCase();
    const locale0 = locale1 ?? 'en';
    const hd = this.getDate();
    switch (locale0) {
      case 'h':
      case 'he':
        return hd.renderGematriya(false);
      case 'he-x-nonikud':
        return hd.renderGematriya(true);
      default:
        return hd.render(locale0, true);
    }
  }
  /**
   * @private
   * @param locale
   */
  private renderBriefHebrew(locale: string): string {
    const hd = this.getDate();
    const dd = hd.getDate();
    const mm = Locale.gettext(hd.getMonthName(), locale);
    return gematriya(dd) + ' ' + mm;
  }
  /**
   * @param [locale] Optional locale name (defaults to active locale).
   * @example
   * import {HDate, HebrewDateEvent, months} from '@hebcal/core';
   *
   * const hd = new HDate(15, months.CHESHVAN, 5769);
   * const ev = new HebrewDateEvent(hd);
   * console.log(ev.renderBrief()); // '15th of Cheshvan'
   * console.log(ev.renderBrief('he')); // 'ט״ו חֶשְׁוָן'
   */
  renderBrief(locale?: string): string {
    const locale1 = locale?.toLowerCase();
    const locale0 = locale1 ?? 'en';
    const hd = this.getDate();
    if (hd.getMonth() === months.TISHREI && hd.getDate() === 1) {
      return this.render(locale0);
    }
    switch (locale0) {
      case 'h':
      case 'he':
      case 'he-x-nonikud':
        return this.renderBriefHebrew(locale0);
      default:
        return hd.render(locale0, false);
    }
  }
}
