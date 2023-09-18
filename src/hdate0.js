/*
 * More minimal HDate
 */

const NISAN = 1;
const IYYAR = 2;
// const SIVAN = 3;
const TAMUZ = 4;
// const AV = 5;
const ELUL = 6;
const TISHREI = 7;
const CHESHVAN = 8;
const KISLEV = 9;
const TEVET = 10;
// const SHVAT = 11;
const ADAR_I = 12;
const ADAR_II = 13;

/**
 * Hebrew months of the year (NISAN=1, TISHREI=7)
 * @readonly
 * @enum {number}
 */
export const months = {
  /** Nissan / ניסן */
  NISAN: 1,
  /** Iyyar / אייר */
  IYYAR: 2,
  /** Sivan / סיון */
  SIVAN: 3,
  /** Tamuz (sometimes Tammuz) / תמוז */
  TAMUZ: 4,
  /** Av / אב */
  AV: 5,
  /** Elul / אלול */
  ELUL: 6,
  /** Tishrei / תִּשְׁרֵי */
  TISHREI: 7,
  /** Cheshvan / חשון */
  CHESHVAN: 8,
  /** Kislev / כסלו */
  KISLEV: 9,
  /** Tevet / טבת */
  TEVET: 10,
  /** Sh'vat / שבט */
  SHVAT: 11,
  /** Adar or Adar Rishon / אדר */
  ADAR_I: 12,
  /** Adar Sheini (only on leap years) / אדר ב׳ */
  ADAR_II: 13,
};

const monthNames0 = [
  '',
  'Nisan',
  'Iyyar',
  'Sivan',
  'Tamuz',
  'Av',
  'Elul',
  'Tishrei',
  'Cheshvan',
  'Kislev',
  'Tevet',
  'Sh\'vat',
];

/**
 * Transliterations of Hebrew month names.
 * Regular years are index 0 and leap years are index 1.
 * @private
 */
const monthNames = [
  monthNames0.concat([
    'Adar',
    'Nisan',
  ]),
  monthNames0.concat([
    'Adar I',
    'Adar II',
    'Nisan',
  ]),
];

const edCache = Object.create(null);

const EPOCH = -1373428;
// Avg year length in the cycle (19 solar years with 235 lunar months)
const AVG_HEBYEAR_DAYS = 365.24682220597794;

/**
 * @private
 * @param {any} n
 * @param {string} name
 */
function assertNumber(n, name) {
  if (typeof n !== 'number' || isNaN(n)) {
    throw new TypeError(`invalid parameter '${name}' not a number: ${n}`);
  }
}

/**
 * Converts Hebrew date to R.D. (Rata Die) fixed days.
 * R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
 * Calendar.
 * @private
 * @param {number} year Hebrew year
 * @param {number} month Hebrew month
 * @param {number} day Hebrew date (1-30)
 * @return {number}
 */
export function hebrew2abs(year, month, day) {
  assertNumber(year, 'year');
  assertNumber(month, 'month');
  assertNumber(day, 'day');

  if (year < 1) {
    throw new RangeError(`hebrew2abs: invalid year ${year}`);
  }

  let tempabs = day;

  if (month < TISHREI) {
    for (let m = TISHREI; m <= monthsInYear(year); m++) {
      tempabs += daysInMonth(m, year);
    }
    for (let m = NISAN; m < month; m++) {
      tempabs += daysInMonth(m, year);
    }
  } else {
    for (let m = TISHREI; m < month; m++) {
      tempabs += daysInMonth(m, year);
    }
  }

  return EPOCH + elapsedDays(year) + tempabs - 1;
}

/**
 * @private
 * @param {number} year
 * @return {number}
 */
function newYear(year) {
  return EPOCH + elapsedDays(year);
}

/**
 * Converts absolute R.D. days to Hebrew date
 * @private
 * @param {number} abs absolute R.D. days
 * @return {SimpleHebrewDate}
 */
export function abs2hebrew(abs) {
  assertNumber(abs, 'abs');
  abs = Math.trunc(abs);
  if (abs <= EPOCH) {
    throw new RangeError(`abs2hebrew: ${abs} is before epoch`);
  }
  // first, quickly approximate year
  let year = Math.floor((abs - EPOCH) / AVG_HEBYEAR_DAYS);
  while (newYear(year) <= abs) {
    ++year;
  }
  --year;

  let month = abs < hebrew2abs(year, 1, 1) ? 7 : 1;
  while (abs > hebrew2abs(year, month, daysInMonth(month, year))) {
    ++month;
  }

  const day = 1 + abs - hebrew2abs(year, month, 1);
  return {yy: year, mm: month, dd: day};
}

