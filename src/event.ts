import {HDate, Locale} from '@hebcal/hdate';
import './locale.js'; // Adds Hebrew and Ashkenazic translations

/**
 * Holiday flags for Event. These flags are typically
 * combined using bitwise arithmetic to form a mask.
 */
export const flags = {
  /** Chag, yontiff, yom tov */
  CHAG: 0x000001,
  /** Light candles before sundown */
  LIGHT_CANDLES: 0x000002,
  /** End of holiday (end of Yom Tov)  */
  YOM_TOV_ENDS: 0x000004,
  /** Observed only in the Diaspora (chutz l'aretz)  */
  CHUL_ONLY: 0x000008,
  /** Observed only in Israel */
  IL_ONLY: 0x000010,
  /** Light candles in the evening at Tzeit time (3 small stars) */
  LIGHT_CANDLES_TZEIS: 0x000020,
  /** Candle-lighting for Chanukah */
  CHANUKAH_CANDLES: 0x000040,
  /** Rosh Chodesh, beginning of a new Hebrew month */
  ROSH_CHODESH: 0x000080,
  /** Minor fasts like Tzom Tammuz, Ta'anit Esther, ... */
  MINOR_FAST: 0x000100,
  /** Shabbat Shekalim, Zachor, ... */
  SPECIAL_SHABBAT: 0x000200,
  /** Weekly sedrot on Saturdays */
  PARSHA_HASHAVUA: 0x000400,
  /** Daily page of Talmud (Bavli) */
  DAF_YOMI: 0x000800,
  /** Days of the Omer */
  OMER_COUNT: 0x001000,
  /** Yom HaShoah, Yom HaAtzma'ut, ... */
  MODERN_HOLIDAY: 0x002000,
  /** Yom Kippur and Tish'a B'Av */
  MAJOR_FAST: 0x004000,
  /** On the Saturday before Rosh Chodesh */
  SHABBAT_MEVARCHIM: 0x008000,
  /** Molad */
  MOLAD: 0x010000,
  /** Yahrzeit or Hebrew Anniversary */
  USER_EVENT: 0x020000,
  /** Daily Hebrew date ("11th of Sivan, 5780") */
  HEBREW_DATE: 0x040000,
  /** A holiday that's not major, modern, rosh chodesh, or a fast day */
  MINOR_HOLIDAY: 0x080000,
  /** Evening before a major or minor holiday */
  EREV: 0x100000,
  /** Chol haMoed, intermediate days of Pesach or Sukkot */
  CHOL_HAMOED: 0x200000,
  /** Mishna Yomi */
  MISHNA_YOMI: 0x400000,
  /** Yom Kippur Katan, minor day of atonement on the day preceeding each Rosh Chodesh */
  YOM_KIPPUR_KATAN: 0x800000,
  /** Daily page of Jerusalem Talmud (Yerushalmi) */
  YERUSHALMI_YOMI: 0x1000000,
  /** Nach Yomi */
  NACH_YOMI: 0x2000000,
  /** Daily Learning */
  DAILY_LEARNING: 0x4000000,
  /** Yizkor */
  YIZKOR: 0x8000000,
  /** BeHaB fast days on Monday, Thursday and Monday after Pesach and Sukkot */
  BEHAB: 0x10000000,
  /** Latest time for Kiddush Levana (Sanctification of the Moon) */
  KIDDUSH_LEVANA: 0x20000000,
} as const;

/**
 * Name of one of the {@link flags}, such as `'CHAG'` or `'ROSH_CHODESH'`.
 * Used by {@link Event.hasFlag} and {@link Event.flagNames}.
 */
export type FlagName = keyof typeof flags;

const flagEntries = Object.entries(flags) as [FlagName, number][];

function flagBit(name: FlagName): number {
  if (!Object.hasOwn(flags, name)) {
    throw new RangeError(`Unknown flag name: ${String(name)}`);
  }
  return flags[name];
}

const flagToCategory = [
  [flags.MAJOR_FAST, 'holiday', 'major', 'fast'],
  [flags.CHANUKAH_CANDLES, 'holiday', 'minor'],
  [flags.HEBREW_DATE, 'hebdate'],
  [flags.MINOR_FAST, 'holiday', 'fast'],
  [flags.MINOR_HOLIDAY, 'holiday', 'minor'],
  [flags.MODERN_HOLIDAY, 'holiday', 'modern'],
  [flags.MOLAD, 'molad'],
  [flags.OMER_COUNT, 'omer'],
  [flags.PARSHA_HASHAVUA, 'parashat'], // backwards-compat
  [flags.ROSH_CHODESH, 'roshchodesh'],
  [flags.SHABBAT_MEVARCHIM, 'mevarchim'],
  [flags.SPECIAL_SHABBAT, 'holiday', 'shabbat'],
  [flags.USER_EVENT, 'user'],
  [flags.YIZKOR, 'yizkor'],
] as const;

