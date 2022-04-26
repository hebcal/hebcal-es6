import {HDate} from './hdate';
import {SolarCalc} from '@hebcal/solar-calc';
import {getTimezoneOffset, getPseudoISO} from './getTimezoneOffset';
import {greg} from './greg';

// eslint-disable-next-line require-jsdoc
function throwTypeError(error) {
  throw new TypeError(error);
}

/**
 * @private
 * @param {number} number
 * @return {string}
 */
function pad2(number) {
  if (number < 10) {
    return '0' + number;
  }
  return String(number);
}

/**
 * @typedef {Object} ZmanimTimesResult
 * @property {Date} dawn
 * @property {Date} dusk
 * @property {Date} goldenHour
 * @property {Date} goldenHourEnd
 * @property {Date} nauticalDawn
 * @property {Date} nauticalDusk
 * @property {Date} night
 * @property {Date} nightEnd
 * @property {Date} solarNoon
 * @property {Date} sunrise
 * @property {Date} sunriseEnd
 * @property {Date} sunset
 * @property {Date} sunsetStart
 * @property {Date} alotHaShachar
 * @property {Date} misheyakir
 * @property {Date} misheyakirMachmir
 * @property {Date} tzeit
*/

/** Class representing halachic times */
export class Zmanim {
  /**
     * Initialize a Zmanim instance.
     * @param {Date|HDate} date Regular or Hebrew Date. If `date` is a regular `Date`,
     *    hours, minutes, seconds and milliseconds are ignored.
     * @param {number} latitude
     * @param {number} longitude
     */
  constructor(date, latitude, longitude) {
    if (typeof latitude !== 'number') throw new TypeError('Invalid latitude');
    if (typeof longitude !== 'number') throw new TypeError('Invalid longitude');
    if (latitude < -90 || latitude > 90) {
      throw new RangeError(`Latitude ${latitude} out of range [-90,90]`);
    }
    if (longitude < -180 || longitude > 180) {
      throw new RangeError(`Longitude ${longitude} out of range [-180,180]`);
    }
    const dt = greg.isDate(date) ? date :
        HDate.isHDate(date) ? date.greg() :
        throwTypeError(`invalid date: ${date}`);
    this.date = dt;
    this.solarCalc = new SolarCalc(this.date, latitude, longitude);
    this.sun = this.solarCalc.sun;
    this.latitude = latitude;
    this.longitude = longitude;
  }
  /**
   * @deprecated
   * @return {ZmanimTimesResult}
   */
  suntime() {
    return {
      solarNoon: this.solarCalc.solarNoon,
      sunrise: this.sunrise(),
      sunset: this.sunset(),
      sunriseEnd: this.solarCalc.sunriseEnd,
      sunsetStart: this.solarCalc.sunsetStart,
      dawn: this.dawn(),
      dusk: this.dusk(),
      nauticalDawn: this.solarCalc.nauticalDawn,
      nauticalDusk: this.solarCalc.nauticalDusk,
      nightEnd: this.solarCalc.nightEnd,
      night: this.solarCalc.nightStart,
      goldenHourEnd: this.solarCalc.goldenHourEnd,
      goldenHour: this.solarCalc.goldenHourStart,
      alotHaShachar: this.alotHaShachar(),
      misheyakir: this.misheyakir(),
      misheyakirMachmir: this.misheyakirMachmir(),
      tzeit: this.tzeit(),
    };
  }
  /**
   * Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
   * @return {Date}
   */
  sunrise() {
    return this.sun.timeAtAngle(0.833333, true);
  }
  /**
   * When the upper edge of the Sun disappears below the horizon (0.833° below horizon)
   * @return {Date}
   */
  sunset() {
    return this.sun.timeAtAngle(0.833333, false);
  }
  /**
   * Civil dawn; Sun is 6° below the horizon in the morning
   * @return {Date}
   */
  dawn() {
    return this.solarCalc.dawn;
  }
  /**
   * Civil dusk; Sun is 6° below the horizon in the evening
   * @return {Date}
   */
  dusk() {
    return this.solarCalc.dusk;
  }
  /** @return {number} */
  hour() {
    return (this.sunset() - this.sunrise()) / 12; // ms in hour
  }
  /** @return {number} */
  hourMins() {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.hour() / (1000 * 60);
  }
  /** @return {Date} */
  gregEve() {
    const prev = new Date(this.date);
    prev.setDate(prev.getDate() - 1);
    const zman = new Zmanim(prev, this.latitude, this.longitude);
    return zman.sunset();
  }
  /** @return {number} */
  nightHour() {
    return (this.sunrise() - this.gregEve()) / 12; // ms in hour
  }
  /** @return {number} */
  nightHourMins() {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.nightHour() / (1000 * 60);
  }
  /**
     * @param {number} hours
     * @return {Date}
     */
  hourOffset(hours) {
    return new Date(this.sunrise().getTime() + (this.hour() * hours));
  }
  /**
   * Midday – Chatzot; Sunrise plus 6 halachic hours
   * @return {Date}
   */
  chatzot() {
    return this.hourOffset(6);
  }
  /**
   * Midnight – Chatzot; Sunset plus 6 halachic hours
   * @return {Date}
   */
  chatzotNight() {
    return new Date(this.sunrise().getTime() - (this.nightHour() * 6));
  }
  /**
   * Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning
   * @return {Date}
   */
  alotHaShachar() {
    return this.sun.timeAtAngle(16.1, true);
  }
  /**
   * Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning
   * @return {Date}
   */
  misheyakir() {
    return this.sun.timeAtAngle(11.5, true);
  }
  /**
   * Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning
   * @return {Date}
   */
  misheyakirMachmir() {
    return this.sun.timeAtAngle(10.2, true);
  }
  /**
   * Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra
   * @return {Date}
   */
  sofZmanShma() { // Gra
    return this.hourOffset(3);
  }
  /**
   * Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra
   * @return {Date}
   */
  sofZmanTfilla() { // Gra
    return this.hourOffset(4);
  }
  /**
   * Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham
   * @return {Date}
   */
  sofZmanShmaMGA() { // Magen Avraham
    const alot72 = this.sunriseOffset(-72);
    const tzeit72 = this.sunsetOffset(72);
    const temporalHour = (tzeit72 - alot72) / 12; // ms in hour
    return new Date(alot72.getTime() + (3 * temporalHour));
  }
  /**
   * Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham
   * @return {Date}
   */
  sofZmanTfillaMGA() { // Magen Avraham
    const alot72 = this.sunriseOffset(-72);
    const tzeit72 = this.sunsetOffset(72);
    const temporalHour = (tzeit72 - alot72) / 12; // ms in hour
    return new Date(alot72.getTime() + (4 * temporalHour));
  }
  /**
   * Earliest Mincha – Mincha Gedola; Sunrise plus 6.5 halachic hours
   * @return {Date}
   */
  minchaGedola() {
    return this.hourOffset(6.5);
  }
  /**
   * Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours
   * @return {Date}
   */
  minchaKetana() {
    return this.hourOffset(9.5);
  }
  /**
   * Plag haMincha; Sunrise plus 10.75 halachic hours
   * @return {Date}
   */
  plagHaMincha() {
    return this.hourOffset(10.75);
  }
  /**
   * @param {number} [angle=8.5] optional time for solar depression.
   *   Default is 8.5 degrees for 3 small stars, use 7.083 degress for 3 medium-sized stars.
   * @return {Date}
   */
  tzeit(angle=8.5) {
    return this.sun.timeAtAngle(angle, false);
  }
  /**
   * Alias for sunrise
   * @return {Date}
   */
  neitzHaChama() {
    return this.sunrise();
  }
  /**
   * Alias for sunset
   * @return {Date}
   */
  shkiah() {
    return this.sunset();
  }

