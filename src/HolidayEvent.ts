import {HDate, Locale, isoDateString} from '@hebcal/hdate';
import {Event, flags} from './event';
import {holidayDesc as hdesc} from './staticHolidays';
import './locale'; // Adds Hebrew and Ashkenazic translations

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
export class HolidayEvent extends Event {
  /** During Sukkot or Pesach */
  cholHaMoedDay?: number;
  /**
   * `true` if the fast day was postponed a day to avoid Shabbat.
   * - Tish'a B'Av postponed from the 9th to the 10th
   * - Tzom Tammuz postponed from the 17th to the 18th
   */
  observed?: boolean;

  basename(): string {
    return this.getDesc()
      .replace(/ \d{4}$/, '')
      .replace(/ \(CH''M\)$/, '')
      .replace(/ \(observed\)$/, '')
      .replace(/ \(Hoshana Raba\)$/, '')
      .replace(/ [IV]+$/, '')
      .replace(/: \d Candles?$/, '')
      .replace(/: 8th Day$/, '')
      .replace(/^Erev /, '');
  }

  url(): string | undefined {
    const year = this.greg().getFullYear();
    if (year < 100 || year > 3200) {
      return undefined;
    }
    const url =
      'https://www.hebcal.com/holidays/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') +
      '-' +
      this.urlDateSuffix();
    return this.getFlags() & flags.IL_ONLY ? url + '?i=on' : url;
  }

  urlDateSuffix(): string {
    const year = this.greg().getFullYear();
    return String(year);
  }

  getEmoji(): string {
    if (this.emoji) {
      return this.emoji;
    } else if (this.getFlags() & flags.SPECIAL_SHABBAT) {
      return '🕍';
    } else {
      return '✡️';
    }
  }

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
    switch (desc) {
      case hdesc.LAG_BAOMER:
      case hdesc.LEIL_SELICHOT:
      case hdesc.PESACH_SHENI:
      case hdesc.EREV_PURIM:
      case hdesc.PURIM_KATAN:
      case hdesc.SHUSHAN_PURIM:
      case hdesc.TU_BAV:
      case hdesc.TU_BISHVAT:
      case hdesc.ROSH_HASHANA_LABEHEMOT:
        return ['holiday', 'minor'];
    }

    return ['holiday', 'major'];
  }
  /**
   * Returns (translated) description of this event
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    const str = super.render(locale);
    return str.replace(/'/g, '’');
  }
  /**
   * Returns a brief (translated) description of this event.
   * For most events, this is the same as render(). For some events, it procudes
   * a shorter text (e.g. without a time or added description).
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  renderBrief(locale?: string): string {
    const str = super.renderBrief(locale);
    return str.replace(/'/g, '’');
  }
}

/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to generate the correct URL.
 */
export class AsaraBTevetEvent extends HolidayEvent {
  urlDateSuffix(): string {
    const isoDate = isoDateString(this.greg());
    return isoDate.replace(/-/g, '');
  }
}

const chanukahEmoji = '🕎';
const KEYCAP_DIGITS = [
  '0️⃣',
  '1️⃣',
  '2️⃣',
  '3️⃣',
  '4️⃣',
  '5️⃣',
  '6️⃣',
  '7️⃣',
  '8️⃣',
  '9️⃣',
] as const;

/**
 * Because Chanukah sometimes starts in December and ends in January,
 * we subclass HolidayEvent to generate the correct URL.
 */
export class ChanukahEvent extends HolidayEvent {
  readonly chanukahDay?: number;
  /**
   * @param chanukahDay should be undefined for 1st night of Chanukah
   */
  constructor(date: HDate, desc: string, mask: number, chanukahDay?: number) {
    super(date, desc, mask);
    this.chanukahDay = chanukahDay;
    this.emoji = chanukahEmoji;
    if (chanukahDay !== 8) {
      const candles = chanukahDay ? chanukahDay + 1 : 1;
      this.emoji += KEYCAP_DIGITS[candles];
    }
  }
  urlDateSuffix(): string {
    const dt = this.greg();
    let year = dt.getFullYear();
    if (dt.getMonth() === 0) {
      year--;
    }
    return String(year);
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
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    return Locale.gettext('Rosh Hashana', locale) + ' ' + this.hyear;
  }

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
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    const monthName = this.getDesc().substring(roshChodeshStr.length + 1);
    const monthName0 = Locale.gettext(monthName, locale);
    const monthName1 = monthName0.replace(/'/g, '’');
    return Locale.gettext(roshChodeshStr, locale) + ' ' + monthName1;
  }

  basename(): string {
    return this.getDesc();
  }

  getEmoji(): string {
    return this.emoji || '🌒';
  }
}
