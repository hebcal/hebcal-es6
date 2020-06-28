import poHe from './he.po.json';
import poAshkenazi from './ashkenazi.po.json';

const locales = new Map();
const noopLocale = {
  headers: {'plural-forms': 'nplurals=2; plural=(n!=1);'},
  contexts: {'': {}},
};
let activeLocale = null;
let activeName = null;
const alias = {
  'h': 'he',
  'a': 'ashkenazi',
  's': 'en',
  '': 'en',
};

/**
 * A locale in Hebcal is used for translations/transliterations of
 * holidays. @hebcal/core supports three locales by default
 * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
 * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
 * * `he` - Hebrew (e.g. "שַׁבָּת")
 * @namespace
 */
export const locale = {
  /**
   * Returns translation only if `locale` offers a non-empty translation for `id`.
   * Otherwise, returns `undefined`.
   * @param {string} id Message ID to translate
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  lookupTranslation: function(id, locale) {
    const loc = typeof locale == 'string' && locales.has(locale) ? locales.get(locale) : activeLocale;
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
    locales.set(locale.toLowerCase(), data.contexts['']);
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
    const obj = locales.get(locale0);
    if (!obj) {
      throw new Error(`Locale '${locale}' not found`);
    }
    activeName = alias[locale0] || locale0;
    activeLocale = obj;
    return activeLocale;
  },

  /**
   * Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')
   * @return {string}
   */
  getLocaleName: function() {
    return activeName;
  },

  /**
   * @param {number} n
   * @return {string}
   */
  ordinal: function(n) {
    if (!activeName || activeName == 'en' || activeName.startsWith('ashkenazi')) {
      return getEnOrdinal(n);
    } else if (activeName == 'fr') {
      return n == 1 ? (n + 'er') : (n + 'ème');
    } else {
      return n + '.';
    }
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

// eslint-disable-next-line require-jsdoc
function getEnOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

locale.addLocale('he', poHe);
locale.addLocale('h', poHe);
locale.addLocale('ashkenazi', poAshkenazi);
locale.addLocale('a', poAshkenazi);
locale.addLocale('en', noopLocale);
locale.addLocale('s', noopLocale);
locale.addLocale('', noopLocale);
locale.useLocale('en');
