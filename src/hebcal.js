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
import { t, gettext } from 'ttag';
import common from './common';
import { HDate, hebrew2abs } from './hdate';
import holidays, { Event, flags } from './holidays';
import Sedra from './sedra';
import greg from './greg';
import dafyomi from './dafyomi';

function sunsetTime(hd, location, timeFormat, offset) {
    const sunset = location.sunset(hd);
    const dt = new Date(sunset.getTime() + (offset * 60 * 1000));
    const time = timeFormat.format(dt);
    return [dt, time];
}

function candleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset) {
    let name = "Candle lighting";
    let offset = candlesOffset;
    let mask = flags.LIGHT_CANDLES;
    if (dow != 5 && typeof e !== 'undefined') {
        if (e.isLightCandlesTzeis() || e.isChanukahCandles()) {
            offset = havdalahOffset;
        } else if (e.isYomTovEnds()) {
            name = "Havdalah";
            offset = havdalahOffset;
        }
        mask = e.mask;
    } else if (dow == 6) {
        name = "Havdalah";
        offset = havdalahOffset;
    }
    if (name === "Havdalah") {
        name = `Havdalah (${offset} min)`;
    }
    const [eventTime, timeStr] = sunsetTime(hd, location, timeFormat, offset);
    let e2 = new Event(hd, `${name}: ${timeStr}`, mask);
    e2.eventTime = eventTime;
    return e2;
}

/**
 * Returns an array of candle-lighting times and Havdalah times
 * for both Shabbat and holidays (based on Israel or Diaspora schedule)
 * @param {Event[]} holidaysYear result of holidays.year()
 * @param {Object} location including tzid
 * @param {number} startAbs start absolute day number
 * @param {number} endAbs end absolute day number
 */
export function candleLightingEvents(location, startAbs, endAbs) {
    let events = [];
    const timeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: location.tzid,
        hour: 'numeric',
        minute: 'numeric'
    });
    let candleLightingMinutes = -18;
    if (location.il && location.name === 'Jerusalem') {
        candleLightingMinutes = -40;
    }
    let havdalahMinutes = 50;
    const holidaysYear = holidays.year(new HDate(startAbs).getFullYear());
    const holidaysYear2 = holidays.year(new HDate(endAbs).getFullYear());
    for (let abs = startAbs; abs <= endAbs; abs++) {
        const hd = new HDate(abs);
        let ev = holidaysYear[hd];
        if (typeof ev === 'undefined') {
            ev = holidaysYear2[hd]; // try 2nd year
        }
        const dow = abs % 7;
        let candles = false;
        if (typeof ev !== 'undefined') {
            for (const e of ev) {
                if ((location.il && e.isIsraelOnly()) || (!location.il && e.isDiasporaOnly())) {
                    if (e.isLightCandles() || e.isLightCandlesTzeis() || e.isChanukahCandles() || e.isYomTovEnds()) {
                        const e2 = candleEvent(e, hd, dow, location, timeFormat, candleLightingMinutes, havdalahMinutes);
                        events.push(e2);
                        candles = true;
                    }
                }
            }
        }
        if (!candles && (dow == 5 || dow == 6)) { // friday or saturday
            const e2 = candleEvent(undefined, hd, dow, location, timeFormat, candleLightingMinutes, havdalahMinutes);
            events.push(e2);
        }
    }
    return events;
}

function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"],
        v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Options to configure which events are returned
 * @typedef {Object} HebcalOptions
 * @property {Location} location - location.il used for Israel vs. Diaspora holidays, latitude/longitude/tzid used for candle-lighting
 * @property {number} year - Gregorian or Hebrew year
 * @property {boolean} isHebrewYear - to interpret year as Hebrew year
 * @property {number} month - Gregorian or Hebrew month (to filter results to a single month)
 * @property {boolean} candlelighting - calculate candle-lighting and havdalah times
 * @property {number} candleLightingMins - minutes before sundown to light candles (default 18)
 * @property {number} havdalahMins - minutes after sundown for Havdalah (default 50)
 * @property {boolean} sedrot - calculate parashah hashavua on Saturdays
 * @property {boolean} noMinorFast - suppress minor fasts
 * @property {boolean} noModern - suppress modern holidays
 * @property {boolean} noRoshChodesh - suppress Rosh Chodesh & Shabbat Mevarchim
 * @property {boolean} noSpecialShabbat - suppress Special Shabbat
 * @property {boolean} noHolidays - suppress regular holidays
 * @property {boolean} dafyomi - include Daf Yomi
 * @property {boolean} omer - include Days of the Omer
 */

/**
 * Generates a list of holidays
 * @param {HebcalOptions} options
 */
