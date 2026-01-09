import {HDate, months} from '@hebcal/hdate';
import {CalOptions} from './CalOptions';
import {Location} from './location';
import {Event, flags} from './event';
import {ChanukahEvent, HolidayEvent} from './HolidayEvent';
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
  // if Havdalah offset is 0 or undefined, we'll use tzeit time
  const offset = useHavdalahOffset
    ? Number(options.havdalahMins)
    : Number(options.candleLightingMins);
  const location = options.location as Location;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, hd, useElevation);
  const time =
    useHavdalahOffset && !offset
      ? zmanim.tzeit(options.havdalahDeg)
      : zmanim.sunsetOffset(offset, true);
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
  /** original event */
  readonly linkedEvent: HolidayEvent;
  /** this will be a "Fast begins" event */
  readonly startEvent?: TimedEvent;
  /** this will be a "Fast ends" event */
  readonly endEvent?: TimedEvent;
  constructor(
    linkedEvent: HolidayEvent,
    startEvent?: TimedEvent,
    endEvent?: TimedEvent
  ) {
    super(linkedEvent.getDate(), linkedEvent.getDesc(), linkedEvent.getFlags());
    this.linkedEvent = linkedEvent;
    this.startEvent = startEvent;
    this.endEvent = endEvent;
  }
  render(locale?: string): string {
    return this.linkedEvent.render(locale);
  }
  renderBrief(locale?: string): string {
    return this.linkedEvent.renderBrief(locale);
  }
  urlDateSuffix(): string {
    return this.linkedEvent.urlDateSuffix();
  }
  url(): string | undefined {
    return this.linkedEvent.url();
  }
  getEmoji(): string {
    return this.linkedEvent.getEmoji();
  }
  getCategories(): string[] {
    return this.linkedEvent.getCategories();
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
    throw new RangeError('YK does not require this function');
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
  const ev2 = new FastDayEvent(ev, startEvent, endEvent);
  // copy properties such as memo or emoji
  Object.assign(ev2, ev);
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

export class TimedChanukahEvent extends ChanukahEvent {
  eventTime: Date;
  eventTimeStr: string;
  readonly location: Location;
  constructor(ev: ChanukahEvent, eventTime: Date, location: Location) {
    super(ev.getDate(), ev.getDesc(), ev.getFlags(), ev.chanukahDay);
    this.eventTime = Zmanim.roundTime(eventTime);
    const timeFormat = location.getTimeFormatter();
    this.eventTimeStr = Zmanim.formatTime(this.eventTime, timeFormat);
    this.location = location;
    this.emoji = ev.emoji;
  }
}

/**
 * Makes a candle-lighting event for Chankah (not on Friday/Saturday).
 * At one point this used civil dusk (6 degrees below horizon).
 * Another source suggests 4.6667 degrees below horizon.
 * @private
 */
export function makeWeekdayChanukahCandleLighting(
  ev: ChanukahEvent,
  options: CalOptions
): TimedChanukahEvent | null {
  const hd = ev.getDate();
  const location = options.location as Location;
  const useElevation = Boolean(options.useElevation);
  const zmanim = new Zmanim(location, hd.greg(), useElevation);
  const candleLightingTime = zmanim.beinHaShmashos();
  if (isNaN(candleLightingTime.getTime())) {
    return null;
  }
  return new TimedChanukahEvent(ev, candleLightingTime, location);
}
