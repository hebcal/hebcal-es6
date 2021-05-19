import test from 'ava';
import {HDate, months} from './hdate';
import {Sedra} from './sedra';

/**
 * @private
 * @param {HDate} hd
 * @return {string}
 */
function dt(hd) {
  const s = hd.greg().toISOString();
  return s.substring(0, s.indexOf('T'));
}

test('diaspora-5701', (t) => {
  const hyear = 5701;
  const sedra = new Sedra(hyear, false);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1) - 1;
  const result = {};
  for (let abs = startAbs; abs <= endAbs; abs++) {
    if (abs % 7 === 6) { // Saturday
      result[dt(new HDate(abs))] = sedra.get(abs);
    }
  }
  const expected = {
    '1940-10-05': ['Ha\'Azinu'],
    '1940-10-12': ['Yom Kippur'],
    '1940-10-19': ['Sukkot Shabbat Chol ha-Moed'],
    '1940-10-26': ['Bereshit'],
    '1940-11-02': ['Noach'],
    '1940-11-09': ['Lech-Lecha'],
    '1940-11-16': ['Vayera'],
    '1940-11-23': ['Chayei Sara'],
    '1940-11-30': ['Toldot'],
    '1940-12-07': ['Vayetzei'],
    '1940-12-14': ['Vayishlach'],
    '1940-12-21': ['Vayeshev'],
    '1940-12-28': ['Miketz'],
    '1941-01-04': ['Vayigash'],
    '1941-01-11': ['Vayechi'],
    '1941-01-18': ['Shemot'],
    '1941-01-25': ['Vaera'],
    '1941-02-01': ['Bo'],
    '1941-02-08': ['Beshalach'],
    '1941-02-15': ['Yitro'],
    '1941-02-22': ['Mishpatim'],
    '1941-03-01': ['Terumah'],
    '1941-03-08': ['Tetzaveh'],
    '1941-03-15': ['Ki Tisa'],
    '1941-03-22': ['Vayakhel', 'Pekudei'],
    '1941-03-29': ['Vayikra'],
    '1941-04-05': ['Tzav'],
    '1941-04-12': ['Pesach I'],
    '1941-04-19': ['Pesach VIII'],
    '1941-04-26': ['Shmini'],
    '1941-05-03': ['Tazria', 'Metzora'],
    '1941-05-10': ['Achrei Mot', 'Kedoshim'],
    '1941-05-17': ['Emor'],
    '1941-05-24': ['Behar', 'Bechukotai'],
    '1941-05-31': ['Bamidbar'],
    '1941-06-07': ['Nasso'],
    '1941-06-14': ['Beha\'alotcha'],
    '1941-06-21': ['Sh\'lach'],
    '1941-06-28': ['Korach'],
    '1941-07-05': ['Chukat'],
    '1941-07-12': ['Balak'],
    '1941-07-19': ['Pinchas'],
    '1941-07-26': ['Matot', 'Masei'],
    '1941-08-02': ['Devarim'],
    '1941-08-09': ['Vaetchanan'],
    '1941-08-16': ['Eikev'],
    '1941-08-23': ['Re\'eh'],
    '1941-08-30': ['Shoftim'],
    '1941-09-06': ['Ki Teitzei'],
    '1941-09-13': ['Ki Tavo'],
    '1941-09-20': ['Nitzavim'],
  };
  t.deepEqual(result, expected);
});

