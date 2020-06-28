import test from 'ava';
import {getMolad, MoladEvent} from './molad';
import {common} from './common';
import {HDate} from './hdate';

const months = common.months;

test('molad', (t) => {
  const items = [
    [months.CHESHVAN, 3, 14, 42, 14],
    [months.KISLEV, 5, 3, 26, 15],
    [months.TEVET, 6, 16, 10, 16],
    [months.SHVAT, 1, 4, 54, 17],
    [months.ADAR_I, 2, 17, 39, 0],
    [months.NISAN, 4, 6, 23, 1],
    [months.IYYAR, 5, 19, 7, 2],
    [months.SIVAN, 0, 7, 51, 3],
    [months.TAMUZ, 1, 20, 35, 4],
    [months.AV, 3, 9, 19, 5],
    [months.ELUL, 4, 22, 3, 6],
  ];
  for (const item of items) {
    const [month, dow, hour, minutes, chalakim] = item;
    const molad = getMolad(5769, month);
    t.is(molad.dow, dow);
    t.is(molad.hour, hour);
    t.is(molad.minutes, minutes);
    t.is(molad.chalakim, chalakim);
  }
});

test('MoladEvent', (t) => {
  const ev = new MoladEvent(new HDate(23, months.KISLEV, 5769), 5769, months.TEVET);
  t.is(ev.getDesc(), 'Molad Tevet 5769');
  t.is(ev.render(), 'Molad Tevet: Sat, 10 minutes and 16 chalakim after 16:00');
});
