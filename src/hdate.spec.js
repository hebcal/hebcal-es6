import test from 'ava';
import {HDate, months} from './hdate';
import {Locale} from './locale';
import poHeMin from './he.min.po.json';

Locale.addLocale('he', poHeMin);
Locale.addLocale('h', poHeMin);

const NISAN = months.NISAN;
const IYYAR = months.IYYAR;
const SIVAN = months.SIVAN;
const TAMUZ = months.TAMUZ;
const AV = months.AV;
const ELUL = months.ELUL;
const TISHREI = months.TISHREI;
const CHESHVAN = months.CHESHVAN;
const KISLEV = months.KISLEV;
const TEVET = months.TEVET;
const SHVAT = months.SHVAT;
const ADAR_I = months.ADAR_I;
const ADAR_II = months.ADAR_II;

test('elapsedDays', (t) => {
  t.is(HDate.elapsedDays(5780), 2110760);
  t.is(HDate.elapsedDays(5708), 2084447);
  t.is(HDate.elapsedDays(3762), 1373677);
  t.is(HDate.elapsedDays(3671), 1340455);
  t.is(HDate.elapsedDays(1234), 450344);
  t.is(HDate.elapsedDays(123), 44563);
  t.is(HDate.elapsedDays(2), 356);
  t.is(HDate.elapsedDays(1), 1);
});

test('isLeapYear', (t) => {
  t.is(HDate.isLeapYear(5779), true);
  t.is(HDate.isLeapYear(5782), true);
  t.is(HDate.isLeapYear(5784), true);
  t.is(HDate.isLeapYear(5780), false);
  t.is(HDate.isLeapYear(5781), false);
  t.is(HDate.isLeapYear(5783), false);
  t.is(HDate.isLeapYear(5778), false);
  t.is(HDate.isLeapYear(5749), true);
  t.is(HDate.isLeapYear(5511), false);
  t.is(HDate.isLeapYear(5252), true);
  t.is(HDate.isLeapYear(4528), true);
  t.is(HDate.isLeapYear(4527), false);
});

test('daysInYear', (t) => {
  t.is(HDate.daysInYear(5779), 385);
  t.is(HDate.daysInYear(5780), 355);
  t.is(HDate.daysInYear(5781), 353);
  t.is(HDate.daysInYear(5782), 384);
  t.is(HDate.daysInYear(5783), 355);
  t.is(HDate.daysInYear(5784), 383);
  t.is(HDate.daysInYear(5785), 355);
  t.is(HDate.daysInYear(5786), 354);
  t.is(HDate.daysInYear(5787), 385);
  t.is(HDate.daysInYear(5788), 355);
  t.is(HDate.daysInYear(5789), 354);
  t.is(HDate.daysInYear(3762), 383);
  t.is(HDate.daysInYear(3671), 354);
  t.is(HDate.daysInYear(1234), 353);
  t.is(HDate.daysInYear(123), 355);
  t.is(HDate.daysInYear(2), 355);
  t.is(HDate.daysInYear(1), 355);
});

test('daysInMonth', (t) => {
  t.is(HDate.daysInMonth(IYYAR, 5780), 29);
  t.is(HDate.daysInMonth(SIVAN, 5780), 30);
  t.is(HDate.daysInMonth(CHESHVAN, 5782), 29);
  t.is(HDate.daysInMonth(CHESHVAN, 5783), 30);
  t.is(HDate.daysInMonth(KISLEV, 5783), 30);
  t.is(HDate.daysInMonth(KISLEV, 5784), 29);
});

test('getMonthName', (t) => {
  // leap year
  t.is(HDate.getMonthName(ADAR_I, 5763), 'Adar I');
  t.is(HDate.getMonthName(ADAR_II, 5763), 'Adar II');
  t.is(HDate.getMonthName(14, 5763), 'Nisan');
  // not a leap year
  t.is(HDate.getMonthName(ADAR_I, 5764), 'Adar');
  t.is(HDate.getMonthName(ADAR_II, 5764), 'Nisan');
  // not boundary conditions
  t.is(HDate.getMonthName(TAMUZ, 5780), 'Tamuz');
  t.is(HDate.getMonthName(NISAN, 5763), 'Nisan');
  t.is(HDate.getMonthName(ELUL, 5763), 'Elul');
  t.is(HDate.getMonthName(TISHREI, 5763), 'Tishrei');
});

