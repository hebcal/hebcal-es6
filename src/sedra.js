/* eslint-disable new-cap */
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

/*
 * Many of the following algorithms were taken from hebrew calendar
 * routines by Maimonedes, from his Mishneh Torah, and implemented by
 *  Nachum Dershowitz                Department of Computer Science
 *  (217) 333-4219                   University of Illinois at Urbana-Champaign
 *  nachum@cs.uiuedu               1304 West Springfield Avenue
 *                                   Urbana, Illinois 61801
 *
 * The routines were included in the emacs 19 distribution.
 *
 */
import {Locale} from './locale';
import {HDate, months} from './hdate';
import {Event, flags} from './event';

const INCOMPLETE = 0;
const REGULAR = 1;
const COMPLETE = 2;

// eslint-disable-next-line require-jsdoc
function throwError(errorMessage) {
  throw new TypeError(errorMessage);
}

/**
 * Result of Sedra.lookup
 * @typedef {Object} SedraResult
 * @property {string[]} parsha Name of the parsha (or parshiyot) read on
 *     Hebrew date, e.g. `['Noach']` or `['Matot', 'Masei']`
 * @property {boolean} chag True if this is a regular parasha HaShavua
 *     Torah reading, false if it's a special holiday reading
 */

/**
 * Represents Parashah HaShavua for an entire Hebrew year
 */
export class Sedra {
  /**
   * Caculates the Parashah HaShavua for an entire Hebrew year
   * @param {number} hebYr - Hebrew year (e.g. 5749)
   * @param {boolean} il - Use Israel sedra schedule (false for Diaspora)
   */
  constructor(hebYr, il) { // the Hebrew year
    hebYr = +hebYr;
    const longC = HDate.longCheshvan(hebYr);
    const shortK = HDate.shortKislev(hebYr);
    const type = this.type = (longC && !shortK) ? COMPLETE :
      (!longC && shortK) ? INCOMPLETE :
      REGULAR;
    this.year = hebYr;

    const rh0 = new HDate(1, months.TISHREI, hebYr);
    const rh = rh0.abs();
    const rhDay = this.roshHashanaDay = rh0.getDay() + 1;

    // find the first Saturday on or after Rosh Hashana
    this.firstSaturday = HDate.dayOnOrBefore(6, rh + 6);
    const leap = this.leap = +HDate.isLeapYear(hebYr);
    this.il = Boolean(il);

    const key = `${leap}${rhDay}${type}`;
    if (types[key]) {
      this.key = key;
      this.theSedraArray = types[key];
    } else {
      const key2 = this.key = key + (+this.il); // cast to num, then concat
      this.theSedraArray = types[key2];
    }

    if (!this.theSedraArray) {
      throw new Error(`improper sedra year type ${this.key} calculated for ${hebYr}`);
    }
  }

  /**
   * Returns the parsha (or parshiyot) read on Hebrew date
   * @param {HDate|number} hDate Hebrew date or R.D. days
   * @return {string[]}
   */
  get(hDate) {
    return this.lookup(hDate).parsha;
  }

  /**
   * Looks up parsha for the date, then returns a translated or transliterated string
   * @param {HDate|number} hDate Hebrew date or R.D. days
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale
   * @return {string}
   */
  getString(hDate, locale) {
    const parsha = this.get(hDate);
    const locale0 = locale || Locale.getLocaleName();
    let name = Locale.gettext(parsha[0], locale0);
    if (parsha.length == 2) {
      const hyphen = locale0 == 'he' ? '־' : '-';
      name += hyphen + Locale.gettext(parsha[1], locale0);
    }
    return Locale.gettext('Parashat', locale0) + ' ' + name;
  }

  /**
   * Checks to see if this day would be a regular parasha HaShavua
   * Torah reading or special holiday reading
   * @param {HDate|number} hDate Hebrew date or R.D. days
   * @return {boolean}
   */
  isParsha(hDate) {
    return !this.lookup(hDate).chag;
  }

