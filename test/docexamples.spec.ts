/**
 * Asserts the output claimed by `@example` blocks in the JSDoc comments.
 *
 * Every assertion here mirrors a documented example verbatim. If one fails,
 * fix whichever is wrong — the doc or the code — rather than deleting the
 * test: these exist because a previous audit found 15 examples whose stated
 * output had never been executed and was wrong.
 *
 * Reference the source location in each `test()` name so the doc comment is
 * easy to find.
 */
import {expect, test} from 'vitest';
import {HDate, months, birthdayOrAnniversary, yahrzeit} from '@hebcal/hdate';
import {GeoLocation} from '@hebcal/noaa';
import {Event, flags} from '../src/event.js';
import {HolidayEvent} from '../src/HolidayEvent.js';
import {HebrewDateEvent} from '../src/HebrewDateEvent.js';
import {HebrewCalendar} from '../src/hebcal.js';
import {Location} from '../src/location.js';
import {Molad} from '../src/molad.js';
import {OmerEvent} from '../src/omer.js';
import {Sedra, getSedra} from '../src/sedra.js';
import {Zmanim} from '../src/zmanim.js';
import {calendar} from '../src/calendar.js';
import {DailyLearning} from '../src/DailyLearning.js';
import {getHolidaysOnDate, getHolidaysForYearArray} from '../src/holidays.js';
import {isAveilut} from '../src/isAveilut.js';
import {isFastDay} from '../src/isFastDay.js';
import {parshaYear} from '../src/parshaYear.js';
import {reformatTimeStr} from '../src/reformatTimeStr.js';

test('event.ts Event class example', () => {
  const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
  expect(ev.getDate().toString()).toBe('6 Sivan 5749');
  expect(ev.getDesc()).toBe('Shavuot');
  expect(ev.render('he')).toBe('שָׁבוּעוֹת');
});

test('event.ts render() example', () => {
  const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
  expect(ev.render('en')).toBe('Shavuot');
  expect(ev.render('he')).toBe('שָׁבוּעוֹת');
  expect(ev.render('ashkenazi')).toBe('Shavuos');
});

test('event.ts renderBrief() example', () => {
  const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
  expect(ev.renderBrief('en')).toBe('Shavuot');
});

test('event.ts basename() example', () => {
  const ev = new HolidayEvent(
    new HDate(14, months.NISAN, 5784),
    'Erev Pesach',
    flags.EREV
  );
  expect(ev.getDesc()).toBe('Erev Pesach');
  expect(ev.basename()).toBe('Pesach');
});

test('event.ts observedInIsrael/Diaspora/observedIn examples', () => {
  const ev1 = new Event(
    new HDate(7, 'Sivan', 5749),
    'Shavuot II',
    flags.CHAG | flags.CHUL_ONLY
  );
  const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
  expect(ev1.observedInIsrael()).toBe(false);
  expect(ev2.observedInIsrael()).toBe(true);
  expect(ev1.observedInDiaspora()).toBe(true);
  expect(ev2.observedInDiaspora()).toBe(true);
  expect(ev1.observedIn(false)).toBe(true);
  expect(ev1.observedIn(true)).toBe(false);
  expect(ev2.observedIn(false)).toBe(true);
  expect(ev2.observedIn(true)).toBe(true);
});

test('event.ts getCategories() example', () => {
  expect(
    new Event(
      new HDate(10, 'Tishrei', 5784),
      'Yom Kippur',
      flags.MAJOR_FAST
    ).getCategories()
  ).toEqual(['holiday', 'major', 'fast']);
  expect(
    new Event(
      new HDate(1, 'Shvat', 5784),
      "Rosh Chodesh Sh'vat",
      flags.ROSH_CHODESH
    ).getCategories()
  ).toEqual(['roshchodesh']);
});

