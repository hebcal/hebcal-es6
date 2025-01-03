import {Event, flags} from './event';
import {HDate, isoDateString} from '@hebcal/hdate';
import {renderParshaName} from './parshaName';
import './locale'; // Adds Hebrew and Ashkenazic translations

/**
 * Represents one of 54 weekly Torah portions, always on a Saturday
 */
export class ParshaEvent extends Event {
  readonly parsha: string[];
  readonly il: boolean;
  readonly num: number | number[];
  /**
   * @param parsha - untranslated name of single or double parsha,
   *   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim']
   */
  constructor(
    date: HDate,
    parsha: string[],
    il = false,
    num: number | number[] = -1
  ) {
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
   * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   */
  render(locale?: string): string {
    return renderParshaName(this.parsha, locale);
  }

  basename(): string {
    return this.parsha.join('-');
  }

  url(): string | undefined {
    const year = this.getDate().greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const dt = this.urlDateSuffix();
    const url =
      'https://www.hebcal.com/sedrot/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') +
      '-' +
      dt;
    return this.il ? url + '?i=on' : url;
  }

  urlDateSuffix(): string {
    const isoDate = isoDateString(this.getDate().greg());
    return isoDate.replace(/-/g, '');
  }
}
