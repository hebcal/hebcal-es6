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
import {HDate, months} from '@hebcal/hdate';
import {renderParshaName} from './parshaName';
import QuickLRU from 'quick-lru';
import './locale'; // Adds Hebrew and Ashkenazic translations

const INCOMPLETE = 0;
const REGULAR = 1;
const COMPLETE = 2;

function yearType(hyear: number): number {
  const longC = HDate.longCheshvan(hyear);
  const shortK = HDate.shortKislev(hyear);
  if (longC && !shortK) {
    return COMPLETE;
  } else if (!longC && shortK) {
    return INCOMPLETE;
  } else {
    return REGULAR;
  }
}

/** The result from `Sedra.lookup()` */
export type SedraResult = {
  /**
   * Name of the parsha (or parshiyot) read on
   * Hebrew date, e.g. `['Noach']` or `['Matot', 'Masei']`
   */
  parsha: string[];
  /**
   * True if this is a regular parasha HaShavua
   * Torah reading, false if it's a special holiday reading
   */
  chag: boolean;
  /**
   * The parsha number (or numbers) using 1-indexing.
   * A `number` for a regular (single) parsha, and a `number[]`
   * for a doubled parsha.
   * For Parashat *Bereshit*, `num` would be equal to `1`, and for
   * *Matot-Masei* it would be `[42, 43]`
   */
  num?: number | number[];
  /** The date of the Shabbat this parsha is read */
  hdate: HDate;
};

/**
 * Represents Parashah HaShavua for an entire Hebrew year
 */
export class Sedra {
  private readonly year: number;
  private readonly il: boolean;
  private readonly firstSaturday: number;
  private readonly theSedraArray: readonly NumberOrString[];
  /**
   * Caculates the Parashah HaShavua for an entire Hebrew year
   * @param hyear - Hebrew year (e.g. 5749)
   * @param il - Use Israel sedra schedule (false for Diaspora)
   */
  constructor(hyear: number, il: boolean) {
    hyear = +hyear;
    this.year = hyear;

    const rh0 = new HDate(1, months.TISHREI, hyear);
    const rh = rh0.abs();
    const rhDay = rh0.getDay() + 1;

    // find the first Saturday on or after Rosh Hashana
    this.firstSaturday = HDate.dayOnOrBefore(6, rh + 6);
    const leap = +HDate.isLeapYear(hyear);
    this.il = Boolean(il);

    const type = yearType(hyear);
    let key = `${leap}${rhDay}${type}`;
    if (types[key]) {
      this.theSedraArray = types[key];
    } else {
      key = key + +this.il; // cast to num, then concat
      this.theSedraArray = types[key];
    }

    if (!this.theSedraArray) {
      throw new Error(
        `improper sedra year type ${key} calculated for ${hyear}`
      );
    }
  }

  /**
   * Returns the parsha (or parshiyot) read on Hebrew date
   * @deprecated Use {@link lookup} instead
   * @param hd Hebrew date or R.D. days
   */
  get(hd: HDate | number): string[] {
    return this.lookup(hd).parsha;
  }

  /**
   * Looks up parsha for the date, then returns a translated or transliterated string
   * @deprecated Use {@link lookup} instead
   * @param hd Hebrew date or R.D. days
   * @param [locale] Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale
   */
  getString(hd: HDate | number, locale?: string): string {
    const parsha = this.get(hd);
    return renderParshaName(parsha, locale);
  }

  /**
   * Checks to see if this day would be a regular parasha HaShavua
   * Torah reading or special holiday reading
   * @deprecated Use {@link lookup} instead
   * @param hd Hebrew date or R.D. days
   */
  isParsha(hd: HDate | number): boolean {
    return !this.lookup(hd).chag;
  }

