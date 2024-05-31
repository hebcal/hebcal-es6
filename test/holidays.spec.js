import {HDate, isoDateString, months} from '@hebcal/hdate';
import {RoshChodeshEvent} from '../src/HolidayEvent';
import {MevarchimChodeshEvent} from '../src/MevarchimChodeshEvent';
import {HolidayEvent} from '../src/HolidayEvent';
import {HebrewCalendar} from '../src/hebcal';
import {flags} from '../src/event';

jest.mock('quick-lru', () => {
  return jest.fn().mockImplementation(() => {
    return new Map();
  });
});

test('basename-and-url', () => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  expect(ev.getDesc()).toBe('Pesach IV (CH\'\'M)');
  expect(ev.render('en')).toBe('Pesach IV (CH’’M)');
  expect(ev.renderBrief('en')).toBe('Pesach IV (CH’’M)');
  expect(ev.basename()).toBe('Pesach');
  expect(ev.url()).toBe('https://www.hebcal.com/holidays/pesach-2003');

  const ev2 = new HolidayEvent(new HDate(23, months.TISHREI, 5763),
      'Simchat Torah', flags.CHUL_ONLY);
  expect(ev2.getDesc()).toBe('Simchat Torah');
  expect(ev2.render('en')).toBe('Simchat Torah');
  expect(ev2.renderBrief('en')).toBe('Simchat Torah');
  expect(ev2.basename()).toBe('Simchat Torah');
  expect(ev2.url()).toBe('https://www.hebcal.com/holidays/simchat-torah-2002');

  const ev3 = new HolidayEvent(new HDate(8, months.AV, 5783),
      'Erev Tish\'a B\'Av', flags.MAJOR_FAST);
  expect(ev3.getDesc()).toBe('Erev Tish\'a B\'Av');
  expect(ev3.render('en')).toBe('Erev Tish’a B’Av');
  expect(ev3.renderBrief('en')).toBe('Erev Tish’a B’Av');
  expect(ev3.basename()).toBe('Tish\'a B\'Av');
  expect(ev3.url()).toBe('https://www.hebcal.com/holidays/tisha-bav-2023');

  const rch = new RoshChodeshEvent(new HDate(30, months.ADAR_I, 5787), 'Adar II');
  expect(rch.getDesc()).toBe('Rosh Chodesh Adar II');
  expect(rch.render('en')).toBe('Rosh Chodesh Adar II');
  expect(rch.renderBrief('en')).toBe('Rosh Chodesh Adar II');
  expect(rch.basename()).toBe('Rosh Chodesh Adar II');
  expect(rch.url()).toBe('https://www.hebcal.com/holidays/rosh-chodesh-adar-ii-2027');

  const mvch = new MevarchimChodeshEvent(new HDate(23, months.KISLEV, 5769), 'Tevet');
  expect(mvch.getDesc()).toBe('Shabbat Mevarchim Chodesh Tevet');
  expect(mvch.render('en')).toBe('Shabbat Mevarchim Chodesh Tevet');
  expect(mvch.renderBrief('en')).toBe('Mevarchim Chodesh Tevet');
  expect(mvch.url()).toBe(undefined);
});

test('observedInIsrael and url contains ?i=on', () => {
  const erev = new HolidayEvent(new HDate(5, months.SIVAN, 5777),
      'Erev Shavuot', flags.EREV | flags.LIGHT_CANDLES);
  expect(erev.observedInIsrael()).toBe(true);
  expect(erev.observedInDiaspora()).toBe(true);
  expect(erev.url()).toBe('https://www.hebcal.com/holidays/shavuot-2017');

  const shavuot = new HolidayEvent(new HDate(6, months.SIVAN, 5777),
      'Shavuot', flags.CHAG | flags.YOM_TOV_ENDS | flags.IL_ONLY);
  expect(shavuot.observedInIsrael()).toBe(true);
  expect(shavuot.observedInDiaspora()).toBe(false);
  expect(shavuot.url()).toBe('https://www.hebcal.com/holidays/shavuot-2017?i=on');

  const shavuotI = new HolidayEvent(new HDate(6, months.SIVAN, 5777),
      'Shavuot I', flags.CHAG | flags.LIGHT_CANDLES_TZEIS | flags.CHUL_ONLY);
  expect(shavuotI.observedInIsrael()).toBe(false);
  expect(shavuotI.observedInDiaspora()).toBe(true);
  expect(shavuotI.url()).toBe('https://www.hebcal.com/holidays/shavuot-2017');

  const shavuotII = new HolidayEvent(new HDate(7, months.SIVAN, 5777),
      'Shavuot II', flags.CHAG | flags.YOM_TOV_ENDS | flags.CHUL_ONLY);
  expect(shavuotII.observedInIsrael()).toBe(false);
  expect(shavuotII.observedInDiaspora()).toBe(true);
  expect(shavuotII.url()).toBe('https://www.hebcal.com/holidays/shavuot-2017');
});

