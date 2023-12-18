import test from 'ava';
import {months} from '@hebcal/hdate';
import {HebrewCalendar, getStartAndEnd} from './hebcal.js';
import {HDate} from './hdate.js';
import {flags} from './event.js';
import {Location} from './location.js';

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
  t.is(events.length, 85);
  t.is(events[0].getDesc(), 'Asara B\'Tevet');
  t.is(gregDtString(events[0]), '1/3/1993');
  t.is(events[72].getDesc(), 'Chanukah: 1 Candle');
  t.is(gregDtString(events[72]), '12/8/1993');
  t.is(events[events.length - 1].getDesc(), 'Asara B\'Tevet');
  t.is(gregDtString(events[events.length - 1]), '12/24/1993');
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
  t.is(events.length, 87);
  t.is(events[0].getDesc(), 'Erev Rosh Hashana');
  t.is(gregDtString(events[0]), '9/11/1988');
  t.is(events[1].getDesc(), 'Rosh Hashana 5749');
  t.is(gregDtString(events[1]), '9/12/1988');
  t.is(events[2].getDesc(), 'Rosh Hashana II');
  t.is(gregDtString(events[2]), '9/13/1988');
  t.is(events[5].getDesc(), 'Erev Yom Kippur');
  t.is(gregDtString(events[5]), '9/20/1988');
  t.is(events[events.length - 1].getDesc(), 'Erev Rosh Hashana');
  t.is(gregDtString(events[events.length - 1]), '9/29/1989');
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
  t.is(events[0].render('en'), '16th day of the Omer');
  t.is(gregDtString(events[25]), '5/24/1968');
  t.is(events[25].getFlags(), flags.OMER_COUNT);
  t.is(events[25].omer, 41);
  t.is(events[25].render('en'), '41st day of the Omer');
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
  t.is(events[0].render('en'), '3rd of Adar, 5777');

  t.is(events[1].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(events[1]), '3/2/2017');
  t.is(events[1].getDesc(), '4 Adar 5777');
  t.is(events[1].render('en'), '4th of Adar, 5777');

  t.is(events[2].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(events[2]), '3/3/2017');
  t.is(events[2].getDesc(), '5 Adar 5777');
  t.is(events[2].render('en'), '5th of Adar, 5777');

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
  t.is(ev.length, 85);
  t.is(ev[0].getFlags(), flags.HEBREW_DATE);
  t.is(gregDtString(ev[0]), '4/1/2020');
  t.is(ev[0].getDesc(), '7 Nisan 5780');
  t.is(ev[0].render('en'), '7th of Nisan, 5780');

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
  t.is(ev.render('he'), 'ג׳ אַדָר תשע״ז');
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
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Shabbat Zachor', 'שַׁבָּת זָכוֹר'],
    ['Parashat Tetzaveh', 'פָּרָשַׁת תְּצַוֶּה'],
    ['Havdalah', 'הַבְדָּלָה'],
    ['Fast begins', 'תחילת הַצוֹם'],
    ['Ta\'anit Esther', 'תַּעֲנִית אֶסְתֵּר'],
    ['Fast ends', 'סִיּוּם הַצוֹם'],
    ['Erev Purim', 'עֶרֶב פּוּרִים'],
    ['Purim', 'פּוּרִים'],
    ['Shushan Purim', 'שׁוּשָׁן פּוּרִים'],
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Shabbat Parah', 'שַׁבָּת פּרה'],
    ['Parashat Ki Tisa', 'פָּרָשַׁת כִּי תִשָּׂא'],
    ['Havdalah', 'הַבְדָּלָה'],
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Shabbat HaChodesh', 'שַׁבָּת הַחֹדֶשׁ'],
    ['Parashat Vayakhel-Pekudei', 'פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי'],
    ['Havdalah', 'הַבְדָּלָה'],
    ['Rosh Chodesh Nisan', 'רֹאשׁ חוֹדֶשׁ נִיסָן'],
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Parashat Vayikra', 'פָּרָשַׁת וַיִּקְרָא'],
    ['Havdalah', 'הַבְדָּלָה'],
  ];
  for (let i = 0; i < events.length; i++) {
    t.is(events[i].renderBrief('en'), expected[i][0]);
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

  t.is(HebrewCalendar.reformatTimeStr('00:07', 'pm', {}), '12:07am');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' P.M.', {}), '12:07 A.M.');
  t.is(HebrewCalendar.reformatTimeStr('00:07', '', {}), '00:07');
  t.is(HebrewCalendar.reformatTimeStr('00:07', '', {locale: 'fr'}), '00:07');
  t.is(HebrewCalendar.reformatTimeStr('00:07', '', {locale: 'en'}), '00:07');
  t.is(HebrewCalendar.reformatTimeStr('00:07', '', {locale: 'ashkenazi'}), '00:07');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: {cc: 'FR'}}), '00:07');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: {cc: 'IL'}}), '00:07');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: {cc: 'US'}}), '12:07 AM');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: {cc: 'CA'}}), '12:07 AM');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: {cc: 'BR'}}), '12:07 AM');
  t.is(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: {cc: 'MX'}}), '00:07');
});

