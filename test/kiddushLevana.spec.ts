import { expect, test } from 'vitest';
import { GeoLocation } from '@hebcal/noaa';
import { Zmanim } from '../src/zmanim';
import { HDate } from '@hebcal/hdate';


// =============================================================================
// Kiddush Levana tests for ComplexZmanimCalendar
// Uses Shevat 5786 (starts Jan 19, 2026) and surrounding months in Jerusalem.
//
// Key date mappings (Gregorian → Hebrew):
//   Jan 17  → 28 Teves   Jan 18  → 29 Teves   Jan 19  → 1  Shevat
//   Jan 21  → 3  Shevat   Jan 25  → 7  Shevat   Jan 28  → 10 Shevat
//   Feb  2  → 15 Shevat   Feb 15  → 28 Shevat   Feb 16  → 29 Shevat
//   Feb 17  → 30 Shevat   Dec 19  → 29 Kislev   Dec 20  → 30 Kislev
//
// Shevat 5786 molad: Jan 18, 2026 12:45:40.170 UTC (14:45:40 Jerusalem)
// =============================================================================

// eslint-disable-next-line require-jsdoc
function makeCalendar(year: number, month: number, day: number): [HDate, Zmanim] {
  const gloc = new GeoLocation(null, 32.08088, 34.78057, 0, 'Asia/Jerusalem');
  const dt = new Date(year, month - 1, day);
  return [new HDate(dt), new Zmanim(gloc, dt, false)];
}

// ---------------------------------------------------------------------------
// Day 10 of Hebrew month — all Kiddush Levana methods must return null
// ---------------------------------------------------------------------------
test('KiddushLevana: all methods return null on 10th of Hebrew month', () => {
  // Jan 28, 2026 = 10 Shevat 5786
  const [hd, zmanim] = makeCalendar(2026, 1, 28);
  expect(hd.getDate()).toBe(10);

  expect(zmanim.getZmanMolad()).toBeNull();
  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
});

// ---------------------------------------------------------------------------
// getZmanMolad
// ---------------------------------------------------------------------------
test('KiddushLevana: getZmanMolad returns molad on the day it occurs', () => {
  // Jan 18, 2026 = 29 Teves (Shevat molad falls on this Gregorian day)
  const [hd, zmanim] = makeCalendar(2026, 1, 18);
  expect(hd.getDate()).toBe(29);

  const zdt = zmanim.getZmanMolad();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2026-01-18T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: getZmanMolad returns null on day 28 when molad is next day', () => {
  // Jan 17, 2026 = 28 Teves; molad is Jan 18 so doesn't fall on this day
  const [hd, zmanim] = makeCalendar(2026, 1, 17);
  expect(hd.getDate()).toBe(28);

  expect(zmanim.getZmanMolad()).toBeNull();
});

test('KiddushLevana: getZmanMolad returns null on day 1 when molad was previous day', () => {
  // Jan 19, 2026 = 1 Shevat; molad was Jan 18
  const [hd, zmanim] = makeCalendar(2026, 1, 19);
  expect(hd.getDate()).toBe(1);

  expect(zmanim.getZmanMolad()).toBeNull();
});

test('KiddushLevana: getZmanMolad forwards to next month on day 30', () => {
  // Dec 20, 2025 = 30 Kislev; current month molad is early Nov, but Teves molad falls on this day
  const [hd, zmanim] = makeCalendar(2025, 12, 20);
  expect(hd.getDate()).toBe(30);

  const zdt = zmanim.getZmanMolad();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2025-12-19T22:01:36.837-02:00[Etc/GMT+2]');
});

test('KiddushLevana: getZmanMolad returns null on day 29 when next molad is day after', () => {
  // Dec 19, 2025 = 29 Kislev; Teves molad falls on Dec 20
  const [hd, zmanim] = makeCalendar(2025, 12, 19);
  expect(hd.getDate()).toBe(29);

  expect(zmanim.getZmanMolad()).toBeNull();
});

test('KiddushLevana: getZmanMolad forwards to next month on day 30 of Shevat', () => {
  // Feb 17, 2026 = 30 Shevat; Adar molad falls on this day
  const [hd, zmanim] = makeCalendar(2026, 2, 17);
  expect(hd.getDate()).toBe(30);

  const zdt = zmanim.getZmanMolad();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2026-02-16T23:29:43.504-02:00[Etc/GMT+2]');
});

