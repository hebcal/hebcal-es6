import test from 'ava';
import {HDate, months} from './hdate';
import {Locale} from './locale';
import {Sedra, ParshaEvent} from './sedra';
import {greg as g} from './greg';

test('ParshaEvent', (t) => {
  const ev1 = new ParshaEvent(new HDate(new Date(2020, 4, 16)), ['Behar', 'Bechukotai']);
  t.is(ev1.url(), 'https://www.hebcal.com/sedrot/beharbechukotai');
  const ev2 = new ParshaEvent(new HDate(new Date(2020, 5, 6)), ['Nasso']);
  t.is(ev2.url(), 'https://www.hebcal.com/sedrot/nasso');
  const ev3 = new ParshaEvent(new HDate(new Date(2020, 5, 13)), ['Beha\'alotcha']);
  t.is(ev3.url(), 'https://www.hebcal.com/sedrot/behaalotcha');
  const ev4 = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Achrei Mot']);
  t.is(ev4.url(), 'https://www.hebcal.com/sedrot/achreimot');
});

// eslint-disable-next-line require-jsdoc
function testFullYear(t, gregYear, sedra, expected) {
  const startAbs = g.greg2abs(new Date(Date.UTC(gregYear, 0, 1)));
  const endAbs = g.greg2abs(new Date(Date.UTC(gregYear, 11, 31)));
  let i = 0;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const dow = abs % 7;
    if (dow == 6) { // Saturday
      const todayHeb = new HDate(abs);
      const parshaStr = sedra.getString(todayHeb);
      const todayGreg = g.abs2greg(abs);
      const date = todayGreg.toLocaleDateString('en-US');
      const str = date + ' ' + parshaStr;
      t.is(str, expected[i]);
      i++;
    }
  }
}

test('3762', (t) => {
  const sedra = new Sedra(3762, false);
  const startAbs = HDate.hebrew2abs(3762, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(3763, months.TISHREI, 1) - 1;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const dow = abs % 7;
    if (dow == 6) { // Saturday
      const p = sedra.lookup(abs);
      t.is(typeof p.chag, 'boolean');
    }
  }
});

test('sedra-diaspora', (t) => {
  const expected =
`1/4/2020 Parashat Vayigash
1/11/2020 Parashat Vayechi
1/18/2020 Parashat Shemot
1/25/2020 Parashat Vaera
2/1/2020 Parashat Bo
2/8/2020 Parashat Beshalach
2/15/2020 Parashat Yitro
2/22/2020 Parashat Mishpatim
2/29/2020 Parashat Terumah
3/7/2020 Parashat Tetzaveh
3/14/2020 Parashat Ki Tisa
3/21/2020 Parashat Vayakhel-Pekudei
3/28/2020 Parashat Vayikra
4/4/2020 Parashat Tzav
4/11/2020 Parashat Pesach
4/18/2020 Parashat Shmini
4/25/2020 Parashat Tazria-Metzora
5/2/2020 Parashat Achrei Mot-Kedoshim
5/9/2020 Parashat Emor
5/16/2020 Parashat Behar-Bechukotai
5/23/2020 Parashat Bamidbar
5/30/2020 Parashat Shavuot
6/6/2020 Parashat Nasso
6/13/2020 Parashat Beha'alotcha
6/20/2020 Parashat Sh'lach
6/27/2020 Parashat Korach
7/4/2020 Parashat Chukat-Balak
7/11/2020 Parashat Pinchas
7/18/2020 Parashat Matot-Masei
7/25/2020 Parashat Devarim
8/1/2020 Parashat Vaetchanan
8/8/2020 Parashat Eikev
8/15/2020 Parashat Re'eh
8/22/2020 Parashat Shoftim
8/29/2020 Parashat Ki Teitzei
9/5/2020 Parashat Ki Tavo
9/12/2020 Parashat Nitzavim-Vayeilech
9/19/2020 Parashat Rosh Hashana
9/26/2020 Parashat Ha'Azinu
10/3/2020 Parashat Sukkot
10/10/2020 Parashat Shmini Atzeret
10/17/2020 Parashat Bereshit
10/24/2020 Parashat Noach
10/31/2020 Parashat Lech-Lecha
11/7/2020 Parashat Vayera
11/14/2020 Parashat Chayei Sara
11/21/2020 Parashat Toldot
11/28/2020 Parashat Vayetzei
12/5/2020 Parashat Vayishlach
12/12/2020 Parashat Vayeshev
12/19/2020 Parashat Miketz
12/26/2020 Parashat Vayigash
`.split('\n');
  const hyear = new HDate(new Date(Date.UTC(2020, 5, 2))).getFullYear();
  testFullYear(t, 2020, new Sedra(hyear, false), expected);
});