  /**
   * Returns the date that a parsha occurs
   * or `null` if the parsha doesn't occur this year
   * @param parsha if a `string`, specified with Sephardic transliterations
   *  like `'Noach'` or `'Matot-Masei'`. If an array, must be a 1- or 2-element
   *  array such as `['Noach']` or `['Matot', 'Masei']`. If a `number`, should
   *  be a 0-based parsha index (`0` for Bereshit, `1` for Noach) or a negative
   *  number for a doubled parsha (e.g. `-21` for Vayakhel-Pekudei)
   */
  find(parsha: number | string | string[]): HDate | null {
    if (typeof parsha === 'number') {
      if (parsha >= parshiot.length || (parsha < 0 && !isValidDouble(parsha))) {
        throw new RangeError(`Invalid parsha number: ${parsha}`);
      }
      return this.findInternal(parsha);
    } else if (typeof parsha === 'string') {
      const num = parsha2id.get(parsha);
      if (typeof num === 'number') {
        return this.find(num);
      } else if (parsha.indexOf('-') !== -1) {
        if (parsha === CHMPESACH || parsha === CHMSUKOT) {
          return this.findInternal(parsha);
        }
        return this.find(parsha.split('-'));
      } else {
        // try to find Saturday holiday like 'Yom Kippur'
        return this.findInternal(parsha);
      }
    } else if (Array.isArray(parsha)) {
      const plen = parsha.length;
      if ((plen !== 1 && plen !== 2) || typeof parsha[0] !== 'string') {
        throw new TypeError(
          `Invalid parsha argument: ${JSON.stringify(parsha)}`
        );
      }
      if (plen === 1) {
        return this.find(parsha[0]);
      }
      const p1 = parsha[0];
      const p2 = parsha[1];
      const num1 = parsha2id.get(p1);
      const num2 = parsha2id.get(p2);
      if (
        typeof num1 !== 'number' ||
        typeof num2 !== 'number' ||
        num2 !== num1 + 1 ||
        !isValidDouble(-num1)
      ) {
        throw new RangeError(`Unrecognized parsha name: ${p1}-${p2}`);
      }
      return this.find(-num1);
    }
    return null; /* NOTREACHED */
  }

  private findInternal(parsha: NumberOrString): HDate | null {
    const idx = this.theSedraArray.indexOf(parsha);
    if (idx === -1) {
      return null; // doesn't occur this year
    }
    return new HDate(this.firstSaturday + idx * 7);
  }

  /**
   * Returns the date that a parsha (or its doubled or undoubled counterpart)
   * occurs, or `null` if the parsha doesn't occur this year
   */
  findContaining(parsha: number | string): HDate | null {
    const hdate = this.find(parsha);
    if (hdate) {
      return hdate;
    }
    if (typeof parsha === 'number') {
      // a valid negative number (double parsha in a year where they are
      // combined) would've been found above, and a invalid negative number
      // would've thrown an error, so this parsha must be a positive number
      // representing either p1 or p2
      const p1 = -parsha;
      if (isValidDouble(p1)) {
        return this.find(p1);
      } else {
        // this must be the second individual parsha of a doubled pair
        // for example 29 for Kedoshim, so check for -28 for Achrei Mot-Kedoshim
        return this.find(p1 + 1);
      }
    } else {
      const num = parsha2id.get(parsha);
      if (num) {
        // parsha is either the first or second individual parsha of
        // a pair that is doubled this year
        const p1 = -num;
        if (isValidDouble(p1)) {
          return this.find(p1);
        } else {
          return this.find(p1 + 1);
        }
      } else {
        // this was indeed a doubled parsha, so return date of the first half
        const [p1] = parsha.split('-');
        return this.find(p1);
      }
    }
  }

  /**
   * Returns the underlying annual sedra schedule.
   * Used by `@hebcal/triennial`
   */
  getSedraArray(): readonly NumberOrString[] {
    return this.theSedraArray;
  }

  /**
   * R.D. date of the first Saturday on or after Rosh Hashana
   */
  getFirstSaturday(): number {
    return this.firstSaturday;
  }

  getYear(): number {
    return this.year;
  }

  /**
   * Returns an object describing the parsha on the first Saturday on or after `hd`
   * @param hd Hebrew date or R.D. days
   */
  lookup(hd: HDate | number): SedraResult {
    const abs =
      typeof hd === 'number' ? hd : HDate.isHDate(hd) ? hd.abs() : NaN;

    if (isNaN(abs)) {
      throw new TypeError(`Bad date argument: ${hd}`);
    }

    // find the first saturday on or after today's date
    const saturday = HDate.dayOnOrBefore(6, abs + 6);

    const weekNum = (saturday - this.firstSaturday) / 7;
    const index = this.theSedraArray[weekNum];

    if (typeof index === 'undefined') {
      const sedra = getSedra(this.year + 1, this.il);
      return sedra.lookup(saturday); // must be next year
    }
    const hdate = new HDate(saturday);
    if (typeof index === 'string') {
      // Shabbat has a chag. Return a description
      return {parsha: [index], chag: true, hdate};
    }
    if (index >= 0) {
      return {parsha: [parshiot[index]], chag: false, num: index + 1, hdate};
    }

    const p1 = D(index); // undouble the parsha
    return {
      parsha: [parshiot[p1], parshiot[p1 + 1]],
      chag: false,
      num: [p1 + 1, p1 + 2],
      hdate,
    };
  }
}

