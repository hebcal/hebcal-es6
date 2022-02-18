import test from 'ava';
import {Location} from './location';
import {HDate} from './hdate';

test('sunset', (t) => {
  const locations = [
    [41.85003, -87.65005, false, 'America/Chicago', '8:22 PM'], // Chicago
    [37.33939, -121.89496, false, 'America/Los_Angeles', '8:25 PM'], // San Jose
    [32.1836, 34.87386, true, 'Asia/Jerusalem', '7:44 PM'], // Ra'anana
    [-37.814, 144.96332, true, 'Australia/Melbourne', '5:08 PM'], // Melbourne
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

test('Location.addLocation', (t) => {
  const cityName = 'Ra\'anana';
  const missing = Location.lookup(cityName);
  t.is(missing, undefined);
  const success = Location.addLocation(cityName, new Location(
      32.1836, 34.87386, true, 'Asia/Jerusalem', cityName, 'IL', 999888777666));
  t.is(success, true);
  const found = Location.lookup(cityName);
  t.is(found.getLatitude(), 32.1836);
  t.is(found.getGeoId(), 999888777666);

  const loc = new Location(37.0, 123.0, false, 'UTC', 'Foo Bar, Baaz, Quux', 'XX');
  t.is(Location.addLocation(cityName, loc), false);
  t.is(Location.addLocation('Boston', loc), false);
  t.is(Location.addLocation('(bogus)', loc), true);
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
  t.is(Location.getUsaTzid('AZ', 7, 'Y'), 'America/Denver');
  t.is(Location.getUsaTzid('AZ', 7, 'N'), 'America/Phoenix');
  t.is(Location.getUsaTzid('AK', 10, 'N'), 'America/Adak');
  t.is(Location.getUsaTzid('HI', 10, 'N'), 'Pacific/Honolulu');
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
  t.is(Location.legacyTzToTzid(-1, 'eu'), 'Atlantic/Azores');
  t.is(Location.legacyTzToTzid(-3, 'none'), 'Etc/GMT-3');
  t.is(Location.legacyTzToTzid(3, 'none'), 'Etc/GMT+3');
  t.is(Location.legacyTzToTzid(9, 'usa'), undefined);
  t.is(Location.legacyTzToTzid(9, 'eu'), undefined);
  t.is(Location.legacyTzToTzid(9, 'israel'), undefined);
  t.is(Location.legacyTzToTzid(9, 'bogus'), undefined);
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

test('shortName-DC', (t) => {
  const loc = new Location(38.908089, -76.976663, false, 'America/New_York', 'Washington, DC 20002', 'US', '20002');
  t.is(loc.getName(), 'Washington, DC 20002');
  t.is(loc.getShortName(), 'Washington, DC');

  const loc2 = new Location(38.908089, -76.976663, false, 'America/New_York', 'Washington, D.C.', 'US', 4140963);
  t.is(loc2.getShortName(), 'Washington, D.C.');

  const loc3 = new Location(38.908089, -76.976663, false, 'America/New_York', 'Dover, DE 19901', 'US', '19901');
  t.is(loc3.getShortName(), 'Dover');
});

test('toString', (t) => {
  const loc = new Location(32.1836, 34.87386, true, 'Asia/Jerusalem', 'Ra\'anana', 'IL', 54321);
  // eslint-disable-next-line max-len
  t.is(loc.toString(), '{"latitude":32.1836,"longitude":34.87386,"il":true,"tzid":"Asia/Jerusalem","name":"Ra\'anana","cc":"IL","geoid":54321}');
});

test('throws', (t) => {
  const error3 = t.throws(() => {
    new Location(100, 123.0, false, 'UTC', 'Foo', 'XX');
  }, {instanceOf: RangeError});
  t.is(error3.message, 'Latitude 100 out of range [-90,90]');

  const error4 = t.throws(() => {
    new Location(37.0, -200, false, 'UTC', 'Foo', 'XX');
  }, {instanceOf: RangeError});
  t.is(error4.message, 'Longitude -200 out of range [-180,180]');
});
