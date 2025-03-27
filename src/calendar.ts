import {Locale} from './locale';
import {abs2greg, HDate, months} from '@hebcal/hdate';
import {CalOptions, DailyLearningValue} from './CalOptions';
import {
  makeCandleEvent,
  makeFastStartEnd,
  makeWeekdayChanukahCandleLighting,
} from './candles';
import {Event, flags} from './event';
import {getStartAndEnd} from './getStartAndEnd';
import {HebrewDateEvent} from './HebrewDateEvent';
import {HolidayYearMap, getHolidaysForYear_} from './holidays';
import {ParshaEvent} from './ParshaEvent';
import {Sedra, getSedra} from './sedra';
import {TimedEvent, HavdalahEvent} from './TimedEvent';
import {DailyLearning} from './DailyLearning';
import {HolidayEvent} from './HolidayEvent';
import {MevarchimChodeshEvent} from './MevarchimChodeshEvent';
import {MoladEvent, Molad} from './molad';
import {OmerEvent} from './omer';
import {Zmanim} from './zmanim';
import {Location} from './location';

/**
 * Calculates holidays and other Hebrew calendar events based on {@link CalOptions}.
 *
 * Each holiday is represented by an {@link Event} object which includes a date,
 * a description, flags and optional attributes.
 * If given no options, returns holidays for the Diaspora for the current Gregorian year.
 *
 * The date range returned by this function can be controlled by:
 * * `options.year` - Gregorian (e.g. 1993) or Hebrew year (e.g. 5749)
 * * `options.isHebrewYear` - to interpret `year` as Hebrew year
 * * `options.numYears` - generate calendar for multiple years (default 1)
 * * `options.month` - Gregorian or Hebrew month (to filter results to a single month)
 *
 * Alternatively, specify start and end days with `Date` or {@link HDate} instances:
 * * `options.start` - use specific start date (requires `end` date)
 * * `options.end` - use specific end date (requires `start` date)
 *
 * Unless `options.noHolidays == true`, default holidays include:
 * * Major holidays - Rosh Hashana, Yom Kippur, Pesach, Sukkot, etc.
 * * Minor holidays - Purim, Chanukah, Tu BiShvat, Lag BaOmer, etc.
 * * Minor fasts - Ta'anit Esther, Tzom Gedaliah, etc. (unless `options.noMinorFast`)
 * * Special Shabbatot - Shabbat Shekalim, Zachor, etc. (unless `options.noSpecialShabbat`)
 * * Modern Holidays - Yom HaShoah, Yom HaAtzma'ut, etc. (unless `options.noModern`)
 * * Rosh Chodesh (unless `options.noRoshChodesh`)
 *
 * Holiday and Torah reading schedules differ between Israel and the Disapora.
 * Set `options.il=true` to use the Israeli schedule.
 *
 * Additional non-default event types can be specified:
 * * Parashat HaShavua - weekly Torah Reading on Saturdays (`options.sedrot`)
 * * Counting of the Omer (`options.omer`)
 * * Shabbat Mevarchim HaChodesh on Saturday before Rosh Chodesh (`options.shabbatMevarchim`)
 * * Molad announcement on Saturday before Rosh Chodesh (`options.molad`)
 * * Yom Kippur Katan (`options.yomKippurKatan`)
 * * Yizkor (`options.yizkor`)
 *
 * Daily Study of texts are supported by the
 * {@link https://github.com/hebcal/hebcal-learning @hebcal/learning} package,
 * for example:
 * * Babylonian Talmud Daf Yomi (`options.dailyLearning.dafYomi`)
 * * Jerusalem Talmud (Yerushalmi) Yomi (`options.dailyLearning.yerushalmi`)
 * * Mishna Yomi (`options.dailyLearning.mishnaYomi`)
 * * Nach Yomi (`options.dailyLearning.nachYomi`)
 *
 * Candle-lighting and Havdalah times are approximated using latitude and longitude
 * specified by the {@link Location} class. The `Location` class contains a small
 * database of cities with their associated geographic information and time-zone information.
 * If you ever have any doubts about Hebcal's times, consult your local halachic authority.
 * If you enter geographic coordinates above the arctic circle or antarctic circle,
 * the times are guaranteed to be wrong.
 *
 * To add candle-lighting options, set `options.candlelighting=true` and set
 * `options.location` to an instance of `Location`. By default, candle lighting
 * time is 18 minutes before sundown (40 minutes for Jerusalem,
 * 30 minutes for Haifa and Zikhron Ya'akov) and Havdalah is
 * calculated according to Tzeit Hakochavim - Nightfall (the point when 3 small stars
 * are observable in the night time sky with the naked eye). The default Havdalah
 * option (Tzeit Hakochavim) is calculated when the sun is 8.5° below the horizon.
 * These defaults can be changed using these options:
 * * `options.candleLightingMins` - minutes before sundown to light candles
 * * `options.havdalahMins` - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
 *    Havdalah times are suppressed when `options.havdalahMins=0`.
 * * `options.havdalahDeg` - degrees for solar depression for Havdalah.
 *    Default is 8.5 degrees for 3 small stars. Use 7.083 degrees for 3 medium-sized stars.
 *    Havdalah times are suppressed when `options.havdalahDeg=0`.
 *
 * If both `options.candlelighting=true` and `options.location` is specified,
 * Chanukah candle-lighting times and minor fast start/end times will also be generated.
 * Chanukah candle-lighting is at Bein HaShmashos (13.5 minutes before
 * the sun is 7.083° below the horizon in the evening)
 * on weekdays, at regular candle-lighting time on Fridays, and at regular Havdalah time on
 * Saturday night (see above).
 *
 * Minor fasts begin at Alot HaShachar (sun is 16.1° below the horizon in the morning) and
 * end when 3 medium-sized stars are observable in the night sky (sun is 7.083° below the horizon
 * in the evening).
 *
 * Two options also exist for generating an Event with the Hebrew date:
 * * `options.addHebrewDates` - print the Hebrew date for the entire date range
 * * `options.addHebrewDatesForEvents` - print the Hebrew date for dates with some events
 *
 * Lastly, translation and transliteration of event titles is controlled by
 * `options.locale` and the {@link Locale} API.
 * `@hebcal/core` supports three locales by default:
 * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
 * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
 * * `he` - Hebrew (e.g. "שַׁבָּת")
 *
 * Additional locales (such as `ru` or `fr`) are supported by the
 * {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
 *
 * @example
 * import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';
 * const options: CalOptions = {
 *   year: 1981,
 *   isHebrewYear: false,
 *   candlelighting: true,
 *   location: Location.lookup('San Francisco'),
 *   sedrot: true,
 *   omer: true,
 * };
 * const events = HebrewCalendar.calendar(options);
 * for (const ev of events) {
 *   const hd = ev.getDate();
 *   const date = hd.greg();
 *   console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
 * }
 */
