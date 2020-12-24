import test from 'ava';
import {HolidayEvent, RoshChodeshEvent, MevarchimChodeshEvent} from './holidays';
import {HebrewCalendar} from './hebcal';
import {greg as g} from './greg';
import {HDate, months} from './hdate';
import {flags, Event} from './event';

test('basename-and-url', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  t.is(ev.getDesc(), 'Pesach IV (CH\'\'M)');
  t.is(ev.render(), 'Pesach IV (CH\'\'M)');
  t.is(ev.renderBrief(), 'Pesach IV (CH\'\'M)');
  t.is(ev.basename(), 'Pesach');
  t.is(ev.url(), 'https://www.hebcal.com/holidays/pesach-2003');

  const ev2 = new HolidayEvent(new HDate(23, months.TISHREI, 5763),
      'Simchat Torah', flags.CHUL_ONLY);
  t.is(ev2.getDesc(), 'Simchat Torah');
  t.is(ev2.render(), 'Simchat Torah');
  t.is(ev2.renderBrief(), 'Simchat Torah');
  t.is(ev2.basename(), 'Simchat Torah');
  t.is(ev2.url(), 'https://www.hebcal.com/holidays/simchat-torah-2002');

  const ev3 = new HolidayEvent(new HDate(8, months.AV, 5783),
      'Erev Tish\'a B\'Av', flags.MAJOR_FAST);
  t.is(ev3.getDesc(), 'Erev Tish\'a B\'Av');
  t.is(ev3.render(), 'Erev Tish\'a B\'Av');
  t.is(ev3.renderBrief(), 'Erev Tish\'a B\'Av');
  t.is(ev3.basename(), 'Tish\'a B\'Av');
  t.is(ev3.url(), 'https://www.hebcal.com/holidays/tisha-bav-2023');

  const rch = new RoshChodeshEvent(new HDate(30, months.ADAR_I, 5787), 'Adar II');
  t.is(rch.getDesc(), 'Rosh Chodesh Adar II');
  t.is(rch.render(), 'Rosh Chodesh Adar II');
  t.is(rch.renderBrief(), 'Rosh Chodesh Adar II');
  t.is(rch.basename(), 'Rosh Chodesh Adar II');
  t.is(rch.url(), 'https://www.hebcal.com/holidays/rosh-chodesh-adar-ii-2027');

  const mvch = new MevarchimChodeshEvent(new HDate(23, months.KISLEV, 5769), 'Tevet');
  t.is(mvch.getDesc(), 'Shabbat Mevarchim Chodesh Tevet');
  t.is(mvch.render(), 'Shabbat Mevarchim Chodesh Tevet');
  t.is(mvch.renderBrief(), 'Mevarchim Chodesh Tevet');
  t.is(mvch.url(), undefined);
});

test('shushan-purim', (t) => {
  const events = HebrewCalendar.calendar({year: 2015, numYears: 15});
  const shushan = events.filter((ev) => ev.getDesc() == 'Shushan Purim');
  const dates = shushan.map((ev) => ev.getDate().toString());
  const expected = [
    '15 Adar 5775',
    '15 Adar II 5776',
    '15 Adar 5777',
    '15 Adar 5778',
    '15 Adar II 5779',
    '15 Adar 5780',
    '16 Adar 5781',
    '15 Adar II 5782',
    '15 Adar 5783',
    '15 Adar II 5784',
    '16 Adar 5785',
    '15 Adar 5786',
    '15 Adar II 5787',
    '15 Adar 5788',
    '15 Adar 5789',
  ];
  t.deepEqual(dates, expected, '15 years of Shushan Purim differ');
});

