import test from 'ava';
import {greg2abs, abs2greg, dayOfYear, daysInMonth, isLeapYear} from './greg0';

test('greg2abs', (t) => {
  const dt = new Date(1995, 11, 17);
  t.is(greg2abs(dt), 728644);
  t.is(greg2abs(new Date(1888, 11, 31)), 689578);
});

test('greg2abs-early-ce', (t) => {
  const dt = new Date(88, 11, 30);
  dt.setFullYear(88);
  t.is(greg2abs(dt), 32141);

  const dt2 = new Date(1, 0, 1);
  dt2.setFullYear(1);
  t.is(greg2abs(dt2), 1);
});

test('greg2abs-negative', (t) => {
  t.is(greg2abs(new Date(-1, 0, 1)), -730);
  t.is(greg2abs(new Date(-100, 11, 20)), -36536);
  t.is(greg2abs(new Date(-1000, 5, 15)), -365442);
});

test('dayOfYear', (t) => {
  const dt = new Date(1995, 11, 17);
  t.is(dayOfYear(dt), 351);
});

test('abs2greg', (t) => {
  const dt = abs2greg(737553);
  t.is(dt.getFullYear(), 2020);
  t.is(dt.getMonth(), 4); // 4=May (January=0)
  t.is(dt.getDate(), 8);

  const dt2 = abs2greg(689578);
  t.is(dt2.getFullYear(), 1888);
  t.is(dt2.getMonth(), 11);
  t.is(dt2.getDate(), 31);
});

test('abs2greg-88ce', (t) => {
  const dt = abs2greg(32141); // 0088-12-30
  t.is(dt.getFullYear(), 88);
  t.is(dt.getMonth(), 11);
  t.is(dt.getDate(), 30);

  const dt2 = abs2greg(32142);
  t.is(dt2.getFullYear(), 88);
  t.is(dt2.getMonth(), 11);
  t.is(dt2.getDate(), 31);

  const dt3 = abs2greg(32143);
  t.is(dt3.getFullYear(), 89);
  t.is(dt3.getMonth(), 0);
  t.is(dt3.getDate(), 1);
});

test('abs2greg-1ce', (t) => {
  const dt = abs2greg(1);
  t.is(dt.getFullYear(), 1);
  t.is(dt.getMonth(), 0);
  t.is(dt.getDate(), 1);
});

test('abs2greg-negative', (t) => {
  const dt = abs2greg(-730);
  t.is(dt.getFullYear(), -1);
  t.is(dt.getMonth(), 0);
  t.is(dt.getDate(), 1);

  const dt2 = abs2greg(-36536);
  t.is(dt2.getFullYear(), -100);
  t.is(dt2.getMonth(), 11);
  t.is(dt2.getDate(), 20);

  const dt3 = abs2greg(0);
  t.is(dt3.getFullYear(), 0);
  t.is(dt3.getMonth(), 11);
  t.is(dt3.getDate(), 31);

  const dt4 = abs2greg(-1);
  t.is(dt4.getFullYear(), 0);
  t.is(dt4.getMonth(), 11);
  t.is(dt4.getDate(), 30);
});

test('daysInMonth', (t) => {
  t.is(daysInMonth(2, 2020), 29);
  t.is(daysInMonth(2, 2019), 28);
  t.is(daysInMonth(5, 2020), 31);
  t.is(daysInMonth(2, 2100), 28);
});

test('isLeapYear', (t) => {
  t.is(isLeapYear(2020), true);
  t.is(isLeapYear(2019), false);
  t.is(isLeapYear(2018), false);
  t.is(isLeapYear(2017), false);
  t.is(isLeapYear(2016), true);
  t.is(isLeapYear(2000), true);
  t.is(isLeapYear(2100), false);
  t.is(isLeapYear(1980), true);
});

test('throws-not-a-date', (t) => {
  const error = t.throws(() => {
    console.log(dayOfYear('bogus'));
  }, {instanceOf: TypeError});
  t.is(error.message, 'Argument not a Date: bogus');

  const error2 = t.throws(() => {
    console.log(greg2abs('bogus'));
  }, {instanceOf: TypeError});
  t.is(error2.message, 'Argument not a Date: bogus');

  const error3 = t.throws(() => {
    console.log(abs2greg('bogus'));
  }, {instanceOf: TypeError});
  t.is(error3.message, 'Argument not a Number: bogus');
});
