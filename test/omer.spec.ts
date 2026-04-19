import {expect, test} from 'vitest';
import {OmerEvent, OmerLang} from '../src/omer';
import {HDate} from '@hebcal/hdate';

test('render', () => {
  const o1 = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  expect(o1.render('en')).toBe('1st day of the Omer');
  expect(o1.getDesc()).toBe('Omer 1');
  expect(o1.renderBrief('en')).toBe('Omer day 1');
  expect(o1.render('he')).toBe('א׳ בָּעוֹמֶר');
  expect(o1.render('he-x-NoNikud')).toBe('א׳ בעומר');
  expect(o1.renderBrief('he')).toBe('עוֹמֶר יוֹם 1');
  const o33 = new OmerEvent(new HDate(18, 'Iyyar', 5770), 33);
  expect(o33.render('en')).toBe('33rd day of the Omer');
  expect(o33.getDesc()).toBe('Omer 33');
  expect(o33.renderBrief('en')).toBe('Omer day 33');
  expect(o33.render('he')).toBe('ל״ג בָּעוֹמֶר');
  expect(o33.render('he-x-NoNikud')).toBe('ל״ג בעומר');
  expect(o33.renderBrief('he')).toBe('עוֹמֶר יוֹם 33');
  const o42 = new OmerEvent(new HDate(27, 'Iyyar', 5770), 42);
  expect(o42.render('en')).toBe('42nd day of the Omer');
  expect(o42.getDesc()).toBe('Omer 42');
  expect(o42.renderBrief('en')).toBe('Omer day 42');
  expect(o42.render('he')).toBe('מ״ב בָּעוֹמֶר');
  expect(o42.render('he-x-NoNikud')).toBe('מ״ב בעומר');
  expect(o42.renderBrief('he')).toBe('עוֹמֶר יוֹם 42');
  expect(o42.render('es')).toBe('42º day of the Omer');
  expect(o42.render('de')).toBe('42. day of the Omer');
  expect(o42.render('fr')).toBe('42. day of the Omer');
});

test('sefira', () => {
  const omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  expect(omer.sefira('en')).toBe('Eternity within Majesty');
  expect(omer.sefira('he')).toBe('נֶּֽצַח שֶׁבְּמַלְכוּת');
  expect(omer.sefira('translit')).toBe('Netzach sheb\'Malkhut');
  expect(omer.sefira('bogus' as unknown as OmerLang)).toBe('Eternity within Majesty');
  expect(omer.sefira()).toBe('Eternity within Majesty');
});

test('sefira 2nd dagesh', () => {
  const omer = new OmerEvent(new HDate(3, 'Iyyar', 5785), 18);
  expect(omer.sefira('he')).toBe('נֶּֽצַח שֶׁבְּתִפְאֶֽרֶת');

  const omer2 = new OmerEvent(new HDate(7, 'Iyyar', 5785), 22);
  expect(omer2.sefira('he')).toBe('חֶֽסֶד שֶׁבְּנֶֽצַח');
});

