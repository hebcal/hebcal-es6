import {Locale} from './locale.js';
import poAshkenazi from './ashkenazi.po.json' with { type: 'json' };

Locale.addLocale('ashkenazi', poAshkenazi);
Locale.addLocale('a', poAshkenazi);
