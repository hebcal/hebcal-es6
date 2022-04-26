import test from 'ava';
import {OmerEvent} from './omer';
import {HDate} from './hdate';
import './locale-he';

test('render', (t) => {
  const o1 = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  t.is(o1.render(), '1st day of the Omer');
  t.is(o1.getDesc(), 'Omer 1');
  t.is(o1.renderBrief(), 'Omer day 1');
  t.is(o1.render('he'), 'א׳ בָּעוֹמֶר');
  t.is(o1.renderBrief('he'), 'עוֹמֶר יוֹם 1');
  const o33 = new OmerEvent(new HDate(18, 'Iyyar', 5770), 33);
  t.is(o33.render(), '33rd day of the Omer');
  t.is(o33.getDesc(), 'Omer 33');
  t.is(o33.renderBrief(), 'Omer day 33');
  t.is(o33.render('he'), 'ל״ג בָּעוֹמֶר');
  t.is(o33.renderBrief('he'), 'עוֹמֶר יוֹם 33');
  const o42 = new OmerEvent(new HDate(27, 'Iyyar', 5770), 42);
  t.is(o42.render(), '42nd day of the Omer');
  t.is(o42.getDesc(), 'Omer 42');
  t.is(o42.renderBrief(), 'Omer day 42');
  t.is(o42.render('he'), 'מ״ב בָּעוֹמֶר');
  t.is(o42.renderBrief('he'), 'עוֹמֶר יוֹם 42');
  t.is(o42.render('es'), '42º day of the Omer');
  t.is(o42.render('de'), '42. day of the Omer');
  t.is(o42.render('fr'), '42. day of the Omer');
});

test('sefira', (t) => {
  const omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.sefira('en'), 'Eternity within Majesty');
  t.is(omer.sefira('he'), 'נֶּֽצַח שֶׁבְּמַּלְכוּת');
  t.is(omer.sefira('translit'), 'Netzach sheb\'Malkhut');
  t.is(omer.sefira('bogus'), 'Eternity within Majesty');
  t.is(omer.sefira(), 'Eternity within Majesty');
});

test('memo-and-days-weeks', (t) => {
  let omer = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  t.is(omer.memo, `Lovingkindness within Lovingkindness\nחֶֽסֶד שֶׁבְּחֶֽסֶד\nChesed sheb'Chesed`);
  t.is(omer.getTodayIs('en'), 'Today is 1 day of the Omer');

  omer = new OmerEvent(new HDate(17, 'Nisan', 5770), 2);
  t.is(omer.memo, `Might within Lovingkindness\nגְבוּרָה שֶׁבְּחֶֽסֶד\nGevurah sheb'Chesed`);
  t.is(omer.getTodayIs('en'), 'Today is 2 days of the Omer');

  omer = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  t.is(omer.memo, `Majesty within Lovingkindness\nמַּלְכוּת שֶׁבְּחֶֽסֶד\nMalkhut sheb'Chesed`);
  t.is(omer.getTodayIs('en'), 'Today is 7 days, which is 1 week of the Omer');

  omer = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  t.is(omer.memo, `Lovingkindness within Might\nחֶֽסֶד שֶׁבִּגְבוּרָה\nChesed shebiGevurah`);
  t.is(omer.getTodayIs('en'), 'Today is 8 days, which is 1 week and 1 day of the Omer');

  omer = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  t.is(omer.memo, `Foundation within Might\nיְּסוֹד שֶׁבִּגְבוּרָה\nYesod shebiGevurah`);
  t.is(omer.getTodayIs('en'), 'Today is 13 days, which is 1 week and 6 days of the Omer');

  omer = new OmerEvent(new HDate(29, 'Nisan', 5770), 14);
  t.is(omer.memo, `Majesty within Might\nמַּלְכוּת שֶׁבִּגְבוּרָה\nMalkhut shebiGevurah`);
  t.is(omer.getTodayIs('en'), 'Today is 14 days, which is 2 weeks of the Omer');

  omer = new OmerEvent(new HDate(26, 'Iyyar', 5770), 41);
  t.is(omer.memo, `Foundation within Foundation\nיְּסוֹד שֶׁבִּיְּסוֹד\nYesod shebiYesod`);
  t.is(omer.getTodayIs('en'), 'Today is 41 days, which is 5 weeks and 6 days of the Omer');

  omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.memo, `Eternity within Majesty\nנֶּֽצַח שֶׁבְּמַּלְכוּת\nNetzach sheb'Malkhut`);
  t.is(omer.getTodayIs('en'), 'Today is 46 days, which is 6 weeks and 4 days of the Omer');
});

test('days-weeks', (t) => {
  let ev = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(ev.omer, 46);
  t.is(ev.getWeeks(), 6);
  t.is(ev.getDaysWithinWeeks(), 4);

  ev = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  t.is(ev.omer, 7);
  t.is(ev.getWeeks(), 1);
  t.is(ev.getDaysWithinWeeks(), 7);

  ev = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  t.is(ev.omer, 8);
  t.is(ev.getWeeks(), 1);
  t.is(ev.getDaysWithinWeeks(), 1);
});

test('emoji', (t) => {
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  const actual = [];
  for (let i = 1; i <= 49; i++) {
    const ev = new OmerEvent(new HDate(startAbs + i - 1), i);
    actual.push(ev.getEmoji());
  }
  const expected = [
    '①', '②', '③', '④', '⑤', '⑥', '⑦',
    '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭',
    '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑',
    '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘',
    '㉙', '㉚', '㉛', '㉜', '㉝', '㉞', '㉟',
    '㊱', '㊲', '㊳', '㊴', '㊵', '㊶', '㊷',
    '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾',
  ];
  t.deepEqual(actual, expected);
});

test('emoji-blank', (t) => {
  const ev = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  ev.emoji = '';
  t.is(ev.getEmoji(), '');
});

test('throws-invalid-day', (t) => {
  const error = t.throws(() => {
    console.log(new OmerEvent(new HDate(15, 'Cheshvan', 5770), 123));
  }, {instanceOf: RangeError});
  t.is(error.message, 'Invalid Omer day 123');
});

test('url', (t) => {
  const omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.url(), 'https://www.hebcal.com/omer/5770/46');
});
