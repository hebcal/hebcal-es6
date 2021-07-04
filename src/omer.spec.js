import test from 'ava';
import {OmerEvent} from './omer';
import {HDate} from './hdate';

test('render', (t) => {
  const o1 = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  t.is(o1.render(), '1st day of the Omer');
  t.is(o1.getDesc(), 'Omer 1');
  t.is(o1.renderBrief(), 'Omer 1');
  t.is(o1.render('he'), 'א׳ בָּעוֹמֶר');
  t.is(o1.renderBrief('he'), 'עוֹמֶר 1');
  const o33 = new OmerEvent(new HDate(18, 'Iyyar', 5770), 33);
  t.is(o33.render(), '33rd day of the Omer');
  t.is(o33.getDesc(), 'Omer 33');
  t.is(o33.renderBrief(), 'Omer 33');
  t.is(o33.render('he'), 'ל״ג בָּעוֹמֶר');
  t.is(o33.renderBrief('he'), 'עוֹמֶר 33');
  const o42 = new OmerEvent(new HDate(27, 'Iyyar', 5770), 42);
  t.is(o42.render(), '42nd day of the Omer');
  t.is(o42.getDesc(), 'Omer 42');
  t.is(o42.renderBrief(), 'Omer 42');
  t.is(o42.render('he'), 'מ״ב בָּעוֹמֶר');
  t.is(o42.renderBrief('he'), 'עוֹמֶר 42');
  t.is(o42.render('es'), '42º day of the Omer');
  t.is(o42.render('de'), '42. day of the Omer');
  t.is(o42.render('fr'), '42. day of the Omer');
});

test('memo-and-days-weeks', (t) => {
  let omer = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  t.is(omer.memo, 'Lovingkindness that is in Lovingkindness / חֶֽסֶד שֶׁבַּחֶֽסֶד');
  t.is(omer.getTodayIs('en'), 'Today is 1 day of the Omer');

  omer = new OmerEvent(new HDate(17, 'Nisan', 5770), 2);
  t.is(omer.memo, 'Might that is in Lovingkindness / גְבוּרָה שֶׁבַּחֶֽסֶד');
  t.is(omer.getTodayIs('en'), 'Today is 2 days of the Omer');

  omer = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  t.is(omer.memo, 'Majesty that is in Lovingkindness / מַּלְכוּת שֶׁבַּחֶֽסֶד');
  t.is(omer.getTodayIs('en'), 'Today is 7 days, which is 1 week of the Omer');

  omer = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  t.is(omer.memo, 'Lovingkindness that is in Might / חֶֽסֶד שֶׁבַּגְבוּרָה');
  t.is(omer.getTodayIs('en'), 'Today is 8 days, which is 1 week and 1 day of the Omer');

  omer = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  t.is(omer.memo, 'Foundation that is in Might / יְּסוֹד שֶׁבַּגְבוּרָה');
  t.is(omer.getTodayIs('en'), 'Today is 13 days, which is 1 week and 6 days of the Omer');

  omer = new OmerEvent(new HDate(29, 'Nisan', 5770), 14);
  t.is(omer.memo, 'Majesty that is in Might / מַּלְכוּת שֶׁבַּגְבוּרָה');
  t.is(omer.getTodayIs('en'), 'Today is 14 days, which is 2 weeks of the Omer');

  omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.memo, 'Eternity that is in Majesty / נֶּֽצַח שֶׁבַּמַּלְכוּת');
  t.is(omer.getTodayIs('en'), 'Today is 46 days, which is 6 weeks and 4 days of the Omer');
});
