import {Locale} from './locale';
import poHe from './he.po.json';

Locale.addLocale('he', poHe);
Locale.addLocale('h', poHe);

const heStrs = poHe.contexts[''];
const heNoNikud = {};
Object.keys(heStrs).forEach((key) => {
  heNoNikud[key] = [Locale.hebrewStripNikkud(heStrs[key][0])];
});
const poHeNoNikud = {
  headers: poHe.headers,
  contexts: {'': heNoNikud},
};
Locale.addLocale('he-x-NoNikud', poHeNoNikud);
