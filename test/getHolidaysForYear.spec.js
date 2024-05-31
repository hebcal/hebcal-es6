import {HebrewCalendar} from '../src/hebcal';
import {isoDateString} from '@hebcal/hdate';

jest.mock('quick-lru', () => {
  return jest.fn().mockImplementation(() => {
    return new Map();
  });
});

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  const date = isoDateString(ev.getDate().greg());
  return {date, desc: ev.getDesc()};
}

test('getHolidaysForYearArray-5771-diaspora', () => {
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
    {date: '2010-10-08', desc: 'Rosh Chodesh Cheshvan'},
    {date: '2010-10-09', desc: 'Rosh Chodesh Cheshvan'},
    {date: '2010-11-04', desc: 'Yom Kippur Katan Kislev'},
    {date: '2010-11-06', desc: 'Sigd'},
    {date: '2010-11-07', desc: 'Rosh Chodesh Kislev'},
    {date: '2010-11-08', desc: 'Rosh Chodesh Kislev'},
    {date: '2010-12-01', desc: 'Chanukah: 1 Candle'},
    {date: '2010-12-02', desc: 'Chanukah: 2 Candles'},
    {date: '2010-12-03', desc: 'Chanukah: 3 Candles'},
    {date: '2010-12-04', desc: 'Chanukah: 4 Candles'},
    {date: '2010-12-05', desc: 'Chanukah: 5 Candles'},
    {date: '2010-12-06', desc: 'Chanukah: 6 Candles'},
    {date: '2010-12-07', desc: 'Chag HaBanot'},
    {date: '2010-12-07', desc: 'Chanukah: 7 Candles'},
    {date: '2010-12-07', desc: 'Rosh Chodesh Tevet'},
    {date: '2010-12-08', desc: 'Chanukah: 8 Candles'},
    {date: '2010-12-08', desc: 'Rosh Chodesh Tevet'},
    {date: '2010-12-09', desc: 'Chanukah: 8th Day'},
    {date: '2010-12-17', desc: 'Asara B\'Tevet'},
    {date: '2011-01-05', desc: 'Yom Kippur Katan Sh\'vat'},
    {date: '2011-01-06', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '2011-01-15', desc: 'Shabbat Shirah'},
    {date: '2011-01-20', desc: 'Tu BiShvat'},
    {date: '2011-02-03', desc: 'Yom Kippur Katan Adar I'},
    {date: '2011-02-04', desc: 'Rosh Chodesh Adar I'},
    {date: '2011-02-05', desc: 'Rosh Chodesh Adar I'},
    {date: '2011-02-18', desc: 'Purim Katan'},
    {date: '2011-02-19', desc: 'Shushan Purim Katan'},
    {date: '2011-03-03', desc: 'Yom Kippur Katan Adar II'},
    {date: '2011-03-05', desc: 'Shabbat Shekalim'},
    {date: '2011-03-06', desc: 'Rosh Chodesh Adar II'},
    {date: '2011-03-07', desc: 'Rosh Chodesh Adar II'},
    {date: '2011-03-17', desc: 'Ta\'anit Esther'},
    {date: '2011-03-19', desc: 'Shabbat Zachor'},
    {date: '2011-03-19', desc: 'Erev Purim'},
    {date: '2011-03-20', desc: 'Purim'},
    {date: '2011-03-21', desc: 'Shushan Purim'},
    {date: '2011-03-26', desc: 'Shabbat Parah'},
    {date: '2011-04-02', desc: 'Shabbat HaChodesh'},
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
    {date: '2011-05-02', desc: 'Yom HaShoah'},
    {date: '2011-05-04', desc: 'Rosh Chodesh Iyyar'},
    {date: '2011-05-05', desc: 'Rosh Chodesh Iyyar'},
    {date: '2011-05-09', desc: 'Yom HaZikaron'},
    {date: '2011-05-10', desc: 'Yom HaAtzma\'ut'},
    {date: '2011-05-18', desc: 'Pesach Sheni'},
    {date: '2011-05-22', desc: 'Lag BaOmer'},
    {date: '2011-06-01', desc: 'Yom Yerushalayim'},
    {date: '2011-06-02', desc: 'Yom Kippur Katan Sivan'},
    {date: '2011-06-03', desc: 'Rosh Chodesh Sivan'},
    {date: '2011-06-07', desc: 'Erev Shavuot'},
    {date: '2011-06-08', desc: 'Shavuot I'},
    {date: '2011-06-09', desc: 'Shavuot II'},
    {date: '2011-06-30', desc: 'Yom Kippur Katan Tamuz'},
    {date: '2011-07-02', desc: 'Rosh Chodesh Tamuz'},
    {date: '2011-07-03', desc: 'Rosh Chodesh Tamuz'},
    {date: '2011-07-19', desc: 'Tzom Tammuz'},
    {date: '2011-07-31', desc: 'Yom Kippur Katan Av'},
    {date: '2011-08-01', desc: 'Rosh Chodesh Av'},
    {date: '2011-08-06', desc: 'Shabbat Chazon'},
    {date: '2011-08-08', desc: 'Erev Tish\'a B\'Av'},
    {date: '2011-08-09', desc: 'Tish\'a B\'Av'},
    {date: '2011-08-13', desc: 'Shabbat Nachamu'},
    {date: '2011-08-15', desc: 'Tu B\'Av'},
    {date: '2011-08-29', desc: 'Yom Kippur Katan Elul'},
    {date: '2011-08-30', desc: 'Rosh Chodesh Elul'},
    {date: '2011-08-31', desc: 'Rosh Hashana LaBehemot'},
    {date: '2011-08-31', desc: 'Rosh Chodesh Elul'},
    {date: '2011-09-24', desc: 'Leil Selichot'},
    {date: '2011-09-28', desc: 'Erev Rosh Hashana'},
  ];
  expect(events).toEqual(expected);
});

