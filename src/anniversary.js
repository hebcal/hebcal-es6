import {HDate, months} from './hdate';

const NISAN = months.NISAN;
const CHESHVAN = months.CHESHVAN;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const SHVAT = months.SHVAT;
const ADAR_I = months.ADAR_I;
const ADAR_II = months.ADAR_II;

/**
 * @private
 * @param {number} hyear Hebrew year
 * @param {Date|HDate} gdate Gregorian or Hebrew date of death
 * @return {HDate} anniversary occurring in hyear
 */
export function getYahrzeit_(hyear, gdate) {
  const orig = HDate.isHDate(gdate) ? gdate : new HDate(gdate);
  let hDeath = {
    yy: orig.getFullYear(),
    mm: orig.getMonth(),
    dd: orig.getDate(),
  };
  if (hyear <= hDeath.yy) {
    // `Hebrew year ${hyear} occurs on or before original date in ${hDeath.yy}`
    return undefined;
  }

  if (hDeath.mm == CHESHVAN && hDeath.dd == 30 && !HDate.longCheshvan(hDeath.yy + 1)) {
    // If it's Heshvan 30 it depends on the first anniversary;
    // if that was not Heshvan 30, use the day before Kislev 1.
    hDeath = HDate.abs2hebrew(HDate.hebrew2abs(hyear, KISLEV, 1) - 1);
  } else if (hDeath.mm == KISLEV && hDeath.dd == 30 && HDate.shortKislev(hDeath.yy + 1)) {
    // If it's Kislev 30 it depends on the first anniversary;
    // if that was not Kislev 30, use the day before Teveth 1.
    hDeath = HDate.abs2hebrew(HDate.hebrew2abs(hyear, TEVET, 1) - 1);
  } else if (hDeath.mm == ADAR_II) {
    // If it's Adar II, use the same day in last month of year (Adar or Adar II).
    hDeath.mm = HDate.monthsInYear(hyear);
  } else if (hDeath.mm == ADAR_I && hDeath.dd == 30 && !HDate.isLeapYear(hyear)) {
    // If it's the 30th in Adar I and year is not a leap year
    // (so Adar has only 29 days), use the last day in Shevat.
    hDeath.dd = 30;
    hDeath.mm = SHVAT;
  }
  // In all other cases, use the normal anniversary of the date of death.

  // advance day to rosh chodesh if needed
  if (hDeath.mm == CHESHVAN && hDeath.dd == 30 && !HDate.longCheshvan(hyear)) {
    hDeath.mm = KISLEV;
    hDeath.dd = 1;
  } else if (hDeath.mm == KISLEV && hDeath.dd == 30 && HDate.shortKislev(hyear)) {
    hDeath.mm = TEVET;
    hDeath.dd = 1;
  }

  return new HDate(hDeath.dd, hDeath.mm, hyear);
}

/**
 * @private
 * @param {number} hyear Hebrew year
 * @param {Date|HDate} gdate Gregorian or Hebrew date of event
 * @return {HDate} anniversary occurring in `hyear`
 */
export function getBirthdayOrAnniversary_(hyear, gdate) {
  const orig = HDate.isHDate(gdate) ? gdate : new HDate(gdate);
  const origYear = orig.getFullYear();
  if (hyear <= origYear) {
    // `Hebrew year ${hyear} occurs on or before original date in ${origYear}`
    return undefined;
  }
  const isOrigLeap = HDate.isLeapYear(origYear);
  let month = orig.getMonth();
  let day = orig.getDate();

  if ((month == ADAR_I && !isOrigLeap) || (month == ADAR_II && isOrigLeap)) {
    month = HDate.monthsInYear(hyear);
  } else if (month == CHESHVAN && day == 30 && !HDate.longCheshvan(hyear)) {
    month = KISLEV;
    day = 1;
  } else if (month == KISLEV && day == 30 && HDate.shortKislev(hyear)) {
    month = TEVET;
    day = 1;
  } else if (month == ADAR_I && day == 30 && isOrigLeap && !HDate.isLeapYear(hyear)) {
    month = NISAN;
    day = 1;
  }

  return new HDate(day, month, hyear);
}
