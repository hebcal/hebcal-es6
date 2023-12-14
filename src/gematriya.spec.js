import test from 'ava';
import {gematriya, gematriyaStrToNum} from './gematriya.js';

test('gematriya', (t) => {
  t.is(gematriya(5749), 'תשמ״ט');
  t.is(gematriya(5774), 'תשע״ד');
  t.is(gematriya(5780), 'תש״פ');
  t.is(gematriya(3), 'ג׳');
  t.is(gematriya(14), 'י״ד');
  t.is(gematriya(15), 'ט״ו');
  t.is(gematriya(16), 'ט״ז');
  t.is(gematriya(17), 'י״ז');
  t.is(gematriya(20), 'כ׳');
  t.is(gematriya(25), 'כ״ה');
  t.is(gematriya(60), 'ס׳');
  t.is(gematriya(123), 'קכ״ג');
  t.is(gematriya(613), 'תרי״ג');
  t.is(gematriya(3761), 'ג׳תשס״א');
  t.is(gematriya(6749), 'ו׳תשמ״ט');
  t.is(gematriya(8765), 'ח׳תשס״ה');
  t.is(gematriya(22700), 'כב׳ת״ש');
  t.is(gematriya(16123), 'טז׳קכ״ג');
  t.is(gematriya(1123), 'א׳קכ״ג');
  t.is(gematriya(6000), 'ו׳');
  t.is(gematriya(7007), 'ז׳ז׳');
});

test('gematriyaStrToNum', (t) => {
  t.is(gematriyaStrToNum('תשמ״ט'), 749);
  t.is(gematriyaStrToNum('תשע״ד'), 774);
  t.is(gematriyaStrToNum('תש״פ'), 780);
  t.is(gematriyaStrToNum('ג׳'), 3);
  t.is(gematriyaStrToNum('י״ד'), 14);
  t.is(gematriyaStrToNum('ט״ו'), 15);
  t.is(gematriyaStrToNum('ט״ז'), 16);
  t.is(gematriyaStrToNum('י״ז'), 17);
  t.is(gematriyaStrToNum('כ׳'), 20);
  t.is(gematriyaStrToNum('כ״ה'), 25);
  t.is(gematriyaStrToNum('ס׳'), 60);
  t.is(gematriyaStrToNum('קכ״ג'), 123);
  t.is(gematriyaStrToNum('תרי״ג'), 613);
});

test('gematriyaStrToNum-thousands', (t) => {
  t.is(gematriyaStrToNum('ג׳תשס״א'), 3761);
  t.is(gematriyaStrToNum('ו׳תשמ״ט'), 6749);
  t.is(gematriyaStrToNum('ח׳תשס״ה'), 8765);
  t.is(gematriyaStrToNum('כב׳ת״ש'), 22700);
  t.is(gematriyaStrToNum('טז׳קכ״ג'), 16123);
  t.is(gematriyaStrToNum('א׳קכ״ג'), 1123);
  t.is(gematriyaStrToNum('ז׳ז׳'), 7007);
});
