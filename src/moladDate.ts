import 'temporal-polyfill/global';
import {getTimezoneOffset} from '@hebcal/hdate';
import {MoladBase} from './moladBase';

/** constant for milliseconds in a minute (60,000) */
const MINUTE_MILLIS: number = 60 * 1000;

/**
 * A method that will return the location's local mean time offset in milliseconds from local <a
 * href="https://en.wikipedia.org/wiki/Standard_time">standard time</a>. The globe is split into 360&deg;, with
 * 15&deg; per hour of the day. For a local that is at a longitude that is evenly divisible by 15 (longitude % 15 ==
 * 0), at solar {@link com.kosherjava.zmanim.AstronomicalCalendar#getSunTransit() noon} (with adjustment for the <a
 * href="https://en.wikipedia.org/wiki/Equation_of_time">equation of time</a>) the sun should be directly overhead,
 * so a user who is 1&deg; west of this will have noon at 4 minutes after standard time noon, and conversely, a user
 * who is 1&deg; east of the 15&deg; longitude will have noon at 11:56 AM. Lakewood, N.J., whose longitude is
 * -74.222, is 0.778 away from the closest multiple of 15 at -75&deg;. This is multiplied by 4 to yield 3 minutes
 * and 10 seconds earlier than standard time. The offset returned does not account for the <a
 * href="https://en.wikipedia.org/wiki/Daylight_saving_time">Daylight saving time</a> offset since this class is
 * unaware of dates.
 *
 * @return the offset in milliseconds not accounting for Daylight saving time. A positive value will be returned
 *         East of the 15&deg; timezone line, and a negative value West of it.
 */
function getLocalMeanTimeOffset(
  dt: Date,
  longitude: number,
  tzid: string
): number {
  const offset: number = -1 * getTimezoneOffset(tzid, dt);
  const d = longitude * 4 * MINUTE_MILLIS - offset * MINUTE_MILLIS;
  return Math.trunc(d);
}

/**
 * Returns the molad in Standard Time in Yerushalayim as a Temporal.ZonedDateTime.
 * This method subtracts 20.94 minutes (20 minutes and 56.496 seconds) from the computed time (Har Habayis with a longitude
 * of 35.2354&deg; is 5.2354&deg; away from the %15 timezone longitude) to get to standard time. This method
 * intentionally uses standard time and not daylight savings time.
 *
 * @return the Date representing the moment of the molad in Yerushalayim standard time (GMT + 2)
 */
export function getMoladAsDate(molad: MoladBase): Temporal.ZonedDateTime {
  const moladSeconds: number = (molad.chalakim * 10) / 3;
  const millis: number = Math.trunc(
    1000 * (moladSeconds - Math.trunc(moladSeconds))
  );

  const dt = molad.hdate.greg();

  // The raw molad Date (point in time) must be generated using standard time. Using "Asia/Jerusalem" timezone will result in the time
  // being incorrectly off by an hour in the summer due to DST. Proper adjustment for the actual time in DST will be done by the date
  // formatter class used to display the Date.
  const tzid: string = 'Etc/GMT+2';
  const zdt = Temporal.ZonedDateTime.from({
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
    hour: molad.hour,
    minute: molad.minutes,
    second: Math.trunc(moladSeconds),
    millisecond: millis,
    timeZone: tzid,
  });
  // console.log('Raw molad time in standard time: ' + zdt.toString());

  const longitude: number = 35.2354; // Har Habayis longitude
  const offset = getLocalMeanTimeOffset(dt, longitude, tzid);
  // console.log('Subtracting local mean time offset of ' + offset + 'ms');
  // subtract local time difference of 20.94 minutes (20 minutes and 56.496 seconds) to get to Standard time
  const zdt2 = zdt.subtract({milliseconds: offset});
  // console.log('Molad time in standard time: ' + zdt2.toString());
  return zdt2;
}
