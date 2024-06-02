import {HDate, Locale, isoDateString, months} from '@hebcal/hdate';
import '../src/locale'; // Adds Hebrew and Ashkenazic translations
import {Sedra} from '../src/sedra';

jest.mock('quick-lru', () => {
  return jest.fn().mockImplementation(() => {
    return new Map();
  });
});

/**
 * @private
 * @param {HDate} hd
 * @return {string}
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

test('getString-locale', () => {
  Locale.useLocale('he');
  const sedra = new Sedra(5781, false);
  const hd = new HDate(new Date(2021, 3, 24));
  expect(sedra.getString(hd)).toBe('פָּרָשַׁת אַחֲרֵי מוֹת־קְדשִׁים');
  expect(sedra.getString(hd, 'en')).toBe('Parashat Achrei Mot-Kedoshim');
  expect(sedra.getString(hd, 'ashkenazi')).toBe('Parshas Achrei Mos-Kedoshim');
});

const sep24 = new HDate(new Date(1988, 8, 24));
const oct1 = new HDate(new Date(1988, 9, 1));
const nov5 = new HDate(new Date(1988, 10, 5));
const jul15 = new HDate(new Date(1989, 6, 15));

test('get', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.get(oct1)).toEqual(['Sukkot Shabbat Chol ha-Moed']);
  expect(sedra.get(nov5)).toEqual(['Chayei Sara']);
  expect(sedra.get(jul15)).toEqual(['Chukat', 'Balak']);
});

test('getString', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.getString(oct1, 'en')).toBe('Parashat Sukkot Shabbat Chol ha-Moed');
  expect(sedra.getString(nov5, 'en')).toBe('Parashat Chayei Sara');
  expect(sedra.getString(jul15, 'en')).toBe('Parashat Chukat-Balak');
  expect(sedra.getString(sep24, 'ashkenazi')).toBe('Parshas Ha’azinu');
});

test('lookup', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.lookup(oct1)).toEqual({parsha: ['Sukkot Shabbat Chol ha-Moed'], chag: true});
  expect(sedra.lookup(nov5)).toEqual({parsha: ['Chayei Sara'], chag: false, num: 5});
  expect(sedra.lookup(jul15)).toEqual({parsha: ['Chukat', 'Balak'], chag: false, num: [39, 40]});
});

test('isParsha', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.isParsha(oct1)).toBe(false);
  expect(sedra.isParsha(nov5)).toBe(true);
  expect(sedra.isParsha(jul15)).toBe(true);
});

test('getYear', () => {
  const sedra = new Sedra(5749, false);
  expect(sedra.getYear()).toBe(5749);
});

test('find', () => {
  const sedra = new Sedra(5781, false);
  expect(dt(sedra.find('Bereshit'))).toBe('2020-10-17');
  expect(dt(sedra.find('Noach'))).toBe('2020-10-24');
  expect(dt(sedra.find('Lech-Lecha'))).toBe('2020-10-31');
  expect(dt(sedra.find('Bo'))).toBe('2021-01-23');
  expect(dt(sedra.find(['Tazria', 'Metzora']))).toBe('2021-04-17');
  expect(dt(sedra.find('Tazria-Metzora'))).toBe('2021-04-17');
  expect(sedra.find('Tazria')).toBe(null);
  expect(sedra.find('Metzora')).toBe(null);
  expect(dt(sedra.find('Chukat'))).toBe('2021-06-19');
  expect(sedra.find(['Chukat', 'Balak'])).toBe(null);
});

test('find-holiday', () => {
  const sedra1 = new Sedra(5781, false);
  expect(sedra1.find('Yom Kippur')).toBe(null);
  expect(dt(sedra1.find('Pesach VII'))).toBe('2021-04-03');

  const sedra2 = new Sedra(5754, true);
  expect(dt(sedra2.find('Yom Kippur'))).toBe('1993-09-25');
  expect(dt(sedra2.find('Pesach VII'))).toBe('1994-04-02');

  const sedra3 = new Sedra(5752, false);
  expect(sedra3.find('Pesach VII')).toBe(null);
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
