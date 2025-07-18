import {expect, test} from 'vitest';
import {GeoLocation} from '@hebcal/noaa';
import {Zmanim} from '../src/zmanim';

// eslint-disable-next-line require-jsdoc
function makeZman() {
  const latitude = 41.85003;
  const longitude = -87.65005;
  const dt = new Date(2020, 5, 5, 12); // Friday June 5 2020
  const gloc = new GeoLocation(null, latitude, longitude, 0, 'America/Chicago');
  const zman = new Zmanim(gloc, dt, false);
  return zman;
}

// eslint-disable-next-line require-jsdoc
function makeZmanWithElevation() {
  const latitude = 39.73915;
  const longitude = -104.9847;
  const elevtion = 1636;
  const tzid = 'America/Denver';
  const dt = new Date(2020, 5, 5, 12); // Friday June 5 2020
  const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
  const zman = new Zmanim(gloc, dt, true);
  return zman;
}

test('zmanim', () => {
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
    alotHaShachar72: '04:04',
    misheyakir: '04:03',
    misheyakirMachmir: '04:12',
    dawn: '04:42',
    sunrise: '05:16',
    neitzHaChama: '05:16',
    sofZmanShmaMGA19Point8: '07:49',
    sofZmanShmaMGA16Point1: '08:07',
    sofZmanShmaMGA: '08:26',
    sofZmanShma: '09:02',
    sofZmanTfilla: '10:18',
    sofZmanTfillaMGA19Point8: '09:29',
    sofZmanTfillaMGA16Point1: '09:41',
    sofZmanTfillaMGA: '09:54',
    chatzot: '12:49',
    minchaGedola: '13:27',
    minchaGedolaMGA: '13:33',
    minchaKetana: '17:13',
    minchaKetanaMGA: '17:55',
    plagHaMincha: '18:48',
    sunset: '20:22',
    shkiah: '20:22',
    beinHaShmashos: '20:50',
    dusk: '20:56',
    tzeit: '21:13',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt).replace(/^24:/, '00:');
  }
  expect(actual).toEqual(expected);
});

test('zmanim-tlv', () => {
  const dt = new Date(2021, 2, 6, 12); // March 6 2021
  const tzid = 'Asia/Jerusalem';
  const gloc = new GeoLocation(null, 32.08088, 34.78057, 0, tzid);
  const zman = new Zmanim(gloc, dt, false);
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
    alotHaShachar72: '03/06/2021, 04:50:16',
    misheyakir: '03/06/2021, 05:11:52',
    misheyakirMachmir: '03/06/2021, 05:18:00',
    dawn: '03/06/2021, 05:37:49',
    sunrise: '03/06/2021, 06:02:16',
    neitzHaChama: '03/06/2021, 06:02:16',
    sofZmanShma: '03/06/2021, 08:57:17',
    sofZmanTfilla: '03/06/2021, 09:55:38',
    chatzot: '03/06/2021, 11:52:19',
    minchaGedola: '03/06/2021, 12:21:29',
    minchaGedolaMGA: '03/06/2021, 12:27:29',
    minchaKetana: '03/06/2021, 15:16:30',
    minchaKetanaMGA: '03/06/2021, 15:58:30',
    plagHaMincha: '03/06/2021, 16:29:26',
    sunset: '03/06/2021, 17:42:22',
    shkiah: '03/06/2021, 17:42:22',
    beinHaShmashos: '03/06/2021, 17:58:27',
    dusk: '03/06/2021, 18:06:50',
    tzeit: '03/06/2021, 18:18:39',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt);
  }
  expect(actual).toEqual(expected);
});

