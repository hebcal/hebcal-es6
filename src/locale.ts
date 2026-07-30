import {Locale} from '@hebcal/hdate';
import poAshkenazi from './ashkenazi.po.js';
import poHe from './he.po.js';
import noNikudOverride from './he-x-NoNikud.po.js';

Locale.addTranslations('he', poHe);
Locale.addTranslations('ashkenazi', poAshkenazi);

/* Hebrew without nikkud */
const poHeNoNikud = Locale.copyLocaleNoNikud(poHe);
Locale.addTranslations('he-x-NoNikud', poHeNoNikud);
Locale.addTranslations('he-x-NoNikud', noNikudOverride);

export {Locale} from '@hebcal/hdate';
