import minimist from 'minimist';
import hebcal, { HDate } from './hebcal';

const args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version'
    }
});
const opt_israel = false;
//console.log('args:', args);


const parshiyot = require('./aliyot.json');
const festivals = require('./holiday-readings.json');

const triennialAliyot = {};
const triennialAliyotAlt = {};
read_aliyot_metadata(parshiyot);

const allInOrder = [];
const combined = [];
const combinedMap = {};
const parashah2id = {};
const prev = {};
const next = {};
getOrderAndPrevNext(parshiyot);

// year I in triennial cycle was 5756
const today = new HDate();
const hebrew_year = today.getFullYear();
const year_num = ((hebrew_year - 5756) % 3) + 1;
console.log(`Current Hebrew year ${hebrew_year} is year ${year_num}.`);

const cycle_start_years = [];
const triennial_readings = [];
const triennial_events = [];
const bereshit_indices = [];
const max_triennial_cycles = 5;
for (let i = 0; i < max_triennial_cycles; i++) {
    const year_offset = (i - 1) * 3;
    const cycle_start_year = hebrew_year - (year_num - 1) + year_offset;
    cycle_start_years[i] = cycle_start_year;
    console.log(`3-cycle started at year ${cycle_start_year}`);
    const [bereshit_idx,pattern,events] = get_tri_events(cycle_start_year);
    triennial_events[i] = events;
    bereshit_indices[i] = bereshit_idx;
    if (!opt_israel) {
        const cycle_option = calc_variation_options(parshiyot,pattern);
        triennial_readings[i] = cycle_readings(triennialAliyot,bereshit_idx,events,cycle_option);
    //	triennial_alt_readings[i] = cycle_readings(\%triennial_aliyot_alt,bereshit_idx,events,cycle_option);
    }
}

function get_tri_events(start) {
    const options = {
        year: start,
        isHebrewYear: true,
        numYears: 3,
        noHolidays: true,
        sedrot: true,
        il: opt_israel
    };
    const events = hebcal.hebcalEvents(options);
    let idx = -1;
    for (let i = 0; i < events.length; i++) {
///        console.log(i, events[i]);
        if (events[i].getDesc() == 'Parashat Bereshit') {
//            console.log(`***** found bereshit ${i}`);
            idx = i;
            break;
        }
    }
    if (idx == -1) {
        throw new Error("can't find Bereshit for Year I");
    }
    // determine triennial year patterns
    const pattern = {};
    for (const ev of events) {
        const subj = ev.getDesc().substring(9); // skip "Parashat "
        if (subj.indexOf('-') != -1) {
            const [p1,p2] = subj.split('-');
            pattern[p1] = pattern[p1] || [];
            pattern[p2] = pattern[p2] || [];
            pattern[p1].push('T');
            pattern[p2].push('T');
        } else {
            pattern[subj] = pattern[subj] || [];
            pattern[subj].push('S');
        }
    }
    return [idx, pattern, events];
}

function calc_variation_options(parshiyot, pattern) {
    const option = {};
    for (const parsha of combined) {
        const [p1,p2] = parsha.split('-');
        let pat = '';
        for (const yr of [0,1,2]) {
            pat += pattern[p1][yr];
        }
        if (pat == 'TTT') {
            option[parsha] = 'all-together';
        } else {
            const cycleOpt = parshiyot[parsha].triennial.patterns[pat];
            if (typeof cycleOpt === 'undefined') {
                throw new Error(`can't find option for ${parsha} (pat == ${pat}`);
            }
            option[parsha] = cycleOpt;
            option[p1] = cycleOpt;
            option[p2] = cycleOpt;
        }
        console.log(`  ${parsha} ${pat} (${option[parsha]})`);
    }
    return option;
}

function cycle_readings(triennialAliyot, bereshit_idx, events, option) {
    const readings = {};
    let yr = 1;
    for (let i = bereshit_idx; i < events.length; i++) {
        const subj = events[i].getDesc();
        if (subj == 'Parashat Bereshit' && i != bereshit_idx) {
            yr++;
            if (yr == 4) {
                break;
            }
        }
        const h = subj.substring(9);
//        console.log(`${h} year ${yr} (idx=${i})`);
        readings[h] = readings[h] || [];
        if (combinedMap[h]) {
            const variation = option[h] + "." + yr;
            const a         = triennialAliyot[h][variation];
            if (!a) {
                throw new Error();
            }
            readings[h][yr] = [ a, events[i], h ];
        } else if (triennialAliyot[h][`Y.${yr}`]) {
            const a = triennialAliyot[h][`Y.${yr}`];
            readings[h][yr] = [ a, events[i], h ];
            if (h.indexOf('-') != -1) {
                const [p1,p2] = h.split('-');
                readings[p1] = readings[p1] || [];
                readings[p2] = readings[p2] || [];
                readings[p1][yr] = [ a, events[i], h ];
                readings[p2][yr] = [ a, events[i], h ];
            }
        } else {
            throw new Error(`can't find aliyot for ${h}, year ${yr}`);
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


function getOrderAndPrevNext(parshiyot) {
    for (const [parsha, value] of Object.entries(parshiyot)) {
        const num = value.num;
        if (value.combined) {
            combined[num - 101] = parsha;
            const [p1,p2] = parsha.split('-');
            combinedMap[p1] = parsha;
            combinedMap[p2] = parsha;
        } else {
            allInOrder[num - 1] = parsha;
            parashah2id[parsha] = num;
        }
    }
    let h2 = undefined;
    for (const h of allInOrder) {
        prev[h] = h2;
        h2 = h;
    }
    h2 = undefined;
    for (const h of allInOrder.slice().reverse()) {
        next[h] = h2;
        h2 = h;
    }
}
