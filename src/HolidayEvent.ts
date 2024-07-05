import {HDate, Locale, isoDateString} from '@hebcal/hdate';
import {Event, flags} from './event';
import {TimedEvent} from './TimedEvent';
import {holidayDesc as hdesc} from './staticHolidays';
import './locale'; // Adds Hebrew and Ashkenazic translations

const minorHolidays = [
  hdesc.LAG_BAOMER,
  hdesc.LEIL_SELICHOT,
  hdesc.PESACH_SHENI,
  hdesc.EREV_PURIM,
  hdesc.PURIM_KATAN,
  hdesc.SHUSHAN_PURIM,
  hdesc.TU_BAV,
  hdesc.TU_BISHVAT,
  hdesc.ROSH_HASHANA_LABEHEMOT,
];

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
export class HolidayEvent extends Event {
  /** During Sukkot or Pesach */
  cholHaMoedDay?: number;
  chanukahDay?: number;
  /**
   * `true` if the fast day was postponed a day to avoid Shabbat.
   * - Tish'a B'Av postponed from the 9th to the 10th
   * - Tzom Tammuz postponed from the 17th to the 18th
   */
  observed?: boolean;
  /** For a Fast day, this will be a "Fast begins" event */
  startEvent?: TimedEvent;
  /** For a Fast day, this will be a "Fast ends" event */
  endEvent?: TimedEvent;
  /** @returns */
  basename(): string {
    return this.getDesc().replace(/ \d{4}$/, '')
        .replace(/ \(CH''M\)$/, '')
        .replace(/ \(observed\)$/, '')
        .replace(/ \(Hoshana Raba\)$/, '')
        .replace(/ [IV]+$/, '')
        .replace(/: \d Candles?$/, '')
        .replace(/: 8th Day$/, '')
        .replace(/^Erev /, '');
  }
  /** @returns */
  url(): string | undefined {
    const year = this.getDate().greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const url = 'https://www.hebcal.com/holidays/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') + '-' +
      this.urlDateSuffix();
    return (this.getFlags() & flags.IL_ONLY) ? url + '?i=on' : url;
  }
  /** @returns */
  urlDateSuffix(): string {
    const year = this.getDate().greg().getFullYear();
    return String(year);
  }
  /** @returns */
  getEmoji(): string {
    if (this.emoji) {
      return this.emoji;
    } else if (this.getFlags() & flags.SPECIAL_SHABBAT) {
      return '🕍';
    } else {
      return '✡️';
    }
  }
  /** @returns */
  getCategories(): string[] {
    if (this.cholHaMoedDay) {
      return ['holiday', 'major', 'cholhamoed'];
    }
    const cats = super.getCategories();
    if (cats[0] !== 'unknown') {
      return cats;
    }
    // Don't depend on flags.MINOR_HOLIDAY always being set. Look for minor holidays.
    const desc = this.getDesc();

    if (minorHolidays.includes(desc)) {
      return ['holiday', 'minor'];
    }

    return ['holiday', 'major'];
  }
  /**
   * Returns (translated) description of this event
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const str = super.render(locale);
    return str.replace(/'/g, '’');
  }
  /**
   * Returns a brief (translated) description of this event.
   * For most events, this is the same as render(). For some events, it procudes
   * a shorter text (e.g. without a time or added description).
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    const str = super.renderBrief(locale);
    return str.replace(/'/g, '’');
  }
  /**
   * Makes a clone of this Event object
   */
  clone(): HolidayEvent {
    const ev = new HolidayEvent(this.date, this.desc, this.mask);
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        Object.defineProperty(ev, property, {value: this[property]});
      }
    }
    return ev;
  }
}

/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to override the `url()` method.
 */
export class AsaraBTevetEvent extends HolidayEvent {
  /** @returns */
  urlDateSuffix(): string {
    const isoDate = isoDateString(this.getDate().greg());
    return isoDate.replace(/-/g, '');
  }
}

/** Represents Rosh Hashana, the Jewish New Year */
export class RoshHashanaEvent extends HolidayEvent {
  private readonly hyear: number;
  /**
   * @private
   * @param date Hebrew date event occurs
   * @param hyear Hebrew year
   * @param mask optional holiday flags
   */
  constructor(date: HDate, hyear: number, mask: number) {
    super(date, `Rosh Hashana ${hyear}`, mask);
    this.hyear = hyear;
  }
  /**
   * Returns (translated) description of this event
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    return Locale.gettext('Rosh Hashana', locale) + ' ' + this.hyear;
  }
  /** @returns */
  getEmoji(): string {
    return '🍏🍯';
  }
}

const roshChodeshStr = 'Rosh Chodesh';

/** Represents Rosh Chodesh, the beginning of a new month */
export class RoshChodeshEvent extends HolidayEvent {
  /**
   * Constructs Rosh Chodesh event
   * @param date Hebrew date event occurs
   * @param monthName Hebrew month name (not translated)
   */
  constructor(date: HDate, monthName: string) {
    super(date, `${roshChodeshStr} ${monthName}`, flags.ROSH_CHODESH);
  }
  /**
   * Returns (translated) description of this event
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    const monthName = this.getDesc().substring(roshChodeshStr.length + 1);
    const monthName0 = Locale.gettext(monthName, locale);
    const monthName1 = monthName0.replace(/'/g, '’');
    return Locale.gettext(roshChodeshStr, locale) + ' ' + monthName1;
  }
  /** @returns */
  basename(): string {
    return this.getDesc();
  }
  /** @returns */
  getEmoji(): string {
    return this.emoji || '🌒';
  }
}
