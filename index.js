import greg from './src/greg.js';
import common from './src/common.js';
import dafyomi from './src/dafyomi.js';
import cities from './src/cities.js';
import HDate from './src/hdate.js';
import Sedra from './src/sedra.js';
import Location from './src/location.js';
//import holidays from './src/holidays.js';


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

// cities
console.log("*** cities");
cities.init();
for (const name of ["San Francisco", "Haifa", "athens greece", "moscow"]) {
    let city = cities.getCity(name);
    console.log(`${city.cityName}: ${city.tzid}`);
}

// hdate
console.log("*** hdate");
const now = new HDate();
let d = now;
console.log(d.toString());
d = new HDate(15, common.months.CHESHVAN, 5769);
console.log(d.toString());
console.log(d);
d = new HDate(14, common.months.ADAR_I, 5781);
console.log(d.toString());
console.log(d);
d = new HDate(14, common.months.ADAR_I, 5782);
console.log(d.toString());
console.log(d);
d = new HDate(14, common.months.ADAR_II, 5782);
console.log(d.toString());
d = new HDate(15, common.months.CHESHVAN, 5769);
let birthday1 = new Date('December 17, 1995 03:24:00');
let birthday2 = new Date(1995, 11, 17, 3, 24, 0);
console.log(new HDate(birthday1));
console.log(new HDate(birthday2));
d = new HDate(15, 'Cheshvan', 5769);
console.log(d.toString());
console.log(d.greg());
console.log(d.abs());
console.log(typeof d.abs());
console.log(d.next());
d = new HDate(4, common.months.TAMUZ, 5536);
console.log(d.toString());
d = new HDate(new Date(1751, 0, 1));
console.log(d.toString());
d = new HDate(3, common.months.TISHREI, 3);
console.log(d.toString());

// sedra
console.log("*** sedra");
let sedra = new Sedra(now.getFullYear());
console.log(sedra.get(now)[0][0]);

const today = new Date();
const todayAbs = greg.greg2abs(today);
let startAbs = greg.greg2abs(new Date(today.getFullYear(), 0, 1));
let endAbs = greg.greg2abs(new Date(today.getFullYear(), 11, 31));
for (let i = startAbs; i <= endAbs; i++) {
    const dow = i % 7;
    if (dow == 6) { // Saturday
        const todayHeb = new HDate(i);
        const parsha = sedra.get(todayHeb);
        let parshaStr = common.LANG(parsha[0]);
        if (parsha.length == 2) {
            parshaStr += "-" + common.LANG(parsha[1]);
        }
        const todayGreg = greg.abs2greg(i);
        const [date, time] = todayGreg.toLocaleString('en-US').split(', ');
        console.log(`${date} Parashat ${parshaStr}`);
    }
}

console.log("*** location");
let loc = new Location(41.85003,-87.65005, false, "America/Chicago", "Chicago", "US", 1016367);
let sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);

loc = new Location(37.33939,-121.89496, false, "America/Los_Angeles", "San Jose", "US");
sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);

console.log("goodbye");
