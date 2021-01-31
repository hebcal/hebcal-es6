/* eslint-disable max-len */
import {Locale} from './locale';
import {flags, Event} from './event';
import {Zmanim} from './zmanim';
import {months} from './hdate';

const days = {
  FRI: 5,
  SAT: 6,
};

/**
 * @private
 * This method returns the tzais (nightfall) based on the opinion of the
 * Geonim calculated as 30 minutes after sunset during the equinox
 * (on March 16, about 4 days before the astronomical equinox, the day that
 * a solar hour is 60 minutes) in Yerushalayim.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ComplexZmanimCalendar.html#getTzaisGeonim7Point083Degrees()}
 */
const TZEIT_3MEDIUM_STARS = 7.083;

/**
 * @private
 * @param {Event} e
 * @param {HDate} hd
 * @param {number} dow
 * @param {Location} location
 * @param {Intl.DateTimeFormat} timeFormat
 * @param {number} candlesOffset
 * @param {number} [havdalahOffset]
 * @return {Event}
 */
export function makeCandleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset) {
  let havdalahTitle = false;
  let useHavdalahOffset = dow == days.SAT;
  let mask = e ? e.getFlags() : flags.LIGHT_CANDLES;
  if (typeof e !== 'undefined') {
    // if linked event && dow == FRI, use Candle lighting time & title
    if (dow != days.FRI) {
      if (mask & (flags.LIGHT_CANDLES_TZEIS | flags.CHANUKAH_CANDLES)) {
        useHavdalahOffset = true;
      } else if (mask & flags.YOM_TOV_ENDS) {
        havdalahTitle = true;
        useHavdalahOffset = true;
      }
    }
  } else if (dow == days.SAT) {
    havdalahTitle = true;
    mask = flags.LIGHT_CANDLES_TZEIS;
  }
  // if offset is 0 or undefined, we'll use tzeit time
  const offset = useHavdalahOffset ? havdalahOffset : candlesOffset;
  const zmanim = new Zmanim(hd, location.getLatitude(), location.getLongitude());
  const time = offset ? zmanim.sunsetOffsetTime(offset, timeFormat) : zmanim.tzeitTime(8.5, timeFormat);
  if (!time[0]) {
    return null; // no sunset
  }
  if (havdalahTitle) {
    return new HavdalahEvent(hd, mask, time[0], time[1], havdalahOffset, e);
  } else {
    return new CandleLightingEvent(hd, mask, time[0], time[1], e);
  }
}

/** An event that has an `eventTime` and `eventTimeStr` */
export class TimedEvent extends Event {
  /**
   * @param {HDate} date
   * @param {string} desc Description (not translated)
   * @param {number} mask
   * @param {Date} eventTime
   * @param {string} eventTimeStr
   * @param {Event} linkedEvent
   */
  constructor(date, desc, mask, eventTime, eventTimeStr, linkedEvent) {
    super(date, desc, mask);
    this.eventTime = eventTime;
    this.eventTimeStr = eventTimeStr;
    if (typeof linkedEvent !== 'undefined') {
      this.linkedEvent = linkedEvent;
    }
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext(this.getDesc(), locale) + ': ' + this.eventTimeStr;
  }
  /**
   * Returns translation of "Candle lighting" without the time.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext(this.getDesc(), locale);
  }
}

/** Havdalah after Shabbat or holiday */
export class HavdalahEvent extends TimedEvent {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Date} eventTime
   * @param {string} eventTimeStr
   * @param {number} havdalahMins
   * @param {Event} linkedEvent
   */
  constructor(date, mask, eventTime, eventTimeStr, havdalahMins, linkedEvent) {
    super(date, 'Havdalah', mask, eventTime, eventTimeStr, linkedEvent);
    if (havdalahMins) {
      this.havdalahMins = havdalahMins;
    }
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return this.renderBrief(locale) + ': ' + this.eventTimeStr;
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
}

/** Candle lighting before Shabbat or holiday */
export class CandleLightingEvent extends TimedEvent {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Date} eventTime
   * @param {string} eventTimeStr
   * @param {Event} linkedEvent
   */
  constructor(date, mask, eventTime, eventTimeStr, linkedEvent) {
    super(date, 'Candle lighting', mask, eventTime, eventTimeStr, linkedEvent);
  }
}

/**
 * Makes a pair of events representing fast start and end times
 * @private
 * @param {Event} ev
 * @param {HDate} hd
 * @param {Location} location
 * @param {Intl.DateTimeFormat} timeFormat
 * @return {Event[]}
 */
export function makeFastStartEnd(ev, hd, location, timeFormat) {
  const desc = ev.getDesc();
  if (desc === 'Yom Kippur') {
    return null;
  }
  const dt = hd.greg();
  const zmanim = new Zmanim(dt, location.getLatitude(), location.getLongitude());
  if (desc === 'Erev Tish\'a B\'Av') {
    const sunset = zmanim.sunset();
    const begin = makeTimedEvent(hd, sunset, 'Fast begins', ev, timeFormat);
    return [begin, null];
  } else if (desc.substring(0, 11) === 'Tish\'a B\'Av') {
    const end = makeTimedEvent(hd, zmanim.tzeit(TZEIT_3MEDIUM_STARS), 'Fast ends', ev, timeFormat);
    return [null, end];
  }
  const dawn = zmanim.alotHaShachar();
  const begin = makeTimedEvent(hd, dawn, 'Fast begins', ev, timeFormat);
  if (dt.getDay() === 5 || (hd.getDate() === 14 && hd.getMonth() === months.NISAN)) {
    return [begin, null];
  }
  const end = makeTimedEvent(hd, zmanim.tzeit(TZEIT_3MEDIUM_STARS), 'Fast ends', ev, timeFormat);
  return [begin, end];
}

/**
 * @private
 * @param {HDate} hd
 * @param {Date} time
 * @param {string} desc
 * @param {Event} ev
 * @param {Intl.DateTimeFormat} timeFormat
 * @return {TimedEvent}
 */
function makeTimedEvent(hd, time, desc, ev, timeFormat) {
  if (isNaN(time.getTime())) {
    return null;
  }
  const eventTimeStr = Zmanim.roundAndFormatTime(time, timeFormat);
  return new TimedEvent(hd, desc, ev.getFlags(), time, eventTimeStr, ev);
}


/**
 * Makes a candle-lighting event for Chankah (not on Friday/Saturday)
 * @private
 * @param {Event} ev
 * @param {HDate} hd
 * @param {Location} location
 * @param {Intl.DateTimeFormat} timeFormat
 * @return {TimedEvent}
 */
export function makeWeekdayChanukahCandleLighting(ev, hd, location, timeFormat) {
  const zmanim = new Zmanim(hd.greg(), location.getLatitude(), location.getLongitude());
  const candleLightingTime = zmanim.dusk();
  return makeTimedEvent(hd, candleLightingTime, ev.getDesc(), ev, timeFormat);
}