test('diaspora-5779', (t) => {
  const hyear = 5779;
  const sedra = new Sedra(hyear, false);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1) - 1;
  const result = {};
  for (let abs = startAbs; abs <= endAbs; abs++) {
    if (abs % 7 === 6) { // Saturday
      result[dt(new HDate(abs))] = sedra.get(abs);
    }
  }
  const expected = {
    '2018-09-15': ['Vayeilech'],
    '2018-09-22': ['Ha\'Azinu'],
    '2018-09-29': ['Sukkot Shabbat Chol ha-Moed'],
    '2018-10-06': ['Bereshit'],
    '2018-10-13': ['Noach'],
    '2018-10-20': ['Lech-Lecha'],
    '2018-10-27': ['Vayera'],
    '2018-11-03': ['Chayei Sara'],
    '2018-11-10': ['Toldot'],
    '2018-11-17': ['Vayetzei'],
    '2018-11-24': ['Vayishlach'],
    '2018-12-01': ['Vayeshev'],
    '2018-12-08': ['Miketz'],
    '2018-12-15': ['Vayigash'],
    '2018-12-22': ['Vayechi'],
    '2018-12-29': ['Shemot'],
    '2019-01-05': ['Vaera'],
    '2019-01-12': ['Bo'],
    '2019-01-19': ['Beshalach'],
    '2019-01-26': ['Yitro'],
    '2019-02-02': ['Mishpatim'],
    '2019-02-09': ['Terumah'],
    '2019-02-16': ['Tetzaveh'],
    '2019-02-23': ['Ki Tisa'],
    '2019-03-02': ['Vayakhel'],
    '2019-03-09': ['Pekudei'],
    '2019-03-16': ['Vayikra'],
    '2019-03-23': ['Tzav'],
    '2019-03-30': ['Shmini'],
    '2019-04-06': ['Tazria'],
    '2019-04-13': ['Metzora'],
    '2019-04-20': ['Pesach I'],
    '2019-04-27': ['Pesach VIII'],
    '2019-05-04': ['Achrei Mot'],
    '2019-05-11': ['Kedoshim'],
    '2019-05-18': ['Emor'],
    '2019-05-25': ['Behar'],
    '2019-06-01': ['Bechukotai'],
    '2019-06-08': ['Bamidbar'],
    '2019-06-15': ['Nasso'],
    '2019-06-22': ['Beha\'alotcha'],
    '2019-06-29': ['Sh\'lach'],
    '2019-07-06': ['Korach'],
    '2019-07-13': ['Chukat'],
    '2019-07-20': ['Balak'],
    '2019-07-27': ['Pinchas'],
    '2019-08-03': ['Matot', 'Masei'],
    '2019-08-10': ['Devarim'],
    '2019-08-17': ['Vaetchanan'],
    '2019-08-24': ['Eikev'],
    '2019-08-31': ['Re\'eh'],
    '2019-09-07': ['Shoftim'],
    '2019-09-14': ['Ki Teitzei'],
    '2019-09-21': ['Ki Tavo'],
    '2019-09-28': ['Nitzavim'],
  };
  t.deepEqual(result, expected);
});

test('israel-5745', (t) => {
  const hyear = 5745;
  const sedra = new Sedra(hyear, true);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1) - 1;
  const result = {};
  for (let abs = startAbs; abs <= endAbs; abs++) {
    if (abs % 7 === 6) { // Saturday
      result[dt(new HDate(abs))] = sedra.get(abs);
    }
  }
  const expected = {
    '1984-09-29': ['Ha\'Azinu'],
    '1984-10-06': ['Yom Kippur'],
    '1984-10-13': ['Sukkot Shabbat Chol ha-Moed'],
    '1984-10-20': ['Bereshit'],
    '1984-10-27': ['Noach'],
    '1984-11-03': ['Lech-Lecha'],
    '1984-11-10': ['Vayera'],
    '1984-11-17': ['Chayei Sara'],
    '1984-11-24': ['Toldot'],
    '1984-12-01': ['Vayetzei'],
    '1984-12-08': ['Vayishlach'],
    '1984-12-15': ['Vayeshev'],
    '1984-12-22': ['Miketz'],
    '1984-12-29': ['Vayigash'],
    '1985-01-05': ['Vayechi'],
    '1985-01-12': ['Shemot'],
    '1985-01-19': ['Vaera'],
    '1985-01-26': ['Bo'],
    '1985-02-02': ['Beshalach'],
    '1985-02-09': ['Yitro'],
    '1985-02-16': ['Mishpatim'],
    '1985-02-23': ['Terumah'],
    '1985-03-02': ['Tetzaveh'],
    '1985-03-09': ['Ki Tisa'],
    '1985-03-16': ['Vayakhel', 'Pekudei'],
    '1985-03-23': ['Vayikra'],
    '1985-03-30': ['Tzav'],
    '1985-04-06': ['Pesach'],
    '1985-04-13': ['Shmini'],
    '1985-04-20': ['Tazria', 'Metzora'],
    '1985-04-27': ['Achrei Mot', 'Kedoshim'],
    '1985-05-04': ['Emor'],
    '1985-05-11': ['Behar'],
    '1985-05-18': ['Bechukotai'],
    '1985-05-25': ['Bamidbar'],
    '1985-06-01': ['Nasso'],
    '1985-06-08': ['Beha\'alotcha'],
    '1985-06-15': ['Sh\'lach'],
    '1985-06-22': ['Korach'],
    '1985-06-29': ['Chukat'],
    '1985-07-06': ['Balak'],
    '1985-07-13': ['Pinchas'],
    '1985-07-20': ['Matot', 'Masei'],
    '1985-07-27': ['Devarim'],
    '1985-08-03': ['Vaetchanan'],
    '1985-08-10': ['Eikev'],
    '1985-08-17': ['Re\'eh'],
    '1985-08-24': ['Shoftim'],
    '1985-08-31': ['Ki Teitzei'],
    '1985-09-07': ['Ki Tavo'],
    '1985-09-14': ['Nitzavim'],
  };
  t.deepEqual(result, expected);
});

