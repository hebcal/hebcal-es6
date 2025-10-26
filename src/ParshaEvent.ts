import {Event, flags} from './event';
import {isoDateString} from '@hebcal/hdate';
import {renderParshaName} from './parshaName';
import {SedraResult} from './sedra';
import './locale'; // Adds Hebrew and Ashkenazic translations

/**
 * Represents one of 54 weekly Torah portions, always on a Saturday
 */
export class ParshaEvent extends Event {
  readonly p: SedraResult;
  constructor(parsha: SedraResult) {
    const desc = 'Parashat ' + parsha.parsha.join('-');
    super(parsha.hdate, desc, flags.PARSHA_HASHAVUA);
    this.p = parsha;
  }
  /**
   * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to empty locale.
   */
  render(locale?: string): string {
    return renderParshaName(this.p.parsha, locale);
  }

  basename(): string {
    return this.p.parsha.join('-');
  }

  url(): string | undefined {
    const year = this.greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const dt = this.urlDateSuffix();
    const url =
      'https://www.hebcal.com/sedrot/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') +
      '-' +
      dt;
    return this.p.il ? url + '?i=on' : url;
  }

  urlDateSuffix(): string {
    const isoDate = isoDateString(this.greg());
    return isoDate.replace(/-/g, '');
  }

  /** convenience function for compatibility with previous implementation */
  get parsha(): string[] {
    return this.p.parsha;
  }
}
