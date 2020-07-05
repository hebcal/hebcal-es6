import test from 'ava';
import {HolidayEvent, RoshChodeshEvent, MevarchimChodeshEvent} from './holidays';
import {HebrewCalendar} from './hebcal';
import {greg as g} from './greg';
import {HDate, months} from './hdate';
import {flags} from './event';

test('basename-and-url', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  t.is(ev.getDesc(), 'Pesach IV (CH\'\'M)');
  t.is(ev.render(), 'Pesach IV (CH\'\'M)');
  t.is(ev.renderBrief(), 'Pesach IV (CH\'\'M)');
  t.is(ev.basename(), 'Pesach');
  t.is(ev.url(), 'https://www.hebcal.com/holidays/pesach');

  const ev2 = new HolidayEvent(new HDate(23, months.TISHREI, 5763),
      'Simchat Torah', flags.CHUL_ONLY);
  t.is(ev2.getDesc(), 'Simchat Torah');
  t.is(ev2.render(), 'Simchat Torah');
  t.is(ev2.renderBrief(), 'Simchat Torah');
  t.is(ev2.basename(), 'Simchat Torah');
  t.is(ev2.url(), 'https://www.hebcal.com/holidays/simchat-torah');

  const ev3 = new HolidayEvent(new HDate(8, months.AV, 5783),
      'Erev Tish\'a B\'Av', flags.MAJOR_FAST);
  t.is(ev3.getDesc(), 'Erev Tish\'a B\'Av');
  t.is(ev3.render(), 'Erev Tish\'a B\'Av');
  t.is(ev3.renderBrief(), 'Erev Tish\'a B\'Av');
  t.is(ev3.basename(), 'Tish\'a B\'Av');
  t.is(ev3.url(), 'https://www.hebcal.com/holidays/tisha-bav');

  const rch = new RoshChodeshEvent(new HDate(30, months.ADAR_I, 5787), 'Adar II');
  t.is(rch.getDesc(), 'Rosh Chodesh Adar II');
  t.is(rch.render(), 'Rosh Chodesh Adar II');
  t.is(rch.renderBrief(), 'Rosh Chodesh Adar II');
  t.is(rch.basename(), 'Rosh Chodesh Adar II');
  t.is(rch.url(), 'https://www.hebcal.com/holidays/rosh-chodesh-adar-ii');

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

/**
 * @param {Object} t
 * @param {number} hyear
 * @param {boolean} il
 * @param {string[]} expected0
 * @private
 */
function testFullYear(t, hyear, il, expected0) {
  const expected = {};
  for (const line of expected0) {
    const space = line.indexOf(' ');
    const dt = line.substring(0, space);
    const desc = line.substring(space + 1);
    if (expected[dt]) {
      expected[dt].push(desc);
    } else {
      expected[dt] = [desc];
    }
  }
  const year = HebrewCalendar.getHolidaysForYear(hyear);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1);
  for (let absDt = startAbs; absDt <= endAbs; absDt++) {
    const hebDt = new HDate(absDt);
    const gregDt = g.abs2greg(absDt);
    const dateStr = gregDt.toLocaleDateString('en-US');
    const ev = year.get(hebDt.toString());
    if (typeof ev !== 'undefined') {
      const evFiltered = ev.filter((e) => !(e.getFlags() & flags.SHABBAT_MEVARCHIM));
      for (const e of evFiltered) {
        if ((il && e.observedInIsrael()) || (!il && e.observedInDiaspora())) {
          const desc = e.getDesc();
          if (expected[dateStr]) {
            let found = false;
            for (const h of expected[dateStr]) {
              if (h === desc) {
                found = true;
                t.is(desc, h);
              }
            }
            if (!found) {
              const j = expected[dateStr].join(',');
              t.fail(`Found "${desc}" on ${dateStr}, but we expected {${j}}`);
            }
          } else {
            t.fail(`Unexpected ${dateStr} ${desc}`);
          }
        }
      }
    } else if (expected[dateStr]) {
      const j = expected[dateStr].join(',');
      t.fail(`No events found on ${dateStr}, but we expected {${j}}`);
    }
  }
}

