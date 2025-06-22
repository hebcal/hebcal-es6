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
 * Utility method to determine if the date and time has a <em>melacha</em> (work) prohibition.
 * Although there are many opinions on the time of <em>tzais</em>, for simplicity
 * this function uses solar depression of 8.5 degrees.
 *
 * @return `true` if <em>melacha</em> is prohibited or `false` if it is not.
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
