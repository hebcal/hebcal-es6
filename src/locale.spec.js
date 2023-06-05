import test from 'ava';
import {Locale} from './locale';
import './locale-ashkenazi';
import './locale-he';

test('getLocaleNames', (t) => {
  const expected = ['', 'a', 'ashkenazi', 'en', 'h', 'he', 'he-x-nonikud', 's'];
  const actual = Locale.getLocaleNames();
  t.deepEqual(actual, expected);
});

test('gettext-he', (t) => {
  t.is(Locale.gettext('Yom Kippur', 'he'), 'יוֹם כִּפּוּר');
  t.is(Locale.gettext('Lech-Lecha', 'he'), 'לֶךְ־לְךָ');
});

test('hebrewStripNikkud', (t) => {
  const strs = [
    ['יוֹם כִּפּוּר',
      'יום כפור'],
    ['לֶךְ־לְךָ',
      'לך־לך'],
  ];
  for (const [original, expected] of strs) {
    t.is(Locale.hebrewStripNikkud(original), expected);
  }
});

test('useLocale-ordinal', (t) => {
  Locale.useLocale('en');
  t.is(Locale.ordinal(3), '3rd');
  const expected = {
    a: '3rd',
    s: '3rd',
    ashkenazi: '3rd',
    en: '3rd',
    he: '3',
    h: '3',
  };
  for (const [loc, str] of Object.entries(expected)) {
    Locale.useLocale(loc);
    t.is(Locale.ordinal(3), str, loc);
  }
  Locale.useLocale('');
  t.is(Locale.ordinal(3), '3rd');

  t.is(Locale.ordinal(3, 'fr'), '3.');
  t.is(Locale.ordinal(3, 'es'), '3º');
  t.is(Locale.ordinal(3, 'he'), '3');
});

test('lookupTranslation-he-x-NoNikud', (t) => {
  t.is(Locale.lookupTranslation('Yom Kippur', 'he-x-NoNikud'), 'יום כפור');
  t.is(Locale.lookupTranslation('Lech-Lecha', 'he-x-NoNikud'), 'לך־לך');
  t.is(Locale.lookupTranslation('Foobar', 'he-x-NoNikud'), undefined);
});

test('gettext-ashkenazi', (t) => {
  t.is(Locale.gettext('Sukkot', 'a'), 'Sukkos');
  t.is(Locale.gettext('Asara B\'Tevet', 'a'), 'Asara B\'Teves');
  t.is(Locale.gettext('Tevet', 'a'), 'Teves');
  t.is(Locale.gettext('Tevet', 'ashkenazi'), 'Teves');
});

test('getLocaleName', (t) => {
  Locale.useLocale('he');
  t.is(Locale.getLocaleName(), 'he');
  Locale.useLocale('s');
  t.is(Locale.getLocaleName(), 'en');
  Locale.useLocale('h');
  t.is(Locale.getLocaleName(), 'he');
});

test('useLocale-throws', (t) => {
  const error = t.throws(() => {
    Locale.useLocale('bogus');
  }, {instanceOf: RangeError});
  t.is(error.message, 'Locale \'bogus\' not found');
});

test('addTranslation', (t) => {
  t.is(Locale.lookupTranslation('Foobar', 'a'), undefined);
  Locale.addTranslation('a', 'Foobar', 'Quux');
  t.is(Locale.lookupTranslation('Foobar', 'a'), 'Quux');

  t.is(Locale.lookupTranslation('Baaz', 'a'), undefined);
  Locale.addTranslation('a', 'Baaz', ['Quux']);
  t.is(Locale.lookupTranslation('Baaz', 'a'), 'Quux');
});
