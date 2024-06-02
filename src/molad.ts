/* eslint-disable camelcase */
import {Event, flags} from './event';
import {CalOptions} from './CalOptions';
import {HDate, Locale, molad, Molad as MoladBase} from '@hebcal/hdate';
import {reformatTimeStr} from './reformatTimeStr';
import '../src/locale'; // Adds Hebrew and Ashkenazic translations

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const heDayNames = ['רִאשׁוֹן', 'שֵׁנִי', 'שְׁלִישִׁי', 'רְבִיעִי', 'חֲמִישִׁי', 'שִׁישִּׁי', 'שַׁבָּת'];

const night = 'בַּלַּ֥יְלָה';
const morning = 'בַּבֹּקֶר';
const afternoon = 'בַּצׇּהֳרַיִים';
const evening = 'בָּעֶרֶב';

/**
 * Represents a molad, the moment when the new moon is "born"
 */
export class Molad {
  private readonly m: MoladBase;
  /**
   * Calculates the molad for a Hebrew month
   * @param {number} year
   * @param {number} month
   */
  constructor(year: number, month: number) {
    this.m = molad(year, month);
  }
  /**
   * @return {number}
   */
  getYear(): number {
    return this.m.year;
  }
  /**
   * @return {number}
   */
  getMonth(): number {
    return this.m.month;
  }
  /**
   * @return {string}
   */
  getMonthName(): string {
    return HDate.getMonthName(this.m.month, this.m.year);
  }
  /**
   * @return {number} Day of Week (0=Sunday, 6=Saturday)
   */
  getDow(): number {
    return this.m.dayOfWeek;
  }
  /**
   * @return {number} hour of day (0-23)
   */
  getHour(): number {
    return this.m.hour;
  }
  /**
   * @return {number} minutes past hour (0-59)
   */
  getMinutes(): number {
    return this.m.minutes;
  }
  /**
   * @return {number} parts of a minute (0-17)
   */
  getChalakim(): number {
    return this.m.chalakim;
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale)
   * @param {CalOptions} options
   * @return {string}
   */
  render(locale?: string, options?: CalOptions): string {
    locale = locale ?? Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const isHebrewLocale = locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
    const monthName = Locale.gettext(this.getMonthName(), locale);
    const dayNames = isHebrewLocale ? heDayNames : shortDayNames;
    const dow = dayNames[this.getDow()];
    const minutes = this.getMinutes();
    const hour = this.getHour();
    const chalakim = this.getChalakim();
    const moladStr = Locale.gettext('Molad', locale);
    const minutesStr = Locale.lookupTranslation('min', locale) || 'minutes';
    const chalakimStr = Locale.gettext('chalakim', locale);
    if (isHebrewLocale) {
      const ampm = hour < 5 ? night : hour < 12 ? morning :
        hour < 17 ? afternoon : hour < 21 ? evening : night;
      const result = `${moladStr} ${monthName} יִהְיֶה בַּיּוֹם ${dow} בשָׁבוּעַ, ` +
        `בְּשָׁעָה ${hour} ${ampm}, ` +
        `ו-${minutes} ${minutesStr} ` +
        `ו-${chalakim} ${chalakimStr}`;
      if (locale === 'he-x-nonikud') {
        return Locale.hebrewStripNikkud(result);
      }
      return result;
    }
    const fmtTime = reformatTimeStr(`${hour}:00`, 'pm', options);
    const month = monthName.replace(/'/g, '’');
    return `${moladStr} ${month}: ${dow}, ${minutes} ${minutesStr} and ${chalakim} ${chalakimStr} after ${fmtTime}`;
  }
}

/** Represents a Molad announcement on Shabbat Mevarchim */
export class MoladEvent extends Event {
  readonly molad: Molad;
  private readonly options: CalOptions;
  /**
   * @param {HDate} date Hebrew date event occurs
   * @param {number} hyear molad year
   * @param {number} hmonth molad month
   * @param {CalOptions} options
   */
  constructor(date: HDate, hyear: number, hmonth: number, options: CalOptions) {
    const m = new Molad(hyear, hmonth);
    const monthName = m.getMonthName();
    super(date, `Molad ${monthName} ${hyear}`, flags.MOLAD);
    this.molad = m;
    this.options = options;
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale?: string): string {
    return this.molad.render(locale, this.options);
  }
}