export function calendar(options: CalOptions = {}): Event[] {
  options = {...options}; // so we can modify freely
  checkCandleOptions(options);
  const location = (options.location = options.location || defaultLocation);
  const il = (options.il = options.il || location.getIsrael() || false);
  const hasUserMask = typeof options.mask === 'number';
  options.mask = getMaskFromOptions(options);
  if (options.ashkenazi || options.locale) {
    if (options.locale && typeof options.locale !== 'string') {
      throw new TypeError(`Invalid options.locale: ${options.locale}`);
    }
    const locale = options.ashkenazi ? 'ashkenazi' : (options.locale as string);
    const translationObj = Locale.useLocale(locale);
    if (!translationObj) {
      throw new TypeError(
        `Locale '${locale}' not found; did you forget to import @hebcal/locales?`
      );
    }
  } else {
    Locale.useLocale('en');
  }

  const evts: Event[] = [];
  let sedra: Sedra | undefined;
  let holidaysYear: HolidayYearMap | undefined;
  let beginOmer = -1;
  let endOmer = -1;
  let currentYear = -1;
  const startAndEnd = getStartAndEnd(options);
  warnUnrecognizedOptions(options);
  const startAbs = startAndEnd[0];
  const endAbs = startAndEnd[1];
  const startGreg = abs2greg(startAbs);
  if (startGreg.getFullYear() < 100) {
    options.candlelighting = false;
  }
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    const hyear = hd.getFullYear();
    if (hyear !== currentYear) {
      currentYear = hyear;
      holidaysYear = getHolidaysForYear_(currentYear);
      if (options.sedrot) {
        sedra = getSedra(currentYear, il);
      }
      if (options.omer) {
        beginOmer = HDate.hebrew2abs(currentYear, NISAN, 16);
        endOmer = HDate.hebrew2abs(currentYear, SIVAN, 5);
      }
    }
    const prevEventsLength = evts.length;
    const dow = hd.getDay();
    const isFriday = dow === FRI;
    const isSaturday = dow === SAT;
    let candlesEv: TimedEvent | undefined;
    const holidays = holidaysYear!.get(hd.toString()) || [];
    for (const ev of holidays) {
      candlesEv = appendHolidayAndRelated(
        candlesEv,
        evts,
        ev,
        options,
        isFriday,
        isSaturday,
        hasUserMask
      );
    }
    if (options.sedrot && isSaturday) {
      const parsha0 = sedra!.lookup(abs);
      if (!parsha0.chag) {
        evts.push(new ParshaEvent(hd, parsha0.parsha, il, parsha0.num));
      }
    }
    if (options.yizkor) {
      const mm = hd.getMonth();
      const dd = hd.getDate();
      if (
        (mm === months.TISHREI && (dd === 10 || dd === 22)) ||
        (mm === NISAN && dd === (il ? 21 : 22)) ||
        (mm === SIVAN && dd === (il ? 6 : 7))
      ) {
        const linkedEvent = holidays.filter(ev => ev.observedIn(il))[0];
        const ev = new Event(hd, 'Yizkor', flags.YIZKOR, {
          emoji: '🕯️',
          linkedEvent,
        });
        evts.push(ev);
      }
    }
    const dailyLearning = options.dailyLearning;
    let numDailyLearning = 0;
    if (typeof dailyLearning === 'object') {
      const events = makeDailyLearning(hd, dailyLearning, il);
      numDailyLearning = events.length;
      if (numDailyLearning) {
        evts.push(...events);
      }
    }
    if (options.omer && abs >= beginOmer && abs <= endOmer) {
      const omer = abs - beginOmer + 1;
      const omerEv = makeOmerEvent(hd, omer, options);
      evts.push(omerEv);
    }
    if (isSaturday && (options.molad || options.shabbatMevarchim)) {
      const events = makeMoladAndMevarchimChodesh(hd, options);
      evts.push(...events);
    }
    if (!candlesEv && options.candlelighting && (isFriday || isSaturday)) {
      candlesEv = makeCandleEvent(undefined, hd, options, isFriday, isSaturday);
      if (isFriday && candlesEv && sedra) {
        const parsha = sedra.lookup(abs);
        const pe = new ParshaEvent(hd.next(), parsha.parsha, il, parsha.num);
        candlesEv.memo = pe.render(options.locale);
      }
    }
    // suppress Havdalah when options.havdalahMins=0 or options.havdalahDeg=0
    if (
      candlesEv instanceof HavdalahEvent &&
      (options.havdalahMins === 0 || options.havdalahDeg === 0)
    ) {
      candlesEv = undefined;
    }
    if (candlesEv) {
      evts.push(candlesEv);
    }
    if (
      options.addHebrewDates ||
      (options.addHebrewDatesForEvents &&
        prevEventsLength !== evts.length - numDailyLearning)
    ) {
      const e2 = new HebrewDateEvent(hd);
      if (prevEventsLength === evts.length) {
        evts.push(e2);
      } else {
        evts.splice(prevEventsLength, 0, e2);
      }
    }
  }
  return evts;
}

