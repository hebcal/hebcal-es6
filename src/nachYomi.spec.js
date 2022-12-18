import test from 'ava';
import {NachYomiIndex} from './nachYomi';

test('throws-lookup-string', (t) => {
  const index = new NachYomiIndex();
  const error = t.throws(() => {
    index.lookup('17 Cheshvan 5759');
  }, {instanceOf: TypeError});
  t.is(error.message, 'Invalid date: 17 Cheshvan 5759');
});

test('throws-lookup-too-earch', (t) => {
  const index = new NachYomiIndex();
  const error = t.throws(() => {
    index.lookup(new Date(1923, 1, 1));
  }, {instanceOf: RangeError});
  t.is(error.message, 'Date 1923-02-01 too early; Nach Yomi cycle began on 2007-11-01');
});

test('2022-cycle', (t) => {
  const index = new NachYomiIndex();
  t.deepEqual(index.lookup(new Date(2022, 1, 26)), {k: 'Judges', v: 14});
  t.deepEqual(index.lookup(new Date(2023, 2, 15)), {k: 'Psalms', v: 40});
  t.deepEqual(index.lookup(new Date(2024, 0, 31)), {k: 'II Chronicles', v: 36});
});
