import test from 'ava';
import hebcal from './hebcal';

test('hebcal-heb-month', t => {
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

test('hebcal-greg-month', t => {
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

test('hebcal-greg-year', t => {
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

test('hebcal-heb-year', t => {
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

test('hebcal-no-options', t => {
    const now = new Date();
    const events = hebcal.hebcalEvents({});
    t.is(events[0].getDate().greg().getFullYear(), now.getFullYear());
    t.is(events[events.length - 1].getDate().greg().getFullYear(), now.getFullYear());
});
