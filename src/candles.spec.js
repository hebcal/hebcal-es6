import test from 'ava';
import {Location} from './location.js';
import {makeCandleEvent, CandleLightingEvent, HavdalahEvent, TimedEvent,
  makeFastStartEnd} from './candles.js';
import {HolidayEvent} from './holidays.js';
import {HDate} from './hdate.js';
import {flags} from './event.js';
import {HebrewCalendar} from './hebcal.js';
import {Zmanim} from './zmanim.js';

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  if (ev === null) {
    return null;
  }
  return {
    date: ev.getDate().greg().toISOString().substring(0, 10),
    desc: ev.render('en'),
  };
}

test('makeCandleEvent-nosunset', (t) => {
  const location = Location.lookup('Helsinki');

  const dates = [
    [2020, 4, 15],
    [2020, 4, 16],
    [2020, 4, 22],
    [2020, 4, 23],
    [2020, 4, 29],
    [2020, 4, 30],
    [2020, 5, 5],
    [2020, 5, 6],
  ];
  const events = [];
  for (const dt of dates) {
    const hd = new HDate(new Date(dt[0], dt[1], dt[2]));
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, {
      candleLightingMins: -18,
      useElevation: true,
    });
    events.push(ev);
  }
  const result = events.map(eventDateDesc);
  const expected = [
    {date: '2020-05-15', desc: 'Candle lighting: 21:38'},
    {date: '2020-05-16', desc: 'Havdalah: 23:49'},
    {date: '2020-05-22', desc: 'Candle lighting: 21:54'},
    {date: '2020-05-23', desc: 'Havdalah: 00:31'},
    {date: '2020-05-29', desc: 'Candle lighting: 22:08'},
    null, // no tzeit
    {date: '2020-06-05', desc: 'Candle lighting: 22:20'},
    null, // no tzeit
  ];
  t.deepEqual(result, expected);

  const events2 = [];
  for (const dt of dates) {
    const hd = new HDate(new Date(dt[0], dt[1], dt[2]));
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, {
      candleLightingMins: -18,
      havdalahMins: 72,
      useElevation: true,
    });
    events2.push(ev);
  }
  const result2 = events2.map(eventDateDesc);
  const expected2 = [
    {date: '2020-05-15', desc: 'Candle lighting: 21:38'},
    {date: '2020-05-16', desc: 'Havdalah (72 min): 23:11'},
    {date: '2020-05-22', desc: 'Candle lighting: 21:54'},
    {date: '2020-05-23', desc: 'Havdalah (72 min): 23:26'},
    {date: '2020-05-29', desc: 'Candle lighting: 22:08'},
    {date: '2020-05-30', desc: 'Havdalah (72 min): 23:41'},
    {date: '2020-06-05', desc: 'Candle lighting: 22:20'},
    {date: '2020-06-06', desc: 'Havdalah (72 min): 23:52'},
  ];
  t.deepEqual(result2, expected2);
});


test('candles-only-diaspora', (t) => {
  const options = {
    year: 1993,
    noHolidays: true,
    location: Location.lookup('Chicago'),
    candlelighting: true,
    useElevation: true,
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 132);
  const ev0 = events[0];
  t.is(Boolean(ev0.getFlags() & flags.LIGHT_CANDLES), true);
  t.is(ev0.render('en'), 'Candle lighting: 16:16');
  t.is(ev0.getDesc(), 'Candle lighting');
  t.is(ev0.eventTimeStr, '16:16');
  const ev1 = events[1];
  t.is(Boolean(ev1.getFlags() & flags.LIGHT_CANDLES_TZEIS), true);
  t.is(ev1.render('en'), 'Havdalah: 17:18');
  t.is(ev1.getDesc(), 'Havdalah');
  t.is(ev1.eventTimeStr, '17:18');
  const fastBegins = eventDateDesc(events[2]);
  t.deepEqual(fastBegins, {date: '1993-01-03', desc: 'Fast begins: 05:49'} );
});

