import test from 'ava';
import {Locale} from './locale';
import './locale-ashkenazi';
import './locale-he';

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
