import test from 'ava';
import common from './common';

test('hebElapsedDays', t => {
    let elapsed = common.hebElapsedDays(5780);
    t.is(elapsed, 2110760);
});

test('LEAP', t => {
    t.is(common.LEAP(5779), true);
    t.is(common.LEAP(5782), true);
    t.is(common.LEAP(5784), true);
    t.is(common.LEAP(5780), false);
    t.is(common.LEAP(5781), false);
    t.is(common.LEAP(5783), false);
    t.is(common.LEAP(5778), false);
    t.is(common.LEAP(5749), true);
    t.is(common.LEAP(5511), false);
    t.is(common.LEAP(5252), true);
    t.is(common.LEAP(4528), true);
    t.is(common.LEAP(4527), false);
});

test('daysInYear', t => {
    t.is(common.daysInYear(5779), 385);
    t.is(common.daysInYear(5780), 355);
    t.is(common.daysInYear(5781), 353);
    t.is(common.daysInYear(5782), 384);
    t.is(common.daysInYear(5783), 355);
    t.is(common.daysInYear(5784), 383);
    t.is(common.daysInYear(5785), 355);
    t.is(common.daysInYear(5786), 354);
    t.is(common.daysInYear(5787), 385);
    t.is(common.daysInYear(5788), 355);
    t.is(common.daysInYear(5789), 354);
});

test('daysInMonth', t => {
    t.is(common.daysInMonth(common.months.IYYAR), 29);
    t.is(common.daysInMonth(common.months.SIVAN), 30);
});
