import {Event, flags} from './event';
import {CalOptions} from './CalOptions';
import {HDate, Locale, pad2, isLeapYear} from '@hebcal/hdate';
import {reformatTimeStr} from './reformatTimeStr';
import './locale'; // Adds Hebrew and Ashkenazic translations

/**
 * Represents a molad, the moment when the new moon is "born"
 */
export type MoladBase = {
  /** Hebrew date */
  readonly hdate: HDate;
  /** Hebrew year */
  readonly year: number;
  /** Hebrew month */
  readonly month: number;
  /** Day of Week (0=Sunday, 6=Saturday) */
  readonly dayOfWeek: number;
  /** hour of day (0-23) */
  readonly hour: number;
  /** minutes past hour (0-59) */
  readonly minutes: number;
  /** parts of a minute (0-17) */
  readonly chalakim: number;
};

/*
 * Includes code ported from KosherJava, copyright 2004 Eliyahu Hershfeld,
 * released under LGPL 2.1.
 */

/**
 * the Jewish epoch using the RD (Rata Die/Fixed Date or Reingold Dershowitz) day used in Calendrical Calculations.
 * Day 1 is January 1, 0001 of the Gregorian calendar
 */
const JEWISH_EPOCH: number = -1373429;

/** The number  of <em>chalakim</em> (18) in a minute. */
const CHALAKIM_PER_MINUTE: number = 18;

/** The number  of <em>chalakim</em> (1080) in an hour. */
const CHALAKIM_PER_HOUR: number = 1080;

/** The number of <em>chalakim</em> (25,920) in a 24-hour day. */
const CHALAKIM_PER_DAY: number = 25920; // 24 * 1080

/** The number  of <em>chalakim</em> in an average Jewish month. A month has 29 days, 12 hours and 793
 * <em>chalakim</em> (44 minutes and 3.3 seconds) for a total of 765,433 <em>chalakim</em> */
const CHALAKIM_PER_MONTH: number = 765433; // (29 * 24 + 12) * 1080 + 793

/**
 * Days from the beginning of Sunday till <em>molad BaHaRaD</em>. Calculated as 1 day, 5 hours and 204 <em>chalakim</em> =
 * (24 + 5) * 1080 + 204 = 31524
 */
const CHALAKIM_MOLAD_TOHU: number = 31524;

/**
 * Converts the NISSAN-based constants used by this class to numeric month starting from
 * TISHREI. This is required for <em>molad</em> calculations.
 */
function getJewishMonthOfYear(year: number, month: number): number {
  const leap: boolean = isLeapYear(year);
  return ((month + (leap ? 6 : 5)) % (leap ? 13 : 12)) + 1;
}

/**
 * Returns the number of <em>chalakim</em> (parts - 1080 to the hour) from
 * the original hypothetical <em>Molad Tohu</em> to the year and month
 * passed in.
 */
function getChalakimSinceMoladTohu(year: number, month: number): number {
  // Jewish lunar month = 29 days, 12 hours and 793 chalakim
  // chalakim since Molad Tohu BeHaRaD - 1 day, 5 hours and 204 chalakim
  const monthOfYear: number = getJewishMonthOfYear(year, month);
  const monthsElapsed: number =
    235 * Math.trunc((year - 1) / 19) + // Months in complete 19-year lunar (Metonic) cycles so far
    12 * ((year - 1) % 19) + // Regular months in this cycle
    Math.trunc((7 * ((year - 1) % 19) + 1) / 19) + // Leap months this cycle
    (monthOfYear - 1); // add elapsed months till the start of the molad of the month
  // return chalakim prior to BeHaRaD + number of chalakim since
  return CHALAKIM_MOLAD_TOHU + CHALAKIM_PER_MONTH * monthsElapsed;
}

/**
 * Returns the number of days from the Jewish epoch from the number of chalakim from the epoch passed in.
 * @param chalakim the number of <em>chalakim</em> since the beginning of Sunday prior to BaHaRaD
 * @return the number of days from the Jewish epoch
 */
function moladToAbsDate(chalakim: number): number {
  return Math.trunc(chalakim / CHALAKIM_PER_DAY) + JEWISH_EPOCH;
}

export function makeMolad(year: number, month: number): MoladBase {
  const chalakim = getChalakimSinceMoladTohu(year, month);
  const absDate = moladToAbsDate(chalakim);
  let hd = new HDate(absDate);
  const conjunctionDay: number = Math.trunc(chalakim / CHALAKIM_PER_DAY);
  const conjunctionParts: number = Math.trunc(
    chalakim - conjunctionDay * CHALAKIM_PER_DAY
  );

  let adjustedChalakim: number = conjunctionParts;
  let hour = Math.trunc(adjustedChalakim / CHALAKIM_PER_HOUR);
  adjustedChalakim = adjustedChalakim - hour * CHALAKIM_PER_HOUR;
  const minutes = Math.trunc(adjustedChalakim / CHALAKIM_PER_MINUTE);

  if (hour >= 6) {
    hd = hd.next();
  }
  hour = (hour + 18) % 24;

  const m: MoladBase = {
    hdate: hd,
    year,
    month,
    dayOfWeek: hd.getDay(),
    hour,
    minutes,
    chalakim: adjustedChalakim - minutes * CHALAKIM_PER_MINUTE,
  };

  return m;
}

