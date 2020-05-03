import greg from './greg';
import common from './common';
import dafyomi from './dafyomi';
import cities from './cities';
import HDate, { hebrew2abs } from './hdate';
import Sedra from './sedra';
import Location from './location';
import holidays from './holidays';

import { t, gettext, addLocale, useLocale } from 'ttag';
const locale = "ashkenazi";
console.log(locale);
if (locale) {
    const translationObj = require(`./${locale}.po.json`); // will load uk.po.json
    addLocale(locale, translationObj); // adding locale to ttag
    useLocale(locale); // make uk locale active
    const foo = t`Simchat Torah`;
    console.log(foo);
}

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
console.log(now.next());
console.log(now.prev());
const testDates = [
  now,
  new HDate(15, common.months.CHESHVAN, 5769),
  new HDate(14, common.months.ADAR_I, 5781),
  new HDate(14, common.months.ADAR_I, 5782),
  new HDate(14, common.months.ADAR_II, 5782),
  new HDate(15, 'Cheshvan', 5769),
  new HDate(new Date('December 17, 1995 03:24:00')),
  new HDate(new Date(1995, 11, 17, 3, 24, 0)),
  new HDate(733359),
  new HDate(730439),
  new HDate(678678),
  new HDate(new Date(1751, 0, 1)),
  new HDate(295059),
  new HDate(3, common.months.TISHREI, 1003),
  new HDate(1),
  new HDate(4, common.months.TAMUZ, 5536),
];
for (const d of testDates) {
    console.log(d.toString(), d.abs(), d.greg().toDateString());
}

// sedra
console.log("*** sedra");
let sedra = new Sedra(now.getFullYear());
console.log(gettext(sedra.get(now)[0]));

const today = new Date();
const todayAbs = greg.greg2abs(today);
let startAbs = greg.greg2abs(new Date(today.getFullYear(), 0, 1));
let endAbs = greg.greg2abs(new Date(today.getFullYear(), 11, 31));
for (let i = startAbs; i <= endAbs; i++) {
    const dow = i % 7;
    if (dow == 6) { // Saturday
        const todayHeb = new HDate(i);
        const parsha = sedra.get(todayHeb);
        let parshaStr = gettext(parsha[0]);
        if (parsha.length == 2) {
            parshaStr += "-" + gettext(parsha[1]);
        }
        const todayGreg = greg.abs2greg(i);
        const [date, time] = todayGreg.toLocaleString('en-US').split(', ');
        console.log(date, t`Parashat`, parshaStr);
    }
}

console.log("*** location");
let loc = new Location(41.85003,-87.65005, false, "America/Chicago", "Chicago", "US", 1016367);
let sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);

loc = new Location(37.33939,-121.89496, false, "America/Los_Angeles", "San Jose", "US");
sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);

loc = new Location(32.1836, 34.87386, true, "Asia/Jerusalem", "Ra'anana", "IL");
sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);

let city = cities.getCity("Tel Aviv");
loc = new Location(
    city.latitude,
    city.longitude,
    city.cc == 'IL',
    city.tzid,
    city.name,
    city.cc,
    city.geoid);
sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);

loc = Location.newFromCity(cities.getCity("Jerusalem"))
sunset = loc.sunset(now);
console.log(`Sunset in ${loc.name} is at ${sunset}`);


console.log("*** holidays");
let year = holidays.year(5749);
startAbs = hebrew2abs({ yy: 5749, mm: common.months.TISHREI, dd: 1});
endAbs = hebrew2abs({ yy: 5750, mm: common.months.TISHREI, dd: 1});
for (let absDt = startAbs; absDt <= endAbs; absDt++) {
    const gregDt = greg.abs2greg(absDt);
    const gregDtStr = gregDt.toLocaleDateString();
    const daf = dafyomi.dafyomi(gregDt);
    console.log(gregDtStr, t`Daf Yomi` + ":", dafyomi.dafname(daf));
    const hebDt = new HDate(absDt);
    const ev = year[hebDt];
    if (typeof ev !== 'undefined') {
        for (const e of ev) {
            const desc = e.getDesc();
//            const tdesc = msgid(desc);
            console.log(gregDtStr, desc, hebDt.toString());
        }
    }
}

console.log("goodbye");
