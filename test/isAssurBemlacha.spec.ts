import {expect, test} from 'vitest';
import {isAssurBemlacha} from '../src/isAssurBemlacha';
import {Location} from '../src/location';

function checkTime(dateStr: string): boolean {
  const loc = new Location(38.908089, -76.976663, false, 'America/New_York', 'Washington, D.C.');
  return isAssurBemlacha(new Date(dateStr), loc, false);
}

test('tuesday', () => {
  expect(checkTime('2020-12-15T20:12:14.987Z')).toBe(false);
});

test('friday before sunset', () => {
  expect(checkTime('2020-12-25T20:12:14.987Z')).toBe(false);
});

test('friday after sunset', () => {
  expect(checkTime('2020-12-25T23:12:14.987Z')).toBe(true);
});

test('sat before havdalah', () => {
  expect(checkTime('2020-12-26T22:33:00Z')).toBe(true);
});

test('sat after havdalah', () => {
  expect(checkTime('2020-12-26T22:55:00Z')).toBe(false);
});

// YK comes in at 6:38pm Eastern Time on the 27th
// and goes out at 7:34pm on the 28th
test('Before Erev YK', () => {
  expect(checkTime('2020-09-27T20:12:14.987Z')).toBe(false);
});

test('Erev YK', () => {
  expect(checkTime('2020-09-27T23:42:14.987Z')).toBe(true);
});

test('YK', () => {
  expect(checkTime('2020-09-28T20:12:14.987Z')).toBe(true);
});

test('Motzei YK', () => {
  expect(checkTime('2020-09-28T23:52:14.987Z')).toBe(false);
});
