import {HDate, months} from '@hebcal/hdate';
import {dateYomHaZikaron} from './modern';

function range(start: number, end: number): readonly number[] {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

/**
 * Is *tachanun* said today?
 */
export type TachanunResult = {
  /** Tachanun is said at Shacharit */
  shacharit: boolean;
  /** Tachanun is said at Mincha */
  mincha: boolean;
  /** All congregations say Tachanun on the day */
  allCongs: boolean;
};

const NONE: TachanunResult = {
  shacharit: false,
  mincha: false,
  allCongs: false,
} as const;

export function tachanun_(hdate: HDate, il: boolean): TachanunResult {
  return tachanun0(hdate, il, true);
}

function tachanun0(
  hdate: HDate,
  il: boolean,
  checkNext: boolean
): TachanunResult {
  const year = hdate.yy;
  const dates = tachanunYear(year, il);
  const abs = hdate.abs();
  if (dates.none.indexOf(abs) > -1) {
    return NONE;
  }
  const dow = hdate.getDay();
  const ret: TachanunResult = {
    shacharit: false,
    mincha: false,
    allCongs: false,
  };
  if (dates.some.indexOf(abs) === -1) {
    ret.allCongs = true;
  }
  if (dow !== 6) {
    ret.shacharit = true;
  }
  const tomorrow = abs + 1;
  if (checkNext && dates.yesPrev.indexOf(tomorrow) === -1) {
    const tmp = tachanun0(new HDate(tomorrow), il, false);
    ret.mincha = tmp.shacharit;
  } else {
    ret.mincha = dow !== 5;
  }
  if (ret.allCongs && !ret.mincha && !ret.shacharit) {
    return NONE;
  }
  return ret;
}

type TachanunYear = {
  none: number[];
  some: number[];
  yesPrev: number[];
};

function tachanunYear(year: number, il: boolean): TachanunYear {
  const leap = HDate.isLeapYear(year);
  const monthsInYear = HDate.monthsInYear(year);
  let av9dt = new HDate(9, months.AV, year);
  if (av9dt.getDay() === 6) {
    av9dt = av9dt.next();
  }
  let shushPurim = new HDate(15, months.ADAR_II, year);
  if (shushPurim.getDay() === 6) {
    shushPurim = shushPurim.next();
  }
  const none: readonly HDate[] = [
    new HDate(2, months.TISHREI, year), // Rosh Hashana II
  ].concat(
    // Rosh Chodesh - 1st of every month. Also includes RH day 1 (1 Tishrei)
    range(1, monthsInYear).map(month => new HDate(1, month, year)),
    // Rosh Chodesh - 30th of months that have one
    range(1, monthsInYear)
      .filter(month => HDate.daysInMonth(month, year) === 30)
      .map(month => new HDate(30, month, year)),
    // entire month of Nisan
    range(1, HDate.daysInMonth(months.NISAN, year)).map(
      mday => new HDate(mday, months.NISAN, year)
    ),
    new HDate(18, months.IYYAR, year), // Lag BaOmer
    // Rosh Chodesh Sivan thru Isru Chag
    range(1, 8 - (il ? 1 : 0)).map(mday => new HDate(mday, months.SIVAN, year)),
    av9dt, // Tisha B'Av
    new HDate(15, months.AV, year), // Tu B'Av
    new HDate(29, months.ELUL, year), // Erev Rosh Hashanah
    // Erev Yom Kippur thru Isru Chag
    range(9, 24 - (il ? 1 : 0)).map(
      mday => new HDate(mday, months.TISHREI, year)
    ),
    // Chanukah
    range(25, 33).map(mday => new HDate(mday, months.KISLEV, year)),
    new HDate(15, months.SHVAT, year), // Tu BiShvat
    new HDate(14, months.ADAR_II, year), // Purim
    shushPurim,
    leap ? new HDate(14, months.ADAR_I, year) : [] // Purim Katan
  );
  const some: readonly HDate[] = [
    new HDate(14, months.IYYAR, year), // Pesach Sheini
  ].concat(
    // Until 14 Sivan
    range(1, 13).map(mday => new HDate(mday, months.SIVAN, year)),
    // Until after Rosh Chodesh Cheshvan
    range(20, 31).map(mday => new HDate(mday, months.TISHREI, year)),
    // Yom HaAtzma'ut, which changes based on day of week
    year >= 5708 ? (dateYomHaZikaron(year) as HDate).next() : [],
    // Yom Yerushalayim
    year >= 5727 ? new HDate(28, months.IYYAR, year) : []
  );
  const yesPrev: readonly HDate[] = [
    new HDate(29, months.ELUL, year - 1), // Erev Rosh Hashanah
    new HDate(9, months.TISHREI, year), // Erev Yom Kippur
    new HDate(14, months.IYYAR, year), // Pesach Sheini
  ];
  return {
    none: none.map(hd => hd.abs()).sort((a, b) => a - b),
    some: some.map(hd => hd.abs()).sort((a, b) => a - b),
    yesPrev: yesPrev.map(hd => hd.abs()).sort((a, b) => a - b),
  };
}
