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
  t.is(events.length, 84);
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
  t.is(events.length, 86);
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
  t.is(events[0].render('en'), 'Daf Yomi: Niddah 51');
  t.is(events[0].renderBrief('en'), 'Niddah 51');
  t.is(events[0].getDesc(), 'Niddah 51');
  t.is(gregDtString(events[23]), '6/24/1975');
  t.is(events[23].getFlags(), flags.DAF_YOMI);
  t.is(events[23].render('en'), 'Daf Yomi: Berachot 2');
  t.is(events[23].renderBrief('en'), 'Berachot 2');
  t.is(events[23].getDesc(), 'Berachot 2');
  t.is(gregDtString(events[29]), '6/30/1975');
  t.is(events[29].getFlags(), flags.DAF_YOMI);
  t.is(events[29].render('en'), 'Daf Yomi: Berachot 8');
  t.is(events[29].renderBrief('en'), 'Berachot 8');
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
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Shabbat Zachor', 'שַׁבָּת זָכוֹר'],
    ['Parashat Tetzaveh', 'פָּרָשַׁת תְּצַוֶּה'],
    ['Havdalah', 'הַבדָלָה'],
    ['Fast begins', 'תחילת הַצוֹם'],
    ['Ta\'anit Esther', 'תַּעֲנִית אֶסְתֵּר'],
    ['Fast ends', 'סִיּוּם הַצוֹם'],
    ['Erev Purim', 'עֶרֶב פּוּרִים'],
    ['Purim', 'פּוּרִים'],
    ['Shushan Purim', 'שׁוּשָׁן פּוּרִים'],
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Shabbat Parah', 'שַׁבָּת פּרה'],
    ['Parashat Ki Tisa', 'פָּרָשַׁת כִּי תִשָּׂא'],
    ['Havdalah', 'הַבדָלָה'],
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Shabbat HaChodesh', 'שַׁבָּת הַחֹדֶשׁ'],
    ['Parashat Vayakhel-Pekudei', 'פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי'],
    ['Havdalah', 'הַבדָלָה'],
    ['Rosh Chodesh Nisan', 'רֹאשׁ חוֹדֶשׁ נִיסָן'],
    ['Candle lighting', 'הַדלָקָת נֵרוֹת'],
    ['Parashat Vayikra', 'פָּרָשַׁת וַיִּקְרָא'],
    ['Havdalah', 'הַבדָלָה'],
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
  t.is(events.length, 83);
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
  const error = t.throws(() => {
    HebrewCalendar.calendar({year: 0});
  }, {instanceOf: RangeError});
  t.is(error.message, 'Invalid Gregorian year 0');
});

test('getHolidaysForYear-throw', (t) => {
  const error = t.throws(() => {
    HebrewCalendar.getHolidaysForYear(-1);
  }, {instanceOf: RangeError});
  t.is(error.message, 'Hebrew year -1 out of range 1-32658');
});

test('version', (t) => {
  const version = HebrewCalendar.version();
  t.is(version.substring(0, version.indexOf('.')), '3');
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

test('mishnaYomi-only', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2022,
    isHebrewYear: false,
    noHolidays: true,
    mishnaYomi: true,
  });
  t.is(events.length, 365);
  t.is(events[0].getDesc(), 'Berakhot 3:2-3');
  t.is(events[2].getDesc(), 'Berakhot 3:6-4:1');
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
    return {dt: gregDtString(ev), alarm: ev.alarm && ev.alarm.toISOString()};
  });
  const expected = [
    {dt: '5/13/2022', alarm: '2022-05-13T08:41:42.000Z'},
    {dt: '5/14/2022', alarm: '2022-05-14T08:52:10.000Z'},
    {dt: '5/15/2022', alarm: '2022-05-15T09:05:35.000Z'},
    {dt: '5/16/2022', alarm: '2022-05-16T09:33:44.000Z'},
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

test('yerushalmiYomi-Vilna', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(1997, 2, 14),
    end: new Date(2001, 5, 22),
    noHolidays: true,
    yerushalmi: true,
  });
  t.is(events.length, 1554);
  const daf1 = events.filter((ev) => ev.daf.blatt === 1);
  const actual = daf1.map((ev) => gregDtString(ev) + ' ' + ev.render('en'));
  const expected = [
    '3/14/1997 Yerushalmi Berakhot 1',
    '5/21/1997 Yerushalmi Peah 1',
    '6/27/1997 Yerushalmi Demai 1',
    '7/31/1997 Yerushalmi Kilayim 1',
    '9/14/1997 Yerushalmi Sheviit 1',
    '10/16/1997 Yerushalmi Terumot 1',
    '12/14/1997 Yerushalmi Maasrot 1',
    '1/9/1998 Yerushalmi Maaser Sheni 1',
    '2/11/1998 Yerushalmi Challah 1',
    '3/11/1998 Yerushalmi Orlah 1',
    '3/31/1998 Yerushalmi Bikkurim 1',
    '4/13/1998 Yerushalmi Shabbat 1',
    '7/14/1998 Yerushalmi Eruvin 1',
    '9/18/1998 Yerushalmi Pesachim 1',
    '11/29/1998 Yerushalmi Beitzah 1',
    '12/21/1998 Yerushalmi Rosh Hashanah 1',
    '1/12/1999 Yerushalmi Yoma 1',
    '2/23/1999 Yerushalmi Sukkah 1',
    '3/21/1999 Yerushalmi Taanit 1',
    '4/16/1999 Yerushalmi Shekalim 1',
    '5/19/1999 Yerushalmi Megillah 1',
    '6/22/1999 Yerushalmi Chagigah 1',
    '7/14/1999 Yerushalmi Moed Katan 1',
    '8/3/1999 Yerushalmi Yevamot 1',
    '10/28/1999 Yerushalmi Ketubot 1',
    '1/8/2000 Yerushalmi Sotah 1',
    '2/24/2000 Yerushalmi Nedarim 1',
    '4/4/2000 Yerushalmi Nazir 1',
    '5/21/2000 Yerushalmi Gittin 1',
    '7/14/2000 Yerushalmi Kiddushin 1',
    '9/1/2000 Yerushalmi Bava Kamma 1',
    '10/16/2000 Yerushalmi Bava Metzia 1',
    '11/22/2000 Yerushalmi Bava Batra 1',
    '12/26/2000 Yerushalmi Shevuot 1',
    '2/8/2001 Yerushalmi Makkot 1',
    '2/17/2001 Yerushalmi Sanhedrin 1',
    '4/15/2001 Yerushalmi Avodah Zarah 1',
    '5/22/2001 Yerushalmi Horayot 1',
    '6/10/2001 Yerushalmi Niddah 1',
  ];
  t.deepEqual(actual, expected);
});