const FRI = 5;
const SAT = 6;

const NISAN = months.NISAN;
const SIVAN = months.SIVAN;
const ELUL = months.ELUL;

const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
const CHUL_ONLY = flags.CHUL_ONLY;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MINOR_FAST = flags.MINOR_FAST;
const SPECIAL_SHABBAT = flags.SPECIAL_SHABBAT;
const MODERN_HOLIDAY = flags.MODERN_HOLIDAY;
const MAJOR_FAST = flags.MAJOR_FAST;
const ROSH_CHODESH = flags.ROSH_CHODESH;
const PARSHA_HASHAVUA = flags.PARSHA_HASHAVUA;
const DAF_YOMI = flags.DAF_YOMI;
const MISHNA_YOMI = flags.MISHNA_YOMI;
const NACH_YOMI = flags.NACH_YOMI;
const YERUSHALMI_YOMI = flags.YERUSHALMI_YOMI;
const OMER_COUNT = flags.OMER_COUNT;
const SHABBAT_MEVARCHIM = flags.SHABBAT_MEVARCHIM;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;
const YOM_KIPPUR_KATAN = flags.YOM_KIPPUR_KATAN;
const YIZKOR = flags.YIZKOR;

type StringIntMap = Record<string, number>;

const unrecognizedAlreadyWarned = new Set<string>();
const RECOGNIZED_OPTIONS: StringIntMap = {
  location: 1,
  year: 1,
  isHebrewYear: 1,
  month: 1,
  numYears: 1,
  start: 1,
  end: 1,
  candlelighting: 1,
  candleLightingMins: 1,
  havdalahMins: 1,
  havdalahDeg: 1,
  fastEndDeg: 1,
  sedrot: 1,
  il: 1,
  noMinorFast: 1,
  noModern: 1,
  shabbatMevarchim: 1,
  noRoshChodesh: 1,
  noSpecialShabbat: 1,
  noHolidays: 1,
  omer: 1,
  molad: 1,
  ashkenazi: 1,
  locale: 1,
  addHebrewDates: 1,
  addHebrewDatesForEvents: 1,
  mask: 1,
  yomKippurKatan: 1,
  hour12: 1,
  dailyLearning: 1,
  useElevation: 1,
  yizkor: 1,
} as const satisfies Record<keyof CalOptions, 1>;

