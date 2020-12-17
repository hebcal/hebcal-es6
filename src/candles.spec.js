import test from 'ava';
import {Location} from './location';
import {makeCandleEvent} from './candles';
import {HDate} from './hdate';
import {flags} from './event';
import {HebrewCalendar} from './hebcal';

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  if (ev === null) {
    return null;
  }
  return {
    date: ev.getDate().greg().toISOString().substring(0, 10),
    desc: ev.render(),
  };
}

test('makeCandleEvent-nosunset', (t) => {
  const location = Location.lookup('Helsinki');

  const timeFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: location.tzid,
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });

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
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, timeFormat, 18);
    events.push(ev);
  }
  const result = events.map(eventDateDesc);
  const expected = [
    {date: '2020-05-15', desc: 'Candle lighting: 22:12'},
    {date: '2020-05-16', desc: 'Havdalah: 23:49'},
    {date: '2020-05-22', desc: 'Candle lighting: 22:28'},
    {date: '2020-05-23', desc: 'Havdalah: 00:31'},
    {date: '2020-05-29', desc: 'Candle lighting: 22:43'},
    null, // no tzeit
    {date: '2020-06-05', desc: 'Candle lighting: 22:55'},
    null, // no tzeit
  ];
  t.deepEqual(result, expected);

  const events2 = [];
  for (const dt of dates) {
    const hd = new HDate(new Date(dt[0], dt[1], dt[2]));
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, timeFormat, 18, 72);
    events2.push(ev);
  }
  const result2 = events2.map(eventDateDesc);
  const expected2 = [
    {date: '2020-05-15', desc: 'Candle lighting: 22:12'},
    {date: '2020-05-16', desc: 'Havdalah (72 min): 23:09'},
    {date: '2020-05-22', desc: 'Candle lighting: 22:28'},
    {date: '2020-05-23', desc: 'Havdalah (72 min): 23:25'},
    {date: '2020-05-29', desc: 'Candle lighting: 22:43'},
    {date: '2020-05-30', desc: 'Havdalah (72 min): 23:39'},
    {date: '2020-06-05', desc: 'Candle lighting: 22:55'},
    {date: '2020-06-06', desc: 'Havdalah (72 min): 23:50'},
  ];
  t.deepEqual(result2, expected2);
});


test('candles-only-diaspora', (t) => {
  const options = {
    year: 1993,
    noHolidays: true,
    location: Location.lookup('Chicago'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 120);
  t.is(events[0].getFlags(), flags.LIGHT_CANDLES);
  t.is(events[0].render(), 'Candle lighting: 16:10');
  t.is(events[0].getDesc(), 'Candle lighting');
  t.is(events[0].eventTimeStr, '16:10');
  t.is(events[1].getFlags(), flags.LIGHT_CANDLES_TZEIS);
  t.is(events[1].render(), 'Havdalah: 17:16');
  t.is(events[1].getDesc(), 'Havdalah');
  t.is(events[1].eventTimeStr, '17:16');
  t.is(events[48].getFlags(), flags.LIGHT_CANDLES);
});

// eslint-disable-next-line require-jsdoc
function eventTitleDateTime(ev) {
  return {
    date: ev.getDate().greg().toISOString().substring(0, 10),
    time: ev.eventTimeStr,
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
  const events = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected = [
    {desc: 'Candle lighting', date: '2022-06-03', time: '19:51'},
    {desc: 'Candle lighting', date: '2022-06-04', time: '20:48'},
    {desc: 'Candle lighting', date: '2022-06-05', time: '20:49'},
    {desc: 'Havdalah', date: '2022-06-06', time: '20:49'},
  ];
  t.deepEqual(events, expected);
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
  t.is(ev.render(), 'Havdalah (47 min): 20:02');
  t.is(ev.getDesc(), 'Havdalah');
  t.is(ev.eventTimeStr, '20:02');
  const actual = events.slice(1, 5).map(eventTitleDateTime);
  const expected = [
    {date: '2020-04-11', time: '20:10', desc: 'Havdalah'},
    {date: '2020-04-16', time: '20:15', desc: 'Havdalah'},
    {date: '2020-04-18', time: '20:17', desc: 'Havdalah'},
    {date: '2020-04-25', time: '20:25', desc: 'Havdalah'},
  ];
  t.deepEqual(actual, expected, 'havadalah-47');
});

test('havdalah-zero-suppressed', (t) => {
  const options = {
    year: 2020,
    month: 4,
    noHolidays: true,
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
    location: new Location(32.1836, 34.87386, true, 'Asia/Jerusalem'), // Ra'anana
    il: true,
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 117);
  t.is(events[0].getFlags(), flags.LIGHT_CANDLES, 'Candle lighting 0');
  t.is(events[33].getFlags(), flags.CHAG | flags.YOM_TOV_ENDS | flags.IL_ONLY, 'Havdalah in Israel on Pesach VII');
});

test('candleLightingMins', (t) => {
  const options = {
    year: 2020,
    month: 1,
    noHolidays: true,
    location: Location.lookup('Tel Aviv'),
    candlelighting: true,
    candleLightingMins: 30,
    havdalahMins: 0,
  };
  const events30 = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected30 = [
    {date: '2020-01-03', time: '16:17', desc: 'Candle lighting'},
    {date: '2020-01-10', time: '16:23', desc: 'Candle lighting'},
    {date: '2020-01-17', time: '16:29', desc: 'Candle lighting'},
    {date: '2020-01-24', time: '16:35', desc: 'Candle lighting'},
    {date: '2020-01-31', time: '16:42', desc: 'Candle lighting'},
  ];
  t.deepEqual(events30, expected30);
  delete options.candleLightingMins;
  const events18 = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected18 = [
    {date: '2020-01-03', time: '16:29', desc: 'Candle lighting'},
    {date: '2020-01-10', time: '16:35', desc: 'Candle lighting'},
    {date: '2020-01-17', time: '16:41', desc: 'Candle lighting'},
    {date: '2020-01-24', time: '16:47', desc: 'Candle lighting'},
    {date: '2020-01-31', time: '16:54', desc: 'Candle lighting'},
  ];
  t.deepEqual(events18, expected18);
});

test('jerusalem40', (t) => {
  const options = {
    year: 2020,
    month: 1,
    noHolidays: true,
    location: new Location(31.76904, 35.21633, true, 'Asia/Jerusalem', 'Jerusalem, Israel', 'IL'),
    candlelighting: true,
    havdalahMins: 0,
  };
  const events = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected = [
    {date: '2020-01-03', time: '16:06', desc: 'Candle lighting'},
    {date: '2020-01-10', time: '16:12', desc: 'Candle lighting'},
    {date: '2020-01-17', time: '16:18', desc: 'Candle lighting'},
    {date: '2020-01-24', time: '16:24', desc: 'Candle lighting'},
    {date: '2020-01-31', time: '16:30', desc: 'Candle lighting'},
  ];
  t.deepEqual(events, expected);
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
    {date: '2020-12-10', time: '16:46', desc: 'Chanukah: 1 Candle'},
    {date: '2020-12-11', time: '15:56', desc: 'Chanukah: 2 Candles'},
    {date: '2020-12-11', time: '15:56', desc: 'Candle lighting'},
    {date: '2020-12-12', time: '17:01', desc: 'Chanukah: 3 Candles'},
    {date: '2020-12-12', time: '17:01', desc: 'Havdalah'},
    {date: '2020-12-13', time: '16:46', desc: 'Chanukah: 4 Candles'},
    {date: '2020-12-14', time: '16:47', desc: 'Chanukah: 5 Candles'},
    {date: '2020-12-15', time: '16:47', desc: 'Chanukah: 6 Candles'},
    {date: '2020-12-16', time: '16:47', desc: 'Chanukah: 7 Candles'},
    {date: '2020-12-16', time: undefined, desc: 'Rosh Chodesh Tevet'},
    {date: '2020-12-17', time: '16:48', desc: 'Chanukah: 8 Candles'},
    {date: '2020-12-18', time: undefined, desc: 'Chanukah: 8th Day'},
    {date: '2020-12-18', time: '15:58', desc: 'Candle lighting'},
    {date: '2020-12-19', time: '17:04', desc: 'Havdalah'},
  ];
  t.deepEqual(actual, expected, 'chanukah-candles');
});

