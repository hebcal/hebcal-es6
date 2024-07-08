import {CalOptions} from './CalOptions';

const hour12cc: {[key: string]: number} = {
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
};

/**
 * @private
 * @param timeStr - original time like "20:30"
 * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
 * @param options
 */
export function reformatTimeStr(
  timeStr: string,
  suffix: string,
  options?: CalOptions
): string {
  if (typeof timeStr !== 'string')
    throw new TypeError(`Bad timeStr: ${timeStr}`);
  const cc = options?.location?.getCountryCode() || (options?.il ? 'IL' : 'US');
  const hour12 = options?.hour12;
  if (typeof hour12 !== 'undefined' && !hour12) {
    return timeStr;
  }
  if (!hour12 && typeof hour12cc[cc] === 'undefined') {
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