test('ctor-mdy', (t) => {
  let d = new HDate(29, CHESHVAN, 5769);
  let dt = d.greg(); // 2008-11-27
  t.is(d.getMonth(), CHESHVAN);
  t.is(d.getDate(), 29);
  t.is(d.getFullYear(), 5769);
  t.is(d.prev().getMonth(), CHESHVAN);
  t.is(d.next().getMonth(), KISLEV);
  t.is(d.abs(), 733373);
  t.is(dt.getMonth(), 10);
  t.is(dt.getDate(), 27);
  t.is(dt.getFullYear(), 2008);

  d = new HDate(4, TAMUZ, 5536);
  dt = d.greg(); // 1776-06-21
  t.is(d.getMonth(), TAMUZ);
  t.is(d.getDate(), 4);
  t.is(d.getFullYear(), 5536);
  t.is(d.abs(), 648478);
  t.is(dt.getMonth(), 5);
  t.is(dt.getDate(), 21);
  t.is(dt.getFullYear(), 1776);

  d = new HDate(3, TISHREI, 1003);
  t.is(d.getMonth(), TISHREI);
  t.is(d.getDate(), 3);
  t.is(d.getFullYear(), 1003);
  t.is(d.abs(), -1007451);
});

test('ctor-abs', (t) => {
  let d = new HDate(733359);
  t.is(d.getMonth(), CHESHVAN);
  t.is(d.getDate(), 15);
  t.is(d.getFullYear(), 5769);
  t.is(d.abs(), 733359);

  d = new HDate(295059);
  t.is(d.getMonth(), CHESHVAN);
  t.is(d.getDate(), 7);
  t.is(d.getFullYear(), 4569);
  t.is(d.abs(), 295059);

  d = new HDate(1);
  t.is(d.getMonth(), TEVET);
  t.is(d.getDate(), 18);
  t.is(d.getFullYear(), 3761);
  t.is(d.abs(), 1);
});

test('ctor-jsdate', (t) => {
  const d = new HDate(new Date(1751, 0, 1));
  t.is(d.getMonth(), TEVET);
  t.is(d.getDate(), 4);
  t.is(d.getFullYear(), 5511);
  t.is(d.abs(), 639175);
});

test('ctor-copy', (t) => {
  const d1 = new HDate(new Date(1751, 0, 1));
  const d2 = new HDate(d1);
  t.is(d1.isSameDate(d2), true);
  t.is(d1.isSameDate(new Date(1751, 0, 1)), false);
  t.is(d1.abs(), d2.abs());

  const d3 = new HDate(29, 'Cheshvan', 5769);
  const d4 = new HDate(d3);
  t.is(d3.isSameDate(d4), true);
  t.is(d3.abs(), d4.abs());

  t.is(d3.isSameDate(d1), false);
  t.is(d3.isSameDate({}), false);
  t.is(d3.isSameDate([]), false);
  t.is(d3.isSameDate('bogus'), false);
  t.is(d3.isSameDate(3.14159), false);

  const d5 = new HDate(733359);
  const d6 = new HDate(d5);
  t.is(d5.isSameDate(d6), true);
  t.is(d5.abs(), d6.abs());
});

test('throws-ctor-string', (t) => {
  const error = t.throws(() => {
    new HDate('17 Cheshvan 5759');
  }, {instanceOf: TypeError});
  t.is(error.message, 'HDate called with bad argument: 17 Cheshvan 5759');
});

test('throws-ctor-2', (t) => {
  const error = t.throws(() => {
    new HDate(17, 'Cheshvan');
  }, {instanceOf: TypeError});
  t.is(error.message, 'HDate constructor requires 0, 1 or 3 arguments');
});

test('throws-ctor-4', (t) => {
  const error = t.throws(() => {
    new HDate(1, 2, 3, 4);
  }, {instanceOf: TypeError});
  t.is(error.message, 'HDate constructor requires 0, 1 or 3 arguments');
});

test('toString', (t) => {
  const d = new HDate(new Date(1751, 0, 1));
  t.is(d.toString(), '4 Tevet 5511');
});

