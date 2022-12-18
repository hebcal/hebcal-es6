import {greg2abs, abs2greg, isDate} from './greg0';
import {HDate} from './hdate';
import {throwTypeError} from './throwTypeError';

const nach = [
  ['Joshua', 24],
  ['Judges', 21],
  ['I Samuel', 31],
  ['II Samuel', 24],
  ['I Kings', 22],
  ['II Kings', 25],
  ['Isaiah', 66],
  ['Jeremiah', 52],
  ['Ezekiel', 48],
  ['Hosea', 14],
  ['Joel', 4],
  ['Amos', 9],
  ['Obadiah', 1],
  ['Jonah', 4],
  ['Micah', 7],
  ['Nachum', 3],
  ['Habakkuk', 3],
  ['Zephaniah', 3],
  ['Haggai', 2],
  ['Zechariah', 14],
  ['Malachi', 3],
  ['Psalms', 150],
  ['Proverbs', 31],
  ['Job', 42],
  ['Song of Songs', 8],
  ['Ruth', 4],
  ['Lamentations', 5],
  ['Ecclesiastes', 12],
  ['Esther', 10],
  ['Daniel', 12],
  ['Ezra', 10],
  ['Nehemiah', 13],
  ['I Chronicles', 29],
  ['II Chronicles', 36],
];

const cycleStartDate = new Date(2007, 10, 1);
export const nachYomiStart = greg2abs(cycleStartDate);

const numChapters = 742;

/**
 * Describes a chapter to be read
 * @typedef {Object} NachYomi
 * @property {string} k book name in Sephardic transliteration (e.g. "Berakhot", "Moed Katan")
 * @property {number} v chapter (e.g. "2:1")
 */

/**
 * A daily regimen of learning the books of Nevi'im (Prophets)
 * and Ketuvim (Writings).
 */
export class NachYomiIndex {
  /**
   * Initializes a Nach Yomi instance
   */
  constructor() {
    const days = Array(numChapters);
    let i = 0;
    for (let j = 0; j < nach.length; j++) {
      const book = nach[j][0];
      const chapters = nach[j][1];
      for (let chap = 1; chap <= chapters; chap++) {
        days[i++] = {k: book, v: chap};
      }
    }
    this.days = days;
  }

  /**
   * Looks up a Mishna Yomi
   * @param {Date|HDate|number} date Gregorian date
   * @return {NachYomi}
   */
  lookup(date) {
    const abs = (typeof date === 'number' && !isNaN(date)) ? date :
      isDate(date) ? greg2abs(date) :
      HDate.isHDate(date) ? date.abs() :
      throwTypeError(`Invalid date: ${date}`);
    if (abs < nachYomiStart) {
      const dt = abs2greg(abs);
      const s = dt.toISOString().substring(0, 10);
      throw new RangeError(`Date ${s} too early; Nach Yomi cycle began on 2007-11-01`);
    }
    const dayNum = (abs - nachYomiStart) % numChapters;
    return this.days[dayNum];
  }
}
