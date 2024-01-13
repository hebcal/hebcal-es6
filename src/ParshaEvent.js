import {Event, flags} from './event.js';
import {Locale} from './locale.js';

/**
 * Represents one of 54 weekly Torah portions, always on a Saturday
 */
export class ParshaEvent extends Event {
  /**
   * @param {HDate} date
   * @param {string[]} parsha - untranslated name of single or double parsha,
   *   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim']
   * @param {boolean} il
   * @param {number|number[]} num
   */
  constructor(date, parsha, il, num) {
    if (!Array.isArray(parsha) || parsha.length === 0 || parsha.length > 2) {
      throw new TypeError('Bad parsha argument');
    }
    const desc = 'Parashat ' + parsha.join('-');
    super(date, desc, flags.PARSHA_HASHAVUA);
    this.parsha = parsha;
    this.il = Boolean(il);
    this.num = num || -1;
  }
  /**
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || Locale.getLocaleName();
    const parsha = this.parsha;
    let name = Locale.gettext(parsha[0], locale);
    if (parsha.length == 2) {
      const hyphen = locale0 == 'he' ? '־' : '-';
      name += hyphen + Locale.gettext(parsha[1], locale);
    }
    name = name.replace(/'/g, '’');
    const str = Locale.gettext('Parashat', locale) + ' ' + name;
    return str.normalize();
  }
  /** @return {string} */
  basename() {
    return this.parsha.join('-');
  }
  /** @return {string} */
  url() {
    const year = this.getDate().greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const dt = this.urlDateSuffix();
    const url = 'https://www.hebcal.com/sedrot/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') + '-' + dt;
    return this.il ? url + '?i=on' : url;
  }

  /** @return {string} */
  urlDateSuffix() {
    const isoDateTime = this.getDate().greg().toISOString();
    const isoDate = isoDateTime.substring(0, isoDateTime.indexOf('T'));
    return isoDate.replace(/-/g, '');
  }
}