test('getHolidaysOnDate', (t) => {
  const hyear = 5771;
  const expected = [
    new HDate(1, 'Tishrei', hyear).abs() - 1, ['Erev Rosh Hashana'],
    new HDate(1, 'Tishrei', hyear), ['Rosh Hashana 5771'],
    new HDate(10, 'Tishrei', hyear), ['Yom Kippur'],
    new HDate(3, 'Cheshvan', hyear), undefined,
    new Date(2010, 11, 7), ['Chanukah: 7 Candles', 'Rosh Chodesh Tevet'],
  ];
  for (let i = 0; i < expected.length; i += 2) {
    const dt = expected[i];
    const desc = expected[i + 1];
    const ev = HebrewCalendar.getHolidaysOnDate(dt);
    if (typeof desc === 'undefined') {
      t.is(ev, undefined, dt.toString());
    } else {
      t.is(Array.isArray(ev), true);
      t.is(ev[0] instanceof Event, true);
      const d = ev.map((e) => e.getDesc());
      t.deepEqual(d, desc, dt.toString());
    }
  }
});

test('getHolidaysOnDate-il', (t) => {
  const dtShavuot1 = new Date(2021, 4, 17);
  const dtShavuot2 = new Date(2021, 4, 18);
  const events0 = HebrewCalendar.getHolidaysOnDate(dtShavuot1);
  t.is(events0.length, 2);

  const events1il = HebrewCalendar.getHolidaysOnDate(dtShavuot1, true);
  t.is(events1il.length, 1);
  t.is(events1il[0].getDesc(), 'Shavuot');

  const events1diaspora = HebrewCalendar.getHolidaysOnDate(dtShavuot1, false);
  t.is(events1diaspora.length, 1);
  t.is(events1diaspora[0].getDesc(), 'Shavuot I');

  const events2d = HebrewCalendar.getHolidaysOnDate(dtShavuot2, false);
  t.is(events2d.length, 1);
  t.is(events2d[0].getDesc(), 'Shavuot II');

  const events2il = HebrewCalendar.getHolidaysOnDate(dtShavuot2, true);
  t.is(events2il.length, 0, 'expected no Shavuot II in Israel');
});

/**
 * @param {Object} t
 * @param {number} hyear
 * @param {boolean} il
 * @param {string[]} expected
 * @private
 */
function testFullYear(t, hyear, il, expected) {
  const year = HebrewCalendar.getHolidaysForYear(hyear);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1);
  let actual = [];
  for (let absDt = startAbs; absDt <= endAbs; absDt++) {
    const hebDt = new HDate(absDt);
    const gregDt = g.abs2greg(absDt);
    const dateStr = gregDt.toISOString().substring(0, 10);
    const evRaw = year.get(hebDt.toString()) || [];
    const events = evRaw
        .filter((e) => !(e.getFlags() & flags.SHABBAT_MEVARCHIM))
        .filter((e) => (il && e.observedInIsrael()) || (!il && e.observedInDiaspora()));
    actual = actual.concat(events.map((e) => dateStr + ' ' + e.getDesc()));
  }
  t.is(actual.length, expected.length);
  actual.sort();
  t.deepEqual(actual, expected);
}

test('diaspora', (t) => {
  const expected = diaspora5771();
  testFullYear(t, 5771, false, expected);
});

test('israel', (t) => {
  const expected = israel5720();
  testFullYear(t, 5720, true, expected);
});

