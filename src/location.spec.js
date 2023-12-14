import test from 'ava';
import {Location} from './location.js';

test('lookup', (t) => {
  const loc1 = Location.lookup('San Francisco');
  t.is(loc1.getCountryCode(), 'US');
  t.is(loc1.getIsrael(), false);
  t.is(loc1.getTzid(), 'America/Los_Angeles');

  const loc2 = Location.lookup('Jerusalem');
  t.is(loc2.getCountryCode(), 'IL');
  t.is(loc2.getIsrael(), true);
  t.is(loc2.getTzid(), 'Asia/Jerusalem');
  t.is(loc2.elevation, 786);

  const providence = Location.lookup('Providence');
  t.is(providence.getLatitude(), 41.82399);
  t.is(providence.getLongitude(), -71.41283);
  t.is(providence.getTzid(), 'America/New_York');

  const melbourne = Location.lookup('Melbourne');
  t.is(melbourne.getLatitude(), -37.814);
  t.is(melbourne.getLongitude(), 144.96332);
  t.is(melbourne.getTzid(), 'Australia/Melbourne');
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

test('throws', (t) => {
  const error3 = t.throws(() => {
    new Location(100, 123.0, false, 'UTC', 'Foo', 'XX');
  }, {instanceOf: RangeError});
  t.is(error3.message, 'Latitude 100 out of range [-90,90]');

  const error4 = t.throws(() => {
    new Location(37.0, -200, false, 'UTC', 'Foo', 'XX');
  }, {instanceOf: RangeError});
  t.is(error4.message, 'Longitude -200 out of range [-180,180]');

  const err5 = t.throws(() => {
    new Location('bogus', -200, false, 'UTC', 'Foo', 'XX');
  }, {instanceOf: RangeError});
  t.is(err5.message, 'Latitude bogus out of range [-90,90]');
});
