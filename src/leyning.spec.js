import test from 'ava';
import hebcal from './hebcal';
import leyning from './leyning';
import { flags } from './holidays';

test('getLeyningKeyForEvent', t => {
//    const options = { year: 1997, noHolidays: true, sedrot: true, il: false };
    const options = { year: 5757, isHebrewYear: true };
    const events = hebcal.hebcalEvents(options);
    for (const e of events) {
        const str = leyning.getLeyningKeyForEvent(e);
//        console.log(e.getDate().greg().toLocaleDateString(), str, e.getDesc(), e.getDate().toString());
        switch (e.getDesc()) {
            case 'Chanukah: 2 Candles':
                t.is(str, 'Chanukah (Day 1)');
                break;
            case 'Chanukah: 8th Day':
                t.is(str, 'Chanukah (Day 8)');
                break;
            case 'Rosh Hashana 5757':
                t.is(str, 'Rosh Hashana I (on Shabbat)');
                break;
            case "Sukkot III (CH''M)":
                t.is(str, 'Sukkot Chol ha-Moed Day 1');
                break;
            case 'Sukkot VII (Hoshana Raba)':
                t.is(str, 'Sukkot Final Day (Hoshana Raba)');
                break;
            case "Pesach III (CH''M)":
                t.is(str, 'Pesach Chol ha-Moed Day 1');
                break;
            case "Pesach IV (CH''M)":
                t.is(str, 'Pesach Chol ha-Moed Day 2');
                break;
            case "Pesach V (CH''M)":
                t.is(str, 'Pesach Shabbat Chol ha-Moed');
                break;
            case "Pesach VI (CH''M)":
                t.is(str, 'Pesach Chol ha-Moed Day 3');
                break;
                default:
        }
    }
});


/*
7/18/1981 16th of Tamuz, 5741
7/18/1981 Parashat Pinchas
--
7/10/1982 19th of Tamuz, 5742
7/10/1982 Parashat Pinchas
*/
test('pinchas17Tamuz', t => {
    let options = { year: 1981, month: 7, isHebrewYear: false, sedrot: true, noHolidays: true };
    let events = hebcal.hebcalEvents(options);
    let ev = events.find(e => e.getDesc() == 'Parashat Pinchas');
    let a = leyning.getLeyningForParshaHaShavua(ev);
    t.is(a.reason, undefined);
    t.is(a.haftara, 'I Kings 18:46 - 19:21');

    options.year = 1982;
    events = hebcal.hebcalEvents(options);
    ev = events.find(e => e.getDesc() == 'Parashat Pinchas');
    a = leyning.getLeyningForParshaHaShavua(ev);
    t.is(a.haftara, 'Jeremiah 1:1 - 2:3');
    t.is(a.reason.haftara, 'Pinchas occurring after 17 Tammuz');
});

function formatMaftir(a) {
    return `${a.fullkriyah.M.k} ${a.fullkriyah.M.b} - ${a.fullkriyah.M.e}`;
}

test('getLeyningForParshaHaShavua', t => {
    const options = { year: 2026, isHebrewYear: false, sedrot: true, noHolidays: true };
    const events = hebcal.hebcalEvents(options);
    for (const ev of events) {
        const a = leyning.getLeyningForParshaHaShavua(ev);
        switch(ev.getDesc()) {
            case "Parashat Mishpatim":
                t.is(a.reason.haftara, "Shabbat Shekalim");
                t.is(a.reason.M, "Shabbat Shekalim");
                t.is(a.haftara, "II Kings 12:1 - 12:17");
                t.is(formatMaftir(a), "Exodus 30:11 - 30:16");
                break;
            case "Parashat Tetzaveh":
                t.is(a.reason.haftara, "Shabbat Zachor");
                t.is(a.reason.M, "Shabbat Zachor");
                t.is(a.haftara, "I Samuel 15:2 - 15:34");
                t.is(formatMaftir(a), "Deuteronomy 25:17 - 25:19");
                break;
            case "Parashat Ki Tisa":
                t.is(a.reason.haftara, "Shabbat Parah");
                t.is(a.reason.M, "Shabbat Parah");
                t.is(a.haftara, "Ezekiel 36:16 - 36:38");
                t.is(formatMaftir(a), "Numbers 19:1 - 19:22");
                break;
            case "Parashat Tzav":
                t.is(a.reason.haftara, "Shabbat HaGadol");
                t.is(a.haftara, "Malachi 3:4 - 3:24");
                break;
            case "Parashat Tazria-Metzora":
                t.is(a.reason.haftara, "Shabbat Rosh Chodesh");
                t.is(a.reason.M, "Shabbat Rosh Chodesh");
                t.is(a.haftara, "Isaiah 66:1 - 66:24");
                t.is(formatMaftir(a), "Numbers 28:9 - 28:15");
                break;
            case "Parashat Bamidbar":
                t.is(a.reason.haftara, "Shabbat Machar Chodesh");
                t.is(a.haftara, "I Samuel 20:18 - 20:42");
                break;
            case "Parashat Vayeshev":
                t.is(a.reason.haftara, "Shabbat Chanukah");
                t.is(a.reason.M, "Chanukah (Day 1)");
                t.is(a.haftara, "Zechariah 2:14-4:7");
                t.is(formatMaftir(a), "Numbers 7:1 - 7:17");
                break;
            case "Parashat Miketz":
                t.is(a.reason.haftara, "Shabbat Chanukah II");
                t.is(a.reason.M, "Chanukah (Day 8)");
                t.is(a.haftara, "I Kings 7:40-50");
                t.is(formatMaftir(a), "Numbers 7:54 - 8:4");
                break;
        }
    }
});
