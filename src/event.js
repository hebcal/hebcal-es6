import {HDate} from './hdate.js';
import {Locale} from './locale.js';

/**
 * Holiday flags for Event
 * @readonly
 * @enum {number}
 */
export const flags = {
  /** Chag, yontiff, yom tov */
  CHAG: 0x000001,
  /** Light candles 18 minutes before sundown */
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
};

const flagToCategory = [
  [flags.MAJOR_FAST, 'holiday', 'major', 'fast'],
  [flags.CHANUKAH_CANDLES, 'holiday', 'major'],
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
];

/** Represents an Event with a title, date, and flags */
export class Event {
  /**
   * Constructs Event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} desc Description (not translated)
   * @param {number} [mask=0] optional bitmask of holiday flags (see {@link flags})
   * @param {Object} [attrs={}] optional additional attributes (e.g. `eventTimeStr`, `cholHaMoedDay`)
   */
  constructor(date, desc, mask, attrs) {
    if (!HDate.isHDate(date)) {
      throw new TypeError(`Invalid Event date: ${date}`);
    } else if (typeof desc !== 'string') {
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
   * @return {HDate}
   */
  getDate() {
    return this.date;
  }
  /**
   * Untranslated description of this event
   * @return {string}
   */
  getDesc() {
    return this.desc;
  }
  /**
   * Bitmask of optional event flags. See {@link flags}
   * @return {number}
   */
  getFlags() {
    return this.mask;
  }
  /**
   * Returns (translated) description of this event
   * @example
   * const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
   * ev.render('en'); // 'Shavuot'
   * ev.render('he'); // 'שָׁבוּעוֹת'
   * ev.render('ashkenazi'); // 'Shavuos'
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext(this.desc, locale);
  }
  /**
   * Returns a brief (translated) description of this event.
   * For most events, this is the same as render(). For some events, it procudes
   * a shorter text (e.g. without a time or added description).
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return this.render(locale);
  }
  /**
   * Optional holiday-specific Emoji or `null`.
   * @return {string}
   */
  getEmoji() {
    return this.emoji || null;
  }
  /**
   * Returns a simplified (untranslated) description for this event. For example,
   * the {@link HolidayEvent} class supports
   * "Erev Pesach" => "Pesach", and "Sukkot III (CH''M)" => "Sukkot".
   * For many holidays the basename and the event description are the same.
   * @return {string}
   */
  basename() {
    return this.getDesc();
  }
  /**
   * Returns a URL to hebcal.com or sefaria.org for more detail on the event.
   * Returns `undefined` for events with no detail page.
   * @return {string}
   */
  url() {
    return undefined;
  }
  /**
   * Is this event observed in Israel?
   * @example
   * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
   * ev1.observedInIsrael(); // false
   * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
   * ev2.observedInIsrael(); // true
   * @return {boolean}
   */
  observedInIsrael() {
    return !(this.mask & flags.CHUL_ONLY);
  }
  /**
   * Is this event observed in the Diaspora?
   * @example
   * const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
   * ev1.observedInDiaspora(); // true
   * const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
   * ev2.observedInDiaspora(); // true
   * @return {boolean}
   */
  observedInDiaspora() {
    return !(this.mask & flags.IL_ONLY);
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
   * @param {boolean} il
   * @return {boolean}
   */
  observedIn(il) {
    return il ? this.observedInIsrael() : this.observedInDiaspora();
  }
  /**
   * Makes a clone of this Event object
   * @return {Event}
   */
  clone() {
    const ev = new this.constructor(this.date, this.desc, this.mask);
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        ev[property] = this[property];
      }
    }
    return ev;
  }
  /**
   * Returns a list of event categories
   * @return {string[]}
   */
  getCategories() {
    const mask = this.getFlags();
    for (const attrs of flagToCategory) {
      if (mask & attrs[0]) {
        return attrs.slice(1);
      }
    }
    return ['unknown'];
  }
}
