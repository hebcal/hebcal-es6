export {gematriya} from './gematriya.js';
export {greg} from '@hebcal/hdate';
import {Locale} from './locale.js';
export {Locale};
export {HDate, months} from './hdate.js';
export {getYahrzeit_ as getYahrzeit} from './anniversary.js';
export {getBirthdayOrAnniversary_ as getBirthdayOrAnniversary} from './anniversary.js';
import manifest from '../package.json' with { type: 'json' };
export const {version} = manifest;

import poHeMin from './he.min.po.json' with { type: 'json' };
Locale.addLocale('he', poHeMin);
Locale.addLocale('h', poHeMin);

const heStrs = poHeMin.contexts[''];
const heNoNikud = {};
for (const [key, val] of Object.entries(heStrs)) {
  heNoNikud[key] = [Locale.hebrewStripNikkud(val[0])];
}
Locale.addLocale('he-x-NoNikud', {
  headers: poHeMin.headers,
  contexts: {'': heNoNikud},
});