test('zmanim-denver', () => {
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

  /*
   * | Civil Date | Jun 5, 2020|
   * | Jewish Date | 13 Sivan, 5780|
   * | Day of Week | Fri|
   * | Parshas Hashavua / Yom Tov | |
   * | Alos 16.1° | 3:48:37 AM|
   * | Alos 72 Minutes | 4:12:30 AM|
   * | Misheyakir 10.2° | 4:32:14 AM|
   * | Sunrise (1636.0 Meters) | 5:24:30 AM|
   * | Sunrise (Sea Level) | 5:32:26 AM|
   * | Sof Zman Shma MGA 72 Minutes | 8:35:37 AM|
   * | Sof Zman Shma GRA | 9:11:37 AM|
   * | Sof Zman Tfila MGA 72 Minutes | 10:03:19 AM|
   * | Sof Zman Tfila GRA | 10:27:19 AM|
   * | Chatzos Astronomical | 12:58:30 PM|
   * | Mincha Gedola GRA | 1:36:35 PM|
   * | Plag Hamincha | 6:58:19 PM|
   * | Candle Lighting 18 Minutes | 8:07:01 PM|
   * | Sunset (Sea Level) | 8:25:01 PM|
   * | Sunset (1636.0 Meters) | 8:32:57 PM|
   * | Tzais Geonim 8.5° | 9:13:45 PM|
   * | Tzais 72 Minutes | 9:44:57 PM|
   * | Tzais 16.1° | 10:09:05 PM
   */
  const expected = {
    gregEve: '06/04/2020, 20:32:19',
    chatzotNight: '06/05/2020, 00:58:24',
    // "AlosHashachar": "2020-06-05T03:48:37-06:00",
    alotHaShachar: '06/05/2020, 03:48:37',
    alotHaShachar72: '06/05/2020, 04:12:30',
    misheyakir: '06/05/2020, 04:23:08',
    misheyakirMachmir: '06/05/2020, 04:32:14',
    // "BeginCivilTwilight": "2020-06-05T05:00:12-06:00",
    dawn: '06/05/2020, 05:00:12',
    // "Sunrise": "2020-06-05T05:24:30-06:00",
    sunrise: '06/05/2020, 05:24:30',
    // "SeaLevelSunrise": "2020-06-05T05:32:26-06:00",
    seaLevelSunrise: '06/05/2020, 05:32:26',
    neitzHaChama: '06/05/2020, 05:24:30',
    sofZmanShmaMGA19Point8: '06/05/2020, 08:07:51',
    sofZmanShmaMGA16Point1: '06/05/2020, 08:23:44',
    sofZmanShma: '06/05/2020, 09:11:37',
    sofZmanShmaMGA: '06/05/2020, 08:39:34', // 08:35:37 AM
    sofZmanTfilla: '06/05/2020, 10:27:19', // 10:03:19 AM
    sofZmanTfillaMGA19Point8: '06/05/2020, 09:44:53',
    sofZmanTfillaMGA16Point1: '06/05/2020, 09:55:26',
    // "SofZmanTfilaMGA": "2020-06-05T10:05:57-06:00",
    sofZmanTfillaMGA: '06/05/2020, 10:05:57',
    // "Chatzos": "2020-06-05T12:58:43-06:00",
    chatzot: '06/05/2020, 12:58:43',
    minchaGedola: '06/05/2020, 13:36:35',
    minchaGedolaMGA: '06/05/2020, 13:42:34',
    // @TODO "MinchaKetana": "2020-06-05T17:19:04-06:00",
    minchaKetana: '06/05/2020, 17:23:42',
    minchaKetanaMGA: '06/05/2020, 18:05:41',
    plagHaMincha: '06/05/2020, 18:58:19',
    seaLevelSunset: '06/05/2020, 20:25:01',
    // "Sunset": "2020-06-05T20:32:57-06:00",
    sunset: '06/05/2020, 20:32:57',
    shkiah: '06/05/2020, 20:32:57',
    // "EndCivilTwilight": "2020-06-05T20:57:18-06:00"
    dusk: '06/05/2020, 20:57:18',
    // "Tzais": "2020-06-05T21:13:45-06:00"
    tzeit: '06/05/2020, 21:13:45',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt).replace(/, 24:/, ', 00:');
  }
  expect(actual).toEqual(expected);

  // "Tzais72": "2020-06-05T21:37:01-06:00"
  expect(f.format(zman.sunsetOffset(72, false, true)))
      .toBe('06/05/2020, 21:37:01');
});

test('throws', () => {
  const gloc = new GeoLocation(null, 0, 0, 21, 'UTC');
  expect(() => {
    new Zmanim(gloc, 123);
  }).toThrow('invalid date: 123');
});

