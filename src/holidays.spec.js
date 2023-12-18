import test from 'ava';
import {months} from '@hebcal/hdate';
import {HolidayEvent, RoshChodeshEvent, MevarchimChodeshEvent} from './holidays.js';
import {HebrewCalendar} from './hebcal.js';
import {HDate} from './hdate.js';
import {flags, Event} from './event.js';

test('basename-and-url', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  t.is(ev.getDesc(), 'Pesach IV (CH\'\'M)');
  t.is(ev.render('en'), 'Pesach IV (CH\'\'M)');
  t.is(ev.renderBrief('en'), 'Pesach IV (CH\'\'M)');
  t.is(ev.basename(), 'Pesach');
  t.is(ev.url(), 'https://www.hebcal.com/holidays/pesach-2003');

  const ev2 = new HolidayEvent(new HDate(23, months.TISHREI, 5763),
      'Simchat Torah', flags.CHUL_ONLY);
  t.is(ev2.getDesc(), 'Simchat Torah');
  t.is(ev2.render('en'), 'Simchat Torah');
  t.is(ev2.renderBrief('en'), 'Simchat Torah');
  t.is(ev2.basename(), 'Simchat Torah');
  t.is(ev2.url(), 'https://www.hebcal.com/holidays/simchat-torah-2002');

  const ev3 = new HolidayEvent(new HDate(8, months.AV, 5783),
      'Erev Tish\'a B\'Av', flags.MAJOR_FAST);
  t.is(ev3.getDesc(), 'Erev Tish\'a B\'Av');
  t.is(ev3.render('en'), 'Erev Tish\'a B\'Av');
  t.is(ev3.renderBrief('en'), 'Erev Tish\'a B\'Av');
  t.is(ev3.basename(), 'Tish\'a B\'Av');
  t.is(ev3.url(), 'https://www.hebcal.com/holidays/tisha-bav-2023');

  const rch = new RoshChodeshEvent(new HDate(30, months.ADAR_I, 5787), 'Adar II');
  t.is(rch.getDesc(), 'Rosh Chodesh Adar II');
  t.is(rch.render('en'), 'Rosh Chodesh Adar II');
  t.is(rch.renderBrief('en'), 'Rosh Chodesh Adar II');
  t.is(rch.basename(), 'Rosh Chodesh Adar II');
  t.is(rch.url(), 'https://www.hebcal.com/holidays/rosh-chodesh-adar-ii-2027');

  const mvch = new MevarchimChodeshEvent(new HDate(23, months.KISLEV, 5769), 'Tevet');
  t.is(mvch.getDesc(), 'Shabbat Mevarchim Chodesh Tevet');
  t.is(mvch.render('en'), 'Shabbat Mevarchim Chodesh Tevet');
  t.is(mvch.renderBrief('en'), 'Shabbat Mevarchim Chodesh Tevet');
  t.is(mvch.url(), undefined);
});

test('observedInIsrael and url contains ?i=on', (t) => {
  const erev = new HolidayEvent(new HDate(5, months.SIVAN, 5777),
      'Erev Shavuot', flags.EREV | flags.LIGHT_CANDLES);
  t.is(erev.observedInIsrael(), true);
  t.is(erev.observedInDiaspora(), true);
  t.is(erev.url(), 'https://www.hebcal.com/holidays/shavuot-2017');

  const shavuot = new HolidayEvent(new HDate(6, months.SIVAN, 5777),
      'Shavuot', flags.CHAG | flags.YOM_TOV_ENDS | flags.IL_ONLY);
  t.is(shavuot.observedInIsrael(), true);
  t.is(shavuot.observedInDiaspora(), false);
  t.is(shavuot.url(), 'https://www.hebcal.com/holidays/shavuot-2017?i=on');

  const shavuotI = new HolidayEvent(new HDate(6, months.SIVAN, 5777),
      'Shavuot I', flags.CHAG | flags.LIGHT_CANDLES_TZEIS | flags.CHUL_ONLY);
  t.is(shavuotI.observedInIsrael(), false);
  t.is(shavuotI.observedInDiaspora(), true);
  t.is(shavuotI.url(), 'https://www.hebcal.com/holidays/shavuot-2017');

  const shavuotII = new HolidayEvent(new HDate(7, months.SIVAN, 5777),
      'Shavuot II', flags.CHAG | flags.YOM_TOV_ENDS | flags.CHUL_ONLY);
  t.is(shavuotII.observedInIsrael(), false);
  t.is(shavuotII.observedInDiaspora(), true);
  t.is(shavuotII.url(), 'https://www.hebcal.com/holidays/shavuot-2017');
});

test('MevarchimChodeshEvent', (t) => {
  const mvch = new MevarchimChodeshEvent(new HDate(23, months.KISLEV, 5769), 'Tevet');
  t.is(mvch.memo, 'Molad Tevet: Sat, 10 minutes and 16 chalakim after 16:00');
});