test('sefira-all', () => {
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  const actual: string[] = [];
  for (let i = 1; i <= 49; i++) {
    const ev = new OmerEvent(new HDate(startAbs + i - 1), i);
    actual.push(ev.sefira('he'));
  }
  const expected = [
    'חֶֽסֶד שֶׁבְּחֶֽסֶד',     'גְּבוּרָה שֶׁבְּחֶֽסֶד',   'תִּפְאֶֽרֶת שֶׁבְּחֶֽסֶד',
    'נֶּֽצַח שֶׁבְּחֶֽסֶד',     'הוֹד שֶׁבְּחֶֽסֶד',     'יְּסוֹד שֶׁבְּחֶֽסֶד',
    'מַלְכוּת שֶׁבְּחֶֽסֶד',   'חֶֽסֶד שֶׁבִּגְבוּרָה',   'גְּבוּרָה שֶׁבִּגְבוּרָה',
    'תִּפְאֶֽרֶת שֶׁבִּגְבוּרָה', 'נֶּֽצַח שֶׁבִּגְבוּרָה',   'הוֹד שֶׁבִּגְבוּרָה',
    'יְּסוֹד שֶׁבִּגְבוּרָה',  'מַלְכוּת שֶׁבִּגְבוּרָה', 'חֶֽסֶד שֶׁבְּתִפְאֶֽרֶת',
    'גְּבוּרָה שֶׁבְּתִפְאֶֽרֶת', 'תִּפְאֶֽרֶת שֶׁבְּתִפְאֶֽרֶת', 'נֶּֽצַח שֶׁבְּתִפְאֶֽרֶת',
    'הוֹד שֶׁבְּתִפְאֶֽרֶת',   'יְּסוֹד שֶׁבְּתִפְאֶֽרֶת',  'מַלְכוּת שֶׁבְּתִפְאֶֽרֶת',
    'חֶֽסֶד שֶׁבְּנֶֽצַח',     'גְּבוּרָה שֶׁבְּנֶֽצַח',   'תִּפְאֶֽרֶת שֶׁבְּנֶֽצַח',
    'נֶּֽצַח שֶׁבְּנֶֽצַח',     'הוֹד שֶׁבְּנֶֽצַח',     'יְּסוֹד שֶׁבְּנֶֽצַח',
    'מַלְכוּת שֶׁבְּנֶֽצַח',   'חֶֽסֶד שֶׁבְּהוֹד',     'גְּבוּרָה שֶׁבְּהוֹד',
    'תִּפְאֶֽרֶת שֶׁבְּהוֹד',   'נֶּֽצַח שֶׁבְּהוֹד',     'הוֹד שֶׁבְּהוֹד',
    'יְּסוֹד שֶׁבְּהוֹד',    'מַלְכוּת שֶׁבְּהוֹד',   'חֶֽסֶד שֶׁבִּיְסוֹד',
    'גְּבוּרָה שֶׁבִּיְסוֹד',  'תִּפְאֶֽרֶת שֶׁבִּיְסוֹד',  'נֶּֽצַח שֶׁבִּיְסוֹד',
    'הוֹד שֶׁבִּיְסוֹד',    'יְּסוֹד שֶׁבִּיְסוֹד',   'מַלְכוּת שֶׁבִּיְסוֹד',
    'חֶֽסֶד שֶׁבְּמַלְכוּת',   'גְּבוּרָה שֶׁבְּמַלְכוּת', 'תִּפְאֶֽרֶת שֶׁבְּמַלְכוּת',
    'נֶּֽצַח שֶׁבְּמַלְכוּת',   'הוֹד שֶׁבְּמַלְכוּת',   'יְּסוֹד שֶׁבְּמַלְכוּת',
    'מַלְכוּת שֶׁבְּמַלְכוּת'
  ];
  expect(actual).toEqual(expected);
});

test('getTodayIs-en', () => {
  let omer = new OmerEvent(new HDate(16, 'Nisan', 5770), 1);
  expect(omer.getTodayIs('en')).toBe('Today is 1 day of the Omer');

  omer = new OmerEvent(new HDate(17, 'Nisan', 5770), 2);
  expect(omer.getTodayIs('en')).toBe('Today is 2 days of the Omer');

  omer = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  expect(omer.getTodayIs('en')).toBe('Today is 7 days, which are 1 week of the Omer');

  omer = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  expect(omer.getTodayIs('en')).toBe('Today is 8 days, which are 1 week and 1 day of the Omer');

  omer = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  expect(omer.getTodayIs('en')).toBe('Today is 13 days, which are 1 week and 6 days of the Omer');

  omer = new OmerEvent(new HDate(29, 'Nisan', 5770), 14);
  expect(omer.getTodayIs('en')).toBe('Today is 14 days, which are 2 weeks of the Omer');

  omer = new OmerEvent(new HDate(26, 'Iyyar', 5770), 41);
  expect(omer.getTodayIs('en')).toBe('Today is 41 days, which are 5 weeks and 6 days of the Omer');

  omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  expect(omer.getTodayIs('en')).toBe('Today is 46 days, which are 6 weeks and 4 days of the Omer');
});

test('days-weeks', () => {
  let ev = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  expect(ev.omer).toBe(46);
  expect(ev.getWeeks()).toBe(6);
  expect(ev.getDaysWithinWeeks()).toBe(4);

  ev = new OmerEvent(new HDate(22, 'Nisan', 5770), 7);
  expect(ev.omer).toBe(7);
  expect(ev.getWeeks()).toBe(1);
  expect(ev.getDaysWithinWeeks()).toBe(7);

  ev = new OmerEvent(new HDate(23, 'Nisan', 5770), 8);
  expect(ev.omer).toBe(8);
  expect(ev.getWeeks()).toBe(1);
  expect(ev.getDaysWithinWeeks()).toBe(1);
});

test('emoji', () => {
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  const actual: string[] = [];
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
  expect(actual).toEqual(expected);
});

test('emoji-blank', () => {
  const ev = new OmerEvent(new HDate(28, 'Nisan', 5770), 13);
  ev.emoji = '';
  expect(ev.getEmoji()).toBe('');
});

