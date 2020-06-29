import test from 'ava';
import {common} from './common';
import {HDate} from './hdate';

test('elapsedDays', (t) => {
  const elapsed = HDate.elapsedDays(5780);
  t.is(elapsed, 2110760);
});

test('isLeapYear', (t) => {
  t.is(HDate.isLeapYear(5779), true);
  t.is(HDate.isLeapYear(5782), true);
  t.is(HDate.isLeapYear(5784), true);
  t.is(HDate.isLeapYear(5780), false);
  t.is(HDate.isLeapYear(5781), false);
  t.is(HDate.isLeapYear(5783), false);
  t.is(HDate.isLeapYear(5778), false);
  t.is(HDate.isLeapYear(5749), true);
  t.is(HDate.isLeapYear(5511), false);
  t.is(HDate.isLeapYear(5252), true);
  t.is(HDate.isLeapYear(4528), true);
  t.is(HDate.isLeapYear(4527), false);
});

test('daysInYear', (t) => {
  t.is(HDate.daysInYear(5779), 385);
  t.is(HDate.daysInYear(5780), 355);
  t.is(HDate.daysInYear(5781), 353);
  t.is(HDate.daysInYear(5782), 384);
  t.is(HDate.daysInYear(5783), 355);
  t.is(HDate.daysInYear(5784), 383);
  t.is(HDate.daysInYear(5785), 355);
  t.is(HDate.daysInYear(5786), 354);
  t.is(HDate.daysInYear(5787), 385);
  t.is(HDate.daysInYear(5788), 355);
  t.is(HDate.daysInYear(5789), 354);
});

test('daysInMonth', (t) => {
  t.is(HDate.daysInMonth(common.months.IYYAR), 29);
  t.is(HDate.daysInMonth(common.months.SIVAN), 30);
});

test('getMonthName', (t) => {
  // leap year
  t.is(HDate.getMonthName(common.months.ADAR_I, 5763), 'Adar I');
  t.is(HDate.getMonthName(common.months.ADAR_II, 5763), 'Adar II');
  t.is(HDate.getMonthName(14, 5763), 'Nisan');
  // not a leap year
  t.is(HDate.getMonthName(common.months.ADAR_I, 5764), 'Adar');
  t.is(HDate.getMonthName(common.months.ADAR_II, 5764), 'Nisan');
  // not boundary conditions
  t.is(HDate.getMonthName(common.months.TAMUZ, 5780), 'Tamuz');
  t.is(HDate.getMonthName(common.months.NISAN, 5763), 'Nisan');
  t.is(HDate.getMonthName(common.months.ELUL, 5763), 'Elul');
  t.is(HDate.getMonthName(common.months.TISHREI, 5763), 'Tishrei');
});
