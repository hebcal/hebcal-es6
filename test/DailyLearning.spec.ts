import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {DailyLearning} from '../src/DailyLearning';

test('DailyLearning', () => {
  expect(DailyLearning.getCalendars()).toEqual([]);
  const dummy = () => {return null};
  const hd = new HDate();
  DailyLearning.addCalendar('Foo', dummy);
  DailyLearning.addCalendar('Bar', dummy);
  expect(DailyLearning.getCalendars()).toEqual(['Foo', 'Bar']);
  const dummy2 = () => {return {bogus: true}};
  DailyLearning.addCalendar('Quux', dummy2);
  expect(DailyLearning.getCalendars()).toEqual(['Foo', 'Bar', 'Quux']);
  expect(DailyLearning.lookup('Foo', hd, false)).toBeNull();
  expect(DailyLearning.lookup('Bar', hd, false)).toBeNull();
  expect(DailyLearning.lookup('Quux', hd, false)).toEqual({bogus: true});
});
