import test from 'ava';
import {HebrewCalendar} from './hebcal.js';
import {HDate} from './hdate.js';
import {Event} from './event.js';

test('getHolidaysOnDate', (t) => {
  const hyear = 5771;
  const expected = [
    new HDate(1, 'Tishrei', hyear).abs() - 1, ['Erev Rosh Hashana'],
    new HDate(1, 'Tishrei', hyear), ['Rosh Hashana 5771'],
    new HDate(10, 'Tishrei', hyear), ['Yom Kippur'],
    new HDate(3, 'Cheshvan', hyear), undefined,
    new Date(2010, 11, 7), ['Chag HaBanot', 'Chanukah: 7 Candles', 'Rosh Chodesh Tevet'],
  ];
  for (let i = 0; i < expected.length; i += 2) {
    const dt = expected[i];
    const desc = expected[i + 1];
    const ev = HebrewCalendar.getHolidaysOnDate(dt);
    if (typeof desc === 'undefined') {
      t.is(ev, undefined, dt.toString());
    } else {
      t.is(Array.isArray(ev), true);
      t.is(ev[0] instanceof Event, true);
      const d = ev.map((e) => e.getDesc());
      t.deepEqual(d, desc, dt.toString());
    }
  }
});

test('getHolidaysOnDate-il', (t) => {
  const dtShavuot1 = new Date(2021, 4, 17);
  const dtShavuot2 = new Date(2021, 4, 18);
  const events0 = HebrewCalendar.getHolidaysOnDate(dtShavuot1);
  t.is(events0.length, 2);

  const events1il = HebrewCalendar.getHolidaysOnDate(dtShavuot1, true);
  t.is(events1il.length, 1);
  t.is(events1il[0].getDesc(), 'Shavuot');

  const events1diaspora = HebrewCalendar.getHolidaysOnDate(dtShavuot1, false);
  t.is(events1diaspora.length, 1);
  t.is(events1diaspora[0].getDesc(), 'Shavuot I');

  const events2d = HebrewCalendar.getHolidaysOnDate(dtShavuot2, false);
  t.is(events2d.length, 1);
  t.is(events2d[0].getDesc(), 'Shavuot II');

  const events2il = HebrewCalendar.getHolidaysOnDate(dtShavuot2, true);
  t.is(events2il.length, 0, 'expected no Shavuot II in Israel');
});

test('getHolidaysOnDate-cacheHit', (t) => {
  const dt = new Date(2023, 11, 13);
  const hd = new HDate(dt);
  const ev1 = HebrewCalendar.getHolidaysOnDate(dt, false);
  const ev2 = HebrewCalendar.getHolidaysOnDate(hd, false);
  const ev3 = HebrewCalendar.getHolidaysOnDate(dt, true);
  const ev4 = HebrewCalendar.getHolidaysOnDate(hd, true);
  const ev5 = HebrewCalendar.getHolidaysOnDate(dt);
  const ev6 = HebrewCalendar.getHolidaysOnDate(hd);
  t.deepEqual(ev1, ev2);
  t.deepEqual(ev1, ev3);
  t.deepEqual(ev1, ev4);
  t.deepEqual(ev1, ev5);
  t.deepEqual(ev1, ev6);
});

test('getHolidaysOnDate-neg-cacheHit', (t) => {
  const hd = new HDate(3, 'Cheshvan', 5771);
  const ev1 = HebrewCalendar.getHolidaysOnDate(hd, false);
  const ev2 = HebrewCalendar.getHolidaysOnDate(hd, false);
  const ev3 = HebrewCalendar.getHolidaysOnDate(hd.greg(), false);
  t.is(ev1, undefined);
  t.is(ev2, undefined);
  t.is(ev3, undefined);
});

test('getHolidaysOnDate does not include Mevarchim Chodesh', (t) => {
  // {date: '2011-05-28', desc: 'Shabbat Mevarchim Chodesh Sivan'}
  const events = HebrewCalendar.getHolidaysOnDate(new Date(2011, 4, 28), false);
  t.is(events, undefined);
});
