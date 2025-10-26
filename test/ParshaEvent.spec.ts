import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import '../src/locale'; // Adds Hebrew and Ashkenazic translations
import {ParshaEvent} from '../src/ParshaEvent';

test('ParshaEvent-url', () => {
  const ev1 = new ParshaEvent({hdate: new HDate(new Date(2020, 4, 16)), parsha: ['Behar', 'Bechukotai'], il: false, num: [32, 33], chag: false});
  expect(ev1.url()).toBe('https://www.hebcal.com/sedrot/behar-bechukotai-20200516');
  const ev2 = new ParshaEvent({hdate: new HDate(new Date(2020, 5, 6)), parsha: ['Nasso'], il: false, num: 35, chag: false});
  expect(ev2.url()).toBe('https://www.hebcal.com/sedrot/nasso-20200606');
  const ev3 = new ParshaEvent({hdate: new HDate(new Date(2020, 5, 13)), parsha: ['Beha\'alotcha'], il: false, chag: false, num: 0});
  expect(ev3.url()).toBe('https://www.hebcal.com/sedrot/behaalotcha-20200613');
  const ev4 = new ParshaEvent({hdate: new HDate(new Date(2022, 3, 30)), parsha: ['Achrei Mot'], il: false, chag: false, num: 0});
  expect(ev4.url()).toBe('https://www.hebcal.com/sedrot/achrei-mot-20220430');
  const ev5 = new ParshaEvent({hdate: new HDate(new Date(2022, 3, 30)), parsha: ['Kedoshim'], il: true, chag: false, num: 0});
  expect(ev5.url()).toBe('https://www.hebcal.com/sedrot/kedoshim-20220430?i=on');
});

test('getString-locale', () => {
  const hd = new HDate(new Date(2020, 6, 7));
  const ev = new ParshaEvent({hdate: hd, parsha: ['Pinchas'], il: false, chag: false, num: 0});
  expect(ev.render('he')).toBe('פָּרָשַׁת פִּינְחָס');

  const hd2 = new HDate(new Date(2020, 2, 21));
  const ev2 = new ParshaEvent({hdate: hd2, parsha: ['Vayakhel', 'Pekudei'], il: false, chag: false, num: 0});
  expect(ev2.render('he')).toBe('פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי');
});

test('early-ce-url', () => {
  const ev = new ParshaEvent({hdate: new HDate(new Date(100, 9, 16)), parsha: ['Bereshit'], il: false, chag: false, num: 0});
  expect(ev.url()).toBe('https://www.hebcal.com/sedrot/bereshit-01001016');
  const dt = new Date(99, 11, 12);
  dt.setFullYear(99);
  const ev2 = new ParshaEvent({hdate: new HDate(dt), parsha: ['Vayechi'], il: false, chag: false, num: 0});
  expect(ev2.url()).toBe(undefined);
});

test('bce-url', () => {
  const ev = new ParshaEvent({
    hdate: new HDate(new Date(-428, 8, 30)), parsha: ['Bereshit'], il: false, chag: false, num: 0});
  expect(ev.url()).toBe(undefined);
});

test('render', () => {
  const ev = new ParshaEvent({
   hdate: new HDate(8, 'Tishrei', 5784),
   parsha: ['Ha\'azinu'],
   il: false,
   chag: false,
   num: 0,
  });
  expect(ev.getDesc()).toBe('Parashat Ha\'azinu');
  expect(ev.render('en')).toBe('Parashat Ha’azinu');
  expect(ev.render('a')).toBe('Parshas Ha’azinu');
  expect(ev.render('he-x-NoNikud')).toBe('פרשת האזינו');
  expect(ev.renderBrief('en')).toBe('Parashat Ha’azinu');
  expect(ev.renderBrief('a')).toBe('Parshas Ha’azinu');
  expect(ev.renderBrief('he-x-NoNikud')).toBe('פרשת האזינו');
});
