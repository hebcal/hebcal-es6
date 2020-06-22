import {gettext} from './locale';
import {days} from './common';
import {flags, Event} from './event';

/**
 * @param {Intl.DateTimeFormat} timeFormat
 * @param {Date} dt
 * @return {string}
 */
function formatTime(timeFormat, dt) {
  const time = timeFormat.format(dt);
  // Possibly convert from "5:45 PM" to "5:45"
  const space = time.indexOf(' ');
  if (space != -1) {
    return time.substring(0, space);
  }
  return time;
}

/**
 * @param {HDate} hd
 * @param {Location} location
 * @param {Intl.DateTimeFormat} timeFormat
 * @param {number} offset
 * @return {Object[]}
 */
function sunsetTime(hd, location, timeFormat, offset) {
  const sunset = location.sunset(hd);
  if (isNaN(sunset.getTime())) {
    // `No sunset for ${location} on ${hd}`
    return [undefined, undefined];
  }
  // For Havdalah only, round up to next minute if needed
  if (sunset.getSeconds() >= 30 && offset > 0) {
    offset++;
  }
  const dt = new Date(sunset.getTime() + (offset * 60 * 1000));
  const time = formatTime(timeFormat, dt);
  return [dt, time];
}

/**
 * @param {HDate} hd
 * @param {Location} location
 * @param {Intl.DateTimeFormat} timeFormat
 * @return {Object[]}
 */
function tzeitTime(hd, location, timeFormat) {
  const dt = location.tzeit(hd);
  if (isNaN(dt.getTime())) {
    // `No tzeit time for ${location} on ${hd}`
    return [undefined, undefined];
  }
  // Round up to next minute if needed
  const dtRounded = (dt.getSeconds() >= 30) ? new Date(dt.getTime() + (60 * 1000)) : dt;
  const time = formatTime(timeFormat, dtRounded);
  return [dt, time];
}

/**
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
  let useHavdalahOffset = false;
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
    useHavdalahOffset = true;
    mask = flags.LIGHT_CANDLES_TZEIS;
  }
  // if offset is 0 or undefined, we'll use tzeit time
  const offset = useHavdalahOffset ? havdalahOffset : candlesOffset;
  const [eventTime, timeStr] = offset ?
    sunsetTime(hd, location, timeFormat, offset) :
    tzeitTime(hd, location, timeFormat);
  if (!eventTime) {
    return null; // no sunset
  }
  const attrs = {eventTime: eventTime, eventTimeStr: timeStr};
  if (typeof e !== 'undefined') {
    attrs.linkedEvent = e;
  }
  return havdalahTitle ?
    new HavdalahEvent(hd, mask, attrs, havdalahOffset) :
    new CandleLightingEvent(hd, mask, attrs);
}

/** Havdalah after Shabbat or holiday */
export class HavdalahEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Object} attrs
   * @param {number} [havdalahMins]
   */
  constructor(date, mask, attrs, havdalahMins) {
    super(date, 'Havdalah', mask, Object.assign({havdalahMins}, attrs));
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const attrs = this.getAttrs();
    let str = gettext(this.getDesc(), locale);
    if (attrs.havdalahMins) {
      const min = gettext('min', locale);
      str += ` (${attrs.havdalahMins} ${min})`;
    }
    return str + ': ' + attrs.eventTimeStr;
  }
  /**
   * Returns translation of "Havdalah" without the time.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return gettext(this.getDesc(), locale);
  }
}

/** Candle lighting before Shabbat or holiday */
export class CandleLightingEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Object} attrs
   */
  constructor(date, mask, attrs) {
    super(date, 'Candle lighting', mask, attrs);
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return gettext(this.getDesc(), locale) + ': ' + this.getAttrs().eventTimeStr;
  }
  /**
   * Returns translation of "Candle lighting" without the time.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return gettext(this.getDesc(), locale);
  }
}