/**
 * Represents an Event with a title, date, and flags.
 *
 * Events are used to represent holidays, candle-lighting times,
 * Torah readings, Omer days, Hebrew dates, and more. Most concrete event
 * types are subclasses (e.g. {@link HolidayEvent}, {@link TimedEvent},
 * {@link ParshaEvent}, {@link OmerEvent}) and are produced by
 * {@link calendar}.
 *
 * To get the title of the event in a language other than English with
 * Sephardic transliterations, use the {@link Event.render} method.
 *
 * @example
 * import {Event, HDate, flags} from '@hebcal/core';
 * const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
 * ev.getDate().toString(); // '6 Sivan 5749'
 * ev.getDesc();             // 'Shavuot'
 * ev.render('he');          // 'שָׁבוּעוֹת'
 */
export class Event {
  /** Hebrew date of this event */
  readonly date: HDate;
  /**
   * Untranslated title of this event. Note that these description
   * strings are always in English and will remain stable across releases.
   * To get the title of the event in another language, use the
   * `render()` method.
   */
  readonly desc: string;
  /** Bitmask of optional event flags. See {@link flags} */
  readonly mask: number;
  /** Optional emoji character such as ✡️, 🕯️, 🕎, 🕍, 🌒 */
  emoji?: string;
  /** Optional longer description or memo text */
  memo?: string;
  /** Alarms are used by iCalendar feeds */
  alarm?: Date | string | boolean;
  /**
   * Constructs Event
   * @param date Hebrew date event occurs
   * @param desc Description (not translated)
   * @param [mask=0] optional bitmask of holiday flags (see {@link flags})
   * @param [attrs={}] optional additional attributes (e.g. `eventTimeStr`, `cholHaMoedDay`)
   */
  constructor(date: HDate, desc: string, mask = 0, attrs?: object) {
    if (!HDate.isHDate(date)) {
      throw new TypeError(`Invalid Event date: ${date}`);
    }
    if (typeof desc !== 'string') {
      throw new TypeError(`Invalid Event description: ${desc}`);
    }
    this.date = date;
    this.desc = desc;
    this.mask = +mask;
    if (typeof attrs === 'object' && attrs !== null) {
      Object.assign(this, attrs);
    }
  }
  /**
   * Hebrew date of this event
   */
  getDate(): HDate {
    return this.date;
  }
  /**
   * Gregorian date of this event
   */
  greg(): Date {
    return this.date.greg();
  }
  /**
   * Untranslated title of this event. Note that these description
   * strings are always in English and will remain stable across releases.
   * To get the title of the event in another language, use the
   * `render()` method.
   */
  getDesc(): string {
    return this.desc;
  }
  /**
   * Bitmask of optional event flags. See {@link flags}
   * @deprecated Use {@link Event.hasFlag} to test for a flag, or
   * {@link Event.flagNames} to list them. Code that genuinely needs the
   * raw bitmask can read {@link Event.mask}.
   */
  getFlags(): number {
    return this.mask;
  }
  /**
   * Does this event have the given flag?
   *
   * A readable alternative to testing the bitmask with `&`.
   * @example
   * import {Event, HDate, flags} from '@hebcal/core';
   * const ev = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II',
   *   flags.CHAG | flags.CHUL_ONLY);
   * ev.hasFlag('CHAG');        // true
   * ev.hasFlag('CHUL_ONLY');   // true
   * ev.hasFlag('MINOR_FAST');  // false
   * @param name flag name, one of the keys of {@link flags}
   * @throws {RangeError} if `name` is not a key of {@link flags}
   */
  hasFlag(name: FlagName): boolean {
    return (this.mask & flagBit(name)) !== 0;
  }
  /**
   * Does this event have at least one of the given flags?
   *
   * Returns `false` when called with no arguments.
   * @example
   * import {Event, HDate, flags} from '@hebcal/core';
   * const ev = new Event(new HDate(10, 'Tishrei', 5784), 'Yom Kippur',
   *   flags.CHAG | flags.MAJOR_FAST);
   * ev.hasAnyFlag('MAJOR_FAST', 'MINOR_FAST');  // true
   * ev.hasAnyFlag('ROSH_CHODESH', 'MINOR_FAST'); // false
   * @param names flag names, each one of the keys of {@link flags}
   * @throws {RangeError} if any name is not a key of {@link flags}
   */
  hasAnyFlag(...names: FlagName[]): boolean {
    let bits = 0;
    for (const name of names) {
      bits |= flagBit(name);
    }
    return (this.mask & bits) !== 0;
  }
  /**
   * Names of all {@link flags} set on this event, in ascending bit order.
   * Returns an empty array for an event with no flags.
   * @example
   * import {Event, HDate, flags} from '@hebcal/core';
   * const ev = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II',
   *   flags.CHAG | flags.CHUL_ONLY);
   * ev.flagNames(); // ['CHAG', 'CHUL_ONLY']
   */
  flagNames(): FlagName[] {
    return flagEntries.filter(([, bit]) => this.mask & bit).map(([name]) => name);
  }
  /**
   * Returns (translated) description of this event
   * @example
   * const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
   * ev.render('en'); // 'Shavuot'
   * ev.render('he'); // 'שָׁבוּעוֹת'
   * ev.render('ashkenazi'); // 'Shavuos'
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    return Locale.gettext(this.desc, locale);
  }
  /**
   * Returns a brief (translated) description of this event.
   *
   * For most events this is the same as {@link render}. Some subclasses
   * (e.g. {@link CandleLightingEvent}, {@link HavdalahEvent},
   * {@link OmerEvent}) produce shorter text without an attached time or
   * extra qualifier — useful for compact UI display.
   * @example
   * import {CandleLightingEvent} from '@hebcal/core';
   * // For a regular Event, renderBrief() == render():
   * const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
   * ev.renderBrief('en'); // 'Shavuot'
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  renderBrief(locale?: string): string {
    return this.render(locale);
  }
  /**
   * Returns the event's emoji character (e.g. `🕯️`, `🕎`, `🇮🇱`, `🍏🍯`),
   * or `null` if no emoji is associated with this event.
   * Subclasses override this to provide holiday-specific emoji.
   */
  getEmoji(): string | null {
    return this.emoji || null;
  }
  /**
   * Returns a simplified (untranslated) description for this event, suitable
   * for grouping related events under a single name.
   *
   * For example, {@link HolidayEvent} strips qualifiers so that
   * `"Erev Pesach"` → `"Pesach"` and `"Sukkot III (CH''M)"` → `"Sukkot"`.
   * For many events the basename and the event description are identical.
   * @example
   * import {HolidayEvent, HDate, months, flags} from '@hebcal/core';
   * const ev = new HolidayEvent(
   *   new HDate(14, months.NISAN, 5784), 'Erev Pesach', flags.EREV);
   * ev.getDesc();    // 'Erev Pesach'
   * ev.basename();   // 'Pesach'
   */
  basename(): string {
    return this.getDesc();
  }
  /**
   * Returns a URL to hebcal.com or sefaria.org for more detail on the event,
   * or `undefined` for events with no detail page.
   *
   * Subclasses such as {@link HolidayEvent}, {@link ChanukahEvent},
   * {@link AsaraBTevetEvent}, {@link ParshaEvent}, and {@link OmerEvent}
   * override this with their own URL patterns.
   */
  url(): string | undefined {
    return undefined;
  }
  /**
   * Is this event observed in Israel?
   * @example
   * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
   * ev1.observedInIsrael(); // false
   * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
   * ev2.observedInIsrael(); // true
   */
  observedInIsrael(): boolean {
    return !this.hasFlag('CHUL_ONLY');
  }
  /**
   * Is this event observed in the Diaspora?
   * @example
   * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
   * ev1.observedInDiaspora(); // true
   * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
   * ev2.observedInDiaspora(); // true
   */
  observedInDiaspora(): boolean {
    return !this.hasFlag('IL_ONLY');
  }
  /**
   * Is this event observed in Israel/Diaspora?
   * @example
   * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
   * ev1.observedIn(false); // true
   * ev1.observedIn(true); // false
   * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
   * ev2.observedIn(false); // true
   * ev2.observedIn(true); // true
   * @param il
   */
  observedIn(il: boolean): boolean {
    return il ? this.observedInIsrael() : this.observedInDiaspora();
  }
  /**
   * Returns an array of category strings classifying this event, derived
   * from its {@link flags} bitmask. The first element is the broad category
   * (e.g. `'holiday'`, `'roshchodesh'`, `'parashat'`, `'omer'`), followed
   * by zero or more refinements (e.g. `'major'`, `'minor'`, `'fast'`).
   *
   * Returns `['unknown']` if no flag maps to a known category.
   * @example
   * import {Event, HDate, flags} from '@hebcal/core';
   * new Event(new HDate(10, 'Tishrei', 5784), 'Yom Kippur', flags.MAJOR_FAST)
   *   .getCategories(); // ['holiday', 'major', 'fast']
   * new Event(new HDate(1, 'Shvat', 5784), 'Rosh Chodesh Sh\'vat', flags.ROSH_CHODESH)
   *   .getCategories(); // ['roshchodesh']
   */
  getCategories(): string[] {
    for (const [bit, ...categories] of flagToCategory) {
      if (this.mask & bit) {
        return categories;
      }
    }
    return ['unknown'];
  }
}
