import test from 'ava';
import {HDate, months, HebrewDateEvent} from './hdate';

test('elapsedDays', (t) => {
  const elapsed = HDate.elapsedDays(5780);
  t.is(elapsed, 2110760);
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
});

test('daysInMonth', (t) => {
  t.is(HDate.daysInMonth(months.IYYAR), 29);
  t.is(HDate.daysInMonth(months.SIVAN), 30);
});

test('getMonthName', (t) => {
  // leap year
  t.is(HDate.getMonthName(months.ADAR_I, 5763), 'Adar I');
  t.is(HDate.getMonthName(months.ADAR_II, 5763), 'Adar II');
  t.is(HDate.getMonthName(14, 5763), 'Nisan');
  // not a leap year
  t.is(HDate.getMonthName(months.ADAR_I, 5764), 'Adar');
  t.is(HDate.getMonthName(months.ADAR_II, 5764), 'Nisan');
  // not boundary conditions
  t.is(HDate.getMonthName(months.TAMUZ, 5780), 'Tamuz');
  t.is(HDate.getMonthName(months.NISAN, 5763), 'Nisan');
  t.is(HDate.getMonthName(months.ELUL, 5763), 'Elul');
  t.is(HDate.getMonthName(months.TISHREI, 5763), 'Tishrei');
});

test('ctor-mdy', (t) => {
  const CHESHVAN = months.CHESHVAN;
  let d = new HDate(29, CHESHVAN, 5769);
  let dt = d.greg(); // 2008-11-27
  t.is(d.getMonth(), CHESHVAN);
  t.is(d.getDate(), 29);
  t.is(d.getFullYear(), 5769);
  t.is(d.prev().getMonth(), CHESHVAN);
  t.is(d.next().getMonth(), months.KISLEV);
  t.is(d.abs(), 733373);
  t.is(dt.getMonth(), 10);
  t.is(dt.getDate(), 27);
  t.is(dt.getFullYear(), 2008);

  d = new HDate(4, months.TAMUZ, 5536);
  dt = d.greg(); // 1776-06-21
  t.is(d.getMonth(), months.TAMUZ);
  t.is(d.getDate(), 4);
  t.is(d.getFullYear(), 5536);
  t.is(d.abs(), 648478);
  t.is(dt.getMonth(), 5);
  t.is(dt.getDate(), 21);
  t.is(dt.getFullYear(), 1776);

  d = new HDate(3, months.TISHREI, 1003);
  dt = d.greg(); // -003262-09-09
  t.is(d.getMonth(), months.TISHREI);
  t.is(d.getDate(), 3);
  t.is(d.getFullYear(), 1003);
  t.is(d.abs(), -1007451);
  t.is(dt.getMonth(), 8);
  t.is(dt.getDate(), 9);
  t.is(dt.getFullYear(), -3262);
});

test('ctor-abs', (t) => {
  let d = new HDate(733359);
  t.is(d.getMonth(), months.CHESHVAN);
  t.is(d.getDate(), 15);
  t.is(d.getFullYear(), 5769);
  t.is(d.abs(), 733359);

  d = new HDate(295059);
  t.is(d.getMonth(), months.CHESHVAN);
  t.is(d.getDate(), 7);
  t.is(d.getFullYear(), 4569);
  t.is(d.abs(), 295059);

  d = new HDate(1);
  t.is(d.getMonth(), months.TEVET);
  t.is(d.getDate(), 18);
  t.is(d.getFullYear(), 3761);
  t.is(d.abs(), 1);
});

test('ctor-jsdate', (t) => {
  const d = new HDate(new Date(1751, 0, 1));
  t.is(d.getMonth(), months.TEVET);
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
  const abs = HDate.hebrew2abs(5769, months.CHESHVAN, 15);
  t.is(abs, 733359);
});

test('abs2hebrew', (t) => {
  const h = HDate.abs2hebrew(733359);
  t.is(h.yy, 5769);
  t.is(h.mm, months.CHESHVAN);
  t.is(h.dd, 15);
});

