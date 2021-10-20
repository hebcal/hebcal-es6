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

/**
 * A locale in Hebcal is used for translations/transliterations of
 * holidays. `@hebcal/core` supports three locales by default
 * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
 * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
 * * `he` - Hebrew (e.g. "שַׁבָּת")
 * @namespace
 */
export const Locale = {
  /** @private */
  locales: Object.create(null),
  /** @private */
  activeLocale: null,
  /** @private */
  activeName: null,

  /**
   * Returns translation only if `locale` offers a non-empty translation for `id`.
   * Otherwise, returns `undefined`.
   * @param {string} id Message ID to translate
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  lookupTranslation: function(id, locale) {
    const loc = (typeof locale == 'string' && this.locales[locale]) || this.activeLocale;
    const array = loc[id];
    if (array && array.length && array[0].length) {
      return array[0];
    }
    return undefined;
  },

  /**
   * By default, if no translation was found, returns `id`.
   * @param {string} id Message ID to translate
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  gettext: function(id, locale) {
    const text = this.lookupTranslation(id, locale);
    if (typeof text == 'undefined') {
      return id;
    }
    return text;
  },

  /**
   * Register locale translations.
   * @param {string} locale Locale name (i.e.: `'he'`, `'fr'`)
   * @param {LocaleDate} data parsed data from a `.po` file.
   */
  addLocale: function(locale, data) {
    if (typeof data.contexts !== 'object' || typeof data.contexts[''] !== 'object') {
      throw new Error(`Locale '${locale}' invalid compact format`);
    }
    this.locales[locale.toLowerCase()] = data.contexts[''];
  },

  /**
   * Activates a locale. Throws an error if the locale has not been previously added.
   * After setting the locale to be used, all strings marked for translations
   * will be represented by the corresponding translation in the specified locale.
   * @param {string} locale Locale name (i.e: `'he'`, `'fr'`)
   * @return {LocaleData}
   */
  useLocale: function(locale) {
    const locale0 = locale.toLowerCase();
    const obj = this.locales[locale0];
    if (!obj) {
      throw new Error(`Locale '${locale}' not found`);
    }
    this.activeName = alias[locale0] || locale0;
    this.activeLocale = obj;
    return this.activeLocale;
  },

  /**
   * Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')
   * @return {string}
   */
  getLocaleName: function() {
    return this.activeName;
  },

  /**
   * @param {number} n
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  ordinal: function(n, locale) {
    const locale0 = locale || this.activeName;
    if (!locale0 || locale0 === 'en' || locale0 === 's' || 'ashkenazi' === locale0.substring(0, 9)) {
      return this.getEnOrdinal(n);
    } else if (locale0 == 'es') {
      return n + 'º';
    } else if (locale0 == 'he') {
      return String(n);
    } else {
      return n + '.';
    }
  },

  /**
   * @private
   * @param {number} n
   * @return {string}
   */
  getEnOrdinal: function(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },

  /**
   * Removes nekudot from Hebrew string
   * @param {string} str
   * @return {string}
   */
  hebrewStripNikkud: function(str) {
    return str.replace(/[\u0590-\u05bd]/g, '').replace(/[\u05bf-\u05c7]/g, '');
  },
};

Locale.addLocale('en', noopLocale);
Locale.addLocale('s', noopLocale);
Locale.addLocale('', noopLocale);
Locale.useLocale('en');