test('israel-5779', (t) => {
  const hyear = 5779;
  const sedra = new Sedra(hyear, true);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1) - 1;
  const result = {};
  for (let abs = startAbs; abs <= endAbs; abs++) {
    if (abs % 7 === 6) { // Saturday
      result[dt(new HDate(abs))] = sedra.get(abs);
    }
  }
  const expected = {
    '2018-09-15': ['Vayeilech'],
    '2018-09-22': ['Ha\'Azinu'],
    '2018-09-29': ['Sukkot Shabbat Chol ha-Moed'],
    '2018-10-06': ['Bereshit'],
    '2018-10-13': ['Noach'],
    '2018-10-20': ['Lech-Lecha'],
    '2018-10-27': ['Vayera'],
    '2018-11-03': ['Chayei Sara'],
    '2018-11-10': ['Toldot'],
    '2018-11-17': ['Vayetzei'],
    '2018-11-24': ['Vayishlach'],
    '2018-12-01': ['Vayeshev'],
    '2018-12-08': ['Miketz'],
    '2018-12-15': ['Vayigash'],
    '2018-12-22': ['Vayechi'],
    '2018-12-29': ['Shemot'],
    '2019-01-05': ['Vaera'],
    '2019-01-12': ['Bo'],
    '2019-01-19': ['Beshalach'],
    '2019-01-26': ['Yitro'],
    '2019-02-02': ['Mishpatim'],
    '2019-02-09': ['Terumah'],
    '2019-02-16': ['Tetzaveh'],
    '2019-02-23': ['Ki Tisa'],
    '2019-03-02': ['Vayakhel'],
    '2019-03-09': ['Pekudei'],
    '2019-03-16': ['Vayikra'],
    '2019-03-23': ['Tzav'],
    '2019-03-30': ['Shmini'],
    '2019-04-06': ['Tazria'],
    '2019-04-13': ['Metzora'],
    '2019-04-20': ['Pesach'],
    '2019-04-27': ['Achrei Mot'],
    '2019-05-04': ['Kedoshim'],
    '2019-05-11': ['Emor'],
    '2019-05-18': ['Behar'],
    '2019-05-25': ['Bechukotai'],
    '2019-06-01': ['Bamidbar'],
    '2019-06-08': ['Nasso'],
    '2019-06-15': ['Beha\'alotcha'],
    '2019-06-22': ['Sh\'lach'],
    '2019-06-29': ['Korach'],
    '2019-07-06': ['Chukat'],
    '2019-07-13': ['Balak'],
    '2019-07-20': ['Pinchas'],
    '2019-07-27': ['Matot'],
    '2019-08-03': ['Masei'],
    '2019-08-10': ['Devarim'],
    '2019-08-17': ['Vaetchanan'],
    '2019-08-24': ['Eikev'],
    '2019-08-31': ['Re\'eh'],
    '2019-09-07': ['Shoftim'],
    '2019-09-14': ['Ki Teitzei'],
    '2019-09-21': ['Ki Tavo'],
    '2019-09-28': ['Nitzavim'],
  };
  t.deepEqual(result, expected);
});

test('diaspora-bce', (t) => {
  const hyear = 3333;
  const sedra = new Sedra(hyear, false);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1) - 1;
  const result = {};
  for (let abs = startAbs; abs <= endAbs; abs++) {
    if (Math.abs(abs % 7) === 6) { // Saturday
      result[dt(new HDate(abs))] = sedra.get(abs);
    }
  }
  const expected = {
    '-000428-09-04': ['Vayeilech'],
    '-000428-09-11': ['Ha\'Azinu'],
    '-000428-09-18': ['Sukkot Shabbat Chol ha-Moed'],
    '-000428-09-25': ['Bereshit'],
    '-000428-10-02': ['Noach'],
    '-000428-10-09': ['Lech-Lecha'],
    '-000428-10-16': ['Vayera'],
    '-000428-10-23': ['Chayei Sara'],
    '-000428-10-30': ['Toldot'],
    '-000428-11-06': ['Vayetzei'],
    '-000428-11-13': ['Vayishlach'],
    '-000428-11-20': ['Vayeshev'],
    '-000428-11-27': ['Miketz'],
    '-000428-12-04': ['Vayigash'],
    '-000428-12-11': ['Vayechi'],
    '-000428-12-18': ['Shemot'],
    '-000428-12-25': ['Vaera'],
    '-000427-01-01': ['Bo'],
    '-000427-01-08': ['Beshalach'],
    '-000427-01-15': ['Yitro'],
    '-000427-01-22': ['Mishpatim'],
    '-000427-01-29': ['Terumah'],
    '-000427-02-05': ['Tetzaveh'],
    '-000427-02-12': ['Ki Tisa'],
    '-000427-02-19': ['Vayakhel'],
    '-000427-02-26': ['Pekudei'],
    '-000427-03-05': ['Vayikra'],
    '-000427-03-12': ['Tzav'],
    '-000427-03-19': ['Shmini'],
    '-000427-03-26': ['Tazria'],
    '-000427-04-02': ['Metzora'],
    '-000427-04-09': ['Pesach I'],
    '-000427-04-16': ['Pesach VIII'],
    '-000427-04-23': ['Achrei Mot'],
    '-000427-04-30': ['Kedoshim'],
    '-000427-05-07': ['Emor'],
    '-000427-05-14': ['Behar'],
    '-000427-05-21': ['Bechukotai'],
    '-000427-05-28': ['Bamidbar'],
    '-000427-06-04': ['Nasso'],
    '-000427-06-11': ['Beha\'alotcha'],
    '-000427-06-18': ['Sh\'lach'],
    '-000427-06-25': ['Korach'],
    '-000427-07-02': ['Chukat'],
    '-000427-07-09': ['Balak'],
    '-000427-07-16': ['Pinchas'],
    '-000427-07-23': ['Matot', 'Masei'],
    '-000427-07-30': ['Devarim'],
    '-000427-08-06': ['Vaetchanan'],
    '-000427-08-13': ['Eikev'],
    '-000427-08-20': ['Re\'eh'],
    '-000427-08-27': ['Shoftim'],
    '-000427-09-03': ['Ki Teitzei'],
    '-000427-09-10': ['Ki Tavo'],
    '-000427-09-17': ['Nitzavim'],
  };
  t.deepEqual(result, expected);
});