test('hebrew2abs', (t) => {
  t.is(HDate.hebrew2abs(5769, CHESHVAN, 15), 733359);
  t.is(HDate.hebrew2abs(5708, IYYAR, 6), 711262);
  t.is(HDate.hebrew2abs(3762, TISHREI, 1), 249);
  t.is(HDate.hebrew2abs(3761, NISAN, 1), 72);
  t.is(HDate.hebrew2abs(3761, TEVET, 18), 1);
  t.is(HDate.hebrew2abs(3761, TEVET, 17), 0);
  t.is(HDate.hebrew2abs(3761, TEVET, 16), -1);
  t.is(HDate.hebrew2abs(3761, TEVET, 1), -16);
});

test('abs2hebrew', (t) => {
  t.deepEqual(HDate.abs2hebrew(733359), {yy: 5769, mm: CHESHVAN, dd: 15});
  t.deepEqual(HDate.abs2hebrew(711262), {yy: 5708, mm: IYYAR, dd: 6});
  t.deepEqual(HDate.abs2hebrew(249), {yy: 3762, mm: TISHREI, dd: 1});
  t.deepEqual(HDate.abs2hebrew(1), {yy: 3761, mm: TEVET, dd: 18});
  t.deepEqual(HDate.abs2hebrew(0), {yy: 3761, mm: TEVET, dd: 17});
  t.deepEqual(HDate.abs2hebrew(-16), {yy: 3761, mm: TEVET, dd: 1});
});

test('abs2hebrew-88ce', (t) => {
  const h2 = HDate.abs2hebrew(32141);
  t.is(h2.yy, 3849);
  t.is(h2.mm, SHVAT);
  t.is(h2.dd, 1);

  const h3 = HDate.abs2hebrew(32142);
  t.is(h3.yy, 3849);
  t.is(h3.mm, SHVAT);
  t.is(h3.dd, 2);
});

test('renderGematriya', (t) => {
  t.is(new HDate(17, 'Tamuz', 5748).renderGematriya(), 'י״ז תַּמּוּז תשמ״ח');
  t.is(new HDate(20, 'Tishrei', 5780).renderGematriya(), 'כ׳ תִשְׁרֵי תש״פ');
});

test('monthFromName', (t) => {
  const toTest = [
    NISAN, 'Nisan_nisan_n_N_Nissan_ניסן',
    IYYAR, 'Iyyar_Iyar_iyyar_iy_אייר',
    ELUL, 'Elul_elul_אלול',
    CHESHVAN, 'Cheshvan_cheshvan_חשון',
    KISLEV, 'Kislev_kislev_כסלו',
    SIVAN, 'Sivan_sivan_סייון_סיון',
    SHVAT, 'Shvat_Sh\'vat_Shevat_שבט',
    TAMUZ, 'Tamuz_Tammuz_תמוז',
    TISHREI, 'Tishrei_תשרי',
    TEVET, 'Tevet_טבת',
    AV, 'Av_אב',
    ADAR_I, ['Adar I', 'Adar 1', 'AdarI', 'Adar1', 'אדר א', 'אדר 1'],
    ADAR_II, ['Adar II', 'Adar 2', 'AdarII', 'Adar2', 'אדר', 'אדר ב', 'אדר 2'],
  ];

  for (let i = 0; i < toTest.length; i += 2) {
    const monthNum = toTest[i];
    const samples = toTest[i + 1];
    const arr = typeof samples == 'string' ? samples.split('_') : samples;
    for (const input of arr) {
      t.is(HDate.monthFromName(input), monthNum, `${input} => ${monthNum}`);
    }
  }

  t.is(HDate.monthFromName(7), 7);

  const bad = 'Xyz Ace November Tommy suds January תת אא'.split(' ');
  for (const sample of bad) {
    const error = t.throws(() => {
      HDate.monthFromName(sample);
    }, {instanceOf: RangeError});
    t.is(error.message, `Unable to parse month name: ${sample}`);
  }
});

test('getMonthName-throws', (t) => {
  const error = t.throws(() => {
    HDate.getMonthName(0, 5780);
  }, {instanceOf: TypeError});
  t.is(error.message, `bad month argument 0`);
});

test('month14-rollover', (t) => {
  t.is(new HDate(17, 14, 5779).toString(), '17 Nisan 5780');
  t.is(new HDate(17, 14, 5780).toString(), '17 Iyyar 5781');
});

