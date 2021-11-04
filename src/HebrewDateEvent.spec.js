import test from 'ava';
import {HDate} from './hdate';
import {HebrewDateEvent} from './HebrewDateEvent';
import './locale-he';

test('render', (t) => {
  const elul29 = new HDate(29, 'Elul', 5779);
  const hd1 = new HebrewDateEvent(elul29);
  const tishrei1 = new HDate(1, 'Tishrei', 5780);
  const hd2 = new HebrewDateEvent(tishrei1);
  t.is(hd1.render(), '29th of Elul, 5779');
  t.is(hd1.render('en'), '29th of Elul, 5779');
  t.is(hd1.render(''), '29th of Elul, 5779');
  t.is(hd1.render('s'), '29th of Elul, 5779');
  t.is(hd1.render('ashkenazi'), '29th of Elul, 5779');
  t.is(hd1.render('he'), 'כ״ט אֱלוּל תשע״ט');
  t.is(hd1.render('he-x-NoNikud'), 'כ״ט אלול תשע״ט');
  t.is(hd2.render(), '1st of Tishrei, 5780');
  t.is(hd2.render(''), '1st of Tishrei, 5780');
  t.is(hd2.render('en'), '1st of Tishrei, 5780');
  t.is(hd2.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(hd2.render('he'), 'א׳ תִשְׁרֵי תש״פ');
  t.is(hd2.render('he-x-NoNikud'), 'א׳ תשרי תש״פ');
  t.is(elul29.render(), '29th of Elul, 5779');
  t.is(elul29.render('en'), '29th of Elul, 5779');
  t.is(elul29.render(''), '29th of Elul, 5779');
  t.is(elul29.render('ashkenazi'), '29th of Elul, 5779');
  t.is(elul29.render('he'), '29 אֱלוּל, 5779');
  t.is(elul29.render('he-x-NoNikud'), '29 אלול, 5779');
  t.is(tishrei1.render(), '1st of Tishrei, 5780');
  t.is(tishrei1.render(''), '1st of Tishrei, 5780');
  t.is(tishrei1.render('en'), '1st of Tishrei, 5780');
  t.is(tishrei1.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(tishrei1.render('he'), '1 תִשְׁרֵי, 5780');
  t.is(tishrei1.render('he-x-NoNikud'), '1 תשרי, 5780');
});

test('renderBrief', (t) => {
  const elul29ev = new HebrewDateEvent(new HDate(29, 'Elul', 5779));
  t.is(elul29ev.renderBrief(), '29th of Elul');
  t.is(elul29ev.renderBrief('en'), '29th of Elul');
  t.is(elul29ev.renderBrief('s'), '29th of Elul');
  t.is(elul29ev.renderBrief(''), '29th of Elul');
  t.is(elul29ev.renderBrief('ashkenazi'), '29th of Elul');
  t.is(elul29ev.renderBrief('he'), 'כ״ט אֱלוּל');
  t.is(elul29ev.renderBrief('he-x-NoNikud'), 'כ״ט אלול');
  const tishrei1ev = new HebrewDateEvent(new HDate(1, 'Tishrei', 5780));
  t.is(tishrei1ev.renderBrief(), '1st of Tishrei, 5780');
  t.is(tishrei1ev.renderBrief(''), '1st of Tishrei, 5780');
  t.is(tishrei1ev.renderBrief('en'), '1st of Tishrei, 5780');
  t.is(tishrei1ev.renderBrief('ashkenazi'), '1st of Tishrei, 5780');
  t.is(tishrei1ev.renderBrief('he'), 'א׳ תִשְׁרֵי תש״פ');
  t.is(tishrei1ev.renderBrief('he-x-NoNikud'), 'א׳ תשרי תש״פ');
  const tishrei2ev = new HebrewDateEvent(new HDate(2, 'Tishrei', 5780));
  t.is(tishrei2ev.renderBrief(), '2nd of Tishrei');
  t.is(tishrei2ev.renderBrief(''), '2nd of Tishrei');
  t.is(tishrei2ev.renderBrief('en'), '2nd of Tishrei');
  t.is(tishrei2ev.renderBrief('ashkenazi'), '2nd of Tishrei');
  t.is(tishrei2ev.renderBrief('he'), 'ב׳ תִשְׁרֵי');
  t.is(tishrei2ev.renderBrief('he-x-NoNikud'), 'ב׳ תשרי');
});
