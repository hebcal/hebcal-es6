import {HDate, months} from './hdate';

const NONE = 0;
const MINCHA = 1;
const SHACHARIT = 2;
const ALL_CONGS = 4;

function range(start, end, step) {
  step = step || 1;
  if (step < 0) {
    step = 0 - step;
  }

  const arr = []; let i = start;
  if (start < end) {
    for (; i <= end; i += step) {
      arr.push(i);
    }
  } else {
    for (; i >= end; i -= step) {
      arr.push(i);
    }
  }
  return arr;
}


/**
 * Return a bitmask containing information on what Tachanun (or Tzidchatcha on Shabbat)
 * is said on that day.
 * For an explanation of how this works, see
 * [issue #38](https://github.com/hebcal/hebcal-js/issues/38#issuecomment-300735615).
 *
 * Tachanun is not said on Rosh Chodesh, the month of Nisan, Lag Baomer,
 * Rosh Chodesh Sivan until Isru Chag, Tisha B'av, 15 Av, Erev Rosh Hashanah,
 * Rosh Hashanah, Erev Yom Kippur until after Simchat Torah, Chanukah,
 * Tu B'shvat, Purim and Shushan Purim, and Purim and Shushan Purim Katan.
 *
 * In some congregations Tachanun is not said until from Rosh Chodesh Sivan
 * until 14th Sivan, Sukkot until after Rosh Chodesh Cheshvan, Pesach Sheini,
 * Yom Ha'atzmaut, and Yom Yerushalayim.
 *
 * Tachanun is not said at Mincha on days before it is not said at Shacharit.
 * Tachanun is not said at Shacharit on Shabbat, but is at Mincha, usually.

The bitmask is made up of the following values:

* 0 - No Tachanun, according to everybody
* 1 - Tachanun is said at Mincha
* 2 - Tachanun is said at Shacharit
* 4 - All congregations say Tachanun on the day

An object with Boolean properties {shacharit, mincha, all_congs}.

 * @private
 * @param {HDate} hdate
 * @param {boolean} il
 * @return {number}
 */
export function tachanun(hdate, il) {
  const year = hdate.getFullYear();
  const monthsInYear = HDate.monthsInYear(year);
  let av9dt = new HDate(9, months.AV, year);
  if (av9dt.getDay() === 6) {
    av9dt = av9dt.next();
  }
  const all = [].concat(
      // Rosh Chodesh - 1st of every month. Also includes RH (1 Tishrei)
      range(1, monthsInYear)
          .map((month) => new HDate(1, month, year)),
      // Rosh Chodesh - 30th of months that have one
      range(1, monthsInYear)
          .filter((month) => HDate.daysInMonth(month, year) === 30)
          .map((month) => new HDate(30, month, year)),
      // entire month of Nisan
      range(1, HDate.daysInMonth(months.NISAN, year))
          .map((mday) => new HDate(mday, months.NISAN, year)),
      new HDate(18, months.IYYAR, year), // Lag BaOmer
      // Rosh Chodesh Sivan thru Isru Chag
      range(1, 8 - (il ? 1 : 0))
          .map((mday) => new HDate(mday, months.SIVAN, year)),
      av9dt, // Tisha B'Av
      new HDate(15, months.AV, year), // Tu B'Av
      new HDate(29, months.ELUL, year), // Erev Rosh Hashanah
      // Erev Yom Kippur thru Isru Chag
      range(9, 24 - (il ? 1 : 0))
          .map((mday) => new HDate(mday, months.TISHREI, year)),
      // Chanukah
      range(25, 33)
          .map((mday) => new HDate(mday, months.KISLEV, year)),
      new HDate(15, months.SHVAT, year), // Tu BiShvat
      new HDate(14, months.ADAR_II, year), // Purim
    HDate.isLeapYear(year) ? new HDate(14, months.ADAR_I, year) : [], // Purim Katan
  );
  const allAbs = all.map((hd) => hd.abs()).sort();
  return allAbs;
//  return 0;
  /*
  ('Rosh Chodesh').concat(
        year.find(c.range(1, c.daysInMonth(NISAN, y)), NISAN), // all of Nisan
        year.find(15 + 33, NISAN), // Lag Baomer
        year.find(c.range(1, 8 - me.il), months.SIVAN), // Rosh Chodesh Sivan thru Isru Chag
        year.find([9, 15], months.AV), // Tisha B'av and Tu B'av
        year.find(-1, months.ELUL), // Erev Rosh Hashanah
        year.find([1, 2], TISHREI), // Rosh Hashanah
        year.find(c.range(9, 24 - me.il), TISHREI), // Erev Yom Kippur thru Isru Chag
        year.find(c.range(25, 33), months.KISLEV), // Chanukah
        year.find(15, months.SHVAT), // Tu B'shvat
        year.find([14, 15], year[isLeapYear]() ? [months.ADAR_I, months.ADAR_II] : months.ADAR_I), // Purim/Shushan Purim + Katan
    ));
    some = __cache.some[y] = mapAbs([].concat( // Don't care if it overlaps days in all, because all takes precedence
        year.find(c.range(1, 13), months.SIVAN), // Until 14 Sivan
        year.find(c.range(20, 31), TISHREI), // Until after Rosh Chodesh Cheshvan
        year.find(14, months.IYYAR), // Pesach Sheini
        holidays.atzmaut(y)[1].date || [], // Yom HaAtzma'ut, which changes based on day of week
      y >= 5727 ? year.find(29, months.IYYAR) : [], // Yom Yerushalayim
    ));
    yesPrev = __cache.yesPrev[y] = mapAbs([].concat( // tachanun is said on the previous day at mincha
        year.find(-1, months.ELUL), // Erev Rosh Hashanah
        year.find(9, months.TISHREI), // Erev Yom Kippur
        year.find(14, months.IYYAR), // Pesach Sheini
    ));
    __cache.il[y] = me.il;
  }

  all = all.includes(me.abs());
  some = some.includes(me.abs());
  yesPrev = yesPrev.includes(me.abs()+1);

  if (all) {
    return NONE;
  }
  let ret = (!some && ALL_CONGS) | (me.getDay() != 6 && SHACHARIT);
  if (checkNext && !yesPrev) {
    ret |= ((me.next().tachanun(true) & SHACHARIT) && MINCHA);
  } else {
    ret |= (me.getDay() != 5 && MINCHA);
  }
  return ret == ALL_CONGS ? NONE : ret;
  */
}