test('Shushan Purim', (t) => {
  const events = HebrewCalendar.calendar({
    start: new HDate(13, 'Adar2', 5782),
    end: new HDate(17, 'Adar2', 5782),
  });
  const actual = events.map(eventDateDesc);
  const expected = [
    {date: '2022-03-16', desc: 'Ta\'anit Esther'},
    {date: '2022-03-16', desc: 'Erev Purim'},
    {date: '2022-03-17', desc: 'Purim'},
    {date: '2022-03-18', desc: 'Shushan Purim'},
  ];
  t.deepEqual(actual, expected);
});

test('Purim Meshulash', (t) => {
  const events = HebrewCalendar.calendar({
    start: new HDate(13, 'Adar2', 5785),
    end: new HDate(17, 'Adar2', 5785),
  });
  const actual = events.map(eventDateDesc);
  const expected = [
    {date: '2025-03-13', desc: 'Ta\'anit Esther'},
    {date: '2025-03-13', desc: 'Erev Purim'},
    {date: '2025-03-14', desc: 'Purim'},
    {date: '2025-03-15', desc: 'Shushan Purim'},
    {date: '2025-03-16', desc: 'Purim Meshulash'},
  ];
  t.deepEqual(actual, expected);
});

test('getHolidaysOnDate', (t) => {
  const hyear = 5771;
  const expected = [
    new HDate(1, 'Tishrei', hyear).abs() - 1, ['Erev Rosh Hashana'],
    new HDate(1, 'Tishrei', hyear), ['Rosh Hashana 5771'],
    new HDate(10, 'Tishrei', hyear), ['Yom Kippur'],
    new HDate(3, 'Cheshvan', hyear), undefined,
    new Date(2010, 11, 7), ['Chag HaBanot', 'Chanukah: 7 Candles', 'Rosh Chodesh Tevet'],
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

test('getHolidaysForYearArray-5771-diaspora', (t) => {
  const events = HebrewCalendar.getHolidaysForYearArray(5771, false).map(eventDateDesc);
  const expected = [
    {date: '2010-09-09', desc: 'Rosh Hashana 5771'},
    {date: '2010-09-10', desc: 'Rosh Hashana II'},
    {date: '2010-09-11', desc: 'Shabbat Shuva'},
    {date: '2010-09-12', desc: 'Tzom Gedaliah'},
    {date: '2010-09-17', desc: 'Erev Yom Kippur'},
    {date: '2010-09-18', desc: 'Yom Kippur'},
    {date: '2010-09-22', desc: 'Erev Sukkot'},
    {date: '2010-09-23', desc: 'Sukkot I'},
    {date: '2010-09-24', desc: 'Sukkot II'},
    {date: '2010-09-25', desc: 'Sukkot III (CH\'\'M)'},
    {date: '2010-09-26', desc: 'Sukkot IV (CH\'\'M)'},
    {date: '2010-09-27', desc: 'Sukkot V (CH\'\'M)'},
    {date: '2010-09-28', desc: 'Sukkot VI (CH\'\'M)'},
    {date: '2010-09-29', desc: 'Sukkot VII (Hoshana Raba)'},
    {date: '2010-09-30', desc: 'Shmini Atzeret'},
    {date: '2010-10-01', desc: 'Simchat Torah'},
    {date: '2010-10-02', desc: 'Shabbat Mevarchim Chodesh Cheshvan'},
    {date: '2010-10-08', desc: 'Rosh Chodesh Cheshvan'},
    {date: '2010-10-09', desc: 'Rosh Chodesh Cheshvan'},
    {date: '2010-11-04', desc: 'Yom Kippur Katan Kislev'},
    {date: '2010-11-06', desc: 'Sigd'},
    {date: '2010-11-06', desc: 'Shabbat Mevarchim Chodesh Kislev'},
    {date: '2010-11-07', desc: 'Rosh Chodesh Kislev'},
    {date: '2010-11-08', desc: 'Rosh Chodesh Kislev'},
    {date: '2010-12-01', desc: 'Chanukah: 1 Candle'},
    {date: '2010-12-02', desc: 'Chanukah: 2 Candles'},
    {date: '2010-12-03', desc: 'Chanukah: 3 Candles'},
    {date: '2010-12-04', desc: 'Chanukah: 4 Candles'},
    {date: '2010-12-04', desc: 'Shabbat Mevarchim Chodesh Tevet'},
    {date: '2010-12-05', desc: 'Chanukah: 5 Candles'},
    {date: '2010-12-06', desc: 'Chanukah: 6 Candles'},
    {date: '2010-12-07', desc: 'Chag HaBanot'},
    {date: '2010-12-07', desc: 'Chanukah: 7 Candles'},
    {date: '2010-12-07', desc: 'Rosh Chodesh Tevet'},
    {date: '2010-12-08', desc: 'Chanukah: 8 Candles'},
    {date: '2010-12-08', desc: 'Rosh Chodesh Tevet'},
    {date: '2010-12-09', desc: 'Chanukah: 8th Day'},
    {date: '2010-12-17', desc: 'Asara B\'Tevet'},
    {date: '2011-01-01', desc: 'Shabbat Mevarchim Chodesh Sh\'vat'},
    {date: '2011-01-05', desc: 'Yom Kippur Katan Sh\'vat'},
    {date: '2011-01-06', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '2011-01-15', desc: 'Shabbat Shirah'},
    {date: '2011-01-20', desc: 'Tu BiShvat'},
    {date: '2011-01-29', desc: 'Shabbat Mevarchim Chodesh Adar I'},
    {date: '2011-02-03', desc: 'Yom Kippur Katan Adar I'},
    {date: '2011-02-04', desc: 'Rosh Chodesh Adar I'},
    {date: '2011-02-05', desc: 'Rosh Chodesh Adar I'},
    {date: '2011-02-18', desc: 'Purim Katan'},
    {date: '2011-02-19', desc: 'Shushan Purim Katan'},
    {date: '2011-03-03', desc: 'Yom Kippur Katan Adar II'},
    {date: '2011-03-05', desc: 'Shabbat Shekalim'},
    {date: '2011-03-05', desc: 'Shabbat Mevarchim Chodesh Adar II'},
    {date: '2011-03-06', desc: 'Rosh Chodesh Adar II'},
    {date: '2011-03-07', desc: 'Rosh Chodesh Adar II'},
    {date: '2011-03-17', desc: 'Ta\'anit Esther'},
    {date: '2011-03-19', desc: 'Shabbat Zachor'},
    {date: '2011-03-19', desc: 'Erev Purim'},
    {date: '2011-03-20', desc: 'Purim'},
    {date: '2011-03-21', desc: 'Shushan Purim'},
    {date: '2011-03-26', desc: 'Shabbat Parah'},
    {date: '2011-04-02', desc: 'Shabbat HaChodesh'},
    {date: '2011-04-02', desc: 'Shabbat Mevarchim Chodesh Nisan'},
    {date: '2011-04-04', desc: 'Yom Kippur Katan Nisan'},
    {date: '2011-04-05', desc: 'Rosh Chodesh Nisan'},
    {date: '2011-04-16', desc: 'Shabbat HaGadol'},
    {date: '2011-04-18', desc: 'Ta\'anit Bechorot'},
    {date: '2011-04-18', desc: 'Erev Pesach'},
    {date: '2011-04-19', desc: 'Pesach I'},
    {date: '2011-04-20', desc: 'Pesach II'},
    {date: '2011-04-21', desc: 'Pesach III (CH\'\'M)'},
    {date: '2011-04-22', desc: 'Pesach IV (CH\'\'M)'},
    {date: '2011-04-23', desc: 'Pesach V (CH\'\'M)'},
    {date: '2011-04-24', desc: 'Pesach VI (CH\'\'M)'},
    {date: '2011-04-25', desc: 'Pesach VII'},
    {date: '2011-04-26', desc: 'Pesach VIII'},
    {date: '2011-04-30', desc: 'Shabbat Mevarchim Chodesh Iyyar'},
    {date: '2011-05-02', desc: 'Yom HaShoah'},
    {date: '2011-05-04', desc: 'Rosh Chodesh Iyyar'},
    {date: '2011-05-05', desc: 'Rosh Chodesh Iyyar'},
    {date: '2011-05-09', desc: 'Yom HaZikaron'},
    {date: '2011-05-10', desc: 'Yom HaAtzma\'ut'},
    {date: '2011-05-18', desc: 'Pesach Sheni'},
    {date: '2011-05-22', desc: 'Lag BaOmer'},
    {date: '2011-05-28', desc: 'Shabbat Mevarchim Chodesh Sivan'},
    {date: '2011-06-01', desc: 'Yom Yerushalayim'},
    {date: '2011-06-02', desc: 'Yom Kippur Katan Sivan'},
    {date: '2011-06-03', desc: 'Rosh Chodesh Sivan'},
    {date: '2011-06-07', desc: 'Erev Shavuot'},
    {date: '2011-06-08', desc: 'Shavuot I'},
    {date: '2011-06-09', desc: 'Shavuot II'},
    {date: '2011-06-25', desc: 'Shabbat Mevarchim Chodesh Tamuz'},
    {date: '2011-06-30', desc: 'Yom Kippur Katan Tamuz'},
    {date: '2011-07-02', desc: 'Rosh Chodesh Tamuz'},
    {date: '2011-07-03', desc: 'Rosh Chodesh Tamuz'},
    {date: '2011-07-19', desc: 'Tzom Tammuz'},
    {date: '2011-07-30', desc: 'Shabbat Mevarchim Chodesh Av'},
    {date: '2011-07-31', desc: 'Yom Kippur Katan Av'},
    {date: '2011-08-01', desc: 'Rosh Chodesh Av'},
    {date: '2011-08-06', desc: 'Shabbat Chazon'},
    {date: '2011-08-08', desc: 'Erev Tish\'a B\'Av'},
    {date: '2011-08-09', desc: 'Tish\'a B\'Av'},
    {date: '2011-08-13', desc: 'Shabbat Nachamu'},
    {date: '2011-08-15', desc: 'Tu B\'Av'},
    {date: '2011-08-27', desc: 'Shabbat Mevarchim Chodesh Elul'},
    {date: '2011-08-29', desc: 'Yom Kippur Katan Elul'},
    {date: '2011-08-30', desc: 'Rosh Chodesh Elul'},
    {date: '2011-08-31', desc: 'Rosh Hashana LaBehemot'},
    {date: '2011-08-31', desc: 'Rosh Chodesh Elul'},
    {date: '2011-09-24', desc: 'Leil Selichot'},
    {date: '2011-09-28', desc: 'Erev Rosh Hashana'},
  ];
  t.deepEqual(events, expected);
});

test('getHolidaysForYearArray-5720-il', (t) => {
  const events = HebrewCalendar.getHolidaysForYearArray(5720, true).map(eventDateDesc);
  const expected = [
    {date: '1959-10-03', desc: 'Rosh Hashana 5720'},
    {date: '1959-10-04', desc: 'Rosh Hashana II'},
    {date: '1959-10-05', desc: 'Tzom Gedaliah'},
    {date: '1959-10-10', desc: 'Shabbat Shuva'},
    {date: '1959-10-11', desc: 'Erev Yom Kippur'},
    {date: '1959-10-12', desc: 'Yom Kippur'},
    {date: '1959-10-16', desc: 'Erev Sukkot'},
    {date: '1959-10-17', desc: 'Sukkot I'},
    {date: '1959-10-18', desc: 'Sukkot II (CH\'\'M)'},
    {date: '1959-10-19', desc: 'Sukkot III (CH\'\'M)'},
    {date: '1959-10-20', desc: 'Sukkot IV (CH\'\'M)'},
    {date: '1959-10-21', desc: 'Sukkot V (CH\'\'M)'},
    {date: '1959-10-22', desc: 'Sukkot VI (CH\'\'M)'},
    {date: '1959-10-23', desc: 'Sukkot VII (Hoshana Raba)'},
    {date: '1959-10-24', desc: 'Shmini Atzeret'},
    {date: '1959-10-31', desc: 'Shabbat Mevarchim Chodesh Cheshvan'},
    {date: '1959-11-01', desc: 'Rosh Chodesh Cheshvan'},
    {date: '1959-11-02', desc: 'Rosh Chodesh Cheshvan'},
    {date: '1959-11-28', desc: 'Shabbat Mevarchim Chodesh Kislev'},
    {date: '1959-11-30', desc: 'Yom Kippur Katan Kislev'},
    {date: '1959-12-01', desc: 'Rosh Chodesh Kislev'},
    {date: '1959-12-02', desc: 'Rosh Chodesh Kislev'},
    {date: '1959-12-25', desc: 'Chanukah: 1 Candle'},
    {date: '1959-12-26', desc: 'Chanukah: 2 Candles'},
    {date: '1959-12-26', desc: 'Shabbat Mevarchim Chodesh Tevet'},
    {date: '1959-12-27', desc: 'Chanukah: 3 Candles'},
    {date: '1959-12-28', desc: 'Chanukah: 4 Candles'},
    {date: '1959-12-29', desc: 'Chanukah: 5 Candles'},
    {date: '1959-12-30', desc: 'Chanukah: 6 Candles'},
    {date: '1959-12-31', desc: 'Chag HaBanot'},
    {date: '1959-12-31', desc: 'Chanukah: 7 Candles'},
    {date: '1959-12-31', desc: 'Rosh Chodesh Tevet'},
    {date: '1960-01-01', desc: 'Chanukah: 8 Candles'},
    {date: '1960-01-01', desc: 'Rosh Chodesh Tevet'},
    {date: '1960-01-02', desc: 'Chanukah: 8th Day'},
    {date: '1960-01-10', desc: 'Asara B\'Tevet'},
    {date: '1960-01-23', desc: 'Shabbat Mevarchim Chodesh Sh\'vat'},
    {date: '1960-01-28', desc: 'Yom Kippur Katan Sh\'vat'},
    {date: '1960-01-30', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '1960-02-13', desc: 'Tu BiShvat'},
    {date: '1960-02-13', desc: 'Shabbat Shirah'},
    {date: '1960-02-25', desc: 'Yom Kippur Katan Adar'},
    {date: '1960-02-27', desc: 'Shabbat Shekalim'},
    {date: '1960-02-27', desc: 'Shabbat Mevarchim Chodesh Adar'},
    {date: '1960-02-28', desc: 'Rosh Chodesh Adar'},
    {date: '1960-02-29', desc: 'Rosh Chodesh Adar'},
    {date: '1960-03-10', desc: 'Ta\'anit Esther'},
    {date: '1960-03-12', desc: 'Shabbat Zachor'},
    {date: '1960-03-12', desc: 'Erev Purim'},
    {date: '1960-03-13', desc: 'Purim'},
    {date: '1960-03-14', desc: 'Shushan Purim'},
    {date: '1960-03-19', desc: 'Shabbat Parah'},
    {date: '1960-03-26', desc: 'Shabbat HaChodesh'},
    {date: '1960-03-26', desc: 'Shabbat Mevarchim Chodesh Nisan'},
    {date: '1960-03-28', desc: 'Yom Kippur Katan Nisan'},
    {date: '1960-03-29', desc: 'Rosh Chodesh Nisan'},
    {date: '1960-04-09', desc: 'Shabbat HaGadol'},
    {date: '1960-04-11', desc: 'Ta\'anit Bechorot'},
    {date: '1960-04-11', desc: 'Erev Pesach'},
    {date: '1960-04-12', desc: 'Pesach I'},
    {date: '1960-04-13', desc: 'Pesach II (CH\'\'M)'},
    {date: '1960-04-14', desc: 'Pesach III (CH\'\'M)'},
    {date: '1960-04-15', desc: 'Pesach IV (CH\'\'M)'},
    {date: '1960-04-16', desc: 'Pesach V (CH\'\'M)'},
    {date: '1960-04-17', desc: 'Pesach VI (CH\'\'M)'},
    {date: '1960-04-18', desc: 'Pesach VII'},
    {date: '1960-04-23', desc: 'Shabbat Mevarchim Chodesh Iyyar'},
    {date: '1960-04-25', desc: 'Yom HaShoah'},
    {date: '1960-04-27', desc: 'Rosh Chodesh Iyyar'},
    {date: '1960-04-28', desc: 'Rosh Chodesh Iyyar'},
    {date: '1960-05-01', desc: 'Yom HaZikaron'},
    {date: '1960-05-02', desc: 'Yom HaAtzma\'ut'},
    {date: '1960-05-11', desc: 'Pesach Sheni'},
    {date: '1960-05-15', desc: 'Lag BaOmer'},
    {date: '1960-05-21', desc: 'Shabbat Mevarchim Chodesh Sivan'},
    {date: '1960-05-26', desc: 'Yom Kippur Katan Sivan'},
    {date: '1960-05-27', desc: 'Rosh Chodesh Sivan'},
    {date: '1960-05-31', desc: 'Erev Shavuot'},
    {date: '1960-06-01', desc: 'Shavuot'},
    {date: '1960-06-18', desc: 'Shabbat Mevarchim Chodesh Tamuz'},
    {date: '1960-06-23', desc: 'Yom Kippur Katan Tamuz'},
    {date: '1960-06-25', desc: 'Rosh Chodesh Tamuz'},
    {date: '1960-06-26', desc: 'Rosh Chodesh Tamuz'},
    {date: '1960-07-12', desc: 'Tzom Tammuz'},
    {date: '1960-07-23', desc: 'Shabbat Mevarchim Chodesh Av'},
    {date: '1960-07-24', desc: 'Yom Kippur Katan Av'},
    {date: '1960-07-25', desc: 'Rosh Chodesh Av'},
    {date: '1960-07-30', desc: 'Shabbat Chazon'},
    {date: '1960-08-01', desc: 'Erev Tish\'a B\'Av'},
    {date: '1960-08-02', desc: 'Tish\'a B\'Av'},
    {date: '1960-08-06', desc: 'Shabbat Nachamu'},
    {date: '1960-08-08', desc: 'Tu B\'Av'},
    {date: '1960-08-20', desc: 'Shabbat Mevarchim Chodesh Elul'},
    {date: '1960-08-22', desc: 'Yom Kippur Katan Elul'},
    {date: '1960-08-23', desc: 'Rosh Chodesh Elul'},
    {date: '1960-08-24', desc: 'Rosh Hashana LaBehemot'},
    {date: '1960-08-24', desc: 'Rosh Chodesh Elul'},
    {date: '1960-09-17', desc: 'Leil Selichot'},
    {date: '1960-09-21', desc: 'Erev Rosh Hashana'},
  ];
  t.deepEqual(events, expected);
});

// eslint-disable-next-line require-jsdoc
function eventDateBasenameDesc(ev) {
  const isoDateString = ev.getDate().greg().toISOString();
  const date = isoDateString.substring(0, isoDateString.indexOf('T'));
  return {
    date,
    basename: ev.basename(),
    desc: ev.getDesc(),
  };
}

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  const isoDateString = ev.getDate().greg().toISOString();
  const date = isoDateString.substring(0, isoDateString.indexOf('T'));
  return {date, desc: ev.getDesc()};
}

test('9av-observed', (t) => {
  const events = HebrewCalendar.calendar({year: 2015, numYears: 10});
  const av9 = events.filter((ev) => ev.getDesc().startsWith('Tish\'a B\'Av'));
  const actual = av9.map(eventDateBasenameDesc);
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

test('early-ce-url', (t) => {
  const ev = new HolidayEvent(new HDate(new Date(100, 8, 30)), 'Yom Kippur');
  t.is(ev.url(), 'https://www.hebcal.com/holidays/yom-kippur-100');
  const dt = new Date(99, 8, 12);
  dt.setFullYear(99);
  const ev2 = new HolidayEvent(new HDate(dt), 'Yom Kippur');
  t.is(ev2.url(), undefined);
});

test('bce-url', (t) => {
  const urls = HebrewCalendar.calendar({year: -776})
      .filter((ev) => ev.getDesc() === 'Asara B\'Tevet' || ev.getDesc() === 'Yom Kippur')
      .map((ev) => ev.url());
  const expected = [
    undefined,
    undefined,
  ];
  t.deepEqual(urls, expected);
});

test('getHolidaysForYear-ce', (t) => {
  const map = HebrewCalendar.getHolidaysForYear(5888);
  const rh = map.get('1 Tishrei 5888').map(eventDateDesc)[0];
  const pesach = map.get('15 Nisan 5888').map(eventDateDesc)[0];
  t.deepEqual(rh, {date: '2127-09-08', desc: 'Rosh Hashana 5888'});
  t.deepEqual(pesach, {date: '2128-04-15', desc: 'Pesach I'});
});

test('getHolidaysForYear-bce', (t) => {
  const map = HebrewCalendar.getHolidaysForYear(3737);
  const rh = map.get('1 Tishrei 3737').map(eventDateDesc)[0];
  const pesach = map.get('15 Nisan 3737').map(eventDateDesc)[0];
  t.deepEqual(rh, {date: '-000024-09-11', desc: 'Rosh Hashana 3737'});
  t.deepEqual(pesach, {date: '-000023-03-22', desc: 'Pesach I'});
});

test('getHolidaysForYearArray-bce', (t) => {
  const events = HebrewCalendar.getHolidaysForYearArray(3759, false).slice(0, 15);
  const actual = events.map(eventDateDesc);
  const expected = [
    {date: '-000002-09-08', desc: 'Rosh Hashana 3759'},
    {date: '-000002-09-09', desc: 'Rosh Hashana II'},
    {date: '-000002-09-10', desc: 'Tzom Gedaliah'},
    {date: '-000002-09-16', desc: 'Erev Yom Kippur'},
    {date: '-000002-09-17', desc: 'Yom Kippur'},
    {date: '-000002-09-19', desc: 'Shabbat Shuva'},
    {date: '-000002-09-21', desc: 'Erev Sukkot'},
    {date: '-000002-09-22', desc: 'Sukkot I'},
    {date: '-000002-09-23', desc: 'Sukkot II'},
    {date: '-000002-09-24', desc: 'Sukkot III (CH\'\'M)'},
    {date: '-000002-09-25', desc: 'Sukkot IV (CH\'\'M)'},
    {date: '-000002-09-26', desc: 'Sukkot V (CH\'\'M)'},
    {date: '-000002-09-27', desc: 'Sukkot VI (CH\'\'M)'},
    {date: '-000002-09-28', desc: 'Sukkot VII (Hoshana Raba)'},
    {date: '-000002-09-29', desc: 'Shmini Atzeret'},
  ];
  t.deepEqual(actual, expected);
});

test('Rosh Hashana L\'Ma\'sar Behemah', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2011, 7, 31),
    end: new Date(2011, 7, 31),
    locale: 'he',
  });
  t.is(events[0].render('he'), 'רֹאשׁ הַשָּׁנָה לְמַעְשַׂר בְּהֵמָה');
});

