import test from 'ava';
import * as hebcal from './hebcal';
import {HDate} from './hdate';
import {flags} from './event';
import {Location} from './location';

/**
 * @param {Event} ev
 * @return {string}
 */
function gregDtString(ev) {
  return ev.getDate().greg().toLocaleDateString('en-US');
}

test('heb-month', (t) => {
  const options = {
    year: 5780,
    isHebrewYear: true,
    month: 'Iyyar',
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 7);
  t.is(events[0].getDesc(), 'Rosh Chodesh Iyyar');
  t.is(gregDtString(events[0]), '4/25/2020');
  t.is(events[4].getDesc(), 'Lag BaOmer');
  t.is(gregDtString(events[4]), '5/12/2020');
});

test('greg-month', (t) => {
  const options = {
    year: 2017,
    isHebrewYear: false,
    month: 3,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 8);
  t.is(events[0].getDesc(), 'Ta\'anit Esther');
  t.is(gregDtString(events[0]), '3/9/2017');
  t.is(events[7].getDesc(), 'Rosh Chodesh Nisan');
  t.is(gregDtString(events[7]), '3/28/2017');
});

test('greg-year', (t) => {
  const options = {
    year: 1993,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 82);
  t.is(events[0].getDesc(), 'Asara B\'Tevet');
  t.is(gregDtString(events[0]), '1/3/1993');
  t.is(events[70].getDesc(), 'Chanukah: 1 Candle');
  t.is(gregDtString(events[70]), '12/8/1993');
  t.is(events[81].getDesc(), 'Asara B\'Tevet');
  t.is(gregDtString(events[81]), '12/24/1993');
});

test('heb-year', (t) => {
  const options = {
    year: 5749,
    isHebrewYear: true,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 82);
  t.is(events[0].getDesc(), 'Rosh Hashana 5749');
  t.is(gregDtString(events[0]), '9/12/1988');
  t.is(events[1].getDesc(), 'Rosh Hashana II');
  t.is(gregDtString(events[1]), '9/13/1988');
  t.is(events[4].getDesc(), 'Erev Yom Kippur');
  t.is(gregDtString(events[4]), '9/20/1988');
  t.is(events[81].getDesc(), 'Erev Rosh Hashana');
  t.is(gregDtString(events[81]), '9/29/1989');
});

test('no-options', (t) => {
  const now = new Date();
  const events = hebcal.hebrewCalendar({});
  t.is(events[0].getDate().greg().getFullYear(), now.getFullYear());
  t.is(events[events.length - 1].getDate().greg().getFullYear(), now.getFullYear());
});

test('no-holidays', (t) => {
  const events = hebcal.hebrewCalendar({noHolidays: true});
  t.is(events.length, 0);
});

test('sedrot-only', (t) => {
  const options = {year: 1993, noHolidays: true, sedrot: true, il: true};
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 49);
  t.is(events[0].getFlags(), flags.PARSHA_HASHAVUA);
  t.is(events[48].getFlags(), flags.PARSHA_HASHAVUA);
});

test('candles-only-diaspora', (t) => {
  const options = {
    year: 1993,
    noHolidays: true,
    location: Location.lookup('Chicago'),
    candlelighting: true,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 126);
  t.is(events[0].getFlags(), flags.LIGHT_CANDLES);
  t.is(events[0].render(), 'Candle lighting: 16:13');
  t.is(events[0].getDesc(), 'Candle lighting');
  t.is(events[0].getAttrs().eventTimeStr, '16:13');
  t.is(events[1].getFlags(), flags.LIGHT_CANDLES_TZEIS);
  t.is(events[1].render(), 'Havdalah: 17:19');
  t.is(events[1].getDesc(), 'Havdalah');
  t.is(events[1].getAttrs().eventTimeStr, '17:19');
  t.is(events[48].getFlags(), flags.LIGHT_CANDLES);
});

test('havdalah-mins', (t) => {
  const options = {
    year: 2020,
    month: 4,
    noSpecialShabbat: true,
    havdalahMins: 47,
    location: Location.lookup('Providence'),
    candlelighting: true,
  };
  const events = hebcal.hebrewCalendar(options)
      .filter((ev) => ev.getDesc().startsWith('Havdalah'));
  const ev = events[0];
  t.is(ev.getFlags(), flags.LIGHT_CANDLES_TZEIS);
  t.is(ev.render(), 'Havdalah (47 min): 20:02');
  t.is(ev.getDesc(), 'Havdalah');
  t.is(ev.getAttrs().eventTimeStr, '20:02');
  t.is(events[1].render(), 'Havdalah (47 min): 20:10');
  t.is(events[2].render(), 'Havdalah (47 min): 20:16');
  t.is(events[3].render(), 'Havdalah (47 min): 20:18');
  t.is(events[4].render(), 'Havdalah (47 min): 20:26');
});

