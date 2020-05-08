import test from 'ava';
import dafyomi from './dafyomi';

test('dafyomi', t => {
    const dt = new Date(1995, 11, 17);
    const dy = dafyomi.dafyomi(dt);
    t.is(dy.name, "Avodah Zarah");
    t.is(dy.blatt, 68);
    t.is(dafyomi.dafname(dy), "Avodah Zarah 68");
});
