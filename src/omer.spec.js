import test from 'ava';
import {OmerEvent} from './omer.js';
import {HDate} from './hdate.js';
import './locale-he.js';

test('render', (t) => {
  const o1 = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  t.is(o1.render('en'), '1st day of the Omer');
  t.is(o1.getDesc(), 'Omer 1');
  t.is(o1.renderBrief('en'), 'Omer day 1');
  t.is(o1.render('he'), 'א׳ בָּעוֹמֶר');
  t.is(o1.renderBrief('he'), 'עוֹמֶר יוֹם 1');
  const o33 = new OmerEvent(new HDate(18, 'Iyyar', 5770), 33);
  t.is(o33.render('en'), '33rd day of the Omer');
  t.is(o33.getDesc(), 'Omer 33');
  t.is(o33.renderBrief('en'), 'Omer day 33');
  t.is(o33.render('he'), 'ל״ג בָּעוֹמֶר');
  t.is(o33.renderBrief('he'), 'עוֹמֶר יוֹם 33');
  const o42 = new OmerEvent(new HDate(27, 'Iyyar', 5770), 42);
  t.is(o42.render('en'), '42nd day of the Omer');
  t.is(o42.getDesc(), 'Omer 42');
  t.is(o42.renderBrief('en'), 'Omer day 42');
  t.is(o42.render('he'), 'מ״ב בָּעוֹמֶר');
  t.is(o42.renderBrief('he'), 'עוֹמֶר יוֹם 42');
  t.is(o42.render('es'), '42º day of the Omer');
  t.is(o42.render('de'), '42. day of the Omer');
  t.is(o42.render('fr'), '42. day of the Omer');
});

test('sefira', (t) => {
  const omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.sefira('en'), 'Eternity within Majesty');
  t.is(omer.sefira('he'), 'נֶּֽצַח שֶׁבְּמַּלְכוּת');
  t.is(omer.sefira('translit'), 'Netzach sheb\'Malkhut');
  t.is(omer.sefira('bogus'), 'Eternity within Majesty');
  t.is(omer.sefira(), 'Eternity within Majesty');
});

test('getTodayIs-en', (t) => {
  let omer = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  t.is(omer.getTodayIs('en'), 'Today is 1 day of the Omer');

  omer = new OmerEvent(new HDate(17, 'Nisan', 5770), 2);
  t.is(omer.getTodayIs('en'), 'Today is 2 days of the Omer');

  omer = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  t.is(omer.getTodayIs('en'), 'Today is 7 days, which is 1 week of the Omer');

  omer = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  t.is(omer.getTodayIs('en'), 'Today is 8 days, which is 1 week and 1 day of the Omer');

  omer = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  t.is(omer.getTodayIs('en'), 'Today is 13 days, which is 1 week and 6 days of the Omer');

  omer = new OmerEvent(new HDate(29, 'Nisan', 5770), 14);
  t.is(omer.getTodayIs('en'), 'Today is 14 days, which is 2 weeks of the Omer');

  omer = new OmerEvent(new HDate(26, 'Iyyar', 5770), 41);
  t.is(omer.getTodayIs('en'), 'Today is 41 days, which is 5 weeks and 6 days of the Omer');

  omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.getTodayIs('en'), 'Today is 46 days, which is 6 weeks and 4 days of the Omer');
});

test('days-weeks', (t) => {
  let ev = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(ev.omer, 46);
  t.is(ev.getWeeks(), 6);
  t.is(ev.getDaysWithinWeeks(), 4);

  ev = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  t.is(ev.omer, 7);
  t.is(ev.getWeeks(), 1);
  t.is(ev.getDaysWithinWeeks(), 7);

  ev = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  t.is(ev.omer, 8);
  t.is(ev.getWeeks(), 1);
  t.is(ev.getDaysWithinWeeks(), 1);
});

test('emoji', (t) => {
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  const actual = [];
  for (let i = 1; i <= 49; i++) {
    const ev = new OmerEvent(new HDate(startAbs + i - 1), i);
    actual.push(ev.getEmoji());
  }
  const expected = [
    '①', '②', '③', '④', '⑤', '⑥', '⑦',
    '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭',
    '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑',
    '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘',
    '㉙', '㉚', '㉛', '㉜', '㉝', '㉞', '㉟',
    '㊱', '㊲', '㊳', '㊴', '㊵', '㊶', '㊷',
    '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾',
  ];
  t.deepEqual(actual, expected);
});

test('emoji-blank', (t) => {
  const ev = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  ev.emoji = '';
  t.is(ev.getEmoji(), '');
});

test('throws-invalid-day', (t) => {
  const error = t.throws(() => {
    console.log(new OmerEvent(new HDate(15, 'Cheshvan', 5770), 123));
  }, {instanceOf: RangeError});
  t.is(error.message, 'Invalid Omer day 123');
});

test('url', (t) => {
  const omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  t.is(omer.url(), 'https://www.hebcal.com/omer/5770/46');
});

test('getTodayIs-he', (t) => {
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  const actual = [];
  for (let i = 1; i <= 49; i++) {
    const ev = new OmerEvent(new HDate(startAbs + i - 1), i);
    actual.push(ev.getTodayIs('he'));
  }
  const expected = [
    'הַיּוֹם יוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה יָמִים, שְׁהֵם שָׁבֽוּעַ אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה יָמִים, שְׁהֵם שָׁבֽוּעַ אֶחָד וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה יָמִים, שְׁהֵם שָׁבֽוּעַ אֶחָד וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם עֲשָׂרָה יָמִים, שְׁהֵם שָׁבֽוּעַ אֶחָד וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַחַד עָשָׂר יוֹם, שְׁהֵם שָׁבֽוּעַ אֶחָד וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁנֵים עָשָׂר יוֹם, שְׁהֵם שָׁבֽוּעַ אֶחָד וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה עָשָׂר יוֹם, שְׁהֵם שָׁבֽוּעַ אֶחָד וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם עֶשְׂרִים יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אֶחָד וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם שְׁנַיִם וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה וְעֶשְׂרִים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה וְעֶשְׂרִים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אֶחָד וּשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁנַיִם וּשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה וּשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעִים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אֶחָד וְאַרְבָּעִים יוֹם, שְׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁנַיִם וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁבְעָה שָׁבוּעוֹת לָעֽוֹמֶר',
  ];
  t.deepEqual(actual, expected);
});

test('getTodayIs-he-x-NoNikud', (t) => {
  const start = new HDate(16, 'Nisan', 5782);
  const ev = new OmerEvent(start, 1);
  const expected = 'היום יום אחד לעומר';
  t.is(ev.getTodayIs('he-x-NoNikud'), expected);
});
