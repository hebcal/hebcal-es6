import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {isAveilut} from '../src/isAveilut';

test('sefirat haomer', () => {
  expect(isAveilut(new HDate(15, 'Nisan', 5785))).toBe(false);
  expect(isAveilut(new HDate(16, 'Nisan', 5785))).toBe(true);
  expect(isAveilut(new HDate(18, 'Iyyar', 5785))).toBe(true);
  expect(isAveilut(new HDate(5, 'Sivan', 5785))).toBe(true);
  expect(isAveilut(new HDate(6, 'Sivan', 5785))).toBe(false);
});

test('bein hametzarim', () => {
  expect(isAveilut(new HDate(16, 'Tammuz', 5785))).toBe(false);
  expect(isAveilut(new HDate(17, 'Tammuz', 5785))).toBe(true);
  expect(isAveilut(new HDate(9, 'Av', 5785))).toBe(true);
  expect(isAveilut(new HDate(10, 'Av', 5785))).toBe(false);
});

test('observed tisha bav extends through 10 av', () => {
  expect(isAveilut(new HDate(9, 'Av', 5782))).toBe(true);
  expect(isAveilut(new HDate(10, 'Av', 5782))).toBe(true);
  expect(isAveilut(new HDate(11, 'Av', 5782))).toBe(false);
});

test('regular day', () => {
  expect(isAveilut(new HDate(3, 'Cheshvan', 5785))).toBe(false);
});
