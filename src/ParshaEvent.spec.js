import test from 'ava';
import {HDate} from './hdate';
import {Locale} from './locale';
import {ParshaEvent} from './ParshaEvent';
import './locale-he';

test('ParshaEvent-url', (t) => {
  const ev1 = new ParshaEvent(new HDate(new Date(2020, 4, 16)), ['Behar', 'Bechukotai'], false, [32, 33]);
  t.is(ev1.url(), 'https://www.hebcal.com/sedrot/behar-bechukotai-20200516');
  const ev2 = new ParshaEvent(new HDate(new Date(2020, 5, 6)), ['Nasso'], false, 35);
  t.is(ev2.url(), 'https://www.hebcal.com/sedrot/nasso-20200606');
  const ev3 = new ParshaEvent(new HDate(new Date(2020, 5, 13)), ['Beha\'alotcha']);
  t.is(ev3.url(), 'https://www.hebcal.com/sedrot/behaalotcha-20200613');
  const ev4 = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Achrei Mot']);
  t.is(ev4.url(), 'https://www.hebcal.com/sedrot/achrei-mot-20220430');
  const ev5 = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Kedoshim'], true);
  t.is(ev5.url(), 'https://www.hebcal.com/sedrot/kedoshim-20220430?i=on');
});

test('getString-locale', (t) => {
  Locale.useLocale('he');
  const hd = new HDate(new Date(2020, 6, 7));
  const ev = new ParshaEvent(hd, ['Pinchas'], false);
  t.is(ev.render(), 'פָּרָשַׁת פִּינְחָס');

  const hd2 = new HDate(new Date(2020, 2, 21));
  const ev2 = new ParshaEvent(hd2, ['Vayakhel', 'Pekudei'], false);
  t.is(ev2.render(), 'פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי');
});

test('early-ce-url', (t) => {
  const ev = new ParshaEvent(new HDate(new Date(100, 9, 16)), ['Bereshit']);
  t.is(ev.url(), 'https://www.hebcal.com/sedrot/bereshit-01001016');
  const dt = new Date(99, 11, 12);
  dt.setFullYear(99);
  const ev2 = new ParshaEvent(new HDate(dt), ['Vayechi']);
  t.is(ev2.url(), undefined);
});

test('bce-url', (t) => {
  const ev = new ParshaEvent(new HDate(new Date(-428, 8, 30)), ['Bereshit']);
  t.is(ev.url(), undefined);
});