test('getHolidaysForYearArray-5720-il', () => {
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
    {date: '1959-11-01', desc: 'Rosh Chodesh Cheshvan'},
    {date: '1959-11-02', desc: 'Rosh Chodesh Cheshvan'},
    {date: '1959-11-30', desc: 'Yom Kippur Katan Kislev'},
    {date: '1959-12-01', desc: 'Rosh Chodesh Kislev'},
    {date: '1959-12-02', desc: 'Rosh Chodesh Kislev'},
    {date: '1959-12-25', desc: 'Chanukah: 1 Candle'},
    {date: '1959-12-26', desc: 'Chanukah: 2 Candles'},
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
    {date: '1960-01-28', desc: 'Yom Kippur Katan Sh\'vat'},
    {date: '1960-01-30', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '1960-02-13', desc: 'Tu BiShvat'},
    {date: '1960-02-13', desc: 'Shabbat Shirah'},
    {date: '1960-02-25', desc: 'Yom Kippur Katan Adar'},
    {date: '1960-02-27', desc: 'Shabbat Shekalim'},
    {date: '1960-02-28', desc: 'Rosh Chodesh Adar'},
    {date: '1960-02-29', desc: 'Rosh Chodesh Adar'},
    {date: '1960-03-10', desc: 'Ta\'anit Esther'},
    {date: '1960-03-12', desc: 'Shabbat Zachor'},
    {date: '1960-03-12', desc: 'Erev Purim'},
    {date: '1960-03-13', desc: 'Purim'},
    {date: '1960-03-14', desc: 'Shushan Purim'},
    {date: '1960-03-19', desc: 'Shabbat Parah'},
    {date: '1960-03-26', desc: 'Shabbat HaChodesh'},
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
    {date: '1960-04-25', desc: 'Yom HaShoah'},
    {date: '1960-04-27', desc: 'Rosh Chodesh Iyyar'},
    {date: '1960-04-28', desc: 'Rosh Chodesh Iyyar'},
    {date: '1960-05-01', desc: 'Yom HaZikaron'},
    {date: '1960-05-02', desc: 'Yom HaAtzma\'ut'},
    {date: '1960-05-11', desc: 'Pesach Sheni'},
    {date: '1960-05-15', desc: 'Lag BaOmer'},
    {date: '1960-05-26', desc: 'Yom Kippur Katan Sivan'},
    {date: '1960-05-27', desc: 'Rosh Chodesh Sivan'},
    {date: '1960-05-31', desc: 'Erev Shavuot'},
    {date: '1960-06-01', desc: 'Shavuot'},
    {date: '1960-06-23', desc: 'Yom Kippur Katan Tamuz'},
    {date: '1960-06-25', desc: 'Rosh Chodesh Tamuz'},
    {date: '1960-06-26', desc: 'Rosh Chodesh Tamuz'},
    {date: '1960-07-12', desc: 'Tzom Tammuz'},
    {date: '1960-07-24', desc: 'Yom Kippur Katan Av'},
    {date: '1960-07-25', desc: 'Rosh Chodesh Av'},
    {date: '1960-07-30', desc: 'Shabbat Chazon'},
    {date: '1960-08-01', desc: 'Erev Tish\'a B\'Av'},
    {date: '1960-08-02', desc: 'Tish\'a B\'Av'},
    {date: '1960-08-06', desc: 'Shabbat Nachamu'},
    {date: '1960-08-08', desc: 'Tu B\'Av'},
    {date: '1960-08-22', desc: 'Yom Kippur Katan Elul'},
    {date: '1960-08-23', desc: 'Rosh Chodesh Elul'},
    {date: '1960-08-24', desc: 'Rosh Hashana LaBehemot'},
    {date: '1960-08-24', desc: 'Rosh Chodesh Elul'},
    {date: '1960-09-17', desc: 'Leil Selichot'},
    {date: '1960-09-21', desc: 'Erev Rosh Hashana'},
  ];
  expect(events).toEqual(expected);
});

