import test from 'ava';
import Location from './location';
import HDate from './hdate';

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