test('HebrewDateEvent.ts render()/renderBrief() examples', () => {
  const hd = new HDate(15, months.CHESHVAN, 5769);
  const ev = new HebrewDateEvent(hd);
  expect(ev.render('en')).toBe('15th of Cheshvan, 5769');
  expect(ev.render('he')).toBe('ט״ו חֶשְׁוָן תשס״ט');
  expect(ev.renderBrief()).toBe('15th of Cheshvan');
  expect(ev.renderBrief('he')).toBe('ט״ו חֶשְׁוָן');
});

test('hebcal.ts getBirthdayOrAnniversary() example', () => {
  const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
  const hd = HebrewCalendar.getBirthdayOrAnniversary(5780, dt);
  expect(hd?.toString()).toBe('1 Nisan 5780');
  expect(hd?.greg().toLocaleDateString('en-US')).toBe('3/26/2020');
});

test('hebcal.ts getYahrzeit() example', () => {
  const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
  const hd = HebrewCalendar.getYahrzeit(5780, dt);
  expect(hd?.toString()).toBe("30 Sh'vat 5780");
  expect(hd?.greg().toLocaleDateString('en-US')).toBe('2/25/2020');
});

test('hebcal.ts + holidays.ts getHolidaysForYearArray() example', () => {
  expect(HebrewCalendar.getHolidaysForYearArray(5784, false)[0].getDesc()).toBe(
    'Rosh Hashana 5784'
  );
  expect(getHolidaysForYearArray(5784, false)[0].getDesc()).toBe(
    'Rosh Hashana 5784'
  );
});

test('hebcal.ts + holidays.ts getHolidaysOnDate() example', () => {
  const hd = new HDate(15, months.NISAN, 5784);
  expect(
    HebrewCalendar.getHolidaysOnDate(hd, false)?.map(ev => ev.getDesc())
  ).toEqual(['Pesach I']);
  expect(getHolidaysOnDate(hd, false)?.map(ev => ev.getDesc())).toEqual([
    'Pesach I',
  ]);
});

test('hebcal.ts eruvTavshilin() example', () => {
  expect(HebrewCalendar.eruvTavshilin(new Date(2024, 9, 16), false)).toBe(true);
  expect(HebrewCalendar.eruvTavshilin(new Date(2024, 9, 16), true)).toBe(false);
});

test('hebcal.ts + reformatTimeStr.ts reformatTimeStr() example', () => {
  const opts = {location: Location.lookup('Chicago')};
  expect(HebrewCalendar.reformatTimeStr('20:30', 'pm', opts)).toBe('8:30pm');
  expect(HebrewCalendar.reformatTimeStr('20:30', 'pm', {hour12: false})).toBe(
    '20:30'
  );
  expect(reformatTimeStr('20:30', 'pm', opts)).toBe('8:30pm');
  expect(reformatTimeStr('20:30', 'pm', {hour12: false})).toBe('20:30');
});

test('hebcal.ts hallel() example', () => {
  expect(HebrewCalendar.hallel(new HDate(25, months.KISLEV, 5784), false)).toBe(2);
  expect(HebrewCalendar.hallel(new HDate(1, months.SHVAT, 5784), false)).toBe(1);
  expect(HebrewCalendar.hallel(new HDate(2, months.SHVAT, 5784), false)).toBe(0);
});

test('hebcal.ts tachanun() example', () => {
  expect(HebrewCalendar.tachanun(new HDate(4, months.SHVAT, 5784), false)).toEqual({
    shacharit: true,
    mincha: true,
    allCongs: true,
  });
  expect(HebrewCalendar.tachanun(new HDate(2, months.SHVAT, 5784), false)).toEqual({
    shacharit: true,
    mincha: false,
    allCongs: true,
  });
  expect(HebrewCalendar.tachanun(new HDate(1, months.SHVAT, 5784), false)).toEqual({
    shacharit: false,
    mincha: false,
    allCongs: false,
  });
});

test('isFastDay.ts example', () => {
  expect(isFastDay(new HDate(10, months.TISHREI, 5784))).toBe(true);
  expect(isFastDay(new HDate(11, months.TISHREI, 5784))).toBe(false);
});

