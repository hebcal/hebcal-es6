import test from 'ava';
import {Location} from './location';
import {makeCandleEvent, CandleLightingEvent, HavdalahEvent, TimedEvent} from './candles';
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
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, {candleLightingMins: -18});
    events.push(ev);
  }
  const result = events.map(eventDateDesc);
  const expected = [
    {date: '2020-05-15', desc: 'Candle lighting: 21:36'},
    {date: '2020-05-16', desc: 'Havdalah: 23:49'},
    {date: '2020-05-22', desc: 'Candle lighting: 21:52'},
    {date: '2020-05-23', desc: 'Havdalah: 00:31'},
    {date: '2020-05-29', desc: 'Candle lighting: 22:06'},
    null, // no tzeit
    {date: '2020-06-05', desc: 'Candle lighting: 22:18'},
    null, // no tzeit
  ];
  t.deepEqual(result, expected);

  const events2 = [];
  for (const dt of dates) {
    const hd = new HDate(new Date(dt[0], dt[1], dt[2]));
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, {
      candleLightingMins: -18,
      havdalahMins: 72,
    });
    events2.push(ev);
  }
  const result2 = events2.map(eventDateDesc);
  const expected2 = [
    {date: '2020-05-15', desc: 'Candle lighting: 21:36'},
    {date: '2020-05-16', desc: 'Havdalah (72 min): 23:09'},
    {date: '2020-05-22', desc: 'Candle lighting: 21:52'},
    {date: '2020-05-23', desc: 'Havdalah (72 min): 23:25'},
    {date: '2020-05-29', desc: 'Candle lighting: 22:06'},
    {date: '2020-05-30', desc: 'Havdalah (72 min): 23:39'},
    {date: '2020-06-05', desc: 'Candle lighting: 22:18'},
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
  t.is(events.length, 132);
  const ev0 = events[0];
  t.is(Boolean(ev0.getFlags() & flags.LIGHT_CANDLES), true);
  t.is(ev0.render('en'), 'Candle lighting: 16:12');
  t.is(ev0.getDesc(), 'Candle lighting');
  t.is(ev0.eventTimeStr, '16:12');
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
  t.is(ev.render('en'), 'Havdalah (47 min): 20:02');
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
    location: new Location(32.1836, 34.87386, true, 'Asia/Jerusalem'), // Ra'anana
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
  };
  const events30 = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected30 = [
    {date: '2020-05-01', time: '18:51', desc: 'Candle lighting'},
    {date: '2020-05-08', time: '18:56', desc: 'Candle lighting'},
    {date: '2020-05-15', time: '19:01', desc: 'Candle lighting'},
    {date: '2020-05-22', time: '19:06', desc: 'Candle lighting'},
    {date: '2020-05-28', time: '19:10', desc: 'Candle lighting'},
    {date: '2020-05-29', time: '19:10', desc: 'Candle lighting'},
  ];
  t.deepEqual(events30, expected30);
  delete options.candleLightingMins;
  const events18 = HebrewCalendar.calendar(options).map(eventTitleDateTime);
  const expected18 = [
    {date: '2020-05-01', time: '19:03', desc: 'Candle lighting'},
    {date: '2020-05-08', time: '19:08', desc: 'Candle lighting'},
    {date: '2020-05-15', time: '19:13', desc: 'Candle lighting'},
    {date: '2020-05-22', time: '19:18', desc: 'Candle lighting'},
    {date: '2020-05-28', time: '19:22', desc: 'Candle lighting'},
    {date: '2020-05-29', time: '19:22', desc: 'Candle lighting'},
  ];
  t.deepEqual(events18, expected18);
});

