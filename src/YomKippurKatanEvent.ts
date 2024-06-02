import {HDate, Locale} from '@hebcal/hdate';
import {flags} from './event';
import {HolidayEvent} from './HolidayEvent';
import './locale'; // Adds Hebrew and Ashkenazic translations

export const ykk = 'Yom Kippur Katan';

/** YKK is minor day of atonement on the day preceeding each Rosh Chodesh */
export class YomKippurKatanEvent extends HolidayEvent {
  private readonly nextMonthName: string;
  /**
   * @private
   * @param {HDate} date Hebrew date event occurs
   * @param {string} nextMonthName name of the upcoming month
   */
  constructor(date: HDate, nextMonthName: string) {
    super(date, `${ykk} ${nextMonthName}`, flags.MINOR_FAST | flags.YOM_KIPPUR_KATAN);
    this.nextMonthName = nextMonthName;
    this.memo = `Minor Day of Atonement on the day preceeding Rosh Chodesh ${nextMonthName}`;
  }
  /** @return {string} */
  basename(): string {
    return this.getDesc();
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale?: string): string {
    const monthName0 = Locale.gettext(this.nextMonthName, locale);
    const monthName = monthName0.replace(/'/g, '’');
    return Locale.gettext(ykk, locale) + ' ' + monthName;
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale?: string): string {
    return Locale.gettext(ykk, locale);
  }
  /** @return {string | undefined} */
  url(): string | undefined {
    return undefined;
  }
}
