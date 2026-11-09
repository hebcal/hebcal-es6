import {expect, test} from 'vitest';
import {HDate, months} from '@hebcal/hdate';
import {hallel} from '../src/hallel.js';
import {getHolidaysOnDate} from '../src/holidays.js';
import {holidayDesc as hdesc} from '../src/staticHolidays.js';

test('hallel', () => {
  expect(hallel(new HDate(14, months.NISAN, 5781), false)).toBe(0);
  expect(hallel(new HDate(15, months.NISAN, 5781), false)).toBe(2);
  expect(hallel(new HDate(16, months.NISAN, 5781), false)).toBe(2);
  expect(hallel(new HDate(15, months.CHESHVAN, 5781), false)).toBe(0);
  expect(hallel(new HDate(1, months.TISHREI, 5781), false)).toBe(0);
  expect(hallel(new HDate(25, months.KISLEV, 5781), false)).toBe(2);
  expect(hallel(new HDate(29, months.KISLEV, 5781), false)).toBe(2);
  expect(hallel(new HDate(21, months.KISLEV, 5781), false)).toBe(0);
  // https://github.com/hebcal/hebcal-es6/issues/815
  expect(hallel(new HDate(22, months.TISHREI, 5781), false)).toBe(2);
  expect(hallel(new HDate(23, months.TISHREI, 5781), false)).toBe(2);
  expect(hallel(new HDate(24, months.KISLEV, 5781), false)).toBe(0);
  expect(hallel(new HDate(14, months.IYYAR, 5781), false)).toBe(0);

  expect(hallel(new HDate(17, months.NISAN, 5781), true)).toBe(1);
  expect(hallel(new HDate(28, months.NISAN, 5781), true)).toBe(0);
  expect(hallel(new HDate(30, months.NISAN, 5781), true)).toBe(1);
  expect(hallel(new HDate(1, months.IYYAR, 5781), true)).toBe(1);
  expect(hallel(new HDate(16, months.NISAN, 5781), true)).toBe(1);
  expect(hallel(new HDate(22, months.TISHREI, 5781), true)).toBe(2);
  expect(hallel(new HDate(23, months.TISHREI, 5781), true)).toBe(0);
  expect(hallel(new HDate(24, months.KISLEV, 5781), true)).toBe(0);
  expect(hallel(new HDate(14, months.IYYAR, 5781), true)).toBe(0);
});

test('hallel-pesach-shavuot', () => {
  expect(hallel(new HDate(21, months.NISAN, 5781), true)).toBe(1);
  expect(hallel(new HDate(22, months.NISAN, 5781), true)).toBe(0);
  expect(hallel(new HDate(22, months.NISAN, 5781), false)).toBe(1);
  expect(hallel(new HDate(23, months.NISAN, 5781), false)).toBe(0);
  expect(hallel(new HDate(5, months.SIVAN, 5781), false)).toBe(0);
  expect(hallel(new HDate(6, months.SIVAN, 5781), true)).toBe(2);
  expect(hallel(new HDate(7, months.SIVAN, 5781), true)).toBe(0);
  expect(hallel(new HDate(7, months.SIVAN, 5781), false)).toBe(2);
});

test('hallel-rosh-chodesh', () => {
  expect(hallel(new HDate(30, months.TISHREI, 5781), false)).toBe(1);
  expect(hallel(new HDate(1, months.CHESHVAN, 5781), false)).toBe(1);
  // 5784 is a leap year: 30 Adar I is Rosh Chodesh Adar II
  expect(hallel(new HDate(30, months.ADAR_I, 5784), false)).toBe(1);
  expect(hallel(new HDate(1, months.ADAR_II, 5784), false)).toBe(1);
});

