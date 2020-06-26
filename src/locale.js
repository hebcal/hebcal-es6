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
 * Returns translation only if `locale` offers a translation for `id`.
 * Otherwise, returns undefined.
 * @param {string} id Message ID to translate
 * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
 * @return {string}
 */
export function lookupTranslation(id, locale) {
  const loc = typeof locale == 'string' && locales.has(locale) ? locales.get(locale) : activeLocale;
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
export function gettext(id, locale) {
  const text = lookupTranslation(id, locale);
  if (typeof text == 'undefined') {
    return id;
  }
  return text;
}

/**
 * Register locale translations.
 * @param {string} locale Locale name (i.e.: `'he'`, `'fr'`)
 * @param {LocaleDate} data parsed data from a `.po` file.
 */
export function addLocale(locale, data) {
  if (typeof data.contexts !== 'object' || typeof data.contexts[''] !== 'object') {
    throw new Error(`Locale '${locale}' invalid compact format`);
  }
  locales.set(locale.toLowerCase(), data.contexts['']);
}

/**
 * Alias for addLocale()
 * @param {string} locale
 * @param {any} data
 */
export function registerLocale(locale, data) {
  addLocale(locale, data);
}

/**
 * Activates a locale. Throws an error if the locale has not been previously added.
 * After setting the locale to be used, all strings marked for translations
 * will be represented by the corresponding translation in the specified locale.
 * @param {string} locale Locale name (i.e: `'he'`, `'fr'`)
 * @return {LocaleData}
 */
export function useLocale(locale) {
  const locale0 = locale.toLowerCase();
  const obj = locales.get(locale0);
  if (!obj) {
    throw new Error(`Locale '${locale}' not found`);
  }
  activeName = alias[locale0] || locale0;
  activeLocale = obj;
  return activeLocale;
}

/**
 * @param {number} n
 * @return {string}
 */
function getEnOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * @param {number} n
 * @return {string}
 */
export function ordinal(n) {
  if (!activeName || activeName == 'en' || activeName.startsWith('ashkenazi')) {
    return getEnOrdinal(n);
  } else if (activeName == 'fr') {
    return n == 1 ? (n + 'er') : (n + 'ème');
  } else {
    return n + '.';
  }
}

/**
 * Removes nekudot from Hebrew string
 * @param {string} str
 * @return {string}
 */
export function hebrewStripNikkud(str) {
  return str.replace(/[\u0590-\u05bd]/g, '').replace(/[\u05bf-\u05c7]/g, '');
}

addLocale('he', poHe);
addLocale('h', poHe);
addLocale('ashkenazi', poAshkenazi);
addLocale('a', poAshkenazi);
addLocale('', noopLocale);
addLocale('s', noopLocale);
addLocale('en', noopLocale);
useLocale('');
