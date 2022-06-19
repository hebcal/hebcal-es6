export {gematriya} from './gematriya';
export {greg} from './greg';
import {Locale} from './locale';
export {Locale};
export {HDate, months} from './hdate';
export {getYahrzeit_ as getYahrzeit} from './anniversary';
export {getBirthdayOrAnniversary_ as getBirthdayOrAnniversary} from './anniversary';
export {version} from '../package.json';

import poHeMin from './he.min.po.json';
Locale.addLocale('he', poHeMin);
Locale.addLocale('h', poHeMin);

const heStrs = poHeMin.contexts[''];
const heNoNikud = {};
Object.keys(heStrs).forEach((key) => {
  heNoNikud[key] = [Locale.hebrewStripNikkud(heStrs[key][0])];
});
Locale.addLocale('he-x-NoNikud', {
  headers: poHeMin.headers,
  contexts: {'': heNoNikud},
});
