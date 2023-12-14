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
    'הַיוֹם יוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם שְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם אַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם חֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁבְעָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד לָעוֹמֶר',
    'הַיוֹם שְׁמוֹנָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד וְיוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם תִּשְׁעָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד וְשְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם עֲשָׂרָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם אֶחָד עָשָׂר יוֹם, שְׁהֵם שָׁבוּעַ אֶחָד וְאַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁנַיִם עָשָׂר יוֹם, שְׁהֵם שָׁבוּעַ אֶחָד וְחֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁלוֹשָׁה עָשָׂר יוֹם, שְׁהֵם שָׁבוּעַ אֶחָד וְשִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם אַרְבָּעָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת לָעוֹמֶר',
    'הַיוֹם חֲמִשָׁה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְיוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם שִׁשָׁה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְשְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁבְעָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁמוֹנָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם תִּשְׁעָה עָשָׂר יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְחֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם עֶשְׂרִים יוֹם, שְׁהֵם שְׁנֵי שָׁבוּעוֹת וְשִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם אֶחָד וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת לָעוֹמֶר',
    'הַיוֹם שְׁנַיִם וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם שְׁלוֹשָׁה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְשְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם אַרְבָּעָה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם חֲמִשָׁה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁשָׁה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְחֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁבְעָה וְעֶשְׂרִים יוֹם, שְׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְשִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁמוֹנָה וְעֶשְׂרִים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת לָעוֹמֶר',
    'הַיוֹם תִּשְׁעָה וְעֶשְׂרִים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם שְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם אֶחָד וְשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁנַיִם וְשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁלוֹשָׁה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְחֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם אַרְבָּעָה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם חֲמִשָׁה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת לָעוֹמֶר',
    'הַיוֹם שִׁשָׁה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם שִׁבְעָה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת וְשְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁמוֹנָה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם תִּשְׁעָה וְשְׁלוֹשִׁים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם אַרְבָּעִים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת וְחֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם אֶחָד וְאַרְבָּעִים יוֹם, שְׁהֵם חֲמִשָׁה שָׁבוּעוֹת וְשִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁנַיִם וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת לָעוֹמֶר',
    'הַיוֹם שְׁלוֹשָׁה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעוֹמֶר',
    'הַיוֹם אַרְבָּעָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת וְשְׁנֵי יָמִים לָעוֹמֶר',
    'הַיוֹם חֲמִשָׁה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁשָׁה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעוֹמֶר',
    'הַיוֹם שִׁבְעָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת וְחֲמִשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם שְׁמוֹנָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁשָׁה שָׁבוּעוֹת וְשִׁשָׁה יָמִים לָעוֹמֶר',
    'הַיוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם, שְׁהֵם שִׁבְעָה שָׁבוּעוֹת לָעוֹמֶר',
  ];
  t.deepEqual(actual, expected);
});

test('getTodayIs-he-x-NoNikud', (t) => {
  const start = new HDate(16, 'Nisan', 5782);
  const ev = new OmerEvent(start, 1);
  const expected = 'היום יום אחד לעומר';
  t.is(ev.getTodayIs('he-x-NoNikud'), expected);
});
