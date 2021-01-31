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

test('zmanim-tlv', (t) => {
  const dt = new Date(2021, 2, 6, 12); // March 6 2021
  const zman = new Zmanim(dt, 32.08088, 34.78057);
  const tzid = 'Asia/Jerusalem';
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const expected = {
    chatzotNight: '03/05/2021, 23:51:56',
    alotHaShachar: '03/06/2021, 04:50:09',
    misheyakir: '03/06/2021, 05:11:52',
    misheyakirMachmir: '03/06/2021, 05:18:00',
    dawn: '03/06/2021, 05:37:49',
    sunrise: '03/06/2021, 06:02:16',
    neitzHaChama: '03/06/2021, 06:02:16',
    sofZmanShma: '03/06/2021, 08:57:17',
    sofZmanTfilla: '03/06/2021, 09:55:37',
    chatzot: '03/06/2021, 11:52:18',
    minchaGedola: '03/06/2021, 12:21:28',
    minchaKetana: '03/06/2021, 15:16:29',
    plagHaMincha: '03/06/2021, 16:29:25',
    sunset: '03/06/2021, 17:42:21',
    shkiah: '03/06/2021, 17:42:21',
    dusk: '03/06/2021, 18:06:50',
    tzeit: '03/06/2021, 18:18:39',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt);
  }
  t.deepEqual(actual, expected);
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
