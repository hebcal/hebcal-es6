/* eslint-disable max-len */
import {HDate, months, isoDateString} from '@hebcal/hdate';
import {CalOptions} from './CalOptions';
import {Location} from './location';
import {Event, flags} from './event';
import {HolidayEvent} from './HolidayEvent';
import {Zmanim} from './zmanim';
import {TimedEvent, CandleLightingEvent, HavdalahEvent} from './TimedEvent';

const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;

/**
 * @private
 */
export function makeCandleEvent(
  ev: Event | undefined,
  hd: HDate,
  options: CalOptions,
  isFriday: boolean,
  isSaturday: boolean
): TimedEvent | undefined {
  let havdalahTitle = false;
  let useHavdalahOffset = isSaturday;
  let mask = ev ? ev.getFlags() : LIGHT_CANDLES;
  if (typeof ev !== 'undefined') {
    // if linked event && dow == FRI, use Candle lighting time & title
    if (!isFriday) {
      if (mask & (LIGHT_CANDLES_TZEIS | flags.CHANUKAH_CANDLES)) {
        useHavdalahOffset = true;
      } else if (mask & flags.YOM_TOV_ENDS) {
        havdalahTitle = true;
        useHavdalahOffset = true;
      }
    }
  } else if (isSaturday) {
    havdalahTitle = true;
    mask = LIGHT_CANDLES_TZEIS;
  }
  // if offset is 0 or undefined, we'll use tzeit time
  const offset = useHavdalahOffset
    ? options.havdalahMins
    : options.candleLightingMins;
  const location = options.location as Location;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, hd, useElevation);
  const time = offset
    ? zmanim.sunsetOffset(offset, true)
    : zmanim.tzeit(options.havdalahDeg);
  if (isNaN(time.getTime())) {
    return undefined; // no sunset
  }
  if (havdalahTitle) {
    return new HavdalahEvent(
      hd,
      mask,
      time,
      location,
      options.havdalahMins,
      ev,
      options
    );
  } else {
    mask |= LIGHT_CANDLES;
    return new CandleLightingEvent(hd, mask, time, location, ev, options);
  }
}

const FAST_BEGINS = 'Fast begins';
const FAST_ENDS = 'Fast ends';

/** A fast day also contains a start and end time */
export class FastDayEvent extends HolidayEvent {
  /** this will be a "Fast begins" event */
  readonly startEvent?: TimedEvent;
  /** this will be a "Fast ends" event */
  readonly endEvent?: TimedEvent;
  constructor(
    date: HDate,
    desc: string,
    mask: number,
    startEvent?: TimedEvent,
    endEvent?: TimedEvent
  ) {
    super(date, desc, mask);
    this.startEvent = startEvent;
    this.endEvent = endEvent;
  }
  urlDateSuffix(): string {
    if (this.getDesc() === "Asara B'Tevet") {
      const isoDate = isoDateString(this.getDate().greg());
      return isoDate.replace(/-/g, '');
    }
    return super.urlDateSuffix();
  }
}

/**
 * Makes a pair of events representing fast start and end times
 * @private
 */
export function makeFastStartEnd(
  ev: HolidayEvent,
  options: CalOptions
): FastDayEvent {
  const desc = ev.getDesc();
  if (desc === 'Yom Kippur') {
    return ev;
  }
  const hd = ev.getDate();
  const dt = hd.greg();
  const location = options.location as Location;
  const fastEndDeg = options.fastEndDeg;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, dt, useElevation);
  let startEvent;
  let endEvent;
  if (desc === "Erev Tish'a B'Av") {
    const sunset = zmanim.sunset();
    if (!isNaN(sunset.getTime())) {
      startEvent = makeTimedEvent(ev, sunset, FAST_BEGINS, options);
    }
  } else if (desc.startsWith("Tish'a B'Av")) {
    const tzeit = zmanim.tzeit(fastEndDeg);
    if (!isNaN(tzeit.getTime())) {
      endEvent = makeTimedEvent(ev, tzeit, FAST_ENDS, options);
    }
  } else {
    const dawn = zmanim.alotHaShachar();
    if (!isNaN(dawn.getTime())) {
      startEvent = makeTimedEvent(ev, dawn, FAST_BEGINS, options);
    }
    if (
      dt.getDay() !== 5 &&
      !(hd.getDate() === 14 && hd.getMonth() === months.NISAN)
    ) {
      const tzeit = zmanim.tzeit(fastEndDeg);
      if (!isNaN(tzeit.getTime())) {
        endEvent = makeTimedEvent(ev, tzeit, FAST_ENDS, options);
      }
    }
  }
  const ev2 = new FastDayEvent(hd, desc, ev.getFlags(), startEvent, endEvent);
  for (const property in ev) {
    // eslint-disable-next-line no-prototype-builtins
    if (ev.hasOwnProperty(property)) {
      Object.defineProperty(ev2, property, {value: (ev as any)[property]});
    }
  }
  return ev2;
}

/**
 * @private
 */
function makeTimedEvent(
  ev: Event,
  time: Date,
  desc: string,
  options: CalOptions
): TimedEvent {
  const location = options.location as Location;
  const hd = ev.getDate();
  return new TimedEvent(hd, desc, ev.getFlags(), time, location, ev, options);
}

export class TimedChanukahEvent extends HolidayEvent {
  eventTime: Date;
  eventTimeStr: string;
  readonly location: Location;
  constructor(
    date: HDate,
    desc: string,
    mask: number,
    eventTime: Date,
    location: Location
  ) {
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
export function makeWeekdayChanukahCandleLighting(
  ev: HolidayEvent,
  hd: HDate,
  options: CalOptions
): TimedChanukahEvent | null {
  const location = options.location as Location;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, hd.greg(), useElevation);
  const candleLightingTime = zmanim.beinHaShmashos();
  if (isNaN(candleLightingTime.getTime())) {
    return null;
  }
  const ev2 = new TimedChanukahEvent(
    hd,
    ev.getDesc(),
    ev.getFlags(),
    candleLightingTime,
    location
  );
  ev2.emoji = ev.emoji;
  ev2.chanukahDay = ev.chanukahDay;
  return ev2;
}
