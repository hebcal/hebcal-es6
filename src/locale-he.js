import {Locale} from './locale';
import poHe from './he.po.json';

Locale.addLocale('he', poHe);
Locale.addLocale('h', poHe);

const heStrs = poHe.contexts[''];
const heNoNikud = {};
Object.keys(heStrs).forEach((key) => {
  heNoNikud[key] = [Locale.hebrewStripNikkud(heStrs[key][0])];
});
const localeName = 'he-x-NoNikud';
const poHeNoNikud = {
  headers: {'plural-forms': 'nplurals=2; plural=(n!=1);', 'language': localeName},
  contexts: {'': heNoNikud},
};
Locale.addLocale(localeName, poHeNoNikud);
