import test from 'ava';
import {HDate, months} from './hdate';
import {Locale} from './locale';
import poHeMin from './he.min.po.json';
import './locale-ashkenazi';

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

test('daysInMonth', (t) => {
  t.is(HDate.daysInMonth(IYYAR, 5780), 29);
  t.is(HDate.daysInMonth(SIVAN, 5780), 30);
  t.is(HDate.daysInMonth(CHESHVAN, 5782), 29);
  t.is(HDate.daysInMonth(CHESHVAN, 5783), 30);
  t.is(HDate.daysInMonth(KISLEV, 5783), 30);
  t.is(HDate.daysInMonth(KISLEV, 5784), 29);
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

test('prev-next', (t) => {
  const hd = new HDate(765432);
  t.is(hd.prev().abs(), 765431);
  t.is(hd.next().abs(), 765433);
  const hd2 = new HDate(new Date(1751, 0, 1));
  t.is(hd2.prev().abs(), 639174);
  t.is(hd2.next().abs(), 639176);
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

test('throws-ctor-NaN', (t) => {
  const error = t.throws(() => {
    new HDate(NaN, 'Sivan', 5780);
  }, {instanceOf: TypeError});
  t.is(error.message, 'HDate called with bad day argument: NaN');
  const error3 = t.throws(() => {
    new HDate(17, 'Sivan', NaN);
  }, {instanceOf: TypeError});
  t.is(error3.message, 'HDate called with bad year argument: NaN');
  const error2 = t.throws(() => {
    new HDate(17, NaN, 5780);
  }, {instanceOf: RangeError});
  t.is(error2.message, 'Invalid month number: NaN');
});


test('toString', (t) => {
  const d = new HDate(new Date(1751, 0, 1));
  t.is(d.toString(), '4 Tevet 5511');
});

test('renderGematriya', (t) => {
  t.is(new HDate(17, 'Tamuz', 5748).renderGematriya(), 'י״ז תַּמּוּז תשמ״ח');
  t.is(new HDate(20, 'Tishrei', 5780).renderGematriya(), 'כ׳ תִשְׁרֵי תש״פ');
  t.is(new HDate(26, 'Tevet', 8008).renderGematriya(), 'כ״ו טֵבֵת ח׳ח׳');
});

test('render', (t) => {
  const hd = new HDate(15, months.CHESHVAN, 5769);
  t.is(hd.render(), '15th of Cheshvan, 5769');
  t.is(hd.render('en'), '15th of Cheshvan, 5769');
  t.is(hd.render('s'), '15th of Cheshvan, 5769');
  t.is(hd.render('ashkenazi'), '15th of Cheshvan, 5769');
  t.is(hd.render('he'), '15 חֶשְׁוָן, 5769');

  t.is(hd.render('en', true), '15th of Cheshvan, 5769');
  t.is(hd.render('ashkenazi', true), '15th of Cheshvan, 5769');
  t.is(hd.render('he', true), '15 חֶשְׁוָן, 5769');

  t.is(hd.render('en', false), '15th of Cheshvan');
  t.is(hd.render('ashkenazi', false), '15th of Cheshvan');
  t.is(hd.render('he', false), '15 חֶשְׁוָן');
});

test('render-tevet-ashkenazi', (t) => {
  const hd = new HDate(3, months.TEVET, 5769);
  t.is(hd.render('en', false), '3rd of Tevet');
  t.is(hd.render('s', false), '3rd of Tevet');
  t.is(hd.render('ashkenazi', false), '3rd of Teves');
  t.is(hd.render('a', false), '3rd of Teves');
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