test('diaspora', (t) => {
  const expected = diaspora5771();
  testFullYear(t, 5771, false, expected);
});

test('israel', (t) => {
  const expected = israel5720();
  testFullYear(t, 5720, true, expected);
});

// hebcal -i -H -5720
// eslint-disable-next-line require-jsdoc
function israel5720() {
  return `10/2/1959 Erev Rosh Hashana
10/3/1959 Rosh Hashana 5720
10/4/1959 Rosh Hashana II
10/5/1959 Tzom Gedaliah
10/10/1959 Shabbat Shuva
10/11/1959 Erev Yom Kippur
10/12/1959 Yom Kippur
10/16/1959 Erev Sukkot
10/17/1959 Sukkot I
10/18/1959 Sukkot II (CH''M)
10/19/1959 Sukkot III (CH''M)
10/20/1959 Sukkot IV (CH''M)
10/21/1959 Sukkot V (CH''M)
10/22/1959 Sukkot VI (CH''M)
10/23/1959 Sukkot VII (Hoshana Raba)
10/24/1959 Shmini Atzeret
11/1/1959 Rosh Chodesh Cheshvan
11/2/1959 Rosh Chodesh Cheshvan
12/1/1959 Rosh Chodesh Kislev
12/2/1959 Rosh Chodesh Kislev
12/25/1959 Chanukah: 1 Candle
12/26/1959 Chanukah: 2 Candles
12/27/1959 Chanukah: 3 Candles
12/28/1959 Chanukah: 4 Candles
12/29/1959 Chanukah: 5 Candles
12/30/1959 Chanukah: 6 Candles
12/31/1959 Rosh Chodesh Tevet
12/31/1959 Chanukah: 7 Candles
1/1/1960 Rosh Chodesh Tevet
1/1/1960 Chanukah: 8 Candles
1/2/1960 Chanukah: 8th Day
1/10/1960 Asara B'Tevet
1/30/1960 Rosh Chodesh Sh'vat
2/13/1960 Tu BiShvat
2/27/1960 Shabbat Shekalim
2/28/1960 Rosh Chodesh Adar
2/29/1960 Rosh Chodesh Adar
3/10/1960 Ta'anit Esther
3/12/1960 Shabbat Zachor
3/12/1960 Erev Purim
3/13/1960 Purim
3/14/1960 Shushan Purim
3/19/1960 Shabbat Parah
3/26/1960 Shabbat HaChodesh
3/29/1960 Rosh Chodesh Nisan
4/9/1960 Shabbat HaGadol
4/11/1960 Ta'anit Bechorot
4/11/1960 Erev Pesach
4/12/1960 Pesach I
4/13/1960 Pesach II (CH''M)
4/14/1960 Pesach III (CH''M)
4/15/1960 Pesach IV (CH''M)
4/16/1960 Pesach V (CH''M)
4/17/1960 Pesach VI (CH''M)
4/18/1960 Pesach VII
4/25/1960 Yom HaShoah
4/27/1960 Rosh Chodesh Iyyar
4/28/1960 Rosh Chodesh Iyyar
5/1/1960 Yom HaZikaron
5/2/1960 Yom HaAtzma'ut
5/11/1960 Pesach Sheni
5/15/1960 Lag BaOmer
5/27/1960 Rosh Chodesh Sivan
5/31/1960 Erev Shavuot
6/1/1960 Shavuot
6/25/1960 Rosh Chodesh Tamuz
6/26/1960 Rosh Chodesh Tamuz
7/12/1960 Tzom Tammuz
7/25/1960 Rosh Chodesh Av
7/30/1960 Shabbat Chazon
8/1/1960 Erev Tish'a B'Av
8/2/1960 Tish'a B'Av
8/6/1960 Shabbat Nachamu
8/8/1960 Tu B'Av
8/23/1960 Rosh Chodesh Elul
8/24/1960 Rosh Chodesh Elul
9/17/1960 Leil Selichot
9/21/1960 Erev Rosh Hashana
`.split('\n');
}

