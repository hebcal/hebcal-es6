import test from 'ava';
import {greg2abs, abs2greg, daysInMonth, isLeapYear} from './greg0';

// eslint-disable-next-line require-jsdoc
function ymd(date) {
  return {yy: date.getFullYear(), mm: date.getMonth() + 1, dd: date.getDate()};
}

test('greg2abs', (t) => {
  const dt = new Date(1995, 11, 17);
  t.is(greg2abs(dt), 728644);
  t.is(greg2abs(new Date(1888, 11, 31)), 689578);
  t.is(greg2abs(new Date(2005, 3, 2)), 732038);
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

test('abs2greg', (t) => {
  t.deepEqual(ymd(abs2greg(737553)), {yy: 2020, mm: 5, dd: 8});
  t.deepEqual(ymd(abs2greg(689578)), {yy: 1888, mm: 12, dd: 31});
  t.deepEqual(ymd(abs2greg(732038)), {yy: 2005, mm: 4, dd: 2});
});

test('abs2greg-88ce', (t) => {
  t.deepEqual(ymd(abs2greg(32141)), {yy: 88, mm: 12, dd: 30});
  t.deepEqual(ymd(abs2greg(32142)), {yy: 88, mm: 12, dd: 31});
  t.deepEqual(ymd(abs2greg(32143)), {yy: 89, mm: 1, dd: 1});
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
  const error2 = t.throws(() => {
    console.log(greg2abs('bogus'));
  }, {instanceOf: TypeError});
  t.is(error2.message, 'Argument not a Date: bogus');

  const error3 = t.throws(() => {
    console.log(abs2greg('bogus'));
  }, {instanceOf: TypeError});
  t.is(error3.message, 'Argument not a Number: bogus');
});

test.skip('greg2abs-1752-reformation', (t) => {
  t.is(greg2abs(new Date(1752, 8, 14)), 639797);
  // t.is(greg2abs(new Date(1752, 8, 2)), 639796);
  t.is(greg2abs(new Date(1752, 5, 2)), 639704);
  t.is(greg2abs(new Date(1751, 0, 1)), 639186);
});

test.skip('gregorian-reformation-throws', (t) => {
  const error = t.throws(() => {
    console.log(greg2abs(new Date(1752, 8, 13)));
  }, {instanceOf: RangeError});
  t.is(error.message.substring(0, 14), 'Invalid Date: ');

  const error2 = t.throws(() => {
    console.log(greg2abs(new Date(1752, 8, 3)));
  }, {instanceOf: RangeError});
  t.is(error2.message.substring(0, 14), 'Invalid Date: ');
});

test.skip('abs2greg-1752-reformation', (t) => {
  t.deepEqual(ymd(abs2greg(639797)), {yy: 1752, mm: 9, dd: 14});
  t.deepEqual(ymd(abs2greg(639796)), {yy: 1752, mm: 9, dd: 2});
  t.deepEqual(ymd(abs2greg(639186)), {yy: 1751, mm: 1, dd: 1});
});