// hebcal -g -i -H 5720
// eslint-disable-next-line require-jsdoc
function israel5720() {
  return `1959-10-03 Rosh Hashana 5720
1959-10-04 Rosh Hashana II
1959-10-05 Tzom Gedaliah
1959-10-10 Shabbat Shuva
1959-10-11 Erev Yom Kippur
1959-10-12 Yom Kippur
1959-10-16 Erev Sukkot
1959-10-17 Sukkot I
1959-10-18 Sukkot II (CH''M)
1959-10-19 Sukkot III (CH''M)
1959-10-20 Sukkot IV (CH''M)
1959-10-21 Sukkot V (CH''M)
1959-10-22 Sukkot VI (CH''M)
1959-10-23 Sukkot VII (Hoshana Raba)
1959-10-24 Shmini Atzeret
1959-11-01 Rosh Chodesh Cheshvan
1959-11-02 Rosh Chodesh Cheshvan
1959-12-01 Rosh Chodesh Kislev
1959-12-02 Rosh Chodesh Kislev
1959-12-25 Chanukah: 1 Candle
1959-12-26 Chanukah: 2 Candles
1959-12-27 Chanukah: 3 Candles
1959-12-28 Chanukah: 4 Candles
1959-12-29 Chanukah: 5 Candles
1959-12-30 Chanukah: 6 Candles
1959-12-31 Rosh Chodesh Tevet
1959-12-31 Chanukah: 7 Candles
1960-01-01 Rosh Chodesh Tevet
1960-01-01 Chanukah: 8 Candles
1960-01-02 Chanukah: 8th Day
1960-01-10 Asara B'Tevet
1960-01-30 Rosh Chodesh Sh'vat
1960-02-13 Tu BiShvat
1960-02-27 Shabbat Shekalim
1960-02-28 Rosh Chodesh Adar
1960-02-29 Rosh Chodesh Adar
1960-03-10 Ta'anit Esther
1960-03-12 Shabbat Zachor
1960-03-12 Erev Purim
1960-03-13 Purim
1960-03-14 Shushan Purim
1960-03-19 Shabbat Parah
1960-03-26 Shabbat HaChodesh
1960-03-29 Rosh Chodesh Nisan
1960-04-09 Shabbat HaGadol
1960-04-11 Ta'anit Bechorot
1960-04-11 Erev Pesach
1960-04-12 Pesach I
1960-04-13 Pesach II (CH''M)
1960-04-14 Pesach III (CH''M)
1960-04-15 Pesach IV (CH''M)
1960-04-16 Pesach V (CH''M)
1960-04-17 Pesach VI (CH''M)
1960-04-18 Pesach VII
1960-04-25 Yom HaShoah
1960-04-27 Rosh Chodesh Iyyar
1960-04-28 Rosh Chodesh Iyyar
1960-05-01 Yom HaZikaron
1960-05-02 Yom HaAtzma'ut
1960-05-11 Pesach Sheni
1960-05-15 Lag BaOmer
1960-05-27 Rosh Chodesh Sivan
1960-05-31 Erev Shavuot
1960-06-01 Shavuot
1960-06-25 Rosh Chodesh Tamuz
1960-06-26 Rosh Chodesh Tamuz
1960-07-12 Tzom Tammuz
1960-07-25 Rosh Chodesh Av
1960-07-30 Shabbat Chazon
1960-08-01 Erev Tish'a B'Av
1960-08-02 Tish'a B'Av
1960-08-06 Shabbat Nachamu
1960-08-08 Tu B'Av
1960-08-23 Rosh Chodesh Elul
1960-08-24 Rosh Chodesh Elul
1960-09-17 Leil Selichot
1960-09-21 Erev Rosh Hashana`.split('\n').sort();
}