// hebcal -H 5771
// eslint-disable-next-line require-jsdoc
function diaspora5771() {
  return `9/9/2010 Rosh Hashana 5771
9/10/2010 Rosh Hashana II
9/11/2010 Shabbat Shuva
9/12/2010 Tzom Gedaliah
9/17/2010 Erev Yom Kippur
9/18/2010 Yom Kippur
9/22/2010 Erev Sukkot
9/23/2010 Sukkot I
9/24/2010 Sukkot II
9/25/2010 Sukkot III (CH''M)
9/26/2010 Sukkot IV (CH''M)
9/27/2010 Sukkot V (CH''M)
9/28/2010 Sukkot VI (CH''M)
9/29/2010 Sukkot VII (Hoshana Raba)
9/30/2010 Shmini Atzeret
10/1/2010 Simchat Torah
10/8/2010 Rosh Chodesh Cheshvan
10/9/2010 Rosh Chodesh Cheshvan
11/6/2010 Sigd
11/7/2010 Rosh Chodesh Kislev
11/8/2010 Rosh Chodesh Kislev
12/1/2010 Chanukah: 1 Candle
12/2/2010 Chanukah: 2 Candles
12/3/2010 Chanukah: 3 Candles
12/4/2010 Chanukah: 4 Candles
12/5/2010 Chanukah: 5 Candles
12/6/2010 Chanukah: 6 Candles
12/7/2010 Rosh Chodesh Tevet
12/7/2010 Chanukah: 7 Candles
12/8/2010 Rosh Chodesh Tevet
12/8/2010 Chanukah: 8 Candles
12/9/2010 Chanukah: 8th Day
12/17/2010 Asara B'Tevet
1/6/2011 Rosh Chodesh Sh'vat
1/20/2011 Tu BiShvat
2/4/2011 Rosh Chodesh Adar I
2/5/2011 Rosh Chodesh Adar I
2/18/2011 Purim Katan
3/5/2011 Shabbat Shekalim
3/6/2011 Rosh Chodesh Adar II
3/7/2011 Rosh Chodesh Adar II
3/17/2011 Ta'anit Esther
3/19/2011 Shabbat Zachor
3/19/2011 Erev Purim
3/20/2011 Purim
3/21/2011 Shushan Purim
3/26/2011 Shabbat Parah
4/2/2011 Shabbat HaChodesh
4/5/2011 Rosh Chodesh Nisan
4/16/2011 Shabbat HaGadol
4/18/2011 Ta'anit Bechorot
4/18/2011 Erev Pesach
4/19/2011 Pesach I
4/20/2011 Pesach II
4/20/2011 Hello****
4/21/2011 Pesach III (CH''M)
4/22/2011 Pesach IV (CH''M)
4/23/2011 Pesach V (CH''M)
4/24/2011 Pesach VI (CH''M)
4/25/2011 Pesach VII
4/26/2011 Pesach VIII
5/2/2011 Yom HaShoah
5/4/2011 Rosh Chodesh Iyyar
5/5/2011 Rosh Chodesh Iyyar
5/9/2011 Yom HaZikaron
5/10/2011 Yom HaAtzma'ut
5/18/2011 Pesach Sheni
5/22/2011 Lag BaOmer
6/1/2011 Yom Yerushalayim
6/3/2011 Rosh Chodesh Sivan
6/7/2011 Erev Shavuot
6/8/2011 Shavuot I
6/9/2011 Shavuot II
7/2/2011 Rosh Chodesh Tamuz
7/3/2011 Rosh Chodesh Tamuz
7/19/2011 Tzom Tammuz
8/1/2011 Rosh Chodesh Av
8/6/2011 Shabbat Chazon
8/8/2011 Erev Tish'a B'Av
8/9/2011 Tish'a B'Av
8/13/2011 Shabbat Nachamu
8/15/2011 Tu B'Av
8/30/2011 Rosh Chodesh Elul
8/31/2011 Rosh Chodesh Elul
9/24/2011 Leil Selichot
9/28/2011 Erev Rosh Hashana
`.split('\n');
}
