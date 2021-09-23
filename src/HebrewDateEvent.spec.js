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
  t.is(hd1.render('ashkenazi'), '29th of Elul, 5779');
  t.is(hd1.render('he'), 'כ״ט אֱלוּל תשע״ט');
  t.is(hd2.render(), '1st of Tishrei, 5780');
  t.is(hd2.render(''), '1st of Tishrei, 5780');
  t.is(hd2.render('en'), '1st of Tishrei, 5780');
  t.is(hd2.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(hd2.render('he'), 'א׳ תִשְׁרֵי תש״פ');
  t.is(elul29.render(), '29th of Elul, 5779');
  t.is(elul29.render('en'), '29th of Elul, 5779');
  t.is(elul29.render(''), '29th of Elul, 5779');
  t.is(elul29.render('ashkenazi'), '29th of Elul, 5779');
  t.is(elul29.render('he'), '29. אֱלוּל, 5779');
  t.is(tishrei1.render(), '1st of Tishrei, 5780');
  t.is(tishrei1.render(''), '1st of Tishrei, 5780');
  t.is(tishrei1.render('en'), '1st of Tishrei, 5780');
  t.is(tishrei1.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(tishrei1.render('he'), '1. תִשְׁרֵי, 5780');
});

test('renderGematriya', (t) => {
  t.is(HebrewDateEvent.renderHebrew(20, 'xyz', 5780), 'כ׳ xyz תש״פ');
});
