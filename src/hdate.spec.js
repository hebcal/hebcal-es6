import test from 'ava';
import HDate, { hebrew2abs, abs2hebrew } from './hdate';
import common from "./common";

test('mdy', t => {
    const CHESHVAN = common.months.CHESHVAN;
    let d = new HDate(29, CHESHVAN, 5769);
    let dt = d.greg(); // 2008-11-27
    t.is(d.getMonth(), CHESHVAN);
    t.is(d.getDate(), 29);
    t.is(d.getFullYear(), 5769);
    t.is(d.prev().getMonth(), CHESHVAN);
    t.is(d.next().getMonth(), common.months.KISLEV);
    t.is(d.abs(), 733373);
    t.is(dt.getMonth(), 10);
    t.is(dt.getDate(), 27);
    t.is(dt.getFullYear(), 2008);

    d = new HDate(4, common.months.TAMUZ, 5536);
    dt = d.greg(); // 1776-06-21
    t.is(d.getMonth(), common.months.TAMUZ);
    t.is(d.getDate(), 4);
    t.is(d.getFullYear(), 5536);
    t.is(d.abs(), 648478);
    t.is(dt.getMonth(), 5);
    t.is(dt.getDate(), 21);
    t.is(dt.getFullYear(), 1776);

    d = new HDate(3, common.months.TISHREI, 1003);
    dt = d.greg(); // -003262-09-09
    t.is(d.getMonth(), common.months.TISHREI);
    t.is(d.getDate(), 3);
    t.is(d.getFullYear(), 1003);
    t.is(d.abs(), -1007451);
    t.is(dt.getMonth(), 8);
    t.is(dt.getDate(), 9);
    t.is(dt.getFullYear(), -3262);
});

test('abs', t => {
    let d = new HDate(733359);
    t.is(d.getMonth(), common.months.CHESHVAN);
    t.is(d.getDate(), 15);
    t.is(d.getFullYear(), 5769);
    t.is(d.abs(), 733359);

    d = new HDate(295059);
    t.is(d.getMonth(), common.months.CHESHVAN);
    t.is(d.getDate(), 7);
    t.is(d.getFullYear(), 4569);
    t.is(d.abs(), 295059);

    d = new HDate(1);
    t.is(d.getMonth(), common.months.TEVET);
    t.is(d.getDate(), 18);
    t.is(d.getFullYear(), 3761);
    t.is(d.abs(), 1);
});

test('jsdate', t => {
    const d = new HDate(new Date(1751, 0, 1));
    t.is(d.getMonth(), common.months.TEVET);
    t.is(d.getDate(), 4);
    t.is(d.getFullYear(), 5511);
    t.is(d.abs(), 639175);
});

test('toString', t => {
    const d = new HDate(new Date(1751, 0, 1));
    t.is(d.toString(), "4 Tevet 5511");
});

test('hebrew2abs', t => {
    const abs = hebrew2abs({yy: 5769, mm: common.months.CHESHVAN, dd: 15});
    t.is(abs, 733359);
});

test('abs2hebrew', t => {
    const h = abs2hebrew(733359);
    t.is(h.yy, 5769);
    t.is(h.mm, common.months.CHESHVAN);
    t.is(h.dd, 15);
});
