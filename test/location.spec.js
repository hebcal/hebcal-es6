import {Location} from '../src/location.js';

test('lookup', () => {
  const loc1 = Location.lookup('San Francisco');
  expect(loc1.getCountryCode()).toBe('US');
  expect(loc1.getIsrael()).toBe(false);
  expect(loc1.getTzid()).toBe('America/Los_Angeles');

  const loc2 = Location.lookup('Jerusalem');
  expect(loc2.getCountryCode()).toBe('IL');
  expect(loc2.getIsrael()).toBe(true);
  expect(loc2.getTzid()).toBe('Asia/Jerusalem');
  expect(loc2.elevation).toBe(786);

  const providence = Location.lookup('Providence');
  expect(providence.getLatitude()).toBe(41.82399);
  expect(providence.getLongitude()).toBe(-71.41283);
  expect(providence.getTzid()).toBe('America/New_York');

  const melbourne = Location.lookup('Melbourne');
  expect(melbourne.getLatitude()).toBe(-37.814);
  expect(melbourne.getLongitude()).toBe(144.96332);
  expect(melbourne.getTzid()).toBe('Australia/Melbourne');
  expect(melbourne.cc).toBe('AU');
});

test('lookup-notfound', () => {
  const city = Location.lookup('**does not exist**');
  expect(city).toBe(undefined);
});

test('Location.addLocation', () => {
  const cityName = 'Ra\'anana';
  const missing = Location.lookup(cityName);
  expect(missing).toBe(undefined);
  const success = Location.addLocation(cityName, new Location(
      32.1836, 34.87386, true, 'Asia/Jerusalem', cityName, 'IL', 999888777666));
  expect(success).toBe(true);
  const found = Location.lookup(cityName);
  expect(found.getLatitude()).toBe(32.1836);
  expect(found.getGeoId()).toBe(999888777666);

  const loc = new Location(37.0, 123.0, false, 'UTC', 'Foo Bar, Baaz, Quux', 'XX');
  expect(Location.addLocation(cityName, loc)).toBe(false);
  expect(Location.addLocation('Boston', loc)).toBe(false);
  expect(Location.addLocation('(bogus)', loc)).toBe(true);
});

test('classic-cities', () => {
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
    expect(typeof city).toBe('object');
  }
});

test('getUsaTzid', () => {
  expect(Location.getUsaTzid('CA', 8, 'Y')).toBe('America/Los_Angeles');
  expect(Location.getUsaTzid('IL', 6, 'Y')).toBe('America/Chicago');
  expect(Location.getUsaTzid('AZ', 7, 'Y')).toBe('America/Denver');
  expect(Location.getUsaTzid('AZ', 7, 'N')).toBe('America/Phoenix');
  expect(Location.getUsaTzid('AK', 10, 'N')).toBe('America/Adak');
  expect(Location.getUsaTzid('HI', 10, 'N')).toBe('Pacific/Honolulu');
});

test('legacyTzToTzid', () => {
  expect(Location.legacyTzToTzid(-8, 'usa')).toBe('America/Los_Angeles');
  expect(Location.legacyTzToTzid(-6, 'usa')).toBe('America/Chicago');
  expect(Location.legacyTzToTzid(-5, 'usa')).toBe('America/New_York');
  expect(Location.legacyTzToTzid(0, 'eu')).toBe('Europe/London');
  expect(Location.legacyTzToTzid(1, 'eu')).toBe('Europe/Paris');
  expect(Location.legacyTzToTzid(2, 'eu')).toBe('Europe/Athens');
  expect(Location.legacyTzToTzid(2, 'israel')).toBe('Asia/Jerusalem');
  expect(Location.legacyTzToTzid(0, 'none')).toBe('UTC');
  expect(Location.legacyTzToTzid(-1, 'eu')).toBe('Atlantic/Azores');
  expect(Location.legacyTzToTzid(-3, 'none')).toBe('Etc/GMT-3');
  expect(Location.legacyTzToTzid(3, 'none')).toBe('Etc/GMT+3');
  expect(Location.legacyTzToTzid(9, 'usa')).toBe(undefined);
  expect(Location.legacyTzToTzid(9, 'eu')).toBe(undefined);
  expect(Location.legacyTzToTzid(9, 'israel')).toBe(undefined);
  expect(Location.legacyTzToTzid(9, 'bogus')).toBe(undefined);
});

test('shortName', () => {
  const loc = new Location(37.0, 123.0, false, 'UTC', 'Foo Bar, Baaz, Quux', 'XX');
  expect(loc.getName()).toBe('Foo Bar, Baaz, Quux');
  expect(loc.getShortName()).toBe('Foo Bar');
});

test('shortName-DC', () => {
  const loc = new Location(38.908089, -76.976663, false, 'America/New_York', 'Washington, DC 20002', 'US', '20002');
  expect(loc.getName()).toBe('Washington, DC 20002');
  expect(loc.getShortName()).toBe('Washington, DC');

  const loc2 = new Location(38.908089, -76.976663, false, 'America/New_York', 'Washington, D.C.', 'US', 4140963);
  expect(loc2.getShortName()).toBe('Washington, D.C.');

  const loc3 = new Location(38.908089, -76.976663, false, 'America/New_York', 'Dover, DE 19901', 'US', '19901');
  expect(loc3.getShortName()).toBe('Dover');
});

test('throws', () => {
  expect(() => {
    new Location(100, 123.0, false, 'UTC', 'Foo', 'XX');
  }).toThrow('Latitude 100 out of range [-90,90]');

  expect(() => {
    new Location(37.0, -200, false, 'UTC', 'Foo', 'XX');
  }).toThrow('Longitude -200 out of range [-180,180]');

  expect(() => {
    new Location('bogus', -200, false, 'UTC', 'Foo', 'XX');
  }).toThrow('Latitude bogus out of range [-90,90]');
});
