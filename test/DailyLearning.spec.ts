import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '../src/DailyLearning';

test('DailyLearning', () => {
  expect(DailyLearning.getCalendars()).toEqual([]);
  const dummy = () => {return null};
  const hd = new HDate();
  expect(DailyLearning.has('Foo')).toBe(false);
  DailyLearning.addCalendar('Foo', dummy);
  expect(DailyLearning.has('Foo')).toBe(true);
  expect(DailyLearning.has('foo')).toBe(true);
  expect(DailyLearning.getStartDate('foo')).toBeUndefined();
  const startDate = new HDate(5780, 'Cheshvan', 13);
  DailyLearning.addCalendar('Bar', dummy, startDate);
  expect(DailyLearning.getStartDate('bar')).toEqual(startDate)
  expect(DailyLearning.getCalendars()).toEqual(['foo', 'bar']);
  const dummy2 = () => {return {bogus: true}};
  DailyLearning.addCalendar('Quux', dummy2);
  expect(DailyLearning.getStartDate('Quux')).toBeUndefined();
  expect(DailyLearning.getCalendars()).toEqual(['foo', 'bar', 'quux']);
  expect(DailyLearning.lookup('Foo', hd, false)).toBeNull();
  expect(DailyLearning.lookup('Bar', hd, false)).toBeNull();
  expect(DailyLearning.lookup('Quux', hd, false)).toEqual({bogus: true});
  expect(DailyLearning.getStartDate('UNDEFINED')).toBeUndefined();
});
