import {expect, test} from 'vitest';
import {HDate} from '@hebcal/hdate';
import {calendar} from '../src/calendar.js';
import {CalOptions} from '../src/CalOptions.js';
import {DailyLearning} from '../src/DailyLearning.js';
import {Event, flags} from '../src/event.js';
import {Location} from '../src/location.js';

DailyLearning.addCalendar(
  'testLearning',
  (hd: HDate) => new Event(hd, 'Daily learning', flags.DAILY_LEARNING)
);

const location = new Location(
  43.70011,
  -79.4163,
  false,
  'America/Toronto',
  'Toronto',
  'CA',
  6167865
);

function render(start: Date, options: CalOptions = {}): string[] {
  return calendar({
    start,
    end: start,
    location,
    candlelighting: true,
    havdalahMins: 42,
    omer: true,
    yizkor: true,
    sedrot: true,
    kiddushLevanaMaharil: true,
    dailyLearning: {testLearning: true},
    ...options,
  }).map(ev => ev.render('en'));
}

test('daily learning follows a minor fast but precedes Fast ends', () => {
  expect(render(new Date(2027, 9, 4))).toEqual([
    'Fast begins: 5:54am',
    'Tzom Gedaliah',
    'Daily learning',
    'Fast ends: 7:28pm',
  ]);
});

test('morning Kiddush Levana first, Erev holiday after learning', () => {
  expect(render(new Date(2027, 9, 15))).toEqual([
    'Latest Kiddush Levana: 6:06am',
    'Daily learning',
    'Erev Sukkot',
    'Candle lighting: 6:16pm',
  ]);
});

test('Erev Pesach: chametz deadlines, then learning, then Erev Pesach', () => {
  expect(render(new Date(2028, 3, 10))).toEqual([
    'Fast begins: 5:12am',
    'Ta’anit Bechorot',
    'Finish eating chametz: 11:07am',
    'Biur Chametz: 12:13pm',
    'Daily learning',
    'Erev Pesach',
    'Candle lighting: 7:37pm',
  ]);
});

test('Omer and Yizkor are daytime events', () => {
  expect(render(new Date(2028, 4, 30))).toEqual([
    '49th day of the Omer',
    'Daily learning',
    'Erev Shavuot',
    'Candle lighting: 8:33pm',
  ]);
  expect(render(new Date(2028, 5, 1))).toEqual([
    'Shavuot II',
    'Yizkor',
    'Daily learning',
    'Havdalah (42 min): 9:35pm',
  ]);
});

test('Hebrew date event still comes first', () => {
  expect(render(new Date(2027, 9, 15), {addHebrewDates: true})).toEqual([
    '14th of Tishrei, 5788',
    'Latest Kiddush Levana: 6:06am',
    'Daily learning',
    'Erev Sukkot',
    'Candle lighting: 6:16pm',
  ]);
});
