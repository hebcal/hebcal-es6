import {abs2greg, greg2abs, isDate} from './greg0';
import {HDate} from './hdate';
import mishnayot from './mishnayot.json';
import {throwTypeError} from './throwTypeError';

const cycleStartDate = new Date(1947, 4, 20);
export const mishnaYomiStart = greg2abs(cycleStartDate);

const numMishnayot = 4192;
const numDays = numMishnayot / 2;

/**
 * Describes a mishna to be read
 * @typedef {Object} MishnaYomi
 * @property {string} k tractate name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan")
 * @property {string} v verse (e.g. "2:1")
 */

/**
 * A program of daily learning in which participants study two Mishnahs
 * each day in order to finish the entire Mishnah in ~6 years.
 */
export class MishnaYomiIndex {
  /**
   * Initializes a Mishna Yomi instance
   */
  constructor() {
    const tmp = Array(numMishnayot);
    let i = 0;
    for (let j = 0; j < mishnayot.length; j++) {
      const tractate = mishnayot[j];
      const v = tractate.v;
      for (let chap = 1; chap <= v.length; chap++) {
        const numv = v[chap - 1];
        for (let verse = 1; verse <= numv; verse++) {
          tmp[i++] = {k: tractate.k, v: `${chap}:${verse}`};
        }
      }
    }
    const days = Array(numDays);
    for (let j = 0; j < numDays; j++) {
      const k = j * 2;
      days[j] = [tmp[k], tmp[k + 1]];
    }
    /** @type {MishnaYomi[]} */
    this.days = days;
  }

  /**
   * Looks up a Mishna Yomi
   * @param {Date|HDate|number} date Gregorian date
   * @return {MishnaYomi[]}
   */
  lookup(date) {
    const abs = (typeof date === 'number' && !isNaN(date)) ? date :
      isDate(date) ? greg2abs(date) :
      HDate.isHDate(date) ? date.abs() :
      throwTypeError(`Invalid date: ${date}`);
    if (abs < mishnaYomiStart) {
      const dt = abs2greg(abs);
      const s = dt.toISOString().substring(0, 10);
      throw new RangeError(`Date ${s} too early; Mishna Yomi cycle began on 1947-05-20`);
    }
    const dayNum = (abs - mishnaYomiStart) % numDays;
    return this.days[dayNum];
  }
}
