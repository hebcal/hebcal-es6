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
    gregEve: '03/05/2021, 17:41:37',
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

test('roundTime', (t) => {
  const dt50 = new Date(2021, 0, 31, 7, 30, 50, 551); // 2021-01-31T07:30:50.551Z
  const rounded50 = Zmanim.roundTime(dt50);
  t.is(rounded50.getSeconds(), 0);
  t.is(rounded50.getMinutes(), 31);

  const dt30 = new Date(2021, 0, 31, 7, 30, 30, 551); // 2021-01-31T07:30:30.551Z
  const rounded30 = Zmanim.roundTime(dt30);
  t.is(rounded30.getSeconds(), 0);
  t.is(rounded30.getMinutes(), 31);

  const dt17 = new Date(2021, 0, 31, 7, 30, 17, 551); // 2021-01-31T07:30:17.551Z
  const rounded17 = Zmanim.roundTime(dt17);
  t.is(rounded17.getSeconds(), 0);
  t.is(rounded17.getMinutes(), 30);

  const dt0 = new Date(2021, 0, 31, 7, 30, 0, 123); // 2021-01-31T07:30:00.123Z
  const rounded0 = Zmanim.roundTime(dt0);
  t.is(rounded0.getSeconds(), 0);
  t.is(rounded0.getMinutes(), 30);
});

test('timeZoneOffset', (t) => {
  const winter = new Date(Date.UTC(2020, 1, 22, 0, 0, 0, 0));
  const summer = new Date(Date.UTC(2020, 6, 22, 0, 0, 0, 0));
  const tzids = [
    ['Africa/Johannesburg', '+02:00', '+02:00'],
    ['America/Anchorage', '-09:00', '-08:00'],
    ['America/Argentina/Buenos_Aires', '-03:00', '-03:00'],
    ['America/Bogota', '-05:00', '-05:00'],
    ['America/Chicago', '-06:00', '-05:00'],
    ['America/Denver', '-07:00', '-06:00'],
    ['America/Detroit', '-05:00', '-04:00'],
    ['America/La_Paz', '-04:00', '-04:00'],
    ['America/Los_Angeles', '-08:00', '-07:00'],
    ['America/Mexico_City', '-06:00', '-05:00'],
    ['America/New_York', '-05:00', '-04:00'],
    ['America/Panama', '-05:00', '-05:00'],
    ['America/Phoenix', '-07:00', '-07:00'],
    ['America/Sao_Paulo', '-03:00', '-03:00'],
    ['America/St_Johns', '-03:30', '-02:30'],
    ['America/Toronto', '-05:00', '-04:00'],
    ['Asia/Baghdad', '+03:00', '+03:00'],
    ['Asia/Colombo', '+05:30', '+05:30'],
    ['Asia/Jerusalem', '+02:00', '+03:00'],
    ['Asia/Kolkata', '+05:30', '+05:30'],
    ['Asia/Seoul', '+09:00', '+09:00'],
    ['Australia/Melbourne', '+11:00', '+10:00'],
    ['Australia/Sydney', '+11:00', '+10:00'],
    ['Europe/Berlin', '+01:00', '+02:00'],
    ['Europe/Budapest', '+01:00', '+02:00'],
    ['Europe/Gibraltar', '+01:00', '+02:00'],
    ['Europe/Helsinki', '+02:00', '+03:00'],
    ['Europe/Kiev', '+02:00', '+03:00'],
    ['Europe/London', '-00:00', '+01:00'],
    ['Europe/Moscow', '+03:00', '+03:00'],
    ['Europe/Paris', '+01:00', '+02:00'],
    ['Pacific/Honolulu', '-10:00', '-10:00'],
  ];
  for (const [tzid, wtz, stz] of tzids) {
    t.is(Zmanim.timeZoneOffset(tzid, winter), wtz, `${tzid} winter`);
    t.is(Zmanim.timeZoneOffset(tzid, summer), stz, `${tzid} summer`);
  }
});

test.skip('timeZoneOffset-pacific', (t) => {
  const winter = new Date(Date.UTC(2020, 1, 22, 0, 0, 0, 0));
  const summer = new Date(Date.UTC(2020, 6, 22, 0, 0, 0, 0));
  const tzids = [
    ['Pacific/Auckland', '-11:00', '+12:00'],
    ['Pacific/Tarawa', '+12:00', '+12:00'],
    ['Pacific/Apia', '+14:00', '+13:00'],
  ];
  for (const [tzid, wtz, stz] of tzids) {
    t.is(Zmanim.timeZoneOffset(tzid, winter), wtz, `${tzid} winter`);
    t.is(Zmanim.timeZoneOffset(tzid, summer), stz, `${tzid} summer`);
  }
});

