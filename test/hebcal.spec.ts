import {expect, test} from 'vitest';
import {HDate, isoDateString, months} from '@hebcal/hdate';
import {CalOptions} from '../src/CalOptions';
import {HebrewCalendar} from '../src/hebcal';
import {Event, flags} from '../src/event';
import {Location} from '../src/location';
import { OmerEvent } from '../src/omer';
import { YomKippurKatanEvent } from '../src/YomKippurKatanEvent';
import { FastDayEvent } from '../src/candles';

function gregDtString(ev: Event): string {
  return ev.getDate().greg().toLocaleDateString('en-US');
}

test('heb-month', () => {
  const options: CalOptions = {
    year: 5780,
    isHebrewYear: true,
    month: 'Iyyar',
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(7);
  expect(events[0].getDesc()).toBe('Rosh Chodesh Iyyar');
  expect(gregDtString(events[0])).toBe('4/25/2020');
  expect(events[4].getDesc()).toBe('Lag BaOmer');
  expect(gregDtString(events[4])).toBe('5/12/2020');
});

test('greg-month', () => {
  const options: CalOptions = {
    year: 2017,
    isHebrewYear: false,
    month: 3,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(8);
  expect(events[0].getDesc()).toBe('Ta\'anit Esther');
  expect(gregDtString(events[0])).toBe('3/9/2017');
  expect(events[7].getDesc()).toBe('Rosh Chodesh Nisan');
  expect(gregDtString(events[7])).toBe('3/28/2017');
});

test('greg-year', () => {
  const options: CalOptions = {
    year: 1993,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(85);
  expect(events[0].getDesc()).toBe('Asara B\'Tevet');
  expect(gregDtString(events[0])).toBe('1/3/1993');
  expect(events[72].getDesc()).toBe('Chanukah: 1 Candle');
  expect(gregDtString(events[72])).toBe('12/8/1993');
  expect(events[events.length - 1].getDesc()).toBe('Asara B\'Tevet');
  expect(gregDtString(events[events.length - 1])).toBe('12/24/1993');
});


test('greg-2digit-year', () => {
  const options: CalOptions = {
    year: 50,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events[0].getDate().greg().getFullYear()).toBe(50);
  expect(events[events.length - 1].getDate().greg().getFullYear()).toBe(50);

  const opts2 = {
    addHebrewDates: true,
    year: 88,
  };
  const events2 = HebrewCalendar.calendar(opts2);
  expect(events2[0].getDate().greg().getFullYear()).toBe(88);
  expect(events2[events2.length - 1].getDate().greg().getFullYear()).toBe(88);
});

test('heb-year', () => {
  const options: CalOptions = {
    year: 5749,
    isHebrewYear: true,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(87);
  expect(events[0].getDesc()).toBe('Erev Rosh Hashana');
  expect(gregDtString(events[0])).toBe('9/11/1988');
  expect(events[1].getDesc()).toBe('Rosh Hashana 5749');
  expect(gregDtString(events[1])).toBe('9/12/1988');
  expect(events[2].getDesc()).toBe('Rosh Hashana II');
  expect(gregDtString(events[2])).toBe('9/13/1988');
  expect(events[5].getDesc()).toBe('Erev Yom Kippur');
  expect(gregDtString(events[5])).toBe('9/20/1988');
  expect(events[events.length - 1].getDesc()).toBe('Erev Rosh Hashana');
  expect(gregDtString(events[events.length - 1])).toBe('9/29/1989');
});

test('no-options', () => {
  const now = new Date();
  const events = HebrewCalendar.calendar({});
  expect(events[0].getDate().greg().getFullYear()).toBe(now.getFullYear());
  expect(events[events.length - 1].getDate().greg().getFullYear()).toBe(now.getFullYear());
});

test('no-holidays', () => {
  const events = HebrewCalendar.calendar({noHolidays: true});
  expect(events.length).toBe(0);
});

test('sedrot-only', () => {
  const options: CalOptions = {year: 1993, noHolidays: true, sedrot: true, il: true};
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(49);
  expect(events[0].getFlags()).toBe(flags.PARSHA_HASHAVUA);
  expect(events[48].getFlags()).toBe(flags.PARSHA_HASHAVUA);
});

test('omer-only', () => {
  const options: CalOptions = {
    year: 5728,
    isHebrewYear: true,
    month: 'Iyyar',
    noHolidays: true,
    omer: true,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(30);
  const ev0 = events[0] as OmerEvent;
  expect(gregDtString(ev0)).toBe('4/29/1968');
  expect(ev0.getFlags()).toBe(flags.OMER_COUNT);
  expect(ev0.omer).toBe(16);
  expect(ev0.render('en')).toBe('16th day of the Omer');
  const ev25 = events[25] as OmerEvent;
  expect(gregDtString(ev25)).toBe('5/24/1968');
  expect(ev25.getFlags()).toBe(flags.OMER_COUNT);
  expect(ev25.omer).toBe(41);
  expect(ev25.render('en')).toBe('41st day of the Omer');
});

test('molad-only', () => {
  const options: CalOptions = {
    year: 1975,
    isHebrewYear: false,
    noHolidays: true,
    molad: true,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(12);
  expect(events[0].getDesc().startsWith('Molad')).toBe(true);
  expect(events[0].getFlags()).toBe(flags.MOLAD);
});

test('multi-year', () => {
  const options: CalOptions = {
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
  expect(numRoshHashanaII).toBe(7);
});

test('ashkenazi', () => {
  const options: CalOptions = {year: 2020, month: 4, ashkenazi: true};
  const ev = HebrewCalendar.calendar(options)[0];
  expect(ev.render()).toBe('Shabbos HaGadol');
});

test('locale-he', () => {
  const options: CalOptions = {year: 2020, month: 4, locale: 'he'};
  const ev = HebrewCalendar.calendar(options)[0];
  expect(ev.render()).toBe('שַׁבַּת הַגָּדוֹל');
});

test('locale-he-rosh-hashana', () => {
  const RH = new HDate(1, months.TISHREI, 5749);
  const options: CalOptions = {start: RH, end: RH};
  const ev = HebrewCalendar.calendar(options)[0];
  expect(ev.render('en')).toBe('Rosh Hashana 5749');
  expect(ev.render('he')).toBe('רֹאשׁ הַשָּׁנָה 5749');
});

test('addHebrewDatesForEvents', () => {
  const options0 = {year: 2017, month: 3, noHolidays: true, addHebrewDatesForEvents: true};
  const ev0 = HebrewCalendar.calendar(options0);
  expect(ev0.length).toBe(0);

  const options1 = {year: 2017, month: 3};
  const ev1 = HebrewCalendar.calendar(options1);
  expect(ev1.length).toBe(8);

  const options: CalOptions = {year: 2017, month: 3, addHebrewDatesForEvents: true};
  const ev = HebrewCalendar.calendar(options);
  expect(ev.length).toBe(15);
});

test('addHebrewDates', () => {
  const options0 = {year: 2017, month: 3, noHolidays: true, addHebrewDates: true};
  const events = HebrewCalendar.calendar(options0);
  expect(events.length).toBe(31);
  expect(events[0].getFlags()).toBe(flags.HEBREW_DATE);
  expect(gregDtString(events[0])).toBe('3/1/2017');
  expect(events[0].getDesc()).toBe('3 Adar 5777');
  expect(events[0].render('en')).toBe('3rd of Adar, 5777');

  expect(events[1].getFlags()).toBe(flags.HEBREW_DATE);
  expect(gregDtString(events[1])).toBe('3/2/2017');
  expect(events[1].getDesc()).toBe('4 Adar 5777');
  expect(events[1].render('en')).toBe('4th of Adar, 5777');

  expect(events[2].getFlags()).toBe(flags.HEBREW_DATE);
  expect(gregDtString(events[2])).toBe('3/3/2017');
  expect(events[2].getDesc()).toBe('5 Adar 5777');
  expect(events[2].render('en')).toBe('5th of Adar, 5777');

  const options: CalOptions = {
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
  expect(ev.length).toBe(85);
  expect(ev[0].getFlags()).toBe(flags.HEBREW_DATE);
  expect(gregDtString(ev[0])).toBe('4/1/2020');
  expect(ev[0].getDesc()).toBe('7 Nisan 5780');
  expect(ev[0].render('en')).toBe('7th of Nisan, 5780');

  expect(gregDtString(ev[1])).toBe('4/2/2020');
  expect(ev[1].getDesc()).toBe('8 Nisan 5780');

  expect(gregDtString(ev[2])).toBe('4/3/2020');
  expect(ev[2].getDesc()).toBe('9 Nisan 5780');

  expect(gregDtString(ev[3])).toBe('4/3/2020');
  expect(ev[3].getDesc()).toBe('Candle lighting');

  expect(gregDtString(ev[4])).toBe('4/4/2020');
  expect(ev[4].getDesc()).toBe('10 Nisan 5780');

  expect(gregDtString(ev[5])).toBe('4/4/2020');
  expect(ev[5].getDesc()).toBe('Shabbat HaGadol');
});

test('addHebrewDates-locale', () => {
  const options: CalOptions = {year: 2017, month: 3, noHolidays: true, addHebrewDates: true, locale: 'he'};
  const ev = HebrewCalendar.calendar(options)[0];
  expect(ev.getFlags()).toBe(flags.HEBREW_DATE);
  expect(ev.getDesc()).toBe('3 Adar 5777');
  expect(ev.render('he')).toBe('ג׳ אַדָר תשע״ז');
});

test('startAndEnd', () => {
  const ev1 = HebrewCalendar.calendar({
    addHebrewDates: true,
    start: new Date(2018, 6, 4),
    end: new Date(2018, 6, 19),
  });
  expect(gregDtString(ev1[0])).toBe('7/4/2018');
  expect(gregDtString(ev1[ev1.length - 1])).toBe('7/19/2018');
  expect(ev1.length).toBe(17);

  const eventsHDate = HebrewCalendar.calendar({
    addHebrewDates: true,
    start: new HDate(25, 'Tishrei', 5769),
    end: new HDate(9, 'Cheshvan', 5769),
  });
  expect(gregDtString(eventsHDate[0])).toBe('10/24/2008');
  expect(gregDtString(eventsHDate[eventsHDate.length - 1])).toBe('11/7/2008');
  expect(eventsHDate.length).toBe(17);

  const eventsAbsDate = HebrewCalendar.calendar({
    addHebrewDates: true,
    start: 733319,
    end: 733359,
  });
  expect(gregDtString(eventsAbsDate[0])).toBe('10/4/2008');
  expect(gregDtString(eventsAbsDate[eventsAbsDate.length - 1])).toBe('11/13/2008');
  expect(eventsAbsDate.length).toBe(56);
});

test('renderBrief', () => {
  const options: CalOptions = {
    year: 2020,
    month: 3,
    location: Location.lookup('Helsinki'),
    candlelighting: true,
    sedrot: true,
  };
  const events = HebrewCalendar.calendar(options);
  const expected = [
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Shabbat Zachor', 'שַׁבַּת זָכוֹר'],
    ['Parashat Tetzaveh', 'פָּרָשַׁת תְּצַוֶּה'],
    ['Havdalah', 'הַבְדָּלָה'],
    ['Fast begins', 'תְּחִילַּת הַצוֹם'],
    ['Ta’anit Esther', 'תַּעֲנִית אֶסְתֵּר'],
    ['Fast ends', 'סִיּוּם הַצוֹם'],
    ['Erev Purim', 'עֶרֶב פּוּרִים'],
    ['Purim', 'פּוּרִים'],
    ['Shushan Purim', 'שׁוּשָׁן פּוּרִים'],
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Shabbat Parah', 'שַׁבַּת פָּרָה'],
    ['Parashat Ki Tisa', 'פָּרָשַׁת כִּי תִשָּׂא'],
    ['Havdalah', 'הַבְדָּלָה'],
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Shabbat HaChodesh', 'שַׁבַּת הַחֹדֶשׁ'],
    ['Parashat Vayakhel-Pekudei', 'פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי'],
    ['Havdalah', 'הַבְדָּלָה'],
    ['Rosh Chodesh Nisan', 'רֹאשׁ חוֹדֶשׁ נִיסָן'],
    ['Candle lighting', 'הַדְלָקַת נֵרוֹת'],
    ['Parashat Vayikra', 'פָּרָשַׁת וַיִּקְרָא'],
    ['Havdalah', 'הַבְדָּלָה'],
  ];
  for (let i = 0; i < events.length; i++) {
    expect(events[i].renderBrief('en')).toBe(expected[i][0]);
    expect(events[i].renderBrief('he')).toBe(expected[i][1]);
  }
});

function makeLocation(countryCode: string): Location {
  return new Location(0, 0, false, 'UTC', undefined, countryCode);
}

test('reformatTimeStr', () => {
  expect(HebrewCalendar.reformatTimeStr('20:30', 'pm', {})).toBe('8:30pm');
  expect(HebrewCalendar.reformatTimeStr('20:30', ' P.M.', {})).toBe('8:30 P.M.');
  expect(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: makeLocation('BR')})).toBe('8:30 PM');
  expect(HebrewCalendar.reformatTimeStr('20:30', ' PM', {location: makeLocation('MX')})).toBe('20:30');

  expect(HebrewCalendar.reformatTimeStr('11:45', 'pm', {})).toBe('11:45am');
  expect(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: makeLocation('BR')})).toBe('11:45 AM');
  expect(HebrewCalendar.reformatTimeStr('11:45', ' PM', {location: makeLocation('MX')})).toBe('11:45');

  expect(HebrewCalendar.reformatTimeStr('00:07', 'pm', {})).toBe('12:07am');
  expect(HebrewCalendar.reformatTimeStr('00:07', ' P.M.', {})).toBe('12:07 A.M.');
  expect(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: makeLocation('BR')})).toBe('12:07 AM');
  expect(HebrewCalendar.reformatTimeStr('00:07', ' PM', {location: makeLocation('MX')})).toBe('00:07');
});

test('reformatTimeStr-hour12', () => {
  expect(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'fr', hour12: true})).toBe('11:56');
  expect(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: makeLocation('BR'), hour12: true})).toBe('11:56 PM');
  expect(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: makeLocation('MX'), hour12: true})).toBe('11:56 PM');

  expect(HebrewCalendar.reformatTimeStr('23:56', '', {locale: 'fr', hour12: false})).toBe('23:56');
  expect(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: makeLocation('BR'), hour12: false})).toBe('23:56');
  expect(HebrewCalendar.reformatTimeStr('23:56', ' PM', {location: makeLocation('MX'), hour12: false})).toBe('23:56');
});

