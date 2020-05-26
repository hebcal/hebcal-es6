import test from 'ava';
import icalendar from './icalendar';
import hebcal from './hebcal';
import Location from './location';

test('icalendar', t => {
    const options = {
        year: 1993,
        month: 3,
        location: new Location(41.85003, -87.65005, false, "America/Chicago", "Chicago", 'US', 4887398),
        candlelighting: true,
        sedrot: true,
    };
    const events = hebcal.hebcalEvents(options);
    for (const ev of events) {
        const ical = icalendar.eventToIcal(ev, options);
//        console.log(ical, ev);
    }

    t.pass('message');
});
