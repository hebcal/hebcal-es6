import poHe from './he.po.json';
import poAshkenazi from './ashkenazi.po.json';

const locales = new Map();
const noopLocale = {
  headers: {'plural-forms': 'nplurals=2; plural=(n!=1);'},
  contexts: {'': {}},
};
let activeLocale = null;

/**
 * Returns translation only if `locale` offers a translation for `id`.
 * Otherwise, returns undefined.
 * @param {string} id Message ID to translate
 * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
 * @return {string}
 */
export function lookupTranslation(id, locale) {
  const loc = locale && locales.has(locale) ? locales.get(locale) : activeLocale;
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
  const loc = locales.get(locale.toLowerCase());
  if (!loc) {
    throw new Error(`Locale '${locale}' not found`);
  }
  activeLocale = loc;
  return activeLocale;
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
useLocale('');