test('isAveilut.ts example', () => {
  expect(isAveilut(new HDate(20, months.NISAN, 5784))).toBe(true);
  expect(isAveilut(new HDate(25, months.TAMUZ, 5784))).toBe(true);
  expect(isAveilut(new HDate(15, months.AV, 5784))).toBe(false);
});

test('location.ts getName() example', () => {
  const loc = new Location(
    41.85003,
    -87.65005,
    false,
    'America/Chicago',
    'Chicago, Illinois, USA',
    'US'
  );
  expect(loc.getName()).toBe('Chicago, Illinois, USA');
  expect(Location.lookup('San Francisco')?.getName()).toBe('San Francisco');
});

test('location.ts getShortName() example', () => {
  const chi = new Location(
    41.85003,
    -87.65005,
    false,
    'America/Chicago',
    'Chicago, Illinois, USA',
    'US'
  );
  expect(chi.getShortName()).toBe('Chicago');
  const dc = new Location(
    38.89511,
    -77.03637,
    false,
    'America/New_York',
    'Washington, D.C., USA',
    'US'
  );
  expect(dc.getShortName()).toBe('Washington, D.C.');
});

test('location.ts getTzid() example', () => {
  expect(Location.lookup('San Francisco')?.getTzid()).toBe('America/Los_Angeles');
});

test('location.ts legacyTzToTzid() example', () => {
  expect(Location.legacyTzToTzid(2, 'israel')).toBe('Asia/Jerusalem');
  expect(Location.legacyTzToTzid(0, 'eu')).toBe('Europe/London');
  expect(Location.legacyTzToTzid(0, 'none')).toBe('UTC');
  expect(Location.legacyTzToTzid(-5, 'none')).toBe('Etc/GMT-5');
});

test('location.ts getUsaTzid() example', () => {
  expect(Location.getUsaTzid('AZ', 7, 'Y')).toBe('America/Denver');
});

test('location.ts addLocation() example', () => {
  const tlv = new Location(
    32.0853,
    34.7818,
    true,
    'Asia/Jerusalem',
    'My Office, Tel Aviv',
    'IL'
  );
  expect(Location.addLocation('My Office', tlv)).toBe(true);
  expect(Location.lookup('my office')?.getTzid()).toBe('Asia/Jerusalem');
});

test('molad.ts Molad class example', () => {
  const m = new Molad(5784, months.NISAN);
  expect(m.getMonthName()).toBe('Nisan');
  expect([m.getHour(), m.getMinutes(), m.getChalakim()]).toEqual([22, 57, 7]);
  expect(m.render('en')).toBe('Molad Nisan: Monday, 10:57pm and 7 chalakim');
});

test('molad.ts getInstant() example', () => {
  const m = new Molad(5784, months.NISAN);
  expect(m.getInstant().toString()).toBe('2024-04-08T20:36:26.837+00:00[UTC]');
});

test('molad.ts render() example', () => {
  const m = new Molad(5784, months.NISAN);
  expect(m.render('en', {hour12: true})).toBe(
    'Molad Nisan: Monday, 10:57pm and 7 chalakim'
  );
  expect(m.render('en', {hour12: false})).toBe(
    'Molad Nisan: Monday, 22:57 and 7 chalakim'
  );
});

test('omer.ts OmerEvent class example', () => {
  const ev = new OmerEvent(new HDate(16, months.NISAN, 5784), 1);
  expect(ev.render('en')).toBe('1st day of the Omer');
  expect(ev.render('he')).toBe('א׳ בָּעוֹמֶר');
  expect(ev.sefira('translit')).toBe("Chesed sheb'Chesed");
  expect(ev.getTodayIs('en')).toBe('Today is 1 day of the Omer');
});

