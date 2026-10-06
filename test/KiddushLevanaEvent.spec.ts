import {expect, test} from 'vitest';
import {HDate, months} from '@hebcal/hdate';
import {calendar} from '../src/calendar.js';
import {flags} from '../src/event.js';
import {KiddushLevanaEvent} from '../src/KiddushLevanaEvent.js';
import {Location} from '../src/location.js';

const newYork = Location.lookup('New York')!;
const jerusalem = Location.lookup('Jerusalem')!;

function kiddushLevana(
  location: Location,
  hyear: number,
  hmonth: number
): KiddushLevanaEvent {
  const events = calendar({
    year: hyear,
    isHebrewYear: true,
    month: hmonth,
    location,
    kiddushLevanaMaharil: true,
    noHolidays: true,
  });
  expect(events.length).toBe(1);
  const ev = events[0];
  expect(ev).toBeInstanceOf(KiddushLevanaEvent);
  return ev as KiddushLevanaEvent;
}

function summary(ev: KiddushLevanaEvent): string {
  const gregDate = ev.greg().toDateString();
  return `${ev.getDate().toString()} | ${gregDate} | ${ev.eventTimeStr}`;
}

test('weeknight, before midnight', () => {
  const ev = kiddushLevana(newYork, 5787, months.CHESHVAN);
  expect(summary(ev)).toBe('14 Cheshvan 5787 | Sun Oct 25 2026 | 21:44');
  expect(ev.render('en')).toBe('Latest Kiddush Levana: 9:44pm');
});

test('daytime is moved back to alot hashachar', () => {
  // Maharil's time is Tue Nov 24 2026 9:28am
  const ev = kiddushLevana(newYork, 5787, months.KISLEV);
  expect(summary(ev)).toBe('14 Kislev 5787 | Tue Nov 24 2026 | 05:27');
});

test('Motzei Shabbat is not moved', () => {
  const ev = kiddushLevana(newYork, 5787, months.ADAR_I);
  expect(summary(ev)).toBe('13 Adar I 5787 | Sat Feb 20 2027 | 23:40');
});

test('Shabbat and Yom Tov moves back to candle-lighting', () => {
  // Maharil's time is Shabbat Sep 26 2026 9:00am, first day of Sukkot
  const ev = kiddushLevana(newYork, 5787, months.TISHREI);
  expect(summary(ev)).toBe('14 Tishrei 5787 | Fri Sep 25 2026 | 18:30');
  const candles = calendar({
    start: ev.getDate(),
    end: ev.getDate(),
    location: newYork,
    candlelighting: true,
    noHolidays: true,
  });
  expect(candles.length).toBe(1);
  expect(candles[0].getDesc()).toBe('Candle lighting');
  expect((candles[0] as KiddushLevanaEvent).eventTimeStr).toBe(ev.eventTimeStr);
});

test('Shabbat followed by Pesach moves back to Friday', () => {
  // Maharil's time is Sunday Apr 3 1977, 15 Nisan (Pesach I)
  const ev = kiddushLevana(newYork, 5737, months.NISAN);
  expect(summary(ev)).toBe('13 Nisan 5737 | Fri Apr 01 1977 | 18:03');
});

test('Yom Tov in Israel uses Israeli candle-lighting', () => {
  // Jerusalem candle-lighting is 40 minutes before sunset
  const ev = kiddushLevana(jerusalem, 5784, months.NISAN);
  expect(summary(ev)).toBe('14 Nisan 5784 | Mon Apr 22 2024 | 18:33');
});

test('memo lists all four unadjusted times', () => {
  const ev = kiddushLevana(newYork, 5787, months.TISHREI);
  expect(ev.memo).toBe(
    [
      'Earliest Kiddush Levana (3 days): Mon, Sep 14, 2026, 2:39pm',
      'Earliest Kiddush Levana (7 days): Fri, Sep 18, 2026, 2:39pm',
      'Latest Kiddush Levana (Maharil): Sat, Sep 26, 2026, 9:00am',
      'Latest Kiddush Levana (15 days): Sat, Sep 26, 2026, 2:38pm',
    ].join('\n')
  );
});

test('render, categories, emoji and flags', () => {
  const ev = kiddushLevana(newYork, 5787, months.CHESHVAN);
  expect(ev.render('he')).toBe('סוֹף זְמַן קִדּוּשׁ לְבָנָה: 9:44pm');
  expect(ev.render('ashkenazi')).toBe('Latest Kiddush Levanah: 9:44pm');
  expect(ev.getCategories()).toEqual(['zmanim', 'kiddushLevana']);
  expect(ev.getEmoji()).toBe('🌔');
  expect(ev.flagNames()).toEqual(['KIDDUSH_LEVANA']);
  expect(ev.molad.getMonth()).toBe(months.CHESHVAN);
});

test('one event per month', () => {
  const events = calendar({
    year: 5787,
    isHebrewYear: true,
    location: newYork,
    kiddushLevanaMaharil: true,
    noHolidays: true,
  });
  expect(events.length).toBe(13);
  expect(events.every(ev => ev instanceof KiddushLevanaEvent)).toBe(true);
});

test('only emitted when its date is in range', () => {
  const options = {
    location: newYork,
    kiddushLevanaMaharil: true,
    noHolidays: true,
  };
  const before = calendar({
    ...options,
    start: new HDate(1, months.TISHREI, 5787),
    end: new HDate(13, months.TISHREI, 5787),
  });
  expect(before.length).toBe(0);
  const after = calendar({
    ...options,
    start: new HDate(15, months.TISHREI, 5787),
    end: new HDate(29, months.TISHREI, 5787),
  });
  expect(after.length).toBe(0);
  const onDate = calendar({
    ...options,
    start: new HDate(14, months.TISHREI, 5787),
    end: new HDate(14, months.TISHREI, 5787),
  });
  expect(onDate.length).toBe(1);
});

test('mask enables the option', () => {
  const events = calendar({
    year: 5787,
    isHebrewYear: true,
    month: months.CHESHVAN,
    location: newYork,
    mask: flags.KIDDUSH_LEVANA,
  });
  expect(events.length).toBe(1);
  expect(events[0]).toBeInstanceOf(KiddushLevanaEvent);
  expect((events[0] as KiddushLevanaEvent).eventTimeStr).toBe('21:44');
});

test('requires location', () => {
  expect(() => calendar({kiddushLevanaMaharil: true})).toThrow(
    'options.kiddushLevanaMaharil requires valid options.location'
  );
});