test('emoji', (t) => {
  const expected = {
    '38th day of the Omer': '3️⃣8️⃣',
    'Asara B\'Tevet': '✡️',
    'Chanukah: 1 Candle': '🕎1️⃣',
    'Chanukah: 3 Candles': '🕎3️⃣',
    'Chanukah: 8 Candles': '🕎8️⃣',
    'Chanukah: 8th Day': '🕎',
    'Lag BaOmer': '🔥',
    'Leil Selichot': '🕍',
    'Pesach Sheni': '✡️',
    'Erev Pesach': '🫓🍷',
    'Pesach I': '🫓🍷',
    'Pesach': '🫓',
    'Purim Katan': '🎭️',
    'Purim': '🎭️📜',
    'Rosh Chodesh Nisan': '🌒',
    'Rosh Chodesh Iyyar': '🌒',
    'Rosh Chodesh Sivan': '🌒',
    'Rosh Chodesh Tamuz': '🌒',
    'Rosh Chodesh Av': '🌒',
    'Rosh Chodesh Elul': '🌒',
    'Rosh Chodesh Cheshvan': '🌒',
    'Rosh Chodesh Kislev': '🌒',
    'Rosh Chodesh Tevet': '🌒',
    'Rosh Chodesh Sh\'vat': '🌒',
    'Rosh Chodesh Adar': '🌒',
    'Rosh Chodesh Adar I': '🌒',
    'Rosh Chodesh Adar II': '🌒',
    'Rosh Hashana': '🍏🍯',
    'Rosh Hashana LaBehemot': '🐑',
    'Shabbat Chazon': '🕍',
    'Shabbat HaChodesh': '🕍',
    'Shabbat HaGadol': '🕍',
    'Shabbat Machar Chodesh': '🕍',
    'Shabbat Nachamu': '🕍',
    'Shabbat Parah': '🕍',
    'Shabbat Rosh Chodesh': '🕍',
    'Shabbat Shekalim': '🕍',
    'Shabbat Shirah': '🕍',
    'Shabbat Shuva': '🕍',
    'Shabbat Zachor': '🕍',
    'Shavuot': '⛰️🌸',
    'Shmini Atzeret': '✡️',
    'Shushan Purim': '🎭️📜',
    'Sigd': '✡️',
    'Simchat Torah': '✡️',
    'Sukkot': '🌿🍋',
    'Ta\'anit Bechorot': '✡️',
    'Ta\'anit Esther': '✡️',
    'Tish\'a B\'Av': '✡️',
    'Tu B\'Av': '❤️',
    'Tu BiShvat': '🌳',
    'Tzom Gedaliah': '✡️',
    'Tzom Tammuz': '✡️',
    'Yom HaAliyah': '🇮🇱',
    'Yom HaAtzma\'ut': '🇮🇱',
    'Yom HaShoah': '✡️',
    'Yom HaZikaron': '🇮🇱',
    'Yom Kippur': '✡️',
    'Yom Yerushalayim': '🇮🇱',
  };
  const events = HebrewCalendar.calendar({year: 2021, omer: true});
  for (const ev of events) {
    const base = ev.basename();
    const desc = ev.getDesc();
    const emoji = ev.getEmoji();
    if (expected[desc]) {
      t.is(emoji, expected[desc], desc);
    } else if (expected[base]) {
      t.is(emoji, expected[base], desc);
    }
  }
});

