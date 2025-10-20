import {expect, test} from 'vitest';
import {Locale} from '../src/locale';

test('gettext-ashkenazi', () => {
  expect(Locale.gettext('Parashat', 'ashkenazi')).toBe('Parshas');
  expect(Locale.gettext('Bereshit', 'ashkenazi')).toBe('Bereshis');
  expect(Locale.gettext('Sukkot', 'ashkenazi')).toBe('Sukkos');
});

test('gettext-he', () => {
  expect(Locale.gettext('Yom Kippur', 'he')).toBe('יוֹם כִּפּוּר');
  expect(Locale.gettext('Lech-Lecha', 'he')).toBe('לֶךְ־לְךָ');
});

test('lookupTranslation-he-x-NoNikud', () => {
  expect(Locale.lookupTranslation('Yom Kippur', 'he-x-NoNikud')).toBe(
    'יום כפור'
  );
  expect(Locale.lookupTranslation('Lech-Lecha', 'he-x-NoNikud')).toBe('לך־לך');
  expect(Locale.lookupTranslation('Foobar', 'he-x-NoNikud')).toBe(undefined);
});

test('Korach', () => {
  expect(Locale.lookupTranslation('Korach', 'he')).toBe('קֹרַח');
  expect(Locale.lookupTranslation('Korach', 'he-x-NoNikud')).toBe('קורח');
});

test('gettext-ashkenazi', () => {
  expect(Locale.gettext('Sukkot', 'a')).toBe('Sukkos');
  expect(Locale.gettext("Asara B'Tevet", 'a')).toBe('Asara B’Teves');
  expect(Locale.gettext('Tevet', 'a')).toBe('Teves');
  expect(Locale.gettext('Tevet', 'ashkenazi')).toBe('Teves');
});
