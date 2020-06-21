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
});