test('Yom HaAliyah', (t) => {
  const events = HebrewCalendar.calendar({year: 2038, il: true});
  const aliyah = events.filter((ev) => ev.getDesc().startsWith('Yom HaAliyah'));
  t.is(aliyah.length, 2);
  t.is(aliyah[0].getDate().toString(), '10 Nisan 5798');
  t.is(aliyah[0].getDesc(), 'Yom HaAliyah');
  t.is(aliyah[1].getDate().toString(), '7 Cheshvan 5799');
  t.is(aliyah[1].getDesc(), 'Yom HaAliyah School Observance');
});

test('modern', (t) => {
  const eventsDiaspora = HebrewCalendar.calendar({year: 2041, il: false, mask: flags.MODERN_HOLIDAY});
  t.is(eventsDiaspora.length, 6);
  const actual = eventsDiaspora.map((ev) => {
    const o = eventDateDesc(ev);
    if (ev.emoji) o.em = ev.emoji;
    return o;
  });
  const expected = [
    {date: '2041-04-11', desc: 'Yom HaAliyah', em: '🇮🇱'},
    {date: '2041-04-29', desc: 'Yom HaShoah'},
    {date: '2041-05-06', desc: 'Yom HaZikaron', em: '🇮🇱'},
    {date: '2041-05-07', desc: 'Yom HaAtzma\'ut', em: '🇮🇱'},
    {date: '2041-05-29', desc: 'Yom Yerushalayim', em: '🇮🇱'},
    {date: '2041-11-23', desc: 'Sigd'},
  ];
  t.deepEqual(actual, expected);
  const eventsIL = HebrewCalendar.calendar({year: 2041, il: true, mask: flags.MODERN_HOLIDAY});
  t.is(eventsIL.length, 12);
  const actualIL = eventsIL.map((ev) => {
    const o = eventDateDesc(ev);
    if (ev.emoji) o.em = ev.emoji;
    return o;
  });
  const expectedIL = [
    {date: '2041-02-01', desc: 'Family Day', em: '🇮🇱'},
    {date: '2041-04-11', desc: 'Yom HaAliyah', em: '🇮🇱'},
    {date: '2041-04-29', desc: 'Yom HaShoah'},
    {date: '2041-05-06', desc: 'Yom HaZikaron', em: '🇮🇱'},
    {date: '2041-05-07', desc: 'Yom HaAtzma\'ut', em: '🇮🇱'},
    {date: '2041-05-12', desc: 'Herzl Day', em: '🇮🇱'},
    {date: '2041-05-29', desc: 'Yom Yerushalayim', em: '🇮🇱'},
    {date: '2041-07-28', desc: 'Jabotinsky Day', em: '🇮🇱'},
    {date: '2041-11-01', desc: 'Yom HaAliyah School Observance', em: '🇮🇱'},
    {date: '2041-11-06', desc: 'Yitzhak Rabin Memorial Day', em: '🇮🇱'},
    {date: '2041-11-23', desc: 'Sigd'},
    {date: '2041-12-01', desc: 'Ben-Gurion Day', em: '🇮🇱'},
  ];
  t.deepEqual(actualIL, expectedIL);
});

