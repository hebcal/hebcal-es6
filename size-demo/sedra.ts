import {HebrewCalendar} from '../dist/index';
const sedra = HebrewCalendar.getSedra(5757, false);
console.log(sedra.get(56));
