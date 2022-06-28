import test from 'ava';
import {HDate} from './hdate';
import {tachanun} from './tachanun';

test.skip('tachanun', (t) => {
  tachanun(new HDate(), false);
  t.fail('message');
});
