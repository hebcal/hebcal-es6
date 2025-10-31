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
      .toBe('Molad Sivan: Friday, 15:35 and 10 chalakim');
  expect(m.render('en', {hour12: true}))
      .toBe('Molad Sivan: Friday, 3:35pm and 10 chalakim');
  expect(m.render('he', {hour12: false}))
      .toBe('מוֹלָד הָלְּבָנָה סִיוָן יִהְיֶה בַּיּוֹם שִׁישִּׁי בשָׁבוּעַ, בְּשָׁעָה 15 בַּצׇּהֳרַיִים, ו-35 דַּקּוֹת ו-10 חֲלָקִים');
  const m2 = new Molad(5787, months.SHVAT);
  expect(m2.render('en', {hour12: false}))
      .toBe('Molad Sh’vat: Thursday, 23:55 and 5 chalakim');
});

test('MoladEvent', () => {
  const loc = new Location(0, 0, false, 'UTC', 'Unknown', 'CA');
  const ev = new MoladEvent(new HDate(23, months.KISLEV, 5769),
      5769, months.TEVET, {location: loc});
  expect(ev.getDesc()).toBe('Molad Tevet 5769');
  expect(ev.render('en'))
      .toBe('Molad Tevet: Saturday, 4:10pm and 16 chalakim');
});

test('MoladEvent-he', () => {
  const hd = new HDate(new Date(2023, 10, 11));
  const ev = new MoladEvent(hd, hd.getFullYear(), months.KISLEV, {hour12: false});
  expect(ev.getDesc()).toBe('Molad Kislev 5784');
  expect(ev.render('en'))
      .toBe('Molad Kislev: Monday, 7:17 and 2 chalakim');
  expect(ev.render('he'))
      .toBe('מוֹלָד הָלְּבָנָה כִּסְלֵו יִהְיֶה בַּיּוֹם שֵׁנִי בשָׁבוּעַ, בְּשָׁעָה 7 בַּבֹּקֶר, ו-17 דַּקּוֹת ו-2 חֲלָקִים');
});

test('Molad-no-nikud', () => {
  const m = new Molad(5787, months.SIVAN);
  expect(m.render('he-x-NoNikud', {hour12: false}))
      .toBe('מולד הלבנה סיון יהיה ביום שישי בשבוע, בשעה 15 בצהריים, ו-35 דקות ו-10 חלקים');
});

test('Molad.render with chalakim == 0', () => {
  // Using 5769 ADAR_I which has 0 chalakim (from test data above)
  const m0 = new Molad(5769, months.ADAR_I);
  expect(m0.getChalakim()).toBe(0);

  // Using 5787 SIVAN which has 10 chalakim (for comparison)
  const m10 = new Molad(5787, months.SIVAN);
  expect(m10.getChalakim()).toBe(10);

  // English: should not end with "and 0 chalakim"
  const enWith0 = m0.render('en', {hour12: false});
  const enWith10 = m10.render('en', {hour12: false});
  expect(enWith0).not.toContain('0 chalakim');
  expect(enWith0).toContain('Tuesday, 17:39');
  expect(enWith0.length).toBeLessThan(enWith10.length);

  // French: should not end with "and 0 chalakim"
  const frWith0 = m0.render('fr', {hour12: false});
  const frWith10 = m10.render('fr', {hour12: false});
  expect(frWith0).not.toContain('0 chalakim');
  expect(frWith0.length).toBeLessThan(frWith10.length);

  // Hebrew: should not end with "ו-0 חֲלָקִים"
  const heWith0 = m0.render('he', {hour12: false});
  const heWith10 = m10.render('he', {hour12: false});
  expect(heWith0).not.toContain('ו-0 חֲלָקִים');
  expect(heWith0.length).toBeLessThan(heWith10.length);
});

test('Molad Nisan 5787 with leading zero in minutes', () => {
  const m = new Molad(5787, months.NISAN);
  expect(m.getMinutes()).toBe(7);
  expect(m.getHour()).toBe(14);
  expect(m.getChalakim()).toBe(8);

  // Should format with leading zero: "2:07pm" not "2:7pm"
  expect(m.render('en', {hour12: true}))
      .toBe('Molad Nisan: Tuesday, 2:07pm and 8 chalakim');

  // 24-hour format should also have leading zero
  expect(m.render('en', {hour12: false}))
      .toBe('Molad Nisan: Tuesday, 14:07 and 8 chalakim');
});