// eslint-disable-next-line require-jsdoc
function eventTitleDateTime(ev) {
  const timeStr = ev.eventTime ?
    Zmanim.formatISOWithTimeZone(ev.location.getTzid(), ev.eventTime) :
    ev.getDate().greg().toISOString().substring(0, 10);
  return {
    dt: timeStr,
    desc: ev.getDesc(),
  };
}

test('candle-lighting-at-tzeit-motzei-shabbat', (t) => {
  const options = {
    start: new Date(2022, 5, 3),
    end: new Date(2022, 5, 6),
    noHolidays: true,
    location: Location.lookup('Miami'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  const actual = events.map(eventTitleDateTime);
  const expected = [
    {desc: 'Candle lighting', dt: '2022-06-03T19:51:00-04:00'},
    {desc: 'Candle lighting', dt: '2022-06-04T20:48:00-04:00'},
    {desc: 'Candle lighting', dt: '2022-06-05T20:49:00-04:00'},
    {desc: 'Havdalah', dt: '2022-06-06T20:49:00-04:00'},
  ];
  t.deepEqual(actual, expected);
});

test('havdalah-mins', (t) => {
  const options = {
    year: 2020,
    month: 4,
    noSpecialShabbat: true,
    havdalahMins: 47,
    location: Location.lookup('Providence'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options)
      .filter((ev) => ev.getDesc().startsWith('Havdalah'));
  const ev = events[0];
  t.is(ev.getFlags(), flags.LIGHT_CANDLES_TZEIS);
  t.is(ev.render('en'), 'Havdalah (47 min): 20:02');
  t.is(ev.getDesc(), 'Havdalah');
  t.is(ev.eventTimeStr, '20:02');
  const actual = events.slice(1, 5).map(eventTitleDateTime);
  const expected = [
    {dt: '2020-04-11T20:10:00-04:00', desc: 'Havdalah'},
    {dt: '2020-04-16T20:15:00-04:00', desc: 'Havdalah'},
    {dt: '2020-04-18T20:17:00-04:00', desc: 'Havdalah'},
    {dt: '2020-04-25T20:25:00-04:00', desc: 'Havdalah'},
  ];
  t.deepEqual(actual, expected, 'havadalah-47');
});

test('havdalah-zero-suppressed', (t) => {
  const options = {
    year: 2020,
    month: 4,
    noHolidays: true,
    noMinorFast: true,
    candlelighting: true,
    havdalahMins: 0,
    location: Location.lookup('Providence'),
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 8);
  const candlelighting = events.filter((ev) => ev.getDesc() == 'Candle lighting');
  t.is(candlelighting.length, 8);
  const havdalah = events.filter((ev) => ev.getDesc() == 'Havdalah');
  t.is(havdalah.length, 0);
});

test('havdalah-fixed-st-petersburg', (t) => {
  const options = {
    year: 2020,
    month: 6,
    noHolidays: true,
    candlelighting: true,
    havdalahMins: 42,
    location: Location.lookup('Saint Petersburg'),
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 8);
  const candlelighting = events.filter((ev) => ev.getDesc() == 'Candle lighting');
  t.is(candlelighting.length, 4);
  const havdalah = events.filter((ev) => ev.getDesc() == 'Havdalah');
  t.is(havdalah.length, 4);
});

test('havdalah-no-tzeit-st-petersburg', (t) => {
  const options = {
    year: 2020,
    month: 6,
    noHolidays: true,
    candlelighting: true,
    location: Location.lookup('Saint Petersburg'),
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 4);
  const candlelighting = events.filter((ev) => ev.getDesc() == 'Candle lighting');
  t.is(candlelighting.length, 4);
  const havdalah = events.filter((ev) => ev.getDesc() == 'Havdalah');
  t.is(havdalah.length, 0);
});

test('candles-only-israel', (t) => {
  const options = {
    year: 1993,
    noHolidays: true,
    location: new Location(32.1836, 34.87386, true, 'Asia/Jerusalem', 'Ra\'anana', 'IL', undefined, 1),
    il: true,
    candlelighting: true,
    noMinorFast: true,
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 119);
  t.is(events[0].getFlags(), flags.LIGHT_CANDLES, 'Candle lighting 0');
  t.is(events[33].getFlags(), flags.CHAG | flags.YOM_TOV_ENDS | flags.IL_ONLY, 'Havdalah in Israel on Pesach VII');
});

test('candleLightingMins', (t) => {
  const options = {
    year: 2020,
    month: 5,
    noHolidays: true,
    location: Location.lookup('Tel Aviv'),
    candlelighting: true,
    candleLightingMins: 30,
    havdalahMins: 0,
    useElevation: true,
  };
  const events30 = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected30 = [
    {dt: '2020-05-01T18:52:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-08T18:57:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-15T19:02:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-22T19:07:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-28T19:10:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-29T19:11:00+03:00', desc: 'Candle lighting'},
  ];
  t.deepEqual(events30, expected30);
  delete options.candleLightingMins;
  const events18 = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected18 = [
    {dt: '2020-05-01T19:04:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-08T19:09:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-15T19:14:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-22T19:19:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-28T19:22:00+03:00', desc: 'Candle lighting'},
    {dt: '2020-05-29T19:23:00+03:00', desc: 'Candle lighting'},
  ];
  t.deepEqual(events18, expected18);
});

const jerusalemSeaLevel = new Location(31.76904, 35.21633, true, 'Asia/Jerusalem',
    'Jerusalem, Israel', 'IL', undefined, 0);

test('jerusalem40', (t) => {
  const options = {
    start: new Date(2020, 0, 1),
    end: new Date(2020, 2, 31),
    location: jerusalemSeaLevel,
    candlelighting: true,
    havdalahMins: 0,
  };
  const events = HebrewCalendar.calendar(options);
  const candleEvents = events.filter((ev) => ev.getDesc() === 'Candle lighting');
  const items = candleEvents.map(eventTitleDateTime);
  const expected = [
    {dt: '2020-01-03T16:07:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-01-10T16:12:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-01-17T16:19:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-01-24T16:25:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-01-31T16:31:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-02-07T16:38:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-02-14T16:44:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-02-21T16:50:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-02-28T16:55:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-06T17:00:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-13T17:05:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-20T17:10:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-27T18:15:00+03:00', desc: 'Candle lighting'},
  ];
  t.deepEqual(items, expected);
});

test('jerusalem31', (t) => {
  const options = {
    start: new Date(2020, 2, 1),
    end: new Date(2020, 2, 31),
    location: jerusalemSeaLevel,
    candlelighting: true,
    candleLightingMins: 31,
  };
  const events = HebrewCalendar.calendar(options);
  const candleEvents = events.filter((ev) => ev.getDesc() === 'Candle lighting');
  const items = candleEvents.map(eventTitleDateTime);
  const expected = [
    {dt: '2020-03-06T17:09:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-13T17:14:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-20T17:19:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-27T18:24:00+03:00', desc: 'Candle lighting'},
  ];
  t.deepEqual(items, expected);
});

test('jerusalem18-forced-to-40', (t) => {
  const options = {
    start: new Date(2020, 2, 1),
    end: new Date(2020, 2, 31),
    location: jerusalemSeaLevel,
    candlelighting: true,
    candleLightingMins: 18,
  };
  const events = HebrewCalendar.calendar(options);
  const candleEvents = events.filter((ev) => ev.getDesc() === 'Candle lighting');
  const items = candleEvents.map(eventTitleDateTime);
  const expected = [
    {dt: '2020-03-06T17:00:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-13T17:05:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-20T17:10:00+02:00', desc: 'Candle lighting'},
    {dt: '2020-03-27T18:15:00+03:00', desc: 'Candle lighting'},
  ];
  t.deepEqual(items, expected);
});

test('chanukah-candles', (t) => {
  const options = {
    start: new Date(2020, 11, 9),
    end: new Date(2020, 11, 19),
    location: Location.lookup('Providence'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  const actual = events.map(eventTitleDateTime);
  const expected = [
    {dt: '2020-12-10T16:46:00-05:00', desc: 'Chanukah: 1 Candle'},
    {dt: '2020-12-11T15:56:00-05:00', desc: 'Chanukah: 2 Candles'},
    {dt: '2020-12-11T15:56:00-05:00', desc: 'Candle lighting'},
    {dt: '2020-12-12T17:01:00-05:00', desc: 'Chanukah: 3 Candles'},
    {dt: '2020-12-12T17:01:00-05:00', desc: 'Havdalah'},
    {dt: '2020-12-13T16:47:00-05:00', desc: 'Chanukah: 4 Candles'},
    {dt: '2020-12-14T16:47:00-05:00', desc: 'Chanukah: 5 Candles'},
    {dt: '2020-12-15T16:47:00-05:00', desc: 'Chanukah: 6 Candles'},
    {dt: '2020-12-16', desc: 'Chag HaBanot'},
    {dt: '2020-12-16T16:48:00-05:00', desc: 'Chanukah: 7 Candles'},
    {dt: '2020-12-16', desc: 'Rosh Chodesh Tevet'},
    {dt: '2020-12-17T16:48:00-05:00', desc: 'Chanukah: 8 Candles'},
    {dt: '2020-12-18', desc: 'Chanukah: 8th Day'},
    {dt: '2020-12-18T15:58:00-05:00', desc: 'Candle lighting'},
    {dt: '2020-12-19T17:04:00-05:00', desc: 'Havdalah'},
  ];
  t.deepEqual(actual, expected, 'chanukah-candles');
});

test('fastStartEnd-TzomTammuz', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2021, 5, 27),
    end: new Date(2021, 5, 27),
    location: Location.lookup('Providence'),
    candlelighting: true,
  });
  const expected = [
    {dt: '2021-06-27T03:20:00-04:00', desc: 'Fast begins'},
    {dt: '2021-06-27', desc: 'Tzom Tammuz'},
    {dt: '2021-06-27T21:07:00-04:00', desc: 'Fast ends'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);
  t.deepEqual(events[1].startEvent, events[0], 'startEvent');
  t.deepEqual(events[1].endEvent, events[2], 'endEvent');
});

test('fastStartEnd-withoutHoliday', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2021, 5, 27),
    end: new Date(2021, 5, 27),
    location: Location.lookup('Providence'),
    candlelighting: true,
    noHolidays: true,
  });
  const expected = [
    {dt: '2021-06-27T03:20:00-04:00', desc: 'Fast begins'},
    {dt: '2021-06-27T21:07:00-04:00', desc: 'Fast ends'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);
});

