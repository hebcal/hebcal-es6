/* eslint-disable no-multi-spaces */
/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {greg2abs, isDate} from './greg0';
import {Locale} from './locale';
import {Event, flags} from './event';
import {HDate} from './hdate';
import {gematriya} from './gematriya';

const osdate = new Date(1923, 8, 11);
const osday = greg2abs(osdate);
const nsday = greg2abs(new Date(1975, 5, 24));

const shas0 = [
  ['Berachot',       64],
  ['Shabbat',        157],
  ['Eruvin',         105],
  ['Pesachim',       121],
  ['Shekalim',       22],
  ['Yoma',           88],
  ['Sukkah',         56],
  ['Beitzah',        40],
  ['Rosh Hashana',   35],
  ['Taanit',         31],
  ['Megillah',       32],
  ['Moed Katan',     29],
  ['Chagigah',       27],
  ['Yevamot',        122],
  ['Ketubot',        112],
  ['Nedarim',        91],
  ['Nazir',          66],
  ['Sotah',          49],
  ['Gitin',          90],
  ['Kiddushin',      82],
  ['Baba Kamma',     119],
  ['Baba Metzia',    119],
  ['Baba Batra',     176],
  ['Sanhedrin',      113],
  ['Makkot',         24],
  ['Shevuot',        49],
  ['Avodah Zarah',   76],
  ['Horayot',        14],
  ['Zevachim',       120],
  ['Menachot',       110],
  ['Chullin',        142],
  ['Bechorot',       61],
  ['Arachin',        34],
  ['Temurah',        34],
  ['Keritot',        28],
  ['Meilah',         22],
  ['Kinnim',         4],
  ['Tamid',          9],
  ['Midot',          5],
  ['Niddah',         73],
].map((m) => {
  return {name: m[0], blatt: m[1]};
});

// eslint-disable-next-line require-jsdoc
function throwTypeError(msg) {
  throw new TypeError(msg);
}

/**
 * Returns the Daf Yomi for given date
 */
export class DafYomi {
  /**
   * Initializes a daf yomi instance
   * @param {Date|HDate|number} gregdate Gregorian date
   */
  constructor(gregdate) {
    const cday = (typeof gregdate === 'number' && !isNaN(gregdate)) ? gregdate :
      isDate(gregdate) ? greg2abs(gregdate) :
      HDate.isHDate(gregdate) ? gregdate.abs() :
      throwTypeError(`non-date given to dafyomi: ${gregdate}`);
    if (cday < osday) {
      throw new RangeError(`Date ${gregdate} too early; Daf Yomi cycle began on ${osdate}`);
    }
    let cno;
    let dno;
    if (cday >= nsday) { // "new" cycle
      cno = 8 + Math.floor( (cday - nsday) / 2711 );
      dno = (cday - nsday) % 2711;
    } else { // old cycle
      cno = 1 + Math.floor( (cday - osday) / 2702 );
      dno = (cday - osday) % 2702;
    }

    // Find the daf taking note that the cycle changed slightly after cycle 7.

    let total = 0;
    let blatt = 0;
    let count = -1;

    // Fix Shekalim for old cycles
    const shortShekalim = cno <= 7;
    const shas = shortShekalim ? shas0.slice() : shas0;
    if (shortShekalim) {
      shas[4] = {name: 'Shekalim', blatt: 13};
    }

    // Find the daf
    let j = 0;
    const dafcnt = 40;
    while (j < dafcnt) {
      count++;
      total = total + shas[j].blatt - 1;
      if (dno < total) {
        blatt = (shas[j].blatt + 1) - (total - dno);
        // fiddle with the weird ones near the end
        switch (count) {
          case 36:
            blatt = blatt + 21;
            break;
          case 37:
            blatt = blatt + 24;
            break;
          case 38:
            blatt = blatt + 32;
            break;
          default:
            break;
        }
        // Bailout
        j = 1 + dafcnt;
      }
      j++;
    }

    this.name = shas[count].name;
    this.blatt = blatt;
  }
  /**
   * @return {number}
   */
  getBlatt() {
    return this.blatt;
  }
  /**
   * @return {string}
   */
  getName() {
    return this.name;
  }
  /**
   * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return Locale.gettext(this.name, locale) + ' דף ' +
        gematriya(this.blatt);
    }
    return Locale.gettext(this.name, locale) + ' ' + this.blatt;
  }
}

const dafYomiSefaria = {
  'Berachot': 'Berakhot',
  'Rosh Hashana': 'Rosh Hashanah',
  'Gitin': 'Gittin',
  'Baba Kamma': 'Bava Kamma',
  'Baba Metzia': 'Bava Metzia',
  'Baba Batra': 'Bava Batra',
  'Bechorot': 'Bekhorot',
  'Arachin': 'Arakhin',
  'Midot': 'Middot',
  'Shekalim': 'Jerusalem_Talmud_Shekalim',
};

/**
 * Event wrapper around a DafYomi instance
 */
export class DafYomiEvent extends Event {
  /**
   * @param {HDate} date
   */
  constructor(date) {
    const daf = new DafYomi(date.greg());
    super(date, daf.render(), flags.DAF_YOMI, {daf: daf});
  }
  /**
   * Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext('Daf Yomi', locale) + ': ' + this.daf.render(locale);
  }
  /**
   * Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return this.daf.render(locale);
  }
  /**
   * Returns a link to sefaria.org or dafyomi.org
   * @return {string}
   */
  url() {
    const daf = this.daf;
    const tractate = daf.getName();
    const blatt = daf.getBlatt();
    if (tractate == 'Kinnim' || tractate == 'Midot') {
      return `https://www.dafyomi.org/index.php?masechta=meilah&daf=${blatt}a`;
    } else {
      const name0 = dafYomiSefaria[tractate] || tractate;
      const name = name0.replace(/ /g, '_');
      return `https://www.sefaria.org/${name}.${blatt}a?lang=bi`;
    }
  }
}
