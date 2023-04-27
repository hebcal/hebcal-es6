const noopLocale = {
  headers: {'plural-forms': 'nplurals=2; plural=(n!=1);'},
  contexts: {'': {}},
};
const alias = {
  'h': 'he',
  'a': 'ashkenazi',
  's': 'en',
  '': 'en',
};

/** @private */
const locales = Object.create(null);
/** @private */
let activeLocale = null;
/** @private */
let activeName = null;

/**
 * A locale in Hebcal is used for translations/transliterations of
 * holidays. `@hebcal/core` supports four locales by default
 * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
 * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
 * * `he` - Hebrew (e.g. "שַׁבָּת")
 * * `he-x-NoNikud` - Hebrew without nikud (e.g. "שבת")
 */
export class Locale {
  /**
   * Returns translation only if `locale` offers a non-empty translation for `id`.
   * Otherwise, returns `undefined`.
   * @param {string} id Message ID to translate
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  static lookupTranslation(id, locale) {
    const locale0 = locale && locale.toLowerCase();
    const loc = (typeof locale == 'string' && locales[locale0]) || activeLocale;
    const array = loc[id];
    if (array && array.length && array[0].length) {
      return array[0];
    }
    return undefined;
  }

  /**
   * By default, if no translation was found, returns `id`.
   * @param {string} id Message ID to translate
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  static gettext(id, locale) {
    const text = this.lookupTranslation(id, locale);
    if (typeof text == 'undefined') {
      return id;
    }
    return text;
  }

  /**
   * Register locale translations.
   * @param {string} locale Locale name (i.e.: `'he'`, `'fr'`)
   * @param {LocaleData} data parsed data from a `.po` file.
   */
  static addLocale(locale, data) {
    if (typeof data.contexts !== 'object' || typeof data.contexts[''] !== 'object') {
      throw new TypeError(`Locale '${locale}' invalid compact format`);
    }
    locales[locale.toLowerCase()] = data.contexts[''];
  }

  /**
   * Activates a locale. Throws an error if the locale has not been previously added.
   * After setting the locale to be used, all strings marked for translations
   * will be represented by the corresponding translation in the specified locale.
   * @param {string} locale Locale name (i.e: `'he'`, `'fr'`)
   * @return {LocaleData}
   */
  static useLocale(locale) {
    const locale0 = locale.toLowerCase();
    const obj = locales[locale0];
    if (!obj) {
      throw new RangeError(`Locale '${locale}' not found`);
    }
    activeName = alias[locale0] || locale0;
    activeLocale = obj;
    return activeLocale;
  }

  /**
   * Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')
   * @return {string}
   */
  static getLocaleName() {
    return activeName;
  }

  /**
   * Returns the names of registered locales
   * @return {string[]}
   */
  static getLocaleNames() {
    return Object.keys(locales).sort();
  }

  /**
   * @param {number} n
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  static ordinal(n, locale) {
    const locale1 = locale && locale.toLowerCase();
    const locale0 = locale1 || activeName;
    if (!locale0) {
      return this.getEnOrdinal(n);
    }
    switch (locale0) {
      case 'en':
      case 's':
      case 'a':
      case 'ashkenazi':
      case 'ashkenazi_litvish':
      case 'ashkenazi_poylish':
      case 'ashkenazi_standard':
        return this.getEnOrdinal(n);
      case 'es':
        return n + 'º';
      case 'h':
      case 'he':
      case 'he-x-nonikud':
        return String(n);
      default:
        return n + '.';
    }
  }

  /**
   * @private
   * @param {number} n
   * @return {string}
   */
  static getEnOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /**
   * Removes nekudot from Hebrew string
   * @param {string} str
   * @return {string}
   */
  static hebrewStripNikkud(str) {
    return str.replace(/[\u0590-\u05bd]/g, '').replace(/[\u05bf-\u05c7]/g, '');
  }
}

Locale.addLocale('en', noopLocale);
Locale.addLocale('s', noopLocale);
Locale.addLocale('', noopLocale);
Locale.useLocale('en');
