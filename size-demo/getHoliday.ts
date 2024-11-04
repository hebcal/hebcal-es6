import {HDate} from '@hebcal/hdate';
import {getHolidaysOnDate} from '../dist/es/holidays';
console.log(getHolidaysOnDate(new HDate(1, 1, 5757)));
