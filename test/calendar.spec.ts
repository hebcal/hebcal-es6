import {afterAll, expect, test, vi} from 'vitest';
import {CalOptions} from '../src/CalOptions';
import {calendar} from '../src/calendar';

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
