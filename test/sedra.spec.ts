import {expect, test} from 'vitest';
import {HDate, isoDateString, months} from '@hebcal/hdate';
import '../src/locale'; // Adds Hebrew and Ashkenazic translations
import {Sedra} from '../src/sedra';

/**
 * @private
 * @param hd
 */
function dt(hd: HDate | null): string {
  const hd1 = hd as HDate;
  return isoDateString(hd1.greg());
}

test('3762', () => {
  const sedra = new Sedra(3762, false);
  const startAbs = HDate.hebrew2abs(3762, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(3763, months.TISHREI, 1) - 1;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    if (hd.getDay() === 6) { // Saturday
      const p = sedra.lookup(abs);
      expect(typeof p.chag).toBe('boolean');
    }
  }
});

const oct1 = new HDate(new Date(1988, 9, 1));
const nov5 = new HDate(new Date(1988, 10, 5));
const jul15 = new HDate(new Date(1989, 6, 15));

test('get', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.lookup(oct1).parsha).toEqual(['Sukkot Shabbat Chol ha-Moed']);
  expect(sedra.lookup(nov5).parsha).toEqual(['Chayei Sara']);
  expect(sedra.lookup(jul15).parsha).toEqual(['Chukat', 'Balak']);
});

test('lookup', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.lookup(oct1)).toEqual({
    parsha: ['Sukkot Shabbat Chol ha-Moed'],
    chag: true,
    il: false,
    hdate: new HDate(726011),
  });
  expect(sedra.lookup(nov5)).toEqual({
    parsha: ['Chayei Sara'],
    chag: false,
    il: false,
    num: 5,
    hdate: new HDate(726046),
  });
  expect(sedra.lookup(jul15)).toEqual({
    parsha: ['Chukat', 'Balak'],
    chag: false,
    il: false,
    num: [39, 40],
    hdate: new HDate(726298),
  });
});

test('lookup-rollover', () => {
  const sedra = new Sedra(5782, true);
  const hd = new HDate(6, 'Tishrei', 5783);
  expect(sedra.lookup(hd)).toEqual({
    parsha: ['Vayeilech'],
    chag: false,
    il: true,
    num: 52,
    hdate: new HDate(738429),
  });
});

test('lookup-throws', () => {
  const sedra = new Sedra(5781, false);
  expect(() => {
    sedra.lookup(NaN);
  }).toThrow('Bad date argument: NaN');
});

test('isParsha', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.lookup(oct1).chag).toBe(true);
  expect(sedra.lookup(nov5).chag).toBe(false);
  expect(sedra.lookup(jul15).chag).toBe(false);
});

test('getYear', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.getYear()).toBe(5749);
});

test('getFirstSaturday', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.getFirstSaturday()).toBe(725997);
});

test('getSedraArray', () => {
  const sedra = new Sedra(5749, false);
  const arr = sedra.getSedraArray();
  expect(arr.length).toBe(54);
});

test('find', () => {
  const sedra = new Sedra(5781, false);
  expect(dt(sedra.find('Bereshit'))).toBe('2020-10-17');
  expect(dt(sedra.find('Noach'))).toBe('2020-10-24');
  expect(dt(sedra.find(['Noach']))).toBe('2020-10-24');
  expect(dt(sedra.find('Lech-Lecha'))).toBe('2020-10-31');
  expect(dt(sedra.find('Bo'))).toBe('2021-01-23');
  expect(dt(sedra.find(['Tazria', 'Metzora']))).toBe('2021-04-17');
  expect(dt(sedra.find('Tazria-Metzora'))).toBe('2021-04-17');
  expect(sedra.find('Tazria')).toBeNull();
  expect(sedra.find('Metzora')).toBeNull();
  expect(dt(sedra.find('Chukat'))).toBe('2021-06-19');
  expect(sedra.find(['Chukat', 'Balak'])).toBeNull();
  expect(sedra.find('Chukat-Balak')).toBeNull();
  const sedra5785 = new Sedra(5785, false);
  expect(dt(sedra5785.find('Sukkot Shabbat Chol ha-Moed'))).toBe('2024-10-19');
  expect(sedra.find('Sukkot Shabbat Chol ha-Moed')).toBeNull();
});

test('findContaining', () => {
  const sedra = new Sedra(5781, false);
  expect(dt(sedra.findContaining('Noach'))).toBe('2020-10-24');
  expect(dt(sedra.findContaining('Lech-Lecha'))).toBe('2020-10-31');
  expect(dt(sedra.findContaining('Bo'))).toBe('2021-01-23');
  expect(dt(sedra.findContaining('Tazria-Metzora'))).toBe('2021-04-17');
  expect(dt(sedra.findContaining('Tazria'))).toBe('2021-04-17');
  expect(dt(sedra.findContaining('Metzora'))).toBe('2021-04-17');
  expect(dt(sedra.findContaining('Chukat-Balak'))).toBe('2021-06-19');
  expect(dt(sedra.findContaining('Chukat'))).toBe('2021-06-19');
  expect(dt(sedra.findContaining('Balak'))).toBe('2021-06-26');
});