test('noMinorFast', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2021, 5, 27),
    end: new Date(2021, 5, 27),
    location: Location.lookup('Providence'),
    candlelighting: true,
    noMinorFast: true,
  });
  t.is(events.length, 0);
});

test('fastStartEnd-friday', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 3, 15),
    end: new Date(2022, 3, 15),
    location: Location.lookup('Providence'),
    candlelighting: true,
  });
  const expected = [
    {dt: '2022-04-15T04:37:00-04:00', desc: 'Fast begins'},
    {dt: '2022-04-15', desc: 'Ta\'anit Bechorot'},
    {dt: '2022-04-15', desc: 'Erev Pesach'},
    {dt: '2022-04-15T19:08:00-04:00', desc: 'Candle lighting'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);
});

test('fastStartEnd-9av', (t) => {
  const location = Location.lookup('Providence');
  const events = HebrewCalendar.calendar({
    start: new Date(2023, 6, 26),
    end: new Date(2023, 6, 27),
    location,
    candlelighting: true,
  });
  t.is(events.length, 4);
  const expected = [
    {dt: '2023-07-26T20:10:00-04:00', desc: 'Fast begins'},
    {dt: '2023-07-26', desc: 'Erev Tish\'a B\'Av'},
    {dt: '2023-07-27', desc: 'Tish\'a B\'Av'},
    {dt: '2023-07-27T20:48:00-04:00', desc: 'Fast ends'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);

  const events2 = HebrewCalendar.calendar({
    start: new Date(2022, 7, 6),
    end: new Date(2022, 7, 7),
    location,
    candlelighting: true,
  });
  const expected2 = [
    {dt: '2022-08-06', desc: 'Shabbat Chazon'},
    {dt: '2022-08-06T19:58:00-04:00', desc: 'Fast begins'},
    {dt: '2022-08-06', desc: 'Erev Tish\'a B\'Av'},
    {dt: '2022-08-06T20:44:00-04:00', desc: 'Havdalah'},
    {dt: '2022-08-07', desc: 'Tish\'a B\'Av (observed)'},
    {dt: '2022-08-07T20:34:00-04:00', desc: 'Fast ends'},
  ];
  t.deepEqual(events2.map(eventTitleDateTime), expected2);
});

test('no-chanukah-candles-when-noHolidays', (t) => {
  const options = {
    candlelighting: true,
    noHolidays: true,
    start: new Date(2020, 11, 9),
    end: new Date(2020, 11, 19),
    location: Location.lookup('Seattle'),
    useElevation: true,
  };
  const events = HebrewCalendar.calendar(options);
  const expected = [
    {dt: '2020-12-11T16:01:00-08:00', desc: 'Candle lighting'},
    {dt: '2020-12-12T17:10:00-08:00', desc: 'Havdalah'},
    {dt: '2020-12-18T16:02:00-08:00', desc: 'Candle lighting'},
    {dt: '2020-12-19T17:12:00-08:00', desc: 'Havdalah'},
  ];
  const actual = events.map(eventTitleDateTime);
  t.deepEqual(actual, expected);
});

test('renderBrief', (t) => {
  const dt = new Date('2020-12-28T20:12:14.987Z');
  const hd = new HDate(dt);
  const location = new Location(0, 0, false, 'UTC');
  const timed = new TimedEvent(hd, 'Foo Bar', 0, dt, location);
  const candleLighting = new CandleLightingEvent(hd, flags.LIGHT_CANDLES, dt, location);
  const havdalah = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location, 42);
  const havdalahTzeit = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location);

  t.is(timed.getDesc(), 'Foo Bar');
  t.is(timed.render('en'), 'Foo Bar: 20:12');
  t.is(timed.renderBrief('en'), 'Foo Bar');
  t.is(candleLighting.getDesc(), 'Candle lighting');
  t.is(candleLighting.render('en'), 'Candle lighting: 20:12');
  t.is(candleLighting.renderBrief('en'), 'Candle lighting');
  t.is(havdalah.getDesc(), 'Havdalah');
  t.is(havdalah.render('en'), 'Havdalah (42 min): 20:12');
  t.is(havdalah.renderBrief('en'), 'Havdalah (42 min)');
  t.is(havdalahTzeit.getDesc(), 'Havdalah');
  t.is(havdalahTzeit.render('en'), 'Havdalah: 20:12');
  t.is(havdalahTzeit.renderBrief('en'), 'Havdalah');

  t.is(candleLighting.render('he'), 'הַדְלָקַת נֵרוֹת: 20:12');
  t.is(candleLighting.renderBrief('he'), 'הַדְלָקַת נֵרוֹת');
  t.is(havdalah.render('he'), 'הַבְדָּלָה (42 דַּקּוֹת): 20:12');
  t.is(havdalah.renderBrief('he'), 'הַבְדָּלָה (42 דַּקּוֹת)');
  t.is(havdalahTzeit.render('he'), 'הַבְדָּלָה: 20:12');
  t.is(havdalahTzeit.renderBrief('he'), 'הַבְדָּלָה');
});