/**
 * @private
 */
function warnUnrecognizedOptions(options: CalOptions) {
  for (const k of Object.keys(options)) {
    if (
      typeof RECOGNIZED_OPTIONS[k] === 'undefined' &&
      !unrecognizedAlreadyWarned.has(k)
    ) {
      console.warn(`Ignoring unrecognized HebrewCalendar option: ${k}`);
      unrecognizedAlreadyWarned.add(k);
    }
  }
  if (options.dailyLearning) {
    for (const k of Object.keys(options.dailyLearning)) {
      if (!unrecognizedAlreadyWarned.has(k) && !DailyLearning.has(k)) {
        console.warn(`Ignoring unrecognized DailyLearning calendar: ${k}`);
        unrecognizedAlreadyWarned.add(k);
      }
    }
  }
}

const israelCityOffset: StringIntMap = {
  Jerusalem: 40,
  Haifa: 30,
  "Zikhron Ya'aqov": 30,
  "Zikhron Ya'akov": 30,
  'Zikhron Yaakov': 30,
  "Zichron Ya'akov": 30,
  'Zichron Yaakov': 30,
} as const;

const geoIdCandleOffset: StringIntMap = {
  '281184': 40, // Jerusalem
  '294801': 30, // Haifa
  '293067': 30, // Zikhron Yaakov
} as const;