test('omer.ts sefira() example', () => {
  const day8 = new OmerEvent(new HDate(23, months.NISAN, 5784), 8);
  expect(day8.sefira('en')).toBe('Lovingkindness within Might');
  expect(day8.sefira('he')).toBe('חֶֽסֶד שֶׁבִּגְבוּרָה');
  expect(day8.sefira('translit')).toBe('Chesed shebiGevurah');
});

test('omer.ts getTodayIs() example', () => {
  const ev = new OmerEvent(new HDate(25, months.NISAN, 5784), 10);
  expect(ev.getTodayIs('en')).toBe(
    'Today is 10 days, which are 1 week and 3 days of the Omer'
  );
  expect(ev.getTodayIs('he')).toBe(
    'הַיּוֹם עֲשָׂרָה יָמִים, שֶׁהֵם שָׁבֽוּעַ אֶחָד וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר'
  );
});

test('omer.ts getWeeks()/getDaysWithinWeeks() documented semantics', () => {
  // getWeeks() returns *completed* weeks
  const day7 = new OmerEvent(new HDate(22, months.NISAN, 5784), 7);
  expect(day7.getWeeks()).toBe(1);
  expect(day7.getDaysWithinWeeks()).toBe(7);
  const day8 = new OmerEvent(new HDate(23, months.NISAN, 5784), 8);
  expect(day8.getWeeks()).toBe(1);
  expect(day8.getDaysWithinWeeks()).toBe(1);
});

test('omer.ts getLamnatzeachWord() example', () => {
  expect(new OmerEvent(new HDate(16, 'Nisan', 5785), 1).getLamnatzeachWord()).toBe(
    'אֱלֹהִים'
  );
  expect(new OmerEvent(new HDate(3, 'Sivan', 5785), 49).getLamnatzeachWord()).toBe(
    'אָרֶץ'
  );
});

test('omer.ts getLamnatzeachLetter() example', () => {
  expect(
    new OmerEvent(new HDate(16, 'Nisan', 5785), 1).getLamnatzeachLetter()
  ).toBe('י');
  expect(
    new OmerEvent(new HDate(3, 'Sivan', 5785), 49).getLamnatzeachLetter()
  ).toBe('ה');
});

test('omer.ts getAnaBekoachWord() example', () => {
  expect(new OmerEvent(new HDate(16, 'Nisan', 5785), 1).getAnaBekoachWord()).toBe(
    'אָנָּא'
  );
  expect(new OmerEvent(new HDate(22, 'Nisan', 5785), 7).getAnaBekoachWord()).toBe(
    'אב״ג ית״ץ'
  );
  expect(new OmerEvent(new HDate(3, 'Sivan', 5785), 49).getAnaBekoachWord()).toBe(
    'שק״ו צי״ת'
  );
});

test('parshaYear.ts example', () => {
  const events = parshaYear(5784, false);
  expect(events[0].render('en')).toBe('Parashat Ha’azinu');
  expect(events[0].getDate().toString()).toBe('8 Tishrei 5784');
});

test('sedra.ts Sedra class example', () => {
  const sedra = new Sedra(5784, false);
  expect(sedra.lookup(new HDate(15, months.CHESHVAN, 5784)).parsha).toEqual([
    'Vayera',
  ]);
});

test('hebcal.ts + sedra.ts getSedra() example', () => {
  // Both the HebrewCalendar wrapper and the bare function document this
  // same lookup — they must agree.
  const viaClass = HebrewCalendar.getSedra(5784, false);
  expect(viaClass.lookup(new HDate(15, 'Cheshvan', 5784)).parsha).toEqual([
    'Vayera',
  ]);
  const viaFn = getSedra(5784, false);
  expect(viaFn.lookup(new HDate(15, months.CHESHVAN, 5784)).parsha).toEqual([
    'Vayera',
  ]);
});