test('hallel-chanukah', () => {
  // 5785 has a 30-day Kislev, so Chanukah ends on 2 Tevet
  expect(HDate.shortKislev(5785)).toBe(false);
  // Rosh Chodesh Tevet falls during Chanukah, so whole Hallel
  expect(hallel(new HDate(30, months.KISLEV, 5785), false)).toBe(2);
  expect(hallel(new HDate(1, months.TEVET, 5785), false)).toBe(2);
  expect(hallel(new HDate(2, months.TEVET, 5785), false)).toBe(2);
  expect(hallel(new HDate(3, months.TEVET, 5785), false)).toBe(0);
  // 5784 has a 29-day Kislev, so Chanukah ends on 3 Tevet
  expect(HDate.shortKislev(5784)).toBe(true);
  expect(hallel(new HDate(1, months.TEVET, 5784), true)).toBe(2);
  expect(hallel(new HDate(3, months.TEVET, 5784), true)).toBe(2);
  expect(hallel(new HDate(4, months.TEVET, 5784), true)).toBe(0);
});

test('hallel-modern', () => {
  // Yom Ha'atzmaut moved to 3 Iyyar when Pesach falls on Sunday
  expect(hallel(new HDate(3, months.IYYAR, 5781), true)).toBe(2);
  expect(hallel(new HDate(5, months.IYYAR, 5781), true)).toBe(0);
  // Yom Ha'atzmaut moved to 6 Iyyar when Pesach falls on Tuesday
  expect(hallel(new HDate(6, months.IYYAR, 5784), false)).toBe(2);
  expect(hallel(new HDate(5, months.IYYAR, 5784), false)).toBe(0);
  expect(hallel(new HDate(5, months.IYYAR, 5707), true)).toBe(0);
  expect(hallel(new HDate(28, months.IYYAR, 5781), false)).toBe(2);
  expect(hallel(new HDate(28, months.IYYAR, 5726), true)).toBe(0);
});

/**
 * Reference implementation derived from holiday events, as `hallel`
 * used to be. Takes the maximum over all events on the day, so that
 * whole Hallel on Chanukah wins over half Hallel on Rosh Chodesh Tevet.
 */
function hallelFromEvents(hd: HDate, il: boolean): number {
  const events = getHolidaysOnDate(hd, il) ?? [];
  let result = 0;
  for (const ev of events) {
    const desc = ev.getDesc();
    if (
      (desc.startsWith('Chanukah') && desc !== hdesc.CHANUKAH_1_CANDLE) ||
      desc.startsWith('Shavuot') ||
      desc.startsWith('Sukkot') ||
      desc === hdesc.SHMINI_ATZERET ||
      desc === hdesc.SIMCHAT_TORAH ||
      desc === hdesc.PESACH_I ||
      (desc === hdesc.PESACH_II && ev.hasFlag('CHAG')) ||
      desc === hdesc.YOM_HAATZMA_UT ||
      desc === hdesc.YOM_YERUSHALAYIM
    ) {
      result = Math.max(result, 2);
    } else if (
      ev.hasFlag('ROSH_CHODESH') ||
      (desc.startsWith('Pesach') && desc !== hdesc.PESACH_SHENI)
    ) {
      result = Math.max(result, 1);
    }
  }
  return result;
}

test.each([false, true])('hallel matches holiday events 5760-5810 il=%s', il => {
  const start = new HDate(1, months.TISHREI, 5760).abs();
  const end = new HDate(1, months.TISHREI, 5811).abs();
  const diffs: string[] = [];
  const counts = [0, 0, 0];
  for (let abs = start; abs < end; abs++) {
    const hd = new HDate(abs);
    const expected = hallelFromEvents(hd, il);
    const actual = hallel(hd, il);
    counts[actual]++;
    if (actual !== expected) {
      diffs.push(`${hd.toString()}: expected ${expected}, got ${actual}`);
    }
  }
  expect(diffs).toEqual([]);
  // sanity check that the comparison actually exercised every outcome
  expect(end - start).toBeGreaterThan(51 * 353);
  expect(counts[1]).toBeGreaterThan(0);
  expect(counts[2]).toBeGreaterThan(0);
});
