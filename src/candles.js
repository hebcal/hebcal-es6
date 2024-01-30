/* eslint-disable max-len */
import {months} from '@hebcal/hdate';
import {Event, flags} from './event.js';
import {Locale} from './locale.js';
import {reformatTimeStr} from './reformatTimeStr.js';
import {Zmanim} from './zmanim.js';

/**
 * @private
 * @param {Event} e
 * @param {HDate} hd
 * @param {CalOptions} options
 * @param {boolean} isFriday
 * @param {boolean} isSaturday
 * @return {Event}
 */
export function makeCandleEvent(e, hd, options, isFriday, isSaturday) {
  let havdalahTitle = false;
  let useHavdalahOffset = isSaturday;
  let mask = e ? e.getFlags() : flags.LIGHT_CANDLES;
  if (typeof e !== 'undefined') {
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
  const location = options.location;
  const zmanim = new Zmanim(location, hd, options.useElevation);
  const time = offset ? zmanim.sunsetOffset(offset, true) : zmanim.tzeit(options.havdalahDeg);
  if (isNaN(time.getTime())) {
    return null; // no sunset
  }
  if (havdalahTitle) {
    return new HavdalahEvent(hd, mask, time, location, options.havdalahMins, e, options);
  } else {
    return new CandleLightingEvent(hd, mask, time, location, e, options);
  }
}

/** An event that has an `eventTime` and `eventTimeStr` */
export class TimedEvent extends Event {
  /**
   * @param {HDate} date
   * @param {string} desc Description (not translated)
   * @param {number} mask
   * @param {Date} eventTime
   * @param {Location} location
   * @param {Event} linkedEvent
   * @param {CalOptions} options
   */
  constructor(date, desc, mask, eventTime, location, linkedEvent, options) {
    super(date, desc, mask);
    this.eventTime = Zmanim.roundTime(eventTime);
    this.location = location;
    const timeFormat = location.getTimeFormatter();
    this.eventTimeStr = Zmanim.formatTime(this.eventTime, timeFormat);
    const opts = Object.assign({location}, options);
    this.fmtTime = reformatTimeStr(this.eventTimeStr, 'pm', opts);
    if (typeof linkedEvent !== 'undefined') {
      this.linkedEvent = linkedEvent;
    }
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext(this.getDesc(), locale) + ': ' + this.fmtTime;
  }
  /**
   * Returns translation of "Candle lighting" without the time.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext(this.getDesc(), locale);
  }
  /** @return {string[]} */
  getCategories() {
    const desc = this.getDesc();
    switch (desc) {
      // LIGHT_CANDLES or LIGHT_CANDLES_TZEIS
      case 'Candle lighting':
        return ['candles'];
      // YOM_TOV_ENDS
      case 'Havdalah':
        return ['havdalah'];
      // flags.MINOR_FAST or flags.MAJOR_FAST
      case 'Fast begins':
      case 'Fast ends':
        return ['zmanim', 'fast'];
    }
  }
}

/** Havdalah after Shabbat or holiday */
export class HavdalahEvent extends TimedEvent {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Date} eventTime
   * @param {Location} location
   * @param {number} havdalahMins
   * @param {Event} linkedEvent
   * @param {CalOptions} options
   */
  constructor(date, mask, eventTime, location, havdalahMins, linkedEvent, options) {
    super(date, 'Havdalah', mask, eventTime, location, linkedEvent, options);
    if (havdalahMins) {
      this.havdalahMins = havdalahMins;
    }
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return this.renderBrief(locale) + ': ' + this.fmtTime;
  }
  /**
   * Returns translation of "Havdalah" without the time.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    let str = Locale.gettext(this.getDesc(), locale);
    if (this.havdalahMins) {
      const min = Locale.gettext('min', locale);
      str += ` (${this.havdalahMins} ${min})`;
    }
    return str;
  }
  /** @return {string} */
  getEmoji() {
    return '✨';
  }
}

/** Candle lighting before Shabbat or holiday */
export class CandleLightingEvent extends TimedEvent {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Date} eventTime
   * @param {Location} location
   * @param {Event} linkedEvent
   * @param {CalOptions} options
   */
  constructor(date, mask, eventTime, location, linkedEvent, options) {
    super(date, 'Candle lighting', mask, eventTime, location, linkedEvent, options);
  }
  /** @return {string} */
  getEmoji() {
    return '🕯️';
  }
}

/**
 * Makes a pair of events representing fast start and end times
 * @private
 * @param {Event} ev
 * @param {CalOptions} options
 * @return {Event}
 */
export function makeFastStartEnd(ev, options) {
  const desc = ev.getDesc();
  if (desc === 'Yom Kippur') {
    return ev;
  }
  ev = ev.clone();
  const hd = ev.getDate();
  const dt = hd.greg();
  const location = options.location;
  const fastEndDeg = options.fastEndDeg;
  const zmanim = new Zmanim(location, dt, options.useElevation);
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
 * @param {HDate} hd
 * @param {Date} time
 * @param {string} desc
 * @param {Event} ev
 * @param {CalOptions} options
 * @return {TimedEvent}
 */
function makeTimedEvent(hd, time, desc, ev, options) {
  if (isNaN(time.getTime())) {
    return null;
  }
  const location = options.location;
  return new TimedEvent(hd, desc, ev.getFlags(), time, location, ev, options);
}


/**
 * Makes a candle-lighting event for Chankah (not on Friday/Saturday).
 * At one point this used civil dusk (6 degrees below horizon).
 * Another source suggests 4.6667 degrees below horizon.
 * @private
 * @param {Event} ev
 * @param {HDate} hd
 * @param {CalOptions} options
 * @return {TimedEvent}
 */
export function makeWeekdayChanukahCandleLighting(ev, hd, options) {
  const location = options.location;
  const zmanim = new Zmanim(location, hd.greg(), options.useElevation);
  const candleLightingTime = zmanim.beinHaShmashos();
  return makeTimedEvent(hd, candleLightingTime, ev.getDesc(), ev, options);
}
