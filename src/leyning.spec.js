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

test('getLeyningForParshaHaShavua', t => {
    const options = { year: 5757, isHebrewYear: true, sedrot: true };
    const events = hebcal.hebcalEvents(options);
    for (const ev of events) {
        if (ev.getFlags() == flags.PARSHA_HASHAVUA) {
            const a = leyning.getLeyningForParshaHaShavua(ev);
            if (ev.getDesc() == 'Parashat Pinchas') {
                console.log(ev, a);
            } else if (ev.getDesc().indexOf('-') != -1) {
                console.log(ev, a);
            }
        }
    }
    t.pass('message');
});