test('sedra-israel', (t) => {
  const expected =
`1/4/2020 Parashat Vayigash
1/11/2020 Parashat Vayechi
1/18/2020 Parashat Shemot
1/25/2020 Parashat Vaera
2/1/2020 Parashat Bo
2/8/2020 Parashat Beshalach
2/15/2020 Parashat Yitro
2/22/2020 Parashat Mishpatim
2/29/2020 Parashat Terumah
3/7/2020 Parashat Tetzaveh
3/14/2020 Parashat Ki Tisa
3/21/2020 Parashat Vayakhel-Pekudei
3/28/2020 Parashat Vayikra
4/4/2020 Parashat Tzav
4/11/2020 Parashat Pesach
4/18/2020 Parashat Shmini
4/25/2020 Parashat Tazria-Metzora
5/2/2020 Parashat Achrei Mot-Kedoshim
5/9/2020 Parashat Emor
5/16/2020 Parashat Behar-Bechukotai
5/23/2020 Parashat Bamidbar
5/30/2020 Parashat Nasso
6/6/2020 Parashat Beha'alotcha
6/13/2020 Parashat Sh'lach
6/20/2020 Parashat Korach
6/27/2020 Parashat Chukat
7/4/2020 Parashat Balak
7/11/2020 Parashat Pinchas
7/18/2020 Parashat Matot-Masei
7/25/2020 Parashat Devarim
8/1/2020 Parashat Vaetchanan
8/8/2020 Parashat Eikev
8/15/2020 Parashat Re'eh
8/22/2020 Parashat Shoftim
8/29/2020 Parashat Ki Teitzei
9/5/2020 Parashat Ki Tavo
9/12/2020 Parashat Nitzavim-Vayeilech
9/19/2020 Parashat Rosh Hashana
9/26/2020 Parashat Ha'Azinu
10/3/2020 Parashat Sukkot
10/10/2020 Parashat Shmini Atzeret
10/17/2020 Parashat Bereshit
10/24/2020 Parashat Noach
10/31/2020 Parashat Lech-Lecha
11/7/2020 Parashat Vayera
11/14/2020 Parashat Chayei Sara
11/21/2020 Parashat Toldot
11/28/2020 Parashat Vayetzei
12/5/2020 Parashat Vayishlach
12/12/2020 Parashat Vayeshev
12/19/2020 Parashat Miketz
12/26/2020 Parashat Vayigash
`.split('\n');
  const hyear = new HDate(new Date(Date.UTC(2020, 5, 2))).getFullYear();
  testFullYear(t, 2020, new Sedra(hyear, true), expected);
});

test('getString-locale', (t) => {
  Locale.useLocale('he');
  let sedra = new Sedra(5780, true);
  let hd = new HDate(new Date(2020, 6, 7));
  const parsha = sedra.get(hd);
  const ev = new ParshaEvent(hd, parsha);
  t.is(ev.render(), 'פרשת פִּינְחָס');

  sedra = new Sedra(5781, false);
  hd = new HDate(new Date(2021, 3, 24));
  t.is(sedra.getString(hd), 'פרשת אַחֲרֵי מוֹת־קְדשִׁים');
  t.is(sedra.getString(hd, 'en'), 'Parashat Achrei Mot-Kedoshim');
  t.is(sedra.getString(hd, 'ashkenazi'), 'Parshas Achrei Mos-Kedoshim');
});
