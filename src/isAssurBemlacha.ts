import {HDate} from '@hebcal/hdate';
import {Zmanim} from './zmanim';
import {Location} from './location';
import {getHolidaysOnDate} from './holidays';
import {Event, flags} from './event';

const LIGHT_CANDLES = flags.LIGHT_CANDLES | flags.LIGHT_CANDLES_TZEIS;

function isTomorrowShabbosOrYomTov(dow: number, events: Event[]): boolean {
  if (dow === 5) {
    return true;
  }
  const erev = events.find(ev => ev.getFlags() & LIGHT_CANDLES);
  if (erev) {
    return true;
  }
  return false;
}

/**
 * Returns true if it is <em>Shabbos</em> or if it is a <em>Yom Tov</em> day that has a <em>melacha</em> (work)  prohibition.
 *
 * @return if the day is a <em>Yom Tov</em> that is <em>assur bemlacha</em> or <em>Shabbos</em>
 */
function isTodayAssurBemelacha(dow: number, events: Event[]): boolean {
  if (dow === 6) {
    return true;
  }
  const chag = events.find(ev => ev.getFlags() & flags.CHAG);
  if (chag) {
    return true;
  }
  return false;
}

/**
 * Returns `true` if the given moment (date + time) falls within a period
 * when *melacha* (work) is prohibited — i.e. Shabbat or a Yom Tov.
 *
 * The Shabbat/Yom Tov window is taken to begin at sunset (shkiah) on the
 * preceding day (Erev Shabbat / Erev Yom Tov / Yom Tov sheni) and to end
 * at *tzais* (nightfall) on the day itself. *Tzais* is calculated using a
 * solar depression of 8.5° for simplicity; consult a halachic authority
 * for more stringent opinions.
 *
 * `useElevation` controls whether the location's elevation is taken into
 * account when computing sunset (it has no effect on the degree-based
 * tzais calculation). The Israel/Diaspora schedule comes from
 * `location.getIsrael()`.
 *
 * Throws if sunset cannot be calculated for the given location
 * (e.g. polar regions).
 * @example
 * import {isAssurBemlacha, Location} from '@hebcal/core';
 * const loc = Location.lookup('Jerusalem')!;
 * // Friday after sunset:
 * isAssurBemlacha(new Date('2024-04-26T18:00:00Z'), loc, false); // true
 * @param currentTime the moment to test (with hour/minute)
 * @param location geographic location (also supplies Israel/Diaspora flag and tzid)
 * @param useElevation include elevation when computing sunset
 * @return `true` if *melacha* is prohibited, `false` if it is not
 */
export function isAssurBemlacha(
  currentTime: Date,
  location: Location,
  useElevation: boolean
): boolean {
  const zmanim = new Zmanim(location, currentTime, useElevation);
  // erev shabbos, YT or YT sheni and after shkiah
  const sunset = zmanim.sunset();
  const sunsetMillis = sunset.getTime();
  if (isNaN(sunsetMillis)) {
    throw new Error('Could not determine sunset');
  }
  // erev shabbos, YT or YT sheni and after shkiah
  const il = location.getIsrael();
  const currentMillis = currentTime.getTime();
  const hd = new HDate(currentTime);
  const dow = hd.getDay();
  const events = getHolidaysOnDate(hd, il) || [];
  if (isTomorrowShabbosOrYomTov(dow, events) && currentMillis >= sunsetMillis) {
    return true;
  }
  // is shabbos or YT and it is before tzais
  if (isTodayAssurBemelacha(dow, events)) {
    const tzais = zmanim.tzeit();
    const tzaisMillis = tzais.getTime();
    return currentMillis <= tzaisMillis;
  }
  return false;
}