test('throws-invalid-day', () => {
  expect(() => {
    console.log(new OmerEvent(new HDate(15, 'Cheshvan', 5770), 123));
  }).toThrow('Invalid Omer day 123');
});

test('url', () => {
  const omer = new OmerEvent(new HDate(2, 'Sivan', 5770), 46);
  expect(omer.url()).toBe('https://www.hebcal.com/omer/5770/46');
});

test('distant-past-url', () => {
  const hd = new HDate(20, 'Iyyar', 4001);
  const ev = new OmerEvent(hd, 35);
  expect(ev.url()).toBe('https://www.hebcal.com/omer/4001/35');
  const hd2 = new HDate(20, 'Iyyar', 4000);
  const ev2 = new OmerEvent(hd2, 35);
  expect(ev2.url()).toBe(undefined);
  const hd3 = new HDate(20, 'Iyyar', 3860);
  const ev3 = new OmerEvent(hd3, 35);
  expect(ev3.url()).toBe(undefined);
  const hd4 = new HDate(20, 'Iyyar', 3333);
  const ev4 = new OmerEvent(hd4, 35);
  expect(ev4.url()).toBe(undefined);
});

test('far-future-url', () => {
  const hd = new HDate(20, 'Iyyar', 6759);
  const ev = new OmerEvent(hd, 35);
  expect(ev.url()).toBe('https://www.hebcal.com/omer/6759/35');
  const hd2 = new HDate(20, 'Iyyar', 6760);
  const ev2 = new OmerEvent(hd2, 35);
  expect(ev2.url()).toBe(undefined);
});

test('getTodayIs-he', () => {
  const expected = [
    '',
    'הַיּוֹם יוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה יָמִים, שֶׁהֵם שָׁבֽוּעַ אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה יָמִים, שֶׁהֵם שָׁבֽוּעַ אֶחָד וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה יָמִים, שֶׁהֵם שָׁבֽוּעַ אֶחָד וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם עֲשָׂרָה יָמִים, שֶׁהֵם שָׁבֽוּעַ אֶחָד וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַחַד עָשָׂר יוֹם, שֶׁהֵם שָׁבֽוּעַ אֶחָד וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁנֵים עָשָׂר יוֹם, שֶׁהֵם שָׁבֽוּעַ אֶחָד וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה עָשָׂר יוֹם, שֶׁהֵם שָׁבֽוּעַ אֶחָד וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה עָשָׂר יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה עָשָׂר יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה עָשָׂר יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה עָשָׂר יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה עָשָׂר יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה עָשָׂר יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם עֶשְׂרִים יוֹם, שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אֶחָד וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם שְׁנַיִם וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה וְעֶשְׂרִים יוֹם, שֶׁהֵם שְׁלוֹשָׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה וְעֶשְׂרִים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה וְעֶשְׂרִים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשִׁים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אֶחָד וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁנַיִם וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה וּשְׁלוֹשִׁים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעִים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם אֶחָד וְאַרְבָּעִים יוֹם, שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁנַיִם וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת לָעֽוֹמֶר',
    'הַיּוֹם שְׁלוֹשָׁה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֽוֹמֶר',
    'הַיּוֹם אַרְבָּעָה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֽוֹמֶר',
    'הַיּוֹם חֲמִשָּׁה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁלוֹשָׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁשָּׁה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שִׁבְעָה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם שְׁמוֹנָה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֽוֹמֶר',
    'הַיּוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם, שֶׁהֵם שִׁבְעָה שָׁבוּעוֹת לָעֽוֹמֶר',
  ];
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  for (let i = 1; i <= 49; i++) {
    const ev = new OmerEvent(new HDate(startAbs + i - 1), i);
    const str = ev.getTodayIs('he');
    expect(str).toBe(expected[i]);
  }
});

test('getTodayIs-he-x-NoNikud', () => {
  const start = new HDate(16, 'Nisan', 5782);
  const ev = new OmerEvent(start, 1);
  const expected = 'היום יום אחד לעומר';
  expect(ev.getTodayIs('he-x-NoNikud')).toBe(expected);
});

