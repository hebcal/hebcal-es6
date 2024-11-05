import {Locale} from './locale';

/** @private */
export function renderParshaName(parsha: string[], locale?: string): string {
  const locale0 = locale ?? Locale.getLocaleName();
  let name = Locale.gettext(parsha[0], locale0);
  if (parsha.length === 2) {
    const hyphen = locale0 === 'he' ? '־' : '-';
    name += hyphen + Locale.gettext(parsha[1], locale0);
  }
  name = name.replace(/'/g, '’');
  const str = Locale.gettext('Parashat', locale) + ' ' + name;
  return str.normalize();
}