test('sedra.ts find() example', () => {
  const sedra = new Sedra(5784, false);
  expect(sedra.find('Noach')?.toString()).toBe('6 Cheshvan 5784');
  expect(sedra.find(1)?.toString()).toBe('6 Cheshvan 5784');
  expect(sedra.find('Matot-Masei')?.toString()).toBe('28 Tamuz 5784');
  expect(sedra.find(['Matot', 'Masei'])?.toString()).toBe('28 Tamuz 5784');
  expect(sedra.find('Matot')).toBe(null);
});

test('sedra.ts findContaining() example', () => {
  const sedra5784 = new Sedra(5784, false);
  expect(sedra5784.findContaining('Matot')?.toString()).toBe('28 Tamuz 5784');
  expect(sedra5784.findContaining('Masei')?.toString()).toBe('28 Tamuz 5784');
  const sedra5795 = new Sedra(5795, false);
  expect(sedra5795.findContaining('Matot')?.toString()).toBe('21 Tamuz 5795');
  expect(sedra5795.findContaining('Masei')?.toString()).toBe('28 Tamuz 5795');
  expect(sedra5795.findContaining('Matot-Masei')?.toString()).toBe('21 Tamuz 5795');
});

test('sedra.ts lookup() example', () => {
  const sedra = new Sedra(5784, false);
  const result = sedra.lookup(new HDate(12, months.CHESHVAN, 5784));
  expect(result.parsha).toEqual(['Lech-Lecha']);
  expect(result.chag).toBe(false);
  expect(result.hdate.toString()).toBe('13 Cheshvan 5784');
  expect(result.hdate.getDay()).toBe(6); // Saturday
});

test('sedra.ts lookupWeekday() example', () => {
  const sedra = new Sedra(5784, false);
  expect(sedra.lookupWeekday(new HDate(8, months.CHESHVAN, 5784))?.parsha).toEqual([
    'Lech-Lecha',
  ]);
  expect(sedra.lookupWeekday(new HDate(9, months.CHESHVAN, 5784))).toBe(undefined);
  expect(sedra.lookupWeekday(new HDate(17, months.NISAN, 5784))?.parsha).toEqual([
    'Achrei Mot',
  ]);
});

test('zmanim.ts Zmanim class example', () => {
  const latitude = 41.822232;
  const longitude = -71.448292;
  const tzid = 'America/New_York';
  const friday = new Date(2023, 8, 8);
  const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
  const zmanim = new Zmanim(gloc, friday, false);
  const candleLighting = zmanim.sunsetOffset(-18, true);
  expect(Zmanim.formatISOWithTimeZone(tzid, candleLighting)).toBe(
    '2023-09-08T18:49:00-04:00'
  );
});

test('zmanim.ts makeSunsetAwareHDate() example', () => {
  const gloc = new GeoLocation(null, 48.85341, 2.3488, 0, 'Europe/Paris');
  const before = Zmanim.makeSunsetAwareHDate(
    gloc,
    new Date('2024-09-22T17:38:46.123Z'),
    false
  );
  expect(before.toString()).toBe('19 Elul 5784');
  const after = Zmanim.makeSunsetAwareHDate(
    gloc,
    new Date('2024-09-22T23:45:18.345Z'),
    false
  );
  expect(after.toString()).toBe('20 Elul 5784');
});

test('calendar.ts + hebcal.ts calendar() examples agree', () => {
  const options = {
    year: 1981,
    isHebrewYear: false,
    candlelighting: true,
    location: Location.lookup('San Francisco'),
    sedrot: true,
    omer: true,
  };
  const viaFn = calendar(options);
  const viaClass = HebrewCalendar.calendar(options);
  expect(viaFn.length).toBeGreaterThan(0);
  expect(viaClass.length).toBe(viaFn.length);
});