  /**
   * Returns the date that a parsha occurs
   * @param {number|string|string[]} parsha
   * @return {HDate}
   */
  find(parsha) {
    if (typeof parsha === 'number') {
      if (parsha > 53 || (parsha < 0 && !isValidDouble(parsha))) {
        throw new RangeError(`Invalid parsha number: ${parsha}`);
      }
      const idx = this.theSedraArray.indexOf(parsha);
      if (idx === -1) {
        return null; // doesn't occur this year
      }
      return new HDate(this.firstSaturday + (idx * 7));
    } else if (typeof parsha === 'string') {
      const num = parsha2id[parsha];
      if (typeof num === 'number') {
        return this.find(num);
      } else if (parsha.indexOf('-') !== -1) {
        return this.find(parsha.split('-'));
      } else {
        // try to find Saturday holiday like 'Yom Kippur'
        const idx = this.theSedraArray.indexOf(parsha);
        if (idx === -1) {
          return null; // doesn't occur this year
        }
        return new HDate(this.firstSaturday + (idx * 7));
      }
    } else if (Array.isArray(parsha) && parsha.length === 1 &&
               typeof parsha[0] === 'string') {
      return this.find(parsha[0]);
    } else if (Array.isArray(parsha) && parsha.length === 2 &&
               typeof parsha[0] === 'string' && typeof parsha[1] === 'string') {
      const p1 = parsha[0];
      const p2 = parsha[1];
      const num1 = parsha2id[p1];
      const num2 = parsha2id[p2];
      if (num2 === num1 + 1) {
        return this.find(-num1);
      } else {
        throw new RangeError(`Unrecognized parsha name: ${p1}-${p2}`);
      }
    } else {
      throw new TypeError(`Invalid parsha argument: ${parsha}`);
    }
  }

  /**
   * @private
   * @return {Object[]}
   */
  getSedraArray() {
    return this.theSedraArray;
  }

  /**
   * R.D. date of the first Saturday on or after Rosh Hashana
   * @return {number}
   */
  getFirstSaturday() {
    return this.firstSaturday;
  }

  /** @return {number} */
  getYear() {
    return this.year;
  }

  /**
   * Returns an object describing the parsha on the first Saturday on or after absdate
   * @param {HDate|number} hDate Hebrew date or R.D. days
   * @return {SedraResult}
   */
  lookup(hDate) {
    const absDate = (typeof hDate === 'number') ? hDate :
      HDate.isHDate(hDate) ? hDate.abs() :
      throwError(`Bad date argument: ${hDate}`);

    // find the first saturday on or after today's date
    const saturday = HDate.dayOnOrBefore(6, absDate + 6);

    const weekNum = (saturday - this.firstSaturday) / 7;
    const index = this.theSedraArray[weekNum];

    if (typeof index === 'undefined') {
      const sedra = new Sedra(this.year + 1, this.il);
      return sedra.lookup(saturday); // must be next year
    }
    if (typeof index === 'string') {
    // Shabbat has a chag. Return a description
      return {parsha: [index], chag: true};
    }
    if (index >= 0) {
      return {parsha: [parshiot[index]], chag: false};
    }

    const p1 = D(index); // undouble the parsha
    return {parsha: [parshiot[p1], parshiot[p1 + 1]], chag: false};
  }
}

/**
 * The 54 parshiyot of the Torah as transilterated strings
 * parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[53] == "Ha'Azinu".
 * @readonly
 * @type {string[]}
 */
export const parshiot = [
  'Bereshit',
  'Noach',
  'Lech-Lecha',
  'Vayera',
  'Chayei Sara',
  'Toldot',
  'Vayetzei',
  'Vayishlach',
  'Vayeshev',
  'Miketz',
  'Vayigash',
  'Vayechi',
  'Shemot',
  'Vaera',
  'Bo',
  'Beshalach',
  'Yitro',
  'Mishpatim',
  'Terumah',
  'Tetzaveh',
  'Ki Tisa',
  'Vayakhel',
  'Pekudei',
  'Vayikra',
  'Tzav',
  'Shmini',
  'Tazria',
  'Metzora',
  'Achrei Mot',
  'Kedoshim',
  'Emor',
  'Behar',
  'Bechukotai',
  'Bamidbar',
  'Nasso',
  'Beha\'alotcha',
  'Sh\'lach',
  'Korach',
  'Chukat',
  'Balak',
  'Pinchas',
  'Matot',
  'Masei',
  'Devarim',
  'Vaetchanan',
  'Eikev',
  'Re\'eh',
  'Shoftim',
  'Ki Teitzei',
  'Ki Tavo',
  'Nitzavim',
  'Vayeilech',
  'Ha\'Azinu',
];