// ---------------------------------------------------------------------------
// getTchilasZmanKidushLevana3Days
// ---------------------------------------------------------------------------
test('KiddushLevana: 3days returns value on day 3 of month', () => {
  // Jan 21, 2026 = 3 Shevat; 3 days after Shevat molad falls on this day
  const [hd, zmanim] = makeCalendar(2026, 1, 21);
  expect(hd.getDate()).toBe(3);

  const zdt = zmanim.getTchilasZmanKidushLevana3Days();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2026-01-21T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: 3days returns null for day 6 through 29', () => {
  // Jan 24, 2026 = 6 Shevat (day > 5 && day < 30 → null)
  const [hd, zmanim] = makeCalendar(2026, 1, 24);
  expect(hd.getDate()).toBe(6);

  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
});

test('KiddushLevana: 3days returns null on day 1 when zman is on a different day', () => {
  // Jan 19, 2026 = 1 Shevat; 3 days after molad is Jan 21
  const [hd, zmanim] = makeCalendar(2026, 1, 19);
  expect(hd.getDate()).toBe(1);

  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
});

test('KiddushLevana: 3days with alos/tzais returns alos when zman is during the day', () => {
  // Jan 21, 2026 = 3 Shevat; 3 days after molad is ~14:45 Jerusalem (daytime)
  const [_, zmanim] = makeCalendar(2026, 1, 21);
  const alos = zmanim.alotHaShachar72zdt();
  const tzais = zmanim.tzeit72();

  const zdt = zmanim.getTchilasZmanKidushLevana3Days(alos, tzais);
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe(alos!.toString());
});

test('KiddushLevana: 3days exercises day-30 forward logic', () => {
  // Feb 17, 2026 = 30 Shevat; hits the day === 30 forward path
  // 3 days after Adar molad (Feb 20) is not on Feb 17, so returns null
  const [hd, zmanim] = makeCalendar(2026, 2, 17);
  expect(hd.getDate()).toBe(30);

  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
});

// ---------------------------------------------------------------------------
// getTchilasZmanKidushLevana7Days
// ---------------------------------------------------------------------------
test('KiddushLevana: 7days returns value on day 7 of month', () => {
  // Jan 25, 2026 = 7 Shevat; 7 days after Shevat molad falls on this day
  const [hd, zmanim] = makeCalendar(2026, 1, 25);
  expect(hd.getDate()).toBe(7);

  const zdt = zmanim.getTchilasZmanKidushLevana7Days();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2026-01-25T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: 7days returns null for day < 4', () => {
  // Jan 21, 2026 = 3 Shevat
  const [hd, zmanim] = makeCalendar(2026, 1, 21);
  expect(hd.getDate()).toBe(3);

  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
});

test('KiddushLevana: 7days returns null for day > 9', () => {
  // Jan 29, 2026 = 11 Shevat
  const [hd, zmanim] = makeCalendar(2026, 1, 29);
  expect(hd.getDate()).toBe(11);

  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
});

test('KiddushLevana: 7days returns null on day 4 when zman is on a different day', () => {
  // Jan 22, 2026 = 4 Shevat; in range but 7 days after molad is Jan 25
  const [hd, zmanim] = makeCalendar(2026, 1, 22);
  expect(hd.getDate()).toBe(4);

  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
});

test('KiddushLevana: 7days with alos/tzais returns alos when zman is during the day', () => {
  // Jan 25, 2026 = 7 Shevat; 7 days after molad is ~14:45 Jerusalem (daytime)
  const [_, zmanim] = makeCalendar(2026, 1, 25);
  const alos = zmanim.alotHaShachar72zdt();
  const tzais = zmanim.tzeit72();

  const zdt = zmanim.getTchilasZmanKidushLevana7Days(alos, tzais);
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe(alos!.toString());
});

// ---------------------------------------------------------------------------
// getSofZmanKidushLevanaBetweenMoldos
// ---------------------------------------------------------------------------
test('KiddushLevana: betweenMoldos returns value on day 15 of month', () => {
  // Feb 2, 2026 = 15 Shevat; halfway between Shevat and Adar moldos falls on this day
  const [hd, zmanim] = makeCalendar(2026, 2, 2);
  expect(hd.getDate()).toBe(15);

  const zdt = zmanim.getSofZmanKidushLevanaBetweenMoldos();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2026-02-02T05:07:41.836-02:00[Etc/GMT+2]');
});

test('KiddushLevana: betweenMoldos returns null for day < 11', () => {
  // Jan 28, 2026 = 10 Shevat
  const [hd, zmanim] = makeCalendar(2026, 1, 28);
  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
});

test('KiddushLevana: betweenMoldos returns null for day > 16', () => {
  // Feb 4, 2026 = 17 Shevat
  const [hd, zmanim] = makeCalendar(2026, 2, 4);
  expect(hd.getDate()).toBe(17);

  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
});

