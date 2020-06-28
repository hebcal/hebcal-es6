/* eslint-disable camelcase */
import {common} from './common';
import {Event, flags} from './event';

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Represents a Molad
 * @typedef {Object} Molad
 * @property {number} dow - Day of Week (0=Sunday, 6=Saturday)
 * @property {number} hour - hour of day (0-23)
 * @property {number} minutes - minutes past hour (0-59)
 * @property {number} chalakim - parts of a minute (0-17)
 */

/**
 * Calculates the molad for a Hebrew month
 * @private
 * @param {number} year
 * @param {number} month
 * @return {Molad}
 */
export function getMolad(year, month) {
  let m_adj = month - 7;
  if (m_adj < 0) {
    m_adj += common.monthsInHebYear(year);
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

  return {
    dow: dow,
    hour: h_elapsed % 24,
    minutes: Math.floor(chalakim / 18),
    chalakim: chalakim % 18,
  };
}

/** Represents a Molad announcement on Shabbat Mevarchim */
export class MoladEvent extends Event {
  /**
   * @param {HDate} date Hebrew date event occurs
   * @param {number} hyear molad year
   * @param {number} hmonth molad month
   */
  constructor(date, hyear, hmonth) {
    const m = getMolad(hyear, hmonth);
    const mMonthName = common.getMonthName(hmonth, hyear);
    super(date, `Molad ${mMonthName} ${hyear}`, flags.MOLAD, {molad: m, monthName: mMonthName});
  }
  /**
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const m = this.getAttrs().molad;
    const monthName = this.getAttrs().monthName;
    const dow = shortDayNames[m.dow];
    return `Molad ${monthName}: ${dow}, ${m.minutes} minutes and ${m.chalakim} chalakim after ${m.hour}:00`;
  }
}
