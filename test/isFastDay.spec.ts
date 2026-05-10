import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {isFastDay} from '../src/isFastDay';

test('major fast days', () => {
  expect(isFastDay(new HDate(10, 'Tishrei', 5785))).toBe(true);
  expect(isFastDay(new HDate(9, 'Av', 5785))).toBe(true);
});

test('minor fast days', () => {
  expect(isFastDay(new HDate(4, 'Tishrei', 5785))).toBe(true);
  expect(isFastDay(new HDate(10, 'Tevet', 5785))).toBe(true);
  expect(isFastDay(new HDate(13, 'Adar', 5785))).toBe(true);
  expect(isFastDay(new HDate(17, 'Tammuz', 5785))).toBe(true);
});

test('observed fast days', () => {
  expect(isFastDay(new HDate(17, 'Tammuz', 5782))).toBe(false);
  expect(isFastDay(new HDate(18, 'Tammuz', 5782))).toBe(true);
  expect(isFastDay(new HDate(9, 'Av', 5782))).toBe(false);
  expect(isFastDay(new HDate(10, 'Av', 5782))).toBe(true);
});

test('regular day', () => {
  expect(isFastDay(new HDate(3, 'Cheshvan', 5785))).toBe(false);
});
