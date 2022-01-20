import test from 'ava';
import {MishnaYomiEvent} from './MishnaYomiEvent';
import {HDate} from './hdate';

test('MishnaYomiEvent-url', (t) => {
  const my = [{k: 'Berakhot', v: '3:6'}, {k: 'Berakhot', v: '4:1'}];
  const hd = new HDate(new Date(1947, 4, 29));
  const ev = new MishnaYomiEvent(hd, my);
  t.is(ev.url(), 'https://www.sefaria.org/Mishnah_Berakhot.3.6-4.1?lang=bi');
});