test('havdalah-zero-suppressed', (t) => {
  const options = {
    year: 2020,
    month: 4,
    noHolidays: true,
    candlelighting: true,
    havdalahMins: 0,
    location: Location.lookup('Providence'),
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 8);
  const candlelighting = events.filter((ev) => ev.getDesc() == 'Candle lighting');
  t.is(candlelighting.length, 8);
  const havdalah = events.filter((ev) => ev.getDesc() == 'Havdalah');
  t.is(havdalah.length, 0);
});

test('havdalah-fixed-st-petersburg', (t) => {
  const options = {
    year: 2020,
    month: 6,
    noHolidays: true,
    candlelighting: true,
    havdalahMins: 42,
    location: Location.lookup('Saint Petersburg'),
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 8);
  const candlelighting = events.filter((ev) => ev.getDesc() == 'Candle lighting');
  t.is(candlelighting.length, 4);
  const havdalah = events.filter((ev) => ev.getDesc() == 'Havdalah');
  t.is(havdalah.length, 4);
});

test('havdalah-no-tzeit-st-petersburg', (t) => {
  const options = {
    year: 2020,
    month: 6,
    noHolidays: true,
    candlelighting: true,
    location: Location.lookup('Saint Petersburg'),
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 4);
  const candlelighting = events.filter((ev) => ev.getDesc() == 'Candle lighting');
  t.is(candlelighting.length, 4);
  const havdalah = events.filter((ev) => ev.getDesc() == 'Havdalah');
  t.is(havdalah.length, 0);
});

test('candles-only-israel', (t) => {
  const options = {
    year: 1993,
    noHolidays: true,
    location: new Location(32.1836, 34.87386, true, 'Asia/Jerusalem'), // Ra'anana
    il: true,
    candlelighting: true,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 123);
  t.is(events[0].getFlags(), flags.LIGHT_CANDLES, 'Candle lighting 0');
  t.is(events[33].getFlags(), flags.CHAG | flags.YOM_TOV_ENDS | flags.IL_ONLY, 'Havdalah in Israel on Pesach VII');
});

test('dafyomi-only', (t) => {
  const options = {
    year: 1975,
    isHebrewYear: false,
    month: 6,
    noHolidays: true,
    dafyomi: true,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 30);
  t.is(gregDtString(events[0]), '6/1/1975');
  t.is(events[0].getFlags(), flags.DAF_YOMI);
  t.is(events[0].render(), 'Daf Yomi: Niddah 42');
  t.is(events[0].renderBrief(), 'Niddah 42');
  t.is(events[0].getDesc(), 'Niddah 42');
  t.is(gregDtString(events[29]), '6/30/1975');
  t.is(events[29].getFlags(), flags.DAF_YOMI);
  t.is(events[29].render(), 'Daf Yomi: Berachot 8');
  t.is(events[29].renderBrief(), 'Berachot 8');
  t.is(events[29].getDesc(), 'Berachot 8');
});

test('omer-only', (t) => {
  const options = {
    year: 5728,
    isHebrewYear: true,
    month: 'Iyyar',
    noHolidays: true,
    omer: true,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 30);
  t.is(gregDtString(events[0]), '4/29/1968');
  t.is(events[0].getFlags(), flags.OMER_COUNT);
  t.is(events[0].getAttrs().omer, 16);
  t.is(events[0].render(), '16th day of the Omer');
  t.is(gregDtString(events[25]), '5/24/1968');
  t.is(events[25].getFlags(), flags.OMER_COUNT);
  t.is(events[25].getAttrs().omer, 41);
  t.is(events[25].render(), '41st day of the Omer');
});

test('molad-only', (t) => {
  const options = {
    year: 1975,
    isHebrewYear: false,
    noHolidays: true,
    molad: true,
  };
  const events = hebcal.hebrewCalendar(options);
  t.is(events.length, 12);
  t.is(events[0].getDesc().startsWith('Molad'), true);
  t.is(events[0].getFlags(), flags.MOLAD);
});

test('multi-year', (t) => {
  const options = {
    year: 1944,
    isHebrewYear: false,
    numYears: 7,
  };
  const events = hebcal.hebrewCalendar(options);
  let numRoshHashanaII = 0;
  for (const ev of events) {
    if (ev.getDesc() == 'Rosh Hashana II') {
      numRoshHashanaII++;
    }
  }
  t.is(numRoshHashanaII, 7);
});

test('ashkenazi', (t) => {
  const options = {year: 2020, month: 4, ashkenazi: true};
  const ev = hebcal.hebrewCalendar(options)[0];
  t.is(ev.render(), 'Shabbos HaGadol');
});

test('locale-he', (t) => {
  const options = {year: 2020, month: 4, locale: 'he'};
  const ev = hebcal.hebrewCalendar(options)[0];
  t.is(ev.render(), 'שַׁבָּת הַגָּדוֹל');
});

