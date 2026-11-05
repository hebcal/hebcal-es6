import {expect, test} from 'vitest';
import {
  HorizonSample,
  horizonElevation,
  refractionAtApparentAltitude,
  SOLAR_SEMIDIAMETER,
  upperLimbApparentAltitude,
} from '../src/horizon.js';

test('horizonElevation constant', () => {
  expect(horizonElevation(3.5, 0)).toBe(3.5);
  expect(horizonElevation(3.5, 123)).toBe(3.5);
  expect(horizonElevation(0, 90)).toBe(0);
});

test('horizonElevation function', () => {
  const profile = (az: number) => az / 100;
  expect(horizonElevation(profile, 0)).toBe(0);
  expect(horizonElevation(profile, 250)).toBe(2.5);
});

test('horizonElevation interpolates midway between two samples', () => {
  const samples: HorizonSample[] = [
    {azimuth: 90, elevation: 2},
    {azimuth: 180, elevation: 4},
  ];
  expect(horizonElevation(samples, 135)).toBeCloseTo(3, 10);
  expect(horizonElevation(samples, 90)).toBeCloseTo(2, 10);
  expect(horizonElevation(samples, 180)).toBeCloseTo(4, 10);
});

test('horizonElevation wraps around 360/0', () => {
  const samples: HorizonSample[] = [
    {azimuth: 350, elevation: 1},
    {azimuth: 10, elevation: 3},
  ];
  // query 0° is the midpoint of the 350°→10° arc
  expect(horizonElevation(samples, 0)).toBeCloseTo(2, 10);
  expect(horizonElevation(samples, 350)).toBeCloseTo(1, 10);
  expect(horizonElevation(samples, 10)).toBeCloseTo(3, 10);
});

test('horizonElevation accepts unsorted input', () => {
  const samples: HorizonSample[] = [
    {azimuth: 180, elevation: 4},
    {azimuth: 0, elevation: 0},
    {azimuth: 90, elevation: 2},
  ];
  expect(horizonElevation(samples, 45)).toBeCloseTo(1, 10);
  expect(horizonElevation(samples, 135)).toBeCloseTo(3, 10);
});

test('horizonElevation single sample behaves as constant', () => {
  const samples: HorizonSample[] = [{azimuth: 123, elevation: 5}];
  expect(horizonElevation(samples, 0)).toBe(5);
  expect(horizonElevation(samples, 300)).toBe(5);
});

test('horizonElevation throws TypeError on empty array', () => {
  expect(() => horizonElevation([], 0)).toThrow(TypeError);
});

test('horizonElevation throws TypeError on non-finite constant', () => {
  expect(() => horizonElevation(NaN, 0)).toThrow(TypeError);
  expect(() => horizonElevation(Infinity, 0)).toThrow(TypeError);
});

test('refractionAtApparentAltitude reference values', () => {
  expect(refractionAtApparentAltitude(0)).toBeCloseTo(0.5689, 4);
  expect(refractionAtApparentAltitude(1)).toBeCloseTo(0.402, 4);
  expect(refractionAtApparentAltitude(15)).toBeCloseTo(0.0606, 4);
});

test('refractionAtApparentAltitude is continuous across 15°', () => {
  const below = refractionAtApparentAltitude(14.999);
  const at = refractionAtApparentAltitude(15);
  expect(Math.abs(at - below)).toBeLessThan(0.002);
});

test('upperLimbApparentAltitude(-0.8333) ≈ 0', () => {
  expect(upperLimbApparentAltitude(-0.8333)).toBeCloseTo(0, 2);
});

test('SOLAR_SEMIDIAMETER is 16 arcminutes', () => {
  expect(SOLAR_SEMIDIAMETER).toBeCloseTo(16 / 60, 10);
});

test('azimuth normalisation is a no-op for already-correct inputs', () => {
  // Mirrors the arithmetic inlined in Zmanim.visibleSunMillis. This pins the
  // invariant that the modulo-180 fold leaves an already-correct morning
  // azimuth (0°,180°) and evening azimuth (180°,360°) unchanged, so the
  // normalisation stays correct if a future @hebcal/noaa resolves the quadrant.
  const normalize = (raw: number, rising: boolean): number => {
    let az = ((raw % 180) + 180) % 180;
    if (!rising) {
      az += 180;
    }
    return az;
  };
  for (const morning of [0.0001, 45, 90, 135, 179.9]) {
    expect(normalize(morning, true)).toBeCloseTo(morning, 9);
  }
  for (const evening of [180.0001, 225, 270, 315, 359.9]) {
    expect(normalize(evening, false)).toBeCloseTo(evening, 9);
  }
});
