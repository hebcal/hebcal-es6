import { Event, flags, getHolidaysOnDate } from './holidays';
import common from './common';

const festivals = require('./holiday-readings.json');
const parshiyotObj = require('./aliyot.json');

/**
 * Based on the event date, type and title, finds the relevant leyning key
 * @param {Event} e event
 * @returns {string} key to look up in holiday-reading.json
 */
function getLeyningKeyForEvent(e) {
    const hd = e.getDate();
    const day = hd.getDate();
    let desc = e.getDesc();
    const attrs = e.getAttrs();
    const dow = hd.abs() % 7;
    const isShabbat = (dow == 6);
    const isRoshChodesh = (day == 1 || day == 30);

    if (day == 1 && hd.getMonth() == common.months.TISHREI) {
        return isShabbat ? 'Rosh Hashana I (on Shabbat)' : 'Rosh Hashana I';
    } else if (attrs && attrs.cholHaMoedDay) {
        // Sukkot or Pesach
        const holiday = desc.substring(0, desc.indexOf(' '));
        if (isShabbat) {
            return holiday + ' Shabbat Chol ha-Moed';
        } else if (desc == 'Sukkot VII (Hoshana Raba)') {
            return 'Sukkot Final Day (Hoshana Raba)';
        }
        // If Shabbat falls on the third day of Chol ha-Moed Pesach,
        // the readings for the third, fourth, and fifth days are moved ahead
        let cholHaMoedDay = attrs.cholHaMoedDay;
        if (holiday == 'Pesach' && cholHaMoedDay >= 3) {
            if (dow == 0 && cholHaMoedDay == 4) {
                cholHaMoedDay = 3;
            } else if (dow == 1 && cholHaMoedDay == 5) {
                cholHaMoedDay = 4;
            }
        }
        return `${holiday} Chol ha-Moed Day ${cholHaMoedDay}`;
    } else if (attrs && attrs.chanukahDay) {
        if (isShabbat && isRoshChodesh) {
            return 'Shabbat Rosh Chodesh Chanukah';
        } else if (isRoshChodesh && attrs.chanukahDay == 7) {
            return `Chanukah (Day 7 on Rosh Chodesh)`;
        } else {
            return `Chanukah (Day ${attrs.chanukahDay})`;
        }
    }

    if (isRoshChodesh && (desc == 'Shabbat HaChodesh' || desc == 'Shabbat Shekalim')) {
        return desc + ' (on Rosh Chodesh)';
    }

    if (isShabbat && !desc.startsWith("Shabbat")) {
        const desc2 = desc + ' (on Shabbat)';
        if (festivals[desc2]) {
            return desc2;
        }
    }

    if (festivals[desc]) {
        return desc;
    }

    if (isShabbat && isRoshChodesh) {
        return 'Shabbat Rosh Chodesh';
    } else if (isShabbat && (hd.next().getDate() == 30 || hd.next().getDate() == 1)) {
        return 'Shabbat Machar Chodesh';
    }

    return undefined;
}

/**
 * Looks up leyning for a given holiday name. Name should be an
 * (untranslated) string used in holiday-readons.json. Returns some
 * of full kriyah aliyot, special Maftir, special Haftarah
 * @param {Event} e the Hebcal event associated with this leyning
 * @param {string} key name of holiday (like "Chanukah (Day 6) or "Sukkot Chol ha-Moed Day 4")
 * @returns {Object} map of aliyot
 */
function getLeyningForHoliday(e, key) {
    const holiday = key.substring(0, desc.indexOf(' '));
    let leyning = festivals[key];
    return leyning;
}

/**
 * Formats parsha as a string
 * @param {string[]} parsha 
 * @returns {string}
 */
function parshaToString(parsha) {
    let s = parsha[0];
    if (parsha.length == 2) {
        s += "-" + parsha[1];
    }
    return s;
}

/**
 * on doubled parshiot, read only the second Haftarah
 * except for Nitzavim-Vayelech
 * @param {string[]} parsha 
 * @returns {string}
 */
function getHaftaraKey(parsha) {
    if (parsha.length == 1 || parsha[0] == 'Nitzavim') {
        return parsha[0];
    } else {
        return parsha[1];
    }
}