test('yerushalmiYomi-Schottenstein', (t) => {
  const events = HebrewCalendar.calendar({
    start: new Date(2022, 10, 14),
    end: new Date(2028, 7, 7),
    noHolidays: true,
    yerushalmi: true,
    yerushalmiEdition: 2,
  });
  t.is(events.length, 2094);
  const daf1 = events.filter((ev) => ev.daf.blatt === 1);
  const actual = daf1.map((ev) => gregDtString(ev) + ' ' + ev.render('en'));
  const expected = [
    '11/14/2022 Yerushalmi Berakhot 1',
    '2/16/2023 Yerushalmi Peah 1',
    '4/30/2023 Yerushalmi Demai 1',
    '7/16/2023 Yerushalmi Kilayim 1',
    '10/8/2023 Yerushalmi Sheviit 1',
    '1/3/2024 Yerushalmi Terumot 1',
    '4/19/2024 Yerushalmi Maasrot 1',
    '6/4/2024 Yerushalmi Maaser Sheni 1',
    '8/2/2024 Yerushalmi Challah 1',
    '9/20/2024 Yerushalmi Orlah 1',
    '11/1/2024 Yerushalmi Bikkurim 1',
    '11/27/2024 Yerushalmi Shabbat 1',
    '3/20/2025 Yerushalmi Eruvin 1',
    '5/30/2025 Yerushalmi Pesachim 1',
    '8/24/2025 Yerushalmi Shekalim 1',
    '10/24/2025 Yerushalmi Yoma 1',
    '12/20/2025 Yerushalmi Sukkah 1',
    '1/22/2026 Yerushalmi Beitzah 1',
    '3/12/2026 Yerushalmi Rosh Hashanah 1',
    '4/8/2026 Yerushalmi Taanit 1',
    '5/9/2026 Yerushalmi Megillah 1',
    '6/19/2026 Yerushalmi Chagigah 1',
    '7/17/2026 Yerushalmi Moed Katan 1',
    '8/9/2026 Yerushalmi Yevamot 1',
    '11/5/2026 Yerushalmi Ketubot 1',
    '1/21/2027 Yerushalmi Nedarim 1',
    '3/4/2027 Yerushalmi Nazir 1',
    '4/26/2027 Yerushalmi Sotah 1',
    '6/17/2027 Yerushalmi Gittin 1',
    '8/9/2027 Yerushalmi Kiddushin 1',
    '10/1/2027 Yerushalmi Bava Kamma 1',
    '11/10/2027 Yerushalmi Bava Metzia 1',
    '12/15/2027 Yerushalmi Bava Batra 1',
    '1/23/2028 Yerushalmi Sanhedrin 1',
    '4/7/2028 Yerushalmi Shevuot 1',
    '5/26/2028 Yerushalmi Avodah Zarah 1',
    '6/29/2028 Yerushalmi Makkot 1',
    '7/10/2028 Yerushalmi Horayot 1',
    '7/28/2028 Yerushalmi Niddah 1',
  ];
  t.deepEqual(actual, expected);
});

test('year1', (t) => {
  const events = HebrewCalendar.calendar({
    isHebrewYear: true,
    year: 1,
  });
  t.is(events.length, 78);
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
    {date: '-003760-09-19', desc: 'Parashat Ha\'Azinu'},
    {date: '-003760-10-03', desc: 'Parashat Bereshit'},
    {date: '-003760-10-10', desc: 'Parashat Noach'},
    {date: '-003760-10-17', desc: 'Parashat Lech-Lecha'},
    {date: '-003760-10-24', desc: 'Parashat Vayera'},
  ];
  t.deepEqual(actual, expected);
});
