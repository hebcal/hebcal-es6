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
import { t, gettext, addLocale, useLocale } from 'ttag';
import common from './common';
import { HDate, hebrew2abs, getMolad } from './hdate';
import holidays, { Event, flags } from './holidays';
import Sedra from './sedra';
import greg from './greg';
import dafyomi from './dafyomi';
import Location from './location';

const FRI = common.days.FRI;
const SAT = common.days.SAT;
const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(timeFormat, dt) {
    const time = timeFormat.format(dt);
    // Possibly convert from "5:45 PM" to "5:45"
    const space = time.indexOf(' ');
    if (space != -1) {
        return time.substring(0, space);
    }
    return time;
}

function sunsetTime(hd, location, timeFormat, offset) {
    const sunset = location.sunset(hd);
    const dt = new Date(sunset.getTime() + (offset * 60 * 1000));
    const time = formatTime(timeFormat, dt);
    return [dt, time];
}

function tzeitTime(hd, location, timeFormat) {
    const dt = location.tzeit(hd);
    const time = formatTime(timeFormat, dt);
    return [dt, time];
}

function candleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset) {
    let name = "Candle lighting";
    let offset = candlesOffset;
    let mask = flags.LIGHT_CANDLES;
    if (typeof e !== 'undefined') {
        mask = e.getFlags();
        if (dow != FRI) {
            if (mask & (flags.LIGHT_CANDLES_TZEIS | flags.CHANUKAH_CANDLES)) {
                offset = havdalahOffset;
            } else if (mask & flags.YOM_TOV_ENDS) {
                name = "Havdalah";
                offset = havdalahOffset;
            }
        }
    } else if (dow == SAT) {
        name = "Havdalah";
        offset = havdalahOffset;
    }
    if (name === "Havdalah" && havdalahOffset) {
        name = `Havdalah (${offset} min)`;
    }
    const [eventTime, timeStr] = offset ?
        sunsetTime(hd, location, timeFormat, offset) :
        tzeitTime(hd, location, timeFormat);
    const e2 = new Event(hd, gettext(name) + ": " + timeStr, mask);
    e2.eventTime = eventTime;
    if (typeof e !== 'undefined') {
        e2.linkedEvent = e;
    }
    return e2;
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getCandleLightingMinutes(options) {
    if (!options.candlelighting) {
        return undefined;
    }
    const location = options.location || {};
    let min = 18;
    if (location.il && typeof location.name !== 'undefined' && location.name === 'Jerusalem') {
        min = 40;
    }
    if (typeof location.candleLightingMins === 'number') {
        min = Math.abs(candleLightingMins);
    }
    return -1 * min;
}

/**
 * Options to configure which events are returned
 * @typedef {Object} HebcalOptions
 * @property {Location} location - latitude/longitude/tzid used for candle-lighting
 * @property {number} year - Gregorian or Hebrew year
 * @property {boolean} isHebrewYear - to interpret year as Hebrew year
 * @property {number} month - Gregorian or Hebrew month (to filter results to a single month)
 * @property {number} numYears - generate calendar for multiple years (default 1)
 * @property {boolean} candlelighting - calculate candle-lighting and havdalah times
 * @property {number} candleLightingMins - minutes before sundown to light candles (default 18)
 * @property {number} havdalahMins - minutes after sundown for Havdalah (typical values are 42, 50, or 72)
 * @property {boolean} havdalahTzeit - calculate Havdalah according to Tzeit Hakochavim - Nightfall (the point when 3 small stars are observable in the night time sky with the naked eye). Defaults to `true` unless havdalahMins is specified
 * @property {boolean} sedrot - calculate parashah hashavua on Saturdays
 * @property {boolean} il - Israeli holiday and sedra schedule
 * @property {boolean} noMinorFast - suppress minor fasts
 * @property {boolean} noModern - suppress modern holidays
 * @property {boolean} noRoshChodesh - suppress Rosh Chodesh & Shabbat Mevarchim
 * @property {boolean} noSpecialShabbat - suppress Special Shabbat
 * @property {boolean} noHolidays - suppress regular holidays
 * @property {boolean} dafyomi - include Daf Yomi
 * @property {boolean} omer - include Days of the Omer
 * @property {boolean} molad - include event announcing the molad
 * @property {boolean} ashkenazi - use Ashkenazi transliterations for event titles (default Sephardi transliterations)
 * @property {string} locale - translate event titles according to a locale (one of `fi`, `fr`, `he`, `hu`, `pl`, `ru`, `ashkenazi`, `ashkenazi_litvish`, `ashkenazi_poylish`, `ashkenazi_standard`)
 * @property {boolean} hour12 - use 12-hour time (1-12) instead of default 24-hour time (0-23)
 */

 /* Parse options object to determine start & end days */
function getStartAndEnd(options) {
    const theYear = options.year ? common.dayYearNum(options.year) : new Date().getFullYear();
    const isHebrewYear = Boolean(options.isHebrewYear);
    let theMonth = NaN;
    if (options.month) {
        if (isHebrewYear) {
            theMonth = common.monthNum(options.month);
        } else {
            theMonth = options.month;
        }
    }
    if (isHebrewYear) {
        const startDate = new HDate(1, theMonth || common.months.TISHREI, theYear);
        const startAbs = startDate.abs();
        const numYears = Number(options.numYears) || 1;
        const endAbs = options.month ? startAbs + startDate.daysInMonth() : new HDate(1, common.months.TISHREI, theYear + numYears).abs() - 1;
        return [startDate, startAbs, new HDate(endAbs), endAbs];
    } else {
        const gregMonth = options.month ? theMonth - 1 : 0;
        const startGreg = new Date(theYear, gregMonth, 1);
        const startAbs = greg.greg2abs(startGreg);
        const numYears = Number(options.numYears) || 1;
        const endAbs = options.month ? startAbs + greg.daysInGregMonth(theMonth, theYear) - 1 : greg.greg2abs(new Date(theYear + numYears, 0, 1)) - 1;
        const startDate = new HDate(startAbs);
        return [startDate, startAbs, new HDate(endAbs), endAbs];
    }
}

function getOmerStartAndEnd(options, hyear) {
    if (options.omer) {
        return [
            hebrew2abs({ yy: hyear, mm: common.months.NISAN, dd: 16 }),
            hebrew2abs({ yy: hyear, mm: common.months.SIVAN, dd: 5 })
        ];
    } else {
        return [-1, -1];
    }
}

function getMaskFromOptions(options) {
    const il = options.il || (options.location && options.location.il) || false;
    let mask = 0;

    // default options
    if (!options.noHolidays) {
        mask |= flags.ROSH_CHODESH |
                flags.YOM_TOV_ENDS |
                flags.MINOR_FAST |
                flags.SPECIAL_SHABBAT |
                flags.SHABBAT_MEVARCHIM |
                flags.MODERN_HOLIDAY |
                flags.MAJOR_FAST |
                flags.LIGHT_CANDLES |
                flags.LIGHT_CANDLES_TZEIS |
                flags.CHANUKAH_CANDLES;
    }

    // suppression of defaults
    if (options.noRoshChodesh) {
        mask &= ~flags.ROSH_CHODESH;
    }

    if (options.noModern) {
        mask &= ~flags.MODERN_HOLIDAY;
    }

    if (options.noMinorFast) {
        mask &= ~flags.MINOR_FAST;
    }

    if (options.noSpecialShabbat) {
        mask &= ~flags.SPECIAL_SHABBAT;
        mask &= ~flags.SHABBAT_MEVARCHIM;
    }

    if (il) {
        mask |= flags.IL_ONLY;
    } else {
        mask |= flags.CHUL_ONLY;
    }

    // non-default options
    if (options.sedrot) {
        mask |= flags.PARSHA_HASHAVUA;
    }

    if (options.dafyomi) {
        mask |= flags.DAF_YOMI;
    }

    if (options.omer) {
        mask |= flags.OMER_COUNT;
    }

    /*
    // debug
    for (const x in flags) {
        if (mask & flags[x]) {
            console.debug(x);
        }
    }
    */

    return mask;
}

/**
 * Generates a list of holidays
 * @param {HebcalOptions} options
 */
export function hebcalEvents(options) {
    if (options.candlelighting && (typeof options.location === 'undefined' || !options.location instanceof Location)) {
        throw new TypeError("Candle-lighting requires location");
    }
    const location = options.location || new Location(0, 0, false);
    const il = options.il || location.il || false;
    const timeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: location.tzid,
        hour12: Boolean(options.hour12),
        hour: 'numeric',
        minute: 'numeric'
    });
    const [startDate, startAbs, endDate, endAbs] = getStartAndEnd(options);