// hebcal -H 5771
// eslint-disable-next-line require-jsdoc
function diaspora5771() {
  return `2010-09-09 Rosh Hashana 5771
2010-09-10 Rosh Hashana II
2010-09-11 Shabbat Shuva
2010-09-12 Tzom Gedaliah
2010-09-17 Erev Yom Kippur
2010-09-18 Yom Kippur
2010-09-22 Erev Sukkot
2010-09-23 Sukkot I
2010-09-24 Sukkot II
2010-09-25 Sukkot III (CH''M)
2010-09-26 Sukkot IV (CH''M)
2010-09-27 Sukkot V (CH''M)
2010-09-28 Sukkot VI (CH''M)
2010-09-29 Sukkot VII (Hoshana Raba)
2010-09-30 Shmini Atzeret
2010-10-01 Simchat Torah
2010-10-08 Rosh Chodesh Cheshvan
2010-10-09 Rosh Chodesh Cheshvan
2010-11-06 Sigd
2010-11-07 Rosh Chodesh Kislev
2010-11-08 Rosh Chodesh Kislev
2010-12-01 Chanukah: 1 Candle
2010-12-02 Chanukah: 2 Candles
2010-12-03 Chanukah: 3 Candles
2010-12-04 Chanukah: 4 Candles
2010-12-05 Chanukah: 5 Candles
2010-12-06 Chanukah: 6 Candles
2010-12-07 Rosh Chodesh Tevet
2010-12-07 Chanukah: 7 Candles
2010-12-08 Rosh Chodesh Tevet
2010-12-08 Chanukah: 8 Candles
2010-12-09 Chanukah: 8th Day
2010-12-17 Asara B'Tevet
2011-01-06 Rosh Chodesh Sh'vat
2011-01-20 Tu BiShvat
2011-02-04 Rosh Chodesh Adar I
2011-02-05 Rosh Chodesh Adar I
2011-02-18 Purim Katan
2011-03-05 Shabbat Shekalim
2011-03-06 Rosh Chodesh Adar II
2011-03-07 Rosh Chodesh Adar II
2011-03-17 Ta'anit Esther
2011-03-19 Shabbat Zachor
2011-03-19 Erev Purim
2011-03-20 Purim
2011-03-21 Shushan Purim
2011-03-26 Shabbat Parah
2011-04-02 Shabbat HaChodesh
2011-04-05 Rosh Chodesh Nisan
2011-04-16 Shabbat HaGadol
2011-04-18 Ta'anit Bechorot
2011-04-18 Erev Pesach
2011-04-19 Pesach I
2011-04-20 Pesach II
2011-04-21 Pesach III (CH''M)
2011-04-22 Pesach IV (CH''M)
2011-04-23 Pesach V (CH''M)
2011-04-24 Pesach VI (CH''M)
2011-04-25 Pesach VII
2011-04-26 Pesach VIII
2011-05-02 Yom HaShoah
2011-05-04 Rosh Chodesh Iyyar
2011-05-05 Rosh Chodesh Iyyar
2011-05-09 Yom HaZikaron
2011-05-10 Yom HaAtzma'ut
2011-05-18 Pesach Sheni
2011-05-22 Lag BaOmer
2011-06-01 Yom Yerushalayim
2011-06-03 Rosh Chodesh Sivan
2011-06-07 Erev Shavuot
2011-06-08 Shavuot I
2011-06-09 Shavuot II
2011-07-02 Rosh Chodesh Tamuz
2011-07-03 Rosh Chodesh Tamuz
2011-07-19 Tzom Tammuz
2011-08-01 Rosh Chodesh Av
2011-08-06 Shabbat Chazon
2011-08-08 Erev Tish'a B'Av
2011-08-09 Tish'a B'Av
2011-08-13 Shabbat Nachamu
2011-08-15 Tu B'Av
2011-08-30 Rosh Chodesh Elul
2011-08-31 Rosh Chodesh Elul
2011-09-24 Leil Selichot
2011-09-28 Erev Rosh Hashana`.split('\n').sort();
}

// eslint-disable-next-line require-jsdoc
function eventTitleDateHebrew(ev) {
  return {
    date: ev.getDate().greg().toISOString().substring(0, 10),
    basename: ev.basename(),
    desc: ev.getDesc(),
  };
}

test('9av-observed', (t) => {
  const events = HebrewCalendar.calendar({year: 2015, numYears: 10});
  const av9 = events.filter((ev) => ev.getDesc().substring(0, 11) === 'Tish\'a B\'Av');
  const actual = av9.map(eventTitleDateHebrew);
  const expected = [
    {date: '2015-07-26', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av (observed)'},
    {date: '2016-08-14', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av (observed)'},
    {date: '2017-08-01', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av'},
    {date: '2018-07-22', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av (observed)'},
    {date: '2019-08-11', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av (observed)'},
    {date: '2020-07-30', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av'},
    {date: '2021-07-18', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av'},
    {date: '2022-08-07', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av (observed)'},
    {date: '2023-07-27', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av'},
    {date: '2024-08-13', basename: 'Tish\'a B\'Av', desc: 'Tish\'a B\'Av'},
  ];
  t.deepEqual(actual, expected);
  t.is(av9[0].render('he'), 'תִּשְׁעָה בְּאָב נִדחֶה');
  t.is(av9[2].render('he'), 'תִּשְׁעָה בְּאָב');
});

test('asara-btevet-url', (t) => {
  const urls = HebrewCalendar.calendar({year: 2020})
      .filter((ev) => ev.getDesc() === 'Asara B\'Tevet')
      .map((ev) => ev.url());
  const expected = [
    'https://www.hebcal.com/holidays/asara-btevet-20200107',
    'https://www.hebcal.com/holidays/asara-btevet-20201225',
  ];
  t.deepEqual(urls, expected);
});
