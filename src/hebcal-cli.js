import cities from './cities';
import {Location} from './location';
import hebcal from './hebcal';

cities.init();
const loc = Location.newFromCity(cities.getCity('San Francisco'));
// const loc = Location.newFromCity(cities.getCity("Melbourne"));
// const loc = Location.newFromCity(cities.getCity("Jerusalem"));
// eslint-disable-next-line no-unused-vars
const options0 = {
  location: loc,
  hour12: false,
  locale: 'ashkenazi',
  year: 5749,
  isHebrewYear: true,
  //    il: true,  // force IL scheme even though we're in Diaspora
  /*
    year: 5780,
    month: "Iyyar",
*/
  candlelighting: true,
  sedrot: true,
  noModern: false,
  noMinorFast: false,
  noRoshChodesh: false,
  noSpecialShabbat: false,
  noHolidays: false,
  dafyomi: false,
  omer: true,
};

const options = {
  year: 1975,
  locale: 'ru',
  isHebrewYear: false,
  noHolidays: false,
  dafyomi: false,
  molad: true,
  omer: true,
  ashkenazi: false,
//    locale: "ashkenazi"
};

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: loc.tzid,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const events = hebcal.hebcalEvents(options);
for (const e of events) {
  const gregDt = e.getDate().greg();
  const gregDtStr = dateFormat.format(gregDt);
  console.log(gregDtStr, e.render());
}
