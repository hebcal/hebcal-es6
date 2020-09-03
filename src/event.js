import {Locale} from './locale';

const CHAG = 1;
const LIGHT_CANDLES = 2;
const YOM_TOV_ENDS = 4;
const CHUL_ONLY = 8; // chutz l'aretz (Diaspora)
const IL_ONLY = 16; // b'aretz (Israel)
const LIGHT_CANDLES_TZEIS = 32;
const CHANUKAH_CANDLES = 64;
const ROSH_CHODESH = 128;
const MINOR_FAST = 256;
const SPECIAL_SHABBAT = 512;
const PARSHA_HASHAVUA = 1024;
const DAF_YOMI = 2048;
const OMER_COUNT = 4096;
const MODERN_HOLIDAY = 8192;
const MAJOR_FAST = 16384;
const SHABBAT_MEVARCHIM = 32768;
const MOLAD = 65536;
const USER_EVENT = 131072;
const HEBREW_DATE = 262144;

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
    if (typeof attrs === 'object') {
      Object.keys(attrs).forEach((k) => this[k] = attrs[k]);
    }
    this.date = date;
    this.desc = desc;
    this.mask = +mask;
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
}