/**
 * The 54 parshiyot of the Torah as transilterated strings.
 * parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[52] == "Ha'azinu".
 * @readonly
 * @type {string[]}
 */
export const parshiot: readonly string[] = [
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
  "Beha'alotcha",
  "Sh'lach",
  'Korach',
  'Chukat',
  'Balak',
  'Pinchas',
  'Matot',
  'Masei',
  'Devarim',
  'Vaetchanan',
  'Eikev',
  "Re'eh",
  'Shoftim',
  'Ki Teitzei',
  'Ki Tavo',
  'Nitzavim',
  'Vayeilech',
  "Ha'azinu",
] as const;

// 0-based parsha IDs
const parsha2id = new Map<string, number>();
for (let id = 0; id < parshiot.length; id++) {
  const name = parshiot[id];
  parsha2id.set(name, id);
}

// 0-based parsha IDs
const doubles = [
  21, // Vayakhel-Pekudei
  26, // Tazria-Metzora
  28, // Achrei Mot-Kedoshim
  31, // Behar-Bechukotai
  38, // Chukat-Balak
  41, // Matot-Masei
  50, // Nitzavim-Vayeilech
];

/**
 * @private
 * @param id a negative number
 */
function isValidDouble(id: number): boolean {
  return doubles.includes(-id);
}

/**
 * parsha doubler/undoubler
 * @private
 * @param p
 */
function D(p: number): number {
  return -p;
}

const RH = 'Rosh Hashana'; // 0
const YK = 'Yom Kippur'; // 1

const SUKKOT = 'Sukkot'; // 0
const CHMSUKOT = 'Sukkot Shabbat Chol ha-Moed'; // 0
const SHMINI = 'Shmini Atzeret'; // 0

const PESACH = 'Pesach'; // 25
const PESACH1 = 'Pesach I';
const CHMPESACH = 'Pesach Shabbat Chol ha-Moed'; // 25
const PESACH7 = 'Pesach VII'; // 25
const PESACH8 = 'Pesach VIII';
const SHAVUOT = 'Shavuot'; // 33

/**
 * Returns an array from start to end
 * @private
 * @param start beginning number, inclusive
 * @param stop ending number, inclusive
 */
function range(start: number, stop: number): readonly number[] {
  return Array.from({length: stop - start + 1}, (v, k) => k + start);
}

type NumberOrString = number | string;

const yearStartVayeilech: readonly NumberOrString[] = [51, 52, CHMSUKOT];
const yearStartHaazinu: readonly NumberOrString[] = [52, YK, CHMSUKOT];
const yearStartRH: readonly NumberOrString[] = [RH, 52, SUKKOT, SHMINI];
const r020 = range(0, 20);
const r027 = range(0, 27);
const r3340 = range(33, 40);
const r4349 = range(43, 49);
const r4350 = range(43, 50);

/**
 * The ordinary year types (keviot)
 * names are leap/nonleap - day - incomplete/regular/complete - diaspora/Israel
 * @private
 * @readonly
 */
