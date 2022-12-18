import {Event, flags} from './event';
import {Locale} from './locale';

/**
 * Event wrapper around a Nach Yomi instance
 */
export class NachYomiEvent extends Event {
  /**
   * @param {HDate} date
   * @param {NachYomi} nachYomi
   */
  constructor(date, nachYomi) {
    super(date, `${nachYomi.k} ${nachYomi.v}`, flags.MISHNA_YOMI);
    this.nachYomi = nachYomi;
  }
  /**
   * Returns name of tractate and page (e.g. "Beitzah 21").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const name = Locale.gettext(this.nachYomi.k, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' ' + gematriya(this.nachYomi.v);
    }
    return name + ' ' + this.nachYomi.v;
  }
  /**
   * Returns a link to sefaria.org
   * @return {string}
   */
  url() {
    const name = this.nachYomi.k.replace(/ /g, '_');
    const chapter = this.nachYomi.v;
    return `https://www.sefaria.org/${name}.${chapter}?lang=bi`;
  }
}
