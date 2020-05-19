import minimist from 'minimist';
import { HDate } from './hdate';
import { Sedra, parshiot } from './sedra';

const args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version'
    }
});
const opt_israel = false;
//console.log('args:', args);

const parshiyotObj = require('./aliyot.json');
const festivals = require('./holiday-readings.json');

const triennialAliyot = {};
const triennialAliyotAlt = {};
read_aliyot_metadata(parshiyotObj);

const allInOrder = parshiot.slice();
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

// year I in triennial cycle was 5756
const today = new HDate();
const hebrew_year = today.getFullYear();
const year_num = ((hebrew_year - 5756) % 3) + 1;
console.log(`Current Hebrew year ${hebrew_year} is year ${year_num}.`);

const cycle_start_years = [];
const triennial_readings = [];
const max_triennial_cycles = 5;
for (let i = 0; i < max_triennial_cycles; i++) {
    const year_offset = (i - 1) * 3;
    const cycle_start_year = hebrew_year - (year_num - 1) + year_offset;
    cycle_start_years[i] = cycle_start_year;
    console.log(`3-cycle started at year ${cycle_start_year}`);
    if (!opt_israel) {
        const sedras = [];
        for (const yr of [0,1,2]) {
            sedras.push(new Sedra(cycle_start_year + yr, false));
        }
        let cycle_option = calcVariationOptions2(sedras);    
        triennial_readings[i] = cycleReadings2(triennialAliyot, sedras, cycle_option);
//        console.log(foo);

        //	triennial_alt_readings[i] = cycle_readings(\%triennial_aliyot_alt,bereshit_idx,events,cycle_option);
    }
}

function getDoubledName(id) {
    const p1 = parshiot[id];
    const p2 = parshiot[id + 1];
    const name = p1 + '-' + p2;
    return name;
}

function calcVariationOptions2(sedras) {
    const option = {};
    for (const id of doubled) {
        // First, determine if a doubled parsha is read [T]ogether or [S]eparately
        // in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.
        const p1 = parshiot[id];
        const p2 = parshiot[id + 1];
        const name = p1 + '-' + p2;
        let pattern = '';
        for (const yr of [0,1,2]) {
            const sedraArray = sedras[yr].getSedraArray();
            const pat = sedraArray.indexOf(-1 * id) == -1 ? 'S' : 'T';
            pattern += pat;
        }

        // Next, look up the pattern in JSON to determine readings for each year
        if (pattern == 'TTT') {
            option[name] = 'all-together';
        } else {
            const variation = parshiyotObj[name].triennial.patterns[pattern];
            if (typeof variation === 'undefined') {
                throw new Error(`can't find option for ${name} (pat == ${pattern}`);
            }
            option[name] = option[p1] = option[p2] = variation;
        }
        console.log(`  ${name} ${pattern} (${option[name]})`);
    }

    return option;
}

function cycleReadings2(triennialAliyot, sedras, option) {
    const readings = {};
    for (const parsha of parshiot) {
        readings[parsha] = [];
    }
    for (const id of doubled) {
        const parsha = getDoubledName(id);
        readings[parsha] = [];
    }
    for (const yr of [1,2,3]) {
        const sedraArray = sedras[yr-1].getSedraArray();
        const bereshit_idx = sedraArray.indexOf(0); // parshiot[0]='Bereshit'
        for (let i = bereshit_idx; i < sedraArray.length; i++) {
            const id = sedraArray[i];
            if (typeof id === 'number') {
                const h = (id < 0) ? getDoubledName(-id) : parshiot[id];
                if (isSometimesDoubled[id]) {
                    const variation = option[h] + "." + yr;
                    const a         = triennialAliyot[h][variation];
                    if (!a) {
                        throw new Error(`can't find ${h} year ${yr} (variation ${variation})`);
                    }
                    readings[h][yr] = a;
                } else if (triennialAliyot[h][`Y.${yr}`]) {
                    const a = triennialAliyot[h][`Y.${yr}`];
                    readings[h][yr] = a;
                } else {
                    throw new Error(`can't find aliyot for ${h}, year ${yr}`);
                }
            }
        }
    }

    return readings;
}


function read_aliyot_metadata(parshiyot) {
    // build a lookup table so we don't have to follow num/variation/sameas
    for (const [parsha, value] of Object.entries(parshiyot)) {
//        console.log(parsha);
        if (value.triennial) { // Vezot Haberakhah has no triennial
            readAliyotMetadataInner(parsha, value.triennial, triennialAliyot);
            if (value.triennial.alt) {
                readAliyotMetadataInner(parsha, value.triennial.alt, triennialAliyotAlt);
            }
        }
    }
}

function readAliyotMetadataInner(parsha, triennial, lookup) {
    const years = triennial.years || triennial.variations;
    if (typeof years === 'undefined') {
        throw new Error(`Parashat ${parsha} has no years or variations`);
    }
    lookup[parsha] = {};
    for (const [num, aliyot] of Object.entries(years)) {
        if (typeof aliyot === 'object') {
//            console.log(`${parsha} ${num}`);
            lookup[parsha][num] = aliyot;    
        }
    }

    // second pass for sameas
    for (const [num, aliyot] of Object.entries(years)) {
        if (typeof aliyot === 'string') {
//            console.log(`${parsha} ${num} sameas ${aliyot}`);
            if (typeof lookup[parsha][aliyot] === 'undefined') {
                throw new Error(`Bad ${parsha} ${num} sameas=${aliyot}`);
            }
            lookup[parsha][num] = lookup[parsha][aliyot];
        }
    }
}