test('formatISOWithTimeZone', (t) => {
  const winter = new Date(Date.UTC(2020, 1, 22, 0, 0, 0, 0));
  const summer = new Date(Date.UTC(2020, 6, 22, 0, 0, 0, 0));
  const expected = {
    'Africa/Johannesburg': ['2020-02-22T02:00:00+02:00', '2020-07-22T02:00:00+02:00'],
    'America/Anchorage': ['2020-02-21T15:00:00-09:00', '2020-07-21T16:00:00-08:00'],
    'America/Argentina/Buenos_Aires': ['2020-02-21T21:00:00-03:00', '2020-07-21T21:00:00-03:00'],
    'America/Bogota': ['2020-02-21T19:00:00-05:00', '2020-07-21T19:00:00-05:00'],
    'America/Chicago': ['2020-02-21T18:00:00-06:00', '2020-07-21T19:00:00-05:00'],
    'America/Denver': ['2020-02-21T17:00:00-07:00', '2020-07-21T18:00:00-06:00'],
    'America/Detroit': ['2020-02-21T19:00:00-05:00', '2020-07-21T20:00:00-04:00'],
    'America/La_Paz': ['2020-02-21T20:00:00-04:00', '2020-07-21T20:00:00-04:00'],
    'America/Los_Angeles': ['2020-02-21T16:00:00-08:00', '2020-07-21T17:00:00-07:00'],
    'America/Mexico_City': ['2020-02-21T18:00:00-06:00', '2020-07-21T19:00:00-05:00'],
    'America/New_York': ['2020-02-21T19:00:00-05:00', '2020-07-21T20:00:00-04:00'],
    'America/Panama': ['2020-02-21T19:00:00-05:00', '2020-07-21T19:00:00-05:00'],
    'America/Phoenix': ['2020-02-21T17:00:00-07:00', '2020-07-21T17:00:00-07:00'],
    'America/Sao_Paulo': ['2020-02-21T21:00:00-03:00', '2020-07-21T21:00:00-03:00'],
    'America/St_Johns': ['2020-02-21T20:30:00-03:30', '2020-07-21T21:30:00-02:30'],
    'America/Toronto': ['2020-02-21T19:00:00-05:00', '2020-07-21T20:00:00-04:00'],
    'Asia/Baghdad': ['2020-02-22T03:00:00+03:00', '2020-07-22T03:00:00+03:00'],
    'Asia/Colombo': ['2020-02-22T05:30:00+05:30', '2020-07-22T05:30:00+05:30'],
    'Asia/Jerusalem': ['2020-02-22T02:00:00+02:00', '2020-07-22T03:00:00+03:00'],
    'Asia/Kolkata': ['2020-02-22T05:30:00+05:30', '2020-07-22T05:30:00+05:30'],
    'Asia/Seoul': ['2020-02-22T09:00:00+09:00', '2020-07-22T09:00:00+09:00'],
    'Australia/Melbourne': ['2020-02-22T11:00:00+11:00', '2020-07-22T10:00:00+10:00'],
    'Australia/Sydney': ['2020-02-22T11:00:00+11:00', '2020-07-22T10:00:00+10:00'],
    'Europe/Berlin': ['2020-02-22T01:00:00+01:00', '2020-07-22T02:00:00+02:00'],
    'Europe/Budapest': ['2020-02-22T01:00:00+01:00', '2020-07-22T02:00:00+02:00'],
    'Europe/Gibraltar': ['2020-02-22T01:00:00+01:00', '2020-07-22T02:00:00+02:00'],
    'Europe/Helsinki': ['2020-02-22T02:00:00+02:00', '2020-07-22T03:00:00+03:00'],
    'Europe/Kiev': ['2020-02-22T02:00:00+02:00', '2020-07-22T03:00:00+03:00'],
    'Europe/London': ['2020-02-22T00:00:00-00:00', '2020-07-22T01:00:00+01:00'],
    'Europe/Moscow': ['2020-02-22T03:00:00+03:00', '2020-07-22T03:00:00+03:00'],
    'Europe/Paris': ['2020-02-22T01:00:00+01:00', '2020-07-22T02:00:00+02:00'],
    'Pacific/Honolulu': ['2020-02-21T14:00:00-10:00', '2020-07-21T14:00:00-10:00'],
  };
  const actual = {};
  for (const tzid of Object.keys(expected)) {
    const winterISO = Zmanim.formatISOWithTimeZone(tzid, winter);
    const summerISO = Zmanim.formatISOWithTimeZone(tzid, summer);
    actual[tzid] = [winterISO, summerISO];
  }
  t.deepEqual(actual, expected);
});

test('nightHourMins-dst', (t) => {
  const [latitude, longitude, tzid] = [42.35843, -71.05977, 'America/New_York']; // Boston

  const dt0 = new Date(2022, 2, 12); // March 12, 2022 - before DST
  const zman0 = new Zmanim(dt0, latitude, longitude);
  t.is(Zmanim.formatISOWithTimeZone(tzid, zman0.gregEve()), '2022-03-11T17:46:04-05:00');
  t.is(Zmanim.formatISOWithTimeZone(tzid, zman0.sunset()), '2022-03-12T17:47:15-05:00');
  t.is(Math.round(zman0.nightHourMins()), 61);

  const dt1 = new Date(2022, 2, 13); // March 14, 2022
  const zman1 = new Zmanim(dt1, latitude, longitude);
  t.is(Zmanim.formatISOWithTimeZone(tzid, zman1.gregEve()), '2022-03-12T17:47:15-05:00');
  t.is(Zmanim.formatISOWithTimeZone(tzid, zman1.sunset()), '2022-03-13T18:48:25-04:00');
  t.is(Math.round(zman1.nightHourMins()), 61); // not 181

  const dt2 = new Date(2022, 2, 14); // March 14, 2022
  const zman2 = new Zmanim(dt2, latitude, longitude);
  t.is(Zmanim.formatISOWithTimeZone(tzid, zman2.gregEve()), '2022-03-13T18:48:25-04:00');
  t.is(Zmanim.formatISOWithTimeZone(tzid, zman2.sunset()), '2022-03-14T18:49:35-04:00');
  t.is(Math.round(zman2.nightHourMins()), 61);
});