  /**
   * Uses timeFormat to return a date like '20:34'
   * @param {Date} dt
   * @param {Intl.DateTimeFormat} timeFormat
   * @return {string}
   */
  static formatTime(dt, timeFormat) {
    const time = timeFormat.format(dt);
    const hm = time.split(':');
    if (hm[0] === '24') {
      return '00:' + hm[1];
    }
    return time;
  }

  /**
   * Discards seconds, rounding to nearest minute.
   * @param {Date} dt
   * @return {Date}
   */
  static roundTime(dt) {
    const millis = dt.getTime();
    if (isNaN(millis)) {
      return dt;
    }
    // Round up to next minute if needed
    const millisOnly = dt.getMilliseconds();
    const seconds = dt.getSeconds();
    if (seconds === 0 && millisOnly === 0) {
      return dt;
    }
    const secAndMillis = (seconds * 1000) + millisOnly;
    const delta = (secAndMillis >= 30000) ? 60000 - secAndMillis : -1 * secAndMillis;
    return new Date(millis + delta);
  }

  /**
   * Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")
   * @param {string} tzid
   * @param {Date} date
   * @return {string}
   */
  static timeZoneOffset(tzid, date) {
    const offset = getTimezoneOffset(tzid, date);
    const offsetAbs = Math.abs(offset);
    const hours = Math.floor(offsetAbs / 60);
    const minutes = offsetAbs % 60;
    return (offset < 0 ? '+' : '-') + pad2(hours) + ':' + pad2(minutes);
  }

