import suncalc from 'suncalc';
import {HDate} from './hdate';

suncalc.addTime(-16.1, 'alotHaShachar', 0);
suncalc.addTime(-11.5, 'misheyakir', 0);
suncalc.addTime(-10.2, 'misheyakirMachmir', 0);
suncalc.addTime(-8.5, 0, 'tzeit');

// eslint-disable-next-line require-jsdoc
function throwTypeError(error) {
  throw new TypeError(error);
}

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
    const dt = date instanceof Date ? date :
        date instanceof HDate ? date.greg() :
        throwTypeError(`invalid date: ${date}`);
    // reset the date to midday before calling suncalc api
    // https://github.com/mourner/suncalc/issues/11
    this.date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12, 0, 0, 0, 0);
    this.times = suncalc.getTimes(this.date, latitude, longitude);
    this.latitude = latitude;
    this.longitude = longitude;
  }
  /** @return {suncalc.GetTimesResult} */
  suntime() {
    return this.times;
  }
  /** @return {Date} */
  sunrise() {
    return this.times.sunrise;
  }
  /** @return {Date} */
  sunset() {
    return this.times.sunset;
  }
  /** @return {number} */
  hour() {
    return (this.times.sunset - this.times.sunrise) / 12; // ms in hour
  }
  /** @return {number} */
  hourMins() {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.hour() / (1000 * 60);
  }
  /** @return {Date} */
  gregEve() {
    const prev = new Date(this.date.getTime() - 24 * 60 * 60 * 1000);
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
  /** @return {Date} */
  chatzot() {
    return this.hourOffset(6);
  }
  /** @return {Date} */
  chatzotNight() {
    return new Date(this.sunrise().getTime() - (this.nightHour() * 6));
  }
  /** @return {Date} */
  alotHaShachar() {
    return this.times.alotHaShachar;
  }
  /** @return {Date} */
  misheyakir() {
    return this.times.misheyakir;
  }
  /** @return {Date} */
  misheyakirMachmir() {
    return this.times.misheyakirMachmir;
  }
  /** @return {Date} */
  sofZmanShma() { // Gra
    return this.hourOffset(3);
  }
  /** @return {Date} */
  sofZmanTfilla() { // Gra
    return this.hourOffset(4);
  }
  /** @return {Date} */
  minchaGedola() {
    return this.hourOffset(6.5);
  }
  /** @return {Date} */
  minchaKetana() {
    return this.hourOffset(9.5);
  }
  /** @return {Date} */
  plagHaMincha() {
    return this.hourOffset(10.75);
  }
  /** @return {Date} */
  tzeit() {
    return this.times.tzeit;
  }
  /** @return {Date} */
  neitzHaChama() {
    return this.sunrise();
  }
  /** @return {Date} */
  shkiah() {
    return this.sunset();
  }
}
