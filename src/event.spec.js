import test from 'ava';
import {HDate} from './hdate';
import {Event, flags} from './event';

const hd = new HDate(23, 'Sivan', 5735);
const ev = new Event(hd, 'Foo Bar', flags.USER_EVENT | flags.CHUL_ONLY, {quux: 123});

test('getDate', (t) => {
  t.is(ev.getDate(), hd);
});

test('getDesc', (t) => {
  t.is(ev.getDesc(), 'Foo Bar');
});

test('getFlags', (t) => {
  t.is(ev.getFlags(), flags.USER_EVENT | flags.CHUL_ONLY);
});

test('render', (t) => {
  t.is(ev.render(), 'Foo Bar');
});

test('renderBrief', (t) => {
  t.is(ev.renderBrief(), 'Foo Bar');
});

test('emoji', (t) => {
  t.is(ev.getEmoji(), null);
});

test('basename', (t) => {
  t.is(ev.basename(), 'Foo Bar');
});

test('url', (t) => {
  t.is(ev.url(), undefined);
});

test('observedInIsrael', (t) => {
  t.is(ev.observedInIsrael(), false);
});

test('observedInDiaspora', (t) => {
  t.is(ev.observedInDiaspora(), true);
});

test('clone', (t) => {
  const ev2 = ev.clone();
  t.is(ev2.getDate(), hd);
  t.is(ev2.getFlags(), flags.USER_EVENT | flags.CHUL_ONLY);
  t.is(ev2.getDesc(), 'Foo Bar');
  t.is(ev2.observedInIsrael(), false);
  t.is(ev2.observedInDiaspora(), true);
  t.is(ev2.quux, 123);
});