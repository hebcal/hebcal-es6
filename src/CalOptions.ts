import {HDate} from '@hebcal/hdate';
import {Location} from './location';

export type DailyLearningValue = boolean | number | string;

/**
 * Options to configure which events are returned
 */
export type CalOptions = {
  /**
   * latitude/longitude/tzid used for candle-lighting
   */
  location?: Location;
  /**
   * Gregorian or Hebrew year
   */
  year?: number;
  /**
   * to interpret year as Hebrew year
   */
  isHebrewYear?: boolean;
  /**
   * Gregorian or Hebrew month (to filter results to a single month)
   */
  month?: number | string;
  /**
   * generate calendar for multiple years (default 1)
   */
  numYears?: number;
  /**
   * use specific start date (requires end date)
   */
  start?: number | HDate | Date;
  /**
   * use specific end date (requires start date)
   */
  end?: number | HDate | Date;
  /**
   * calculate candle-lighting and havdalah times
   */
  candlelighting?: boolean;
  /**
   * minutes before sundown to light candles (default 18)
   */
  candleLightingMins?: number;
  /**
   * minutes after sundown for Havdalah (typical values are 42, 50, or 72).
   * If `undefined` (the default), calculate Havdalah according to Tzeit Hakochavim -
   * Nightfall (the point when 3 small stars are observable in the night time sky with
   * the naked eye). If `0`, Havdalah times are suppressed.
   */
  havdalahMins?: number;
  /**
   * degrees for solar depression for Havdalah.
   * Default is 8.5 degrees for 3 small stars. use 7.083 degrees for 3 medium-sized stars
   * (observed by Dr. Baruch (Berthold) Cohn in his luach published in France in 1899).
   * If `0`, Havdalah times are suppressed.
   */
  havdalahDeg?: number;
  /**
   * degrees for solar depression for end of fast days.
   * Default is 7.083 degrees for 3 medium-sized stars. Other commonly-used values include
   * 6.45 degrees, as calculated by Rabbi Yechiel Michel Tucazinsky.
   */
  fastEndDeg?: number;
  /**
   * use elevation for calculations (default `false`).
   * If `true`, use elevation to affect the calculation of all sunrise/sunset based zmanim.
   * Note: there are some zmanim such as degree-based zmanim that are driven by the amount
   * of light in the sky and are not impacted by elevation.
   * These zmanim intentionally do not support elevation adjustment.
   */
  useElevation?: boolean;
  /**
   * calculate parashah hashavua on Saturdays
   */
  sedrot?: boolean;
  /**
   * Israeli holiday and sedra schedule
   */
  il?: boolean;
  /**
   * suppress minor fasts
   */
  noMinorFast?: boolean;
  /**
   * suppress modern holidays
   */
  noModern?: boolean;
  /**
   * suppress Rosh Chodesh
   */
  noRoshChodesh?: boolean;
  /**
   * add Shabbat Mevarchim
   */
  shabbatMevarchim?: boolean;
  /**
   * suppress Special Shabbat
   */
  noSpecialShabbat?: boolean;
  /**
   * suppress regular holidays
   */
  noHolidays?: boolean;
  /**
   * include Days of the Omer
   */
  omer?: boolean;
  /**
   * include event announcing the molad
   */
  molad?: boolean;
  /**
   * use Ashkenazi transliterations for event titles (default Sephardi transliterations)
   */
  ashkenazi?: boolean;
  /**
   * translate event titles according to a locale
   * Default value is `en`, also built-in are `he` and `ashkenazi`.
   * Additional locales (such as `ru` or `fr`) are provided by the
   * {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
   */
  locale?: string;
  /**
   * print the Hebrew date for the entire date range
   */
  addHebrewDates?: boolean;
  /**
   * print the Hebrew date for dates with some events
   */
  addHebrewDatesForEvents?: boolean;
  /**
   * use bitmask from `flags` to filter events
   */
  mask?: number;
  /**
   * include Yom Kippur Katan (default `false`).
   * יוֹם כִּפּוּר קָטָן is a minor day of atonement occurring monthly on the day preceeding each Rosh Chodesh.
   * Yom Kippur Katan is omitted in Elul (on the day before Rosh Hashanah),
   * Tishrei (Yom Kippur has just passed), Kislev (due to Chanukah)
   * and Nisan (fasting not permitted during Nisan).
   * When Rosh Chodesh occurs on Shabbat or Sunday, Yom Kippur Katan is observed on the preceding Thursday.
   * See {@link https://en.wikipedia.org/wiki/Yom_Kippur_Katan#Practices Wikipedia Yom Kippur Katan practices}
   */
  yomKippurKatan?: boolean;
  /**
   * Whether to use 12-hour time (as opposed to 24-hour time).
   * Possible values are `true` and `false`; the default is locale dependent.
   */
  hour12?: boolean;
  /**
   * map of options to enable daily study calendars
   * such as `dafYomi`, `mishnaYomi`, `nachYomi` with value `true`. For `yerushalmi`
   * the value should be a `number` for edition (`1` for Vilna, `2` for Schottenstein).
   */
  dailyLearning?: {
    [x: string]: DailyLearningValue;
  };
};
