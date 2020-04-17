import greg from './src/greg.js';
import common from './src/common.js';
import dafyomi from './src/dafyomi.js';
import cities from './src/cities.js';

console.log("*** greg");
let foo = greg.daysInMonth(2, 2020);
console.log(foo);
foo = greg.greg2abs(new Date());
console.log(foo);
let bar = greg.abs2greg(foo);
console.log(bar);
console.log(greg.dayOfYear(new Date()));

// common
console.log("*** common");
console.log(common.LEAP(2020));
console.log(common.hebElapsedDays(5780));
for (let [key, value] of Object.entries(common.months)) {
    console.log(key + " " + common.daysInMonth(value));
}

// dafyomi
console.log("*** dafyomi");
let dy = dafyomi.dafyomi(new Date());
console.log(dy);
console.log(dafyomi.dafname(dy));

// dafyomi
console.log("*** cities");
cities.init();
let city = cities.getCity("San Francisco");
console.log(city);
city = cities.getCity("Haifa");
console.log(city);
city = cities.getCity("athens greece");
console.log(city);
city = cities.getCity("moscow");
console.log(city);
console.log("goodbye");
