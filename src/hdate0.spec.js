import test from 'ava';
import {abs2hebrew, daysInMonth, daysInYear, elapsedDays, hebrew2abs,
  isLeapYear, months} from './hdate0';

const NISAN = months.NISAN;
const IYYAR = months.IYYAR;
const SIVAN = months.SIVAN;
// const TAMUZ = months.TAMUZ;
// const AV = months.AV;
// const ELUL = months.ELUL;
const TISHREI = months.TISHREI;
const CHESHVAN = months.CHESHVAN;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const SHVAT = months.SHVAT;
// const ADAR_I = months.ADAR_I;
// const ADAR_II = months.ADAR_II;

test('elapsedDays', (t) => {
  t.is(elapsedDays(5780), 2110760);
  t.is(elapsedDays(5708), 2084447);
  t.is(elapsedDays(3762), 1373677);
  t.is(elapsedDays(3671), 1340455);
  t.is(elapsedDays(1234), 450344);
  t.is(elapsedDays(123), 44563);
  t.is(elapsedDays(2), 356);
  t.is(elapsedDays(1), 1);
});

test('isLeapYear', (t) => {
  t.is(isLeapYear(5779), true);
  t.is(isLeapYear(5782), true);
  t.is(isLeapYear(5784), true);
  t.is(isLeapYear(5780), false);
  t.is(isLeapYear(5781), false);
  t.is(isLeapYear(5783), false);
  t.is(isLeapYear(5778), false);
  t.is(isLeapYear(5749), true);
  t.is(isLeapYear(5511), false);
  t.is(isLeapYear(5252), true);
  t.is(isLeapYear(4528), true);
  t.is(isLeapYear(4527), false);
});

test('daysInYear', (t) => {
  t.is(daysInYear(5779), 385);
  t.is(daysInYear(5780), 355);
  t.is(daysInYear(5781), 353);
  t.is(daysInYear(5782), 384);
  t.is(daysInYear(5783), 355);
  t.is(daysInYear(5784), 383);
  t.is(daysInYear(5785), 355);
  t.is(daysInYear(5786), 354);
  t.is(daysInYear(5787), 385);
  t.is(daysInYear(5788), 355);
  t.is(daysInYear(5789), 354);
  t.is(daysInYear(3762), 383);
  t.is(daysInYear(3671), 354);
  t.is(daysInYear(1234), 353);
  t.is(daysInYear(123), 355);
  t.is(daysInYear(2), 355);
  t.is(daysInYear(1), 355);
});

test('daysInMonth', (t) => {
  t.is(daysInMonth(IYYAR, 5780), 29);
  t.is(daysInMonth(SIVAN, 5780), 30);
  t.is(daysInMonth(CHESHVAN, 5782), 29);
  t.is(daysInMonth(CHESHVAN, 5783), 30);
  t.is(daysInMonth(KISLEV, 5783), 30);
  t.is(daysInMonth(KISLEV, 5784), 29);
});

test('hebrew2abs', (t) => {
  t.is(hebrew2abs(5769, CHESHVAN, 15), 733359);
  t.is(hebrew2abs(5708, IYYAR, 6), 711262);
  t.is(hebrew2abs(3762, TISHREI, 1), 249);
  t.is(hebrew2abs(3761, NISAN, 1), 72);
  t.is(hebrew2abs(3761, TEVET, 18), 1);
  t.is(hebrew2abs(3761, TEVET, 17), 0);
  t.is(hebrew2abs(3761, TEVET, 16), -1);
  t.is(hebrew2abs(3761, TEVET, 1), -16);
});

test('abs2hebrew', (t) => {
  t.deepEqual(abs2hebrew(733359), {yy: 5769, mm: CHESHVAN, dd: 15});
  t.deepEqual(abs2hebrew(711262), {yy: 5708, mm: IYYAR, dd: 6});
  t.deepEqual(abs2hebrew(249), {yy: 3762, mm: TISHREI, dd: 1});
  t.deepEqual(abs2hebrew(1), {yy: 3761, mm: TEVET, dd: 18});
  t.deepEqual(abs2hebrew(0), {yy: 3761, mm: TEVET, dd: 17});
  t.deepEqual(abs2hebrew(-16), {yy: 3761, mm: TEVET, dd: 1});
});

test('abs2hebrew-88ce', (t) => {
  const h2 = abs2hebrew(32141);
  t.is(h2.yy, 3849);
  t.is(h2.mm, SHVAT);
  t.is(h2.dd, 1);

  const h3 = abs2hebrew(32142);
  t.is(h3.yy, 3849);
  t.is(h3.mm, SHVAT);
  t.is(h3.dd, 2);
});
