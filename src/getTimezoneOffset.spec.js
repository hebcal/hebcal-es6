import test from 'ava';
import {getPseudoISO} from '@hebcal/hdate';

test('getPseudoISO-2021', (t) => {
  const dt = new Date(Date.UTC(2021, 0, 31, 7, 30, 50, 551));
  t.is(getPseudoISO('UTC', dt), '2021-01-31T07:30:50Z');
  t.is(getPseudoISO('America/New_York', dt), '2021-01-31T02:30:50Z');
  t.is(getPseudoISO('America/Los_Angeles', dt), '2021-01-30T23:30:50Z');
});

test('getPseudoISO-1948', (t) => {
  const dt = new Date(Date.UTC(1948, 0, 31, 7, 30, 50, 551));
  t.is(getPseudoISO('UTC', dt), '1948-01-31T07:30:50Z');
  t.is(getPseudoISO('America/New_York', dt), '1948-01-31T02:30:50Z');
  t.is(getPseudoISO('America/Los_Angeles', dt), '1948-01-30T23:30:50Z');
});

test('getPseudoISO-1776', (t) => {
  const dt = new Date(Date.UTC(1776, 0, 31, 7, 30, 50, 551));
  t.is(getPseudoISO('UTC', dt), '1776-01-31T07:30:50Z');
  t.is(getPseudoISO('America/New_York', dt), '1776-01-31T02:34:48Z');
  t.is(getPseudoISO('America/Los_Angeles', dt), '1776-01-30T23:37:52Z');
});

test('getPseudoISO-101', (t) => {
  const dt = new Date(Date.UTC(101, 0, 31, 7, 30, 50, 551));
  t.is(getPseudoISO('UTC', dt), '0101-01-31T07:30:50Z');
  t.is(getPseudoISO('America/New_York', dt), '0101-01-31T02:34:48Z');
  t.is(getPseudoISO('America/Los_Angeles', dt), '0101-01-30T23:37:52Z');
});
