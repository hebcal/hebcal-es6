import { HDate } from './hdate';
import { Sedra, parshiot } from './sedra';

// const festivals = require('./holiday-readings.json');
// const allInOrder = parshiot.slice();

const doubled = [
    21, // Vayakhel-Pekudei
    26, // Tazria-Metzora
    28, // Achrei Mot-Kedoshim
    31, // Behar-Bechukotai
    38, // Chukat-Balak
    41, // Matot-Masei
    50  // Nitzavim-Vayeilech
];
const isSometimesDoubled = {};
doubled.forEach((id) => {
    isSometimesDoubled[id] = true;
    isSometimesDoubled[id + 1] = true;
});

// takes a 0-based (Bereshit=0) parsha ID
function getDoubledName(id) {
    const p1 = parshiot[id];
    const p2 = parshiot[id + 1];
    const name = p1 + '-' + p2;
    return name;
}

const ALIYOT_JSON_NAME = './aliyot.json';
let parshiyotObj;
let triennialAliyot;

export class Triennial {
    constructor(hebrewYear) {
        if (!parshiyotObj) {
            console.debug(`Loading ${ALIYOT_JSON_NAME}...`);
            parshiyotObj = require(ALIYOT_JSON_NAME);
            triennialAliyot = Triennial.getTriennialAliyot();
        }

        // year I in triennial cycle was 5756
        const hyear = hebrewYear || new HDate().getFullYear();
        const yearNum = Triennial.getYearNumber(hyear);

        const cycleStartYear = Triennial.getCycleStartYear(hyear);
        console.log(`Hebrew year ${hyear} is year ${yearNum}; triennial cycle started year ${cycleStartYear}`);
        this.sedras = [];
        for (const yr of [0,1,2]) {
            this.sedras.push(new Sedra(cycleStartYear + yr, false));
        }
        const cycleOption = Triennial.calcVariationOptions(this.sedras);    
        this.readings = Triennial.cycleReadings(triennialAliyot, this.sedras, cycleOption);
    }

    getReadings() {
        return this.readings;
    }

    /**
     * Returns triennial year 1, 2 or 3 based on this Hebrew year
     * @param {number} year Hebrew year
     * @returns {number}
     */
    static getYearNumber(year) {
        return Math.abs((year - 5756) % 3) + 1;
    }

    /**
     * Returns Hebrew year that this 3-year triennial cycle began
     * @param {number} year Hebrew year
     * @returns {number}
     */
    static getCycleStartYear(year) {
        return year - (this.getYearNumber(year) - 1);
    }

    /**
     * First, determine if a doubled parsha is read [T]ogether or [S]eparately
     * in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.
     * @param {Sedra[]} sedras 
     * @param {number} id 
     * @returns {string}
     */
    static getThreeYearPattern(sedras, id) {
        let pattern = '';
        for (const yr of [0,1,2]) {
            const sedraArray = sedras[yr].getSedraArray();
            const pat = sedraArray.indexOf(-1 * id) == -1 ? 'S' : 'T';
            pattern += pat;
        }
        return pattern;
    }

    static calcVariationOptions(sedras) {
        const option = {};
        for (const id of doubled) {
            const pattern = Triennial.getThreeYearPattern(sedras, id);
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
            console.log(`  ${name} ${pattern} (${option[name]})`);
        }
        return option;
    }
    
    /**
     * Builds a lookup table readings["Bereshit"][1], readings["Matot-Masei"][3]
     * @param {Object} triennialAliyot 
     * @param {Sedra[]} sedras 
     * @param {Object} cycleOption 
     */
    static cycleReadings(triennialAliyot, sedras, cycleOption) {
        const readings = {};
        for (const parsha of parshiot) {
            readings[parsha] = [];
        }
        for (const id of doubled) {
            const parsha = getDoubledName(id);
            readings[parsha] = [];
        }
        for (const yr of [1,2,3]) {
            Triennial.cycleReadingsForYear(triennialAliyot, sedras, cycleOption, readings, yr);
        }
        return readings;
    }

    static cycleReadingsForYear(triennialAliyot, sedras, option, readings, yr) {
        const sedraArray = sedras[yr-1].getSedraArray();
        for (const id of sedraArray) {
            if (typeof id !== 'number') {
                continue; // skip string (holiday) sedras
            }
            const h = (id < 0) ? getDoubledName(-id) : parshiot[id];
            const variationKey = isSometimesDoubled[id] ? option[h] : 'Y';
            const variation    = variationKey + '.' + yr;
            const a            = triennialAliyot[h][variation];
            if (!a) {
                throw new Error(`can't find ${h} year ${yr} (variation ${variation})`);
            }
            readings[h][yr] = a;
        }
    }

    /**
     * Walks parshiyotObj and builds lookup table for triennial aliyot
     */
    static getTriennialAliyot() {
        const triennialAliyot = {};
        const triennialAliyotAlt = {};
        // build a lookup table so we don't have to follow num/variation/sameas
        for (const [parsha, value] of Object.entries(parshiyotObj)) {
    //        console.log(parsha);
            if (value.triennial) { // Vezot Haberakhah has no triennial
                triennialAliyot[parsha] = Triennial.resolveSameAs(parsha, value.triennial);
                if (value.triennial.alt) {
                    triennialAliyotAlt[parsha] = Triennial.resolveSameAs(parsha, value.triennial.alt);
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
     * @param {Object} triennial 
     */
    static resolveSameAs(parsha, triennial) {
        const years = triennial.years || triennial.variations;
        if (typeof years === 'undefined') {
            throw new Error(`Parashat ${parsha} has no years or variations`);
        }
        // first pass, copy only alyiot definitions from parshiyotObj into lookup table
        const lookup = {};
        for (const [num, aliyot] of Object.entries(years)) {
            if (typeof aliyot === 'object') {
                lookup[num] = aliyot;    
            }
        }
        // second pass to resolve sameas strings (to simplify later lookups)
        for (const [num, aliyot] of Object.entries(years)) {
            if (typeof aliyot === 'string') {
                if (typeof lookup[aliyot] === 'undefined') {
                    throw new Error(`Can't find source for ${parsha} ${num} sameas=${aliyot}`);
                }
                lookup[num] = lookup[aliyot];
            }
        }
        return lookup;
    }
}

export default {
    Triennial
};
