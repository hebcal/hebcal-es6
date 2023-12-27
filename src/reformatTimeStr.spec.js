import test from 'ava';
import {reformatTimeStr} from './reformatTimeStr.js';

test('reformatTimeStr', (t) => {
  t.is(reformatTimeStr('20:30', 'pm', {}), '8:30pm');
  t.is(reformatTimeStr('20:30', ' P.M.', {}), '8:30 P.M.');
  t.is(reformatTimeStr('20:30', '', {}), '8:30');
  t.is(reformatTimeStr('20:30', '', {locale: 'fr'}), '8:30');
  t.is(reformatTimeStr('20:30', '', {locale: 'en'}), '8:30');
  t.is(reformatTimeStr('20:30', '', {locale: 'ashkenazi'}), '8:30');
  t.is(reformatTimeStr('20:30', ' PM', {location: {cc: 'FR'}}), '20:30');
  t.is(reformatTimeStr('20:30', ' PM', {location: {cc: 'IL'}}), '20:30');
  t.is(reformatTimeStr('20:30', ' PM', {location: {cc: 'US'}}), '8:30 PM');
  t.is(reformatTimeStr('20:30', ' PM', {location: {cc: 'CA'}}), '8:30 PM');
  t.is(reformatTimeStr('20:30', ' PM', {location: {cc: 'BR'}}), '8:30 PM');
  t.is(reformatTimeStr('20:30', ' PM', {location: {cc: 'MX'}}), '20:30');

  t.is(reformatTimeStr('11:45', 'pm', {}), '11:45am');
  t.is(reformatTimeStr('11:45', ' P.M.', {}), '11:45 A.M.');
  t.is(reformatTimeStr('11:45', '', {}), '11:45');
  t.is(reformatTimeStr('11:45', '', {locale: 'fr'}), '11:45');
  t.is(reformatTimeStr('11:45', '', {locale: 'en'}), '11:45');
  t.is(reformatTimeStr('11:45', '', {locale: 'ashkenazi'}), '11:45');
  t.is(reformatTimeStr('11:45', ' PM', {location: {cc: 'FR'}}), '11:45');
  t.is(reformatTimeStr('11:45', ' PM', {location: {cc: 'IL'}}), '11:45');
  t.is(reformatTimeStr('11:45', ' PM', {location: {cc: 'US'}}), '11:45 AM');
  t.is(reformatTimeStr('11:45', ' PM', {location: {cc: 'CA'}}), '11:45 AM');
  t.is(reformatTimeStr('11:45', ' PM', {location: {cc: 'BR'}}), '11:45 AM');
  t.is(reformatTimeStr('11:45', ' PM', {location: {cc: 'MX'}}), '11:45');

  t.is(reformatTimeStr('00:07', 'pm', {}), '12:07am');
  t.is(reformatTimeStr('00:07', ' P.M.', {}), '12:07 A.M.');
  t.is(reformatTimeStr('00:07', '', {}), '00:07');
  t.is(reformatTimeStr('00:07', '', {locale: 'fr'}), '00:07');
  t.is(reformatTimeStr('00:07', '', {locale: 'en'}), '00:07');
  t.is(reformatTimeStr('00:07', '', {locale: 'ashkenazi'}), '00:07');
  t.is(reformatTimeStr('00:07', ' PM', {location: {cc: 'FR'}}), '00:07');
  t.is(reformatTimeStr('00:07', ' PM', {location: {cc: 'IL'}}), '00:07');
  t.is(reformatTimeStr('00:07', ' PM', {location: {cc: 'US'}}), '12:07 AM');
  t.is(reformatTimeStr('00:07', ' PM', {location: {cc: 'CA'}}), '12:07 AM');
  t.is(reformatTimeStr('00:07', ' PM', {location: {cc: 'BR'}}), '12:07 AM');
  t.is(reformatTimeStr('00:07', ' PM', {location: {cc: 'MX'}}), '00:07');
});

test('reformatTimeStr-hour12', (t) => {
  t.is(reformatTimeStr('23:56', '', {locale: 'fr', hour12: true}), '11:56');
  t.is(reformatTimeStr('23:56', '', {locale: 'en', hour12: true}), '11:56');
  t.is(reformatTimeStr('23:56', '', {locale: 'ashkenazi', hour12: true}), '11:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'FR'}, hour12: true}), '11:56 PM');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'IL'}, hour12: true}), '11:56 PM');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'US'}, hour12: true}), '11:56 PM');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'CA'}, hour12: true}), '11:56 PM');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'BR'}, hour12: true}), '11:56 PM');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'MX'}, hour12: true}), '11:56 PM');

  t.is(reformatTimeStr('23:56', '', {locale: 'fr', hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', '', {locale: 'en', hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', '', {locale: 'ashkenazi', hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'FR'}, hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'IL'}, hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'US'}, hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'CA'}, hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'BR'}, hour12: false}), '23:56');
  t.is(reformatTimeStr('23:56', ' PM', {location: {cc: 'MX'}, hour12: false}), '23:56');
});

test('reformatTimeStr-hour12-am', (t) => {
  t.is(reformatTimeStr('01:23', '', {locale: 'fr', hour12: true}), '1:23');
  t.is(reformatTimeStr('01:23', '', {locale: 'en', hour12: true}), '1:23');
  t.is(reformatTimeStr('01:23', '', {locale: 'ashkenazi', hour12: true}), '1:23');
  t.is(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'FR'}, hour12: true}), '1:23 A.M.');
  t.is(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'IL'}, hour12: true}), '1:23 A.M.');
  t.is(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'US'}, hour12: true}), '1:23 A.M.');
  t.is(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'CA'}, hour12: true}), '1:23 A.M.');
  t.is(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'BR'}, hour12: true}), '1:23 A.M.');
  t.is(reformatTimeStr('01:23', ' P.M.', {location: {cc: 'MX'}, hour12: true}), '1:23 A.M.');
});
