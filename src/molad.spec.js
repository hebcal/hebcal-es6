import test from 'ava';
import {Molad, MoladEvent} from './molad';
import {HDate, months} from './hdate';
import './locale-he';

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

test('MoladEvent', (t) => {
  const ev = new MoladEvent(new HDate(23, months.KISLEV, 5769), 5769, months.TEVET);
  t.is(ev.getDesc(), 'Molad Tevet 5769');
  t.is(ev.render('en'), 'Molad Tevet: Sat, 10 minutes and 16 chalakim after 16:00');
});

test('MoladEvent-he', (t) => {
  const hd = new HDate(new Date(2023, 9, 14));
  const ev = new MoladEvent(hd, hd.getFullYear(), months.TISHREI);
  t.is(ev.getDesc(), 'Molad Tishrei 5784');
  t.is(ev.render('en'), 'Molad Tishrei: Fri, 49 minutes and 0 chalakim after 5:00');
  // eslint-disable-next-line max-len
  t.is(ev.render('he'), 'מוֹלָד הָלְּבָנָה תִּשְׁרֵי יִהְיֶה בַּיּוֹם שִׁישִּׁי בשָׁבוּעַ, בְּשָׁעָה 5 בַּבֹּקֶר, ו-49 דַּקּוֹת ו-0 חֲלָקִים');
});
