import test from 'ava';
import {greg} from './greg';

test('greg2abs', (t) => {
  const dt = new Date(1995, 11, 17);
  t.is(greg.greg2abs(dt), 728644);
});

test('dayOfYear', (t) => {
  const dt = new Date(1995, 11, 17);
  t.is(greg.dayOfYear(dt), 351);
});

test('abs2greg', (t) => {
  const dt = greg.abs2greg(737553);
  t.is(dt.getFullYear(), 2020);
  t.is(dt.getMonth(), 4); // 4=May (January=0)
  t.is(dt.getDate(), 8);
});

test('abs2greg-88ce', (t) => {
  const dt = greg.abs2greg(32141); // 0088-12-30
  t.is(dt.getFullYear(), 88);
  t.is(dt.getMonth(), 11);
  t.is(dt.getDate(), 30);

  const dt2 = greg.abs2greg(32142);
  t.is(dt2.getFullYear(), 88);
  t.is(dt2.getMonth(), 11);
  t.is(dt2.getDate(), 31);

  const dt3 = greg.abs2greg(32143);
  t.is(dt3.getFullYear(), 89);
  t.is(dt3.getMonth(), 0);
  t.is(dt3.getDate(), 1);
});

test('daysInMonth', (t) => {
  t.is(greg.daysInMonth(2, 2020), 29);
  t.is(greg.daysInMonth(2, 2019), 28);
  t.is(greg.daysInMonth(5, 2020), 31);
  t.is(greg.daysInMonth(2, 2100), 28);
});

test('isLeapYear', (t) => {
  t.is(greg.isLeapYear(2020), true);
  t.is(greg.isLeapYear(2019), false);
  t.is(greg.isLeapYear(2018), false);
  t.is(greg.isLeapYear(2017), false);
  t.is(greg.isLeapYear(2016), true);
  t.is(greg.isLeapYear(2000), true);
  t.is(greg.isLeapYear(2100), false);
  t.is(greg.isLeapYear(1980), true);
});

test('monthNames', (t) => {
  t.is(greg.monthNames[1], 'January');
  t.is(greg.monthNames[12], 'December');
});

test('throws-not-a-date', (t) => {
  const error = t.throws(() => {
    console.log(greg.dayOfYear('bogus'));
  }, {instanceOf: TypeError});
  t.is(error.message, 'Argument to greg.dayOfYear not a Date');

  const error2 = t.throws(() => {
    console.log(greg.greg2abs('bogus'));
  }, {instanceOf: TypeError});
  t.is(error2.message, 'Argument to greg.greg2abs not a Date');

  const error3 = t.throws(() => {
    console.log(greg.abs2greg('bogus'));
  }, {instanceOf: TypeError});
  t.is(error3.message, 'Argument to greg.abs2greg not a Number');
});
