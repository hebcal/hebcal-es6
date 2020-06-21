import test from 'ava';
import * as common from './common';

test('hebElapsedDays', (t) => {
  const elapsed = common.hebElapsedDays(5780);
  t.is(elapsed, 2110760);
});

test('hebLeapYear', (t) => {
  t.is(common.hebLeapYear(5779), true);
  t.is(common.hebLeapYear(5782), true);
  t.is(common.hebLeapYear(5784), true);
  t.is(common.hebLeapYear(5780), false);
  t.is(common.hebLeapYear(5781), false);
  t.is(common.hebLeapYear(5783), false);
  t.is(common.hebLeapYear(5778), false);
  t.is(common.hebLeapYear(5749), true);
  t.is(common.hebLeapYear(5511), false);
  t.is(common.hebLeapYear(5252), true);
  t.is(common.hebLeapYear(4528), true);
  t.is(common.hebLeapYear(4527), false);
});

test('daysInYear', (t) => {
  t.is(common.daysInYear(5779), 385);
  t.is(common.daysInYear(5780), 355);
  t.is(common.daysInYear(5781), 353);
  t.is(common.daysInYear(5782), 384);
  t.is(common.daysInYear(5783), 355);
  t.is(common.daysInYear(5784), 383);
  t.is(common.daysInYear(5785), 355);
  t.is(common.daysInYear(5786), 354);
  t.is(common.daysInYear(5787), 385);
  t.is(common.daysInYear(5788), 355);
  t.is(common.daysInYear(5789), 354);
});

test('daysInMonth', (t) => {
  t.is(common.daysInHebMonth(common.months.IYYAR), 29);
  t.is(common.daysInHebMonth(common.months.SIVAN), 30);
});

test('getMonthName', (t) => {
  // leap year
  t.is(common.getMonthName(common.months.ADAR_I, 5763), 'Adar I');
  t.is(common.getMonthName(common.months.ADAR_II, 5763), 'Adar II');
  t.is(common.getMonthName(14, 5763), 'Nisan');
  // not a leap year
  t.is(common.getMonthName(common.months.ADAR_I, 5764), 'Adar');
  t.is(common.getMonthName(common.months.ADAR_II, 5764), 'Nisan');
  // not boundary conditions
  t.is(common.getMonthName(common.months.TAMUZ, 5780), 'Tamuz');
  t.is(common.getMonthName(common.months.NISAN, 5763), 'Nisan');
  t.is(common.getMonthName(common.months.ELUL, 5763), 'Elul');
  t.is(common.getMonthName(common.months.TISHREI, 5763), 'Tishrei');
});
