import {expect, test} from 'vitest';
import {HDate, months} from '@hebcal/hdate';
import {getHolidaysForYearArray} from '../src/holidays';
import {hallel_} from '../src/hallel';

test('hallel', () => {
  const ev1 = getHolidaysForYearArray(5781, false);
  expect(hallel_(ev1, new HDate(14, months.NISAN, 5781))).toBe(0);
  expect(hallel_(ev1, new HDate(15, months.NISAN, 5781))).toBe(2);
  expect(hallel_(ev1, new HDate(16, months.NISAN, 5781))).toBe(2);
  expect(hallel_(ev1, new HDate(15, months.CHESHVAN, 5781))).toBe(0);
  expect(hallel_(ev1, new HDate(1, months.TISHREI, 5781))).toBe(0);
  expect(hallel_(ev1, new HDate(25, months.KISLEV, 5781))).toBe(2);
  expect(hallel_(ev1, new HDate(29, months.KISLEV, 5781))).toBe(2);
  expect(hallel_(ev1, new HDate(21, months.KISLEV, 5781))).toBe(0);

  const ev2 = getHolidaysForYearArray(5781, true);
  expect(hallel_(ev2, new HDate(17, months.NISAN, 5781))).toBe(1);
  expect(hallel_(ev2, new HDate(28, months.NISAN, 5781))).toBe(0);
  expect(hallel_(ev2, new HDate(30, months.NISAN, 5781))).toBe(1);
  expect(hallel_(ev2, new HDate(1, months.IYYAR, 5781))).toBe(1);
  expect(hallel_(ev2, new HDate(16, months.NISAN, 5781))).toBe(1);
});
