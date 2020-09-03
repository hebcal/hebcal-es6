import {Locale} from './locale';
import {flags, Event} from './event';

const days = {
  FRI: 5,
  SAT: 6,
};

/**
 * @private
 * @param {Intl.DateTimeFormat} timeFormat
 * @param {Date} dt
 * @return {string}
 */
function formatTime(timeFormat, dt) {
  const time = timeFormat.format(dt);
  const hm = time.split(':');
  if (hm[0] === '24') {
    return '00:' + hm[1];
  }
  return time;
}

/**
 * @private
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
  sunset.setSeconds(0);
  const dt = new Date(sunset.getTime() + (offset * 60 * 1000));
  const time = formatTime(timeFormat, dt);
  return [dt, time];
}

/**
 * @private
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
  const sec = dt.getSeconds();
  const secondsDelta = (sec >= 30) ? 60 - sec : -1 * sec;
  const dtRounded = new Date(dt.getTime() + (secondsDelta * 1000));
  const time = formatTime(timeFormat, dtRounded);
  return [dt, time];
}

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
  const time = offset ?
    sunsetTime(hd, location, timeFormat, offset) :
    tzeitTime(hd, location, timeFormat);
  if (!time[0]) {
    return null; // no sunset
  }
  const attrs = {eventTime: time[0], eventTimeStr: time[1]};
  if (typeof e !== 'undefined') {
    attrs.linkedEvent = e;
  }
  if (havdalahTitle) {
    if (havdalahOffset) {
      attrs.havdalahMins = havdalahOffset;
    }
    return new HavdalahEvent(hd, mask, attrs);
  } else {
    return new CandleLightingEvent(hd, mask, attrs);
  }
}

/** Havdalah after Shabbat or holiday */
export class HavdalahEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} mask
   * @param {Object} attrs
   */
  constructor(date, mask, attrs) {
    super(date, 'Havdalah', mask, attrs);
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    let str = Locale.gettext(this.getDesc(), locale);
    if (this.havdalahMins) {
      const min = Locale.gettext('min', locale);
      str += ` (${this.havdalahMins} ${min})`;
    }
    return str + ': ' + this.eventTimeStr;
  }
  /**
   * Returns translation of "Havdalah" without the time.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext(this.getDesc(), locale);
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