const types: Record<string, readonly NumberOrString[]> = {
  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
   * Kislev each have 29 days), and has Passover start on Tuesday. */
  // e.g. 5753
  '020': yearStartVayeilech.concat(
    r020,
    D(21),
    23,
    24,
    PESACH,
    25,
    D(26),
    D(28),
    30,
    D(31),
    r3340,
    D(41),
    r4349,
    D(50)
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
   * Kislev each have 30 days), and has Passover start on Thursday. */
  // e.g. 5756
  '0220': yearStartVayeilech.concat(
    r020,
    D(21),
    23,
    24,
    PESACH,
    25,
    D(26),
    D(28),
    30,
    D(31),
    33,
    SHAVUOT,
    range(34, 37),
    D(38),
    40,
    D(41),
    r4349,
    D(50)
  ),

  /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
   * days and Kislev has 30 days), and has Passover start on Saturday. */
  // e.g. 5701
  '0510': yearStartHaazinu.concat(
    r020,
    D(21),
    23,
    24,
    PESACH1,
    PESACH8,
    25,
    D(26),
    D(28),
    30,
    D(31),
    r3340,
    D(41),
    r4350
  ),

  /* Hebrew year that starts on Thursday, is `regular' (Heshvan has 29
   * days and Kislev has 30 days), and has Passover start on Saturday. */
  // e.g. 5745
  '0511': yearStartHaazinu.concat(
    r020,
    D(21),
    23,
    24,
    PESACH,
    25,
    D(26),
    D(28),
    range(30, 40),
    D(41),
    r4350
  ),

  /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
   * Kislev each have 30 days), and has Passover start on Sunday. */
  // e.g. 5754
  '052': yearStartHaazinu.concat(
    range(0, 24),
    PESACH7,
    25,
    D(26),
    D(28),
    30,
    D(31),
    r3340,
    D(41),
    r4350
  ),

  /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and Kislev
   * each have 29 days), and has Passover start on Sunday. */
  // e.g. 5761
  '070': yearStartRH.concat(
    r020,
    D(21),
    23,
    24,
    PESACH7,
    25,
    D(26),
    D(28),
    30,
    D(31),
    r3340,
    D(41),
    r4350
  ),

  /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
   * Kislev each have 30 days), and has Passover start on Tuesday. */
  // e.g. 5716
  '072': yearStartRH.concat(
    r020,
    D(21),
    23,
    24,
    CHMPESACH,
    25,
    D(26),
    D(28),
    30,
    D(31),
    r3340,
    D(41),
    r4349,
    D(50)
  ),

  /* --  The leap year types (keviot) -- */
  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
   * Kislev each have 29 days), and has Passover start on Thursday. */
  // e.g. 5746
  '1200': yearStartVayeilech.concat(
    r027,
    CHMPESACH,
    range(28, 33),
    SHAVUOT,
    range(34, 37),
    D(38),
    40,
    D(41),
    r4349,
    D(50)
  ),

  /* Hebrew year that starts on Monday, is `incomplete' (Heshvan and
   * Kislev each have 29 days), and has Passover start on Thursday. */
  // e.g. 5746
  '1201': yearStartVayeilech.concat(
    r027,
    CHMPESACH,
    range(28, 40),
    D(41),
    r4349,
    D(50)
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
   * Kislev each have 30 days), and has Passover start on Saturday. */
  // e.g.5752
  '1220': yearStartVayeilech.concat(
    r027,
    PESACH1,
    PESACH8,
    range(28, 40),
    D(41),
    r4350
  ),

  /* Hebrew year that starts on Monday, is `complete' (Heshvan and
   * Kislev each have 30 days), and has Passover start on Saturday. */
  // e.g.5752
  '1221': yearStartVayeilech.concat(r027, PESACH, range(28, 50)),

  /* Hebrew year that starts on Thursday, is `incomplete' (Heshvan and
   * Kislev both have 29 days), and has Passover start on Sunday. */
  // e.g. 5768
  '150': yearStartHaazinu.concat(range(0, 28), PESACH7, range(29, 50)),

  /* Hebrew year that starts on Thursday, is `complete' (Heshvan and
   * Kislev both have 30 days), and has Passover start on Tuesday. */
  // eg. 5771
  '152': yearStartHaazinu.concat(range(0, 28), CHMPESACH, range(29, 49), D(50)),

  /* Hebrew year that starts on Saturday, is `incomplete' (Heshvan and
   * Kislev each have 29 days), and has Passover start on Tuesday. */
  // e.g.5757
  '170': yearStartRH.concat(
    r027,
    CHMPESACH,
    range(28, 40),
    D(41),
    r4349,
    D(50)
  ),

  /* Hebrew year that starts on Saturday, is `complete' (Heshvan and
   * Kislev each have 30 days), and has Passover start on Thursday. */
  '1720': yearStartRH.concat(
    r027,
    CHMPESACH,
    range(28, 33),
    SHAVUOT,
    range(34, 37),
    D(38),
    40,
    D(41),
    r4349,
    D(50)
  ),
} as const;

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

const sedraCache = new QuickLRU<string, Sedra>({maxSize: 400});

/**
 * Convenience function to create an instance of `Sedra` or reuse a previously
 * created and cached instance.
 * @param hyear
 * @param il
 */
export function getSedra(hyear: number, il: boolean): Sedra {
  const cacheKey = `${hyear}-${il ? 1 : 0}`;
  let sedra = sedraCache.get(cacheKey);
  if (!sedra) {
    sedra = new Sedra(hyear, il);
    sedraCache.set(cacheKey, sedra);
  }
  return sedra;
}
