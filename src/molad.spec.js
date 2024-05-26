/* eslint-disable max-len */
import test from 'ava';
import {HDate, months} from '@hebcal/hdate';
import {Molad, MoladEvent} from './molad.js';

test('molad', (t) => {
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
    t.is(molad.getDow(), dow);
    t.is(molad.getHour(), hour);
    t.is(molad.getMinutes(), minutes);
    t.is(molad.getChalakim(), chalakim);
    t.is(molad.getYear(), 5769);
    t.is(molad.getMonth(), month);
  }
});

test('Molad.render', (t) => {
  const m = new Molad(5787, months.SIVAN);
  t.is(m.render('en', {hour12: false}), 'Molad Sivan: Fri, 35 minutes and 10 chalakim after 15:00');
  t.is(m.render('en', {hour12: true}), 'Molad Sivan: Fri, 35 minutes and 10 chalakim after 3:00pm');
  t.is(m.render('he', {hour12: false}), 'מוֹלָד הָלְּבָנָה סִיוָן יִהְיֶה בַּיּוֹם שִׁישִּׁי בשָׁבוּעַ, בְּשָׁעָה 15 בַּצׇּהֳרַיִים, ו-35 דַּקּוֹת ו-10 חֲלָקִים');
  const m2 = new Molad(5787, months.SHVAT);
  t.is(m2.render('en', {hour12: false}), 'Molad Sh’vat: Thu, 55 minutes and 5 chalakim after 23:00');
});

test('MoladEvent', (t) => {
  const ev = new MoladEvent(new HDate(23, months.KISLEV, 5769),
      5769, months.TEVET, {location: {cc: 'CA'}});
  t.is(ev.getDesc(), 'Molad Tevet 5769');
  t.is(ev.render('en'), 'Molad Tevet: Sat, 10 minutes and 16 chalakim after 4:00pm');
});

test('MoladEvent-he', (t) => {
  const hd = new HDate(new Date(2023, 10, 11));
  const ev = new MoladEvent(hd, hd.getFullYear(), months.KISLEV, {hour12: false});
  t.is(ev.getDesc(), 'Molad Kislev 5784');
  t.is(ev.render('en'), 'Molad Kislev: Mon, 17 minutes and 2 chalakim after 7:00');
  t.is(ev.render('he'), 'מוֹלָד הָלְּבָנָה כִּסְלֵו יִהְיֶה בַּיּוֹם שֵׁנִי בשָׁבוּעַ, בְּשָׁעָה 7 בַּבֹּקֶר, ו-17 דַּקּוֹת ו-2 חֲלָקִים');
});

test('Molad-no-nikud', (t) => {
  const m = new Molad(5787, months.SIVAN);
  t.is(m.render('he-x-NoNikud', {hour12: false}), 'מולד הלבנה סיון יהיה ביום שישי בשבוע, בשעה 15 בצהריים, ו-35 דקות ו-10 חלקים');
});
