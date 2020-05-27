import test from 'ava';
import { Location } from './location';
import { HDate } from './hdate';

test('sunset', t => {
    const locations = [
        [41.85003, -87.65005, false, "America/Chicago", "8:23 PM"], // Chicago
        [37.33939, -121.89496, false, "America/Los_Angeles", "8:26 PM"], // San Jose
        [32.1836, 34.87386, true, "Asia/Jerusalem", "7:45 PM"], // Ra'anana
        [-37.814, 144.96332, true, "Australia/Melbourne", "5:09 PM"], // Melbourne
    ];
    const june5 = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
    for (const l of locations) {
        let loc = new Location(l[0], l[1], l[2], l[3]);
        let expected = l[4];
        let sunset = loc.sunset(june5);
        let options = {
            timeZone: loc.tzid,
            hour: 'numeric',
            minute: 'numeric'
        };
        let time = new Intl.DateTimeFormat('en-US', options).format(sunset);
        t.is(time, expected);
    }
});

test('zmanim', t => {
    const loc = new Location(41.85003, -87.65005, false, "America/Chicago");
    const dt = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
    const f = new Intl.DateTimeFormat('en-US', {
        timeZone: loc.tzid,
        hour: 'numeric',
        minute: 'numeric'
    });

    t.is(f.format(loc.chatzot(dt)), "12:50 PM");
    t.is(f.format(loc.chatzot_night(dt)), "12:50 AM");
    t.is(f.format(loc.alot_hashachar(dt)), "3:26 AM");
    t.is(f.format(loc.misheyakir(dt)), "4:04 AM");
    t.is(f.format(loc.misheyakir_machmir(dt)), "4:14 AM");
    t.is(f.format(loc.sof_zman_shma(dt)), "9:04 AM");
    t.is(f.format(loc.sof_zman_tfilla(dt)), "10:19 AM");
    t.is(f.format(loc.mincha_gedola(dt)), "1:28 PM");
    t.is(f.format(loc.mincha_ketana(dt)), "5:14 PM");
    t.is(f.format(loc.plag_hamincha(dt)), "6:49 PM");
    t.is(f.format(loc.tzeit(dt)), "9:14 PM");
    t.is(f.format(loc.neitz_hachama(dt)), "5:17 AM");
    t.is(f.format(loc.shkiah(dt)), "8:23 PM");
});
