import {expect, test} from 'vitest';
import {HDate, months} from '@hebcal/hdate';
import {hallel_} from '../src/hallel.js';

test('hallel', () => {
  expect(hallel_(new HDate(14, months.NISAN, 5781), false)).toBe(0);
  expect(hallel_(new HDate(15, months.NISAN, 5781), false)).toBe(2);
  expect(hallel_(new HDate(16, months.NISAN, 5781), false)).toBe(2);
  expect(hallel_(new HDate(15, months.CHESHVAN, 5781), false)).toBe(0);
  expect(hallel_(new HDate(1, months.TISHREI, 5781), false)).toBe(0);
  expect(hallel_(new HDate(25, months.KISLEV, 5781), false)).toBe(2);
  expect(hallel_(new HDate(29, months.KISLEV, 5781), false)).toBe(2);
  expect(hallel_(new HDate(21, months.KISLEV, 5781), false)).toBe(0);
  // https://github.com/hebcal/hebcal-es6/issues/815
  expect(hallel_(new HDate(22, months.TISHREI, 5781), false)).toBe(2);
  expect(hallel_(new HDate(23, months.TISHREI, 5781), false)).toBe(2);
  expect(hallel_(new HDate(24, months.KISLEV, 5781), false)).toBe(0);
  expect(hallel_(new HDate(14, months.IYYAR, 5781), false)).toBe(0);

  expect(hallel_(new HDate(17, months.NISAN, 5781), true)).toBe(1);
  expect(hallel_(new HDate(28, months.NISAN, 5781), true)).toBe(0);
  expect(hallel_(new HDate(30, months.NISAN, 5781), true)).toBe(1);
  expect(hallel_(new HDate(1, months.IYYAR, 5781), true)).toBe(1);
  expect(hallel_(new HDate(16, months.NISAN, 5781), true)).toBe(1);
  expect(hallel_(new HDate(22, months.TISHREI, 5781), true)).toBe(2);
  expect(hallel_(new HDate(23, months.TISHREI, 5781), true)).toBe(0);
  expect(hallel_(new HDate(24, months.KISLEV, 5781), true)).toBe(0);
  expect(hallel_(new HDate(14, months.IYYAR, 5781), true)).toBe(0);
});

test('hallel-pesach-shavuot', () => {
  expect(hallel_(new HDate(21, months.NISAN, 5781), true)).toBe(1);
  expect(hallel_(new HDate(22, months.NISAN, 5781), true)).toBe(0);
  expect(hallel_(new HDate(22, months.NISAN, 5781), false)).toBe(1);
  expect(hallel_(new HDate(23, months.NISAN, 5781), false)).toBe(0);
  expect(hallel_(new HDate(5, months.SIVAN, 5781), false)).toBe(0);
  expect(hallel_(new HDate(6, months.SIVAN, 5781), true)).toBe(2);
  expect(hallel_(new HDate(7, months.SIVAN, 5781), true)).toBe(0);
  expect(hallel_(new HDate(7, months.SIVAN, 5781), false)).toBe(2);
});

test('hallel-rosh-chodesh', () => {
  expect(hallel_(new HDate(30, months.TISHREI, 5781), false)).toBe(1);
  expect(hallel_(new HDate(1, months.CHESHVAN, 5781), false)).toBe(1);
  // 5784 is a leap year: 30 Adar I is Rosh Chodesh Adar II
  expect(hallel_(new HDate(30, months.ADAR_I, 5784), false)).toBe(1);
  expect(hallel_(new HDate(1, months.ADAR_II, 5784), false)).toBe(1);
});

test('hallel-chanukah', () => {
  // 5785 has a 30-day Kislev, so Chanukah ends on 2 Tevet
  expect(HDate.shortKislev(5785)).toBe(false);
  // Rosh Chodesh Tevet falls during Chanukah, so whole Hallel
  expect(hallel_(new HDate(30, months.KISLEV, 5785), false)).toBe(2);
  expect(hallel_(new HDate(1, months.TEVET, 5785), false)).toBe(2);
  expect(hallel_(new HDate(2, months.TEVET, 5785), false)).toBe(2);
  expect(hallel_(new HDate(3, months.TEVET, 5785), false)).toBe(0);
  // 5784 has a 29-day Kislev, so Chanukah ends on 3 Tevet
  expect(HDate.shortKislev(5784)).toBe(true);
  expect(hallel_(new HDate(1, months.TEVET, 5784), true)).toBe(2);
  expect(hallel_(new HDate(3, months.TEVET, 5784), true)).toBe(2);
  expect(hallel_(new HDate(4, months.TEVET, 5784), true)).toBe(0);
});

test('hallel-modern', () => {
  // Yom Ha'atzmaut moved to 3 Iyyar when Pesach falls on Sunday
  expect(hallel_(new HDate(3, months.IYYAR, 5781), true)).toBe(2);
  expect(hallel_(new HDate(5, months.IYYAR, 5781), true)).toBe(0);
  // Yom Ha'atzmaut moved to 6 Iyyar when Pesach falls on Tuesday
  expect(hallel_(new HDate(6, months.IYYAR, 5784), false)).toBe(2);
  expect(hallel_(new HDate(5, months.IYYAR, 5784), false)).toBe(0);
  expect(hallel_(new HDate(5, months.IYYAR, 5707), true)).toBe(0);
  expect(hallel_(new HDate(28, months.IYYAR, 5781), false)).toBe(2);
  expect(hallel_(new HDate(28, months.IYYAR, 5726), true)).toBe(0);
});
