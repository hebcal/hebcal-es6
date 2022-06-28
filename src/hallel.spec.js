import test from 'ava';
import {HDate, months} from './hdate';
import {HebrewCalendar} from './hebcal';
import {hallel_} from './hallel';

test('hallel', (t) => {
  const ev1 = HebrewCalendar.getHolidaysForYearArray(5781, false);
  t.is(hallel_(ev1, new HDate(14, months.NISAN, 5781)), 0);
  t.is(hallel_(ev1, new HDate(15, months.NISAN, 5781)), 2);
  t.is(hallel_(ev1, new HDate(16, months.NISAN, 5781)), 2);
  t.is(hallel_(ev1, new HDate(15, months.CHESHVAN, 5781)), 0);
  t.is(hallel_(ev1, new HDate(1, months.TISHREI, 5781)), 0);
  t.is(hallel_(ev1, new HDate(25, months.KISLEV, 5781)), 2);
  t.is(hallel_(ev1, new HDate(29, months.KISLEV, 5781)), 2);
  t.is(hallel_(ev1, new HDate(21, months.KISLEV, 5781)), 0);

  const ev2 = HebrewCalendar.getHolidaysForYearArray(5781, true);
  t.is(hallel_(ev2, new HDate(17, months.NISAN, 5781)), 1);
  t.is(hallel_(ev2, new HDate(28, months.NISAN, 5781)), 0);
  t.is(hallel_(ev2, new HDate(30, months.NISAN, 5781)), 1);
  t.is(hallel_(ev2, new HDate(1, months.IYYAR, 5781)), 1);
  t.is(hallel_(ev2, new HDate(16, months.NISAN, 5781)), 1);
});
