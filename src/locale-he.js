import {Locale} from './locale.js';
import poHe from './he.po.js';

Locale.addLocale('he', poHe);
Locale.addLocale('h', poHe);

const heStrs = poHe.contexts[''];
const heNoNikud = {};
for (const [key, val] of Object.entries(heStrs)) {
  heNoNikud[key] = [Locale.hebrewStripNikkud(val[0])];
}
const poHeNoNikud = {
  headers: poHe.headers,
  contexts: {'': heNoNikud},
};
Locale.addLocale('he-x-NoNikud', poHeNoNikud);
