import test from 'ava';
import {Zmanim} from './zmanim';
import {HDate} from './hdate';

// eslint-disable-next-line require-jsdoc
function makeZman() {
  const latitude = 41.85003;
  const longitude = -87.65005;
  const dt = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
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
  t.is(zman.hour(), 4528776.166666667);
  t.is(zman.hourMins(), 75.47960277777779);
  t.is(zman.nightHour(), 2674586.4166666665);
  t.is(zman.nightHourMins(), 44.57644027777778);
});

test('suntime', (t) => {
  const zman = makeZman();
  const times = zman.suntime();
  const expectedKeys = [
    '0', 'solarNoon',
    'nadir', 'sunrise',
    'sunset', 'sunriseEnd',
    'sunsetStart', 'dawn',
    'dusk', 'nauticalDawn',
    'nauticalDusk', 'nightEnd',
    'night', 'goldenHourEnd',
    'goldenHour', 'alotHaShachar',
    'misheyakir', 'misheyakirMachmir',
    'tzeit',
  ];
  t.deepEqual(Object.keys(times), expectedKeys);
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
