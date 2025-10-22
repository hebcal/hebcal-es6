import {HDate, months} from '@hebcal/hdate';
import {Event} from './event';
import {ParshaEvent} from './ParshaEvent';
import {getSedra} from './sedra';

/**
 * Calculates weekly Torah Reading on Saturdays for entire year
 * @param year Hebrew year
 * @param il Israel (false for Diaspora)
 * @returns an array of `ParshaEvent` occurring on Saturdays that contain a regular
 *  (non-holiday) Parashat HaShavua
 */
export function parshaYear(year: number, il: boolean): Event[] {
  const sedra = getSedra(year, il);
  const startAbs = sedra.getFirstSaturday();
  const endAbs = HDate.hebrew2abs(year, months.ELUL, 29);
  const events: Event[] = [];
  for (let absDt = startAbs; absDt <= endAbs; absDt += 7) {
    const parsha = sedra.lookup(absDt);
    if (!parsha.chag) {
      const ev = new ParshaEvent(parsha);
      events.push(ev);
    }
  }
  return events;
}