export function hebcalEvents(options) {
    const location = options.location || { tzid: "UTC" };
    const timeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: location.tzid,
        hour: 'numeric',
        minute: 'numeric'
    });
    const theYear = options.year ? common.dayYearNum(options.year) : new Date().getFullYear();
    const isHebrewYear = Boolean(options.isHebrewYear);
    let theMonth = NaN;
    if (options.month) {
        if (isHebrewYear) {
            theMonth = common.monthNum(options.month);
        } else {
            theMonth = +options.month - 1; // switch from 1-based to 0-based greg months
        }
    }
    const startDate = isHebrewYear ?
        new HDate(1, theMonth || common.months.TISHREI, theYear) : new HDate(greg.greg2abs(new Date(theYear, theMonth || 0, 1)));
    const startAbs = startDate.abs();
    const endAbs = isHebrewYear ? (
        options.month ? startDate.abs() + startDate.daysInMonth() : new HDate(1, common.months.TISHREI, theYear + 1).abs() - 1
    ) : (
        // Gregorian
        options.month ? startDate.abs() + greg.daysInMonth(theMonth + 1, theYear) : greg.greg2abs(new Date(theYear + 1, 0, 1)) - 1
        );
    const endDate = new HDate(endAbs);
    console.debug(`year=${theYear}, month=${theMonth}, isHebrewYear=${isHebrewYear}, startAbs=${startAbs}, endAbs=${endAbs}`);

    const allHolidays = holidays.year(startDate.getFullYear());
    const allHolidays2 = isHebrewYear ? [] : holidays.year(startDate.getFullYear() + 1); // hack
    let holidays0 = [];
    for (let abs = startAbs; abs <= endAbs; abs++) {
        const hd = new HDate(abs);
        let ev = allHolidays[hd];
        if (typeof ev === 'undefined') {
            ev = allHolidays2[hd]; // try 2nd year
        }
        if (typeof ev !== 'undefined') {
            for (const e of ev) {
                if ((location.il && e.isIsraelOnly()) || (!location.il && e.isDiasporaOnly())) {
                    holidays0.push(e);
                }
            }
        }
    }

    let events = [];
    if (!options.noHolidays) {
        if (options.noModern) {
            holidays0 = holidays0.filter(e => !(e.getFlags() & flags.MODERN_HOLIDAY));
        }
        if (options.noMinorFast) {
            holidays0 = holidays0.filter(e => !(e.getFlags() & flags.MINOR_FAST));
        }
        if (options.noRoshChodesh) {
            holidays0 = holidays0.filter(e => !(e.getFlags() & flags.ROSH_CHODESH));
        }
        if (options.noSpecialShabbat) {
            holidays0 = holidays0.filter(e => !(e.getFlags() & flags.SPECIAL_SHABBAT));
            holidays0 = holidays0.filter(e => !(e.getFlags() & flags.SHABBAT_MEVARCHIM));
        }
        events = events.concat(holidays0);
    }
    if (options.candlelighting) {
        const candleEvents = candleLightingEvents(location, startAbs, endAbs);
        events = events.concat(candleEvents);
    }
    if (options.sedrot) {
        const sedra = new Sedra(startDate.getFullYear());
        for (let abs = startAbs; abs <= endAbs; abs++) {
            const dow = abs % 7;
            if (dow == 6 && sedra.isParsha(abs)) { // Saturday
                const hd = new HDate(abs);
                const parshaStr = sedra.getString(abs);
                events.push(new Event(hd, parshaStr, flags.PARSHA_HASHAVUA));
            }
        }
    }
    if (options.dafyomi) {
        for (let abs = startAbs; abs <= endAbs; abs++) {
            const dy = dafyomi.dafyomi(greg.abs2greg(abs));
            const desc = t`Daf Yomi` + ": " + dafyomi.dafname(dy);
            events.push(new Event(new HDate(abs), desc, flags.DAF_YOMI));
        }
    }
    if (options.omer) {
        const hyear = startDate.getFullYear();
        const beginOmer = hebrew2abs({ yy: hyear, mm: common.months.NISAN, dd: 16 });
        const endOmer = hebrew2abs({ yy: hyear, mm: common.months.SIVAN, dd: 5 });
        for (let abs = startAbs; abs <= endAbs; abs++) {
            if (abs >= beginOmer && abs <= endOmer) {
                const omer = abs - beginOmer + 1;
                const nth = getOrdinal(omer);
                const desc = `${nth} day of the Omer`;
                events.push(new Event(new HDate(abs), desc, flags.OMER_COUNT));
            }
        }
    }
    return events.sort((a, b) => a.getDate().abs() - b.getDate().abs());
}

export default {
    candleLightingEvents,
    hebcalEvents
};
