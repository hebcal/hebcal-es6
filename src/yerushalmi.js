import {greg2abs, isDate} from './greg0';
import {HDate, months} from './hdate';
import {Locale} from './locale';
import {Event, flags} from './event';
import {gematriya} from './gematriya';
import vilnaMap from './yerushalmiVilnaMap.json';

const vilnaStartDate = new Date(1980, 1, 2);
/**
 * Yerushalmi Yomi configuration for Vilna Edition
 * @readonly
 */
export const vilna = {
  ed: 'vilna',
  startDate: vilnaStartDate,
  startAbs: greg2abs(vilnaStartDate),
  skipYK9Av: true,
  shas: [
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
  ],
};

const schottensteinStartDate = new Date(2022, 10, 14);
/**
 * Yerushalmi Yomi configuration for Schottenstein Edition
 * @readonly
 */
export const schottenstein = {
  ed: 'schottenstein',
  startDate: schottensteinStartDate,
  startAbs: greg2abs(schottensteinStartDate),
  skipYK9Av: false,
  shas: [
    ['Berakhot', 94],
    ['Peah', 73],
    ['Demai', 77],
    ['Kilayim', 84],
    ['Sheviit', 87],
    ['Terumot', 107],
    ['Maasrot', 46],
    ['Maaser Sheni', 59],
    ['Challah', 49],
    ['Orlah', 42],
    ['Bikkurim', 26],
    ['Shabbat', 113],
    ['Eruvin', 71],
    ['Pesachim', 86],
    ['Shekalim', 61],
    ['Yoma', 57],
    ['Sukkah', 33],
    ['Beitzah', 49],
    ['Rosh Hashanah', 27],
    ['Taanit', 31],
    ['Megillah', 41],
    ['Chagigah', 28],
    ['Moed Katan', 23],
    ['Yevamot', 88],
    ['Ketubot', 77],
    ['Nedarim', 42],
    ['Nazir', 53],
    ['Sotah', 52],
    ['Gittin', 53],
    ['Kiddushin', 53],
    ['Bava Kamma', 40],
    ['Bava Metzia', 35],
    ['Bava Batra', 39],
    ['Sanhedrin', 75],
    ['Shevuot', 49],
    ['Avodah Zarah', 34],
    ['Makkot', 11],
    ['Horayot', 18],
    ['Niddah', 11],
  ],
};

// eslint-disable-next-line require-jsdoc
function throwTypeError(msg) {
  throw new TypeError(msg);
}

const SUN = 0;
const SAT = 6;

/**
 * Using the Vilna edition, the Yerushalmi Daf Yomi program takes
 * ~4.25 years or 51 months.
 * Unlike the Daf Yomi Bavli cycle, this Yerushalmi cycle skips both
 * Yom Kippur and Tisha B'Av (returning `null`).
 * The page numbers are according to the Vilna
 * Edition which is used since 1900.
 *
 * The Schottenstein edition uses different page numbers and takes
 * ~6 years to complete.
 *
 * Throws an exception if the date is before Daf Yomi Yerushalmi
 * cycle began (2 February 1980 for Vilna,
 * 14 November 2022 for Schottenstein).
 *
 * @param {HDate|Date|number} date - Hebrew or Gregorian date
 * @param {any} config - either vilna or schottenstein
 * @return {any}
 */
export function yerushalmiYomi(date, config) {
  if (typeof config !== 'object' || !Array.isArray(config.shas)) {
    throw new Error('invalid yerushalmi config');
  }
  const cday = (typeof date === 'number' && !isNaN(date)) ? date :
    isDate(date) ? greg2abs(date) :
    HDate.isHDate(date) ? date.abs() :
    throwTypeError(`non-date given to dafyomi: ${date}`);
  const startAbs = config.startAbs;
  if (cday < startAbs) {
    throw new RangeError(`Date ${date} too early; Yerushalmi Yomi cycle began on ${config.startDate}`);
  }
  const hd = new HDate(cday);
  // No Daf for Yom Kippur and Tisha B'Av
  if (config.skipYK9Av && skipDay(hd)) {
    return null;
  }

  const shas = config.shas;
  let numDapim = 0;
  for (let j = 0; j < shas.length; j++) {
    numDapim += shas[j][1];
  }

  let prevCycle = startAbs;
  let nextCycle = startAbs;
  while (cday >= nextCycle) {
    prevCycle = nextCycle;
    nextCycle += numDapim;
    nextCycle += numSpecialDays(config, prevCycle, nextCycle);
  }
  let total = cday - prevCycle - numSpecialDays(config, prevCycle, cday);
  for (let j = 0; j < shas.length; j++) {
    const masechet = shas[j];
    if (total < masechet[1]) {
      return {name: masechet[0], blatt: total + 1, ed: config.ed};
    }
    total -= masechet[1];
  }
  throw new Error('Interal error, this code should be unreachable');
}

/**
 * @private
 * @param {HDate} hd
 * @return {boolean}
 */
function skipDay(hd) {
  if ((hd.getMonth() === months.TISHREI && hd.getDate() === 10) ||
      (hd.getMonth() === months.AV &&
        ((hd.getDate() === 9 && hd.getDay() !== SAT) ||
          (hd.getDate() === 10 && hd.getDay() === SUN)))) {
    return true;
  }
  return false;
}

/**
 * @private
 * @param {any} config
 * @param {number} startAbs
 * @param {number} endAbs
 * @return {number}
 */
function numSpecialDays(config, startAbs, endAbs) {
  if (!config.skipYK9Av) {
    return 0;
  }
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

/**
 * Event wrapper around a Yerushalmi Yomi result
 */
export class YerushalmiYomiEvent extends Event {
  /**
   * @param {HDate} date
   * @param {any} daf
   */
  constructor(date, daf) {
    super(date, `${daf.name} ${daf.blatt}`, flags.YERUSHALMI_YOMI, {daf});
  }
  /**
   * Returns name of tractate and page (e.g. "Yerushalmi Beitzah 21").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const prefix = Locale.gettext('Yerushalmi', locale);
    return prefix + ' ' + this.renderBrief(locale);
  }
  /**
   * Returns name of tractate and page (e.g. "Beitzah 21").
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const name = Locale.gettext(this.daf.name, locale);
    if (locale === 'he' || locale === 'he-x-nonikud') {
      return name + ' דף ' + gematriya(this.daf.blatt);
    }
    return name + ' ' + this.daf.blatt;
  }
  /**
   * Returns a link to sefaria.org
   * @return {string}
   */
  url() {
    const daf = this.daf;
    if (daf.ed !== 'vilna') {
      return undefined;
    }
    const tractate = daf.name;
    const pageMap = vilnaMap[tractate];
    if (!Array.isArray(pageMap)) {
      return undefined;
    }
    const idx = daf.blatt - 1;
    const verses0 = pageMap[idx];
    if (typeof verses0 !== 'string') {
      return undefined;
    }
    const name0 = 'Jerusalem Talmud ' + tractate;
    const name = name0.replace(/ /g, '_');
    const verses = verses0.replace(/:/g, '.');
    return `https://www.sefaria.org/${name}.${verses}?lang=bi`;
  }
}
