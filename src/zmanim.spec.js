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

// eslint-disable-next-line require-jsdoc
function makeZmanWithElevation() {
  const latitude = 39.73915;
  const longitude = -104.9847;
  const elevtion = 1636;
  const tzid = 'America/Denver';
  const dt = new Date(2020, 5, 5, 12); // Friday June 5 2020
  const zman = new Zmanim(dt, latitude, longitude, elevtion, tzid);
  return zman;
}

test('zmanim', (t) => {
  const zman = makeZman();
  const tzid = 'America/Chicago';
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const expected = {
    chatzotNight: '00:49',
    alotHaShachar: '03:25',
    misheyakir: '04:03',
    misheyakirMachmir: '04:12',
    dawn: '04:42',
    sunrise: '05:16',
    neitzHaChama: '05:16',
    sofZmanShma: '09:02',
    sofZmanShmaMGA: '08:26',
    sofZmanTfilla: '10:18',
    sofZmanTfillaMGA: '09:54',
    chatzot: '12:49',
    minchaGedola: '13:27',
    minchaKetana: '17:13',
    plagHaMincha: '18:48',
    sunset: '20:22',
    shkiah: '20:22',
    dusk: '20:56',
    tzeit: '21:13',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt).replace(/^24:/, '00:');
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

/*
{
  "metadata": {
    "date": "2020-06-02",
    "type": "com.kosherjava.zmanim.ZmanimCalendar",
    "algorithm": "US National Oceanic and Atmospheric Administration Algorithm",
    "location": "Denver",
    "latitude": "39.73915",
    "longitude": "-104.9847",
    "elevation": "1636.0",
    "timeZoneName": "Mountain Daylight Time",
    "timeZoneID": "America/Denver",
    "timeZoneOffset": "-6.0"
  },
  "BasicZmanim": {
    "BeginAstronomicalTwilight": "2020-06-02T03:34:54-06:00",
    "AlosHashachar": "2020-06-02T03:50:25-06:00",
    "BeginNauticalTwilight": "2020-06-02T04:21:01-06:00",
    "Alos72": "2020-06-02T04:21:22-06:00",
    "BeginCivilTwilight": "2020-06-02T05:01:19-06:00",
    "Sunrise": "2020-06-02T05:25:29-06:00",
    "SeaLevelSunrise": "2020-06-02T05:33:22-06:00",
    "SofZmanShmaMGA": "2020-06-02T08:39:48-06:00",
    "SofZmanShmaGRA": "2020-06-02T09:15:48-06:00",
    "SofZmanTfilaMGA": "2020-06-02T10:05:56-06:00",
    "SofZmanTfilaGRA": "2020-06-02T10:29:56-06:00",
    "Chatzos": "2020-06-02T12:58:13-06:00",
    "SunTransit": "2020-06-02T12:58:13-06:00",
    "MinchaGedola": "2020-06-02T13:35:18-06:00",
    "MinchaKetana": "2020-06-02T17:17:44-06:00",
    "PlagHamincha": "2020-06-02T18:50:25-06:00",
    "CandleLighting": "2020-06-02T20:05:05-06:00",
    "SeaLevelSunset": "2020-06-02T20:23:05-06:00",
    "Sunset": "2020-06-02T20:30:59-06:00",
    "EndCivilTwilight": "2020-06-02T20:55:12-06:00",
    "Tzais": "2020-06-02T21:11:32-06:00",
    "Tzais72": "2020-06-02T21:35:05-06:00",
    "EndNauticalTwilight": "2020-06-02T21:35:36-06:00",
    "EndAstronomicalTwilight": "2020-06-02T22:21:56-06:00",
    "ShaahZmanisGra": "PT1H14M8.636S",
    "TemporalHour": "PT1H14M8.636S",
    "ShaahZmanisMGA": "PT1H26M8.636S"
  }
}
*/
test('zmanim-denver', (t) => {
  const zman = makeZmanWithElevation();
  const tzid = 'America/Denver';
  const f = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tzid,
  });

  const expected = {
    gregEve: '06/04/2020, 20:32:19',
    chatzotNight: '06/05/2020, 24:58:24',
    alotHaShachar: '06/05/2020, 03:48:37',
    misheyakir: '06/05/2020, 04:23:08',
    misheyakirMachmir: '06/05/2020, 04:32:14',
    dawn: '06/05/2020, 05:00:12',
    sunrise: '06/05/2020, 05:24:30',
    neitzHaChama: '06/05/2020, 05:24:30',
    sofZmanShma: '06/05/2020, 09:11:36',
    sofZmanShmaMGA: '06/05/2020, 08:35:36',
    sofZmanTfilla: '06/05/2020, 10:27:19',
    sofZmanTfillaMGA: '06/05/2020, 10:03:19',
    chatzot: '06/05/2020, 12:58:43',
    minchaGedola: '06/05/2020, 13:36:34',
    minchaKetana: '06/05/2020, 17:23:41',
    plagHaMincha: '06/05/2020, 18:58:19',
    sunset: '06/05/2020, 20:32:57',
    shkiah: '06/05/2020, 20:32:57',
    dusk: '06/05/2020, 20:57:18',
    tzeit: '06/05/2020, 21:13:45',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt).replace(/^24:/, '00:');
  }
  t.deepEqual(actual, expected);

  t.is(Math.round(zman.hourMins()), 76);
  t.is(Math.round(zman.nightHourMins()), 44);
});