const parsha2id = {};
for (let id = 0; id < parshiot.length; id++) {
  const name = parshiot[id];
  parsha2id[name] = id;
}

/**
 * @private
 * @param {number} id
 * @return {boolean}
 */
function isValidDouble(id) {
  switch (id) {
    case -21: // Vayakhel-Pekudei
    case -26: // Tazria-Metzora
    case -28: // Achrei Mot-Kedoshim
    case -31: // Behar-Bechukotai
    case -38: // Chukat-Balak
    case -41: // Matot-Masei
    case -50: // Nitzavim-Vayeilech
      return true;
  }
  return false;
}

/**
 * @private
 * @param {number} p
 * @return {number}
 */
function D(p) {
  // parsha doubler/undoubler
  return -p;
}

const RH = 'Rosh Hashana'; // 0
const YK = 'Yom Kippur'; // 1

const SUKKOT = 'Sukkot'; // 0
const CHMSUKOT = 'Sukkot Shabbat Chol ha-Moed'; // 0
const SHMINI = 'Shmini Atzeret'; // 0
const EOY = CHMSUKOT; // always Sukkot day 3, 5 or 6

const PESACH = 'Pesach'; // 25
const PESACH1 = 'Pesach I';
const CHMPESACH = 'Pesach Shabbat Chol ha-Moed'; // 25
const PESACH7 = 'Pesach VII'; // 25
const PESACH8 = 'Pesach VIII';
const SHAVUOT = 'Shavuot'; // 33

/**
 * Returns an array from start to end
 * @private
 * @param {number} start beginning number, inclusive
 * @param {number} stop ending number, inclusive
 * @return {number[]}
 */
function range(start, stop) {
  return Array.from({length: stop - start + 1}, (v, k) => k + start);
}

/**
 * The ordinary year types (keviot)
 * names are leap/nonleap - day - incomplete/regular/complete - diaspora/Israel
 * @private
 * @readonly
 * @type {Object.<string, Object[]>}
 */