/**
 * @private
 * @constant
 * This calculation is based on the position of the sun 36 minutes after sunset in Jerusalem
 * around the equinox / equilux, which is 8.5° below geometric zenith.
 * The Ohr Meir considers this the time that 3 small stars are visible,
 * which is later than the required 3 medium stars.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ZmanimCalendar.html#ZENITH_8_POINT_5}
 */
const TZEIT_3SMALL_STARS = 8.5;

/**
 * @private
 * @constant
 * This calculation is based on observation of 3 medium sized stars by Dr. Baruch Cohen
 * in his calendar published in in 1899 in Strasbourg, France.
 * This calculates to 7.0833333° below geometric zenith.
 * @see {https://kosherjava.com/zmanim/docs/api/com/kosherjava/zmanim/ComplexZmanimCalendar.html#ZENITH_7_POINT_083}
 */
const TZEIT_3MEDIUM_STARS = 7.0833333;

/**
 * Modifies options in-place
 * @private
 */
function checkCandleOptions(options: CalOptions) {
  if (!options.candlelighting) {
    return;
  }
  const location = options.location;
  if (typeof location === 'undefined' || !(location instanceof Location)) {
    throw new TypeError(
      'options.candlelighting requires valid options.location'
    );
  }
  if (
    typeof options.havdalahMins === 'number' &&
    typeof options.havdalahDeg === 'number'
  ) {
    throw new TypeError(
      'options.havdalahMins and options.havdalahDeg are mutually exclusive'
    );
  }

  const min0 = options.candleLightingMins;
  let min = typeof min0 === 'number' && !isNaN(min0) ? Math.trunc(min0) : 18;
  if (location.getIsrael() && Math.abs(min) === 18) {
    min = overrideIsraelCandleMins(location, min);
  }
  options.candleLightingMins = -1 * Math.abs(min);

  if (typeof options.havdalahMins === 'number') {
    options.havdalahMins = Math.trunc(Math.abs(options.havdalahMins));
  } else if (typeof options.havdalahDeg === 'number') {
    options.havdalahDeg = Math.abs(options.havdalahDeg);
  } else {
    options.havdalahDeg = TZEIT_3SMALL_STARS;
  }
  if (typeof options.fastEndDeg !== 'number') {
    options.fastEndDeg = TZEIT_3MEDIUM_STARS;
  }
}

function overrideIsraelCandleMins(location: Location, min: number) {
  const geoid = location.getGeoId();
  if (geoid) {
    const offset = geoIdCandleOffset[geoid];
    if (typeof offset === 'number') {
      return offset;
    }
  }
  const shortName = location.getShortName();
  if (shortName) {
    const offset = israelCityOffset[shortName];
    if (typeof offset === 'number') {
      return offset;
    }
  }
  return min;
}

/**
 * Mask to filter Holiday array
 * @private
 */
