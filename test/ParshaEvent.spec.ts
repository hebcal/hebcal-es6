import {expect, test} from 'vitest';
import {HDate, Locale} from '@hebcal/hdate';
import '../src/locale'; // Adds Hebrew and Ashkenazic translations
import {ParshaEvent} from '../src/ParshaEvent';

test('ParshaEvent-url', () => {
  const ev1 = new ParshaEvent(new HDate(new Date(2020, 4, 16)), ['Behar', 'Bechukotai'], false, [32, 33]);
  expect(ev1.url()).toBe('https://www.hebcal.com/sedrot/behar-bechukotai-20200516');
  const ev2 = new ParshaEvent(new HDate(new Date(2020, 5, 6)), ['Nasso'], false, 35);
  expect(ev2.url()).toBe('https://www.hebcal.com/sedrot/nasso-20200606');
  const ev3 = new ParshaEvent(new HDate(new Date(2020, 5, 13)), ['Beha\'alotcha']);
  expect(ev3.url()).toBe('https://www.hebcal.com/sedrot/behaalotcha-20200613');
  const ev4 = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Achrei Mot']);
  expect(ev4.url()).toBe('https://www.hebcal.com/sedrot/achrei-mot-20220430');
  const ev5 = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Kedoshim'], true);
  expect(ev5.url()).toBe('https://www.hebcal.com/sedrot/kedoshim-20220430?i=on');
});

test('getString-locale', () => {
  Locale.useLocale('he');
  const hd = new HDate(new Date(2020, 6, 7));
  const ev = new ParshaEvent(hd, ['Pinchas'], false);
  expect(ev.render()).toBe('פָּרָשַׁת פִּינְחָס');

  const hd2 = new HDate(new Date(2020, 2, 21));
  const ev2 = new ParshaEvent(hd2, ['Vayakhel', 'Pekudei'], false);
  expect(ev2.render()).toBe('פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי');
});

test('early-ce-url', () => {
  const ev = new ParshaEvent(new HDate(new Date(100, 9, 16)), ['Bereshit']);
  expect(ev.url()).toBe('https://www.hebcal.com/sedrot/bereshit-01001016');
  const dt = new Date(99, 11, 12);
  dt.setFullYear(99);
  const ev2 = new ParshaEvent(new HDate(dt), ['Vayechi']);
  expect(ev2.url()).toBe(undefined);
});

test('bce-url', () => {
  const ev = new ParshaEvent(new HDate(new Date(-428, 8, 30)), ['Bereshit']);
  expect(ev.url()).toBe(undefined);
});

test('render', () => {
  const ev = new ParshaEvent(new HDate(8, 'Tishrei', 5784), ['Ha\'azinu']);
  expect(ev.getDesc()).toBe('Parashat Ha\'azinu');
  expect(ev.render('en')).toBe('Parashat Ha’azinu');
  expect(ev.render('a')).toBe('Parshas Ha’azinu');
  expect(ev.render('he-x-NoNikud')).toBe('פרשת האזינו');
  expect(ev.renderBrief('en')).toBe('Parashat Ha’azinu');
  expect(ev.renderBrief('a')).toBe('Parshas Ha’azinu');
  expect(ev.renderBrief('he-x-NoNikud')).toBe('פרשת האזינו');
});
