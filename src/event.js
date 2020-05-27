import { gettext } from 'ttag';

const CHAG                = 1;
const LIGHT_CANDLES       = 2;
const YOM_TOV_ENDS        = 4;
const CHUL_ONLY           = 8;  // chutz l'aretz (Diaspora)
const IL_ONLY             = 16;   // b'aretz (Israel)
const LIGHT_CANDLES_TZEIS = 32;
const CHANUKAH_CANDLES    = 64;
const ROSH_CHODESH        = 128;
const MINOR_FAST          = 256;
const SPECIAL_SHABBAT     = 512;
const PARSHA_HASHAVUA     = 1024;
const DAF_YOMI            = 2048;
const OMER_COUNT          = 4096;
const MODERN_HOLIDAY      = 8192;
const MAJOR_FAST          = 16384;
const SHABBAT_MEVARCHIM   = 32768;
const MOLAD               = 65536;
const USER_EVENT          = 131072;

/**
 * Holiday flags
 * @readonly
 */
export const flags = {
  CHAG,
  LIGHT_CANDLES,
  YOM_TOV_ENDS,
  CHUL_ONLY,
  IL_ONLY,
  LIGHT_CANDLES_TZEIS,
  CHANUKAH_CANDLES,
  ROSH_CHODESH,
  MINOR_FAST,
  SPECIAL_SHABBAT,
  PARSHA_HASHAVUA,
  DAF_YOMI,
  OMER_COUNT,
  MODERN_HOLIDAY,
  MAJOR_FAST,
  SHABBAT_MEVARCHIM,
  MOLAD,
  USER_EVENT,
};

export class Event {
  /**
   * Constructs Event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} desc Description (not translated)
   * @param {number} [mask=0] optional holiday flags
   * @param {*} [attrs]
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
   * @returns {number}
   */
  getFlags() {
    return this.mask;
  }
  getAttrs() {
    return this.attrs;
  }
  /**
   * Is this event observed in Israel?
   * @returns {boolean}
   */
  observedInIsrael() {
    return !(this.mask & CHUL_ONLY);
  }
  /**
   * Is this event observed in the Diaspora?
   * @returns {boolean}
   */
  observedInDiaspora() {
    return !(this.mask & IL_ONLY);
  }
  /**
   * Returns (translated) description of this event
   * @returns {string}
   */
  render() {
    return gettext(this.desc);
  }
  /**
   * Returns untranslated description of this event
   * @returns {string}
   */
  getDesc() {
    return this.desc;
  }
  /**
   * Returns Hebrew date of this event
   * @returns {HDate}
   */
  getDate() {
    return this.date;
  }
}
