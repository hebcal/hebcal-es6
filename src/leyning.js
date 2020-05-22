import { Event, flags } from './holidays';
import common from './common';

const festivals = require('./holiday-readings.json');

const diasporaCholHaMoedMap = {
    "Pesach III (CH''M)": "Pesach Chol ha-Moed Day 1",
    "Pesach IV (CH''M)": "Pesach Chol ha-Moed Day 2",
    //  "Pesach V (CH''M)": "Pesach Chol ha-Moed Day 3",
    //  "Pesach VI (CH''M)": "Pesach Chol ha-Moed Day 4",
    "Sukkot III (CH''M)": "Sukkot Chol ha-Moed Day 1",
    "Sukkot IV (CH''M)": "Sukkot Chol ha-Moed Day 2",
    "Sukkot V (CH''M)": "Sukkot Chol ha-Moed Day 3",
    "Sukkot VI (CH''M)": "Sukkot Chol ha-Moed Day 4",
    "Sukkot VII (Hoshana Raba)": "Sukkot Chol ha-Moed Day 5 (Hoshana Raba)",
};

/**
 * Based on the event date, type and title, finds the relevant leyning key
 * @param {Event} e event
 * @returns {string} key to look up in holiday-reading.json
 */
function getLeyningKeyForEvent(e) {
    const hd = e.getDate();
    const day = hd.getDate();
    const desc = e.getDesc();
    const attrs = e.getAttrs();
    const dow = hd.abs() % 7;
    const isShabbat = (dow == 6);
    const isRoshChodesh = (day == 1 || day == 30);

    if (day == 1 && hd.getMonth() == common.months.TISHREI) {
        return isShabbat ? 'Rosh Hashana I (on Shabbat)' : 'Rosh Hashana I';
    } else if (attrs && attrs.cholHaMoed) {
        const holiday = desc.substring(0, desc.indexOf(' '));
        if (isShabbat) {
            return holiday + ' Shabbat Chol ha-Moed';
        }
        /**
         * @todo: if Shabbat falls on the third day of Chol ha-Moed Pesach,
         * the readings for the third, fourth, and fifth days are moved ahead
         */
        const key = diasporaCholHaMoedMap[desc];
        if (key) {
            return key;
        }
    } else if (attrs && attrs.chanukahDay) {
        if (isShabbat) {
            if (isRoshChodesh) {
                return 'Shabbat Rosh Chodesh Chanukah';
            } else if (attrs.chanukahDay == 8) {
                return 'Shabbat Chanukah II';
            } else {
                return 'Shabbat Chanukah';
            }
        } else if (isRoshChodesh && attrs.chanukahDay == 7) {
            return `Chanukah (Day 7 on Rosh Chodesh)`;
        } else {
            return `Chanukah (Day ${attrs.chanukahDay})`;
        }
    } else if (desc == 'Sukkot VII (Hoshana Raba)') {
        return 'Sukkot Chol ha-Moed Day 5 (Hoshana Raba)';
    } else if (isRoshChodesh && (desc == 'Shabbat HaChodesh' || desc == 'Shabbat Shekalim')) {
        return desc + ' (on Rosh Chodesh)';
    } else if (isShabbat) {
        return desc + ' (on Shabbat)';
    }
}

export default {
    getLeyningKeyForEvent
};
