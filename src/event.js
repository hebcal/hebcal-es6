import {gettext} from 'ttag';
import numeral from 'numeral';

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
   * @param {number} [mask=0] optional holiday flags
   * @param {Object} [attrs={}]
   */
  constructor(date, desc, mask, attrs) {
    this.date = date;
    this.desc = desc;
    this.mask = +mask;
    if (attrs) {
      this.attrs = attrs;
    }
  }
  /**
   * @return {number}
   */
  getFlags() {
    return this.mask;
  }
  /**
   * @return {Object}
   */
  getAttrs() {
    return this.attrs || {};
  }
  /**
   * Is this event observed in Israel?
   * @return {boolean}
   */
  observedInIsrael() {
    return !(this.mask & CHUL_ONLY);
  }
  /**
   * Is this event observed in the Diaspora?
   * @return {boolean}
   */
  observedInDiaspora() {
    return !(this.mask & IL_ONLY);
  }
  /**
   * Returns (translated) description of this event
   * @return {string}
   */
  render() {
    return gettext(this.desc);
  }
  /**
   * Returns untranslated description of this event
   * @return {string}
   */
  getDesc() {
    return this.desc;
  }
  /**
   * Returns Hebrew date of this event
   * @return {HDate}
   */
  getDate() {
    return this.date;
  }
}

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} omerDay
   */
  constructor(date, omerDay) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT, {omer: omerDay});
  }
  /**
   * @todo use gettext()
   * @return {string}
   */
  render() {
    const nth = numeral(this.getAttrs().omer).format('ordinal');
    return `${nth} day of the Omer`;
  }
}

/**
 * For a Daf Yomi, the name is already translated
 * attrs.dafyomi.name contains the untranslated string
 */
export class DafYomiEvent extends Event {
  /**
   * @param {HDate} date
   * @param {string} desc
   * @param {Object} attrs
   */
  constructor(date, desc, attrs) {
    super(date, desc, flags.DAF_YOMI, attrs);
  }
  /** @return {string} */
  render() {
    return gettext('Daf Yomi') + ': ' + this.getDesc();
  }
}

/** Havdalah after Shabbat or holiday */
export class HavdalahEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Object} attrs
   * @param {number} [havdalahMins]
   */
  constructor(date, mask, attrs, havdalahMins) {
    super(date, 'Havdalah', mask, Object.assign({havdalahMins}, attrs));
  }
  /** @return {string} */
  render() {
    const attrs = this.getAttrs();
    let str = gettext(this.getDesc());
    if (attrs.havdalahMins) {
      const min = gettext('min');
      str += ` (${attrs.havdalahMins} ${min})`;
    }
    return str + ': ' + attrs.eventTimeStr;
  }
}

/** Candle lighting before Shabbat or holiday */
export class CandleLightingEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Object} attrs
   */
  constructor(date, mask, attrs) {
    super(date, 'Candle lighting', mask, attrs);
  }
  /** @return {string} */
  render() {
    return gettext(this.getDesc()) + ': ' + this.getAttrs().eventTimeStr;
  }
}

/** Daily Hebrew date ("11th of Sivan, 5780") */
export class HebrewDateEvent extends Event {
  /**
   * @param {HDate} date
   */
  constructor(date) {
    super(date, date.toString(), flags.HEBREW_DATE);
  }
  /** @return {string} */
  render() {
    return this.getDate().render();
  }
}