test('no-rosh-chodesh', () => {
  const events = HebrewCalendar.calendar({year: 2020, noRoshChodesh: true});
  const ev = events.find((ev) => ev.getDesc() == 'Rosh Chodesh Sivan');
  expect(ev).toBe(undefined);
});

// eslint-disable-next-line require-jsdoc
function eventDateDesc(ev: Event) {
  return {date: gregDtString(ev), desc: ev.getDesc()};
}

test('rosh-chodesh-only', () => {
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
  expect(actual).toEqual(expected);
});

test('fasts-only', () => {
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
  expect(actual).toEqual(expected);
});


test('no-minor-fast', () => {
  const events = HebrewCalendar.calendar({year: 2020, noMinorFast: true});
  const ev = events.find((ev) => ev.getDesc() == 'Tzom Gedaliah');
  expect(ev).toBe(undefined);
});

test('no-modern', () => {
  const events = HebrewCalendar.calendar({year: 2020, noModern: true});
  const ev = events.find((ev) => ev.getDesc() == 'Yom HaZikaron');
  expect(ev).toBe(undefined);
});

test('no-modern-il', () => {
  const events = HebrewCalendar.calendar({
    il: true,
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
  expect(ev).toBe(undefined);
});

test('shabbat-mevarchim', () => {
  const events = HebrewCalendar.calendar({year: 2020, shabbatMevarchim: true});
  const ev = events.find((ev) => ev.getDesc() == 'Shabbat Mevarchim Chodesh Sivan');
  expect(ev).toBeDefined();
  expect((ev as Event).getDate().toString()).toBe('29 Iyyar 5780');
});

test('molad', () => {
  const events = HebrewCalendar.calendar({year: 5769, isHebrewYear: true, molad: true});
  const ev = events.find((ev) => ev.getDesc() == 'Molad Tevet 5769');
  expect(ev).toBeDefined();
  expect((ev as Event).getDate().toString()).toBe('23 Kislev 5769');
});

test('year2', () => {
  const events = HebrewCalendar.calendar({year: 2});
  expect(events.length).toBe(84);
  const events2 = events.slice(0, 3);
  const actual = events2.map(eventISODateDesc);
  const expected = [
    {date: '0002-01-01', desc: 'Rosh Chodesh Sh\'vat'},
    {date: '0002-01-12', desc: 'Shabbat Shirah'},
    {date: '0002-01-15', desc: 'Tu BiShvat'},
  ];
  expect(actual).toEqual(expected);
});

test('year0', () => {
  const events = HebrewCalendar.calendar({year: 0});
  expect(events.length).toBe(82);
});

test('version', () => {
  const version = HebrewCalendar.version();
  expect(version.substring(0, version.indexOf('.'))).toBe('5');
});

test('candlelighting-no-location-throw', () => {
  expect(() => {
    HebrewCalendar.calendar({candlelighting: true});
  }).toThrow('options.candlelighting requires valid options.location');
});

test('havdalahDeg-havdalahMin-throw', () => {
  const location = new Location(0, 0, false, 'UTC');
  expect(() => {
    HebrewCalendar.calendar({candlelighting: true, location, havdalahDeg: 8.5, havdalahMins: 50});
  }).toThrow('options.havdalahMins and options.havdalahDeg are mutually exclusive');
});

/**
 * @private
 */
function eventISODateDesc(ev: Event): any {
  const date = isoDateString(ev.getDate().greg());
  return {date, desc: ev.getDesc()};
}

test('bce', () => {
  const options: CalOptions = {
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
  expect(actual).toEqual(expected);
});

test('omer-alarm', () => {
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
  expect(alarm).toBeDefined();
  expect(alarm instanceof Date).toBe(true);
  expect((alarm as Date).toISOString()).toBe('2022-04-26T03:28:34.000Z');
});

test('omer-alarm-alaska', () => {
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
    const alarm = ev.alarm && ev.alarm instanceof Date && ev.alarm.toISOString();
    return {dt: gregDtString(ev), alarm: alarm};
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
  expect(alarms).toEqual(expected);
});

test('ykk-only', () => {
  const events = HebrewCalendar.calendar({
    yomKippurKatan: true,
    noHolidays: true,
    year: 5782,
    isHebrewYear: true,
  });
  expect(events.length).toBe(9);
  const ev = events[0];
  expect(ev).toBeInstanceOf(YomKippurKatanEvent);
  expect(ev.url()).toBeUndefined();
  expect(ev.memo).toBe('Minor Day of Atonement on the day preceeding Rosh Chodesh Kislev');
  expect(ev.render('en')).toBe('Yom Kippur Katan Kislev');
  expect(ev.render('he')).toBe('יוֹם כִּפּוּר קָטָן כִּסְלֵו');
});

test('ykk with location copies attributes from src', () => {
  const dt = new Date(2025, 1, 27);
  const events = HebrewCalendar.calendar({
    start: dt,
    end: dt,
    yomKippurKatan: true,
    noHolidays: true,
    location: Location.lookup('Providence'),
    candlelighting: true,
  });
  const actual = events.map(eventISODateDesc);
  const expected = [
    { date: '2025-02-27', desc: 'Fast begins' },
    { date: '2025-02-27', desc: 'Yom Kippur Katan Adar' },
    { date: '2025-02-27', desc: 'Fast ends' }
  ];
  expect(actual).toEqual(expected);
  const ev = events[1];
  expect(ev).toBeInstanceOf(FastDayEvent);
  expect(ev.url()).toBeUndefined();
  expect(ev.memo).toBe('Minor Day of Atonement on the day preceeding Rosh Chodesh Adar');
  expect(ev.render('en')).toBe('Yom Kippur Katan Adar');
  expect(ev.render('he')).toBe('יוֹם כִּפּוּר קָטָן אַדָר');
});

test('hallel', () => {
  expect(HebrewCalendar.hallel(new HDate(25, months.KISLEV, 5780), false)).toBe(2);
  expect(HebrewCalendar.hallel(new HDate(26, months.KISLEV, 5780), true)).toBe(2);
});

test('tachanun', () => {
  const erevRch = new HDate(29, months.CHESHVAN, 5787);
  expect(HebrewCalendar.tachanun(erevRch, false))
      .toEqual({shacharit: true, mincha: false, allCongs: true});
  const rch = new HDate(1, months.KISLEV, 5787);
  expect(HebrewCalendar.tachanun(rch, true))
      .toEqual({shacharit: false, mincha: false, allCongs: false});
});

test('year1', () => {
  const events = HebrewCalendar.calendar({
    isHebrewYear: true,
    year: 1,
  });
  expect(events.length).toBe(79);
});

test('year1-sedrot', () => {
  const events = HebrewCalendar.calendar({
    isHebrewYear: true,
    year: 1,
    sedrot: true,
    noHolidays: true,
  });
  expect(events.length).toBe(47);
  const actual = events.slice(0, 6).map(eventISODateDesc);
  const expected = [
    {date: '-003760-09-12', desc: 'Parashat Vayeilech'},
    {date: '-003760-09-19', desc: 'Parashat Ha\'azinu'},
    {date: '-003760-10-03', desc: 'Parashat Bereshit'},
    {date: '-003760-10-10', desc: 'Parashat Noach'},
    {date: '-003760-10-17', desc: 'Parashat Lech-Lecha'},
    {date: '-003760-10-24', desc: 'Parashat Vayera'},
  ];
  expect(actual).toEqual(expected);
});

test('mevarchim-only', () => {
  const events = HebrewCalendar.calendar({
    year: 5784,
    isHebrewYear: true,
    mask: flags.SHABBAT_MEVARCHIM,
  });
  const actual = events.map(eventDateDesc);
  const expected = [
    {date: '10/14/2023', desc: 'Shabbat Mevarchim Chodesh Cheshvan'},
    {date: '11/11/2023', desc: 'Shabbat Mevarchim Chodesh Kislev'},
    {date: '12/9/2023', desc: 'Shabbat Mevarchim Chodesh Tevet'},
    {date: '1/6/2024', desc: 'Shabbat Mevarchim Chodesh Sh\'vat'},
    {date: '2/3/2024', desc: 'Shabbat Mevarchim Chodesh Adar I'},
    {date: '3/9/2024', desc: 'Shabbat Mevarchim Chodesh Adar II'},
    {date: '4/6/2024', desc: 'Shabbat Mevarchim Chodesh Nisan'},
    {date: '5/4/2024', desc: 'Shabbat Mevarchim Chodesh Iyyar'},
    {date: '6/1/2024', desc: 'Shabbat Mevarchim Chodesh Sivan'},
    {date: '6/29/2024', desc: 'Shabbat Mevarchim Chodesh Tamuz'},
    {date: '8/3/2024', desc: 'Shabbat Mevarchim Chodesh Av'},
    {date: '8/31/2024', desc: 'Shabbat Mevarchim Chodesh Elul'},
  ];
  expect(actual).toEqual(expected);
});

test('Shabbat Mevarchim follows hour12 and locale', () => {
  const dt = new Date(2011, 4, 28);
  const events = HebrewCalendar.calendar({
    start: dt,
    end: dt,
    shabbatMevarchim: true,
    hour12: true,
  });
  expect(events.length).toBe(1);
  expect(events[0].memo).toBe('Molad Sivan: Wed, 12 minutes and 10 chalakim after 2:00pm');

  const events2 = HebrewCalendar.calendar({
    start: dt,
    end: dt,
    shabbatMevarchim: true,
    hour12: false,
  });
  expect(events2.length).toBe(1);
  expect(events2[0].memo).toBe('Molad Sivan: Wed, 12 minutes and 10 chalakim after 14:00');

  const events3 = HebrewCalendar.calendar({
    start: dt,
    end: dt,
    shabbatMevarchim: true,
    locale: 'he-x-NoNikud',
  });
  expect(events3.length).toBe(1);
  expect(events3[0].memo).toBe('מולד הלבנה סיון יהיה ביום רביעי בשבוע, בשעה 14 בצהריים, ו-12 דקות ו-10 חלקים');
});

test('Eruv Tavshilin', () => {
  expect(HebrewCalendar.eruvTavshilin(new HDate(13, 'Nisan', 5782), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(14, 'Nisan', 5782), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(15, 'Nisan', 5782), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(20, 'Nisan', 5782), false)).toBe(true);
  expect(HebrewCalendar.eruvTavshilin(new HDate(20, 'Nisan', 5782), true)).toBe(true);

  expect(HebrewCalendar.eruvTavshilin(new HDate(13, 'Nisan', 5785), true)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(14, 'Nisan', 5785), true)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(15, 'Nisan', 5785), true)).toBe(false);

  expect(HebrewCalendar.eruvTavshilin(new HDate(20, 'Nisan', 5783), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(20, 'Nisan', 5783), true)).toBe(false);

  expect(HebrewCalendar.eruvTavshilin(new HDate(5, 'Sivan', 5785), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(5, 'Sivan', 5785), true)).toBe(false);

  expect(HebrewCalendar.eruvTavshilin(new HDate(5, 'Sivan', 5786), false)).toBe(true);
  expect(HebrewCalendar.eruvTavshilin(new HDate(5, 'Sivan', 5786), true)).toBe(true);

  expect(HebrewCalendar.eruvTavshilin(new HDate(19, 'Cheshvan', 5785), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(19, 'Cheshvan', 5785), true)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(20, 'Cheshvan', 5785), false)).toBe(false);
  expect(HebrewCalendar.eruvTavshilin(new HDate(20, 'Cheshvan', 5785), true)).toBe(false);
});