test('roundTime', () => {
  const dt50 = new Date(2021, 0, 31, 7, 30, 50, 551); // 2021-01-31T07:30:50.551Z
  const rounded50 = Zmanim.roundTime(dt50);
  expect(rounded50.getSeconds()).toBe(0);
  expect(rounded50.getMinutes()).toBe(31);
  expect(rounded50.getMilliseconds()).toBe(0);

  const dt30 = new Date(2021, 0, 31, 7, 30, 30, 551); // 2021-01-31T07:30:30.551Z
  const rounded30 = Zmanim.roundTime(dt30);
  expect(rounded30.getSeconds()).toBe(0);
  expect(rounded30.getMinutes()).toBe(31);
  expect(rounded30.getMilliseconds()).toBe(0);

  const dt17 = new Date(2021, 0, 31, 7, 30, 17, 551); // 2021-01-31T07:30:17.551Z
  const rounded17 = Zmanim.roundTime(dt17);
  expect(rounded17.getSeconds()).toBe(0);
  expect(rounded17.getMinutes()).toBe(30);
  expect(rounded17.getMilliseconds()).toBe(0);

  const dt0 = new Date(2021, 0, 31, 7, 30, 0, 123); // 2021-01-31T07:30:00.123Z
  const rounded0 = Zmanim.roundTime(dt0);
  expect(rounded0.getSeconds()).toBe(0);
  expect(rounded0.getMinutes()).toBe(30);
  expect(rounded0.getMilliseconds()).toBe(0);

  const dt299 = new Date(2021, 0, 31, 7, 45, 29, 997); // 2021-01-31T07:45:29.997Z
  const rounded299 = Zmanim.roundTime(dt299);
  expect(rounded299.getSeconds()).toBe(0);
  expect(rounded299.getMinutes()).toBe(45);
  expect(rounded299.getMilliseconds()).toBe(0);
});

test('timeZoneOffset', () => {
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
    expect(Zmanim.timeZoneOffset(tzid, winter)).toBe(wtz);
    expect(Zmanim.timeZoneOffset(tzid, summer)).toBe(stz);
  }
});

test.skip('timeZoneOffset-pacific', () => {
  const winter = new Date(Date.UTC(2020, 1, 22, 0, 0, 0, 0));
  const summer = new Date(Date.UTC(2020, 6, 22, 0, 0, 0, 0));
  const tzids = [
    ['Pacific/Auckland', '-11:00', '+12:00'],
    ['Pacific/Tarawa', '+12:00', '+12:00'],
    ['Pacific/Apia', '+14:00', '+13:00'],
  ];
  for (const [tzid, wtz, stz] of tzids) {
    expect(Zmanim.timeZoneOffset(tzid, winter)).toBe(wtz);
    expect(Zmanim.timeZoneOffset(tzid, summer)).toBe(stz);
  }
});

test('formatISOWithTimeZone', () => {
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
  expect(actual).toEqual(expected);
});

test('nightHourMins-dst', () => {
  const tzid = 'America/New_York';
  const gloc = new GeoLocation(null, 42.35843, -71.05977, 0, tzid); // Boston

  const dt0 = new Date(2022, 2, 12); // March 12, 2022 - before DST
  const zman0 = new Zmanim(gloc, dt0, false);
  expect(Zmanim.formatISOWithTimeZone(tzid, zman0.gregEve()))
      .toBe('2022-03-11T17:46:05-05:00');
  expect(Zmanim.formatISOWithTimeZone(tzid, zman0.sunset()))
      .toBe('2022-03-12T17:47:15-05:00');

  const dt1 = new Date(2022, 2, 13); // March 14, 2022
  const zman1 = new Zmanim(gloc, dt1, false);
  expect(Zmanim.formatISOWithTimeZone(tzid, zman1.gregEve()))
      .toBe('2022-03-12T17:47:15-05:00');
  expect(Zmanim.formatISOWithTimeZone(tzid, zman1.sunset()))
      .toBe('2022-03-13T18:48:25-04:00');

  const dt2 = new Date(2022, 2, 14); // March 14, 2022
  const zman2 = new Zmanim(gloc, dt2, false);
  expect(Zmanim.formatISOWithTimeZone(tzid, zman2.gregEve()))
      .toBe('2022-03-13T18:48:25-04:00');
  expect(Zmanim.formatISOWithTimeZone(tzid, zman2.sunset()))
      .toBe('2022-03-14T18:49:35-04:00');
});