test('CalOptions.ts documented candle-lighting defaults', () => {
  // Documented as 18 min in the Diaspora, 20 min in Israel,
  // 40 for Jerusalem, 30 for Haifa and Zikhron Ya'akov.
  const dt = new Date(2024, 0, 5); // a Friday
  // Asserts the generated candle-lighting time equals sunset minus `mins`,
  // using the same rounding the library itself applies.
  const usesOffset = (city: string, mins: number): boolean => {
    const location = Location.lookup(city)!;
    const [ev] = calendar({
      start: dt,
      end: dt,
      candlelighting: true,
      location,
      noHolidays: true,
    }).filter(e => e.getFlags() & flags.LIGHT_CANDLES);
    const expected = new Zmanim(location, new HDate(dt), false).sunsetOffset(
      -mins,
      true
    );
    return (ev as any).eventTime.getTime() === expected.getTime();
  };
  expect(usesOffset('San Francisco', 18)).toBe(true);
  expect(usesOffset('Tel Aviv', 20)).toBe(true);
  expect(usesOffset('Jerusalem', 40)).toBe(true);
  expect(usesOffset('Haifa', 30)).toBe(true);
  // and confirm these are genuinely distinct from the Diaspora default
  expect(usesOffset('Tel Aviv', 18)).toBe(false);
});

// ---------------------------------------------------------------------------
// README.md claims. Same rule as above: if one fails, fix the README or the
// code, don't delete the assertion.
// ---------------------------------------------------------------------------

test('README: mask filters generation to Rosh Chodesh', () => {
  const roshChodesh = calendar({
    year: 5784,
    isHebrewYear: true,
    mask: flags.ROSH_CHODESH,
  });
  expect(roshChodesh.length).toBeGreaterThan(0);
  expect(roshChodesh.every(ev => ev.getFlags() & flags.ROSH_CHODESH)).toBe(true);
});

test('README: getHolidaysOnDate returns undefined, not [], on an empty day', () => {
  expect(getHolidaysOnDate(new HDate(5, months.CHESHVAN, 5784), false)).toBe(
    undefined
  );
});

test('README: omitting `il` returns both schedules unfiltered', () => {
  const hd = new HDate(16, months.NISAN, 5784);
  expect(getHolidaysOnDate(hd, false)?.map(ev => ev.getDesc())).toEqual([
    'Pesach II',
  ]);
  expect(getHolidaysOnDate(hd, true)?.map(ev => ev.getDesc())).toEqual([
    "Pesach II (CH''M)",
  ]);
  // omitted => union of both, not the Diaspora default
  expect(
    getHolidaysOnDate(hd)
      ?.map(ev => ev.getDesc())
      .sort()
  ).toEqual(['Pesach II', "Pesach II (CH''M)"].sort());
});

test('README: Jerusalem candle-lighting example', () => {
  const events = calendar({
    year: 2024,
    candlelighting: true,
    location: Location.lookup('Jerusalem'),
  });
  const first = events.find(ev => ev.getFlags() & flags.LIGHT_CANDLES)!;
  expect(first.getDate().toString()).toBe('24 Tevet 5784');
  expect((first as any).eventTimeStr).toBe('16:08');
});

test('README: birthday moves forward, yahrzeit moves back', () => {
  const dt = new Date(2014, 2, 2); // 30 Adar I 5774
  expect(new HDate(dt).toString()).toBe('30 Adar I 5774');
  expect(HebrewCalendar.getBirthdayOrAnniversary(5785, dt)?.toString()).toBe(
    '1 Nisan 5785'
  );
  expect(HebrewCalendar.getYahrzeit(5785, dt)?.toString()).toBe("30 Sh'vat 5785");
});

test('README: 0th birthday exists, 0th yahrzeit does not', () => {
  const dt = new Date(2014, 2, 2); // 30 Adar I 5774
  // original year: birthday returns the original date, yahrzeit is undefined
  expect(HebrewCalendar.getBirthdayOrAnniversary(5774, dt)?.toString()).toBe(
    '30 Adar I 5774'
  );
  expect(HebrewCalendar.getYahrzeit(5774, dt)).toBe(undefined);
  // before the original year: both undefined
  expect(HebrewCalendar.getBirthdayOrAnniversary(5773, dt)).toBe(undefined);
  expect(HebrewCalendar.getYahrzeit(5773, dt)).toBe(undefined);
});