test('yikzor', () => {
  const options: CalOptions = {
    isHebrewYear: true,
    year: 5786,
    noHolidays: true,
    yizkor: true,
    il: true,
  };
  const events = HebrewCalendar.calendar(options);
  expect(events.length).toBe(4);
  const summarize = (ev: Event) => {
    const date = isoDateString(ev.getDate().greg());
    return {date,
      desc: ev.getDesc(),
      l: (ev as any).linkedEvent.getDesc(),
    };
  };
  const actualIL = events.map(summarize);
  const expectedIL = [
    { date: '2025-10-02', desc: 'Yizkor', l: 'Yom Kippur' },
    { date: '2025-10-14', desc: 'Yizkor', l: 'Shmini Atzeret' },
    { date: '2026-04-08', desc: 'Yizkor', l: 'Pesach VII' },
    { date: '2026-05-22', desc: 'Yizkor', l: 'Shavuot' }
  ];
  expect(actualIL).toEqual(expectedIL);

  options.il = false;
  const diaspora = HebrewCalendar.calendar(options);
  expect(diaspora.length).toBe(4);
  const actualD = diaspora.map(summarize);
  const expectedD = [
    { date: '2025-10-02', desc: 'Yizkor', l: 'Yom Kippur' },
    { date: '2025-10-14', desc: 'Yizkor', l: 'Shmini Atzeret' },
    { date: '2026-04-09', desc: 'Yizkor', l: 'Pesach VIII' },
    { date: '2026-05-23', desc: 'Yizkor', l: 'Shavuot II' }
  ];
  expect(actualD).toEqual(expectedD);
  const ev = diaspora[0];
  expect(ev.render('en')).toBe('Yizkor');
  expect(ev.render('he')).toBe('יִזְכּוֹר');
  expect(ev.render('he-x-NoNikud')).toBe('יזכור');
  expect(ev.getCategories()).toEqual(['yizkor']);
});
