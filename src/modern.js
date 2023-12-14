import {HDate, months} from './hdate.js';

const SUN = 0;
const TUE = 2;
const FRI = 5;
const SAT = 6;

const NISAN = months.NISAN;
const IYYAR = months.IYYAR;

/**
 * Yom HaShoah first observed in 1951.
 * When the actual date of Yom Hashoah falls on a Friday, the
 * state of Israel observes Yom Hashoah on the preceding
 * Thursday. When it falls on a Sunday, Yom Hashoah is observed
 * on the following Monday.
 * http://www.ushmm.org/remembrance/dor/calendar/
 * @private
 * @param {number} year
 * @return {HDate|null}
 */
export function dateYomHaShoah(year) {
  if (year < 5711) {
    return null;
  }
  let nisan27dt = new HDate(27, NISAN, year);
  if (nisan27dt.getDay() === FRI) {
    nisan27dt = new HDate(26, NISAN, year);
  } else if (nisan27dt.getDay() === SUN) {
    nisan27dt = new HDate(28, NISAN, year);
  }
  return nisan27dt;
}

/**
 * Yom HaAtzma'ut only celebrated after 1948
 * @private
 * @param {number} year
 * @return {HDate|null}
 */
export function dateYomHaZikaron(year) {
  if (year < 5708) {
    return null;
  }
  let day;
  const pesach = new HDate(15, NISAN, year);
  const pdow = pesach.getDay();
  if (pdow === SUN) {
    day = 2;
  } else if (pdow === SAT) {
    day = 3;
  } else if (year < 5764) {
    day = 4;
  } else if (pdow === TUE) {
    day = 5;
  } else {
    day = 4;
  }
  return new HDate(day, IYYAR, year);
}
