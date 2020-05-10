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
import common from './common';
import { HDate, hebrew2abs } from './hdate';
import { Event, flags } from './holidays';

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
 * Returns an array of holidays (either Israel or Diaspora) and candle-lighting times
 * @param {number} hyear Hebrew year (e.g. 5749)
 * @param {Event[]} holidays result of holidays.year()
 * @param {Object} location including tzid
 */
export default function candles(hyear, holidays, location) {
    let events = [];
    const timeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: location.tzid,
        hour: 'numeric',
        minute: 'numeric'
    });
    const startAbs = hebrew2abs({ yy: hyear, mm: common.months.TISHREI, dd: 1});
    const endAbs = hebrew2abs({ yy: hyear + 1, mm: common.months.TISHREI, dd: 1});
    let candleLightingMinutes = -18;
    if (location.il && location.name === 'Jerusalem') {
        candleLightingMinutes = -40;
    }
    let havdalahMinutes = 50;
    for (let abs = startAbs; abs <= endAbs; abs++) {
        const hd = new HDate(abs);
        const ev = holidays[hd];
        const dow = abs % 7;
        let candles = false;
        if (typeof ev !== 'undefined') {
            for (const e of ev) {
                if ((location.il && e.isIsraelOnly()) || (!location.il && e.isDiasporaOnly())) {
                    const desc = e.getDesc();
                    events.push(e);
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
