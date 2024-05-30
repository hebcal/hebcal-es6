import {HDate, Locale, months} from '@hebcal/hdate';
import {Event, flags} from './event';
import {Molad} from './molad';

const mevarchimChodeshStr = 'Shabbat Mevarchim Chodesh';

/** Represents Mevarchim haChodesh, the announcement of the new month */
export class MevarchimChodeshEvent extends Event {
  readonly monthName: string;
  /**
   * Constructs Mevarchim haChodesh event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} monthName Hebrew month name (not translated)
   * @param {string} [memo]
   */
  constructor(date: HDate, monthName: string, memo: string) {
    super(date, `${mevarchimChodeshStr} ${monthName}`, flags.SHABBAT_MEVARCHIM);
    this.monthName = monthName;
    if (memo) {
      this.memo = memo;
    } else {
      const hyear = date.getFullYear();
      const hmonth = date.getMonth();
      const monNext = (hmonth == HDate.monthsInYear(hyear) ? months.NISAN : hmonth + 1);
      const molad = new Molad(hyear, monNext);
      this.memo = molad.render('en', {hour12: false});
    }
  }
  /** @return {string} */
  basename(): string {
    return this.getDesc();
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale?: string): string {
    const monthName0 = Locale.gettext(this.monthName, locale);
    const monthName = monthName0.replace(/'/g, '’');
    return Locale.gettext(mevarchimChodeshStr, locale) + ' ' + monthName;
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale?: string): string {
    const str = this.render(locale);
    const space = str.indexOf(' ');
    return str.substring(space + 1);
  }
}