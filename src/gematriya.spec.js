import test from 'ava';
import {gematriya} from './gematriya';

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
  t.is(gematriya(5749), 'תשמ״ט');
  t.is(gematriya(3761), 'ג׳תשס״א');
  t.is(gematriya(6749), 'ו׳תשמ״ט');
  t.is(gematriya(8765), 'ח׳תשס״ה');
  t.is(gematriya(22700), 'כב׳ת״ש');
  t.is(gematriya(16123), 'טז׳קכ״ג');
  t.is(gematriya(1123), 'א׳קכ״ג');
});