const enDoW = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const heDayNames = [
  'רִאשׁוֹן',
  'שֵׁנִי',
  'שְׁלִישִׁי',
  'רְבִיעִי',
  'חֲמִישִׁי',
  'שִׁישִּׁי',
  'שַׁבָּת',
] as const;

const frDoW = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
] as const;
const night = 'בַּלַּ֥יְלָה';

function getDayNames(locale: string): readonly string[] {
  if (locale === 'he' || locale === 'he-x-nonikud' || locale === 'h') {
    return heDayNames;
  } else if (locale === 'fr') {
    return frDoW;
  }
  return enDoW;
}

function getHebrewTimeOfDay(hour: number): string {
  if (hour < 5) return night;
  else if (hour < 12) return 'בַּבֹּקֶר';
  else if (hour < 17) return 'בַּצׇּהֳרַיִים';
  else if (hour < 21) return 'בָּעֶרֶב';
  return night;
}

/**
 * Represents a molad, the moment when the new moon is "born"
 */
export class Molad {
  private readonly m: MoladBase;
  /**
   * Calculates the molad for a Hebrew month
   * @param year
   * @param month
   */
  constructor(year: number, month: number) {
    this.m = makeMolad(year, month);
  }
  /**
   */
  getYear(): number {
    return this.m.year;
  }
  /**
   */
  getMonth(): number {
    return this.m.month;
  }
  /**
   */
  getMonthName(): string {
    return HDate.getMonthName(this.m.month, this.m.year);
  }
  /**
   * @returns Day of Week (0=Sunday, 6=Saturday)
   */
  getDow(): number {
    return this.m.dayOfWeek;
  }
  /**
   * @returns hour of day (0-23)
   */
  getHour(): number {
    return this.m.hour;
  }
  /**
   * @returns minutes past hour (0-59)
   */
  getMinutes(): number {
    return this.m.minutes;
  }
  /**
   * @returns parts of a minute (0-17)
   */
  getChalakim(): number {
    return this.m.chalakim;
  }
  /**
   * @param [locale] Optional locale name (defaults to empty locale)
   * @param options
   */
  render(locale?: string, options?: CalOptions): string {
    locale = locale ?? 'en';
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
    }
    const isHebrewLocale =
      locale === 'he' || locale === 'he-x-nonikud' || locale === 'h';
    const monthName = Locale.gettext(this.getMonthName(), locale);
    const dayNames = getDayNames(locale);
    const dow = dayNames[this.getDow()];
    const minutes = this.getMinutes();
    const hour = this.getHour();
    const chalakim = this.getChalakim();
    const moladStr = Locale.gettext('Molad', locale);
    const minutesStr = Locale.lookupTranslation('min', locale) ?? 'minutes';
    const chalakimStr = Locale.gettext('chalakim', locale);
    const and = Locale.gettext('and', locale);
    if (isHebrewLocale) {
      const ampm = getHebrewTimeOfDay(hour);
      let result =
        `${moladStr} ${monthName} יִהְיֶה בַּיּוֹם ${dow} בשָׁבוּעַ, ` +
        `בְּשָׁעָה ${hour} ${ampm}, ` +
        `ו-${minutes} ${minutesStr}`;
      if (chalakim !== 0) {
        result += ` ו-${chalakim} ${chalakimStr}`;
      }
      if (locale === 'he-x-nonikud') {
        return Locale.hebrewStripNikkud(result);
      }
      return result;
    }
    const fmtTime = reformatTimeStr(`${hour}:${pad2(minutes)}`, 'pm', options);
    const month = monthName.replace(/'/g, '’');
    const result = `${moladStr} ${month}: ${dow}, ${fmtTime}`;
    if (chalakim === 0) {
      return result;
    }
    return result + ` ${and} ${chalakim} ${chalakimStr}`;
  }
}

/** Represents a Molad announcement on Shabbat Mevarchim */
export class MoladEvent extends Event {
  readonly molad: Molad;
  private readonly options: CalOptions;
  /**
   * @param date Hebrew date event occurs
   * @param hyear molad year
   * @param hmonth molad month
   * @param options
   */
  constructor(date: HDate, hyear: number, hmonth: number, options: CalOptions) {
    const m = new Molad(hyear, hmonth);
    const monthName = m.getMonthName();
    super(date, `Molad ${monthName} ${hyear}`, flags.MOLAD);
    this.molad = m;
    this.options = options;
  }
  /**
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    return this.molad.render(locale, this.options);
  }
}