/**
 * Returns true if Hebrew year is a leap year
 * @private
 * @param {number} year Hebrew year
 * @return {boolean}
 */
export function isLeapYear(year) {
  return (1 + year * 7) % 19 < 7;
}

/**
 * Number of months in this Hebrew year (either 12 or 13 depending on leap year)
 * @private
 * @param {number} year Hebrew year
 * @return {number}
 */
export function monthsInYear(year) {
  return 12 + isLeapYear(year); // boolean is cast to 1 or 0
}

/**
 * Number of days in Hebrew month in a given year (29 or 30)
 * @private
 * @param {number} month Hebrew month (e.g. months.TISHREI)
 * @param {number} year Hebrew year
 * @return {number}
 */
export function daysInMonth(month, year) {
  switch (month) {
    case IYYAR:
    case TAMUZ:
    case ELUL:
    case TEVET:
    case ADAR_II:
      return 29;
    default:
      break;
  }
  if ((month === ADAR_I && !isLeapYear(year)) ||
      (month === CHESHVAN && !longCheshvan(year)) ||
      (month === KISLEV && shortKislev(year))) {
    return 29;
  } else {
    return 30;
  }
}

/**
 * Returns a transliterated string name of Hebrew month in year,
 * for example 'Elul' or 'Cheshvan'.
 * @private
 * @param {number} month Hebrew month (e.g. months.TISHREI)
 * @param {number} year Hebrew year
 * @return {string}
 */
export function getMonthName(month, year) {
  assertNumber(month, 'month');
  assertNumber(year, 'year');
  if (month < 1 || month > 14) {
    throw new TypeError(`bad month argument ${month}`);
  }
  return monthNames[+isLeapYear(year)][month];
}

/**
 * Days from sunday prior to start of Hebrew calendar to mean
 * conjunction of Tishrei in Hebrew YEAR
 * @private
 * @param {number} year Hebrew year
 * @return {number}
 */
export function elapsedDays(year) {
  const elapsed = edCache[year] = edCache[year] || elapsedDays0(year);
  return elapsed;
}

/**
 * Days from sunday prior to start of Hebrew calendar to mean
 * conjunction of Tishrei in Hebrew YEAR
 * @private
 * @param {number} year Hebrew year
 * @return {number}
 */
function elapsedDays0(year) {
  const prevYear = year - 1;
  const mElapsed = 235 * Math.floor(prevYear / 19) + // Months in complete 19 year lunar (Metonic) cycles so far
      12 * (prevYear % 19) + // Regular months in this cycle
      Math.floor(((prevYear % 19) * 7 + 1) / 19); // Leap months this cycle

  const pElapsed = 204 + 793 * (mElapsed % 1080);

  const hElapsed = 5 +
      12 * mElapsed +
      793 * Math.floor(mElapsed / 1080) +
      Math.floor(pElapsed / 1080);

  const parts = (pElapsed % 1080) + 1080 * (hElapsed % 24);

  const day = 1 + 29 * mElapsed + Math.floor(hElapsed / 24);
  const altDay = day +
      (parts >= 19440 ||
        (2 === day % 7 && parts >= 9924 && !isLeapYear(year)) ||
        (1 === day % 7 && parts >= 16789 && isLeapYear(prevYear)));

  return altDay + (altDay % 7 === 0 || altDay % 7 === 3 || altDay % 7 === 5);
}

/**
 * Number of days in the hebrew YEAR.
 * A common Hebrew calendar year can have a length of 353, 354 or 355 days
 * A leap Hebrew calendar year can have a length of 383, 384 or 385 days
 * @private
 * @param {number} year Hebrew year
 * @return {number}
 */
export function daysInYear(year) {
  return elapsedDays(year + 1) - elapsedDays(year);
}

/**
 * true if Cheshvan is long in Hebrew year
 * @private
 * @param {number} year Hebrew year
 * @return {boolean}
 */
export function longCheshvan(year) {
  return daysInYear(year) % 10 === 5;
}

/**
 * true if Kislev is short in Hebrew year
 * @private
 * @param {number} year Hebrew year
 * @return {boolean}
 */
export function shortKislev(year) {
  return daysInYear(year) % 10 === 3;
}
