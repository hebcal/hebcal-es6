import {HDate} from './hdate';
import {Sedra, parshiot} from './sedra';

const doubled = [
  21, // Vayakhel-Pekudei
  26, // Tazria-Metzora
  28, // Achrei Mot-Kedoshim
  31, // Behar-Bechukotai
  38, // Chukat-Balak
  41, // Matot-Masei
  50, // Nitzavim-Vayeilech
];
const isSometimesDoubled = {};
doubled.forEach((id) => {
  isSometimesDoubled[id] = true;
  isSometimesDoubled[id + 1] = true;
});

/**
 * takes a 0-based (Bereshit=0) parsha ID
 * @param {number} id
 * @return {string}
 */
function getDoubledName(id) {
  const p1 = parshiot[id];
  const p2 = parshiot[id + 1];
  const name = p1 + '-' + p2;
  return name;
}

const ALIYOT_JSON_NAME = './aliyot.json';
let parshiyotObj;
let triennialAliyot;

/** Triennial Torah readings */
export class Triennial {
  /**
   * Builds a Triennial object
   * @param {number} [hebrewYear] Hebrew Year (default current year)
   * @param {Object} [aliyot] aliyot.json object
   */
  constructor(hebrewYear, aliyot) {
    if (typeof aliyot == 'object' && typeof aliyot.Bereshit == 'object') {
      parshiyotObj = aliyot;
      triennialAliyot = Triennial.getTriennialAliyot();
    } else if (!parshiyotObj) {
      console.debug(`Loading ${ALIYOT_JSON_NAME}...`);
      parshiyotObj = require(ALIYOT_JSON_NAME);
      triennialAliyot = Triennial.getTriennialAliyot();
    }

    // year I in triennial cycle was 5756
    const hyear = hebrewYear || new HDate().getFullYear();
    const yearNum = Triennial.getYearNumber(hyear);

    this.startYear = Triennial.getCycleStartYear(hyear);
    console.debug(`Hebrew year ${hyear} is year ${yearNum}; triennial cycle started year ${this.startYear}`);
    const sedra0 = new Sedra(this.startYear, false).getSedraArray();
    this.bereshit = [0];
    this.sedraArray = sedra0.slice(sedra0.indexOf(0));
    for (let yr = 1; yr < 4; yr++) {
      const sedra = new Sedra(this.startYear + yr, false);
      const arr = sedra.getSedraArray();
      this.bereshit[yr] = this.sedraArray.length + arr.indexOf(0);
      this.sedraArray = this.sedraArray.concat(arr);
    }
    const cycleOption = this.calcVariationOptions();
    this.readings = this.cycleReadings(cycleOption);
  }

  /**
   * @return {Object}
   */
  getReadings() {
    return this.readings;
  }

  /**
   * @return {number}
   */
  getStartYear() {
    return this.startYear;
  }

  /**
   * Returns triennial year 1, 2 or 3 based on this Hebrew year
   * @param {number} year Hebrew year
   * @return {number}
   */
  static getYearNumber(year) {
    return Math.abs((year - 5756) % 3) + 1;
  }

  /**
     * Returns Hebrew year that this 3-year triennial cycle began
     * @param {number} year Hebrew year
     * @return {number}
     */
  static getCycleStartYear(year) {
    return year - (this.getYearNumber(year) - 1);
  }

  /**
     * First, determine if a doubled parsha is read [T]ogether or [S]eparately
     * in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.
     * @param {number} id
     * @return {string}
     */
  getThreeYearPattern(id) {
    let pattern = '';
    for (const yr of [0, 1, 2]) {
      let found = this.sedraArray.indexOf(-1 * id, this.bereshit[yr]);
      if (found > this.bereshit[yr + 1]) {
        found = -1;
      }
      const pat = (found == -1) ? 'S' : 'T';
      pattern += pat;
    }
    return pattern;
  }

  // eslint-disable-next-line require-jsdoc
  calcVariationOptions() {
    const option = {};
    for (const id of doubled) {
      const pattern = this.getThreeYearPattern(id);
      const name = getDoubledName(id);
      // Next, look up the pattern in JSON to determine readings for each year.
      // For "all-together", use "Y" pattern to imply Y.1, Y.2, Y.3
      const variation = (pattern === 'TTT') ?
                'Y' : parshiyotObj[name].triennial.patterns[pattern];
      if (typeof variation === 'undefined') {
        throw new Error(`Can't find pattern ${pattern} for ${name}`);
      }
      const p1 = parshiot[id];
      const p2 = parshiot[id + 1];
      option[name] = option[p1] = option[p2] = variation;
      console.debug(`  ${name} ${pattern} (${option[name]})`);
    }
    return option;
  }

