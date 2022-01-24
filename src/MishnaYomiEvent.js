import {Event, flags} from './event';
import {Locale} from './locale';

/**
 * @private
 * @param {MishnaYomi[]} mishnaYomi
 * @param {string} locale
 * @return {string}
 */
function formatMyomi(mishnaYomi, locale) {
  const k1 = mishnaYomi[0].k;
  const cv1 = mishnaYomi[0].v;
  const mishna1 = Locale.gettext(k1, locale) + ' ' + cv1;
  const k2 = mishnaYomi[1].k;
  const cv2 = mishnaYomi[1].v;
  if (k1 !== k2) {
    return mishna1 + '-' + Locale.gettext(k2, locale) + ' ' + cv2;
  }
  const p1 = cv1.split(':');
  const p2 = cv2.split(':');
  if (p1[0] === p2[0]) {
    return mishna1 + '-' + p2[1];
  }
  return mishna1 + '-' + cv2;
}

/**
 * Event wrapper around a Mishna Yomi instance
 */
export class MishnaYomiEvent extends Event {
  /**
   * @param {HDate} date
   * @param {MishnaYomi[]} mishnaYomi
   */
  constructor(date, mishnaYomi) {
    super(date, formatMyomi(mishnaYomi, null), flags.MISHNA_YOMI, {mishnaYomi});
  }
  /**
   * Returns Mishna Yomi name (e.g. "Bava Metzia 10:5-6" or "Berakhot 9:5-Peah 1:1").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return formatMyomi(this.mishnaYomi, locale);
  }
  /**
   * Returns a link to sefaria.org
   * @return {string}
   */
  url() {
    const mishnaYomi = this.mishnaYomi;
    const k1 = mishnaYomi[0].k;
    const mishna = (k1 === 'Avot') ? 'Pirkei' : 'Mishnah';
    const name = k1.replace(/ /g, '_');
    const prefix = `https://www.sefaria.org/${mishna}_${name}`;
    const cv1 = mishnaYomi[0].v;
    if (k1 !== mishnaYomi[1].k) {
      const verse1 = cv1.replace(':', '.');
      return `${prefix}.${verse1}?lang=bi`;
    }
    const cv2 = mishnaYomi[1].v;
    const p1 = cv1.split(':');
    const p2 = cv2.split(':');
    const verse1 = p1.join('.');
    const verse2 = (p1[0] === p2[0]) ? p2[1] : p2.join('.');
    return `${prefix}.${verse1}-${verse2}?lang=bi`;
  }
}
