import test from 'ava';
import {Location, registerLocation, Zmanim} from './location';
import {HDate} from './hdate';

test('sunset', (t) => {
  const locations = [
    [41.85003, -87.65005, false, 'America/Chicago', '8:23 PM'], // Chicago
    [37.33939, -121.89496, false, 'America/Los_Angeles', '8:26 PM'], // San Jose
    [32.1836, 34.87386, true, 'Asia/Jerusalem', '7:45 PM'], // Ra'anana
    [-37.814, 144.96332, true, 'Australia/Melbourne', '5:09 PM'], // Melbourne
  ];
  const june5 = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
  for (const l of locations) {
    const loc = new Location(l[0], l[1], l[2], l[3]);
    const expected = l[4];
    const sunset = loc.sunset(june5);
    const options = {
      timeZone: loc.tzid,
      hour: 'numeric',
      minute: 'numeric',
    };
    const time = new Intl.DateTimeFormat('en-US', options).format(sunset);
    t.is(time, expected);
  }
});

test('zmanim', (t) => {
  const loc = new Location(41.85003, -87.65005, false, 'America/Chicago');
  const dt = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
  const zman = new Zmanim(dt, loc);
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: loc.tzid,
    hour: 'numeric',
    minute: 'numeric',
  });

  t.is(f.format(zman.sunrise()), '5:17 AM');
  t.is(f.format(zman.sunset()), '8:23 PM');
  t.is(f.format(zman.chatzot()), '12:50 PM');
  t.is(f.format(zman.chatzotNight()), '12:50 AM');
  t.is(f.format(zman.alotHaShachar()), '3:26 AM');
  t.is(f.format(zman.misheyakir()), '4:04 AM');
  t.is(f.format(zman.misheyakirMachmir()), '4:14 AM');
  t.is(f.format(zman.sofZmanShma()), '9:04 AM');
  t.is(f.format(zman.sofZmanTfilla()), '10:19 AM');
  t.is(f.format(zman.minchaGedola()), '1:28 PM');
  t.is(f.format(zman.minchaKetana()), '5:14 PM');
  t.is(f.format(zman.plagHaMincha()), '6:49 PM');
  t.is(f.format(zman.tzeit()), '9:14 PM');
  t.is(f.format(zman.neitzHaChama()), '5:17 AM');
  t.is(f.format(zman.shkiah()), '8:23 PM');
});

test('lookup', (t) => {
  const loc1 = Location.lookup('San Francisco');
  t.is(loc1.getCountryCode(), 'US');
  t.is(loc1.getIsrael(), false);
  t.is(loc1.getTzid(), 'America/Los_Angeles');

  const loc2 = Location.lookup('Jerusalem');
  t.is(loc2.getCountryCode(), 'IL');
  t.is(loc2.getIsrael(), true);
  t.is(loc2.getTzid(), 'Asia/Jerusalem');

  const providence = Location.lookup('Providence');
  t.is(providence.latitude, 41.82399);
  t.is(providence.longitude, -71.41283);
  t.is(providence.tzid, 'America/New_York');

  const melbourne = Location.lookup('Melbourne');
  t.is(melbourne.latitude, -37.814);
  t.is(melbourne.longitude, 144.96332);
  t.is(melbourne.tzid, 'Australia/Melbourne');
  t.is(melbourne.cc, 'AU');
});

test('lookup-notfound', (t) => {
  const city = Location.lookup('**does not exist**');
  t.is(city, undefined);
});

test('registerLocation', (t) => {
  const cityName = 'Ra\'anana';
  const missing = Location.lookup(cityName);
  t.is(missing, undefined);
  const success = registerLocation(cityName, new Location(
      32.1836, 34.87386, true, 'Asia/Jerusalem', cityName, 'IL'));
  t.is(success, true);
  const found = Location.lookup(cityName);
  t.is(found.getLatitude(), 32.1836);
});

test('classic-cities', (t) => {
  const classic = [
    'Ashdod', 'Atlanta', 'Austin', 'Baghdad', 'Beer Sheva',
    'Berlin', 'Baltimore', 'Bogota', 'Boston', 'Budapest',
    'Buenos Aires', 'Buffalo', 'Chicago', 'Cincinnati', 'Cleveland',
    'Dallas', 'Denver', 'Detroit', 'Eilat', 'Gibraltar', 'Haifa',
    'Hawaii', 'Helsinki', 'Houston', 'Jerusalem', 'Johannesburg',
    'Kiev', 'La Paz', 'Livingston', 'Las Vegas', 'London', 'Los Angeles',
    'Marseilles', 'Miami', 'Minneapolis', 'Melbourne', 'Mexico City',
    'Montreal', 'Moscow', 'New York', 'Omaha', 'Ottawa', 'Panama City',
    'Paris', 'Pawtucket', 'Petach Tikvah', 'Philadelphia', 'Phoenix',
    'Pittsburgh', 'Providence', 'Portland', 'Saint Louis', 'Saint Petersburg',
    'San Diego', 'San Francisco', 'Sao Paulo', 'Seattle', 'Sydney',
    'Tel Aviv', 'Tiberias', 'Toronto', 'Vancouver', 'White Plains',
    'Washington DC', 'Worcester',
  ];
  for (const s of classic) {
    const city = Location.lookup(s);
    t.is(typeof city, 'object', s);
  }
});
