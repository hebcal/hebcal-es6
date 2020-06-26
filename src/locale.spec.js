import test from 'ava';
import {gettext, useLocale, hebrewStripNikkud, ordinal} from './locale';

test('gettext-he', (t) => {
  t.is(gettext('Yom Kippur', 'he'), 'יוֹם כִּפּוּר');
  t.is(gettext('Lech-Lecha', 'he'), 'לֶךְ־לְךָ');
});

test('hebrewStripNikkud', (t) => {
  const strs = [
    ['יוֹם כִּפּוּר',
      'יום כפור'],
    ['לֶךְ־לְךָ',
      'לך־לך'],
  ];
  for (const [original, expected] of strs) {
    t.is(hebrewStripNikkud(original), expected);
  }
});

test('useLocale-ordinal', (t) => {
  t.is(ordinal(3), '3rd');
  const expected = {
    a: '3rd',
    ashkenazi: '3rd',
    en: '3rd',
    he: '3.',
    h: '3.',
  };
  for (const [locale, str] of Object.entries(expected)) {
    useLocale(locale);
    t.is(ordinal(3), str, locale);
  }
  useLocale('');
  t.is(ordinal(3), '3rd');
});