test('fastStartEnd', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2021, 5, 27),
    end: new Date(2021, 5, 27),
    location: Location.lookup('Providence'),
    candlelighting: true,
  });
  const expected = [
    {date: '2021-06-27', time: '03:19', desc: 'Fast begins'},
    {date: '2021-06-27', time: undefined, desc: 'Tzom Tammuz'},
    {date: '2021-06-27', time: '21:06', desc: 'Fast ends'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);
});

test('fastStartEnd-friday', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 3, 15),
    end: new Date(2022, 3, 15),
    location: Location.lookup('Providence'),
    candlelighting: true,
  });
  const expected = [
    {date: '2022-04-15', time: '04:37', desc: 'Fast begins'},
    {date: '2022-04-15', time: undefined, desc: 'Ta\'anit Bechorot'},
    {date: '2022-04-15', time: undefined, desc: 'Erev Pesach'},
    {date: '2022-04-15', time: '19:08', desc: 'Candle lighting'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);
});

test('fastStartEnd-9av', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2023, 6, 26),
    end: new Date(2023, 6, 27),
    location: Location.lookup('Providence'),
    candlelighting: true,
  });
  const expected = [
    {date: '2023-07-26', time: '20:10', desc: 'Fast begins'},
    {date: '2023-07-26', time: undefined, desc: 'Erev Tish\'a B\'Av'},
    {date: '2023-07-27', time: undefined, desc: 'Tish\'a B\'Av'},
    {date: '2023-07-27', time: '20:48', desc: 'Fast ends'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);
});

test('no-chanukah-candles-when-noHolidays', (t) => {
  const options = {
    candlelighting: true,
    noHolidays: true,
    start: new Date(2020, 11, 9),
    end: new Date(2020, 11, 19),
    location: Location.lookup('Seattle'),
  };
  const events = HebrewCalendar.calendar(options);
  const expected = [
    {date: '2020-12-11', time: '15:59', desc: 'Candle lighting'},
    {date: '2020-12-12', time: '17:10', desc: 'Havdalah'},
    {date: '2020-12-18', time: '16:01', desc: 'Candle lighting'},
    {date: '2020-12-19', time: '17:12', desc: 'Havdalah'},
  ];
  const actual = events.map(eventTitleDateTime);
  t.deepEqual(actual, expected);
});
