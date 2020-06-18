/* eslint-disable new-cap */
/* eslint-disable camelcase */
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
 *  nachum@cs.uiuc.edu               1304 West Springfield Avenue
 *                                   Urbana, Illinois 61801
 *
 * The routines were included in the emacs 19 distribution.
 *
 */
import c from './common';
import {HDate} from './hdate';

const INCOMPLETE = 0;
const REGULAR = 1;
const COMPLETE = 2;

/** Represents Parashah HaShavua for an entire Hebrew year */
export class Sedra {
  /**
     * Caculates the Parashah HaShavua for an entire Hebrew year
     * @param {number} hebYr - Hebrew year (e.g. 5749)
     * @param {boolean} il - Use Israel sedra schedule (false for Diaspora)
     */
  constructor(hebYr, il) { // the Hebrew year
    il = !!il;
    const long_c = c.longCheshvan(hebYr);
    const short_k = c.shortKislev(hebYr);
    let type;
    this.year = hebYr;
    if (long_c && !short_k) {
      type = COMPLETE;
    } else if (!long_c && short_k) {
      type = INCOMPLETE;
    } else {
      type = REGULAR;
    }

    const rosh_hashana = new HDate(1, c.months.TISHREI, hebYr).abs();
    const rosh_hashana_day = (rosh_hashana % 7) + 1;

    // find the first Saturday on or after Rosh Hashana
    this.first_saturday = c.dayOnOrBefore(6, rosh_hashana + 6);
    const leap = +c.hebLeapYear(hebYr);
    this.type = type;
    this.rosh_hashana_day = rosh_hashana_day;
    this.leap = leap;
    this.il = il;

    const core = `${leap}${rosh_hashana_day}${type}`;
    if (types[core]) {
      this.theSedraArray = types[core];
    } else {
      this.theSedraArray = types[core + (+il)]; // cast to num, then concat
    }

    if (!this.theSedraArray) {
      console.log(this);
      throw new TypeError('improper sedra year type calculated.');
    }
  }

  // eslint-disable-next-line require-jsdoc
  throwError(errorMessage) {
    throw new Error(errorMessage);
  }

  /**
     * Returns the parsha (or parshiyot) read on Hebrew date
     * @param {HDate|number} hDate Hebrew date or absolute days
     * @return {string[]}
     */
  get(hDate) {
    const abs0 = (typeof hDate == 'number') ?
        hDate : ((hDate instanceof HDate) ?
        hDate.abs() : this.throwError('Bad date argument'));
    return abs(this, abs0).parsha;
  }

  /**
     * Looks up parsha for the date, then returns a (translated) string
     * @param {HDate|number} hDate Hebrew date or absolute days
     * @return {string}
     */
  getString(hDate) {
    const parsha = this.get(hDate);
    return 'Parashat ' + parsha.join('-');
  }

  /**
     * Returns an object describing the parsha on the first Saturday on or after absdate
     * @param {HDate|number} hDate Hebrew date or absolute days
     * @return {Object}
     */
  lookup(hDate) {
    const abs0 = (typeof hDate == 'number') ?
        hDate : ((hDate instanceof HDate) ?
        hDate.abs() : this.throwError('Bad date argument'));
    return abs(this, abs0);
  }

  /**
     * Checks to see if this day would be a regular parasha HaShavua
     * Torah reading or special holiday reading
     * @param {HDate|number} hDate Hebrew date or absolute days
     * @return {boolean}
     */
  isParsha(hDate) {
    const abs0 = (typeof hDate == 'number') ?
        hDate : ((hDate instanceof HDate) ?
        hDate.abs() : this.throwError('Bad date argument'));
    return !abs(this, abs0).chag;
  }

  /** @return {Object[]} */
  getSedraArray() {
    return this.theSedraArray;
  }

  /** @return {number} */
  getYear() {
    return this.year;
  }
}

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

/**
 * parsha doubler/undoubler
 * @param {number} p
 * @return {number}
 */
function D(p) {
  return -p;
}

const RH = 'Rosh Hashana'; // 0
const YK = 'Yom Kippur'; // 1

const SUKKOT = 'Sukkot'; // 0
const CHMSUKOT = 'Sukkot Shabbat Chol ha-Moed'; // 0
const SHMINI = 'Shmini Atzeret'; // 0
const EOY = 'End-of-Year: Simchat-Torah, Sukkot'; // 0

const PESACH = 'Pesach'; // 25
const CHMPESACH = 'Pesach Shabbat Chol ha-Moed'; // 25
const PESACH7 = 'Pesach VII'; // 25

const SHAVUOT = 'Shavuot'; // 33


// The ordinary year types (keviot)

// names are leap/nonleap - day - incomplete/regular/complete - diaspora/Israel