test('getHolidaysForYear-ce', () => {
  const map = HebrewCalendar.getHolidaysForYear(5888);
  const rh = map.get('1 Tishrei 5888').map(eventDateDesc)[0];
  const pesach = map.get('15 Nisan 5888').map(eventDateDesc)[0];
  expect(rh).toEqual({date: '2127-09-08', desc: 'Rosh Hashana 5888'});
  expect(pesach).toEqual({date: '2128-04-15', desc: 'Pesach I'});
});

test('getHolidaysForYear-bce', () => {
  const map = HebrewCalendar.getHolidaysForYear(3737);
  const rh = map.get('1 Tishrei 3737').map(eventDateDesc)[0];
  const pesach = map.get('15 Nisan 3737').map(eventDateDesc)[0];
  expect(rh).toEqual({date: '-000024-09-11', desc: 'Rosh Hashana 3737'});
  expect(pesach).toEqual({date: '-000023-03-22', desc: 'Pesach I'});
});

test('getHolidaysForYearArray-bce', () => {
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
  expect(actual).toEqual(expected);
});

test('Birkat Hachamah', () => {
  const actual = [];
  for (let year = 5650; year <= 5920; year++) {
    const events = HebrewCalendar.getHolidaysForYearArray(year, false);
    const ev = events.find((ev) => ev.getDesc() === 'Birkat Hachamah');
    if (ev) {
      actual.push(year);
    }
  }
  const expected = [5657, 5685, 5713, 5741, 5769, 5797, 5825, 5853, 5881, 5909];
  expect(actual).toEqual(expected);

  const events = HebrewCalendar.getHolidaysForYearArray(5965, false);
  const ev = events.find((ev) => ev.getDesc() === 'Birkat Hachamah');
  expect(typeof ev).toBe('object');
  expect(ev.getDate().toString()).toBe('19 Nisan 5965');

  const events2 = HebrewCalendar.getHolidaysForYearArray(5993, false);
  const ev2 = events2.find((ev) => ev.getDesc() === 'Birkat Hachamah');
  expect(typeof ev2).toBe('object');
  expect(ev2.getDate().toString()).toBe('29 Adar II 5993');
});