test('getLamnatzeachWord', () => {
  // day 1: first word of Psalm 67:2
  const ev1 = new OmerEvent(new HDate(16, 'Nisan', 5785), 1);
  expect(ev1.getLamnatzeachWord()).toBe('אֱלֹהִים');

  // day 7: last word of Psalm 67:2 (end of first verse)
  const ev7 = new OmerEvent(new HDate(22, 'Nisan', 5785), 7);
  expect(ev7.getLamnatzeachWord()).toBe('סֶלָה');

  // day 8: first word of Psalm 67:3 (start of second verse)
  const ev8 = new OmerEvent(new HDate(23, 'Nisan', 5785), 8);
  expect(ev8.getLamnatzeachWord()).toBe('לָדַעַת');

  // day 20: first word of Psalm 67:5 (longest verse, 11 words)
  const ev20 = new OmerEvent(new HDate(5, 'Iyyar', 5785), 20);
  expect(ev20.getLamnatzeachWord()).toBe('יִשְׂמְחוּ');

  // day 23: word split from maqef in Psalm 67:5
  const ev23 = new OmerEvent(new HDate(8, 'Iyyar', 5785), 23);
  expect(ev23.getLamnatzeachWord()).toBe('כִּי');

  // day 30: last word of Psalm 67:5
  const ev30 = new OmerEvent(new HDate(15, 'Iyyar', 5785), 30);
  expect(ev30.getLamnatzeachWord()).toBe('סֶלָה');

  // day 49: last word of Psalm 67:8 (last word of the psalm)
  const ev49 = new OmerEvent(new HDate(3, 'Sivan', 5785), 49);
  expect(ev49.getLamnatzeachWord()).toBe('אָרֶץ');
});

test('getLamnatzeachLetter', () => {
  // Each of the 49 letters of Psalm 67:5 corresponds to one Omer day
  const start = new HDate(16, 'Nisan', 5782);
  const startAbs = start.abs();
  const actual: string[] = [];
  for (let i = 1; i <= 49; i++) {
    const ev = new OmerEvent(new HDate(startAbs + i - 1), i);
    actual.push(ev.getLamnatzeachLetter());
  }
  const expected = [
    'י', 'ש', 'מ', 'ח', 'ו', 'ו', 'י',
    'ר', 'נ', 'נ', 'ו', 'ל', 'א', 'מ',
    'י', 'ם', 'כ', 'י', 'ת', 'ש', 'פ',
    'ו', 'ט', 'ע', 'מ', 'י', 'ם', 'מ',
    'י', 'ש', 'ו', 'ר', 'ו', 'ל', 'א',
    'מ', 'י', 'ם', 'ב', 'א', 'ר', 'ץ',
    'ת', 'נ', 'ח', 'ם', 'ס', 'ל', 'ה',
  ];
  expect(actual).toEqual(expected);
});

test('getAnaBekoachWord', () => {
  // first two words of the prayer
  const ev1 = new OmerEvent(new HDate(16, 'Nisan', 5785), 1);
  expect(ev1.getAnaBekoachWord()).toBe('אָנָּא');

  const ev2 = new OmerEvent(new HDate(17, 'Nisan', 5785), 2);
  expect(ev2.getAnaBekoachWord()).toBe('בְּכֹחַ');

  // day 7: acrostic abbreviation for verse 1
  const ev7 = new OmerEvent(new HDate(22, 'Nisan', 5785), 7);
  expect(ev7.getAnaBekoachWord()).toBe('אב״ג ית״ץ');

  // day 14: acrostic abbreviation for verse 2
  const ev14 = new OmerEvent(new HDate(29, 'Nisan', 5785), 14);
  expect(ev14.getAnaBekoachWord()).toBe('קר״ע שט״ן');

  // day 21: acrostic abbreviation for verse 3
  const ev21 = new OmerEvent(new HDate(6, 'Iyyar', 5785), 21);
  expect(ev21.getAnaBekoachWord()).toBe('נג״ד יכ״ש');

  // day 28: acrostic abbreviation for verse 4
  const ev28 = new OmerEvent(new HDate(13, 'Iyyar', 5785), 28);
  expect(ev28.getAnaBekoachWord()).toBe('בט״ר צת״ג');

  // day 35: acrostic abbreviation for verse 5
  const ev35 = new OmerEvent(new HDate(20, 'Iyyar', 5785), 35);
  expect(ev35.getAnaBekoachWord()).toBe('חק״ב תנ״ע');

  // day 42: acrostic abbreviation for verse 6
  const ev42 = new OmerEvent(new HDate(27, 'Iyyar', 5785), 42);
  expect(ev42.getAnaBekoachWord()).toBe('יג״ל פז״ק');

  // day 49: acrostic abbreviation for verse 7 (last day of the Omer)
  const ev49 = new OmerEvent(new HDate(3, 'Sivan', 5785), 49);
  expect(ev49.getAnaBekoachWord()).toBe('שק״ו צי״ת');
});
