export {HDate, months} from './hdate';
export {greg} from './greg';
import {Locale} from './locale';
export {Locale};
export {version} from '../package.json';

import poHeMin from './he.min.po.json';
Locale.addLocale('he', poHeMin);
Locale.addLocale('h', poHeMin);