test('reformatTimeStr-hour12', (t) => {
  t.is(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'fr', hour12: true}), '11:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'en', hour12: true}), '11:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'ashkenazi', hour12: true}), '11:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'FR'}, hour12: true}), '11:56 PM');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'IL'}, hour12: true}), '11:56 PM');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'US'}, hour12: true}), '11:56 PM');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'CA'}, hour12: true}), '11:56 PM');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'BR'}, hour12: true}), '11:56 PM');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'MX'}, hour12: true}), '11:56 PM');

  t.is(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'fr', hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'en', hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'ashkenazi', hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'FR'}, hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'IL'}, hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'US'}, hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'CA'}, hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'BR'}, hour12: false}), '23:56');
  t.is(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: {cc: 'MX'}, hour12: false}), '23:56');
});

test('no-rosh-chodesh', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, noRoshChodesh: true});
  const ev = events.find((ev) => ev.getDesc() == 'Rosh Chodesh Sivan');
  t.is(ev, undefined);
});

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev) {
  return {date: gregDtString(ev), desc: ev.getDesc()};
}

test('rosh-chodesh-only', (t) => {
  const events = HebrewCalendar.calendar({year: 2020, mask: flags.ROSH_CHODESH});
  const actual = events.map(eventDateDesc);
  const expected = [
    {date: '1/27/2020', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '2/25/2020', desc: 'Rosh Chodesh Adar'},
    {date: '2/26/2020', desc: 'Rosh Chodesh Adar'},
    {date: '3/26/2020', desc: 'Rosh Chodesh Nisan'},
    {date: '4/24/2020', desc: 'Rosh Chodesh Iyyar'},
    {date: '4/25/2020', desc: 'Rosh Chodesh Iyyar'},
    {date: '5/24/2020', desc: 'Rosh Chodesh Sivan'},
    {date: '6/22/2020', desc: 'Rosh Chodesh Tamuz'},
    {date: '6/23/2020', desc: 'Rosh Chodesh Tamuz'},
    {date: '7/22/2020', desc: 'Rosh Chodesh Av'},
    {date: '8/20/2020', desc: 'Rosh Chodesh Elul'},
    {date: '8/21/2020', desc: 'Rosh Chodesh Elul'},
    {date: '10/18/2020', desc: 'Rosh Chodesh Cheshvan'},
    {date: '10/19/2020', desc: 'Rosh Chodesh Cheshvan'},
    {date: '11/17/2020', desc: 'Rosh Chodesh Kislev'},
    {date: '12/16/2020', desc: 'Rosh Chodesh Tevet'},
  ];
  t.deepEqual(actual, expected);
});

test('fasts-only', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2020,
    mask: flags.MINOR_FAST | flags.MAJOR_FAST,
  });
  const actual = events.map(eventDateDesc);
  const expected = [
    {date: '1/7/2020', desc: 'Asara B\'Tevet'},
    {date: '3/9/2020', desc: 'Ta\'anit Esther'},
    {date: '4/8/2020', desc: 'Ta\'anit Bechorot'},
    {date: '7/9/2020', desc: 'Tzom Tammuz'},
    {date: '7/29/2020', desc: 'Erev Tish\'a B\'Av'},
    {date: '7/30/2020', desc: 'Tish\'a B\'Av'},
    {date: '9/21/2020', desc: 'Tzom Gedaliah'},
    {date: '9/28/2020', desc: 'Yom Kippur'},
    {date: '12/25/2020', desc: 'Asara B\'Tevet'},
  ];
  t.deepEqual(actual, expected);
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