//    console.log(`start=${startDate} (abs=${startAbs},greg=${startDate.greg()}) end=${endDate} (abs=${endAbs},greg=${endDate.greg()})`);
    let currentYear = startDate.getFullYear();
    const candleLightingMinutes = getCandleLightingMinutes(options);
    const havdalahMinutes = options.havdalahMins;
    const mask = getMaskFromOptions(options);
    const MASK_LIGHT_CANDLES =
        flags.LIGHT_CANDLES |
        flags.LIGHT_CANDLES_TZEIS |
        flags.CHANUKAH_CANDLES |
        flags.YOM_TOV_ENDS;
    let sedra = options.sedrot ? new Sedra(currentYear, il) : undefined;
    let [beginOmer, endOmer] = getOmerStartAndEnd(options, currentYear);
    if (options.ashkenazi || options.locale) {
        const locale = options.ashkenazi ? "ashkenazi" : options.locale;
        const translationObj = require(`./${locale}.po.json`);
        addLocale(locale, translationObj); // adding locale to ttag
        useLocale(locale); // make locale active
    }
    let events = [];
    for (let abs = startAbs; abs <= endAbs; abs++) {
        const hd = new HDate(abs);
        const dow = abs % 7;
        let candlesToday = false;
        const ev = holidays.getHolidaysOnDate(hd);
        if (typeof ev !== 'undefined') {
            for (const e of ev) {
                const eFlags = e.getFlags();
//                console.debug(e);
                if ((!eFlags || (eFlags & mask)) &&
                    ((il && e.observedInIsrael()) || (!il && e.observedInDiaspora()))) {
                    if (!options.noHolidays) {
                        events.push(e);
                    }
                    if (options.candlelighting && eFlags & MASK_LIGHT_CANDLES) {
                        const e2 = candleEvent(e, hd, dow, location, timeFormat, candleLightingMinutes, havdalahMinutes);
                        events.push(e2);
                        candlesToday = true;
                    }
                }
            }
        }
        const hyear = hd.getFullYear();
        if (hyear != currentYear) {
            currentYear = hyear;
            if (options.sedrot) {
                sedra = new Sedra(currentYear, il);
            }
            if (options.omer) {
                [beginOmer, endOmer] = getOmerStartAndEnd(options, currentYear);
            }
        }
        if (options.sedrot && dow == SAT) {
            if (sedra.isParsha(abs)) {
                const parshaStr = sedra.getString(abs);
                events.push(new Event(hd, parshaStr, flags.PARSHA_HASHAVUA));
            }
        }
        if (options.candlelighting && !candlesToday && (dow == FRI || dow == SAT)) {
            const e2 = candleEvent(undefined, hd, dow, location, timeFormat, candleLightingMinutes, havdalahMinutes);
            events.push(e2);
        }
        if (options.dafyomi) {
            const dy = dafyomi.dafyomi(greg.abs2greg(abs));
            const desc = t`Daf Yomi` + ": " + dafyomi.dafname(dy);
            events.push(new Event(new HDate(abs), desc, flags.DAF_YOMI));
        }
        if (options.omer && abs >= beginOmer && abs <= endOmer) {
            const omer = abs - beginOmer + 1;
            const nth = getOrdinal(omer);
            const desc = `${nth} day of the Omer`;
            events.push(new Event(new HDate(abs), desc, flags.OMER_COUNT));
        }
        const hmonth = hd.getMonth();
        if (options.molad && dow == SAT && hmonth != common.months.ELUL && hd.getDate() >= 23 && hd.getDate() <= 29) {
            const monthNext = (hmonth == common.monthsInHebYear(hyear) ? 1 : hmonth + 1);
            const moladNext = getMolad(hyear, monthNext);
            const mevarchim = new HDate(29, hmonth, hyear).onOrBefore(SAT);
            const nextMonthName = common.monthNames[Number(common.hebLeapYear(hyear))][monthNext];
            const dayName = shortDayNames[moladNext.dow];
            const desc = `Molad ${nextMonthName}: ${dayName}, ${moladNext.minutes} minutes and ${moladNext.chalakim} chalakim after ${moladNext.hour}:00`;
            events.push(new Event(mevarchim, desc, flags.MOLAD));
        }
    }

//    return events.sort((a, b) => a.getDate().abs() - b.getDate().abs());
    return events;
}

export { HDate } from './hdate';
export { Event, flags } from './holidays';
export { getBirthdayOrAnniversary, getYahrzeit } from './anniversary';

export default {
    hebcalEvents
};
