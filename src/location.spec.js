import test from 'ava';
import {Location} from './location';
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

test('Location.register', (t) => {
  const cityName = 'Ra\'anana';
  const missing = Location.lookup(cityName);
  t.is(missing, undefined);
  const success = Location.register(cityName, new Location(
      32.1836, 34.87386, true, 'Asia/Jerusalem', cityName, 'IL', 999888777666));
  t.is(success, true);
  const found = Location.lookup(cityName);
  t.is(found.getLatitude(), 32.1836);
  t.is(found.getGeoId(), 999888777666);
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

test('getUsaTzid', (t) => {
  t.is(Location.getUsaTzid('CA', 8, 'Y'), 'America/Los_Angeles');
  t.is(Location.getUsaTzid('IL', 6, 'Y'), 'America/Chicago');
});

test('legacyTzToTzid', (t) => {
  t.is(Location.legacyTzToTzid(-8, 'usa'), 'America/Los_Angeles');
  t.is(Location.legacyTzToTzid(-6, 'usa'), 'America/Chicago');
  t.is(Location.legacyTzToTzid(-5, 'usa'), 'America/New_York');
  t.is(Location.legacyTzToTzid(0, 'eu'), 'Europe/London');
  t.is(Location.legacyTzToTzid(1, 'eu'), 'Europe/Paris');
  t.is(Location.legacyTzToTzid(2, 'eu'), 'Europe/Athens');
  t.is(Location.legacyTzToTzid(2, 'israel'), 'Asia/Jerusalem');
  t.is(Location.legacyTzToTzid(0, 'none'), 'UTC');
});

test('geonameCityDescr', (t) => {
  t.is(Location.geonameCityDescr('Providence', 'Rhode Island', 'United States'), 'Providence, Rhode Island, USA');
  t.is(Location.geonameCityDescr('London', 'England', 'United Kingdom'), 'London, England, UK');
  t.is(Location.geonameCityDescr('Tel Aviv', 'Central District', 'Israel'), 'Tel Aviv, Israel');
  t.is(Location.geonameCityDescr('Montréal', 'Quebec', 'Canada'), 'Montréal, Quebec, Canada');
});

test('shortName', (t) => {
  const loc = new Location(37.0, 123.0, false, 'UTC', 'Foo Bar, Baaz, Quux', 'XX');
  t.is(loc.getName(), 'Foo Bar, Baaz, Quux');
  t.is(loc.getShortName(), 'Foo Bar');
});