test('havdalahDeg', (t) => {
  const hd = new HDate(new Date(2020, 4, 16));
  const dow = hd.getDay();
  const location = new Location(0, 0, false, 'UTC');
  const events = [
    makeCandleEvent(undefined, hd, dow, location, {}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahDeg: 6.5}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahDeg: 7.0833}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahDeg: 7.5}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahDeg: 8.5}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahMins: 42}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahMins: 50}),
    makeCandleEvent(undefined, hd, dow, location, {havdalahMins: 72}),
  ];
  const results = events.map(eventDateDesc);
  const expected = [
    {date: '2020-05-16', desc: 'Havdalah: 18:32'},
    {date: '2020-05-16', desc: 'Havdalah: 18:24'},
    {date: '2020-05-16', desc: 'Havdalah: 18:26'},
    {date: '2020-05-16', desc: 'Havdalah: 18:28'},
    {date: '2020-05-16', desc: 'Havdalah: 18:32'},
    {date: '2020-05-16', desc: 'Havdalah (42 min): 18:42'},
    {date: '2020-05-16', desc: 'Havdalah (50 min): 18:50'},
    {date: '2020-05-16', desc: 'Havdalah (72 min): 19:12'},
  ];
  t.deepEqual(results, expected);
});

test.skip('candles-year101', (t) => {
  const options = {
    year: 101,
    noHolidays: true,
    location: Location.lookup('Boston'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  const actual = events.slice(0, 4).map(eventTitleDateTime);
  const expected = [
    {dt: '0101-01-01T17:16:56-04:57', desc: 'Havdalah'},
    {dt: '0101-01-07T16:16:56-04:57', desc: 'Candle lighting'},
    {dt: '0101-01-08T17:22:56-04:57', desc: 'Havdalah'},
    {dt: '0101-01-14T16:24:56-04:57', desc: 'Candle lighting'},
  ];
  t.deepEqual(actual, expected);
});

test('candles-year99-empty', (t) => {
  const options = {
    year: 99,
    noHolidays: true,
    location: Location.lookup('Boston'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  const expected = [];
  t.deepEqual(events, expected);
});

test('sedra-memo', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 4, 27),
    end: new Date(2022, 4, 27),
    noHolidays: true,
    location: Location.lookup('Miami'),
    candlelighting: true,
    sedrot: true,
    ashkenazi: true,
  });
  t.is(events[0].memo, 'Parshas Bechukosai');
});

