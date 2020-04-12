import * as greg from './src/greg.mjs';
import * as common from './src/common.mjs';
import * as dafyomi from './src/dafyomi.mjs';

console.log("hello");
let foo = greg.daysInMonth(2, 2020);
console.log(foo);
foo = greg.greg2abs(new Date());
console.log(foo);
let bar = greg.abs2greg(foo);
console.log(bar);
console.log(greg.dayOfYear(new Date()));
console.log(common.LEAP(2020));
console.log(common.hebElapsedDays(5780));
for (let [key, value] of Object.entries(common.months)) {
    console.log(key + " " + common.daysInMonth(value));
}
let dy = dafyomi.dafyomi(new Date());
console.log(dafyomi.dafname(dy));

console.log("goodbye");