const types = {

  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Tuesday. */
  // e.g. 5753
  '020': [51, 52].concat(EOY, range(0, 20), D(21), 23, 24, PESACH, 25,
      D(26), D(28), 30, D(31), range(33, 40), D(41), range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Thursday. */
  // e.g. 5756
  '0220': [51, 52].concat(EOY, range(0, 20), D(21), 23, 24, PESACH, 25, D(26), D(28),
      30, D(31), 33, SHAVUOT, range(34, 37), D(38), 40, D(41), range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
     * days and Kislev has 30 days), and has Passover start on Saturday. */
  // e.g. 5701
  '0510': [52].concat(YK, EOY, range(0, 20), D(21), 23, 24, PESACH1, PESACH8,
      25, D(26), D(28), 30, D(31), range(33, 40), D(41), range(43, 50),
  ),

  /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
     * days and Kislev has 30 days), and has Passover start on Saturday. */
  // e.g. 5745
  '0511': [52].concat(YK, EOY, range(0, 20), D(21), 23, 24, PESACH,
      25, D(26), D(28), range(30, 40), D(41), range(43, 50),
  ),

  /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Sunday. */
  // e.g. 5754
  '052': [52].concat(YK, CHMSUKOT, range(0, 24), PESACH7, 25, D(26),
      D(28), 30, D(31), range(33, 40), D(41), range(43, 50),
  ),

  /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and Kislev
     * each have 29 days), and has Passover start on Sunday. */
  // e.g. 5761
  '070': [].concat(RH, 52, SUKKOT, SHMINI, range(0, 20), D(21), 23, 24, PESACH7,
      25, D(26), D(28), 30, D(31), range(33, 40), D(41), range(43, 50),
  ),


  /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Tuesday. */
  // e.g. 5716
  '072': [].concat(RH, 52, SUKKOT, SHMINI, range(0, 20), D(21), 23, 24, CHMPESACH, 25,
      D(26), D(28), 30, D(31), range(33, 40), D(41), range(43, 49), D(50),
  ),


  /* --  The leap year types (keviot) -- */
  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Thursday. */
  // e.g. 5746
  '1200': [51, 52].concat(CHMSUKOT, range(0, 27), CHMPESACH, range(28, 33),
      SHAVUOT, range(34, 37), D(38), 40, D(41), range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Thursday. */
  // e.g. 5746
  '1201': [51, 52].concat(CHMSUKOT, range(0, 27), CHMPESACH,
      range(28, 40), D(41), range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Saturday. */
  // e.g.5752
  '1220': [51, 52].concat(CHMSUKOT, range(0, 27), PESACH1,
      PESACH8, range(28, 40), D(41), range(43, 50),
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Saturday. */
  // e.g.5752
  '1221': [51, 52].concat(CHMSUKOT, range(0, 27), PESACH, range(28, 50)),

  /* Hebrew year that starts on Thursday, is `incomplete' (Heshvan and
     * Kislev both have 29 days), and has Passover start on Sunday. */
  // e.g. 5768
  '150': [52].concat(YK, CHMSUKOT, range(0, 28), PESACH7, range(29, 50)),

  /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
     * Kislev both have 30 days), and has Passover start on Tuesday. */
  // eg. 5771
  '152': [52].concat(YK, CHMSUKOT, range(0, 28), CHMPESACH, range(29, 49), D(50)),

  /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Tuesday. */
  // e.g.5757
  '170': [].concat(RH, 52, SUKKOT, SHMINI, range(0, 27), CHMPESACH,
      range(28, 40), D(41), range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Thursday. */
  '1720': [].concat(RH, 52, SUKKOT, SHMINI, range(0, 27), CHMPESACH, range(28, 33),
      SHAVUOT, range(34, 37), D(38), 40, D(41), range(43, 49), D(50),
  ),
};

/* Hebrew year that starts on Monday, is `complete' (Heshvan and
 * Kislev each have 30 days), and has Passover start on Thursday. */
types['0221'] = types['020'];

/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Thursday. */
// e.g. 5715
types['0310'] = types['0220'];

/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Thursday. */
types['0311'] = types['020'];

/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Saturday. */
// e.g. 5715
types['1310'] = types['1220'];
/* Hebrew year that starts on Tuesday, is `regular' (Heshvan has 29
 * days and Kislev has 30 days), and has Passover start on Saturday. */
types['1311'] = types['1221'];

/* Hebrew year that starts on Saturday, is `complete' (Heshvan and
 * Kislev each have 30 days), and has Passover start on Thursday. */
types['1721'] = types['170'];

/** Represents one of 54 weekly Torah portions, always on a Saturday  */
export class ParshaEvent extends Event {
  /**
   * @param {HDate} date
   * @param {string[]} parsha - untranslated name of single or double parsha,
   *   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim']
   * @param {boolean} il
   */
  constructor(date, parsha, il) {
    if (!Array.isArray(parsha) || parsha.length === 0 || parsha.length > 2) {
      throw new TypeError('Bad parsha argument');
    }
    const desc = 'Parashat ' + parsha.join('-');
    super(date, desc, flags.PARSHA_HASHAVUA);
    this.parsha = parsha;
    this.il = Boolean(il);
  }
  /**
   * @param {string} [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
   * @return {string}
   */
  render(locale) {
    const locale0 = locale || Locale.getLocaleName();
    const parsha = this.parsha;
    let name = Locale.gettext(parsha[0], locale);
    if (parsha.length == 2) {
      const hyphen = locale0 == 'he' ? '־' : '-';
      name += hyphen + Locale.gettext(parsha[1], locale);
    }
    const str = Locale.gettext('Parashat', locale) + ' ' + name;
    return str.normalize();
  }
  /** @return {string} */
  basename() {
    return this.parsha.join('-');
  }
  /** @return {string} */
  url() {
    const year = this.getDate().greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const dt = this.urlDateSuffix();
    const url = 'https://www.hebcal.com/sedrot/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') + '-' + dt;
    return this.il ? url + '?i=on' : url;
  }

  /** @return {string} */
  urlDateSuffix() {
    const isoDateTime = this.getDate().greg().toISOString();
    const isoDate = isoDateTime.substring(0, isoDateTime.indexOf('T'));
    return isoDate.replace(/-/g, '');
  }
}
