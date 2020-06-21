import test from 'ava';
import * as greg from './greg';

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

test('daysInGregMonth', (t) => {
  t.is(greg.daysInGregMonth(2, 2020), 29);
  t.is(greg.daysInGregMonth(2, 2019), 28);
  t.is(greg.daysInGregMonth(5, 2020), 31);
  t.is(greg.daysInGregMonth(2, 2100), 28);
});

test('gregLeapYear', (t) => {
  t.is(greg.gregLeapYear(2020), true);
  t.is(greg.gregLeapYear(2019), false);
  t.is(greg.gregLeapYear(2018), false);
  t.is(greg.gregLeapYear(2017), false);
  t.is(greg.gregLeapYear(2016), true);
  t.is(greg.gregLeapYear(2000), true);
  t.is(greg.gregLeapYear(2100), false);
  t.is(greg.gregLeapYear(1980), true);
});

test('monthNames', (t) => {
  t.is(greg.monthNames[1], 'January');
  t.is(greg.monthNames[12], 'December');
});