function aliyotCombine67(aliyot) {
    const a6 = aliyot['6'];
    const a7 = aliyot['7'];
    const result = Object.assign({}, aliyot);
    delete result['7'];
    result['6'] = {
        book: a6.book,
        begin: a6.begin,
        end: a7.end
    };
    if (a6.numverses && a7.numverses) {
        result['6'].numverses = a6.numverses + a7.numverses;
    }
    return result;
}

function mergeAliyotWithSpecial(aliyot, special) {
    let result;
    if (special['7']) {
        result = aliyotCombine67(aliyot);
    } else {
        result = Object.assign({}, aliyot);
    }
    // copies 7, 8, M to the result
    return Object.assign(result, special);
}

/**
 * @param {Event} e
 * @param {string} key
 * @returns {string}
 */
function getChanukahShabbatKey(e, key) {
    if (key == 'Shabbat Rosh Chodesh Chanukah') {
        return undefined;
    }
    const attrs = e.getAttrs();
    if (attrs && attrs.chanukahDay) {
        return (attrs.chanukahDay == 8) ? 'Shabbat Chanukah II' : 'Shabbat Chanukah';
    }
    return undefined;
}

/**
 * Looks up leyning for a regular Shabbat parsha.
 * @param {Event} e the Hebcal event associated with this leyning
 * @returns {Object} map of aliyot
 */
function getLeyningForParshaHaShavua(e) {
    if (e.getFlags() != flags.PARSHA_HASHAVUA) {
        throw new TypeError(`Bad event argument ${e.getDesc()}`);
    }
    // first, collect the default aliyot and haftara
    const parsha = e.getAttrs().parsha;
    const name = parshaToString(parsha); // untranslated
    const raw = parshiyotObj[name];
    let haftara = parshiyotObj[getHaftaraKey(parsha)].haftara;
    let fullkriyah = {};
    for (const [num, src] of Object.entries(raw.fullkriyah)) {
        const reading = { book: raw.book, begin: src.b, end: src.e };
        if (src.v) {
            reading.numverses = src.v;
        }
        fullkriyah[num] = reading;
    }
    const reason = {};
    const hd = e.getDate();
    if (name == 'Pinchas') {
        const month = hd.getMonth();
        if (month > common.months.TAMUZ || (month == common.months.TAMUZ && hd.getDate() > 17)) {
            haftara = "Jeremiah 1:1 - 2:3";
            reason.haftara = "Pinchas occurring after 17 Tammuz";
        }
    }
    // Now, check for special maftir or haftara on same date
    const events = getHolidaysOnDate(hd);
    if (events) {
        for (const ev of events) {
            if ((ev.getFlags() & flags.ROSH_CHODESH) && events.length > 1) {
                continue;
            }
            const key = getLeyningKeyForEvent(ev);
//            console.log(hd.greg().toLocaleDateString(), name, ev.getDesc(), key);
            const special = festivals[key];
            if (special) {
                const shabbatChanukah = getChanukahShabbatKey(ev, key);
                if (shabbatChanukah) {
                    haftara = festivals[shabbatChanukah].haftara;
                    reason.haftara = shabbatChanukah;
                    // Aliyot 1-3 from regular daily reading becomes Maftir
                    fullkriyah['M'] = Object.assign({}, special.fullkriyah['1']);
                    fullkriyah['M'].e = special.fullkriyah['3'].e;
                    reason.M = key;
                } else {
                    if (special.haftara && !reason.haftara) {
                        haftara = special.haftara;
                        reason.haftara = key;
                    }
                    if (special.fullkriyah) {
                        fullkriyah = mergeAliyotWithSpecial(fullkriyah, special.fullkriyah);
                        Object.keys(special.fullkriyah).map(k => reason[k] = key);
                    }
                }
            }
        }
    }
    const result = {
        summary: `${raw.book} ${raw.verses}`,
        haftara: haftara,
        fullkriyah: fullkriyah
    };
    if (Object.keys(reason).length) {
        result.reason = reason;
    }
    return result;
}

export default {
    getLeyningForHoliday,
    getLeyningForParshaHaShavua,
    getLeyningKeyForEvent
};
