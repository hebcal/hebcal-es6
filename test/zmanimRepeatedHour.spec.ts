import {afterAll, beforeAll, expect, test, vi} from 'vitest';
import {HebrewCalendar} from '../src/hebcal.js';
import {Location} from '../src/location.js';
import {Zmanim} from '../src/zmanim.js';

// https://github.com/hebcal/hebcal-es6/issues/786
// Israel's DST ends 2027-10-31 02:00 IDT (2027-10-30T23:00Z), so in a process
// running under TZ=Asia/Jerusalem, local 01:00-02:00 occurs twice. Rounding
// with local-time Date setters re-resolved instants in the second occurrence
// (23:00Z-24:00Z) to the first, making them 60 minutes early. Node re-reads
// process.env.TZ on assignment, so this reproduces whatever TZ CI runs in.
beforeAll(() => {
  vi.stubEnv('TZ', 'Asia/Jerusalem');
});
afterAll(() => {
  vi.unstubAllEnvs();
});

test('process TZ override is in effect', () => {
  // 23:30Z is in the second 01:00-02:00 hour, at the IST offset of +02:00
  expect(new Date('2027-10-30T23:30:00Z').getTimezoneOffset()).toBe(-120);
  expect(new Date('2027-10-30T22:30:00Z').getTimezoneOffset()).toBe(-180);
});

test('millisToDate in repeated hour', () => {
  const loc = new Location(-57, -40, false, 'UTC');
  const zman = new Zmanim(loc, new Date(2027, 9, 30), false);
  expect(zman.tzeit(8.5).toISOString()).toBe('2027-10-30T23:09:25.000Z');
});

test('sunsetOffset in repeated hour', () => {
  const loc = new Location(30, -100, false, 'America/Chicago');
  const zman = new Zmanim(loc, new Date(2027, 9, 30), false);
  expect(zman.sunset().toISOString()).toBe('2027-10-30T23:54:35.000Z');
  expect(zman.sunsetOffset(-18, true).toISOString()).toBe(
    '2027-10-30T23:36:00.000Z'
  );
  expect(zman.sunsetOffset(50, true).toISOString()).toBe(
    '2027-10-31T00:45:00.000Z'
  );
});

test('sunriseOffset in repeated hour', () => {
  const loc = new Location(13.75, 100.5, false, 'Asia/Bangkok');
  const zman = new Zmanim(loc, new Date(2027, 9, 31), false);
  expect(zman.sunrise().toISOString()).toBe('2027-10-30T23:11:59.000Z');
  expect(zman.sunriseOffset(10, true).toISOString()).toBe(
    '2027-10-30T23:22:00.000Z'
  );
  expect(zman.sunriseOffset(-10, true).toISOString()).toBe(
    '2027-10-30T23:01:00.000Z'
  );
});

test('Havdalah in repeated hour', () => {
  const loc = new Location(30, -100, false, 'America/Chicago');
  const events = HebrewCalendar.calendar({
    start: new Date(2027, 9, 30),
    end: new Date(2027, 9, 30),
    location: loc,
    candlelighting: true,
    havdalahMins: 50,
  });
  const havdalah = events.find(ev => ev.getDesc() === 'Havdalah');
  expect(havdalah?.render('en')).toBe('Havdalah (50 min): 7:45pm');
});