test('MevarchimChodeshEvent', () => {
  const mvch = new MevarchimChodeshEvent(new HDate(23, months.KISLEV, 5769), 'Tevet');
  expect(mvch.memo).toBe('Molad Tevet: Sat, 10 minutes and 16 chalakim after 16:00');
});

test('Shushan Purim', () => {
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
  expect(actual).toEqual(expected);
});

test('Purim Meshulash', () => {
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
  expect(actual).toEqual(expected);
});

// eslint-disable-next-line require-jsdoc
function eventDateBasenameDesc(ev) {
  const date = isoDateString(ev.getDate().greg());
  return {
    date,
    basename: ev.basename(),
    desc: ev.getDesc(),
  };
}

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  const date = isoDateString(ev.getDate().greg());
  return {date, desc: ev.getDesc()};
}

test('9av-observed', () => {
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
  expect(actual).toEqual(expected);
  expect(av9[0].render('he')).toBe('תִּשְׁעָה בְּאָב נִדחֶה');
  expect(av9[2].render('he')).toBe('תִּשְׁעָה בְּאָב');
});

test('asara-btevet-url', () => {
  const urls = HebrewCalendar.calendar({year: 2020})
      .filter((ev) => ev.getDesc() === 'Asara B\'Tevet')
      .map((ev) => ev.url());
  const expected = [
    'https://www.hebcal.com/holidays/asara-btevet-20200107',
    'https://www.hebcal.com/holidays/asara-btevet-20201225',
  ];
  expect(urls).toEqual(expected);
});

test('early-ce-url', () => {
  const ev = new HolidayEvent(new HDate(new Date(100, 8, 30)), 'Yom Kippur');
  expect(ev.url()).toBe('https://www.hebcal.com/holidays/yom-kippur-100');
  const dt = new Date(99, 8, 12);
  dt.setFullYear(99);
  const ev2 = new HolidayEvent(new HDate(dt), 'Yom Kippur');
  expect(ev2.url()).toBe(undefined);
});

test('bce-url', () => {
  const urls = HebrewCalendar.calendar({year: -776})
      .filter((ev) => ev.getDesc() === 'Asara B\'Tevet' || ev.getDesc() === 'Yom Kippur')
      .map((ev) => ev.url());
  const expected = [
    undefined,
    undefined,
  ];
  expect(urls).toEqual(expected);
});

test('Rosh Hashana L\'Ma\'sar Behemah', () => {
  const events = HebrewCalendar.calendar({
    start: new Date(2011, 7, 31),
    end: new Date(2011, 7, 31),
    locale: 'he',
  });
  expect(events[0].render('he')).toBe('רֹאשׁ הַשָּׁנָה לְמַעְשַׂר בְּהֵמָה');
});

test('emoji', () => {
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
      expect(emoji).toBe(expected[desc]);
    } else if (expected[base]) {
      expect(emoji).toBe(expected[base]);
    }
  }
});

test('Yom HaAliyah', () => {
  const events = HebrewCalendar.calendar({year: 2038, il: true});
  const aliyah = events.filter((ev) => ev.getDesc().startsWith('Yom HaAliyah'));
  expect(aliyah.length).toBe(2);
  expect(aliyah[0].getDate().toString()).toBe('10 Nisan 5798');
  expect(aliyah[0].getDesc()).toBe('Yom HaAliyah');
  expect(aliyah[1].getDate().toString()).toBe('7 Cheshvan 5799');
  expect(aliyah[1].getDesc()).toBe('Yom HaAliyah School Observance');
});