test('bce', () => {
  const gloc = new GeoLocation(null, 41.85003, -87.65005, 0, 'UTC');
  const dt = new Date(-1234, 5, 5, 12, 0, 0);
  const zman = new Zmanim(gloc, dt, false);
  expect(zman.sunrise()).toEqual(new Date('-001234-06-05 10:08:09 UTC'));
  expect(zman.sunset()).toEqual(new Date('-001234-06-06 01:14:12 UTC'));
});

test('Zmanim.formatISOWithTimeZone-2021', () => {
  const dt = new Date(Date.UTC(2021, 0, 31, 7, 30, 50, 551));
  expect(Zmanim.formatISOWithTimeZone('UTC', dt))
      .toBe('2021-01-31T07:30:50-00:00');
  expect(Zmanim.formatISOWithTimeZone('America/New_York', dt))
      .toBe('2021-01-31T02:30:50-05:00');
  expect(Zmanim.formatISOWithTimeZone('America/Los_Angeles', dt))
      .toBe('2021-01-30T23:30:50-08:00');
});

test('Zmanim.formatISOWithTimeZone-1948', () => {
  const dt = new Date(Date.UTC(1948, 0, 31, 7, 30, 50, 551));
  expect(Zmanim.formatISOWithTimeZone('UTC', dt))
      .toBe('1948-01-31T07:30:50-00:00');
  expect(Zmanim.formatISOWithTimeZone('America/New_York', dt))
      .toBe('1948-01-31T02:30:50-05:00');
  expect(Zmanim.formatISOWithTimeZone('America/Los_Angeles', dt))
      .toBe('1948-01-30T23:30:50-08:00');
});

test('sunsetOffset', () => {
  const zman = makeZman();
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  expect(f.format(zman.sunriseOffset(10, true)))
      .toBe('05:26:00');
  expect(f.format(zman.sunriseOffset(10, false)))
      .toBe('05:26:18');
  expect(f.format(zman.sunsetOffset(10, true)))
      .toBe('20:32:00');
  expect(f.format(zman.sunsetOffset(10, false)))
      .toBe('20:32:29');
});

test('sunsetOffset-seaLevel', () => {
  const zman = makeZmanWithElevation();
  const tzid = 'America/Denver';
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  expect(f.format(zman.sunriseOffset(10, true))).toBe('05:35:00');
  expect(f.format(zman.sunriseOffset(10, false))).toBe('05:34:30');
  expect(f.format(zman.sunsetOffset(10, true))).toBe('20:43:00');

  zman.useElevation = false;
  expect(f.format(zman.sunriseOffset(10, true))).toBe('05:42:00');
  expect(f.format(zman.sunriseOffset(10, false))).toBe('05:42:26');
  expect(f.format(zman.sunsetOffset(10, true))).toBe('20:35:00');
  expect(f.format(zman.sunsetOffset(10, false))).toBe('20:35:01');
});

test('timeAtAngle', () => {
  const zman = makeZman();
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  expect(f.format(zman.timeAtAngle(11.5, true))).toBe('04:03:04');
  expect(f.format(zman.timeAtAngle(3.7, true))).toBe('04:57:50');
  expect(f.format(zman.timeAtAngle(3.7, false))).toBe('20:40:59');
  expect(f.format(zman.timeAtAngle(11.5, false))).toBe('21:35:53');
});

test('jlem-sunset', () => {
  const latitude = 31.76904;
  const longitude = 35.21633;
  const elevtion = 786;
  const tzid = 'Asia/Jerusalem';
  const gloc = new GeoLocation(null, latitude, longitude, elevtion, tzid);
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const toTest = [
    [new Date(2022, 8, 26), '18:35'], // Rosh Hashannah 9/26/2022
    [new Date(2022, 11, 19), '16:43'], // Hannukah 1 12/19/2022
    [new Date(2023, 3, 6), '19:06'], // Pesach 4/6/2023
    [new Date(2023, 5, 26), '19:53'], // Tisha B'Av 6/26/2023
  ];
  for (const [dt, expected] of toTest) {
    const zman = new Zmanim(gloc, dt, true);
    const sunset = zman.sunset();
    const actual = f.format(sunset);
    expect(actual).toBe(expected);
  }
});


