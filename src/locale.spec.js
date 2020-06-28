import test from 'ava';
import {locale} from './locale';

test('gettext-he', (t) => {
  t.is(locale.gettext('Yom Kippur', 'he'), 'יוֹם כִּפּוּר');
  t.is(locale.gettext('Lech-Lecha', 'he'), 'לֶךְ־לְךָ');
});

test('hebrewStripNikkud', (t) => {
  const strs = [
    ['יוֹם כִּפּוּר',
      'יום כפור'],
    ['לֶךְ־לְךָ',
      'לך־לך'],
  ];
  for (const [original, expected] of strs) {
    t.is(locale.hebrewStripNikkud(original), expected);
  }
});

test('useLocale-ordinal', (t) => {
  t.is(locale.ordinal(3), '3rd');
  const expected = {
    a: '3rd',
    ashkenazi: '3rd',
    en: '3rd',
    he: '3.',
    h: '3.',
  };
  for (const [loc, str] of Object.entries(expected)) {
    locale.useLocale(loc);
    t.is(locale.ordinal(3), str, loc);
  }
  locale.useLocale('');
  t.is(locale.ordinal(3), '3rd');
});
