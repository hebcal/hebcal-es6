import {reformatTimeStr} from './reformatTimeStr.js';

test('reformatTimeStr', () => {
  expect(reformatTimeStr('20:30', 'pm', {})).toBe('8:30pm');
  expect(reformatTimeStr('20:30', ' P.M.', {})).toBe('8:30 P.M.');
  expect(reformatTimeStr('20:30', '', {})).toBe('8:30');
  expect(reformatTimeStr('20:30', '', {locale: 'fr'})).toBe('8:30');
  expect(reformatTimeStr('20:30', '', {locale: 'en'})).toBe('8:30');
  expect(reformatTimeStr('20:30', '', {locale: 'ashkenazi'})).toBe('8:30');
  expect(reformatTimeStr('20:30', ' PM', {location: {cc: 'FR'}})).toBe('20:30');
  expect(reformatTimeStr('20:30', ' PM', {location: {cc: 'IL'}})).toBe('20:30');
  expect(reformatTimeStr('20:30', ' PM', {location: {cc: 'US'}})).toBe('8:30 PM');
  expect(reformatTimeStr('20:30', ' PM', {location: {cc: 'CA'}})).toBe('8:30 PM');
  expect(reformatTimeStr('20:30', ' PM', {location: {cc: 'BR'}})).toBe('8:30 PM');
  expect(reformatTimeStr('20:30', ' PM', {location: {cc: 'MX'}})).toBe('20:30');

  expect(reformatTimeStr('11:45', 'pm', {})).toBe('11:45am');
  expect(reformatTimeStr('11:45', ' P.M.', {})).toBe('11:45 A.M.');
  expect(reformatTimeStr('11:45', '', {})).toBe('11:45');
  expect(reformatTimeStr('11:45', '', {locale: 'fr'})).toBe('11:45');
  expect(reformatTimeStr('11:45', '', {locale: 'en'})).toBe('11:45');
  expect(reformatTimeStr('11:45', '', {locale: 'ashkenazi'})).toBe('11:45');
  expect(reformatTimeStr('11:45', ' PM', {location: {cc: 'FR'}})).toBe('11:45');
  expect(reformatTimeStr('11:45', ' PM', {location: {cc: 'IL'}})).toBe('11:45');
  expect(reformatTimeStr('11:45', ' PM', {location: {cc: 'US'}})).toBe('11:45 AM');
  expect(reformatTimeStr('11:45', ' PM', {location: {cc: 'CA'}})).toBe('11:45 AM');
  expect(reformatTimeStr('11:45', ' PM', {location: {cc: 'BR'}})).toBe('11:45 AM');
  expect(reformatTimeStr('11:45', ' PM', {location: {cc: 'MX'}})).toBe('11:45');

  expect(reformatTimeStr('00:07', 'pm', {})).toBe('12:07am');
  expect(reformatTimeStr('00:07', ' P.M.', {})).toBe('12:07 A.M.');
  expect(reformatTimeStr('00:07', '', {})).toBe('00:07');
  expect(reformatTimeStr('00:07', '', {locale: 'fr'})).toBe('00:07');
  expect(reformatTimeStr('00:07', '', {locale: 'en'})).toBe('00:07');
  expect(reformatTimeStr('00:07', '', {locale: 'ashkenazi'})).toBe('00:07');
  expect(reformatTimeStr('00:07', ' PM', {location: {cc: 'FR'}})).toBe('00:07');
  expect(reformatTimeStr('00:07', ' PM', {location: {cc: 'IL'}})).toBe('00:07');
  expect(reformatTimeStr('00:07', ' PM', {location: {cc: 'US'}})).toBe('12:07 AM');
  expect(reformatTimeStr('00:07', ' PM', {location: {cc: 'CA'}})).toBe('12:07 AM');
  expect(reformatTimeStr('00:07', ' PM', {location: {cc: 'BR'}})).toBe('12:07 AM');
  expect(reformatTimeStr('00:07', ' PM', {location: {cc: 'MX'}})).toBe('00:07');
});

test('reformatTimeStr-hour12', () => {
  expect(reformatTimeStr('23:56', '', {locale: 'fr', hour12: true})).toBe('11:56');
  expect(reformatTimeStr('23:56', '', {locale: 'en', hour12: true})).toBe('11:56');
  expect(reformatTimeStr('23:56', '', {locale: 'ashkenazi', hour12: true})).toBe('11:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'FR'}, hour12: true})).toBe('11:56 PM');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'IL'}, hour12: true})).toBe('11:56 PM');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'US'}, hour12: true})).toBe('11:56 PM');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'CA'}, hour12: true})).toBe('11:56 PM');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'BR'}, hour12: true})).toBe('11:56 PM');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'MX'}, hour12: true})).toBe('11:56 PM');

  expect(reformatTimeStr('23:56', '', {locale: 'fr', hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', '', {locale: 'en', hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', '', {locale: 'ashkenazi', hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'FR'}, hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'IL'}, hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'US'}, hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'CA'}, hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'BR'}, hour12: false})).toBe('23:56');
  expect(reformatTimeStr('23:56', ' PM', {location: {cc: 'MX'}, hour12: false})).toBe('23:56');
});

test('reformatTimeStr-hour12-am', () => {
  expect(reformatTimeStr('01:23', '', {locale: 'fr', hour12: true})).toBe('1:23');
  expect(reformatTimeStr('01:23', '', {locale: 'en', hour12: true})).toBe('1:23');
  expect(reformatTimeStr('01:23', '', {locale: 'ashkenazi', hour12: true})).toBe('1:23');
  expect(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'FR'}, hour12: true})).toBe('1:23 A.M.');
  expect(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'IL'}, hour12: true})).toBe('1:23 A.M.');
  expect(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'US'}, hour12: true})).toBe('1:23 A.M.');
  expect(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'CA'}, hour12: true})).toBe('1:23 A.M.');
  expect(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'BR'}, hour12: true})).toBe('1:23 A.M.');
  expect(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'MX'}, hour12: true})).toBe('1:23 A.M.');
});
