import {expect, test} from 'vitest';
/* eslint-disable max-len */
import {HDate, months} from '@hebcal/hdate';
import {Molad, MoladEvent} from '../src/molad';
import { Location } from '../src/location';

test('molad', () => {
  const items = [
    [months.CHESHVAN, 3, 14, 42, 14],
    [months.KISLEV, 5, 3, 26, 15],
    [months.TEVET, 6, 16, 10, 16],
    [months.SHVAT, 1, 4, 54, 17],
    [months.ADAR_I, 2, 17, 39, 0],
    [months.NISAN, 4, 6, 23, 1],
    [months.IYYAR, 5, 19, 7, 2],
    [months.SIVAN, 0, 7, 51, 3],
    [months.TAMUZ, 1, 20, 35, 4],
    [months.AV, 3, 9, 19, 5],
    [months.ELUL, 4, 22, 3, 6],
  ];
  for (const item of items) {
    const [month, dow, hour, minutes, chalakim] = item;
    const molad = new Molad(5769, month);
    expect(molad.getDow()).toBe(dow);
    expect(molad.getHour()).toBe(hour);
    expect(molad.getMinutes()).toBe(minutes);
    expect(molad.getChalakim()).toBe(chalakim);
    expect(molad.getYear()).toBe(5769);
    expect(molad.getMonth()).toBe(month);
  }
});

test('Molad.render', () => {
  const m = new Molad(5787, months.SIVAN);
  expect(m.render('en', {hour12: false}))
      .toBe('Molad Sivan: Fri, 35 minutes and 10 chalakim after 15:00');
  expect(m.render('en', {hour12: true}))
      .toBe('Molad Sivan: Fri, 35 minutes and 10 chalakim after 3:00pm');
  expect(m.render('he', {hour12: false}))
      .toBe('מוֹלָד הָלְּבָנָה סִיוָן יִהְיֶה בַּיּוֹם שִׁישִּׁי בשָׁבוּעַ, בְּשָׁעָה 15 בַּצׇּהֳרַיִים, ו-35 דַּקּוֹת ו-10 חֲלָקִים');
  const m2 = new Molad(5787, months.SHVAT);
  expect(m2.render('en', {hour12: false}))
      .toBe('Molad Sh’vat: Thu, 55 minutes and 5 chalakim after 23:00');
});

test('MoladEvent', () => {
  const loc = new Location(0, 0, false, 'UTC', 'Unknown', 'CA');
  const ev = new MoladEvent(new HDate(23, months.KISLEV, 5769),
      5769, months.TEVET, {location: loc});
  expect(ev.getDesc()).toBe('Molad Tevet 5769');
  expect(ev.render('en'))
      .toBe('Molad Tevet: Sat, 10 minutes and 16 chalakim after 4:00pm');
});

test('MoladEvent-he', () => {
  const hd = new HDate(new Date(2023, 10, 11));
  const ev = new MoladEvent(hd, hd.getFullYear(), months.KISLEV, {hour12: false});
  expect(ev.getDesc()).toBe('Molad Kislev 5784');
  expect(ev.render('en'))
      .toBe('Molad Kislev: Mon, 17 minutes and 2 chalakim after 7:00');
  expect(ev.render('he'))
      .toBe('מוֹלָד הָלְּבָנָה כִּסְלֵו יִהְיֶה בַּיּוֹם שֵׁנִי בשָׁבוּעַ, בְּשָׁעָה 7 בַּבֹּקֶר, ו-17 דַּקּוֹת ו-2 חֲלָקִים');
});

test('Molad-no-nikud', () => {
  const m = new Molad(5787, months.SIVAN);
  expect(m.render('he-x-NoNikud', {hour12: false}))
      .toBe('מולד הלבנה סיון יהיה ביום שישי בשבוע, בשעה 15 בצהריים, ו-35 דקות ו-10 חלקים');
});
