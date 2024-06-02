import {Locale} from '@hebcal/hdate';
import '../src/locale';

test('getLocaleNames', () => {
  const expected = ['', 'a', 'ashkenazi', 'en', 'h', 'he', 'he-x-nonikud', 's'];
  const actual = Locale.getLocaleNames();
  expect(actual).toEqual(expected);
});

test('gettext-he', () => {
  expect(Locale.gettext('Yom Kippur', 'he')).toBe('יוֹם כִּפּוּר');
  expect(Locale.gettext('Lech-Lecha', 'he')).toBe('לֶךְ־לְךָ');
});

test('hebrewStripNikkud', () => {
  const strs = [
    ['יוֹם כִּפּוּר',
      'יום כפור'],
    ['לֶךְ־לְךָ',
      'לך־לך'],
  ];
  for (const [original, expected] of strs) {
    expect(Locale.hebrewStripNikkud(original)).toBe(expected);
  }
});

test('useLocale-ordinal', () => {
  Locale.useLocale('en');
  expect(Locale.ordinal(3)).toBe('3rd');
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
    expect(Locale.ordinal(3)).toBe(str);
  }
  Locale.useLocale('');
  expect(Locale.ordinal(3)).toBe('3rd');

  expect(Locale.ordinal(3, 'fr')).toBe('3.');
  expect(Locale.ordinal(3, 'es')).toBe('3º');
  expect(Locale.ordinal(3, 'he')).toBe('3');
});

test('lookupTranslation-he-x-NoNikud', () => {
  expect(Locale.lookupTranslation('Yom Kippur', 'he-x-NoNikud')).toBe('יום כפור');
  expect(Locale.lookupTranslation('Lech-Lecha', 'he-x-NoNikud')).toBe('לך־לך');
  expect(Locale.lookupTranslation('Foobar', 'he-x-NoNikud')).toBe(undefined);
});

test('gettext-ashkenazi', () => {
  expect(Locale.gettext('Sukkot', 'a')).toBe('Sukkos');
  expect(Locale.gettext('Asara B\'Tevet', 'a')).toBe('Asara B’Teves');
  expect(Locale.gettext('Tevet', 'a')).toBe('Teves');
  expect(Locale.gettext('Tevet', 'ashkenazi')).toBe('Teves');
});

test('getLocaleName', () => {
  Locale.useLocale('he');
  expect(Locale.getLocaleName()).toBe('he');
  Locale.useLocale('s');
  expect(Locale.getLocaleName()).toBe('en');
  Locale.useLocale('h');
  expect(Locale.getLocaleName()).toBe('he');
});

test('useLocale-throws', () => {
  expect(() => {
    Locale.useLocale('bogus');
  }).toThrow('Locale \'bogus\' not found');
});

test('addTranslation', () => {
  expect(Locale.lookupTranslation('Foobar', 'a')).toBe(undefined);
  Locale.addTranslation('a', 'Foobar', 'Quux');
  expect(Locale.lookupTranslation('Foobar', 'a')).toBe('Quux');

  expect(Locale.lookupTranslation('Baaz', 'a')).toBe(undefined);
  Locale.addTranslation('a', 'Baaz', ['Quux']);
  expect(Locale.lookupTranslation('Baaz', 'a')).toBe('Quux');
});

test('addTranslations', () => {
  expect(Locale.lookupTranslation('Hello world', 'a')).toBe(undefined);
  expect(Locale.lookupTranslation('Goodbye', 'a')).toBe(undefined);
  const localeData = {
    headers: {'plural-forms': 'nplurals=2; plural=(n!=1);'},
    contexts: {'': {
      'Hello': ['World'],
      'Hello world': ['Quux'],
      'Goodbye': ['World'],
    }},
  };
  Locale.addTranslations('a', localeData);
  expect(Locale.lookupTranslation('Hello world', 'a')).toBe('Quux');
  expect(Locale.lookupTranslation('Goodbye', 'a')).toBe('World');
});
