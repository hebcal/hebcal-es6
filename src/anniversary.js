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
import common from "./common";
import { HDate, hebrew2abs, abs2hebrew } from './hdate';
import { greg2abs } from './greg';

const NISAN = common.months.NISAN;
const CHESHVAN = common.months.CHESHVAN;
const KISLEV = common.months.KISLEV;
const TEVET = common.months.TEVET;
const SHVAT = common.months.SHVAT;
const ADAR_I = common.months.ADAR_I;
const ADAR_II = common.months.ADAR_II;

export function getBirthdayOrAnniversary(hyear, gdate) {
    const orig = new HDate(gdate);
    const origYear = orig.getFullYear();
    if (hyear <= origYear) {
        throw new Error(`Hebrew year ${hyear} occurs on or before original date in ${origYear}`);
    }
    const isOrigLeap = common.LEAP(origYear);
    let month = orig.getMonth();
    let day = orig.getDate();

    /*
     * The birthday of someone born in Adar of an ordinary year or
     * Adar II of a leap year is also always in the last month of the
     * year, be that Adar or Adar II.
     */
    if ((month == ADAR_I && !isOrigLeap) || (month == ADAR_II && isOrigLeap)) {
        month = common.MONTH_CNT(hyear);
    }
    /*
     * The birthday in an ordinary year of someone born during the
     * first 29 days of Adar I in a leap year is on the corresponding
     * day of Adar; in a leap year, the birthday occurs in Adar I, as
     * expected.
     *
     * Someone born on the thirtieth day of Marcheshvan, Kislev, or
     * Adar I has his birthday postponed until the first of the
     * following month in years where that day does not
     * occur. [Calendrical Calculations p. 111]
     */
    else if (month == CHESHVAN && day == 30 && !common.lngChesh(hyear)) {
        month = KISLEV;
        day = 1;
    }
    else if (month == KISLEV && day == 30 && common.shrtKis(hyear)) {
        month = TEVET;
        day = 1;
    }
    else if (month == ADAR_I && day == 30 && isOrigLeap && !common.LEAP(hyear)) {
        month = NISAN;
        day = 1;
    }

    return new HDate(day, month, hyear);
}

/**
 * Calculates yahrzeit
 * @param {number} hyear Hebrew year
 * @param {Date} gdate Gregorian date of death
 * @returns {HDate}
 */
export function getYahrzeit(hyear, gdate) {
    let hDeath = abs2hebrew(greg2abs(gdate));
    if (hyear <= hDeath.yy) {
        throw new Error(`Hebrew year ${hyear} occurs on or before original date in ${hDeath.yy}`);
    }

    /* If it's Heshvan 30 it depends on the first anniversary; if
        that was not Heshvan 30, use the day before Kislev 1. */
    if (hDeath.mm == CHESHVAN && hDeath.dd == 30 && !common.lngChesh(hDeath.yy + 1)) {
        hDeath.dd = 1;
        hDeath.mm = KISLEV;
        hDeath.yy = hyear;
        hDeath = abs2hebrew(hebrew2abs(hDeath) - 1);
    }
    /* If it's Kislev 30 it depends on the first anniversary; if
        that was not Kislev 30, use the day before Teveth 1. */
    else if (hDeath.mm == KISLEV && hDeath.dd == 30 && common.shrtKis(hDeath.yy + 1)) {
        hDeath.dd = 1;
        hDeath.mm = TEVET;
        hDeath.yy = hyear;
        hDeath = abs2hebrew(hebrew2abs(hDeath) - 1);
    }
    /* If it's Adar II, use the same day in last month of year (Adar or Adar II). */
    else if (hDeath.mm == ADAR_II) {
        hDeath.mm = common.MONTH_CNT(hyear);
    }
    /* If it's the 30th in Adar I and year is not a leap year
        (so Adar has only 29 days), use the last day in Shevat. */
    else if (hDeath.mm == ADAR_I && hDeath.dd == 30 && !common.LEAP(hyear)) {
        hDeath.dd = 30;
        hDeath.mm = SHVAT;
    }
    /* In all other cases, use the normal anniversary of the date of death. */

    /* advance day to rosh chodesh if needed */
    if (hDeath.mm == CHESHVAN && hDeath.dd == 30 && !common.lngChesh(hyear)) {
        hDeath.mm = KISLEV;
        hDeath.dd = 1;
    } else if (hDeath.mm == KISLEV && hDeath.dd == 30 && common.shrtKis(hyear)) {
        hDeath.mm = TEVET;
        hDeath.dd = 1;
    }

    return new HDate(hDeath.dd, hDeath.mm, hyear);
}

export default {
    getBirthdayOrAnniversary,
    getYahrzeit
};
