import {HDate, Locale, gematriya} from '@hebcal/hdate';
import {Event, flags} from './event';
import './locale'; // Adds Hebrew and Ashkenazic translations

/**
 * Language for counting the Omer can be English or Hebrew.
 * Lang for the Sefira can be English, Hebrew, or Hebrew in Sephardic transliteration.
 */
type OmerLang = 'en' | 'he' | 'translit';

const sefirot = {
  en: {
    infix: 'within ',
    infix26: 'within ',
    words: [
      '',
      'Lovingkindness',
      'Might',
      'Beauty',
      'Eternity',
      'Splendor',
      'Foundation',
      'Majesty',
    ],
  },
  he: {
    infix: 'שֶׁבְּ',
    infix26: 'שֶׁבִּ',
    words: [
      '',
      'חֶֽסֶד',
      'גְבוּרָה',
      'תִּפְאֶֽרֶת',
      'נֶּֽצַח',
      'הוֹד',
      'יְּסוֹד',
      'מַּלְכוּת',
    ],
  },
  translit: {
    infix: "sheb'",
    infix26: 'shebi',
    words: [
      '',
      'Chesed',
      'Gevurah',
      'Tiferet',
      'Netzach',
      'Hod',
      'Yesod',
      'Malkhut',
    ],
  },
} as const;

function checkDay(omerDay: number): void {
  if (omerDay < 1 || omerDay > 49) {
    throw new RangeError(`Invalid Omer day ${omerDay}`);
  }
}

function getWeeks(omerDay: number): number[] {
  const weekNum: number = Math.floor((omerDay - 1) / 7) + 1;
  const daysWithinWeeks: number = omerDay % 7 || 7;
  return [weekNum, daysWithinWeeks];
}