test('month-rollunder', (t) => {
  t.is(new HDate(17, 0, 5779).toString(), '17 Adar 5778');
  t.is(new HDate(17, 0, 5780).toString(), '17 Adar I 5779');

  t.is(new HDate(17, -3, 5779).toString(), '17 Tevet 5778');
  t.is(new HDate(17, -3, 5780).toString(), '17 Kislev 5779');
});

test('day-rollover-rollunder', (t) => {
  t.is(new HDate(33, ELUL, 5779).toString(), '4 Tishrei 5780');
  t.is(new HDate(-3, TISHREI, 5779).toString(), '27 Elul 5778');
});

test('adar2-nonleap', (t) => {
  const hd = new HDate(17, ADAR_II, 5780);
  t.is(hd.getMonth(), ADAR_I);
});

// eslint-disable-next-line require-jsdoc
function hd2iso(hd) {
  return hd.greg().toISOString().substring(0, 10);
}

test('before', (t) => {
  const hd = new HDate(new Date('Wednesday February 19, 2014'));
  t.is(hd2iso(hd.before(6)), '2014-02-15');
});

test('onOrBefore', (t) => {
  t.is(hd2iso(new HDate(new Date('Wednesday February 19, 2014')).onOrBefore(6)), '2014-02-15');
  t.is(hd2iso(new HDate(new Date('Saturday February 22, 2014')).onOrBefore(6)), '2014-02-22');
  t.is(hd2iso(new HDate(new Date('Sunday February 23, 2014')).onOrBefore(6)), '2014-02-22');
});

test('nearest', (t) => {
  t.is(hd2iso(new HDate(new Date('Wednesday February 19, 2014')).nearest(6)), '2014-02-22');
  t.is(hd2iso(new HDate(new Date('Tuesday February 18, 2014')).nearest(6)), '2014-02-15');
});

test('onOrAfter', (t) => {
  t.is(hd2iso(new HDate(new Date('Wednesday February 19, 2014')).onOrAfter(6)), '2014-02-22');
  t.is(hd2iso(new HDate(new Date('Saturday February 22, 2014')).onOrAfter(6)), '2014-02-22');
  t.is(hd2iso(new HDate(new Date('Sunday February 23, 2014')).onOrAfter(6)), '2014-03-01');
});

test('after', (t) => {
  t.is(hd2iso(new HDate(new Date('Wednesday February 19, 2014')).after(6)), '2014-02-22');
  t.is(hd2iso(new HDate(new Date('Saturday February 22, 2014')).after(6)), '2014-03-01');
  t.is(hd2iso(new HDate(new Date('Sunday February 23, 2014')).after(6)), '2014-03-01');
});

test('isHDate', (t) => {
  t.is(HDate.isHDate('foo'), false);
  t.is(HDate.isHDate(null), false);
  t.is(HDate.isHDate(undefined), false);
  t.is(HDate.isHDate({}), false);
  t.is(HDate.isHDate(new HDate()), true);
  t.is(HDate.isHDate(new Date()), false);
  t.is(HDate.isHDate(new HDate(12345)), true);
});

test('getDay', (t) => {
  t.is(new HDate(15, CHESHVAN, 5769).getDay(), 4);
  t.is(new HDate(6, IYYAR, 5708).getDay(), 6);
  t.is(new HDate(7, IYYAR, 5708).getDay(), 0);
  t.is(new HDate(1, TISHREI, 3762).getDay(), 4);
  t.is(new HDate(1, NISAN, 3761).getDay(), 2);
  t.is(new HDate(18, TEVET, 3761).getDay(), 1);
  t.is(new HDate(17, TEVET, 3761).getDay(), 0);
  t.is(new HDate(16, TEVET, 3761).getDay(), 6);
  t.is(new HDate(1, TEVET, 3761).getDay(), 5);
  t.is(new HDate(29, SIVAN, 3333).getDay(), 2);
  t.is(new HDate(28, SIVAN, 3333).getDay(), 1);
  t.is(new HDate(27, SIVAN, 3333).getDay(), 0);
  t.is(new HDate(26, SIVAN, 3333).getDay(), 6);
  t.is(new HDate(25, SIVAN, 3333).getDay(), 5);
  t.is(new HDate(24, SIVAN, 3333).getDay(), 4);
  t.is(new HDate(23, SIVAN, 3333).getDay(), 3);
});

