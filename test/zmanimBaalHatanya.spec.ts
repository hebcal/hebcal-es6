import {expect, test} from 'vitest';
import {Location} from '../src/location.js';
import {Zmanim} from '../src/zmanim.js';

// https://github.com/hebcal/hebcal-es6/issues/805
// Chabad.org's printed Baal Hatanya times, at the coordinates Chabad.org uses.
// Chabad.org rounds deadlines (shema) down to the minute and start times
// (mincha gedola, mincha ketana, plag) up. The first 15 are every day in
// Nov 2026 to Oct 2027 where 1.583° and netz amiti + 6.5 hours missed the
// printed minute. The last 3 are days where chatzot() cut to the second
// before adding half an hour would land a minute early.
const places = {
  brooklyn: new Location(40.671767, -73.935934, false, 'America/New_York'),
  la: new Location(34.0699, -118.3492, false, 'America/Los_Angeles'),
  jerusalem: new Location(31.7890224, 35.2010765, true, 'Asia/Jerusalem'),
  london: new Location(51.503347, -0.079396, false, 'Europe/London'),
  melbourne: new Location(-37.816667, 144.966667, false, 'Australia/Melbourne'),
};

type Method =
  | 'sofZmanShmaBaalHatanya'
  | 'minchaGedolaBaalHatanya'
  | 'minchaKetanaBaalHatanya'
  | 'plagHaminchaBaalHatanya';

const chabadOrg: [keyof typeof places, string, Method, string][] = [
  ['brooklyn', '2026-11-11', 'minchaKetanaBaalHatanya', '14:39'],
  ['brooklyn', '2027-04-26', 'minchaKetanaBaalHatanya', '16:58'],
  ['brooklyn', '2027-06-06', 'plagHaminchaBaalHatanya', '18:55'],
  ['la', '2027-03-28', 'minchaGedolaBaalHatanya', '13:30'],
  ['la', '2027-07-16', 'minchaKetanaBaalHatanya', '17:11'],
  ['london', '2027-02-05', 'sofZmanShmaBaalHatanya', '09:50'],
  ['london', '2027-04-15', 'minchaGedolaBaalHatanya', '13:36'],
  ['london', '2027-05-09', 'minchaGedolaBaalHatanya', '13:36'],
  ['london', '2027-06-08', 'minchaKetanaBaalHatanya', '17:53'],
  ['london', '2027-08-13', 'minchaGedolaBaalHatanya', '13:43'],
  ['london', '2027-08-25', 'plagHaminchaBaalHatanya', '18:40'],
  ['london', '2027-09-02', 'minchaKetanaBaalHatanya', '17:00'],
  ['melbourne', '2026-11-26', 'minchaGedolaBaalHatanya', '13:44'],
  ['melbourne', '2026-12-10', 'minchaGedolaBaalHatanya', '13:50'],
  ['melbourne', '2027-09-26', 'plagHaminchaBaalHatanya', '17:07'],
  ['brooklyn', '2026-11-11', 'minchaGedolaBaalHatanya', '12:06'],
  ['jerusalem', '2026-11-20', 'minchaGedolaBaalHatanya', '11:52'],
  ['london', '2027-01-27', 'minchaGedolaBaalHatanya', '12:37'],
];

const MINUTE = 60_000;

test.each(chabadOrg)('%s %s %s', (place, date, method, expected) => {
  const loc = places[place];
  const [yy, mm, dd] = date.split('-').map(Number);
  const zman = new Zmanim(loc, new Date(yy, mm - 1, dd), false);
  const millis = zman[method]().getTime();
  const rounded =
    method === 'sofZmanShmaBaalHatanya'
      ? Math.floor(millis / MINUTE) * MINUTE
      : Math.ceil(millis / MINUTE) * MINUTE;
  const f = new Intl.DateTimeFormat('en-GB', {
    timeZone: loc.getTzid(),
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  expect(f.format(rounded)).toBe(expected);
});