test('jerusalem40', (t) => {
  const options = {
    start: new Date(2020, 0, 1),
    end: new Date(2020, 2, 31),
    location: new Location(31.76904, 35.21633, true, 'Asia/Jerusalem', 'Jerusalem, Israel', 'IL'),
    candlelighting: true,
    havdalahMins: 0,
  };
  const events = HebrewCalendar.calendar(options);
  const candleEvents = events.filter((ev) => ev.getDesc() === 'Candle lighting');
  const items = candleEvents.map(eventTitleDateTime);
  const expected = [
    {date: '2020-01-03', time: '16:07', desc: 'Candle lighting'},
    {date: '2020-01-10', time: '16:12', desc: 'Candle lighting'},
    {date: '2020-01-17', time: '16:19', desc: 'Candle lighting'},
    {date: '2020-01-24', time: '16:25', desc: 'Candle lighting'},
    {date: '2020-01-31', time: '16:31', desc: 'Candle lighting'},
    {date: '2020-02-07', time: '16:38', desc: 'Candle lighting'},
    {date: '2020-02-14', time: '16:44', desc: 'Candle lighting'},
    {date: '2020-02-21', time: '16:50', desc: 'Candle lighting'},
    {date: '2020-02-28', time: '16:55', desc: 'Candle lighting'},
    {date: '2020-03-06', time: '17:00', desc: 'Candle lighting'},
    {date: '2020-03-13', time: '17:05', desc: 'Candle lighting'},
    {date: '2020-03-20', time: '17:10', desc: 'Candle lighting'},
    {date: '2020-03-27', time: '18:15', desc: 'Candle lighting'},
  ];
  t.deepEqual(items, expected);
});

test('jerusalem31', (t) => {
  const options = {
    start: new Date(2020, 2, 1),
    end: new Date(2020, 2, 31),
    location: new Location(31.76904, 35.21633, true, 'Asia/Jerusalem', 'Jerusalem, Israel', 'IL'),
    candlelighting: true,
    candleLightingMins: 31,
  };
  const events = HebrewCalendar.calendar(options);
  const candleEvents = events.filter((ev) => ev.getDesc() === 'Candle lighting');
  const items = candleEvents.map(eventTitleDateTime);
  const expected = [
    {date: '2020-03-06', time: '17:09', desc: 'Candle lighting'},
    {date: '2020-03-13', time: '17:14', desc: 'Candle lighting'},
    {date: '2020-03-20', time: '17:19', desc: 'Candle lighting'},
    {date: '2020-03-27', time: '18:24', desc: 'Candle lighting'},
  ];
  t.deepEqual(items, expected);
});