test('throws-abs2hebrew', (t) => {
  const error = t.throws(() => {
    HDate.abs2hebrew(12345678);
  }, {instanceOf: RangeError});
  t.is(error.message, 'parameter to abs2hebrew 12345678 out of range');
});

test('render', (t) => {
  const elul29 = new HDate(29, 'Elul', 5779);
  const hd1 = new HebrewDateEvent(elul29);
  const tishrei1 = new HDate(1, 'Tishrei', 5780);
  const hd2 = new HebrewDateEvent(tishrei1);
  t.is(hd1.render(), '29th of Elul, 5779');
  t.is(hd1.render('en'), '29th of Elul, 5779');
  t.is(hd1.render(''), '29th of Elul, 5779');
  t.is(hd1.render('ashkenazi'), '29th of Elul, 5779');
  t.is(hd1.render('he'), 'כ״ט אֱלוּל תשע״ט');
  t.is(hd2.render(), '1st of Tishrei, 5780');
  t.is(hd2.render(''), '1st of Tishrei, 5780');
  t.is(hd2.render('en'), '1st of Tishrei, 5780');
  t.is(hd2.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(hd2.render('he'), 'א׳ תִשְׁרֵי תש״פ');
  t.is(elul29.render(), '29th of Elul, 5779');
  t.is(elul29.render('en'), '29th of Elul, 5779');
  t.is(elul29.render(''), '29th of Elul, 5779');
  t.is(elul29.render('ashkenazi'), '29th of Elul, 5779');
  t.is(elul29.render('he'), '29. אֱלוּל, 5779');
  t.is(tishrei1.render(), '1st of Tishrei, 5780');
  t.is(tishrei1.render(''), '1st of Tishrei, 5780');
  t.is(tishrei1.render('en'), '1st of Tishrei, 5780');
  t.is(tishrei1.render('ashkenazi'), '1st of Tishrei, 5780');
  t.is(tishrei1.render('he'), '1. תִשְׁרֵי, 5780');
});

test('renderGematriya', (t) => {
  t.is(new HDate(17, 'Tamuz', 5748).renderGematriya(), 'י״ז תַּמּוּז תשמ״ח');
  t.is(new HDate(20, 'Tishrei', 5780).renderGematriya(), 'כ׳ תִשְׁרֵי תש״פ');
  t.is(HebrewDateEvent.renderHebrew(20, 'xyz', 5780), 'כ׳ xyz תש״פ');
});

test('monthFromName', (t) => {
  const toTest = [
    months.NISAN, 'Nisan_nisan_n_N_Nissan_ניסן',
    months.IYYAR, 'Iyyar_Iyar_iyyar_iy_אייר',
    months.ELUL, 'Elul_elul_אלול',
    months.CHESHVAN, 'Cheshvan_cheshvan_חשון',
    months.KISLEV, 'Kislev_kislev_כסלו',
    months.SIVAN, 'Sivan_sivan_סייון_סיון',
    months.SHVAT, 'Shvat_Sh\'vat_Shevat_שבט',
    months.TAMUZ, 'Tamuz_Tammuz_תמוז',
    months.TISHREI, 'Tishrei_תשרי',
    months.TEVET, 'Tevet_טבת',
    months.AV, 'Av_אב',
    months.ADAR_I, ['Adar I', 'Adar 1', 'AdarI', 'Adar1', 'אדר א', 'אדר 1'],
    months.ADAR_II, ['Adar II', 'Adar 2', 'AdarII', 'Adar2', 'אדר', 'אדר ב', 'אדר 2'],
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
  t.is(new HDate(33, months.ELUL, 5779).toString(), '4 Tishrei 5780');
  t.is(new HDate(-3, months.TISHREI, 5779).toString(), '27 Elul 5778');
});

test('adar2-nonleap', (t) => {
  const hd = new HDate(17, months.ADAR_II, 5780);
  t.is(hd.getMonth(), months.ADAR_I);
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
