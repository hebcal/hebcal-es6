import test from 'ava';
import {HDate, months} from './hdate';
import {Locale} from './locale';
import {Sedra} from './sedra';
import './locale-he';
import './locale-ashkenazi';

/**
 * @private
 * @param {HDate} hd
 * @return {string}
 */
function dt(hd) {
  return hd.greg().toISOString().substring(0, 10);
}

test('3762', (t) => {
  const sedra = new Sedra(3762, false);
  const startAbs = HDate.hebrew2abs(3762, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(3763, months.TISHREI, 1) - 1;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const hd = new HDate(abs);
    if (hd.getDay() === 6) { // Saturday
      const p = sedra.lookup(abs);
      t.is(typeof p.chag, 'boolean');
    }
  }
});

test('getString-locale', (t) => {
  Locale.useLocale('he');
  const sedra = new Sedra(5781, false);
  const hd = new HDate(new Date(2021, 3, 24));
  t.is(sedra.getString(hd), 'פָּרָשַׁת אַחֲרֵי מוֹת־קְדשִׁים');
  t.is(sedra.getString(hd, 'en'), 'Parashat Achrei Mot-Kedoshim');
  t.is(sedra.getString(hd, 'ashkenazi'), 'Parshas Achrei Mos-Kedoshim');
});

const oct1 = new HDate(new Date(1988, 9, 1));
const nov5 = new HDate(new Date(1988, 10, 5));
const jul15 = new HDate(new Date(1989, 6, 15));

test('get', (t) => {
  const sedra = new Sedra(5749, false);
  t.deepEqual(sedra.get(oct1), ['Sukkot Shabbat Chol ha-Moed']);
  t.deepEqual(sedra.get(nov5), ['Chayei Sara']);
  t.deepEqual(sedra.get(jul15), ['Chukat', 'Balak']);
});

test('getString', (t) => {
  const sedra = new Sedra(5749, false);
  t.is(sedra.getString(oct1, 'en'), 'Parashat Sukkot Shabbat Chol ha-Moed');
  t.is(sedra.getString(nov5, 'en'), 'Parashat Chayei Sara');
  t.is(sedra.getString(jul15, 'en'), 'Parashat Chukat-Balak');
});

test('lookup', (t) => {
  const sedra = new Sedra(5749, false);
  t.deepEqual(sedra.lookup(oct1), {parsha: ['Sukkot Shabbat Chol ha-Moed'], chag: true});
  t.deepEqual(sedra.lookup(nov5), {parsha: ['Chayei Sara'], chag: false, num: 5});
  t.deepEqual(sedra.lookup(jul15), {parsha: ['Chukat', 'Balak'], chag: false, num: [39, 40]});
});

test('isParsha', (t) => {
  const sedra = new Sedra(5749, false);
  t.is(sedra.isParsha(oct1), false);
  t.is(sedra.isParsha(nov5), true);
  t.is(sedra.isParsha(jul15), true);
});

test('getYear', (t) => {
  const sedra = new Sedra(5749, false);
  t.is(sedra.getYear(), 5749);
});

test('find', (t) => {
  const sedra = new Sedra(5781, false);
  t.is(dt(sedra.find('Bereshit')), '2020-10-17');
  t.is(dt(sedra.find('Noach')), '2020-10-24');
  t.is(dt(sedra.find('Lech-Lecha')), '2020-10-31');
  t.is(dt(sedra.find('Bo')), '2021-01-23');
  t.is(dt(sedra.find(['Tazria', 'Metzora'])), '2021-04-17');
  t.is(dt(sedra.find('Tazria-Metzora')), '2021-04-17');
  t.is(sedra.find('Tazria'), null);
  t.is(sedra.find('Metzora'), null);
  t.is(dt(sedra.find('Chukat')), '2021-06-19');
  t.is(sedra.find(['Chukat', 'Balak']), null);
});

test('find-holiday', (t) => {
  const sedra1 = new Sedra(5781, false);
  t.is(sedra1.find('Yom Kippur'), null);
  t.is(dt(sedra1.find('Pesach VII')), '2021-04-03');

  const sedra2 = new Sedra(5754, true);
  t.is(dt(sedra2.find('Yom Kippur')), '1993-09-25');
  t.is(dt(sedra2.find('Pesach VII')), '1994-04-02');

  const sedra3 = new Sedra(5752, false);
  t.is(sedra3.find('Pesach VII'), null);
  t.is(dt(sedra3.find('Pesach VIII')), '1992-04-25');
});

test('complete-incomplete-types', (t) => {
  const years = [5701, 5702, 5703, 5708, 5710, 5711, 5713, 5714, 5715, 5717, 5719, 5726, 5734, 5736];
  for (const year of years) {
    const sedraDiaspora = new Sedra(year, false);
    const sedraIL = new Sedra(year, true);
    t.not(sedraDiaspora.find(0), null);
    t.not(sedraIL.find(0), null);
  }
});
