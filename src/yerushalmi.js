import {greg2abs, isDate} from './greg0';
import {HDate, months} from './hdate';

const cycleStartDate = new Date(1980, 1, 2);
export const yerushalmiYomiStart = greg2abs(cycleStartDate);

const numDapim = 1554;

const shas = [
  ['Berakhot', 68],
  ['Peah', 37],
  ['Demai', 34],
  ['Kilayim', 44],
  ['Sheviit', 31],
  ['Terumot', 59],
  ['Maasrot', 26],
  ['Maaser Sheni', 33],
  ['Challah', 28],
  ['Orlah', 20],
  ['Bikkurim', 13],
  ['Shabbat', 92],
  ['Eruvin', 65],
  ['Pesachim', 71],
  ['Beitzah', 22],
  ['Rosh Hashanah', 22],
  ['Yoma', 42],
  ['Sukkah', 26],
  ['Taanit', 26],
  ['Shekalim', 33],
  ['Megillah', 34],
  ['Chagigah', 22],
  ['Moed Katan', 19],
  ['Yevamot', 85],
  ['Ketubot', 72],
  ['Sotah', 47],
  ['Nedarim', 40],
  ['Nazir', 47],
  ['Gittin', 54],
  ['Kiddushin', 48],
  ['Bava Kamma', 44],
  ['Bava Metzia', 37],
  ['Bava Batra', 34],
  ['Shevuot', 44],
  ['Makkot', 9],
  ['Sanhedrin', 57],
  ['Avodah Zarah', 37],
  ['Horayot', 19],
  ['Niddah', 13],
];

// eslint-disable-next-line require-jsdoc
function throwTypeError(msg) {
  throw new TypeError(msg);
}

const SUN = 0;
const SAT = 6;

/**
 * The Yerushalmi Daf Yomi program takes approx. 4.25 years or 51 months.
 * Unlike the Daf Yomi Bavli cycle, the Yerushalmi cycle skips both
 * Yom Kippur and Tisha B'Av. The page numbers are according to the Vilna
 * Edition which is used since 1900.
 * @param {HDate|Date|number} date
 * @return {any}
 */
export function yerushalmiYomi(date) {
  const cday = (typeof date === 'number' && !isNaN(date)) ? date :
    isDate(date) ? greg2abs(date) :
    HDate.isHDate(date) ? date.abs() :
    throwTypeError(`non-date given to dafyomi: ${date}`);
  if (cday < yerushalmiYomiStart) {
    throw new RangeError(`Date ${date} too early; Yerushalmi Yomi cycle began on ${cycleStartDate}`);
  }
  const hd = new HDate(cday);
  // No Daf for Yom Kippur and Tisha B'Av
  if ((hd.getMonth() === months.TISHREI && hd.getDate() === 10) ||
  (hd.getMonth() === months.AV &&
    ((hd.getDate() === 9 && hd.getDay() !== SAT) ||
      (hd.getDate() === 10 && hd.getDay() === SUN)))) {
    return null;
  }

  let prevCycle = yerushalmiYomiStart;
  let nextCycle = yerushalmiYomiStart;
  while (cday >= nextCycle) {
    prevCycle = nextCycle;
    nextCycle += numDapim;
    nextCycle += numSpecialDays(prevCycle, nextCycle);
  }
  let total = cday - prevCycle - numSpecialDays(prevCycle, cday);
  for (let j = 0; j < shas.length; j++) {
    const masechet = shas[j];
    if (total < masechet[1]) {
      return {name: masechet[0], blatt: total + 1};
    }
    total -= masechet[1];
  }
  throw new Error('Interal error, this code should be unreachable');
}

/**
 * @private
 * @param {number} startAbs
 * @param {number} endAbs
 * @return {number}
 */
function numSpecialDays(startAbs, endAbs) {
  const startYear = new HDate(startAbs).getFullYear();
  const endYear = new HDate(endAbs).getFullYear();
  let specialDays = 0;
  for (let year = startYear; year <= endYear; year++) {
    const ykAbs = new HDate(10, months.TISHREI, year).abs();
    if (ykAbs >= startAbs && ykAbs <= endAbs) {
      specialDays++;
    }
    let av9dt = new HDate(9, months.AV, year);
    if (av9dt.getDay() == SAT) {
      av9dt = av9dt.next();
    }
    const av9abs = av9dt.abs();
    if (av9abs >= startAbs && av9abs <= endAbs) {
      specialDays++;
    }
  }
  return specialDays;
}