test('addHebrewDatesForEvents', (t) => {
  const options0 = {year: 2017, month: 3, noHolidays: true, addHebrewDatesForEvents: true};
  const ev0 = hebcal.hebrewCalendar(options0);
  t.is(ev0.length, 0);

  const options1 = {year: 2017, month: 3};
  const ev1 = hebcal.hebrewCalendar(options1);
  t.is(ev1.length, 8);

  const options = {year: 2017, month: 3, addHebrewDatesForEvents: true};
  const ev = hebcal.hebrewCalendar(options);
  t.is(ev.length, 15);
});

test('addHebrewDates', (t) => {
  const options0 = {year: 2017, month: 3, noHolidays: true, addHebrewDates: true};
  const ev0 = hebcal.hebrewCalendar(options0);
  t.is(ev0.length, 31);
  t.is(ev0[0].getFlags(), flags.HEBREW_DATE);
  t.is(ev0[0].getDesc(), '3 Adar 5777');
  t.is(ev0[0].render(), '3rd of Adar, 5777');

  const options = {year: 2017, month: 3, addHebrewDates: true};
  const ev = hebcal.hebrewCalendar(options);
  t.is(ev.length, 39);
});

test('addHebrewDates-locale', (t) => {
  const options = {year: 2017, month: 3, noHolidays: true, addHebrewDates: true, locale: 'he'};
  const ev = hebcal.hebrewCalendar(options)[0];
  t.is(ev.getFlags(), flags.HEBREW_DATE);
  t.is(ev.getDesc(), '3 Adar 5777');
  t.is(ev.render(), 'ג׳ אַדָר תשע״ז');
});

test('startAndEnd', (t) => {
  const ev1 = hebcal.hebrewCalendar({
    addHebrewDates: true,
    start: new Date(2018, 6, 4),
    end: new Date(2018, 6, 19),
  });
  t.is(gregDtString(ev1[0]), '7/4/2018');
  t.is(gregDtString(ev1[ev1.length - 1]), '7/19/2018');
  t.is(ev1.length, 17);

  const eventsHDate = hebcal.hebrewCalendar({
    addHebrewDates: true,
    start: new HDate(25, 'Tishrei', 5769),
    end: new HDate(9, 'Cheshvan', 5769),
  });
  t.is(gregDtString(eventsHDate[0]), '10/24/2008');
  t.is(gregDtString(eventsHDate[eventsHDate.length - 1]), '11/7/2008');
  t.is(eventsHDate.length, 17);

  const eventsAbsDate = hebcal.hebrewCalendar({
    addHebrewDates: true,
    start: 733319,
    end: 733359,
  });
  t.is(gregDtString(eventsAbsDate[0]), '10/4/2008');
  t.is(gregDtString(eventsAbsDate[eventsAbsDate.length - 1]), '11/13/2008');
  t.is(eventsAbsDate.length, 56);
});

test('renderBrief', (t) => {
  const options = {
    year: 2020,
    month: 3,
    location: Location.lookup('Helsinki'),
    candlelighting: true,
    sedrot: true,
  };
  const events = hebcal.hebrewCalendar(options);
  const expected = [
    ['Candle lighting', 'הדלקת נרות'],
    ['Shabbat Zachor', 'שַׁבָּת זָכוֹר'],
    ['Parashat Tetzaveh', 'פרשת תְּצַוֶּה'],
    ['Havdalah', 'הַבדָלָה'],
    ['Ta\'anit Esther', 'תַּעֲנִית אֶסְתֵּר'],
    ['Erev Purim', 'עֶרֶב פּוּרִים'],
    ['Purim', 'פּוּרִים'],
    ['Shushan Purim', 'שׁוּשָׁן פּוּרִים'],
    ['Candle lighting', 'הדלקת נרות'],
    ['Shabbat Parah', 'שַׁבָּת פּרה'],
    ['Parashat Ki Tisa', 'פרשת כִּי תִשָּׂא'],
    ['Havdalah', 'הַבדָלָה'],
    ['Candle lighting', 'הדלקת נרות'],
    ['Shabbat HaChodesh', 'שַׁבָּת הַחֹדֶשׁ'],
    ['Parashat Vayakhel-Pekudei', 'פרשת וַיַּקְהֵל־פְקוּדֵי'],
    ['Havdalah', 'הַבדָלָה'],
    ['Rosh Chodesh Nisan', 'רֹאשׁ חודש נִיסָן'],
    ['Candle lighting', 'הדלקת נרות'],
    ['Parashat Vayikra', 'פרשת וַיִּקְרָא'],
    ['Havdalah', 'הַבדָלָה'],
  ];
  for (let i = 0; i < events.length; i++) {
    t.is(events[i].renderBrief(), expected[i][0]);
    t.is(events[i].renderBrief('he'), expected[i][1]);
  }
});