test('find-number', () => {
  const sedra = new Sedra(5781, false);
  expect(dt(sedra.find(0))).toBe('2020-10-17');
  expect(dt(sedra.find(1))).toBe('2020-10-24');
  expect(dt(sedra.find(2))).toBe('2020-10-31');
  expect(dt(sedra.find(-26))).toBe('2021-04-17');
});

test('find-bad string returns null', () => {
  const sedra = new Sedra(5781, false);
  expect(sedra.find('Bogus')).toBeNull();
});

test('find-throws', () => {
  const sedra = new Sedra(5781, false);
  expect(() => {
    sedra.find([]);
  }).toThrow('Invalid parsha argument: []');
  expect(() => {
    sedra.find(['a', 'b', 'c']);
  }).toThrow('Invalid parsha argument: ["a","b","c"]');
  expect(() => {
    sedra.find(54);
  }).toThrow('Invalid parsha number: 54');
  expect(() => {
    sedra.find(-39);
  }).toThrow('Invalid parsha number: -39');
  expect(() => {
    sedra.findContaining(-77);
  }).toThrow('Invalid parsha number: -77');
  expect(() => {
    sedra.find(['Tzav', 'Shmini']);
  }).toThrow('Unrecognized parsha name: Tzav-Shmini');
  expect(() => {
    sedra.find(['Tzav', 'Foobar']);
  }).toThrow('Unrecognized parsha name: Tzav-Foobar');
  expect(() => {
    sedra.findContaining('Foo-Bar');
  }).toThrow('Unrecognized parsha name: Foo-Bar');
});

test('find-holiday', () => {
  const sedra1 = new Sedra(5781, false);
  expect(sedra1.find('Yom Kippur')).toBeNull();
  expect(dt(sedra1.find('Pesach VII'))).toBe('2021-04-03');

  const sedra2 = new Sedra(5754, true);
  expect(dt(sedra2.find('Yom Kippur'))).toBe('1993-09-25');
  expect(dt(sedra2.find('Pesach VII'))).toBe('1994-04-02');

  const sedra3 = new Sedra(5752, false);
  expect(sedra3.find('Pesach VII')).toBeNull();
  expect(dt(sedra3.find('Pesach VIII'))).toBe('1992-04-25');
});

test('complete-incomplete-types', () => {
  const years = [5701, 5702, 5703, 5708, 5710, 5711, 5713, 5714, 5715, 5717, 5719, 5726, 5734, 5736];
  for (const year of years) {
    const sedraDiaspora = new Sedra(year, false);
    const sedraIL = new Sedra(year, true);
    expect(sedraDiaspora.find(0)).not.toEqual(null);
    expect(sedraIL.find(0)).not.toEqual(null);
  }
});

test('weekday1', () => {
  const sedra = new Sedra(5785, false);
  const tishrei7 = new HDate(7, months.TISHREI, 5785);
  expect(sedra.lookup(tishrei7)).toEqual({
    parsha: ['Yom Kippur'],
    chag: true,
    il: false,
    hdate: new HDate(739171),
  });
});

test('Shabbos Chol Hamoed Pesach', () => {
  const years = [5786, 5783, 5780, 5777];
  for (const year of years) {
    const sedra = new Sedra(year, false);
    const hd = new HDate(17, months.NISAN, year);
    const result = sedra.lookup(hd);
    expect(result.chag).toBe(true);
    expect(result.hdate.dd).toBeOneOf([17, 19]);
    expect(result.parsha[0]).toBe('Pesach Shabbat Chol ha-Moed');
  }
});

test('Pesach Diaspora', () => {
  for (let year = 5700; year < 5900; year++) {
    const sedra = new Sedra(year, false);
    const hd = new HDate(17, months.NISAN, year);
    const result = sedra.lookup(hd);
    expect(result.chag).toBe(true);
    switch (result.hdate.dd) {
      case 17:
      case 19:
        expect(result.parsha[0]).toBe('Pesach Shabbat Chol ha-Moed');
        break;
      case 21:
        expect(result.parsha[0]).toBe('Pesach VII');
        break;
      case 22:
        expect(result.parsha[0]).toBe('Pesach VIII');
        break;
      default:
        console.log((sedra as any).yearKey);
        console.log(result);
        expect(result.hdate.dd).toBe(0); // fail
    }
  }
});

