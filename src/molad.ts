import 'temporal-polyfill/global';
import {Event, flags} from './event';
import {CalOptions} from './CalOptions';
import {HDate, Locale, pad2} from '@hebcal/hdate';
import {reformatTimeStr} from './reformatTimeStr';
import {MoladBase, calculateMolad} from './moladBase';
import {getMoladAsDate} from './moladDate';
import './locale'; // Adds Hebrew and Ashkenazic translations

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
  private readonly year: number;
  private readonly month: number;
  private instant?: Temporal.ZonedDateTime;

  /**
   * Calculates the molad for a Hebrew month
   * @param year
   * @param month 1=NISSAN, 7=TISHREI
   */
  constructor(year: number, month: number) {
    this.m = calculateMolad(year, month);
    this.year = year;
    this.month = month;
  }
  /**
   * The exact Hebrew date of the molad, which often falls on the
   * 28th or 30th of the preceeding month, occasionally on the first of the
   * month, and in extremely rare circumstances the 27th of the month.
   * - Molad Shevat 5541 occured on 27 Tevet / 1781-01-24T19:57:20.170Z
   * - Molad Shevat 5788 will occur on 27 Tevet / 2028-01-26T19:07:03.504Z
   * - Molad Nissan 5866 will occur on 27 Adar II / 2106-04-03T21:08:46.837Z
   */
  getMoladDate(): HDate {
    return this.m.hdate;
  }
  /**
   * The year of the molad (as constructed)
   */
  getYear(): number {
    return this.year;
  }
  /**
   * The month (1=NISSAN, 7=TISHREI) as constructed
   */
  getMonth(): number {
    return this.month;
  }
  /**
   * Returns a transliterated string name of the molad's Hebrew month,
   * for example 'Elul' or 'Cheshvan'.
   */
  getMonthName(): string {
    return HDate.getMonthName(this.month, this.year);
  }
  /**
   * @returns Day of Week (0=Sunday, 6=Saturday)
   */
  getDow(): number {
    return this.m.hdate.getDay();
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
   * Returns the molad in Standard Time in Yerushalayim as a Temporal.ZonedDateTime.
   * This method subtracts 20.94 minutes (20 minutes and 56.496 seconds) from the computed time (Har Habayis with a longitude
   * of 35.2354&deg; is 5.2354&deg; away from the %15 timezone longitude) to get to standard time. This method
   * intentionally uses standard time and not daylight savings time.
   *
   * @return the Temporal.ZonedDateTime representing the moment of the molad in Yerushalayim standard time (GMT + 2)
   */
  getInstant(): Temporal.ZonedDateTime {
    this.instant ??= getMoladAsDate(this.m);
    return this.instant;
  }
  /**
   * Returns the earliest time of _Kiddush Levana_ calculated as 3 days after the molad. This method returns the time
   * even if it is during the day when _Kiddush Levana_ can't be said. Callers of this method should consider
   * displaying the next _tzais_ if the zman is between _alos_ and _tzais_.
   *
   * @return the Temporal.ZonedDateTime representing the moment 3 days after the molad.
   */
  getTchilasZmanKidushLevana3Days(): Temporal.ZonedDateTime {
    const zdt = this.getInstant();
    return zdt.add({hours: 72});
  }

  /**
   * Returns the earliest time of Kiddush Levana calculated as 7 days after the molad as mentioned by the <a
   * href="https://en.wikipedia.org/wiki/Yosef_Karo">Mechaber</a>. See the <a
   * href="https://en.wikipedia.org/wiki/Yoel_Sirkis">Bach's</a> opinion on this time. This method returns the time
   * even if it is during the day when _Kiddush Levana_ can't be said. Callers of this method should consider
   * displaying the next _tzais_ if the zman is between _alos_ and _tzais_.
   *
   * @return the Temporal.ZonedDateTime representing the moment 7 days after the molad.
   */
  getTchilasZmanKidushLevana7Days(): Temporal.ZonedDateTime {
    const zdt = this.getInstant();
    return zdt.add({hours: 168});
  }

  /**
   * Returns the latest time of Kiddush Levana according to the <a
   * href="https://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> opinion that it is calculated as
   * halfway between molad and molad. This adds half the 29 days, 12 hours and 793 chalakim time between molad and
   * molad (14 days, 18 hours, 22 minutes and 666 milliseconds) to the month's molad. This method returns the time
   * even if it is during the day when _Kiddush Levana_ can't be said. Callers of this method should consider
   * displaying _alos_ before this time if the zman is between _alos_ and _tzais_.
   *
   * @return the Temporal.ZonedDateTime representing the moment halfway between molad and molad.
   */
  getSofZmanKidushLevanaBetweenMoldos(): Temporal.ZonedDateTime {
    const zdt = this.getInstant();
    // add half the time between molad and molad (half of 29 days, 12 hours and 793 chalakim (44 minutes, 3.3
    // seconds), or 14 days, 18 hours, 22 minutes and 666 milliseconds). Add it as hours, not days, to avoid
    // DST/ST crossover issues.
    return zdt.add({
      hours: 24 * 14 + 18,
      minutes: 22,
      seconds: 1,
      milliseconds: 666,
    });
  }

  /**
   * Returns the latest time of Kiddush Levana calculated as 15 days after the molad. This is the opinion brought down
   * in the Shulchan Aruch (Orach Chaim 426). It should be noted that some opinions hold that the
   * <a href="https://en.wikipedia.org/wiki/Moses_Isserles">Rema</a> who brings down the opinion of the <a
   * href="https://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> of calculating
   * {@link Molad.getSofZmanKidushLevanaBetweenMoldos() half way between molad and mold} is of the opinion that Mechaber
   * agrees to his opinion. Also see the Aruch Hashulchan. For additional details on the subject, See Rabbi Dovid
   * Heber's very detailed writeup in Siman Daled (chapter 4) of <a
   * href="https://www.worldcat.org/oclc/461326125">Shaarei Zmanim</a>. This method returns the time even if it is during
   * the day when _Kiddush Levana_ can't be said. Callers of this method should consider displaying _alos_
   * before this time if the zman is between _alos_ and _tzais_.
   *
   * @return the Temporal.ZonedDateTime representing the moment 15 days after the molad.
   */
  getSofZmanKidushLevana15Days(): Temporal.ZonedDateTime {
    const zdt = this.getInstant();
    // 15 days after the molad. Add it as hours, not days, to avoid DST/ST crossover issues.
    return zdt.add({hours: 24 * 15});
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
