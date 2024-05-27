import {Sedra} from '@hebcal/hdate';
import QuickLRU from 'quick-lru';

const sedraCache = new QuickLRU({maxSize: 400});

/**
 * @private
 * @param {number} hyear
 * @param {boolean} il
 * @return {Sedra}
 */
export function getSedra_(hyear, il) {
  const cacheKey = `${hyear}-${il ? 1 : 0}`;
  let sedra = sedraCache.get(cacheKey);
  if (!sedra) {
    sedra = new Sedra(hyear, il);
    sedraCache.set(cacheKey, sedra);
  }
  return sedra;
}
