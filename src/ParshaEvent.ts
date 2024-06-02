import {Event, flags} from './event';
import {HDate, Locale, isoDateString} from '@hebcal/hdate';
import './locale'; // Adds Hebrew and Ashkenazic translations

/**
 * Represents one of 54 weekly Torah portions, always on a Saturday
 */
export class ParshaEvent extends Event {
  private readonly parsha: string[];
  private readonly il: boolean;
  private readonly num: number | number[];
  /**
   * @param {HDate} date
   * @param {string[]} parsha - untranslated name of single or double parsha,
   *   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim']
   * @param {boolean} [il]
   * @param {number|number[]} [num]
   */
  constructor(date: HDate, parsha: string[], il: boolean=false, num: number | number[]=-1) {
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
  render(locale?: string): string {
    const locale0 = locale ?? Locale.getLocaleName();
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
  basename(): string {
    return this.parsha.join('-');
  }
  /** @return {string | undefined} */
  url(): string | undefined {
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
  urlDateSuffix(): string {
    const isoDate = isoDateString(this.getDate().greg());
    return isoDate.replace(/-/g, '');
  }
}
