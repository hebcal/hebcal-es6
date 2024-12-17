import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {Event, flags} from '../src/event';

const hd = new HDate(23, 'Sivan', 5735);
const ev = new Event(hd, 'Foo Bar', flags.USER_EVENT | flags.CHUL_ONLY, {quux: 123});

test('getDate', () => {
  expect(ev.getDate()).toBe(hd);
});

test('getDesc', () => {
  expect(ev.getDesc()).toBe('Foo Bar');
});

test('getFlags', () => {
  expect(ev.getFlags()).toBe(flags.USER_EVENT | flags.CHUL_ONLY);
});

test('render', () => {
  expect(ev.render('en')).toBe('Foo Bar');
});

test('renderBrief', () => {
  expect(ev.renderBrief('en')).toBe('Foo Bar');
});

test('emoji', () => {
  expect(ev.getEmoji()).toBeNull();
});

test('basename', () => {
  expect(ev.basename()).toBe('Foo Bar');
});

test('url', () => {
  expect(ev.url()).toBe(undefined);
});

test('observedInIsrael', () => {
  expect(ev.observedInIsrael()).toBe(false);
  const ev2 = new Event(hd, 'Quux', 0);
  expect(ev2.observedInIsrael()).toBe(true);
});

test('observedInDiaspora', () => {
  expect(ev.observedInDiaspora()).toBe(true);
  const ev2 = new Event(hd, 'Quux', 0);
  expect(ev2.observedInDiaspora()).toBe(true);
});

test('observedIn', () => {
  expect(ev.observedIn(true)).toBe(false);
  expect(ev.observedIn(false)).toBe(true);
  const ev2 = new Event(hd, 'Quux', 0);
  expect(ev2.observedIn(false)).toBe(true);
  expect(ev2.observedIn(true)).toBe(true);
});

test('clone', () => {
  const ev2 = ev.clone();
  expect(ev2.getDate()).toBe(hd);
  expect(ev2.getFlags()).toBe(flags.USER_EVENT | flags.CHUL_ONLY);
  expect(ev2.getDesc()).toBe('Foo Bar');
  expect(ev2.observedInIsrael()).toBe(false);
  expect(ev2.observedInDiaspora()).toBe(true);
  expect((ev2 as any).quux).toBe(123);
});