test('add', (t) => {
  const cheshvan29 = new HDate(29, CHESHVAN, 5769);
  let hd = cheshvan29.add(1, 'd');
  t.is(hd.getMonth(), KISLEV);
  t.is(hd.getDate(), 1);
  t.is(hd.getFullYear(), 5769);

  hd = cheshvan29.add(10, 'days');
  t.is(hd.getMonth(), KISLEV);
  t.is(hd.getDate(), 10);
  t.is(hd.getFullYear(), 5769);

  hd = cheshvan29.add(1, 'weeks');
  t.is(hd.getMonth(), KISLEV);
  t.is(hd.getDate(), 7);
  t.is(hd.getFullYear(), 5769);

  hd = cheshvan29.add(-3, 'Days');
  t.is(hd.getMonth(), CHESHVAN);
  t.is(hd.getDate(), 26);
  t.is(hd.getFullYear(), 5769);

  hd = cheshvan29.add(-3, 'Day');
  t.is(hd.getMonth(), CHESHVAN);
  t.is(hd.getDate(), 26);
  t.is(hd.getFullYear(), 5769);

  hd = cheshvan29.subtract(3, 'M');
  t.is(hd.getMonth(), AV);
  t.is(hd.getDate(), 30);
  t.is(hd.getFullYear(), 5768);

  hd = cheshvan29.add(0, 'y');
  t.is(hd.getMonth(), CHESHVAN);
  t.is(hd.getDate(), 29);
  t.is(hd.getFullYear(), 5769);

  const adarIIleap = new HDate(14, ADAR_II, 5763);
  hd = adarIIleap.add(1, 'years');
  t.is(hd.getMonth(), ADAR_I);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5764);

  hd = adarIIleap.add(2, 'year');
  t.is(hd.getMonth(), ADAR_II);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5765);

  hd = adarIIleap.add(19, 'y');
  t.is(hd.getMonth(), ADAR_II);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5782);

  hd = adarIIleap.add(52, 'WEEKS');
  t.is(hd.getMonth(), ADAR_I);
  t.is(hd.getDate(), 23);
  t.is(hd.getFullYear(), 5764);

  const adarNonLeap = new HDate(14, ADAR_I, 5764);
  t.is(adarNonLeap.getMonth(), ADAR_I);
  t.is(adarNonLeap.getDate(), 14);
  t.is(adarNonLeap.getFullYear(), 5764);

  hd = adarNonLeap.add(-3, 'months');
  t.is(hd.getMonth(), KISLEV);
  t.is(hd.getDate(), 15);
  t.is(hd.getFullYear(), 5764);

  hd = adarNonLeap.add(-1, 'months');
  t.is(hd.getMonth(), SHVAT);
  t.is(hd.getDate(), 15);
  t.is(hd.getFullYear(), 5764);

  hd = adarNonLeap.add(-6, 'months');
  t.is(hd.getMonth(), ELUL);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5763);

  hd = adarNonLeap.add(1, 'months');
  t.is(hd.getMonth(), NISAN);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5764);

  hd = adarNonLeap.add(2, 'month');
  t.is(hd.getMonth(), IYYAR);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5764);

  hd = adarNonLeap.add(15, 'month');
  t.is(hd.getMonth(), IYYAR);
  t.is(hd.getDate(), 14);
  t.is(hd.getFullYear(), 5765);
});

test('deltaDays', (t) => {
  const hd1 = new HDate(25, KISLEV, 5770);
  const hd2 = new HDate(15, CHESHVAN, 5769);
  t.is(hd1.deltaDays(hd2), 394);
  t.is(hd2.deltaDays(hd1), -394);
  t.is(hd1.deltaDays(hd1), 0);

  const hd3 = new HDate(10, TISHREI, 5770);
  const hd4 = new HDate(9, AV, 5769);
  t.is(hd3.deltaDays(hd4), 60);
  t.is(hd4.deltaDays(hd3), -60);
});

test('throws-invalid-units', (t) => {
  const error = t.throws(() => {
    const hd = new HDate(29, CHESHVAN, 5769);
    hd.add(1, 'foobar');
  }, {instanceOf: TypeError});
  t.is(error.message, 'Invalid units \'foobar\'');
});

test('throws-invalid-deltaDays', (t) => {
  const error = t.throws(() => {
    const hd = new HDate(29, CHESHVAN, 5769);
    hd.deltaDays(1234);
  }, {instanceOf: TypeError});
  t.is(error.message, 'Bad argument: 1234');
});
