import {
  HDate,
  Locale,
  OmerLang,
  gematriya,
  omerEmoji,
  omerSefira,
  omerTodayIs,
} from '@hebcal/hdate';
import {Event, flags} from './event';
import './locale'; // Adds Hebrew and Ashkenazic translations

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  private readonly weekNumber: number;
  private readonly daysWithinWeeks: number;
  readonly omer: number;
  emoji?: string;

  /**
   * @param date
   * @param omerDay
   */
  constructor(date: HDate, omerDay: number) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT);
    if (omerDay < 1 || omerDay > 49) {
      throw new RangeError(`Invalid Omer day ${omerDay}`);
    }
    this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
    this.daysWithinWeeks = omerDay % 7 || 7;
    this.omer = omerDay;
  }
  /**
   * @param lang
   */
  sefira(lang = 'en'): string {
    if (lang !== 'he' && lang !== 'translit') {
      lang = 'en';
    }
    return omerSefira(this.omer, lang as OmerLang);
  }
  /**
   * @todo use gettext()
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale ?? Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const isHebrewLocale =
      locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
    const omer = this.omer;
    const nth = isHebrewLocale ? gematriya(omer) : Locale.ordinal(omer, locale);
    return nth + ' ' + Locale.gettext('day of the Omer', locale);
  }
  /**
   * Returns translation of "Omer day 22" without ordinal numbers.
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    return (
      Locale.gettext('Omer', locale) +
      ' ' +
      Locale.gettext('day', locale) +
      ' ' +
      this.omer
    );
  }

  getEmoji(): string {
    if (typeof this.emoji === 'string') return this.emoji;
    return omerEmoji(this.omer);
  }

  getWeeks(): number {
    const day7 = this.daysWithinWeeks === 7;
    return day7 ? this.weekNumber : this.weekNumber - 1;
  }

  getDaysWithinWeeks(): number {
    return this.daysWithinWeeks;
  }
  /**
   * @param locale
   */
  getTodayIs(locale: string): string {
    locale = locale ?? Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const omerLang = locale === 'he' || locale === 'he-x-nonikud' ? 'he' : 'en';
    const str = omerTodayIs(this.omer, omerLang) as string;
    if (locale === 'he-x-nonikud') {
      return Locale.hebrewStripNikkud(str);
    }
    return str;
  }

  url(): string {
    return `https://www.hebcal.com/omer/${this.getDate().getFullYear()}/${this.omer}`;
  }
}