test('emoji', (t) => {
  const dt = new Date('2020-12-28T20:12:14.987Z');
  const hd = new HDate(dt);
  const location = new Location(0, 0, false, 'UTC');
  const candleLighting = new CandleLightingEvent(hd, flags.LIGHT_CANDLES, dt, location);
  const havdalah = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location);
  t.is(candleLighting.getEmoji(), '🕯️');
  t.is(havdalah.getEmoji(), '✨');
});

test('yk-candles-only', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 9, 4),
    end: new Date(2022, 9, 5),
    noHolidays: true,
    location: Location.lookup('Boston'),
    candlelighting: true,
    useElevation: true,
  });
  const actual = events.map(eventTitleDateTime);
  const expected = [
    {dt: '2022-10-04T18:03:00-04:00', desc: 'Candle lighting'},
    {dt: '2022-10-05T19:00:00-04:00', desc: 'Havdalah'},
  ];
  t.deepEqual(actual, expected);
});

test('fastEndDeg', (t) => {
  const options = {
    start: new Date(2021, 5, 27),
    end: new Date(2021, 5, 27),
    location: Location.lookup('Providence'),
    candlelighting: true,
    fastEndDeg: 6.45,
  };
  const events = HebrewCalendar.calendar(options);
  const ev = events.filter((ev) => ev.getDesc() === 'Fast ends')[0];
  t.deepEqual(eventTitleDateTime(ev), {
    dt: '2021-06-27T21:02:00-04:00',
    desc: 'Fast ends',
  });

  options.fastEndDeg = 6.0;
  const events2 = HebrewCalendar.calendar(options);
  const ev2 = events2.filter((ev) => ev.getDesc() === 'Fast ends')[0];
  t.deepEqual(eventTitleDateTime(ev2), {
    dt: '2021-06-27T20:59:00-04:00',
    desc: 'Fast ends',
  });
});

test('makeFastStartEnd', (t) => {
  const location = Location.lookup('Providence');
  const hd = new HDate(8, 'Av', 5783);
  const ev = new HolidayEvent(hd, 'Erev Tish\'a B\'Av', flags.EREV | flags.MAJOR_FAST);
  const options = {
    location,
    candlelighting: true,
    fastEndDeg: 7.0833,
  };
  const ev2 = makeFastStartEnd(ev, options);
  const startEvent = ev2.startEvent;
  t.not(startEvent, null);
  t.is(startEvent.eventTime.toISOString(), '2023-07-27T00:10:00.000Z');
  t.is(startEvent.eventTimeStr, '20:10');
});
