import {afterAll, expect, test, vi} from 'vitest';
import {CalOptions} from '../src/CalOptions';
import {DailyLearning} from '../src/DailyLearning';
import {calendar} from '../src/calendar';
import { HDate } from '@hebcal/hdate';
import { Event } from '../src/event';

const consoleMock = vi.spyOn(console, 'warn');

afterAll(() => {
  consoleMock.mockReset();
});

test('calendar() calls warnUnrecognizedOptions()', () => {
  const options: CalOptions = {};
  Object.assign(options, {nonsense: true});
  calendar(options);
  expect(consoleMock).toHaveBeenLastCalledWith('Ignoring unrecognized HebrewCalendar option: nonsense');
});

test('warnUnrecognizedOptions also checks dailyLearning', () => {
  calendar({dailyLearning: {foobar: true}});
  expect(consoleMock).toHaveBeenLastCalledWith('Ignoring unrecognized DailyLearning calendar: foobar');
});

test('dailyLearning does not trigger addHebrewDatesForEvents', () => {
  const every2 = (hd: HDate) => {
    if (hd.getDate() % 2 === 1) {
      return new Event(hd, 'foo', 0);
    }
    return null;
  };
  DailyLearning.addCalendar('every2', every2);
  const options: CalOptions = {
    start: new Date(2025, 5, 1),
    end: new Date(2025, 5, 7),
    addHebrewDatesForEvents: false,
    dailyLearning: {
      every2: true,
    },
  };
  const events1 = calendar(options);
  expect(events1.length).toBe(7);
  options.addHebrewDatesForEvents = true;
  const events2 = calendar(options);
  expect(events2.length).toBe(10);
});
