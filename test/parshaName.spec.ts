import {expect, test} from 'vitest';
import '../src/locale';
import {renderParshaName} from '../src/parshaName';

test('en', () => {
  expect(renderParshaName(['Bereshit'], 'en')).toBe('Parashat Bereshit');
  expect(renderParshaName(['Lech-Lecha'], 'en')).toBe('Parashat Lech-Lecha');
  expect(renderParshaName(['Vayakhel', 'Pekudei'], 'en')).toBe('Parashat Vayakhel-Pekudei');
  expect(renderParshaName(['Ha\'azinu'], 'en')).toBe('Parashat Ha’azinu');
});

test('ashkenazi', () => {
  expect(renderParshaName(['Bereshit'], 'ashkenazi')).toBe('Parshas Bereshis');
  expect(renderParshaName(['Lech-Lecha'], 'ashkenazi')).toBe('Parshas Lech-Lecha');
  expect(renderParshaName(['Vayakhel', 'Pekudei'], 'ashkenazi')).toBe('Parshas Vayakhel-Pekudei');
  expect(renderParshaName(['Ha\'azinu'], 'ashkenazi')).toBe('Parshas Ha’azinu');
});

test('he', () => {
  expect(renderParshaName(['Bereshit'], 'he')).toBe('פָּרָשַׁת בְּרֵאשִׁית');
  expect(renderParshaName(['Lech-Lecha'], 'he')).toBe('פָּרָשַׁת לֶךְ־לְךָ');
  expect(renderParshaName(['Vayakhel', 'Pekudei'], 'he')).toBe('פָּרָשַׁת וַיַּקְהֵל־פְקוּדֵי');
  expect(renderParshaName(['Ha\'azinu'], 'he')).toBe('פָּרָשַׁת הַאֲזִינוּ');
});

test('he-x-NoNikud', () => {
  expect(renderParshaName(['Bereshit'], 'he-x-NoNikud')).toBe('פרשת בראשית');
  expect(renderParshaName(['Lech-Lecha'], 'he-x-NoNikud')).toBe('פרשת לך־לך');
  expect(renderParshaName(['Vayakhel', 'Pekudei'], 'he-x-NoNikud')).toBe('פרשת ויקהל-פקודי');
});

test('Achrei Mot-Kedoshim', () => {
  const parsha = ['Achrei Mot', 'Kedoshim'];
  expect(renderParshaName(parsha, 'he')).toBe('פָּרָשַׁת אַחֲרֵי מוֹת־קְדֹשִׁים');
  expect(renderParshaName(parsha, 'en')).toBe('Parashat Achrei Mot-Kedoshim');
  expect(renderParshaName(parsha, 'ashkenazi')).toBe('Parshas Achrei Mos-Kedoshim');
});
