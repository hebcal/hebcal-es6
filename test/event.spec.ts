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
});

test('hasFlag throws RangeError for unknown names', () => {
  const noFlags = new Event(hd, 'None');
  for (const bogus of [
    'NOT_A_FLAG',
    'chag',
    '',
    'toString',
    '__proto__',
    'hasOwnProperty',
    undefined,
    null,
    123,
    Symbol('CHAG'),
  ]) {
    // @ts-expect-error deliberately invalid flag name
    expect(() => ev.hasFlag(bogus)).toThrow(RangeError);
    // @ts-expect-error deliberately invalid flag name
    expect(() => noFlags.hasFlag(bogus)).toThrow(RangeError);
  }
  // @ts-expect-error deliberately invalid flag name
  expect(() => ev.hasFlag('ROSH_CHODSH')).toThrow('Unknown flag name: ROSH_CHODSH');
});

test('hasAnyFlag', () => {
  expect(ev.hasAnyFlag('USER_EVENT')).toBe(true);
  expect(ev.hasAnyFlag('IL_ONLY', 'CHUL_ONLY')).toBe(true);
  expect(ev.hasAnyFlag('CHUL_ONLY', 'IL_ONLY')).toBe(true);
  expect(ev.hasAnyFlag('IL_ONLY', 'CHAG', 'BEHAB')).toBe(false);
  expect(ev.hasAnyFlag()).toBe(false);
});

test('hasAnyFlag throws RangeError if any name is unknown', () => {
  // @ts-expect-error deliberately invalid flag name
  expect(() => ev.hasAnyFlag('NOT_A_FLAG')).toThrow(RangeError);
  // a valid, matching name earlier in the list must not mask a later typo
  // @ts-expect-error deliberately invalid flag name
  expect(() => ev.hasAnyFlag('USER_EVENT', 'ROSH_CHODSH')).toThrow(RangeError);
  // @ts-expect-error deliberately invalid flag name
  expect(() => ev.hasAnyFlag('toString', 'CHAG')).toThrow(RangeError);
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