test('zmanim-UTC', () => {
  const gloc = new GeoLocation(null, 0, 0, 21, 'UTC');
  const zman = new Zmanim(gloc, new Date(2020, 5, 5), true);
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: '2-digit',
    hour12: false,
  });

  /*
    "SofZmanShmaMGA": "2020-06-05T08:20:46+00:00",
    "SofZmanShmaGRA": "2020-06-05T08:56:46+00:00",
    "SofZmanTfilaMGA": "2020-06-05T09:33:23+00:00",
    "SofZmanTfilaGRA": "2020-06-05T09:57:23+00:00",
  */
  const expected = {
    alotHaShachar: '04:48:37',
    alotHaShachar72: '04:42:18',
    dawn: '05:32:33',
    sunrise: '05:54:18',
    seaLevelSunrise: '05:54:56',
    sofZmanShma: '08:56:27',
    sofZmanShmaMGA: '08:20:45',
    sofZmanShmaMGA19Point8: '08:15:32',
    sofZmanShmaMGA16Point1: '08:23:36',
    sofZmanTfilla: '09:57:10',
    sofZmanTfillaMGA: '09:33:22',
    sofZmanTfillaMGA19Point8: '09:29:53',
    sofZmanTfillaMGA16Point1: '09:35:16',
    chatzot: '11:58:36',
    minchaGedola: '12:28:57',
    minchaGedolaMGA: '12:34:56',
    minchaKetana: '15:31:06',
    minchaKetanaMGA: '16:13:05',
    plagHaMincha: '16:47:00',
    seaLevelSunset: '18:02:15',
    sunset: '18:02:53',
    beinHaShmashos: '18:15:51',
    dusk: '18:24:39',
    tzeit: '18:35:31',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt);
  }
  expect(actual).toEqual(expected);

  expect(f.format(zman.sunsetOffset(72, false, false))).toBe('19:14:53');
  expect(f.format(zman.sunsetOffset(72, false, true))).toBe('19:14:15');
});

test('zmanim-Beitar Ilit', () => {
  const latitude = 31.693;
  const longitude = 35.108;
  const elevation = 659.7;
  const tzid = 'Asia/Jerusalem';
  const gloc = new GeoLocation('Betar', latitude, longitude, elevation, tzid);
  const zman = new Zmanim(gloc, new Date(2024, 3, 23), false);
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
    sofZmanShmaMGA19Point8: '04/23/2024, 08:31:46',
    sofZmanShmaMGA16Point1: '04/23/2024, 08:41:36',
    sofZmanShmaMGA: '04/23/2024, 08:43:57',
    sofZmanShma: '04/23/2024, 09:19:58',
  };

  const actual = {};
  for (const func of Object.keys(expected)) {
    const dt = zman[func]();
    actual[func] = f.format(dt);
  }
  expect(actual).toEqual(expected);
});

test('useElevation', () => {
  const zman = makeZmanWithElevation(); // with useElevation=true
  expect(zman.getUseElevation()).toBe(true);
  zman.setUseElevation(false);
  expect(zman.getUseElevation()).toBe(false);
  zman.setUseElevation(true);
  expect(zman.getUseElevation()).toBe(true);

  const zman2 = makeZman(); // with useElevation=false
  expect(zman2.getUseElevation()).toBe(false);
  zman2.setUseElevation(true);
  expect(zman2.getUseElevation()).toBe(true);
  zman2.setUseElevation(false);
  expect(zman2.getUseElevation()).toBe(false);
});

test('makeSunsetAwareHDate', () => {
  const latitude = 48.85341;
  const longitude = 2.3488;
  const timezone = 'Europe/Paris';
  const gloc = new GeoLocation(null, latitude, longitude, 0, timezone);
  const before = Zmanim.makeSunsetAwareHDate(gloc, new Date('2024-09-22T17:38:46.123Z'), false);
  expect(before.toString()).toBe('19 Elul 5784');
  const after = Zmanim.makeSunsetAwareHDate(gloc, new Date('2024-09-22T23:45:18.345Z'), false);
  expect(after.toString()).toBe('20 Elul 5784');
});

test('formatTime', () => {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  expect(Zmanim.formatTime(new Date('2024-09-22T23:45:18.345Z'), f)).toBe('18:45');
  expect(Zmanim.formatTime(new Date(NaN), f)).toBe('XX:XX');
});
