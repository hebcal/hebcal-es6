import {Locale} from './locale';

/** @private */
export function renderParshaName(parsha: string[], locale?: string): string {
  let name = Locale.gettext(parsha[0], locale);
  if (parsha.length === 2) {
    const hyphen = Locale.isHebrewLocale(locale) ? '־' : '-';
    name += hyphen + Locale.gettext(parsha[1], locale);
  }
  name = name.replace(/'/g, '’');
  const str = Locale.gettext('Parashat', locale) + ' ' + name;
  return str.normalize();
}
