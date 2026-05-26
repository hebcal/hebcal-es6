import {HDate, months} from '@hebcal/hdate';

const NISAN = months.NISAN;
const SIVAN = months.SIVAN;
const TAMUZ = months.TAMUZ;
const AV = months.AV;
const SAT = 6;

function getHDate(date: HDate | Date | number): HDate {
  return HDate.isHDate(date) ? (date as HDate) : new HDate(date);
}

function isSefiratHaOmer(hd: HDate): boolean {
  const hyear = hd.getFullYear();
  const beginOmer = new HDate(16, NISAN, hyear).abs();
  const endOmer = new HDate(5, SIVAN, hyear).abs();
  const abs = hd.abs();
  return abs >= beginOmer && abs <= endOmer;
}

function isBeinHaMetzarim(hd: HDate): boolean {
  const hyear = hd.getFullYear();
  const begin = new HDate(17, TAMUZ, hyear).abs();
  const tishaBav = new HDate(9, AV, hyear);
  const end =
    tishaBav.getDay() === SAT ? new HDate(10, AV, hyear).abs() : tishaBav.abs();
  const abs = hd.abs();
  return abs >= begin && abs <= end;
}

/**
 * Returns `true` if the given date falls within a public period of communal
 * mourning — specifically:
 *
 * - **Sefirat HaOmer**: 16 Nisan through 5 Sivan (the 49 days of the Omer).
 * - **Bein HaMetzarim** ("between the straits"): 17 Tammuz through 9 Av
 *   (10 Av when 9 Av is postponed because it falls on Shabbat).
 *
 * This is a broad helper — it does not attempt to model minhag-specific
 * exceptions within those periods (e.g. Lag BaOmer, Rosh Chodesh Iyar,
 * the distinction between Sephardic and Ashkenazic customs on which
 * portion of the Omer is observed as mourning, etc.).
 * @example
 * import {isAveilut, HDate, months} from '@hebcal/core';
 * isAveilut(new HDate(20, months.NISAN, 5784)); // true (Omer)
 * isAveilut(new HDate(25, months.TAMUZ, 5784)); // true (Three Weeks)
 * isAveilut(new HDate(15, months.AV, 5784));    // false
 * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
 * @return `true` if the date is during a mourning period
 */
export function isAveilut(date: HDate | Date | number): boolean {
  const hd = getHDate(date);
  return isSefiratHaOmer(hd) || isBeinHaMetzarim(hd);
}
