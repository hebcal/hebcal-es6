import {HDate, months} from '@hebcal/hdate';
import {flags} from './event.js';
import {HolidayEvent} from './HolidayEvent.js';
import {holidayDesc as hdesc} from './staticHolidays.js';

const enum Day {
  SUN = 0,
  TUE = 2,
  THU = 4,
  FRI = 5,
  SAT = 6,
}

const {NISAN, IYYAR, CHESHVAN} = months;

/**
 * Yom HaShoah first observed in 1951.
 * When the actual date of Yom Hashoah falls on a Friday, the
 * state of Israel observes Yom Hashoah on the preceding
 * Thursday. When it falls on a Sunday, Yom Hashoah is observed
 * on the following Monday.
 * http://www.ushmm.org/remembrance/dor/calendar/
 */
function dateYomHaShoah(year: number): HDate | null {
  if (year < 5711) {
    return null;
  }
  let nisan27dt = new HDate(27, NISAN, year);
  if (nisan27dt.getDay() === Day.FRI) {
    nisan27dt = new HDate(26, NISAN, year);
  } else if (nisan27dt.getDay() === Day.SUN) {
    nisan27dt = new HDate(28, NISAN, year);
  }
  return nisan27dt;
}

/**
 * Yom HaAtzma'ut only celebrated after 1948
 * @internal
 */
export function dateYomHaZikaron(year: number): HDate | null {
  if (year < 5708) {
    return null;
  }
  let day: number;
  const pesach = new HDate(15, NISAN, year);
  const pdow = pesach.getDay();
  if (pdow === Day.SUN) {
    day = 2;
  } else if (pdow === Day.SAT) {
    day = 3;
  } else if (year < 5764) {
    day = 4;
  } else if (pdow === Day.TUE) {
    day = 5;
  } else {
    day = 4;
  }
  return new HDate(day, IYYAR, year);
}

/**
 * How to move a holiday that would otherwise fall on Shabbat (or Friday).
 * - `friSatToThu`: Friday or Shabbat moves back to the preceding Thursday
 * - `friSatToSun`: Friday or Shabbat moves forward to Sunday
 * - `satToSun`: Shabbat moves forward to Sunday
 */
type Postponement = 'friSatToThu' | 'friSatToSun' | 'satToSun';

interface ModernHoliday {
  readonly firstYear: number;
  readonly mm: number; // This should be an enum `Month` eventually
  readonly dd: number;
  readonly desc: string;
  /** Observed outside Israel too */
  readonly chul?: boolean;
  readonly suppressEmoji?: boolean;
  readonly postpone?: Postponement;
}

function postpone(hd: HDate, rule: Postponement | undefined): HDate {
  const dow = hd.getDay();
  switch (rule) {
    case 'friSatToThu':
      return dow === Day.FRI || dow === Day.SAT ? hd.onOrBefore(Day.THU) : hd;
    case 'friSatToSun':
      if (dow === Day.FRI) return hd.next().next();
      return dow === Day.SAT ? hd.next() : hd;
    case 'satToSun':
      return dow === Day.SAT ? hd.next() : hd;
    case undefined:
      return hd;
    default:
      return rule satisfies never;
  }
}

const staticModernHolidays: readonly ModernHoliday[] = [
  {
    firstYear: 5727,
    mm: IYYAR,
    dd: 28,
    desc: hdesc.YOM_YERUSHALAYIM,
    chul: true,
  },
  {
    firstYear: 5737,
    mm: months.KISLEV,
    dd: 6,
    desc: hdesc.BEN_GURION_DAY,
    postpone: 'friSatToSun',
  },
  {firstYear: 5750, mm: months.SHVAT, dd: 30, desc: hdesc.FAMILY_DAY},
  {
    firstYear: 5758,
    mm: CHESHVAN,
    dd: 12,
    desc: hdesc.YITZHAK_RABIN_MEMORIAL_DAY,
    postpone: 'friSatToThu',
  },
  {
    firstYear: 5764,
    mm: IYYAR,
    dd: 10,
    desc: hdesc.HERZL_DAY,
    postpone: 'satToSun',
  },
  {
    firstYear: 5765,
    mm: months.TAMUZ,
    dd: 29,
    desc: hdesc.JABOTINSKY_DAY,
    postpone: 'satToSun',
  },
  {
    firstYear: 5769,
    mm: CHESHVAN,
    dd: 29,
    desc: hdesc.SIGD,
    chul: true,
    suppressEmoji: true,
    postpone: 'friSatToThu',
  },
  {firstYear: 5777, mm: NISAN, dd: 10, desc: hdesc.YOM_HAALIYAH, chul: true},
  {
    firstYear: 5777,
    mm: CHESHVAN,
    dd: 7,
    desc: hdesc.YOM_HAALIYAH_SCHOOL_OBSERVANCE,
  },
  // https://www.gov.il/he/departments/policies/2012_des5234
  {
    firstYear: 5773,
    mm: months.TEVET,
    dd: 21,
    desc: hdesc.HEBREW_LANGUAGE_DAY,
    postpone: 'friSatToThu',
  },
  /**
   * https://fs.knesset.gov.il/25/law/25_lsr_14184773.pdf
   * (Published in Sefer HaChukim No. 3567 on 8 Av 5786 / July 22, 2026)
   */
  {
    firstYear: 5786,
    mm: months.TISHREI,
    dd: 24,
    desc: hdesc.SWORDS_OF_IRON_WAR_MEMORIAL,
    postpone: 'satToSun',
  },
];

const {MODERN_HOLIDAY, IL_ONLY} = flags;
const ISRAEL_FLAG = '🇮🇱';
const emojiIsraelFlag = {emoji: ISRAEL_FLAG} as const;

/**
 * Generates the modern Israeli holidays and memorial days for a Hebrew year.
 * @internal
 * @param year Hebrew year
 */
export function modernHolidaysForYear(year: number): HolidayEvent[] {
  const events: HolidayEvent[] = [];
  const nisan27dt = dateYomHaShoah(year);
  if (nisan27dt) {
    events.push(new HolidayEvent(nisan27dt, hdesc.YOM_HASHOAH, MODERN_HOLIDAY));
  }

  const yomHaZikaronDt = dateYomHaZikaron(year);
  if (yomHaZikaronDt) {
    events.push(
      new HolidayEvent(
        yomHaZikaronDt,
        hdesc.YOM_HAZIKARON,
        MODERN_HOLIDAY,
        emojiIsraelFlag
      ),
      new HolidayEvent(
        yomHaZikaronDt.next(),
        hdesc.YOM_HAATZMA_UT,
        MODERN_HOLIDAY,
        emojiIsraelFlag
      )
    );
  }

  for (const h of staticModernHolidays) {
    if (year >= h.firstYear) {
      const hd = postpone(new HDate(h.dd, h.mm, year), h.postpone);
      const mask = h.chul ? MODERN_HOLIDAY : MODERN_HOLIDAY | IL_ONLY;
      const ev = new HolidayEvent(hd, h.desc, mask);
      if (!h.suppressEmoji) {
        ev.emoji = ISRAEL_FLAG;
      }
      events.push(ev);
    }
  }
  return events;
}
