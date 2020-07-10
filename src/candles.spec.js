import test from 'ava';
import {Location} from './location';
import {makeCandleEvent} from './candles';
import {HDate} from './hdate';

test('makeCandleEvent-nosunset', (t) => {
  const location = Location.lookup('Helsinki');

  const timeFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: location.tzid,
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });

  const expected = [
    [new Date(2020, 4, 15), 'Candle lighting', '22:12'],
    [new Date(2020, 4, 16), 'Havdalah', '23:46'],
    [new Date(2020, 4, 22), 'Candle lighting', '22:28'],
    [new Date(2020, 4, 23), 'Havdalah', '00:27'],
    [new Date(2020, 4, 29), 'Candle lighting', '22:43'],
    [new Date(2020, 4, 30), null, undefined],
    [new Date(2020, 5, 5), 'Candle lighting', '22:55'],
    [new Date(2020, 5, 6), null, undefined],
  ];
  for (let i = 0; i < expected.length; i++) {
    const arr = expected[i];
    const hd = new HDate(arr[0]);
    const ev = makeCandleEvent(undefined, hd, hd.getDay(), location, timeFormat, 18);
    if (arr[1] == null) {
      t.is(ev, null);
    } else {
      t.is(ev.getDesc(), arr[1]);
      t.is(ev.getAttrs().eventTimeStr, arr[2]);
    }
  }
});
