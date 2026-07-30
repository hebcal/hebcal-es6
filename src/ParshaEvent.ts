import {Event, flags} from './event.js';
import {HDate, isoDateString} from '@hebcal/hdate';
import {renderParshaName} from './parshaName.js';
import {urlFriendly} from './string.js';
import {SedraResult} from './sedra.js';
import './locale.js'; // Adds Hebrew and Ashkenazic translations

/**
 * Represents one of 54 weekly Torah portions, always on a Saturday.
 *
 * `ParshaEvent` is for regular Parashat HaShavua readings. For Shabbatot
 * with holiday readings such as Shabbat Chol ha-Moed, use
 * `getHolidaysOnDate()` from `@hebcal/core`, or `getLeyningOnDate()` from
 * `@hebcal/leyning` when the display title and exact Torah readings are needed.
 */
export class ParshaEvent extends Event {
  /** The parsha name(s) and date this event was constructed from */
  readonly p: SedraResult;
  /**
   * Normally created by {@link calendar} (via `options.sedrot`)
   * rather than directly.
   * @param parsha result from {@link Sedra.lookup}
   * @throws {TypeError} if called with anything other than exactly one argument
   * @throws {TypeError} if `parsha` is not a valid {@link SedraResult} — it must
   *   have an `HDate` and one or two parsha names
   */
  constructor(parsha: SedraResult) {
    // eslint-disable-next-line prefer-rest-params
    if (arguments.length !== 1) {
      throw new TypeError(
        `ParshaEvent constructor takes a single SedraResult argument; ` +
          `got ${arguments.length} arguments`
      );
    }
    if (
      typeof parsha !== 'object' ||
      parsha === null ||
      !Array.isArray(parsha.parsha) ||
      parsha.parsha.length === 0 ||
      parsha.parsha.length > 2 ||
      !HDate.isHDate(parsha.hdate)
    ) {
      throw new TypeError(
        `Invalid SedraResult argument: ${JSON.stringify(parsha)}`
      );
    }
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
    if (year < 100 || year > 2999) {
      return undefined;
    }
    const dt = this.urlDateSuffix();
    const url =
      'https://www.hebcal.com/sedrot/' + urlFriendly(this.basename()) + '-' + dt;
    return this.p.il ? url + '?i=on' : url;
  }

  /**
   * The date portion of {@link url}, as `YYYYMMDD` — a parsha name recurs every
   * year, so the full date is needed to identify the reading.
   */
  urlDateSuffix(): string {
    const isoDate = isoDateString(this.greg());
    return isoDate.replaceAll('-', '');
  }

  /** convenience function for compatibility with previous implementation */
  get parsha(): string[] {
    return this.p.parsha;
  }
}
