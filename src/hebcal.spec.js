import test from 'ava';
import {HebrewCalendar, getStartAndEnd} from './hebcal';
import {HDate, months} from './hdate';
import {flags} from './event';
import {Location} from './location';

/**
 * @param {Event} ev
 * @return {string}
 * @private
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
  const events = HebrewCalendar.calendar(options);
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
  const events = HebrewCalendar.calendar(options);
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
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 82);
  t.is(events[0].getDesc(), 'Asara B\'Tevet');
  t.is(gregDtString(events[0]), '1/3/1993');
  t.is(events[70].getDesc(), 'Chanukah: 1 Candle');
  t.is(gregDtString(events[70]), '12/8/1993');
  t.is(events[81].getDesc(), 'Asara B\'Tevet');
  t.is(gregDtString(events[81]), '12/24/1993');
});

test('getStartAndEnd-2digit', (t) => {
  const [start, end] = getStartAndEnd({year: 88});
  t.is(start, 31777);
  t.is(end, 32142);
});

test('greg-2digit-year', (t) => {
  const options = {
    year: 50,
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events[0].getDate().greg().getFullYear(), 50);
  t.is(events[events.length - 1].getDate().greg().getFullYear(), 50);

  const opts2 = {
    addHebrewDates: true,
    year: 88,
  };
  const events2 = HebrewCalendar.calendar(opts2);
  t.is(events2[0].getDate().greg().getFullYear(), 88);
  t.is(events2[events2.length - 1].getDate().greg().getFullYear(), 88);
});

test('heb-year', (t) => {
  const options = {
    year: 5749,
    isHebrewYear: true,
  };
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 83);
  t.is(events[0].getDesc(), 'Erev Rosh Hashana');
  t.is(gregDtString(events[0]), '9/11/1988');
  t.is(events[1].getDesc(), 'Rosh Hashana 5749');
  t.is(gregDtString(events[1]), '9/12/1988');
  t.is(events[2].getDesc(), 'Rosh Hashana II');
  t.is(gregDtString(events[2]), '9/13/1988');
  t.is(events[5].getDesc(), 'Erev Yom Kippur');
  t.is(gregDtString(events[5]), '9/20/1988');
  t.is(events[82].getDesc(), 'Erev Rosh Hashana');
  t.is(gregDtString(events[82]), '9/29/1989');
});

test('no-options', (t) => {
  const now = new Date();
  const events = HebrewCalendar.calendar({});
  t.is(events[0].getDate().greg().getFullYear(), now.getFullYear());
  t.is(events[events.length - 1].getDate().greg().getFullYear(), now.getFullYear());
});

test('no-holidays', (t) => {
  const events = HebrewCalendar.calendar({noHolidays: true});
  t.is(events.length, 0);
});

test('sedrot-only', (t) => {
  const options = {year: 1993, noHolidays: true, sedrot: true, il: true};
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 49);
  t.is(events[0].getFlags(), flags.PARSHA_HASHAVUA);
  t.is(events[48].getFlags(), flags.PARSHA_HASHAVUA);
});

test('dafyomi-only', (t) => {
  const options = {
    year: 1975,
    isHebrewYear: false,
    month: 6,
    noHolidays: true,
    dafyomi: true,
  };
  const events = HebrewCalendar.calendar(options);
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
  const events = HebrewCalendar.calendar(options);
  t.is(events.length, 30);
  t.is(gregDtString(events[0]), '4/29/1968');
  t.is(events[0].getFlags(), flags.OMER_COUNT);
  t.is(events[0].omer, 16);
  t.is(events[0].render(), '16th day of the Omer');
  t.is(gregDtString(events[25]), '5/24/1968');
  t.is(events[25].getFlags(), flags.OMER_COUNT);
  t.is(events[25].omer, 41);
  t.is(events[25].render(), '41st day of the Omer');
});

test('molad-only', (t) => {
  const options = {
    year: 1975,
    isHebrewYear: false,
    noHolidays: true,
    molad: true,
  };
  const events = HebrewCalendar.calendar(options);
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
  const events = HebrewCalendar.calendar(options);
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
  const ev = HebrewCalendar.calendar(options)[0];
  t.is(ev.render(), 'Shabbos HaGadol');
});

test('locale-he', (t) => {
  const options = {year: 2020, month: 4, locale: 'he'};
  const ev = HebrewCalendar.calendar(options)[0];
  t.is(ev.render(), 'שַׁבָּת הַגָּדוֹל');
});

test('locale-he-rosh-hashana', (t) => {
  const RH = new HDate(1, months.TISHREI, 5749);
  const options = {start: RH, end: RH};
  const ev = HebrewCalendar.calendar(options)[0];
  t.is(ev.render('en'), 'Rosh Hashana 5749');
  t.is(ev.render('he'), 'רֹאשׁ הַשָּׁנָה 5749');
});

test('addHebrewDatesForEvents', (t) => {
  const options0 = {year: 2017, month: 3, noHolidays: true, addHebrewDatesForEvents: true};
  const ev0 = HebrewCalendar.calendar(options0);
  t.is(ev0.length, 0);

  const options1 = {year: 2017, month: 3};
  const ev1 = HebrewCalendar.calendar(options1);
  t.is(ev1.length, 8);

  const options = {year: 2017, month: 3, addHebrewDatesForEvents: true};
  const ev = HebrewCalendar.calendar(options);
  t.is(ev.length, 15);
});

test('addHebrewDates', (t) => {
  const options0 = {year: 2017, month: 3, noHolidays: true, addHebrewDates: true};
  const events = HebrewCalendar.calendar(options0);
  t.is(events.length, 31);
  t.is(events[0].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(events[0]), '3/1/2017');
  t.is(events[0].getDesc(), '3 Adar 5777');
  t.is(events[0].render(), '3rd of Adar, 5777');

  t.is(events[1].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(events[1]), '3/2/2017');
  t.is(events[1].getDesc(), '4 Adar 5777');
  t.is(events[1].render(), '4th of Adar, 5777');

  t.is(events[2].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(events[2]), '3/3/2017');
  t.is(events[2].getDesc(), '5 Adar 5777');
  t.is(events[2].render(), '5th of Adar, 5777');

  const options = {
    addHebrewDates: true,
    omer: true,
    candlelighting: true,
    sedrot: true,
    year: 2020,
    havdalahMins: 50,
    candleLightingMins: 18,
    isHebrewYear: false,
    month: 4,
    locale: 's',
    location: Location.lookup('Providence'),
  };
  const ev = HebrewCalendar.calendar(options);
  t.is(ev.length, 84);
  t.is(ev[0].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(ev[0]), '4/1/2020');
  t.is(ev[0].getDesc(), '7 Nisan 5780');
  t.is(ev[0].render(), '7th of Nisan, 5780');

  t.is(gregDtString(ev[1]), '4/2/2020');
  t.is(ev[1].getDesc(), '8 Nisan 5780');

  t.is(gregDtString(ev[2]), '4/3/2020');
  t.is(ev[2].getDesc(), '9 Nisan 5780');

  t.is(gregDtString(ev[3]), '4/3/2020');
  t.is(ev[3].getDesc(), 'Candle lighting');

  t.is(gregDtString(ev[4]), '4/4/2020');
  t.is(ev[4].getDesc(), '10 Nisan 5780');

  t.is(gregDtString(ev[5]), '4/4/2020');
  t.is(ev[5].getDesc(), 'Shabbat HaGadol');
});

test('addHebrewDates-locale', (t) => {
  const options = {year: 2017, month: 3, noHolidays: true, addHebrewDates: true, locale: 'he'};
  const ev = HebrewCalendar.calendar(options)[0];
  t.is(ev.getFlags(), flags.HEBREW_DATE);
  t.is(ev.getDesc(), '3 Adar 5777');
  t.is(ev.render(), 'ג׳ אַדָר תשע״ז');
});

test('startAndEnd', (t) => {
  const ev1 = HebrewCalendar.calendar({
    addHebrewDates: true,
    start: new Date(2018, 6, 4),
    end: new Date(2018, 6, 19),
  });
  t.is(gregDtString(ev1[0]), '7/4/2018');
  t.is(gregDtString(ev1[ev1.length - 1]), '7/19/2018');
  t.is(ev1.length, 17);

  const eventsHDate = HebrewCalendar.calendar({
    addHebrewDates: true,
    start: new HDate(25, 'Tishrei', 5769),
    end: new HDate(9, 'Cheshvan', 5769),
  });
  t.is(gregDtString(eventsHDate[0]), '10/24/2008');
  t.is(gregDtString(eventsHDate[eventsHDate.length - 1]), '11/7/2008');
  t.is(eventsHDate.length, 17);

  const eventsAbsDate = HebrewCalendar.calendar({
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
  const events = HebrewCalendar.calendar(options);
  const expected = [
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Shabbat Zachor', 'שַׁבָּת זָכוֹר'],
    ['Parashat Tetzaveh', 'פרשת תְּצַוֶּה'],
    ['Havdalah', 'הַבדָלָה'],
    ['Fast begins', 'תחילת הצום'],
    ['Ta\'anit Esther', 'תַּעֲנִית אֶסְתֵּר'],
    ['Fast ends', 'סיום הצום'],
    ['Erev Purim', 'עֶרֶב פּוּרִים'],
    ['Purim', 'פּוּרִים'],
    ['Shushan Purim', 'שׁוּשָׁן פּוּרִים'],
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Shabbat Parah', 'שַׁבָּת פּרה'],
    ['Parashat Ki Tisa', 'פרשת כִּי תִשָּׂא'],
    ['Havdalah', 'הַבדָלָה'],
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Shabbat HaChodesh', 'שַׁבָּת הַחֹדֶשׁ'],
    ['Parashat Vayakhel-Pekudei', 'פרשת וַיַּקְהֵל־פְקוּדֵי'],
    ['Havdalah', 'הַבדָלָה'],
    ['Rosh Chodesh Nisan', 'רֹאשׁ חוֹדֶשׁ נִיסָן'],
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Parashat Vayikra', 'פרשת וַיִּקְרָא'],
    ['Havdalah', 'הַבדָלָה'],
  ];
  for (let i = 0; i < events.length; i++) {
    t.is(events[i].renderBrief(), expected[i][0]);
    t.is(events[i].renderBrief('he'), expected[i][1]);
  }
});

test('reformatTimeStr', (t) => {
  t.is(HebrewCalendar.reformatTimeStr('20:30', 'pm', {}), '8:30pm');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' P.M.', {}), '8:30 P.M.');
  t.is(HebrewCalendar.reformatTimeStr('20:30', '', {}), '8:30');
  t.is(HebrewCalendar.reformatTimeStr('20:30', '', {locale: 'fr'}), '8:30');
  t.is(HebrewCalendar.reformatTimeStr('20:30', '', {locale: 'en'}), '8:30');
  t.is(HebrewCalendar.reformatTimeStr('20:30', '', {locale: 'ashkenazi'}), '8:30');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: {cc: 'FR'}}), '20:30');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: {cc: 'IL'}}), '20:30');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: {cc: 'US'}}), '8:30 PM');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: {cc: 'CA'}}), '8:30 PM');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: {cc: 'BR'}}), '8:30 PM');
  t.is(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: {cc: 'MX'}}), '20:30');

  t.is(HebrewCalendar.reformatTimeStr('11:45', 'pm', {}), '11:45am');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' P.M.', {}), '11:45 A.M.');
  t.is(HebrewCalendar.reformatTimeStr('11:45', '', {}), '11:45');
  t.is(HebrewCalendar.reformatTimeStr('11:45', '', {locale: 'fr'}), '11:45');
  t.is(HebrewCalendar.reformatTimeStr('11:45', '', {locale: 'en'}), '11:45');
  t.is(HebrewCalendar.reformatTimeStr('11:45', '', {locale: 'ashkenazi'}), '11:45');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: {cc: 'FR'}}), '11:45');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: {cc: 'IL'}}), '11:45');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: {cc: 'US'}}), '11:45 AM');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: {cc: 'CA'}}), '11:45 AM');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: {cc: 'BR'}}), '11:45 AM');
  t.is(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: {cc: 'MX'}}), '11:45');
});

test('no-rosh-chodesh', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, noRoshChodesh: true});
  const ev = events.find((ev) => ev.getDesc() == 'Rosh Chodesh Sivan');
  t.is(ev, undefined);
});

test('no-minor-fast', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, noMinorFast: true});
  const ev = events.find((ev) => ev.getDesc() == 'Tzom Gedaliah');
  t.is(ev, undefined);
});

test('no-modern', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, noModern: true});
  const ev = events.find((ev) => ev.getDesc() == 'Yom HaZikaron');
  t.is(ev, undefined);
});

test('shabbat-mevarchim', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, shabbatMevarchim: true});
  const ev = events.find((ev) => ev.getDesc() == 'Shabbat Mevarchim Chodesh Sivan');
  t.is(ev.getDate().toString(), '29 Iyyar 5780');
});

test('molad', (t) => {
  const events = HebrewCalendar.calendar({year: 5769, isHebrewYear: true, molad: true});
  const ev = events.find((ev) => ev.getDesc() == 'Molad Tevet 5769');
  t.is(ev.getDate().toString(), '23 Kislev 5769');
});

test('year2', (t) => {
  const events = HebrewCalendar.calendar({year: 2});
  t.is(events.length, 79);
});

test('year1', (t) => {
  const error = t.throws(() => {
    HebrewCalendar.calendar({year: 1});
  }, {instanceOf: RangeError});
  t.is(error.message, 'Hebrew year 3761 out of range 3762-32658');
});

test('getHolidaysForYear-throw', (t) => {
  const error = t.throws(() => {
    HebrewCalendar.getHolidaysForYear(3210);
  }, {instanceOf: RangeError});
  t.is(error.message, 'Hebrew year 3210 out of range 3762-32658');
});
