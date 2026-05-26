import {HDate, months} from '@hebcal/hdate';
import {ParshaEvent} from './ParshaEvent';
import {getSedra} from './sedra';

/**
 * Calculates the weekly Torah Reading (Parashat HaShavua) on Saturdays for
 * an entire Hebrew year.
 *
 * Saturdays on which a Yom Tov reading displaces the regular parsha
 * (e.g. Shabbat Chol ha-Moed Pesach/Sukkot, Yom Kippur on Shabbat) are
 * skipped — for those use {@link getHolidaysOnDate} or
 * {@link Sedra.lookup}.
 * @example
 * import {parshaYear} from '@hebcal/core';
 * const events = parshaYear(5784, false);
 * events[0].render('en'); // 'Parashat Vayeilech'
 * events[0].getDate().toString(); // '4 Tishrei 5784'
 * @param year Hebrew year
 * @param il Israel (false for Diaspora)
 * @returns an array of `ParshaEvent` occurring on Saturdays that contain a regular
 *  (non-holiday) Parashat HaShavua
 */
export function parshaYear(year: number, il: boolean): ParshaEvent[] {
  const sedra = getSedra(year, il);
  const startAbs = sedra.getFirstSaturday();
  const endAbs = HDate.hebrew2abs(year, months.ELUL, 29);
  const events: ParshaEvent[] = [];
  for (let absDt = startAbs; absDt <= endAbs; absDt += 7) {
    const parsha = sedra.lookup(absDt);
    if (!parsha.chag) {
      const ev = new ParshaEvent(parsha);
      events.push(ev);
    }
  }
  return events;
}
