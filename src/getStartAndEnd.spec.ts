import {getStartAndEnd} from './getStartAndEnd';

test('getStartAndEnd-2digit', () => {
  const [start, end] = getStartAndEnd({year: 88});
  expect(start).toBe(31777);
  expect(end).toBe(32142);
});

test('getStartAndEnd-throw', () => {
  expect(() => {
    getStartAndEnd({start: new Date(2020, 3, 3)});
  }).toThrow('Both options.start and options.end are required');

  expect(() => {
    getStartAndEnd({end: new Date(2020, 3, 3)});
  }).toThrow('Both options.start and options.end are required');

  expect(() => {
    getStartAndEnd({year: NaN});
  }).toThrow('Invalid year NaN');

  expect(() => {
    getStartAndEnd({year: -55, isHebrewYear: true});
  }).toThrow('Invalid Hebrew year -55');

  expect(() => {
    getStartAndEnd({year: 0, isHebrewYear: true});
  }).toThrow('Invalid Hebrew year 0');
});
