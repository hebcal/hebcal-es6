import {Locale} from './locale';

const CHAG = 0x000001;
const LIGHT_CANDLES = 0x000002;
const YOM_TOV_ENDS = 0x000004;
const CHUL_ONLY = 0x000008; // chutz l'aretz (Diaspora)
const IL_ONLY = 0x000010; // b'aretz (Israel)
const LIGHT_CANDLES_TZEIS = 0x000020;
const CHANUKAH_CANDLES = 0x000040;
const ROSH_CHODESH = 0x000080;
const MINOR_FAST = 0x000100;
const SPECIAL_SHABBAT = 0x000200;
const PARSHA_HASHAVUA = 0x000400;
const DAF_YOMI = 0x000800;
const OMER_COUNT = 0x001000;
const MODERN_HOLIDAY = 0x002000;
const MAJOR_FAST = 0x004000;
const SHABBAT_MEVARCHIM = 0x008000;
const MOLAD = 0x010000;
const USER_EVENT = 0x020000;
const HEBREW_DATE = 0x040000;
const MINOR_HOLIDAY = 0x080000;
const EREV = 0x100000;
const CHOL_HAMOED = 0x200000;
const MISHNA_YOMI = 0x400000;

/**
 * Holiday flags for Event
 * @readonly
 * @enum {number}
 */
export const flags = {
  /** Chag, yontiff, yom tov */
  CHAG,
  /** Light candles 18 minutes before sundown */
  LIGHT_CANDLES,
  /** End of holiday (end of Yom Tov)  */
  YOM_TOV_ENDS,
  /** Observed only in the Diaspora (chutz l'aretz)  */
  CHUL_ONLY,
  /** Observed only in Israel */
  IL_ONLY,
  /** Light candles in the evening at Tzeit time (3 small stars) */
  LIGHT_CANDLES_TZEIS,
  /** Candle-lighting for Chanukah */
  CHANUKAH_CANDLES,
  /** Rosh Chodesh, beginning of a new Hebrew month */
  ROSH_CHODESH,
  /** Minor fasts like Tzom Tammuz, Ta'anit Esther, ... */
  MINOR_FAST,
  /** Shabbat Shekalim, Zachor, ... */
  SPECIAL_SHABBAT,
  /** Weekly sedrot on Saturdays */
  PARSHA_HASHAVUA,
  /** Daily page of Talmud */
  DAF_YOMI,
  /** Days of the Omer */
  OMER_COUNT,
  /** Yom HaShoah, Yom HaAtzma'ut, ... */
  MODERN_HOLIDAY,
  /** Yom Kippur and Tish'a B'Av */
  MAJOR_FAST,
  /** On the Saturday before Rosh Chodesh */
  SHABBAT_MEVARCHIM,
  /** Molad */
  MOLAD,
  /** Yahrzeit or Hebrew Anniversary */
  USER_EVENT,
  /** Daily Hebrew date ("11th of Sivan, 5780") */
  HEBREW_DATE,
  /** A holiday that's not major, modern, rosh chodesh, or a fast day */
  MINOR_HOLIDAY,
  /** Evening before a major or minor holiday */
  EREV,
  /** Chol haMoed, intermediate days of Pesach or Sukkot */
  CHOL_HAMOED,
  /** Mishna Yomi */
  MISHNA_YOMI,
};

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
    this.date = date;
    this.desc = desc;
    this.mask = +mask;
    if (typeof attrs === 'object' && attrs !== null) {
      Object.keys(attrs).forEach((k) => this[k] = attrs[k]);
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
   * ev.render(); // 'Shavuot'
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
    return !(this.mask & CHUL_ONLY);
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
    return !(this.mask & IL_ONLY);
  }
  /**
   * @deprecated
   * Optional additional event attributes (e.g. `eventTimeStr`, `cholHaMoedDay`)
   * @return {Object}
   */
  getAttrs() {
    return this;
  }
  /**
   * Makes a clone of this Event object
   * @return {Event}
   */
  clone() {
    const ev = new this.constructor();
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        ev[property] = this[property];
      }
    }
    return ev;
  }
}

export const KEYCAP_DIGITS = [
  '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣',
  '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣',
];