test('no-modern-il', (t) => {
  const events = HebrewCalendar.calendar({
    il: true,
    noMinorHolidays: true,
    noRoshChodesh: true,
    noModern: true,
    noMinorFast: true,
    noSpecialShabbat: true,
    candleLightingMins: 18,
    isHebrewYear: false,
    year: 2022,
    locale: 's',
  });
  const ev = events.find((ev) => ev.getDesc() == 'Family Day');
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
  t.is(events.length, 84);
  const events2 = events.slice(0, 3);
  const actual = events2.map(eventISODateDesc);
  const expected = [
    {date: '0002-01-01', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '0002-01-12', desc: 'Shabbat Shirah'},
    {date: '0002-01-15', desc: 'Tu BiShvat'},
  ];
  t.deepEqual(actual, expected);
});

test('year0', (t) => {
  const events = HebrewCalendar.calendar({year: 0});
  t.is(events.length, 82);
});

test('getHolidaysForYear-throw', (t) => {
  const error = t.throws(() => {
    HebrewCalendar.getHolidaysForYear(-1);
  }, {instanceOf: RangeError});
  t.is(error.message, 'Hebrew year -1 out of range 1-32658');
});

test('version', (t) => {
  const version = HebrewCalendar.version();
  t.is(version.substring(0, version.indexOf('.')), '5');
});

test('candlelighting-no-location-throw', (t) => {
  const error = t.throws(() => {
    HebrewCalendar.calendar({candlelighting: true});
  }, {instanceOf: TypeError});
  t.is(error.message, 'options.candlelighting requires valid options.location');
});

test('havdalahDeg-havdalahMin-throw', (t) => {
  const location = new Location(0, 0, false, 'UTC');
  const error = t.throws(() => {
    HebrewCalendar.calendar({candlelighting: true, location, havdalahDeg: 8.5, havdalahMins: 50});
  }, {instanceOf: TypeError});
  t.is(error.message, 'options.havdalahMins and options.havdalahDeg are mutually exclusive');
});

test('getStartAndEnd-throw', (t) => {
  const error = t.throws(() => {
    getStartAndEnd({start: new Date(2020, 3, 3)});
  }, {instanceOf: TypeError});
  t.is(error.message, 'Both options.start and options.end are required');

  const error2 = t.throws(() => {
    getStartAndEnd({end: new Date(2020, 3, 3)});
  }, {instanceOf: TypeError});
  t.is(error2.message, 'Both options.start and options.end are required');

  const error3 = t.throws(() => {
    getStartAndEnd({year: 'abcd'});
  }, {instanceOf: RangeError});
  t.is(error3.message, 'Invalid year abcd');

  const error4 = t.throws(() => {
    getStartAndEnd({year: -55, isHebrewYear: true});
  }, {instanceOf: RangeError});
  t.is(error4.message, 'Invalid Hebrew year -55');

  const error5 = t.throws(() => {
    getStartAndEnd({year: 0, isHebrewYear: true});
  }, {instanceOf: RangeError});
  t.is(error5.message, 'Invalid Hebrew year 0');
});

/**
 * @private
 * @param {Event} ev
 * @return {any}
 */
function eventISODateDesc(ev) {
  const isoDateString = ev.getDate().greg().toISOString();
  const date = isoDateString.substring(0, isoDateString.indexOf('T'));
  return {date, desc: ev.getDesc()};
}

test('bce', (t) => {
  const options = {
    year: 2222,
    isHebrewYear: true,
  };
  const events = HebrewCalendar.calendar(options).slice(0, 25);
  const actual = events.map(eventISODateDesc);
  const expected = [
    {date: '-001539-09-07', desc: 'Erev Rosh Hashana'},
    {date: '-001539-09-08', desc: 'Rosh Hashana 2222'},
    {date: '-001539-09-09', desc: 'Rosh Hashana II'},
    {date: '-001539-09-11', desc: 'Tzom Gedaliah'},
    {date: '-001539-09-16', desc: 'Erev Yom Kippur'},
    {date: '-001539-09-17', desc: 'Yom Kippur'},
    {date: '-001539-09-17', desc: 'Shabbat Shuva'},
    {date: '-001539-09-21', desc: 'Erev Sukkot'},
    {date: '-001539-09-22', desc: 'Sukkot I'},
    {date: '-001539-09-23', desc: 'Sukkot II'},
    {date: '-001539-09-24', desc: 'Sukkot III (CH\'\'M)'},
    {date: '-001539-09-25', desc: 'Sukkot IV (CH\'\'M)'},
    {date: '-001539-09-26', desc: 'Sukkot V (CH\'\'M)'},
    {date: '-001539-09-27', desc: 'Sukkot VI (CH\'\'M)'},
    {date: '-001539-09-28', desc: 'Sukkot VII (Hoshana Raba)'},
    {date: '-001539-09-29', desc: 'Shmini Atzeret'},
    {date: '-001539-09-30', desc: 'Simchat Torah'},
    {date: '-001539-10-07', desc: 'Rosh Chodesh Cheshvan'},
    {date: '-001539-10-08', desc: 'Rosh Chodesh Cheshvan'},
    {date: '-001539-11-06', desc: 'Rosh Chodesh Kislev'},
    {date: '-001539-11-07', desc: 'Rosh Chodesh Kislev'},
    {date: '-001539-11-30', desc: 'Chanukah: 1 Candle'},
    {date: '-001539-12-01', desc: 'Chanukah: 2 Candles'},
    {date: '-001539-12-02', desc: 'Chanukah: 3 Candles'},
    {date: '-001539-12-03', desc: 'Chanukah: 4 Candles'},
  ];
  t.deepEqual(actual, expected);
});