test('README: Temporal-returning zmanim yield null, Date-returning yield Invalid Date', () => {
  // Svalbard in midsummer: the sun never reaches the relevant angles
  const svalbard = new Location(
    78.2232,
    15.6267,
    false,
    'Arctic/Longyearbyen',
    'Svalbard',
    'NO'
  );
  const z = new Zmanim(svalbard, new HDate(new Date(2024, 5, 21)), false);
  expect(isNaN(z.tzeit().getTime())).toBe(true); // Date => Invalid Date
  expect(z.tzeit72()).toBe(null); // Temporal => null
});

test('README: yerushalmi alias resolves to the registered calendar name', () => {
  // `yerushalmi: 1` is resolved to `yerushalmi-vilna` (2 => -schottenstein) by
  // dailyLearningName(). Option validation must apply the same mapping, or it
  // tells users a valid option is being ignored when it isn't.
  DailyLearning.addCalendar(
    'yerushalmi-vilna',
    hd => new Event(hd, 'stub daf', flags.YERUSHALMI_YOMI)
  );
  const warnings: string[] = [];
  const orig = console.warn;
  console.warn = (msg: string) => warnings.push(String(msg));
  let events;
  try {
    events = calendar({
      year: 5784,
      isHebrewYear: true,
      noHolidays: true,
      dailyLearning: {yerushalmi: 1},
    });
  } finally {
    console.warn = orig;
  }
  expect(warnings.filter(w => w.includes('yerushalmi'))).toEqual([]);
  expect(events.length).toBeGreaterThan(300);
  expect(events[0].getFlags() & flags.YERUSHALMI_YOMI).toBeTruthy();
});

// Regression guard: @hebcal/hdate <= 0.22.5 mutated the HDate argument, so
// reusing one date across calls silently returned wrong results in leap years.
test('getYahrzeit does not mutate its HDate argument', () => {
  const d = new HDate(15, months.ADAR_II, 5784);
  const before = d.toString();
  HebrewCalendar.getYahrzeit(5785, d);
  expect(d.toString()).toBe(before);

  // reusing one HDate must give the same answers as a fresh one per call
  const reused = new HDate(15, months.ADAR_II, 5784);
  const sequential = [5785, 5786, 5787].map(y =>
    HebrewCalendar.getYahrzeit(y, reused)?.toString()
  );
  const independent = [5785, 5786, 5787].map(y =>
    HebrewCalendar.getYahrzeit(y, new HDate(15, months.ADAR_II, 5784))?.toString()
  );
  expect(sequential).toEqual(independent);
  expect(sequential[2]).toBe('15 Adar II 5787');
});

test('README: yahrzeit/birthdayOrAnniversary standalone functions', () => {
  const dt = new Date(2014, 2, 2); // 30 Adar I 5774
  expect(birthdayOrAnniversary(5785, dt)?.toString()).toBe('1 Nisan 5785');
  expect(yahrzeit(5785, dt)?.toString()).toBe("30 Sh'vat 5785");
  // 0th birthday exists; 0th yahrzeit does not
  expect(birthdayOrAnniversary(5774, dt)?.toString()).toBe('30 Adar I 5774');
  expect(yahrzeit(5774, dt)).toBe(undefined);
  // the HebrewCalendar statics are thin wrappers over exactly these
  expect(HebrewCalendar.getBirthdayOrAnniversary(5785, dt)?.toString()).toBe(
    birthdayOrAnniversary(5785, dt)?.toString()
  );
  expect(HebrewCalendar.getYahrzeit(5785, dt)?.toString()).toBe(
    yahrzeit(5785, dt)?.toString()
  );
});

test('README: neither function modifies the date passed in', () => {
  const d = new HDate(15, months.ADAR_II, 5784);
  const before = d.toString();
  yahrzeit(5787, d);
  birthdayOrAnniversary(5787, d);
  expect(d.toString()).toBe(before);
});