test('modernFriSatMovetoThu', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, il: true});
  const ev = events.find((ev) => ev.getDesc() === 'Yitzhak Rabin Memorial Day');
  t.is(ev.getDate().toString(), '11 Cheshvan 5781');
  t.is(ev.getDate().getDay(), 4);
});

test('RoshChodeshEvent', (t) => {
  const hd = new HDate(1, 'Tevet', 5782);
  const ev = new RoshChodeshEvent(hd, 'Tevet');
  t.is(ev.basename(), 'Rosh Chodesh Tevet');
  t.is(ev.render('en'), 'Rosh Chodesh Tevet');
  t.is(ev.renderBrief('en'), 'Rosh Chodesh Tevet');
  t.is(ev.render('ashkenazi'), 'Rosh Chodesh Teves');
  t.is(ev.render('he'), 'רֹאשׁ חוֹדֶשׁ טֵבֵת');
  t.is(ev.render('he-x-NoNikud'), 'ראש חודש טבת');
});

test('fast days includes Yom Kippur Katan', (t) => {
  const events0 = HebrewCalendar.calendar({
    year: 2021,
    yomKippurKatan: true,
  });
  const events = events0.filter((ev) => ev.getFlags() & flags.MINOR_FAST);
  const actual = events.map(function(ev) {
    const o = eventDateDesc(ev);
    if (ev.memo) o.memo = ev.memo;
    return o;
  });
  const expected = [
    {
      date: '2021-01-13',
      desc: 'Yom Kippur Katan Sh\'vat',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Sh\'vat',
    },
    {
      date: '2021-02-11',
      desc: 'Yom Kippur Katan Adar',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Adar',
    },
    {date: '2021-02-25', desc: 'Ta\'anit Esther'},
    {
      date: '2021-03-11',
      desc: 'Yom Kippur Katan Nisan',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Nisan',
    },
    {date: '2021-03-25', desc: 'Ta\'anit Bechorot'},
    {
      date: '2021-05-11',
      desc: 'Yom Kippur Katan Sivan',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Sivan',
    },
    {
      date: '2021-06-09',
      desc: 'Yom Kippur Katan Tamuz',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Tamuz',
    },
    {date: '2021-06-27', desc: 'Tzom Tammuz'},
    {
      date: '2021-07-08',
      desc: 'Yom Kippur Katan Av',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Av',
    },
    {
      date: '2021-08-05',
      desc: 'Yom Kippur Katan Elul',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Elul',
    },
    {date: '2021-09-09', desc: 'Tzom Gedaliah'},
    {
      date: '2021-11-04',
      desc: 'Yom Kippur Katan Kislev',
      memo: 'Minor Day of Atonement on the day preceeding Rosh Chodesh Kislev',
    },
    {date: '2021-12-14', desc: 'Asara B\'Tevet'},
  ];
  t.deepEqual(actual, expected);
});

