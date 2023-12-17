import {flags, Event} from './event';
import {Locale} from './locale';
import {gematriya} from '@hebcal/hdate';

const sefirot = [
  null,
  'Lovingkindness',
  'Might',
  'Beauty',
  'Eternity',
  'Splendor',
  'Foundation',
  'Majesty',
];

const sefirotTranslit = [
  null,
  'Chesed',
  'Gevurah',
  'Tiferet',
  'Netzach',
  'Hod',
  'Yesod',
  'Malkhut',
];

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  /**
   * @param {HDate} date
   * @param {number} omerDay
   */
  constructor(date, omerDay) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT);
    if (omerDay < 1 || omerDay > 49) {
      throw new RangeError(`Invalid Omer day ${omerDay}`);
    }
    this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
    this.daysWithinWeeks = (omerDay % 7) || 7;
    this.omer = omerDay;
  }
  /**
   * @param {string} lang
   * @return {string}
   */
  sefira(lang='en') {
    const week = sefirot[this.weekNumber];
    const dayWithinWeek = sefirot[this.daysWithinWeeks];
    switch (lang) {
      case 'he':
        const heWeek = Locale.gettext(week, 'he');
        const heDayWithinWeek = Locale.gettext(dayWithinWeek, 'he');
        const hePrefix = this.weekNumber === 2 || this.weekNumber === 6 ? 'שֶׁבִּ' : 'שֶׁבְּ';
        return `${heDayWithinWeek} ${hePrefix}${heWeek}`.normalize();
      case 'translit':
        const translitWeek = sefirotTranslit[this.weekNumber];
        const translitDayWithinWeek = sefirotTranslit[this.daysWithinWeeks];
        const translitPrefix = this.weekNumber === 2 || this.weekNumber === 6 ? 'shebi' : `sheb'`;
        return `${translitDayWithinWeek} ${translitPrefix}${translitWeek}`;
      case 'en':
      default:
        return `${dayWithinWeek} within ${week}`;
    }
  }
  /**
   * @todo use gettext()
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    locale = locale || Locale.getLocaleName();
    const omer = this.omer;
    const nth = (locale == 'he') ? gematriya(omer) : Locale.ordinal(omer, locale);
    return nth + ' ' + Locale.gettext('day of the Omer', locale);
  }
  /**
   * Returns translation of "Omer day 22" without ordinal numbers.
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale) {
    return Locale.gettext('Omer', locale) + ' ' + Locale.gettext('day', locale) + ' '+ this.omer;
  }
  /** @return {string} */
  getEmoji() {
    if (typeof this.emoji === 'string') return this.emoji;
    const number = this.omer;
    if (number <= 20) {
      return String.fromCodePoint(9312 + number - 1);
    } else if (number <= 35) {
      // between 21 and 35 inclusive
      return String.fromCodePoint(12881 + number - 21);
    } else {
      // between 36 and 49 inclusive
      return String.fromCodePoint(12977 + number - 36);
    }
  }
  /** @return {number} */
  getWeeks() {
    const day7 = this.daysWithinWeeks === 7;
    return day7 ? this.weekNumber : this.weekNumber - 1;
  }
  /** @return {number} */
  getDaysWithinWeeks() {
    return this.daysWithinWeeks;
  }
  /**
   * @param {string} locale
   * @return {string}
   */
  getTodayIs(locale) {
    locale = locale || Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    if (locale === 'he') {
      return getTodayIsHe(this.omer);
    } else if (locale === 'he-x-nonikud') {
      return Locale.hebrewStripNikkud(getTodayIsHe(this.omer));
    }
    const totalDaysStr = (this.omer === 1) ? 'day' : 'days';
    let str = `Today is ${this.omer} ${totalDaysStr}`;
    if (this.weekNumber > 1 || this.omer === 7) {
      const day7 = this.daysWithinWeeks === 7;
      const numWeeks = day7 ? this.weekNumber : this.weekNumber - 1;
      const weeksStr = (numWeeks === 1) ? 'week' : 'weeks';
      str += `, which is ${numWeeks} ${weeksStr}`;
      if (!day7) {
        const daysStr = (this.daysWithinWeeks === 1) ? 'day' : 'days';
        str += ` and ${this.daysWithinWeeks} ${daysStr}`;
      }
    }
    return str + ' of the Omer';
  }
  /** @return {string} */
  url() {
    return `https://www.hebcal.com/omer/${this.getDate().getFullYear()}/${this.omer}`;
  }
}

// adapted from pip hdate package (GPL)
// https://github.com/py-libhdate/py-libhdate/blob/master/hdate/date.py

const tens = ['', 'עֲשָׂרָה', 'עֶשְׂרִים', 'שְׁלוֹשִׁים', 'אַרְבָּעִים'];
const ones = [
  '',
  'אֶחָד',
  'שְׁנַיִם',
  'שְׁלוֹשָׁה',
  'אַרְבָּעָה',
  'חֲמִשָׁה',
  'שִׁשָׁה',
  'שִׁבְעָה',
  'שְׁמוֹנָה',
  'תִּשְׁעָה',
];

const shnei = 'שְׁנֵי';
const yamim = 'יָמִים';
const shneiYamim = shnei + ' ' + yamim;
const shavuot = 'שָׁבוּעוֹת';
const yom = 'יוֹם';
const yomEchad = yom + ' ' + ones[1];

/**
 * @private
 * @param {number} omer
 * @return {string}
 */
function getTodayIsHe(omer) {
  const ten = Math.floor(omer / 10);
  const one = omer % 10;
  let str = 'הַיוֹם ';
  if (10 < omer && omer < 20) {
    str += ones[one] + ' עָשָׂר';
  } else if (omer > 9) {
    str += ones[one];
    if (one) {
      str += ' וְ';
    }
  }
  if (omer > 2) {
    if ((omer > 20) || (omer === 10) || (omer === 20)) {
      str += tens[ten];
    }
    if (omer < 11) {
      str += ones[one] + ' ' + yamim + ' ';
    } else {
      str += ' ' + yom + ' ';
    }
  } else if (omer === 1) {
    str += yomEchad + ' ';
  } else { // omer == 2
    str += shneiYamim + ' ';
  }
  if (omer > 6) {
    str = str.trim(); // remove trailing space before comma
    str += ', שְׁהֵם ';
    const weeks = Math.floor(omer / 7);
    const days = omer % 7;
    if (weeks > 2) {
      str += ones[weeks] + ' ' + shavuot + ' ';
    } else if (weeks == 1) {
      str += 'שָׁבוּעַ' + ' ' + ones[1] + ' ';
    } else { // weeks == 2
      str += shnei + ' ' + shavuot + ' ';
    }
    if (days) {
      str += 'וְ';
      if (days > 2) {
        str += ones[days] + ' ' + yamim + ' ';
      } else if (days == 1) {
        str += yomEchad + ' ';
      } else { // days == 2
        str += shneiYamim + ' ';
      }
    }
  }
  str += 'לָעוֹמֶר';
  return str.normalize();
}
