import test from 'ava';
import hebcal, { flags } from './hebcal';
import Location from './location';

test('heb-month', t => {
    const options = {
        year: 5780,
        isHebrewYear: true,
        month: "Iyyar",    
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 8);
    t.is(events[0].getDesc(), "Rosh Chodesh Iyyar");
    t.is(events[0].getDate().greg().toLocaleDateString("en-US"), "4/25/2020");
    t.is(events[4].getDesc(), "Lag BaOmer");
    t.is(events[4].getDate().greg().toLocaleDateString("en-US"), "5/12/2020");
});

test('greg-month', t => {
    const options = {
        year: 2017,
        isHebrewYear: false,
        month: 3,
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 9);
    t.is(events[0].getDesc(), "Ta'anit Esther");
    t.is(events[0].getDate().greg().toLocaleDateString("en-US"), "3/9/2017");
    t.is(events[8].getDesc(), "Rosh Chodesh Nisan");
    t.is(events[8].getDate().greg().toLocaleDateString("en-US"), "3/28/2017");
});

test('greg-year', t => {
    const options = {
        year: 1993
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 93);
    t.is(events[0].getDesc(), "Asara B'Tevet");
    t.is(events[0].getDate().greg().toLocaleDateString("en-US"), "1/3/1993");
    t.is(events[80].getDesc(), "Chanukah: 1 Candle");
    t.is(events[80].getDate().greg().toLocaleDateString("en-US"), "12/8/1993");
    t.is(events[92].getDesc(), "Asara B'Tevet");
    t.is(events[92].getDate().greg().toLocaleDateString("en-US"), "12/24/1993");
});

test('heb-year', t => {
    const options = {
        year: 5749,
        isHebrewYear: true,
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 94);
    t.is(events[0].getDesc(), "Rosh Hashana 5749");
    t.is(events[0].getDate().greg().toLocaleDateString("en-US"), "9/12/1988");
    t.is(events[1].getDesc(), "Rosh Hashana II");
    t.is(events[1].getDate().greg().toLocaleDateString("en-US"), "9/13/1988");
    t.is(events[4].getDesc(), "Erev Yom Kippur");
    t.is(events[4].getDate().greg().toLocaleDateString("en-US"), "9/20/1988");
    t.is(events[93].getDesc(), "Erev Rosh Hashana");
    t.is(events[93].getDate().greg().toLocaleDateString("en-US"), "9/29/1989");
});

test('no-options', t => {
    const now = new Date();
    const events = hebcal.hebcalEvents({});
    t.is(events[0].getDate().greg().getFullYear(), now.getFullYear());
    t.is(events[events.length - 1].getDate().greg().getFullYear(), now.getFullYear());
});

test('no-holidays', t => {
    const events = hebcal.hebcalEvents({ noHolidays: true });
    t.is(events.length, 0);
});

test('sedrot-only', t => {
    const options = { year: 1993, noHolidays: true, sedrot: true, il: true };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 49);
    t.is(events[0].getFlags(), flags.PARSHA_HASHAVUA);
    t.is(events[48].getFlags(), flags.PARSHA_HASHAVUA);
});

test('candles-only', t => {
    const options = {
        year: 1993,
        noHolidays: true,
        location: new Location(41.85003, -87.65005, false, "America/Chicago"),
        candlelighting: true
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 113);
    t.is(events[0].getFlags(), flags.LIGHT_CANDLES);
    t.is(events[48].getFlags(), flags.LIGHT_CANDLES);
});

test('dafyomi-only', t => {
    const options = {
        year: 1975,
        isHebrewYear: false,
        month: 6,
        noHolidays: true,
        dafyomi: true
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 30);
    t.is(events[0].getDate().greg().toLocaleDateString("en-US"), "6/1/1975");
    t.is(events[0].getFlags(), flags.DAF_YOMI);
    t.is(events[29].getDate().greg().toLocaleDateString("en-US"), "6/30/1975");
    t.is(events[29].getFlags(), flags.DAF_YOMI);
});

test('omer-only', t => {
    const options = {
        year: 5728,
        isHebrewYear: true,
        month: "Iyyar",
        noHolidays: true,
        omer: true
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 30);
    t.is(events[0].getDate().greg().toLocaleDateString("en-US"), "4/29/1968");
    t.is(events[0].getFlags(), flags.OMER_COUNT);
    t.is(events[29].getDate().greg().toLocaleDateString("en-US"), "5/28/1968");
    t.is(events[29].getFlags(), flags.OMER_COUNT);
});

test('molad-only', t => {
    const options = {
        year: 1975,
        isHebrewYear: false,
        noHolidays: true,
        molad: true
    };
    const events = hebcal.hebcalEvents(options);
    t.is(events.length, 12);
    t.is(events[0].getDesc().startsWith("Molad"), true);
    t.is(events[0].getFlags(), flags.MOLAD);
});

test('multi-year', t => {
    const options = {
        year: 1944,
        isHebrewYear: false,
        numYears: 7
    };
    const events = hebcal.hebcalEvents(options);
    let numRoshHashanaII = 0;
    for (const ev of events) {
        if (ev.getDesc() == 'Rosh Hashana II') {
            numRoshHashanaII++;
        }
    }
    t.is(numRoshHashanaII, 7);
});
