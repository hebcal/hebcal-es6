import {greg, HDate, months} from '@hebcal/hdate';
import {CalOptions} from './CalOptions';

const TISHREI = months.TISHREI;

/**
 * Gets the R.D. days for a number, Date, or HDate
 * @private
 */
function getAbs(d: Date | HDate | number): number {
  if (typeof d == 'number') return d;
  if (greg.isDate(d)) return greg.greg2abs(d as Date);
  if (HDate.isHDate(d)) return (d as HDate).abs();
  throw new TypeError(`Invalid date type: ${d}`);
}

function getYear(options: CalOptions): number {
  if (typeof options.year !== 'undefined') {
    return Number(options.year);
  }
  return options.isHebrewYear ? new HDate().getFullYear() :
    new Date().getFullYear();
}

/**
 * Parse options object to determine start & end days
 * @private
 */
export function getStartAndEnd(options: CalOptions): number[] {
  if ((options.start && !options.end) || (options.end && !options.start)) {
    throw new TypeError('Both options.start and options.end are required');
  } else if (options.start && options.end) {
    return [getAbs(options.start), getAbs(options.end)];
  }
  const isHebrewYear = Boolean(options.isHebrewYear);
  const theYear = getYear(options);
  if (isNaN(theYear)) {
    throw new RangeError(`Invalid year ${options.year}`);
  } else if (isHebrewYear && theYear < 1) {
    throw new RangeError(`Invalid Hebrew year ${theYear}`);
  }
  const theMonth = getMonth(options);
  const numYears = Number(options.numYears) || 1;
  if (isHebrewYear) {
    return startEndHebrew(theMonth, theYear, numYears);
  } else {
    return startEndGregorian(theMonth, theYear, numYears);
  }
}

function getMonth(options: CalOptions): number {
  if (options.month) {
    if (options.isHebrewYear) {
      return HDate.monthNum(options.month);
    } else if (typeof options.month === 'number') {
      return options.month;
    }
  }
  return NaN;
}

function startEndGregorian(theMonth: number, theYear: number, numYears: number): number[] {
  const gregMonth = theMonth ? theMonth - 1 : 0;
  const startGreg = new Date(theYear, gregMonth, 1);
  if (theYear < 100) {
    startGreg.setFullYear(theYear);
  }
  const startAbs = greg.greg2abs(startGreg);
  let endAbs;
  if (theMonth) {
    endAbs = startAbs + greg.daysInMonth(theMonth, theYear) - 1;
  } else {
    const endYear = theYear + numYears;
    const endGreg = new Date(endYear, 0, 1);
    if (endYear < 100) {
      endGreg.setFullYear(endYear);
    }
    endAbs = greg.greg2abs(endGreg) - 1;
  }
  return [startAbs, endAbs];
}

function startEndHebrew(theMonth: number, theYear: number, numYears: number): number[] {
  const startDate = new HDate(1, theMonth || TISHREI, theYear);
  let startAbs = startDate.abs();
  const endAbs = theMonth ?
    startAbs + startDate.daysInMonth() :
    new HDate(1, TISHREI, theYear + numYears).abs() - 1;
  // for full Hebrew year, start on Erev Rosh Hashana which
  // is technically in the previous Hebrew year
  // (but conveniently lets us get candle-lighting time for Erev)
  if (!theMonth && theYear > 1) {
    startAbs--;
  }
  return [startAbs, endAbs];
}
