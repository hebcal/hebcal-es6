import test from 'ava';
import {HDate, hebrew2abs, abs2hebrew, HebrewDateEvent} from './hdate';
import {months} from './common';

test('mdy', (t) => {
  const CHESHVAN = months.CHESHVAN;
  let d = new HDate(29, CHESHVAN, 5769);
  let dt = d.greg(); // 2008-11-27
  t.is(d.getMonth(), CHESHVAN);
  t.is(d.getDate(), 29);
  t.is(d.getFullYear(), 5769);
  t.is(d.prev().getMonth(), CHESHVAN);
  t.is(d.next().getMonth(), months.KISLEV);
  t.is(d.abs(), 733373);
  t.is(dt.getMonth(), 10);
  t.is(dt.getDate(), 27);
  t.is(dt.getFullYear(), 2008);

  d = new HDate(4, months.TAMUZ, 5536);
  dt = d.greg(); // 1776-06-21
  t.is(d.getMonth(), months.TAMUZ);
  t.is(d.getDate(), 4);
  t.is(d.getFullYear(), 5536);
  t.is(d.abs(), 648478);
  t.is(dt.getMonth(), 5);
  t.is(dt.getDate(), 21);
  t.is(dt.getFullYear(), 1776);

  d = new HDate(3, months.TISHREI, 1003);
  dt = d.greg(); // -003262-09-09
  t.is(d.getMonth(), months.TISHREI);
  t.is(d.getDate(), 3);
  t.is(d.getFullYear(), 1003);
  t.is(d.abs(), -1007451);
  t.is(dt.getMonth(), 8);
  t.is(dt.getDate(), 9);
  t.is(dt.getFullYear(), -3262);
});

test('abs', (t) => {
  let d = new HDate(733359);
  t.is(d.getMonth(), months.CHESHVAN);
  t.is(d.getDate(), 15);
  t.is(d.getFullYear(), 5769);
  t.is(d.abs(), 733359);

  d = new HDate(295059);
  t.is(d.getMonth(), months.CHESHVAN);
  t.is(d.getDate(), 7);
  t.is(d.getFullYear(), 4569);
  t.is(d.abs(), 295059);

  d = new HDate(1);
  t.is(d.getMonth(), months.TEVET);
  t.is(d.getDate(), 18);
  t.is(d.getFullYear(), 3761);
  t.is(d.abs(), 1);
});

test('jsdate', (t) => {
  const d = new HDate(new Date(1751, 0, 1));
  t.is(d.getMonth(), months.TEVET);
  t.is(d.getDate(), 4);
  t.is(d.getFullYear(), 5511);
  t.is(d.abs(), 639175);
});

test('toString', (t) => {
  const d = new HDate(new Date(1751, 0, 1));
  t.is(d.toString(), '4 Tevet 5511');
});

test('hebrew2abs', (t) => {
  const abs = hebrew2abs({yy: 5769, mm: months.CHESHVAN, dd: 15});
  t.is(abs, 733359);
});

test('abs2hebrew', (t) => {
  const h = abs2hebrew(733359);
  t.is(h.yy, 5769);
  t.is(h.mm, months.CHESHVAN);
  t.is(h.dd, 15);
});

test('render', (t) => {
  const hd1 = new HebrewDateEvent(new HDate(29, 'Elul', 5779));
  const hd2 = new HebrewDateEvent(new HDate(1, 'Tishrei', 5780));
  t.is(hd1.render(), '29th of Elul, 5779');
  t.is(hd1.render('en'), '29th of Elul, 5779');
  t.is(hd1.render(''), '29th of Elul, 5779');
  t.is(hd1.render('ashkenazi'), '29th of Elul, 5779');
  t.is(hd1.render('he'), 'כ״ט אֱלוּל תשע״ט');
  t.is(hd2.render(), '1st of Tishrei, 5780');
  t.is(hd2.render(''), '1st of Tishrei, 5780');
  t.is(hd2.render('en'), '1st of Tishrei, 5780');
  t.is(hd2.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(hd2.render('he'), 'א׳ תִשְׁרֵי תש״פ');
});

test('renderGematriya', (t) => {
  t.is(new HDate(17, 'Tamuz', 5748).renderGematriya(), 'י״ז תַּמּוּז תשמ״ח');
  t.is(new HDate(20, 'Tishrei', 5780).renderGematriya(), 'כ׳ תִשְׁרֵי תש״פ');
});
