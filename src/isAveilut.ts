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
 * Utility method to determine if the given date is during a mourning period.
 *
 * This broad helper returns `true` during Sefirat HaOmer and Bein HaMetzarim.
 * It does not attempt to model minhag-specific exceptions within those periods.
 *
 * @param date Hebrew Date, Gregorian date, or absolute R.D. day number
 * @return `true` if the date is during a mourning period
 */
export function isAveilut(date: HDate | Date | number): boolean {
  const hd = getHDate(date);
  return isSefiratHaOmer(hd) || isBeinHaMetzarim(hd);
}