  /**
   * Returns a string like "2022-04-01T13:06:00-11:00"
   * @param {string} tzid
   * @param {Date} date
   * @return {string}
   */
  static formatISOWithTimeZone(tzid, date) {
    if (isNaN(date.getTime())) {
      return null;
    }
    return getPseudoISO(tzid, date).substring(0, 19) + Zmanim.timeZoneOffset(tzid, date);
  }

  /**
   * Returns sunrise + `offset` minutes (either positive or negative).
   * @param {number} offset minutes
   * @return {Date}
   */
  sunriseOffset(offset) {
    const sunrise = this.sunrise();
    if (isNaN(sunrise.getTime())) {
      return sunrise;
    }
    // For positive offsets only, round up to next minute if needed
    if (offset > 0 && sunrise.getSeconds() >= 30) {
      offset++;
    }
    sunrise.setSeconds(0, 0);
    return new Date(sunrise.getTime() + (offset * 60 * 1000));
  }

  /**
   * Returns sunset + `offset` minutes (either positive or negative).
   * @param {number} offset minutes
   * @return {Date}
   */
  sunsetOffset(offset) {
    const sunset = this.sunset();
    if (isNaN(sunset.getTime())) {
      return sunset;
    }
    // For Havdalah only, round up to next minute if needed
    if (offset > 0 && sunset.getSeconds() >= 30) {
      offset++;
    }
    sunset.setSeconds(0, 0);
    return new Date(sunset.getTime() + (offset * 60 * 1000));
  }

  /**
   * Returns an array with sunset + offset Date object, and a 24-hour string formatted time.
   * @deprecated
   * @param {number} offset
   * @param {Intl.DateTimeFormat} timeFormat
   * @return {Object[]}
   */
  sunsetOffsetTime(offset, timeFormat) {
    const dt = this.sunsetOffset(offset);
    if (isNaN(dt.getTime())) {
      // `No sunset for ${location} on ${hd}`
      return [undefined, undefined];
    }
    const time = Zmanim.formatTime(dt, timeFormat);
    return [dt, time];
  }

  /**
   * Returns an array with tzeit Date object and a 24-hour string formatted time.
   * @deprecated
   * @param {number} angle degrees for solar depression.
   *   Default is 8.5 degrees for 3 small stars, use 7.083 degress for 3 medium-sized stars.
   * @param {Intl.DateTimeFormat} timeFormat
   * @return {Object[]}
   */
  tzeitTime(angle, timeFormat) {
    const dt = this.tzeit(angle);
    if (isNaN(dt.getTime())) {
      return [undefined, undefined];
    }
    const time = Zmanim.roundTime(dt);
    const timeStr = Zmanim.formatTime(time, timeFormat);
    return [time, timeStr];
  }
}