function omerTodayIsEn(omerDay: number): string {
  const [weekNumber, daysWithinWeeks]: number[] = getWeeks(omerDay);

  const totalDaysStr: string = omerDay === 1 ? 'day' : 'days';
  let str = `Today is ${omerDay} ${totalDaysStr}`;

  if (weekNumber > 1 || omerDay === 7) {
    const day7: boolean = daysWithinWeeks === 7;
    const numWeeks: number = day7 ? weekNumber : weekNumber - 1;
    const weeksStr: string = numWeeks === 1 ? 'week' : 'weeks';
    str += `, which is ${numWeeks} ${weeksStr}`;
    if (!day7) {
      const daysStr: string = daysWithinWeeks === 1 ? 'day' : 'days';
      str += ` and ${daysWithinWeeks} ${daysStr}`;
    }
  }
  return str + ' of the Omer';
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
  'חֲמִשָּׁה',
  'שִׁשָּׁה',
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
const asar = 'עָשָׂר';

function omerTodayIsHe(omerDay: number): string {
  const ten: number = Math.floor(omerDay / 10);
  const one: number = omerDay % 10;
  let str = 'הַיּוֹם ';
  if (omerDay === 11) {
    str += 'אַחַד ' + asar;
  } else if (omerDay === 12) {
    str += 'שְׁנֵים ' + asar;
  } else if (12 < omerDay && omerDay < 20) {
    str += ones[one] + ' ' + asar;
  } else if (omerDay > 9) {
    str += ones[one];
    if (one) {
      str += ' ';
      str += ten === 3 ? 'וּ' : 'וְ';
    }
  }
  if (omerDay > 2) {
    if (omerDay > 20 || omerDay === 10 || omerDay === 20) {
      str += tens[ten];
    }
    if (omerDay < 11) {
      str += ones[one] + ' ' + yamim + ' ';
    } else {
      str += ' ' + yom + ' ';
    }
  } else if (omerDay === 1) {
    str += yomEchad + ' ';
  } else {
    // omer == 2
    str += shneiYamim + ' ';
  }
  if (omerDay > 6) {
    str = str.trim(); // remove trailing space before comma
    str += ', שֶׁהֵם ';
    const weeks: number = Math.floor(omerDay / 7);
    const days: number = omerDay % 7;
    if (weeks > 2) {
      str += ones[weeks] + ' ' + shavuot + ' ';
    } else if (weeks === 1) {
      str += 'שָׁבֽוּעַ' + ' ' + ones[1] + ' ';
    } else {
      // weeks == 2
      str += shnei + ' ' + shavuot + ' ';
    }
    if (days) {
      if (days === 2 || days === 3) {
        str += 'וּ';
      } else if (days === 5) {
        str += 'וַ';
      } else {
        str += 'וְ';
      }
      if (days > 2) {
        str += ones[days] + ' ' + yamim + ' ';
      } else if (days === 1) {
        str += yomEchad + ' ';
      } else {
        // days == 2
        str += shneiYamim + ' ';
      }
    }
  }
  str += 'לָעֽוֹמֶר';
  return str.normalize();
}

/** Represents a day 1-49 of counting the Omer from Pesach to Shavuot */
export class OmerEvent extends Event {
  private readonly weekNumber: number;
  private readonly daysWithinWeeks: number;
  readonly omer: number;
  emoji?: string;

  /**
   * @param date
   * @param omerDay
   */
  constructor(date: HDate, omerDay: number) {
    super(date, `Omer ${omerDay}`, flags.OMER_COUNT);
    checkDay(omerDay);
    this.weekNumber = Math.floor((omerDay - 1) / 7) + 1;
    this.daysWithinWeeks = omerDay % 7 || 7;
    this.omer = omerDay;
  }

  /**
   * Returns the sefira. For example, on day 8:
   *  * חֶֽסֶד שֶׁבִּגְבוּרָה
   *  * Chesed shebiGevurah
   *  * Lovingkindness within Might
   * @param lang `en` (English), `he` (Hebrew with nikud), or `translit` (Hebrew in Sephardic transliteration)
   * @returns a string such as `Lovingkindness within Might` or `חֶֽסֶד שֶׁבִּגְבוּרָה`
   */
  sefira(lang = 'en'): string {
    if (lang !== 'he' && lang !== 'translit') {
      lang = 'en';
    }
    const [weekNum, daysWithinWeeks]: number[] = getWeeks(this.omer);
    const config = sefirot[lang as OmerLang];
    const week = config.words[weekNum];
    const dayWithinWeek = config.words[daysWithinWeeks];
    const infix =
      weekNum === 2 || weekNum === 6 ? config.infix26 : config.infix;
    return (dayWithinWeek + ' ' + infix + week).normalize();
  }
  /**
   * @param [locale] Optional locale name (defaults to active locale).
   */
  render(locale?: string): string {
    locale = locale ?? Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const isHebrewLocale =
      locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
    const omer = this.omer;
    const nth = isHebrewLocale ? gematriya(omer) : Locale.ordinal(omer, locale);
    return nth + ' ' + Locale.gettext('day of the Omer', locale);
  }
  /**
   * Returns translation of "Omer day 22" without ordinal numbers.
   * @param [locale] Optional locale name (defaults to active locale).
   */
  renderBrief(locale?: string): string {
    return (
      Locale.gettext('Omer', locale) +
      ' ' +
      Locale.gettext('day', locale) +
      ' ' +
      this.omer
    );
  }
  /**
   * Returns an emoji number symbol with a circle, for example `㊲`
   *  from the “Enclosed CJK Letters and Months” block of the Unicode standard
   * @param omerDay the day of the omer, 1-49 inclusive
   * @returns a single Unicode character from `①` through `㊾`
   */
  getEmoji(): string {
    if (typeof this.emoji === 'string') return this.emoji;
    let codePoint: number;
    const omerDay = this.omer;
    if (omerDay <= 20) {
      codePoint = 9312 + omerDay - 1;
    } else if (omerDay <= 35) {
      // between 21 and 35 inclusive
      codePoint = 12881 + omerDay - 21;
    } else {
      // between 36 and 49 inclusive
      codePoint = 12977 + omerDay - 36;
    }
    return String.fromCodePoint(codePoint);
  }

  getWeeks(): number {
    const day7 = this.daysWithinWeeks === 7;
    return day7 ? this.weekNumber : this.weekNumber - 1;
  }

  getDaysWithinWeeks(): number {
    return this.daysWithinWeeks;
  }
  /**
   * Returns a sentence with that evening's omer count
   * @returns a string such as `Today is 10 days, which is 1 week and 3 days of the Omer`
   *  or `הַיוֹם עֲשָׂרָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר`
   */
  getTodayIs(locale: string): string {
    locale = locale ?? Locale.getLocaleName();
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const isHebrew = locale === 'he' || locale === 'he-x-nonikud';
    const str = isHebrew ? omerTodayIsHe(this.omer) : omerTodayIsEn(this.omer);
    if (locale === 'he-x-nonikud') {
      return Locale.hebrewStripNikkud(str);
    }
    return str;
  }

  url(): string {
    return `https://www.hebcal.com/omer/${this.getDate().getFullYear()}/${this.omer}`;
  }
}
