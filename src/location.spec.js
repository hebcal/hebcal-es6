import test from 'ava';
import {Location} from './location';
import {HDate} from './hdate';

test('sunset', (t) => {
  const locations = [
    [41.85003, -87.65005, false, 'America/Chicago', '8:23 PM'], // Chicago
    [37.33939, -121.89496, false, 'America/Los_Angeles', '8:26 PM'], // San Jose
    [32.1836, 34.87386, true, 'Asia/Jerusalem', '7:45 PM'], // Ra'anana
    [-37.814, 144.96332, true, 'Australia/Melbourne', '5:09 PM'], // Melbourne
  ];
  const june5 = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
  for (const l of locations) {
    const loc = new Location(l[0], l[1], l[2], l[3]);
    const expected = l[4];
    const sunset = loc.sunset(june5);
    const options = {
      timeZone: loc.tzid,
      hour: 'numeric',
      minute: 'numeric',
    };
    const time = new Intl.DateTimeFormat('en-US', options).format(sunset);
    t.is(time, expected);
  }
});

test('zmanim', (t) => {
  const loc = new Location(41.85003, -87.65005, false, 'America/Chicago');
  const dt = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: loc.tzid,
    hour: 'numeric',
    minute: 'numeric',
  });

  t.is(f.format(loc.chatzot(dt)), '12:50 PM');
  t.is(f.format(loc.chatzotNight(dt)), '12:50 AM');
  t.is(f.format(loc.alotHaShachar(dt)), '3:26 AM');
  t.is(f.format(loc.misheyakir(dt)), '4:04 AM');
  t.is(f.format(loc.misheyakirMachmir(dt)), '4:14 AM');
  t.is(f.format(loc.sofZmanShma(dt)), '9:04 AM');
  t.is(f.format(loc.sofZmanTfilla(dt)), '10:19 AM');
  t.is(f.format(loc.minchaGedola(dt)), '1:28 PM');
  t.is(f.format(loc.minchaKetana(dt)), '5:14 PM');
  t.is(f.format(loc.plagHaMincha(dt)), '6:49 PM');
  t.is(f.format(loc.tzeit(dt)), '9:14 PM');
  t.is(f.format(loc.neitzHaChama(dt)), '5:17 AM');
  t.is(f.format(loc.shkiah(dt)), '8:23 PM');
});
