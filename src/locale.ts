import {Locale} from '@hebcal/hdate';
import poAshkenazi from './ashkenazi.po';
import poHe from './he.po';
import noNikudOverride from './he-x-NoNikud.po';

export {Locale};

Locale.addTranslations('he', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);

/* Hebrew without nikkud */
const poHeNoNikud = Locale.copyLocaleNoNikud(poHe);
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
Locale.addTranslations('he-x-NoNikud', noNikudOverride);
