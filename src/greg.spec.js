import test from 'ava';
import {greg} from './greg';

test('monthNames', (t) => {
  t.is(greg.monthNames[1], 'January');
  t.is(greg.monthNames[12], 'December');
});