test('Birkat Hachamah', (t) => {
  const actual = [];
  for (let year = 5650; year <= 5920; year++) {
    const events = HebrewCalendar.getHolidaysForYearArray(year, false);
    const ev = events.find((ev) => ev.getDesc() === 'Birkat Hachamah');
    if (ev) {
      actual.push(year);
    }
  }
  const expected = [5657, 5685, 5713, 5741, 5769, 5797, 5825, 5853, 5881, 5909];
  t.deepEqual(actual, expected);

  const events = HebrewCalendar.getHolidaysForYearArray(5965, false);
  const ev = events.find((ev) => ev.getDesc() === 'Birkat Hachamah');
  t.is(typeof ev, 'object');
  t.is(ev.getDate().toString(), '19 Nisan 5965');

  const events2 = HebrewCalendar.getHolidaysForYearArray(5993, false);
  const ev2 = events2.find((ev) => ev.getDesc() === 'Birkat Hachamah');
  t.is(typeof ev2, 'object');
  t.is(ev2.getDate().toString(), '29 Adar II 5993');
});

test('getCategories', (t) => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  t.deepEqual(ev.getCategories(), ['holiday', 'major', 'cholhamoed']);

  const ev2 = new HolidayEvent(new HDate(18, months.IYYAR, 5763),
      'Lag BaOmer', flags.MINOR_HOLIDAY);
  t.deepEqual(ev2.getCategories(), ['holiday', 'minor']);

  const ev3 = new HolidayEvent(new HDate(9, months.TISHREI, 5763),
      'Erev Yom Kippur', flags.EREV | flags.LIGHT_CANDLES);
  t.deepEqual(ev3.getCategories(), ['holiday', 'major']);
});

