import test from 'ava';
import {Zmanim} from './zmanim';
import {HDate} from './hdate';

test('zmanim', (t) => {
  const latitude = 41.85003;
  const longitude = -87.65005;
  const tzid = 'America/Chicago';
  const dt = new HDate(new Date(Date.UTC(2020, 5, 5, 12))); // Friday June 5 2020
  const zman = new Zmanim(dt, latitude, longitude);
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    hour: 'numeric',
    minute: 'numeric',
  });

  t.is(f.format(zman.sunrise()), '5:17 AM');
  t.is(f.format(zman.sunset()), '8:23 PM');
  t.is(f.format(zman.chatzot()), '12:50 PM');
  t.is(f.format(zman.chatzotNight()), '12:50 AM');
  t.is(f.format(zman.alotHaShachar()), '3:26 AM');
  t.is(f.format(zman.misheyakir()), '4:04 AM');
  t.is(f.format(zman.misheyakirMachmir()), '4:14 AM');
  t.is(f.format(zman.sofZmanShma()), '9:04 AM');
  t.is(f.format(zman.sofZmanTfilla()), '10:19 AM');
  t.is(f.format(zman.minchaGedola()), '1:28 PM');
  t.is(f.format(zman.minchaKetana()), '5:14 PM');
  t.is(f.format(zman.plagHaMincha()), '6:49 PM');
  t.is(f.format(zman.tzeit()), '9:14 PM');
  t.is(f.format(zman.neitzHaChama()), '5:17 AM');
  t.is(f.format(zman.shkiah()), '8:23 PM');
});
