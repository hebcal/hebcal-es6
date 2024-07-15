import {Locale, LocaleData, StringArrayMap} from '@hebcal/hdate';
import poAshkenazi from './ashkenazi.po';
import poHe from './he.po';

Locale.addTranslations('he', poHe);
Locale.addTranslations('h', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);
Locale.addTranslations('a', poAshkenazi);

/* Hebrew without nikkud */
const heStrs = poHe.contexts[''];
const heNoNikud: StringArrayMap = {};
for (const [key, val] of Object.entries(heStrs)) {
  heNoNikud[key] = [Locale.hebrewStripNikkud(val[0])];
}
const poHeNoNikud: LocaleData = {
  headers: poHe.headers,
  contexts: {'': heNoNikud},
} as const;
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
