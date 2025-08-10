import {expect, test} from 'vitest';
import {TimedEvent, CandleLightingEvent, HavdalahEvent} from '../src/TimedEvent';
import {flags} from '../src/event';
import {HDate} from '@hebcal/hdate';
import {Location} from '../src/location';

test('renderBrief', () => {
  const dt = new Date('2020-12-28T20:12:14.987Z');
  const hd = new HDate(dt);
  const location = new Location(0, 0, false, 'UTC', undefined, 'GB');
  const timed = new TimedEvent(hd, 'Foo Bar', 0, dt, location);
  const candleLighting = new CandleLightingEvent(hd, flags.LIGHT_CANDLES, dt, location);
  const havdalah = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location, 42);
  const havdalahTzeit = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location);

  expect(timed.getDesc()).toBe('Foo Bar');
  expect(timed.render('en')).toBe('Foo Bar: 20:12');
  expect(timed.renderBrief('en')).toBe('Foo Bar');
  expect(candleLighting.getDesc()).toBe('Candle lighting');
  expect(candleLighting.render('en')).toBe('Candle lighting: 20:12');
  expect(candleLighting.renderBrief('en')).toBe('Candle lighting');
  expect(havdalah.getDesc()).toBe('Havdalah');
  expect(havdalah.render('en')).toBe('Havdalah (42 min): 20:12');
  expect(havdalah.renderBrief('en')).toBe('Havdalah (42 min)');
  expect(havdalahTzeit.getDesc()).toBe('Havdalah');
  expect(havdalahTzeit.render('en')).toBe('Havdalah: 20:12');
  expect(havdalahTzeit.renderBrief('en')).toBe('Havdalah');

  expect(candleLighting.render('he')).toBe('הַדְלָקַת נֵרוֹת: 20:12');
  expect(candleLighting.renderBrief('he')).toBe('הַדְלָקַת נֵרוֹת');
  expect(havdalah.render('he')).toBe('הַבְדָּלָה (42 דַּקּוֹת): 20:12');
  expect(havdalah.renderBrief('he')).toBe('הַבְדָּלָה (42 דַּקּוֹת)');
  expect(havdalahTzeit.render('he')).toBe('הַבְדָּלָה: 20:12');
  expect(havdalahTzeit.renderBrief('he')).toBe('הַבְדָּלָה');
});

test('emoji', () => {
  const dt = new Date('2020-12-28T20:12:14.987Z');
  const hd = new HDate(dt);
  const location = new Location(0, 0, false, 'UTC');
  const candleLighting = new CandleLightingEvent(hd, flags.LIGHT_CANDLES, dt, location);
  const havdalah = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location);
  expect(candleLighting.getEmoji()).toBe('🕯️');
  expect(havdalah.getEmoji()).toBe('✨');
});

test('getCategories', () => {
  const dt = new Date('2020-12-28T20:12:14.987Z');
  const hd = new HDate(dt);
  const location = new Location(0, 0, false, 'UTC');
  const candleLighting = new CandleLightingEvent(hd, flags.LIGHT_CANDLES, dt, location);
  const havdalah = new HavdalahEvent(hd, flags.LIGHT_CANDLES_TZEIS, dt, location);
  expect(candleLighting.getCategories()).toEqual(['candles']);
  expect(havdalah.getCategories()).toEqual(['havdalah']);
});