test('getHolidaysOnDate-cacheHit', (t) => {
  const dt = new Date(2023, 11, 13);
  const hd = new HDate(dt);
  const ev1 = HebrewCalendar.getHolidaysOnDate(dt, false);
  const ev2 = HebrewCalendar.getHolidaysOnDate(hd, false);
  const ev3 = HebrewCalendar.getHolidaysOnDate(dt, true);
  const ev4 = HebrewCalendar.getHolidaysOnDate(hd, true);
  const ev5 = HebrewCalendar.getHolidaysOnDate(dt);
  const ev6 = HebrewCalendar.getHolidaysOnDate(hd);
  t.deepEqual(ev1, ev2);
  t.deepEqual(ev1, ev3);
  t.deepEqual(ev1, ev4);
  t.deepEqual(ev1, ev5);
  t.deepEqual(ev1, ev6);
});

test('getHolidaysOnDate-neg-cacheHit', (t) => {
  const hd = new HDate(3, 'Cheshvan', 5771);
  const ev1 = HebrewCalendar.getHolidaysOnDate(hd, false);
  const ev2 = HebrewCalendar.getHolidaysOnDate(hd, false);
  const ev3 = HebrewCalendar.getHolidaysOnDate(hd.greg(), false);
  t.is(ev1, undefined);
  t.is(ev2, undefined);
  t.is(ev3, undefined);
});