const types = {

  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Tuesday. */
  // e.g. 5753
  '020': [51, 52].concat(EOY, c.range(0, 20), D(21), 23, 24, PESACH, 25,
      D(26), D(28), 30, D(31), c.range(33, 40), D(41), c.range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Thursday. */
  // e.g. 5756
  '0220': [51, 52].concat(EOY, c.range(0, 20), D(21), 23, 24, PESACH, 25, D(26), D(28),
      30, D(31), 33, SHAVUOT, c.range(34, 37), D(38), 40, D(41), c.range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
     * days and Kislev has 30 days), and has Passover start on Saturday. */
  // e.g. 5701
  '0510': [52].concat(YK, EOY, c.range(0, 20), D(21), 23, 24, PESACH, PESACH,
      25, D(26), D(28), 30, D(31), c.range(33, 40), D(41), c.range(43, 50),
  ),

  /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
     * days and Kislev has 30 days), and has Passover start on Saturday. */
  // e.g. 5745
  '0511': [52].concat(YK, EOY, c.range(0, 20), D(21), 23, 24, PESACH,
      25, D(26), D(28), c.range(30, 40), D(41), c.range(43, 50),
  ),

  /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Sunday. */
  // e.g. 5754
  '052': [52].concat(YK, CHMSUKOT, c.range(0, 24), PESACH7, 25, D(26),
      D(28), 30, D(31), c.range(33, 40), D(41), c.range(43, 50),
  ),

  /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and Kislev
     * each have 29 days), and has Passover start on Sunday. */
  // e.g. 5761
  '070': [].concat(RH, 52, SUKKOT, SHMINI, c.range(0, 20), D(21), 23, 24, PESACH7,
      25, D(26), D(28), 30, D(31), c.range(33, 40), D(41), c.range(43, 50),
  ),


  /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Tuesday. */
  // e.g. 5716
  '072': [].concat(RH, 52, SUKKOT, SHMINI, c.range(0, 20), D(21), 23, 24, CHMPESACH, 25,
      D(26), D(28), 30, D(31), c.range(33, 40), D(41), c.range(43, 49), D(50),
  ),


  /* --  The leap year types (keviot) -- */
  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Thursday. */
  // e.g. 5746
  '1200': [51, 52].concat(CHMSUKOT, c.range(0, 27), CHMPESACH, c.range(28, 33),
      SHAVUOT, c.range(34, 37), D(38), 40, D(41), c.range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Thursday. */
  // e.g. 5746
  '1201': [51, 52].concat(CHMSUKOT, c.range(0, 27), CHMPESACH,
      c.range(28, 40), D(41), c.range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Saturday. */
  // e.g.5752
  '1220': [51, 52].concat(CHMSUKOT, c.range(0, 27), PESACH,
      PESACH, c.range(28, 40), D(41), c.range(43, 50),
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Saturday. */
  // e.g.5752
  '1221': [51, 52].concat(CHMSUKOT, c.range(0, 27), PESACH, c.range(28, 50)),

  /* Hebrew year that starts on Thursday, is `incomplete' (Heshvan and
     * Kislev both have 29 days), and has Passover start on Sunday. */
  // e.g. 5768
  '150': [52].concat(YK, CHMSUKOT, c.range(0, 28), PESACH7, c.range(29, 50)),

  /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
     * Kislev both have 30 days), and has Passover start on Tuesday. */
  // eg. 5771
  '152': [52].concat(YK, CHMSUKOT, c.range(0, 28), CHMPESACH, c.range(29, 49), D(50)),

  /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and
     * Kislev each have 29 days), and has Passover start on Tuesday. */
  // e.g.5757
  '170': [].concat(RH, 52, SUKKOT, SHMINI, c.range(0, 27), CHMPESACH,
      c.range(28, 40), D(41), c.range(43, 49), D(50),
  ),

  /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
     * Kislev each have 30 days), and has Passover start on Thursday. */
  '1720': [].concat(RH, 52, SUKKOT, SHMINI, c.range(0, 27), CHMPESACH, c.range(28, 33),
      SHAVUOT, c.range(34, 37), D(38), 40, D(41), c.range(43, 49), D(50),
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


/**
 * Returns an object describing the parsha on the first Saturday on or after absdate
 * @param {number} year
 * @param {number} absDate
 * @return {Object}
 */
function abs(year, absDate) {
  // find the first saturday on or after today's date
  absDate = c.dayOnOrBefore(6, absDate + 6);

  const weekNum = (absDate - year.first_saturday) / 7;
  let index = year.theSedraArray[weekNum];

  if (undefined === index) {
    return abs(new Sedra(year.year + 1, year.il), absDate); // must be next year
  }
  if (typeof index === 'string') {
    // Shabbat has a chag. Return a description
    return {parsha: [index], chag: true};
  }
  if (index >= 0) {
    return {parsha: [parshiot[index]], chag: false};
  }

  index = D(index); // undouble the parsha
  return {parsha: [parshiot[index], parshiot[index + 1]], chag: false};
}

export default {
  Sedra,
  parshiot,
};
