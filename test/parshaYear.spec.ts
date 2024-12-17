import {expect, test} from 'vitest';
import {Event} from '../src/event';
import {parshaYear} from '../src/parshaYear';
import {isoDateString} from '@hebcal/hdate';

test('Israel and Diaspora lengths differ', () => {
  expect((parshaYear(5784, true)).length).toBe(51);
  expect((parshaYear(5784, false)).length).toBe(51);
  expect((parshaYear(5782, true)).length).toBe(53);
  expect((parshaYear(5782, false)).length).toBe(52);
  expect((parshaYear(5783, true)).length).toBe(48);
  expect((parshaYear(5783, false)).length).toBe(47);
});

test('5785', () => {
  const events = parshaYear(5785, false);
  expect(events.length).toBe(48);
  const actual = events.map((ev: Event) => {
    return {
      dt: isoDateString(ev.date.greg()),
      desc: ev.desc.substring(9),
    };
  });
  const expected = [
    { dt: '2024-10-05', desc: "Ha'azinu" },
    { dt: '2024-10-26', desc: 'Bereshit' },
    { dt: '2024-11-02', desc: 'Noach' },
    { dt: '2024-11-09', desc: 'Lech-Lecha' },
    { dt: '2024-11-16', desc: 'Vayera' },
    { dt: '2024-11-23', desc: 'Chayei Sara' },
    { dt: '2024-11-30', desc: 'Toldot' },
    { dt: '2024-12-07', desc: 'Vayetzei' },
    { dt: '2024-12-14', desc: 'Vayishlach' },
    { dt: '2024-12-21', desc: 'Vayeshev' },
    { dt: '2024-12-28', desc: 'Miketz' },
    { dt: '2025-01-04', desc: 'Vayigash' },
    { dt: '2025-01-11', desc: 'Vayechi' },
    { dt: '2025-01-18', desc: 'Shemot' },
    { dt: '2025-01-25', desc: 'Vaera' },
    { dt: '2025-02-01', desc: 'Bo' },
    { dt: '2025-02-08', desc: 'Beshalach' },
    { dt: '2025-02-15', desc: 'Yitro' },
    { dt: '2025-02-22', desc: 'Mishpatim' },
    { dt: '2025-03-01', desc: 'Terumah' },
    { dt: '2025-03-08', desc: 'Tetzaveh' },
    { dt: '2025-03-15', desc: 'Ki Tisa' },
    { dt: '2025-03-22', desc: 'Vayakhel' },
    { dt: '2025-03-29', desc: 'Pekudei' },
    { dt: '2025-04-05', desc: 'Vayikra' },
    { dt: '2025-04-12', desc: 'Tzav' },
    { dt: '2025-04-26', desc: 'Shmini' },
    { dt: '2025-05-03', desc: 'Tazria-Metzora' },
    { dt: '2025-05-10', desc: 'Achrei Mot-Kedoshim' },
    { dt: '2025-05-17', desc: 'Emor' },
    { dt: '2025-05-24', desc: 'Behar-Bechukotai' },
    { dt: '2025-05-31', desc: 'Bamidbar' },
    { dt: '2025-06-07', desc: 'Nasso' },
    { dt: '2025-06-14', desc: "Beha'alotcha" },
    { dt: '2025-06-21', desc: "Sh'lach" },
    { dt: '2025-06-28', desc: 'Korach' },
    { dt: '2025-07-05', desc: 'Chukat' },
    { dt: '2025-07-12', desc: 'Balak' },
    { dt: '2025-07-19', desc: 'Pinchas' },
    { dt: '2025-07-26', desc: 'Matot-Masei' },
    { dt: '2025-08-02', desc: 'Devarim' },
    { dt: '2025-08-09', desc: 'Vaetchanan' },
    { dt: '2025-08-16', desc: 'Eikev' },
    { dt: '2025-08-23', desc: "Re'eh" },
    { dt: '2025-08-30', desc: 'Shoftim' },
    { dt: '2025-09-06', desc: 'Ki Teitzei' },
    { dt: '2025-09-13', desc: 'Ki Tavo' },
    { dt: '2025-09-20', desc: 'Nitzavim' },
  ];
  expect(actual).toEqual(expected);
});