test('suntime', (t) => {
  const zman = makeZman();
  const times = zman.suntime();
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const result = {};
  for (const [key, val] of Object.entries(times)) {
    result[key] = f.format(val);
  }
  const expected = {
    solarNoon: '12:49',
    sunrise: '05:16',
    sunset: '20:22',
    sunriseEnd: '05:19',
    sunsetStart: '20:19',
    dawn: '04:42',
    dusk: '20:56',
    nauticalDawn: '03:59',
    nauticalDusk: '21:39',
    nightEnd: '03:07',
    night: '22:31',
    goldenHourEnd: '05:58',
    goldenHour: '19:40',
    alotHaShachar: '03:25',
    misheyakir: '04:03',
    misheyakirMachmir: '04:12',
    tzeit: '21:13',
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
  t.is(rounded50.getMilliseconds(), 0);

  const dt30 = new Date(2021, 0, 31, 7, 30, 30, 551); // 2021-01-31T07:30:30.551Z
  const rounded30 = Zmanim.roundTime(dt30);
  t.is(rounded30.getSeconds(), 0);
  t.is(rounded30.getMinutes(), 31);
  t.is(rounded30.getMilliseconds(), 0);

  const dt17 = new Date(2021, 0, 31, 7, 30, 17, 551); // 2021-01-31T07:30:17.551Z
  const rounded17 = Zmanim.roundTime(dt17);
  t.is(rounded17.getSeconds(), 0);
  t.is(rounded17.getMinutes(), 30);
  t.is(rounded17.getMilliseconds(), 0);

  const dt0 = new Date(2021, 0, 31, 7, 30, 0, 123); // 2021-01-31T07:30:00.123Z
  const rounded0 = Zmanim.roundTime(dt0);
  t.is(rounded0.getSeconds(), 0);
  t.is(rounded0.getMinutes(), 30);
  t.is(rounded0.getMilliseconds(), 0);

  const dt299 = new Date(2021, 0, 31, 7, 45, 29, 997); // 2021-01-31T07:45:29.997Z
  const rounded299 = Zmanim.roundTime(dt299);
  t.is(rounded299.getSeconds(), 0);
  t.is(rounded299.getMinutes(), 45);
  t.is(rounded299.getMilliseconds(), 0);
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

test('bce', (t) => {
  const latitude = 41.85003;
  const longitude = -87.65005;
  const dt = new Date(-1234, 5, 5, 12, 0, 0);
  const zman = new Zmanim(dt, latitude, longitude);
  t.deepEqual(zman.sunrise(), new Date('-001234-06-05 10:08:09 UTC'));
  t.deepEqual(zman.sunset(), new Date('-001234-06-06 01:14:12 UTC'));
});

test('Zmanim.formatISOWithTimeZone-2021', (t) => {
  const dt = new Date(Date.UTC(2021, 0, 31, 7, 30, 50, 551));
  t.is(Zmanim.formatISOWithTimeZone('UTC', dt), '2021-01-31T07:30:50-00:00');
  t.is(Zmanim.formatISOWithTimeZone('America/New_York', dt), '2021-01-31T02:30:50-05:00');
  t.is(Zmanim.formatISOWithTimeZone('America/Los_Angeles', dt), '2021-01-30T23:30:50-08:00');
});

test('Zmanim.formatISOWithTimeZone-1948', (t) => {
  const dt = new Date(Date.UTC(1948, 0, 31, 7, 30, 50, 551));
  t.is(Zmanim.formatISOWithTimeZone('UTC', dt), '1948-01-31T07:30:50-00:00');
  t.is(Zmanim.formatISOWithTimeZone('America/New_York', dt), '1948-01-31T02:30:50-05:00');
  t.is(Zmanim.formatISOWithTimeZone('America/Los_Angeles', dt), '1948-01-30T23:30:50-08:00');
});

test('sunsetOffset', (t) => {
  const zman = makeZman();
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  t.is(f.format(zman.sunriseOffset(10, true)), '05:26:00');
  t.is(f.format(zman.sunriseOffset(10, false)), '05:26:18');
  t.is(f.format(zman.sunsetOffset(10, true)), '20:32:00');
  t.is(f.format(zman.sunsetOffset(10, false)), '20:32:29');
});

test('timeAtAngle', (t) => {
  const zman = makeZman();
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  t.is(f.format(zman.timeAtAngle(11.5, true)), '04:03:04');
  t.is(f.format(zman.timeAtAngle(3.7, true)), '04:57:50');
  t.is(f.format(zman.timeAtAngle(3.7, false)), '20:40:59');
  t.is(f.format(zman.timeAtAngle(11.5, false)), '21:35:53');
});