function getMaskFromOptions(options: CalOptions): number {
  if (typeof options.mask === 'number') {
    return setOptionsFromMask(options);
  }
  const il = options.il || options.location?.getIsrael() || false;
  let mask = 0;

  // default options
  if (!options.noHolidays) {
    mask |=
      ROSH_CHODESH |
      YOM_TOV_ENDS |
      MINOR_FAST |
      SPECIAL_SHABBAT |
      MODERN_HOLIDAY |
      MAJOR_FAST |
      MINOR_HOLIDAY |
      EREV |
      CHOL_HAMOED |
      LIGHT_CANDLES |
      LIGHT_CANDLES_TZEIS |
      CHANUKAH_CANDLES;
  }
  if (options.candlelighting) {
    mask |= LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | YOM_TOV_ENDS;
  }
  // suppression of defaults
  if (options.noRoshChodesh) {
    mask &= ~ROSH_CHODESH;
  }
  if (options.noModern) {
    mask &= ~MODERN_HOLIDAY;
  }
  if (options.noMinorFast) {
    mask &= ~MINOR_FAST;
  }
  if (options.noSpecialShabbat) {
    mask &= ~SPECIAL_SHABBAT;
    mask &= ~SHABBAT_MEVARCHIM;
  }
  if (il) {
    mask |= IL_ONLY;
  } else {
    mask |= CHUL_ONLY;
  }
  // non-default options
  if (options.sedrot) {
    mask |= PARSHA_HASHAVUA;
  }
  if (options.omer) {
    mask |= OMER_COUNT;
  }
  if (options.shabbatMevarchim) {
    mask |= SHABBAT_MEVARCHIM;
  }
  if (options.yomKippurKatan) {
    mask |= YOM_KIPPUR_KATAN;
  }
  if (options.yizkor) {
    mask |= YIZKOR;
  }
  if (options.dailyLearning) {
    const dailyLearning = options.dailyLearning;
    if (dailyLearning.dafYomi) {
      mask |= DAF_YOMI;
    }
    if (dailyLearning.mishnaYomi) {
      mask |= MISHNA_YOMI;
    }
    if (dailyLearning.nachYomi) {
      mask |= NACH_YOMI;
    }
    if (dailyLearning.yerushalmi) {
      mask |= YERUSHALMI_YOMI;
    }
  }

  return mask;
}

const MASK_LIGHT_CANDLES =
  LIGHT_CANDLES | LIGHT_CANDLES_TZEIS | CHANUKAH_CANDLES | YOM_TOV_ENDS;

const defaultLocation = new Location(0, 0, false, 'UTC');

/**
 * @private
 */
function setOptionsFromMask(options: CalOptions): number {
  const m = options.mask || 0;
  if (m & ROSH_CHODESH) delete options.noRoshChodesh;
  if (m & MODERN_HOLIDAY) delete options.noModern;
  if (m & MINOR_FAST) delete options.noMinorFast;
  if (m & SPECIAL_SHABBAT) delete options.noSpecialShabbat;
  if (m & PARSHA_HASHAVUA) options.sedrot = true;
  if (m & (DAF_YOMI | MISHNA_YOMI | NACH_YOMI | YERUSHALMI_YOMI)) {
    options.dailyLearning = options.dailyLearning || {};
    if (m & DAF_YOMI) {
      options.dailyLearning.dafYomi = true;
    }
    if (m & MISHNA_YOMI) {
      options.dailyLearning.mishnaYomi = true;
    }
    if (m & NACH_YOMI) {
      options.dailyLearning.nachYomi = true;
    }
    if (m & YERUSHALMI_YOMI) {
      options.dailyLearning.yerushalmi = 1;
    }
  }
  if (m & OMER_COUNT) options.omer = true;
  if (m & SHABBAT_MEVARCHIM) options.shabbatMevarchim = true;
  if (m & YOM_KIPPUR_KATAN) options.yomKippurKatan = true;
  if (m & YIZKOR) options.yizkor = true;
  return m;
}

/**
 * Appends the Event `ev` to the `events` array. Also may add related
 * timed events like candle-lighting or fast start/end
 * @private
 */
