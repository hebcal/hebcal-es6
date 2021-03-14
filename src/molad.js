/* eslint-disable camelcase */
import {HDate} from './hdate';
import {Event, flags} from './event';

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Represents a molad, the moment when the new moon is "born"
 */
export class Molad {
  /**
   * Calculates the molad for a Hebrew month
   * @param {number} year
   * @param {number} month
   */
  constructor(year, month) {
    let m_adj = month - 7;
    if (m_adj < 0) {
      m_adj += HDate.monthsInYear(year);
    }

    const m_elapsed = (235 * Math.floor((year - 1) / 19)) + // Months in complete 19 year lunar (Metonic) cycles so far
          (12 * ((year - 1) % 19)) + // Regular months in this cycle
          Math.floor((7 * ((year - 1) % 19) + 1) / 19) + // Leap months this cycle
          m_adj; // add elapsed months till the start of the molad of the month

    const p_elapsed = 204 + Math.floor(793 * (m_elapsed % 1080));

    const h_elapsed = 5 + (12 * m_elapsed) + (793 * Math.floor(m_elapsed / 1080)) + Math.floor(p_elapsed / 1080) - 6;

    const parts = (p_elapsed % 1080) + (1080 * (h_elapsed % 24));

    const chalakim = parts % 1080;

    const day = 1 + (29 * m_elapsed) + Math.floor(h_elapsed / 24);

    const dow = day % 7;

    this.year = year;
    this.month = month;
    this.dow = dow;
    this.hour = h_elapsed % 24;
    this.minutes = Math.floor(chalakim / 18);
    this.chalakim = chalakim % 18;
  }
  /**
   * @return {number}
   */
  getYear() {
    return this.year;
  }
  /**
   * @return {number}
   */
  getMonth() {
    return this.month;
  }
  /**
   * @return {string}
   */
  getMonthName() {
    return HDate.getMonthName(this.month, this.year);
  }
  /**
   * @return {number} Day of Week (0=Sunday, 6=Saturday)
   */
  getDow() {
    return this.dow;
  }
  /**
   * @return {number} hour of day (0-23)
   */
  getHour() {
    return this.hour;
  }
  /**
   * @return {number} minutes past hour (0-59)
   */
  getMinutes() {
    return this.minutes;
  }
  /**
   * @return {number} parts of a minute (0-17)
   */
  getChalakim() {
    return this.chalakim;
  }
}

/** Represents a Molad announcement on Shabbat Mevarchim */
export class MoladEvent extends Event {
  /**
   * @param {HDate} date Hebrew date event occurs
   * @param {number} hyear molad year
   * @param {number} hmonth molad month
   */
  constructor(date, hyear, hmonth) {
    const m = new Molad(hyear, hmonth);
    const monthName = m.getMonthName();
    super(date, `Molad ${monthName} ${hyear}`, flags.MOLAD);
    this.molad = m;
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const m = this.molad;
    const monthName = m.getMonthName();
    const dow = shortDayNames[m.getDow()];
    const minutes = m.getMinutes();
    const hour = m.getHour();
    const chalakim = m.getChalakim();
    return `Molad ${monthName}: ${dow}, ${minutes} minutes and ${chalakim} chalakim after ${hour}:00`;
  }
}