  /**
   * Builds a lookup table readings["Bereshit"][1], readings["Matot-Masei"][3]
   * @param {Object} cycleOption
   * @return {Object}
   */
  cycleReadings(cycleOption) {
    const readings = {};
    for (const parsha of parshiot) {
      readings[parsha] = [];
    }
    for (const id of doubled) {
      const parsha = getDoubledName(id);
      readings[parsha] = [];
    }
    for (const yr of [1, 2, 3]) {
      this.cycleReadingsForYear(cycleOption, readings, yr);
    }
    return readings;
  }

  /**
    * @param {string} option
    * @param {Object} readings
    * @param {number} yr
    */
  cycleReadingsForYear(option, readings, yr) {
    const startIdx = this.bereshit[yr - 1];
    const endIdx = this.bereshit[yr];
    const sedraArray = this.sedraArray.slice(startIdx, endIdx);
    for (const id of sedraArray) {
      if (typeof id !== 'number') {
        continue; // skip string (holiday) sedras
      }
      const h = (id < 0) ? getDoubledName(-id) : parshiot[id];
      const variationKey = isSometimesDoubled[id] ? option[h] : 'Y';
      const variation = variationKey + '.' + yr;
      const a = triennialAliyot[h][variation];
      if (!a) {
        throw new Error(`can't find ${h} year ${yr} (variation ${variation})`);
      }
      readings[h][yr] = a;
    }
    // create links for doubled
    for (const id of doubled) {
      const h = getDoubledName(id);
      if (readings[h][yr]) {
        const p1 = parshiot[id];
        const p2 = parshiot[id + 1];
        readings[p1][yr] = readings[p2][yr] = {readTogether: h};
      }
    }
  }

  /**
   * Walks parshiyotObj and builds lookup table for triennial aliyot
   * @return {Object}
   */
  static getTriennialAliyot() {
    const triennialAliyot = {};
    const triennialAliyotAlt = {};
    // build a lookup table so we don't have to follow num/variation/sameas
    for (const [parsha, value] of Object.entries(parshiyotObj)) {
      if (value.triennial) { // Vezot Haberakhah has no triennial
        triennialAliyot[parsha] = Triennial.resolveSameAs(parsha, value.book, value.triennial);
        if (value.triennial.alt) {
          triennialAliyotAlt[parsha] = Triennial.resolveSameAs(parsha, value.book, value.triennial.alt);
        }
      }
    }
    // TODO: handle triennialAliyotAlt also
    return triennialAliyot;
  }

  /**
   * Transforms input JSON with sameAs shortcuts like "D.2":"A.3" to
   * actual aliyot objects for a given variation/year
   * @param {string} parsha
   * @param {string} book
   * @param {Object} triennial
   * @return {Object}
   */
  static resolveSameAs(parsha, book, triennial) {
    const variations = triennial.years || triennial.variations;
    if (typeof variations === 'undefined') {
      throw new Error(`Parashat ${parsha} has no years or variations`);
    }
    // first pass, copy only alyiot definitions from parshiyotObj into lookup table
    const lookup = {};
    for (const [variation, aliyot] of Object.entries(variations)) {
      if (typeof aliyot === 'object') {
        const dest = {};
        for (const [num, src] of Object.entries(aliyot)) {
          const reading = {book: book, begin: src.b, end: src.e};
          if (src.v) {
            reading.numverses = src.v;
          }
          dest[num] = reading;
        }
        lookup[variation] = dest;
      }
    }
    // second pass to resolve sameas strings (to simplify later lookups)
    for (const [variation, aliyot] of Object.entries(variations)) {
      if (typeof aliyot === 'string') {
        if (typeof lookup[aliyot] === 'undefined') {
          throw new Error(`Can't find source for ${parsha} ${variation} sameas=${aliyot}`);
        }
        lookup[variation] = lookup[aliyot];
      }
    }
    return lookup;
  }
}

const __cache = new Map();

/**
 * Calculates the 3-year readings for a given year
 * @param {number} year Hebrew year
 * @return {Triennial}
 */
export function getTriennial(year) {
  const cycleStartYear = Triennial.getCycleStartYear(year);
  const cached = __cache.get(cycleStartYear);
  if (cached) {
    return cached;
  }
  const tri = new Triennial(cycleStartYear);
  __cache.set(cycleStartYear, tri);
  return tri;
}


export default {
  getTriennial,
  Triennial,
};
