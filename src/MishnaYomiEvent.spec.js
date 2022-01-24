import test from 'ava';
import {MishnaYomiEvent} from './MishnaYomiEvent';
import {HDate} from './hdate';
import './locale-ashkenazi';
import './locale-he';

test('MishnaYomiEvent-url', (t) => {
  const my = [{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}];
  const hd = new HDate(new Date(1947, 4, 29));
  const ev = new MishnaYomiEvent(hd, my);
  t.is(ev.url(), 'https://www.sefaria.org/Mishnah_Berakhot.3.6-4.1?lang=bi');

  const my2 = [{k: 'Berakhot', v: '9:5'}, {k: 'Peah', v: '1:1'}];
  const hd2 = new HDate(new Date(2022, 0, 22));
  const ev2 = new MishnaYomiEvent(hd2, my2);
  t.is(ev2.url(), 'https://www.sefaria.org/Mishnah_Berakhot.9.5?lang=bi');
});

test('MishnaYomiEvent-render', (t) => {
  const my = [{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}];
  const hd = new HDate(new Date(1947, 4, 29));
  const ev = new MishnaYomiEvent(hd, my);
  t.is(ev.render('en'), 'Berakhot 3:6-4:1');
  t.is(ev.render('ashkenazi'), 'Berakhos 3:6-4:1');
  t.is(ev.render('he'), 'ברכות 3:6-4:1');
});
