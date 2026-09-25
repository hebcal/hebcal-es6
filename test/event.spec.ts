import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {Event, flags} from '../src/event.js';

const hd = new HDate(23, 'Sivan', 5735);
const ev = new Event(hd, 'Foo Bar', flags.USER_EVENT | flags.CHUL_ONLY, {
  quux: 123,
});

test('getDate', () => {
  expect(ev.getDate()).toBe(hd);
});

test('getDesc', () => {
  expect(ev.getDesc()).toBe('Foo Bar');
});

test('getFlags', () => {
  expect(ev.getFlags()).toBe(flags.USER_EVENT | flags.CHUL_ONLY);
});

test('hasFlag', () => {
  expect(ev.hasFlag('USER_EVENT')).toBe(true);
  expect(ev.hasFlag('CHUL_ONLY')).toBe(true);
  expect(ev.hasFlag('IL_ONLY')).toBe(false);
  expect(ev.hasFlag('BEHAB')).toBe(false);
  // @ts-expect-error unknown flag name
  expect(ev.hasFlag('NOT_A_FLAG')).toBe(false);
});

test('flagNames', () => {
  expect(ev.flagNames()).toEqual(['CHUL_ONLY', 'USER_EVENT']);
  expect(new Event(hd, 'None').flagNames()).toEqual([]);
  expect(
    new Event(hd, 'Behab', flags.MINOR_FAST | flags.BEHAB).flagNames()
  ).toEqual(['MINOR_FAST', 'BEHAB']);
});

test('flagNames round-trips every flag', () => {
  for (const [name, bit] of Object.entries(flags)) {
    const e = new Event(hd, name, bit);
    expect(e.flagNames()).toEqual([name]);
    expect(e.hasFlag(name as keyof typeof flags)).toBe(true);
  }
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
