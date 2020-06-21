import test from 'ava';
import {gettext, hebrewStripNikkud} from './locale';

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
