import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {YomKippurKatanEvent} from '../src/YomKippurKatanEvent';
import {HebrewCalendar} from '../src/hebcal';
import {flags} from '../src/event';

test('render', () => {
  const date = new HDate(29, 'Cheshvan', 5782);
  const ykk = new YomKippurKatanEvent(date, 'Kislev');

  expect(ykk.render()).toBe('Yom Kippur Katan Kislev');
  expect(ykk.render('en')).toBe('Yom Kippur Katan Kislev');
  expect(ykk.render('')).toBe('Yom Kippur Katan Kislev');
  expect(ykk.render('s')).toBe('Yom Kippur Katan Kislev');
  expect(ykk.render('ashkenazi')).toBe('Yom Kippur Katan Kislev');
  expect(ykk.render('he')).toBe('יוֹם כִּפּוּר קָטָן כִּסְלֵו');
  expect(ykk.render('he-x-NoNikud')).toBe('יום כיפור קטן כסלו');
});

test('renderBrief', () => {
  const date = new HDate(29, 'Cheshvan', 5782);
  const ykk = new YomKippurKatanEvent(date, 'Kislev');

  expect(ykk.renderBrief()).toBe('Yom Kippur Katan');
  expect(ykk.renderBrief('en')).toBe('Yom Kippur Katan');
  expect(ykk.renderBrief('')).toBe('Yom Kippur Katan');
  expect(ykk.renderBrief('s')).toBe('Yom Kippur Katan');
  expect(ykk.renderBrief('ashkenazi')).toBe('Yom Kippur Katan');
  expect(ykk.renderBrief('he')).toBe('יוֹם כִּפּוּר קָטָן');
  expect(ykk.renderBrief('he-x-NoNikud')).toBe('יום כיפור קטן');
});

test('memo and flags', () => {
  const date = new HDate(29, 'Sivan', 5781);
  const ykk = new YomKippurKatanEvent(date, 'Tamuz');

  expect(ykk.memo).toBe('Minor Day of Atonement on the day preceeding Rosh Chodesh Tamuz');
  expect(ykk.getFlags()).toBe(flags.MINOR_FAST | flags.YOM_KIPPUR_KATAN);
  expect(ykk.url()).toBeUndefined();
  expect(ykk.basename()).toBe('Yom Kippur Katan Tamuz');
});

test('ykk-only calendar generation', () => {
  const events = HebrewCalendar.calendar({
    yomKippurKatan: true,
    noHolidays: true,
    year: 5782,
    isHebrewYear: true,
  });

  expect(events.length).toBe(9);
  const ev = events[0];
  expect(ev).toBeInstanceOf(YomKippurKatanEvent);
  expect(ev.memo).toBe('Minor Day of Atonement on the day preceeding Rosh Chodesh Kislev');
  expect(ev.render('en')).toBe('Yom Kippur Katan Kislev');
  expect(ev.render('he')).toBe('יוֹם כִּפּוּר קָטָן כִּסְלֵו');
});

test('non-leap year', () => {
  const events = HebrewCalendar.calendar({
    yomKippurKatan: true,
    noHolidays: true,
    year: 5783,
    isHebrewYear: true,
  });

  const ykkMonths = events.map(ev => ev.getDesc().replace('Yom Kippur Katan ', ''));
  const expected = [
    'Kislev', "Sh'vat",
    'Adar',   'Nisan',
    'Sivan',  'Tamuz',
    'Av',     'Elul'
  ];

  expect(ykkMonths).toEqual(expected);
});

test('leap year', () => {
  const events = HebrewCalendar.calendar({
    yomKippurKatan: true,
    noHolidays: true,
    year: 5784,
    isHebrewYear: true,
  });

  const ykkMonths = events.map(ev => ev.getDesc().replace('Yom Kippur Katan ', ''));
  const expected = [
    'Kislev',
    "Sh'vat",
    'Adar I',
    'Adar II',
    'Nisan',
    'Sivan',
    'Tamuz',
    'Av',
    'Elul'
  ];

  expect(ykkMonths).toEqual(expected);
});
