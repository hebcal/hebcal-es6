import {CalOptions} from './CalOptions.js';

const hour12cc: Record<string, number> = {
  US: 1,
  CA: 1,
  BR: 1,
  AU: 1,
  NZ: 1,
  DO: 1,
  PR: 1,
  GR: 1,
  IN: 1,
  KR: 1,
  NP: 1,
  ZA: 1,
} as const;

/**
 * Helper function to format a 24-hour (00:00-23:59) time string in either
 * 12-hour US format (e.g. `"8:13pm"`) or keep it in 24-hour format (e.g.
 * `"20:13"`) for any other locale or country.
 *
 * The locale (and therefore default behavior) is derived from
 * `options.location` / `options.locale`. The `options.hour12` override
 * takes precedence: if `false`, locale is ignored and the result is always
 * 24-hour; if `true`, locale is ignored and the result is always 12-hour.
 * @example
 * import {reformatTimeStr, Location} from '@hebcal/core';
 * const opts = {location: Location.lookup('Chicago')};
 * reformatTimeStr('20:30', 'pm', opts);          // '8:30pm'
 * reformatTimeStr('20:30', 'pm', {hour12: false}); // '20:30'
 * @param timeStr - original time like "20:30"
 * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
 * @param options optional; `location`, `locale` and `hour12` are consulted
 */
export function reformatTimeStr(
  timeStr: string,
  suffix: string,
  options?: CalOptions
): string {
  if (typeof timeStr !== 'string') throw new TypeError(`Bad timeStr: ${timeStr}`);
  const cc = options?.location?.getCountryCode() || (options?.il ? 'IL' : 'US');
  const hour12 = options?.hour12;
  if (hour12 !== undefined && !hour12) {
    return timeStr;
  }
  if (!hour12 && hour12cc[cc] === undefined) {
    return timeStr;
  }
  const hm = timeStr.split(':');
  let hour: string | number = parseInt(hm[0], 10);
  if (hour < 12 && suffix) {
    suffix = suffix.replace('p', 'a').replace('P', 'A');
    if (hour === 0) {
      hour = 12;
    }
  } else if (hour > 12) {
    hour = hour % 12;
  } else if (hour === 0) {
    hour = '00';
  }
  return `${hour}:${hm[1]}${suffix}`;
}