test('omer-alarm', (t) => {
  const dt = new Date(2022, 3, 26);
  const events = HebrewCalendar.calendar({
    start: dt,
    end: dt,
    omer: true,
    candlelighting: true,
    location: Location.lookup('San Francisco'),
    noHolidays: true,
  });
  const alarm = events[0].alarm;
  t.is(typeof alarm, 'object');
  t.is(alarm instanceof Date, true);
  t.is(alarm.toISOString(), '2022-04-26T03:28:34.000Z');
});

test('omer-alarm-alaska', (t) => {
  const location = new Location(63.780185, -145.36958, false, 'America/Anchorage', 'Delta Junction, AK 99737', 'US');
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 4, 13),
    end: new Date(2022, 4, 20),
    omer: true,
    candlelighting: true,
    location,
    noHolidays: true,
  }).filter((ev) => ev.getFlags() & flags.OMER_COUNT);
  const alarms = events.map((ev) => {
    return {dt: gregDtString(ev), alarm: ev.alarm?.toISOString()};
  });
  const expected = [
    {dt: '5/13/2022', alarm: '2022-05-13T08:41:45.000Z'},
    {dt: '5/14/2022', alarm: '2022-05-14T08:52:14.000Z'},
    {dt: '5/15/2022', alarm: '2022-05-15T09:05:42.000Z'},
    {dt: '5/16/2022', alarm: '2022-05-16T09:35:22.000Z'},
    {dt: '5/17/2022', alarm: undefined},
    {dt: '5/18/2022', alarm: undefined},
    {dt: '5/19/2022', alarm: undefined},
    {dt: '5/20/2022', alarm: undefined},
  ];
  t.deepEqual(alarms, expected);
});

test('ykk-only', (t) => {
  const events = HebrewCalendar.calendar({
    yomKippurKatan: true,
    noHolidays: true,
    year: 5782,
    isHebrewYear: true,
  });
  t.is(events.length, 9);
});

test('hallel', (t) => {
  t.is(HebrewCalendar.hallel(new HDate(25, months.KISLEV, 5780), false), 2);
  t.is(HebrewCalendar.hallel(new HDate(26, months.KISLEV, 5780), true), 2);
});

test('tachanun', (t) => {
  const erevRch = new HDate(29, months.CHESHVAN, 5787);
  t.deepEqual(HebrewCalendar.tachanun(erevRch, false),
      {shacharit: true, mincha: false, allCongs: true});
  const rch = new HDate(1, months.KISLEV, 5787);
  t.deepEqual(HebrewCalendar.tachanun(rch, true),
      {shacharit: false, mincha: false, allCongs: false});
});

test('year1', (t) => {
  const events = HebrewCalendar.calendar({
    isHebrewYear: true,
    year: 1,
  });
  t.is(events.length, 79);
});

test('year1-sedrot', (t) => {
  const events = HebrewCalendar.calendar({
    isHebrewYear: true,
    year: 1,
    sedrot: true,
    noHolidays: true,
  });
  t.is(events.length, 47);
  const actual = events.slice(0, 6).map(eventISODateDesc);
  const expected = [
    {date: '-003760-09-12', desc: 'Parashat Vayeilech'},
    {date: '-003760-09-19', desc: 'Parashat Ha\'azinu'},
    {date: '-003760-10-03', desc: 'Parashat Bereshit'},
    {date: '-003760-10-10', desc: 'Parashat Noach'},
    {date: '-003760-10-17', desc: 'Parashat Lech-Lecha'},
    {date: '-003760-10-24', desc: 'Parashat Vayera'},
  ];
  t.deepEqual(actual, expected);
});
