import 'temporal-polyfill/global';
import QuickLRU from 'quick-lru';
import {MoladBase} from './moladBase.js';

/** milliseconds in a day */
const DAY_MILLIS = 24 * 60 * 60 * 1000;

/** R.D. (Rata Die) day number of 1970-01-01, the Unix epoch */
const EPOCH_RD = 719163;

/**
 * Offset of Jerusalem local mean time from UTC, in milliseconds. Har Habayis,
 * at longitude 35.2354°, is 4 minutes per degree east of Greenwich:
 * 2 hours, 20 minutes and 56.496 seconds.
 */
const JERUSALEM_LMT_OFFSET_MILLIS = Math.trunc(35.2354 * 4 * 60 * 1000);

/**
 * Even from precomputed epoch milliseconds, constructing a `ZonedDateTime` with
 * the polyfill costs ~8µs, 10x more than `calculateMolad` itself. Keyed by
 * epoch milliseconds; `ZonedDateTime` is immutable, so sharing is safe.
 */
const moladDateCache = new QuickLRU<number, Temporal.ZonedDateTime>({
  maxSize: 120,
});

/**
 * Returns the moment of the molad as a `Temporal.ZonedDateTime` in the `UTC` zone.
 *
 * The molad is computed in Jerusalem local mean time — longitude 35.2354° at
 * Har Habayis, 20.94 minutes (20 minutes and 56.496 seconds) ahead of Israel
 * standard time — and then converted, so the returned instant is correct
 * year-round; only the zone of the returned object is `UTC`. Daylight savings
 * time is intentionally not applied; adjust when formatting for display.
 *
 * @param molad the molad to convert
 * @return the `Temporal.ZonedDateTime` representing the moment of the molad
 */
export function getMoladAsDate(molad: MoladBase): Temporal.ZonedDateTime {
  const moladSeconds = (molad.chalakim * 10) / 3;
  const millis = Math.trunc(1000 * (moladSeconds - Math.trunc(moladSeconds)));
  const localMillis =
    (molad.hdate.abs() - EPOCH_RD) * DAY_MILLIS +
    ((molad.hour * 60 + molad.minutes) * 60 + Math.trunc(moladSeconds)) * 1000 +
    millis;
  const epochMillis = localMillis - JERUSALEM_LMT_OFFSET_MILLIS;
  let zdt = moladDateCache.get(epochMillis);
  if (!zdt) {
    zdt =
      Temporal.Instant.fromEpochMilliseconds(epochMillis).toZonedDateTimeISO('UTC');
    moladDateCache.set(epochMillis, zdt);
  }
  return zdt;
}
