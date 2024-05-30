/* eslint-disable max-len */
import {HDate, months} from '@hebcal/hdate';
import {CalOptions} from './CalOptions';
import {Location} from './location';
import {Event, flags} from './event';
import {HolidayEvent} from './HolidayEvent';
import {Zmanim} from './zmanim.js';
import { TimedEvent, CandleLightingEvent, HavdalahEvent } from './TimedEvent';

/**
 * @private
 */
export function makeCandleEvent(
  ev: Event | undefined,
  hd: HDate,
  options: CalOptions,
  isFriday: boolean,
  isSaturday: boolean): Event | null {
  let havdalahTitle = false;
  let useHavdalahOffset = isSaturday;
  let mask = ev ? ev.getFlags() : flags.LIGHT_CANDLES;
  if (typeof ev !== 'undefined') {
    // if linked event && dow == FRI, use Candle lighting time & title
    if (!isFriday) {
      if (mask & (flags.LIGHT_CANDLES_TZEIS | flags.CHANUKAH_CANDLES)) {
        useHavdalahOffset = true;
      } else if (mask & flags.YOM_TOV_ENDS) {
        havdalahTitle = true;
        useHavdalahOffset = true;
      }
    }
  } else if (isSaturday) {
    havdalahTitle = true;
    mask = flags.LIGHT_CANDLES_TZEIS;
  }
  // if offset is 0 or undefined, we'll use tzeit time
  const offset = useHavdalahOffset ? options.havdalahMins : options.candleLightingMins;
  const location = options.location as Location;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, hd, useElevation);
  const time = offset ? zmanim.sunsetOffset(offset, true) : zmanim.tzeit(options.havdalahDeg);
  if (isNaN(time.getTime())) {
    return null; // no sunset
  }
  if (havdalahTitle) {
    return new HavdalahEvent(hd, mask, time, location, options.havdalahMins, ev, options);
  } else {
    return new CandleLightingEvent(hd, mask, time, location, ev, options);
  }
}

/**
 * Makes a pair of events representing fast start and end times
 * @private
 */
export function makeFastStartEnd(ev: HolidayEvent, options: CalOptions): HolidayEvent {
  const desc = ev.getDesc();
  if (desc === 'Yom Kippur') {
    return ev;
  }
  ev = ev.clone();
  const hd = ev.getDate();
  const dt = hd.greg();
  const location = options.location;
  const fastEndDeg = options.fastEndDeg;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, dt, useElevation);
  if (desc === 'Erev Tish\'a B\'Av') {
    const sunset = zmanim.sunset();
    ev.startEvent = makeTimedEvent(hd, sunset, 'Fast begins', ev, options);
  } else if (desc.startsWith('Tish\'a B\'Av')) {
    ev.endEvent = makeTimedEvent(hd, zmanim.tzeit(fastEndDeg), 'Fast ends', ev, options);
  } else {
    const dawn = zmanim.alotHaShachar();
    ev.startEvent = makeTimedEvent(hd, dawn, 'Fast begins', ev, options);
    if (dt.getDay() !== 5 && !(hd.getDate() === 14 && hd.getMonth() === months.NISAN)) {
      ev.endEvent = makeTimedEvent(hd, zmanim.tzeit(fastEndDeg), 'Fast ends', ev, options);
    }
  }
  return ev;
}

/**
 * @private
 */
function makeTimedEvent(hd: HDate, time: Date, desc: string, ev: Event, options: CalOptions): TimedEvent | null {
  if (isNaN(time.getTime())) {
    return null;
  }
  const location = options.location as Location;
  return new TimedEvent(hd, desc, ev.getFlags(), time, location, ev, options);
}

export class ChanukahEvent extends HolidayEvent {
  readonly eventTime: Date;
  readonly eventTimeStr: string;
  readonly location: Location;
  constructor(date: HDate, desc: string, mask: number, eventTime: Date, location: Location) {
    super(date, desc, mask);
    this.eventTime = Zmanim.roundTime(eventTime);
    const timeFormat = location.getTimeFormatter();
    this.eventTimeStr = Zmanim.formatTime(this.eventTime, timeFormat);
    this.location = location;
  }
}

/**
 * Makes a candle-lighting event for Chankah (not on Friday/Saturday).
 * At one point this used civil dusk (6 degrees below horizon).
 * Another source suggests 4.6667 degrees below horizon.
 * @private
 */
export function makeWeekdayChanukahCandleLighting(ev: Event, hd: HDate, options: CalOptions): ChanukahEvent | null {
  const location = options.location as Location;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, hd.greg(), useElevation);
  const candleLightingTime = zmanim.beinHaShmashos();
  if (isNaN(candleLightingTime.getTime())) {
    return null;
  }
  return new ChanukahEvent(hd, ev.getDesc(), ev.getFlags(), candleLightingTime, location);
}