function appendHolidayAndRelated(
  candlesEv: TimedEvent | undefined,
  events: Event[],
  ev: HolidayEvent,
  options: CalOptions,
  isFriday: boolean,
  isSaturday: boolean,
  hasUserMask: boolean
): TimedEvent | undefined {
  const il = options.il || false;
  if (!ev.observedIn(il)) {
    return candlesEv; // holiday isn't observed here; bail out early
  }
  const eFlags = ev.getFlags();
  if (
    (!options.yomKippurKatan && eFlags & YOM_KIPPUR_KATAN) ||
    (options.noModern && eFlags & MODERN_HOLIDAY)
  ) {
    return candlesEv; // bail out early
  }
  const isMajorFast = Boolean(eFlags & MAJOR_FAST);
  const isMinorFast = Boolean(eFlags & MINOR_FAST);
  let fastEv;
  if (
    options.candlelighting &&
    (isMajorFast || isMinorFast) &&
    ev.getDesc() !== 'Yom Kippur'
  ) {
    ev = fastEv = makeFastStartEnd(ev, options);
    if (
      fastEv.startEvent &&
      (isMajorFast || (isMinorFast && !options.noMinorFast))
    ) {
      events.push(fastEv.startEvent);
    }
  }
  if (eFlags & Number(options.mask) || (!eFlags && !hasUserMask)) {
    if (options.candlelighting && eFlags & MASK_LIGHT_CANDLES) {
      const hd = ev.getDate();
      candlesEv = makeCandleEvent(ev, hd, options, isFriday, isSaturday);
      if (eFlags & CHANUKAH_CANDLES && candlesEv && !options.noHolidays) {
        // Replace Chanukah event with a clone that includes candle lighting time.
        // For clarity, allow a "duplicate" candle lighting event to remain for Shabbat
        const chanukahEv = makeWeekdayChanukahCandleLighting(ev, hd, options);
        if (chanukahEv) {
          if (isFriday || isSaturday) {
            chanukahEv.eventTime = candlesEv.eventTime;
            chanukahEv.eventTimeStr = candlesEv.eventTimeStr;
          }
          ev = chanukahEv;
        }
        candlesEv = undefined;
      }
    }
    if (
      !options.noHolidays ||
      (options.yomKippurKatan && eFlags & YOM_KIPPUR_KATAN)
    ) {
      events.push(ev); // the original event itself
    }
  }
  if (
    (isMajorFast || (isMinorFast && !options.noMinorFast)) &&
    fastEv &&
    fastEv.endEvent
  ) {
    events.push(fastEv.endEvent);
  }
  return candlesEv;
}

function makeMoladAndMevarchimChodesh(hd: HDate, options: CalOptions): Event[] {
  const evts: Event[] = [];
  const hmonth = hd.getMonth();
  const hdate = hd.getDate();
  if (hmonth !== ELUL && hdate >= 23 && hdate <= 29) {
    const hyear = hd.getFullYear();
    const monNext = hmonth === HDate.monthsInYear(hyear) ? NISAN : hmonth + 1;
    if (options.molad) {
      evts.push(new MoladEvent(hd, hyear, monNext, options));
    }
    if (options.shabbatMevarchim) {
      const nextMonthName = HDate.getMonthName(monNext, hyear);
      const molad = new Molad(hyear, monNext);
      const memo = molad.render(options.locale || 'en', options);
      evts.push(
        new MevarchimChodeshEvent(hd, nextMonthName, memo, options.locale)
      );
    }
  }
  return evts;
}

function dailyLearningName(key: string, val: DailyLearningValue): string {
  if (key === 'yerushalmi') {
    return val === 2 ? 'yerushalmi-schottenstein' : 'yerushalmi-vilna';
  }
  return key;
}

function makeDailyLearning(
  hd: HDate,
  dailyLearning: Record<string, DailyLearningValue>,
  il: boolean
): Event[] {
  const evts: Event[] = [];
  for (const [key, val] of Object.entries(dailyLearning)) {
    if (val) {
      const name = dailyLearningName(key, val);
      const learningEv = DailyLearning.lookup(name, hd, il);
      if (learningEv) {
        evts.push(learningEv);
      }
    }
  }
  return evts;
}

function makeOmerEvent(hd: HDate, omerDay: number, options: CalOptions) {
  const omerEv = new OmerEvent(hd, omerDay);
  if (options.candlelighting) {
    const location = options.location!;
    const zmanim = new Zmanim(location, hd.prev(), false);
    const tzeit = zmanim.tzeit(7.0833);
    if (!isNaN(tzeit.getTime())) {
      omerEv.alarm = tzeit;
    }
  }
  return omerEv;
}