test('jerusalem18-forced-to-40', (t) => {
  const options = {
    start: new Date(2020, 2, 1),
    end: new Date(2020, 2, 31),
    location: new Location(31.76904, 35.21633, true, 'Asia/Jerusalem', 'Jerusalem, Israel', 'IL'),
    candlelighting: true,
    candleLightingMins: 18,
  };
  const events = HebrewCalendar.calendar(options);
  const candleEvents = events.filter((ev) => ev.getDesc() === 'Candle lighting');
  const items = candleEvents.map(eventTitleDateTime);
  const expected = [
    {date: '2020-03-06', time: '17:00', desc: 'Candle lighting'},
    {date: '2020-03-13', time: '17:05', desc: 'Candle lighting'},
    {date: '2020-03-20', time: '17:10', desc: 'Candle lighting'},
    {date: '2020-03-27', time: '18:15', desc: 'Candle lighting'},
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
    {date: '2020-12-10', time: '16:46', desc: 'Chanukah: 1 Candle'},
    {date: '2020-12-11', time: '15:56', desc: 'Chanukah: 2 Candles'},
    {date: '2020-12-11', time: '15:56', desc: 'Candle lighting'},
    {date: '2020-12-12', time: '17:01', desc: 'Chanukah: 3 Candles'},
    {date: '2020-12-12', time: '17:01', desc: 'Havdalah'},
    {date: '2020-12-13', time: '16:47', desc: 'Chanukah: 4 Candles'},
    {date: '2020-12-14', time: '16:47', desc: 'Chanukah: 5 Candles'},
    {date: '2020-12-15', time: '16:47', desc: 'Chanukah: 6 Candles'},
    {date: '2020-12-16', time: undefined, desc: 'Chag HaBanot'},
    {date: '2020-12-16', time: '16:48', desc: 'Chanukah: 7 Candles'},
    {date: '2020-12-16', time: undefined, desc: 'Rosh Chodesh Tevet'},
    {date: '2020-12-17', time: '16:48', desc: 'Chanukah: 8 Candles'},
    {date: '2020-12-18', time: undefined, desc: 'Chanukah: 8th Day'},
    {date: '2020-12-18', time: '15:58', desc: 'Candle lighting'},
    {date: '2020-12-19', time: '17:04', desc: 'Havdalah'},
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
    {date: '2021-06-27', time: '03:20', desc: 'Fast begins'},
    {date: '2021-06-27', time: undefined, desc: 'Tzom Tammuz'},
    {date: '2021-06-27', time: '21:07', desc: 'Fast ends'},
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
    {date: '2021-06-27', time: '03:20', desc: 'Fast begins'},
    {date: '2021-06-27', time: '21:07', desc: 'Fast ends'},
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
    {date: '2022-04-15', time: '04:37', desc: 'Fast begins'},
    {date: '2022-04-15', time: undefined, desc: 'Ta\'anit Bechorot'},
    {date: '2022-04-15', time: undefined, desc: 'Erev Pesach'},
    {date: '2022-04-15', time: '19:08', desc: 'Candle lighting'},
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
  const expected = [
    {date: '2023-07-26', time: '20:10', desc: 'Fast begins'},
    {date: '2023-07-26', time: undefined, desc: 'Erev Tish\'a B\'Av'},
    {date: '2023-07-27', time: undefined, desc: 'Tish\'a B\'Av'},
    {date: '2023-07-27', time: '20:48', desc: 'Fast ends'},
  ];
  t.deepEqual(events.map(eventTitleDateTime), expected);

  const events2 = HebrewCalendar.calendar({
    start: new Date(2022, 7, 6),
    end: new Date(2022, 7, 7),
    location,
    candlelighting: true,
  });
  const expected2 = [
    {date: '2022-08-06', time: undefined, desc: 'Shabbat Chazon'},
    {date: '2022-08-06', time: '19:58', desc: 'Fast begins'},
    {date: '2022-08-06', time: undefined, desc: 'Erev Tish\'a B\'Av'},
    {date: '2022-08-06', time: '20:44', desc: 'Havdalah'},
    {date: '2022-08-07', time: undefined, desc: 'Tish\'a B\'Av (observed)'},
    {date: '2022-08-07', time: '20:34', desc: 'Fast ends'},
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

  t.is(candleLighting.render('he'), 'הַדלָקָת נֵרוֹת: 20:12');
  t.is(candleLighting.renderBrief('he'), 'הַדלָקָת נֵרוֹת');
  t.is(havdalah.render('he'), 'הַבדָלָה (42 דקות): 20:12');
  t.is(havdalah.renderBrief('he'), 'הַבדָלָה (42 דקות)');
  t.is(havdalahTzeit.render('he'), 'הַבדָלָה: 20:12');
  t.is(havdalahTzeit.renderBrief('he'), 'הַבדָלָה');
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

test('candles-year101', (t) => {
  const options = {
    year: 101,
    noHolidays: true,
    location: Location.lookup('Boston'),
    candlelighting: true,
  };
  const events = HebrewCalendar.calendar(options);
  const actual = events.slice(0, 4).map(eventTitleDateTime);
  const expected = [
    {date: '0101-01-01', time: '17:16', desc: 'Havdalah'},
    {date: '0101-01-07', time: '16:16', desc: 'Candle lighting'},
    {date: '0101-01-08', time: '17:22', desc: 'Havdalah'},
    {date: '0101-01-14', time: '16:24', desc: 'Candle lighting'},
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
  });
  const actual = events.map(eventTitleDateTime);
  const expected = [
    {date: '2022-10-04', time: '18:02', desc: 'Candle lighting'},
    {date: '2022-10-05', time: '19:00', desc: 'Havdalah'},
  ];
  t.deepEqual(actual, expected);
});
