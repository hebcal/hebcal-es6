import test from 'ava';
import {Zmanim} from './zmanim';

// eslint-disable-next-line require-jsdoc
function makeZman() {
  const latitude = 41.85003;
  const longitude = -87.65005;
  const dt = new Date(2020, 5, 5, 12); // Friday June 5 2020
  const zman = new Zmanim(dt, latitude, longitude);
  return zman;
}

test('zmanim', (t) => {
  const zman = makeZman();
  const tzid = 'America/Chicago';
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    hour: 'numeric',
    minute: 'numeric',
  });

  const expected = {
    chatzotNight: '12:49 AM',
    alotHaShachar: '3:25 AM',
    misheyakir: '4:03 AM',
    misheyakirMachmir: '4:12 AM',
    dawn: '4:42 AM',
    sunrise: '5:16 AM',
    neitzHaChama: '5:16 AM',
    sofZmanShma: '9:02 AM',
    sofZmanTfilla: '10:18 AM',
    chatzot: '12:49 PM',
    minchaGedola: '1:27 PM',
    minchaKetana: '5:13 PM',
    plagHaMincha: '6:48 PM',
    sunset: '8:22 PM',
    shkiah: '8:22 PM',
    dusk: '8:56 PM',
    tzeit: '9:13 PM',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt);
  }
  t.deepEqual(actual, expected);

  t.is(Math.round(zman.hourMins()), 76);
  t.is(Math.round(zman.nightHourMins()), 45);
});

test('suntime', (t) => {
  const zman = makeZman();
  const times = zman.suntime();
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
  });
  const result = {};
  for (const [key, val] of Object.entries(times)) {
    result[key] = f.format(val);
  }
  const expected = {
    solarNoon: '12:49 PM',
    sunrise: '5:16 AM',
    sunset: '8:22 PM',
    sunriseEnd: '5:19 AM',
    sunsetStart: '8:19 PM',
    dawn: '4:42 AM',
    dusk: '8:56 PM',
    nauticalDawn: '3:59 AM',
    nauticalDusk: '9:39 PM',
    nightEnd: '3:07 AM',
    night: '10:31 PM',
    goldenHourEnd: '5:58 AM',
    goldenHour: '7:40 PM',
    alotHaShachar: '3:25 AM',
    misheyakir: '4:03 AM',
    misheyakirMachmir: '4:12 AM',
    tzeit: '9:13 PM',
  };
  t.deepEqual(result, expected);
});

test('throws', (t) => {
  const error = t.throws(() => {
    new Zmanim(123, 44, 55);
  }, {instanceOf: TypeError});
  t.is(error.message, 'invalid date: 123');

  const error2 = t.throws(() => {
    new Zmanim(new Date(), 33, 'def');
  }, {instanceOf: TypeError});
  t.is(error2.message, 'Invalid longitude');
  const error2b = t.throws(() => {
    new Zmanim(new Date(), 'abc', 33);
  }, {instanceOf: TypeError});
  t.is(error2b.message, 'Invalid latitude');

  const error3 = t.throws(() => {
    new Zmanim(new Date(), 100, 100);
  }, {instanceOf: RangeError});
  t.is(error3.message, 'Latitude 100 out of range [-90,90]');

  const error4 = t.throws(() => {
    new Zmanim(new Date(), 44, -200);
  }, {instanceOf: RangeError});
  t.is(error4.message, 'Longitude -200 out of range [-180,180]');
});