test('israel-bce', (t) => {
  const hyear = 3333;
  const sedra = new Sedra(hyear, true);
  const startAbs = HDate.hebrew2abs(hyear, months.TISHREI, 1);
  const endAbs = HDate.hebrew2abs(hyear + 1, months.TISHREI, 1) - 1;
  const result = {};
  for (let abs = startAbs; abs <= endAbs; abs++) {
    if (Math.abs(abs % 7) === 6) { // Saturday
      result[dt(new HDate(abs))] = sedra.get(abs);
    }
  }
  const expected = {
    '-000428-09-04': ['Vayeilech'],
    '-000428-09-11': ['Ha\'Azinu'],
    '-000428-09-18': ['Sukkot Shabbat Chol ha-Moed'],
    '-000428-09-25': ['Bereshit'],
    '-000428-10-02': ['Noach'],
    '-000428-10-09': ['Lech-Lecha'],
    '-000428-10-16': ['Vayera'],
    '-000428-10-23': ['Chayei Sara'],
    '-000428-10-30': ['Toldot'],
    '-000428-11-06': ['Vayetzei'],
    '-000428-11-13': ['Vayishlach'],
    '-000428-11-20': ['Vayeshev'],
    '-000428-11-27': ['Miketz'],
    '-000428-12-04': ['Vayigash'],
    '-000428-12-11': ['Vayechi'],
    '-000428-12-18': ['Shemot'],
    '-000428-12-25': ['Vaera'],
    '-000427-01-01': ['Bo'],
    '-000427-01-08': ['Beshalach'],
    '-000427-01-15': ['Yitro'],
    '-000427-01-22': ['Mishpatim'],
    '-000427-01-29': ['Terumah'],
    '-000427-02-05': ['Tetzaveh'],
    '-000427-02-12': ['Ki Tisa'],
    '-000427-02-19': ['Vayakhel'],
    '-000427-02-26': ['Pekudei'],
    '-000427-03-05': ['Vayikra'],
    '-000427-03-12': ['Tzav'],
    '-000427-03-19': ['Shmini'],
    '-000427-03-26': ['Tazria'],
    '-000427-04-02': ['Metzora'],
    '-000427-04-09': ['Pesach'],
    '-000427-04-16': ['Achrei Mot'],
    '-000427-04-23': ['Kedoshim'],
    '-000427-04-30': ['Emor'],
    '-000427-05-07': ['Behar'],
    '-000427-05-14': ['Bechukotai'],
    '-000427-05-21': ['Bamidbar'],
    '-000427-05-28': ['Nasso'],
    '-000427-06-04': ['Beha\'alotcha'],
    '-000427-06-11': ['Sh\'lach'],
    '-000427-06-18': ['Korach'],
    '-000427-06-25': ['Chukat'],
    '-000427-07-02': ['Balak'],
    '-000427-07-09': ['Pinchas'],
    '-000427-07-16': ['Matot'],
    '-000427-07-23': ['Masei'],
    '-000427-07-30': ['Devarim'],
    '-000427-08-06': ['Vaetchanan'],
    '-000427-08-13': ['Eikev'],
    '-000427-08-20': ['Re\'eh'],
    '-000427-08-27': ['Shoftim'],
    '-000427-09-03': ['Ki Teitzei'],
    '-000427-09-10': ['Ki Tavo'],
    '-000427-09-17': ['Nitzavim'],
  };
  t.deepEqual(result, expected);
});
