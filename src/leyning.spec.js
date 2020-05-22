import test from 'ava';
import hebcal from './hebcal';
import leyning from './leyning';

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
                t.is(str, 'Sukkot Chol ha-Moed Day 5 (Hoshana Raba)');
                break;
            default:
        }
    }
});