test('modern', () => {
  const eventsDiaspora = HebrewCalendar.calendar({
    year: 5801,
    isHebrewYear: true,
    il: false,
    mask: flags.MODERN_HOLIDAY,
  });
  expect(eventsDiaspora.length).toBe(6);
  const actual = eventsDiaspora.map((ev) => {
    const o = eventDateDesc(ev);
    if (ev.emoji) o.em = ev.emoji;
    return o;
  });
  const expected = [
    {date: '2040-11-05', desc: 'Sigd'},
    {date: '2041-04-11', desc: 'Yom HaAliyah', em: '🇮🇱'},
    {date: '2041-04-29', desc: 'Yom HaShoah'},
    {date: '2041-05-06', desc: 'Yom HaZikaron', em: '🇮🇱'},
    {date: '2041-05-07', desc: 'Yom HaAtzma\'ut', em: '🇮🇱'},
    {date: '2041-05-29', desc: 'Yom Yerushalayim', em: '🇮🇱'},
  ];
  expect(actual).toEqual(expected);
  const eventsIL = HebrewCalendar.calendar({
    year: 5801,
    isHebrewYear: true,
    il: true,
    mask: flags.MODERN_HOLIDAY,
  });
  expect(eventsIL.length).toBe(13);
  const actualIL = eventsIL.map((ev) => {
    const o = eventDateDesc(ev);
    if (ev.emoji) o.em = ev.emoji;
    return o;
  });
  const expectedIL = [
    {date: '2040-10-14', desc: 'Yom HaAliyah School Observance', em: '🇮🇱'},
    {date: '2040-10-18', desc: 'Yitzhak Rabin Memorial Day', em: '🇮🇱'},
    {date: '2040-11-05', desc: 'Sigd'},
    {date: '2040-11-11', desc: 'Ben-Gurion Day', em: '🇮🇱'},
    {date: '2040-12-25', desc: 'Hebrew Language Day', em: '🇮🇱'},
    {date: '2041-02-01', desc: 'Family Day', em: '🇮🇱'},
    {date: '2041-04-11', desc: 'Yom HaAliyah', em: '🇮🇱'},
    {date: '2041-04-29', desc: 'Yom HaShoah'},
    {date: '2041-05-06', desc: 'Yom HaZikaron', em: '🇮🇱'},
    {date: '2041-05-07', desc: 'Yom HaAtzma\'ut', em: '🇮🇱'},
    {date: '2041-05-12', desc: 'Herzl Day', em: '🇮🇱'},
    {date: '2041-05-29', desc: 'Yom Yerushalayim', em: '🇮🇱'},
    {date: '2041-07-28', desc: 'Jabotinsky Day', em: '🇮🇱'},
  ];
  expect(actualIL).toEqual(expectedIL);
});

test('modernFriSatMovetoThu', () => {
  const events = HebrewCalendar.calendar({year: 2020, il: true});
  const ev = events.find((ev) => ev.getDesc() === 'Yitzhak Rabin Memorial Day');
  expect(ev.getDate().toString()).toBe('11 Cheshvan 5781');
  expect(ev.getDate().getDay()).toBe(4);
  const events2 = HebrewCalendar.calendar({year: 5786, isHebrewYear: true, il: true});
  const ev2 = events2.find((ev) => ev.getDesc() === 'Hebrew Language Day');
  expect(ev2.getDate().toString()).toBe('19 Tevet 5786');
  expect(ev2.getDate().getDay()).toBe(4);
});

test('RoshChodeshEvent', () => {
  const hd = new HDate(1, 'Tevet', 5782);
  const ev = new RoshChodeshEvent(hd, 'Tevet');
  expect(ev.basename()).toBe('Rosh Chodesh Tevet');
  expect(ev.render('en')).toBe('Rosh Chodesh Tevet');
  expect(ev.renderBrief('en')).toBe('Rosh Chodesh Tevet');
  expect(ev.render('ashkenazi')).toBe('Rosh Chodesh Teves');
  expect(ev.render('he')).toBe('רֹאשׁ חוֹדֶשׁ טֵבֵת');
  expect(ev.render('he-x-NoNikud')).toBe('ראש חודש טבת');
});

test('fast days includes Yom Kippur Katan', () => {
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
  expect(actual).toEqual(expected);
});

test('getCategories', () => {
  const ev = new HolidayEvent(new HDate(18, months.NISAN, 5763),
      'Pesach IV (CH\'\'M)', flags.CHUL_ONLY, {cholHaMoedDay: 2});
  expect(ev.getCategories()).toEqual(['holiday', 'major', 'cholhamoed']);

  const ev2 = new HolidayEvent(new HDate(18, months.IYYAR, 5763),
      'Lag BaOmer', flags.MINOR_HOLIDAY);
  expect(ev2.getCategories()).toEqual(['holiday', 'minor']);

  const ev3 = new HolidayEvent(new HDate(9, months.TISHREI, 5763),
      'Erev Yom Kippur', flags.EREV | flags.LIGHT_CANDLES);
  expect(ev3.getCategories()).toEqual(['holiday', 'major']);
});