test('KiddushLevana: betweenMoldos with alos/tzais returns alos when zman is during the day', () => {
  // Feb 2, 2026 = 15 Shevat; between-moldos time is ~09:07 Jerusalem (daytime)
  const [_, zmanim] = makeCalendar(2026, 2, 2);
  const alos = zmanim.alotHaShachar72zdt();
  const tzais = zmanim.tzeit72();

  const zdt = zmanim.getSofZmanKidushLevanaBetweenMoldos(alos, tzais);
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe(alos!.toString());
});

// ---------------------------------------------------------------------------
// getSofZmanKidushLevana15Days
// ---------------------------------------------------------------------------
test('KiddushLevana: 15days returns value on day 15 of month', () => {
  // Feb 2, 2026 = 15 Shevat; 15 days after Shevat molad falls on this day
  const [hd, zmanim] = makeCalendar(2026, 2, 2);
  expect(hd.getDate()).toBe(15);

  const zdt = zmanim.getSofZmanKidushLevana15Days();
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe('2026-02-02T10:45:40.17-02:00[Etc/GMT+2]');
});

test('KiddushLevana: 15days returns null for day < 11', () => {
  // Jan 28, 2026 = 10 Shevat
  const [hd, zmanim] = makeCalendar(2026, 1, 28);
  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
});

test('KiddushLevana: 15days returns null for day > 17', () => {
  // Feb 5, 2026 = 18 Shevat
  const [hd, zmanim] = makeCalendar(2026, 2, 5);
  expect(hd.getDate()).toBe(18);

  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
});

test('KiddushLevana: 15days with alos/tzais returns alos when zman is during the day', () => {
  // Feb 2, 2026 = 15 Shevat; 15-day time is ~14:45 Jerusalem (daytime)
  const [_, zmanim] = makeCalendar(2026, 2, 2);
  const alos = zmanim.alotHaShachar72zdt();
  const tzais = zmanim.tzeit72();

  const zdt = zmanim.getSofZmanKidushLevana15Days(alos, tzais);
  expect(zdt).not.toBeNull();
  expect(zdt!.toString()).toBe(alos!.toString());
});

// ---------------------------------------------------------------------------
// Edge cases: days 28, 29, 30, 1 of Hebrew month
// ---------------------------------------------------------------------------
test('KiddushLevana: day 28 returns null for non-molad methods', () => {
  // Feb 15, 2026 = 28 Shevat
  const [hd, zmanim] = makeCalendar(2026, 2, 15);
  expect(hd.getDate()).toBe(28);

  // 3days: day 28 > 5 && < 30 → null
  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
  // 7days: day 28 > 9 → null
  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
  // betweenMoldos: day 28 > 16 → null
  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
  // 15days: day 28 > 17 → null
  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
  // getZmanMolad: day 28 passes filter, attempts molad lookup, returns null (Adar molad is Feb 17)
  expect(zmanim.getZmanMolad()).toBeNull();
});

test('KiddushLevana: day 29 returns null for non-molad methods', () => {
  // Feb 16, 2026 = 29 Shevat
  const [hd, zmanim] = makeCalendar(2026, 2, 16);
  expect(hd.getDate()).toBe(29);

  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
  expect(zmanim.getZmanMolad()).toBeNull();
});

test('KiddushLevana: day 30 exercises forward logic for molad and 3days', () => {
  // Feb 17, 2026 = 30 Shevat
  const [hd, zmanim] = makeCalendar(2026, 2, 17);
  expect(hd.getDate()).toBe(30);

  // getZmanMolad: forwards to Adar molad, which falls on this day
  const molad = zmanim.getZmanMolad();
  expect(molad).not.toBeNull();
  expect(molad!.toString()).toBe('2026-02-16T23:29:43.504-02:00[Etc/GMT+2]');

  // 3days: day 30 passes filter, first attempt null, forwards to next month (3 days after Adar molad = Feb 20), not today → null
  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();

  // Other methods: day 30 is outside their valid range → null
  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
});

test('KiddushLevana: day 1 returns null when zman times fall on other days', () => {
  // Jan 19, 2026 = 1 Shevat
  const [hd, zmanim] = makeCalendar(2026, 1, 19);
  expect(hd.getDate()).toBe(1);

  // 3 days after molad is Jan 21, not Jan 19
  expect(zmanim.getTchilasZmanKidushLevana3Days()).toBeNull();
  // Molad was Jan 18, not Jan 19
  expect(zmanim.getZmanMolad()).toBeNull();
  // Other methods: day 1 is outside range for 7days (< 4), betweenMoldos (< 11), 15days (< 11)
  expect(zmanim.getTchilasZmanKidushLevana7Days()).toBeNull();
  expect(zmanim.getSofZmanKidushLevanaBetweenMoldos()).toBeNull();
  expect(zmanim.getSofZmanKidushLevana15Days()).toBeNull();
});
