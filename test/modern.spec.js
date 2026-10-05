import {expect, test} from 'vitest';
import {isoDateString} from '@hebcal/hdate';
import {calendar} from '../src/calendar';
import {flags} from '../src/event';

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  const date = isoDateString(ev.greg());
  return {date, desc: ev.getDesc()};
}

test('Yom HaAliyah', () => {
  const events = calendar({year: 2038, il: true});
  const aliyah = events.filter(ev => ev.getDesc().startsWith('Yom HaAliyah'));
  expect(aliyah).toHaveLength(2);
  expect(aliyah[0].getDate().toString()).toBe('10 Nisan 5798');
  expect(aliyah[0].getDesc()).toBe('Yom HaAliyah');
  expect(aliyah[1].getDate().toString()).toBe('7 Cheshvan 5799');
  expect(aliyah[1].getDesc()).toBe('Yom HaAliyah School Observance');
});

test('modern', () => {
  const eventsDiaspora = calendar({
    year: 5801,
    isHebrewYear: true,
    il: false,
    mask: flags.MODERN_HOLIDAY,
  });
  expect(eventsDiaspora).toHaveLength(7);
  const actual = eventsDiaspora.map(ev => {
    const o = eventDateDesc(ev);
    if (ev.emoji) o.em = ev.emoji;
    return o;
  });
  const expected = [
    {date: '2040-10-01', desc: 'Swords of Iron War Memorial Day', em: '🇮🇱'},
    {date: '2040-11-05', desc: 'Sigd'},
    {date: '2041-04-11', desc: 'Yom HaAliyah', em: '🇮🇱'},
    {date: '2041-04-29', desc: 'Yom HaShoah'},
    {date: '2041-05-06', desc: 'Yom HaZikaron', em: '🇮🇱'},
    {date: '2041-05-07', desc: "Yom HaAtzma'ut", em: '🇮🇱'},
    {date: '2041-05-29', desc: 'Yom Yerushalayim', em: '🇮🇱'},
  ];
  expect(actual).toEqual(expected);
  const eventsIL = calendar({
    year: 5801,
    isHebrewYear: true,
    il: true,
    mask: flags.MODERN_HOLIDAY,
  });
  expect(eventsIL).toHaveLength(14);
  const actualIL = eventsIL.map(ev => {
    const o = eventDateDesc(ev);
    if (ev.emoji) o.em = ev.emoji;
    return o;
  });
  const expectedIL = [
    {date: '2040-10-01', desc: 'Swords of Iron War Memorial Day', em: '🇮🇱'},
    {date: '2040-10-14', desc: 'Yom HaAliyah School Observance', em: '🇮🇱'},
    {date: '2040-10-18', desc: 'Yitzhak Rabin Memorial Day', em: '🇮🇱'},
    {date: '2040-11-05', desc: 'Sigd'},
    {date: '2040-11-11', desc: 'Ben-Gurion Day', em: '🇮🇱'},
    {date: '2040-12-25', desc: 'Hebrew Language Day', em: '🇮🇱'},
    {date: '2041-02-01', desc: 'Family Day', em: '🇮🇱'},
    {date: '2041-04-11', desc: 'Yom HaAliyah', em: '🇮🇱'},
    {date: '2041-04-29', desc: 'Yom HaShoah'},
    {date: '2041-05-06', desc: 'Yom HaZikaron', em: '🇮🇱'},
    {date: '2041-05-07', desc: "Yom HaAtzma'ut", em: '🇮🇱'},
    {date: '2041-05-12', desc: 'Herzl Day', em: '🇮🇱'},
    {date: '2041-05-29', desc: 'Yom Yerushalayim', em: '🇮🇱'},
    {date: '2041-07-28', desc: 'Jabotinsky Day', em: '🇮🇱'},
  ];
  expect(actualIL).toEqual(expectedIL);
});

test('modernFriSatMovetoThu', () => {
  const events = calendar({year: 2020, il: true});
  const ev = events.find(ev => ev.getDesc() === 'Yitzhak Rabin Memorial Day');
  expect(ev.getDate().toString()).toBe('11 Cheshvan 5781');
  expect(ev.getDate().getDay()).toBe(4);
  const events2 = calendar({
    year: 5786,
    isHebrewYear: true,
    il: true,
  });
  const ev2 = events2.find(ev => ev.getDesc() === 'Hebrew Language Day');
  expect(ev2.getDate().toString()).toBe('19 Tevet 5786');
  expect(ev2.getDate().getDay()).toBe(4);
});

test('Swords of Iron War Memorial Day satPostponeToSun', () => {
  const desc = 'Swords of Iron War Memorial Day';
  // 24 Tishrei 5787 falls on a Monday, so it is observed on the day itself
  const events1 = calendar({year: 5787, isHebrewYear: true, il: true});
  const ev1 = events1.find(ev => ev.getDesc() === desc);
  expect(ev1.getDate().toString()).toBe('24 Tishrei 5787');
  expect(isoDateString(ev1.greg())).toBe('2026-10-05');
  expect(ev1.getDate().getDay()).toBe(1);
  // 24 Tishrei 5789 falls on Shabbat, so it is postponed to Sunday
  const events2 = calendar({year: 5789, isHebrewYear: true, il: true});
  const ev2 = events2.find(ev => ev.getDesc() === desc);
  expect(ev2.getDate().toString()).toBe('25 Tishrei 5789');
  expect(isoDateString(ev2.greg())).toBe('2028-10-15');
  expect(ev2.getDate().getDay()).toBe(0);
});
