import common, { months } from "./common";
import HDate from './hdate';

export function getBirthdayOrAnniversary(hyear, gdate) {
    const orig = new HDate(gdate);
    const isOrigLeap = common.LEAP(orig.getFullYear());
    let month = orig.getMonth();
    let day = orig.getDate();

    /*
     * The birthday of someone born in Adar of an ordinary year or
     * Adar II of a leap year is also always in the last month of the
     * year, be that Adar or Adar II.
     */
    if ((month == months.ADAR_I && !isOrigLeap) || (month == months.ADAR_II && isOrigLeap)) {
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
    else if (month == months.CHESHVAN && day == 30 && !common.lngChesh(hyear)) {
        month = months.KISLEV;
        day = 1;
    }
    else if (month == months.KISLEV && day == 30 && common.shrtKis(hyear)) {
        month = months.TEVET;
        day = 1;
    }
    else if (month == months.ADAR_II && day == 30 && isOrigLeap && !common.LEAP(hyear)) {
        month = months.NISAN;
        day = 1;
    }

    return new HDate(day, month, hyear);
}
