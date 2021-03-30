/* eslint-disable require-jsdoc */
import test from 'ava';
import {DafYomi, DafYomiEvent} from './dafyomi';
import {greg as g} from './greg';
import {HDate, months} from './hdate';

test('dafyomi-single', (t) => {
  const dt = new Date(1995, 11, 17);
  const dy = new DafYomi(dt);
  t.is(dy.getName(), 'Avodah Zarah');
  t.is(dy.getBlatt(), 68);
  t.is(dy.render(), 'Avodah Zarah 68');
});

test('dafyomi-multi', (t) => {
  const expected = getDafYomi5780();
  const startAbs = HDate.hebrew2abs(5780, months.TISHREI, 1) - 1;
  const endAbs = HDate.hebrew2abs(5781, months.TISHREI, 1) - 1;
  let i = 0;
  for (let abs = startAbs; abs <= endAbs; abs++) {
    const dt = g.abs2greg(abs);
    const dy = new DafYomi(dt);
    const dateStr = dt.toLocaleDateString('en-US');
    const str = dateStr + ' Daf Yomi: ' + dy.render();
    t.is(str, expected[i]);
    i++;
  }
});

test('dafyomi-render', (t) => {
  const ev = new DafYomiEvent(new HDate(new Date(2020, 5, 18)));
  t.is(ev.render(), 'Daf Yomi: Shabbat 104');
  t.is(ev.render('a'), 'Daf Yomi: Shabbos 104');
  t.is(ev.render('he'), 'דף יומי: שַׁבָּת 104');
  t.is(ev.url(), 'https://www.sefaria.org/Shabbat.104a?lang=bi');
});

test('dafyomi-shekalim', (t) => {
  const ev = new DafYomiEvent(new HDate(new Date(2021, 2, 23)));
  t.is(ev.render(), 'Daf Yomi: Shekalim 2');
  t.is(ev.url(), 'https://www.sefaria.org/Jerusalem_Talmud_Shekalim.2a?lang=bi');
});

// hebcal --daf-yomi -h -x -H 5780
function getDafYomi5780() {
  return `9/29/2019 Daf Yomi: Meilah 12
9/30/2019 Daf Yomi: Meilah 13
10/1/2019 Daf Yomi: Meilah 14
10/2/2019 Daf Yomi: Meilah 15
10/3/2019 Daf Yomi: Meilah 16
10/4/2019 Daf Yomi: Meilah 17
10/5/2019 Daf Yomi: Meilah 18
10/6/2019 Daf Yomi: Meilah 19
10/7/2019 Daf Yomi: Meilah 20
10/8/2019 Daf Yomi: Meilah 21
10/9/2019 Daf Yomi: Meilah 22
10/10/2019 Daf Yomi: Kinnim 23
10/11/2019 Daf Yomi: Kinnim 24
10/12/2019 Daf Yomi: Kinnim 25
10/13/2019 Daf Yomi: Tamid 26
10/14/2019 Daf Yomi: Tamid 27
10/15/2019 Daf Yomi: Tamid 28
10/16/2019 Daf Yomi: Tamid 29
10/17/2019 Daf Yomi: Tamid 30
10/18/2019 Daf Yomi: Tamid 31
10/19/2019 Daf Yomi: Tamid 32
10/20/2019 Daf Yomi: Tamid 33
10/21/2019 Daf Yomi: Tamid 34
10/22/2019 Daf Yomi: Midot 35
10/23/2019 Daf Yomi: Midot 36
10/24/2019 Daf Yomi: Midot 37
10/25/2019 Daf Yomi: Niddah 2
10/26/2019 Daf Yomi: Niddah 3
10/27/2019 Daf Yomi: Niddah 4
10/28/2019 Daf Yomi: Niddah 5
10/29/2019 Daf Yomi: Niddah 6
10/30/2019 Daf Yomi: Niddah 7
10/31/2019 Daf Yomi: Niddah 8
11/1/2019 Daf Yomi: Niddah 9
11/2/2019 Daf Yomi: Niddah 10
11/3/2019 Daf Yomi: Niddah 11
11/4/2019 Daf Yomi: Niddah 12
11/5/2019 Daf Yomi: Niddah 13
11/6/2019 Daf Yomi: Niddah 14
11/7/2019 Daf Yomi: Niddah 15
11/8/2019 Daf Yomi: Niddah 16
11/9/2019 Daf Yomi: Niddah 17
11/10/2019 Daf Yomi: Niddah 18
11/11/2019 Daf Yomi: Niddah 19
11/12/2019 Daf Yomi: Niddah 20
11/13/2019 Daf Yomi: Niddah 21
11/14/2019 Daf Yomi: Niddah 22
11/15/2019 Daf Yomi: Niddah 23
11/16/2019 Daf Yomi: Niddah 24
11/17/2019 Daf Yomi: Niddah 25
11/18/2019 Daf Yomi: Niddah 26
11/19/2019 Daf Yomi: Niddah 27
11/20/2019 Daf Yomi: Niddah 28
11/21/2019 Daf Yomi: Niddah 29
11/22/2019 Daf Yomi: Niddah 30
11/23/2019 Daf Yomi: Niddah 31
11/24/2019 Daf Yomi: Niddah 32
11/25/2019 Daf Yomi: Niddah 33
11/26/2019 Daf Yomi: Niddah 34
11/27/2019 Daf Yomi: Niddah 35
11/28/2019 Daf Yomi: Niddah 36
11/29/2019 Daf Yomi: Niddah 37
11/30/2019 Daf Yomi: Niddah 38
12/1/2019 Daf Yomi: Niddah 39
12/2/2019 Daf Yomi: Niddah 40
12/3/2019 Daf Yomi: Niddah 41
12/4/2019 Daf Yomi: Niddah 42
12/5/2019 Daf Yomi: Niddah 43
12/6/2019 Daf Yomi: Niddah 44
12/7/2019 Daf Yomi: Niddah 45
12/8/2019 Daf Yomi: Niddah 46
12/9/2019 Daf Yomi: Niddah 47
12/10/2019 Daf Yomi: Niddah 48
12/11/2019 Daf Yomi: Niddah 49
12/12/2019 Daf Yomi: Niddah 50
12/13/2019 Daf Yomi: Niddah 51
12/14/2019 Daf Yomi: Niddah 52
12/15/2019 Daf Yomi: Niddah 53
12/16/2019 Daf Yomi: Niddah 54
12/17/2019 Daf Yomi: Niddah 55
12/18/2019 Daf Yomi: Niddah 56
12/19/2019 Daf Yomi: Niddah 57
12/20/2019 Daf Yomi: Niddah 58
12/21/2019 Daf Yomi: Niddah 59
12/22/2019 Daf Yomi: Niddah 60
12/23/2019 Daf Yomi: Niddah 61
12/24/2019 Daf Yomi: Niddah 62
12/25/2019 Daf Yomi: Niddah 63
12/26/2019 Daf Yomi: Niddah 64
12/27/2019 Daf Yomi: Niddah 65
12/28/2019 Daf Yomi: Niddah 66
12/29/2019 Daf Yomi: Niddah 67
12/30/2019 Daf Yomi: Niddah 68
12/31/2019 Daf Yomi: Niddah 69
1/1/2020 Daf Yomi: Niddah 70
1/2/2020 Daf Yomi: Niddah 71
1/3/2020 Daf Yomi: Niddah 72
1/4/2020 Daf Yomi: Niddah 73
1/5/2020 Daf Yomi: Berachot 2
1/6/2020 Daf Yomi: Berachot 3
1/7/2020 Daf Yomi: Berachot 4
1/8/2020 Daf Yomi: Berachot 5
1/9/2020 Daf Yomi: Berachot 6
1/10/2020 Daf Yomi: Berachot 7
1/11/2020 Daf Yomi: Berachot 8
1/12/2020 Daf Yomi: Berachot 9
1/13/2020 Daf Yomi: Berachot 10
1/14/2020 Daf Yomi: Berachot 11
1/15/2020 Daf Yomi: Berachot 12
1/16/2020 Daf Yomi: Berachot 13
1/17/2020 Daf Yomi: Berachot 14
1/18/2020 Daf Yomi: Berachot 15
1/19/2020 Daf Yomi: Berachot 16
1/20/2020 Daf Yomi: Berachot 17
1/21/2020 Daf Yomi: Berachot 18
1/22/2020 Daf Yomi: Berachot 19
1/23/2020 Daf Yomi: Berachot 20
1/24/2020 Daf Yomi: Berachot 21
1/25/2020 Daf Yomi: Berachot 22
1/26/2020 Daf Yomi: Berachot 23
1/27/2020 Daf Yomi: Berachot 24
1/28/2020 Daf Yomi: Berachot 25
1/29/2020 Daf Yomi: Berachot 26
1/30/2020 Daf Yomi: Berachot 27
1/31/2020 Daf Yomi: Berachot 28
2/1/2020 Daf Yomi: Berachot 29
2/2/2020 Daf Yomi: Berachot 30
2/3/2020 Daf Yomi: Berachot 31
2/4/2020 Daf Yomi: Berachot 32
2/5/2020 Daf Yomi: Berachot 33
2/6/2020 Daf Yomi: Berachot 34
2/7/2020 Daf Yomi: Berachot 35
2/8/2020 Daf Yomi: Berachot 36
2/9/2020 Daf Yomi: Berachot 37
2/10/2020 Daf Yomi: Berachot 38
2/11/2020 Daf Yomi: Berachot 39
2/12/2020 Daf Yomi: Berachot 40
2/13/2020 Daf Yomi: Berachot 41
2/14/2020 Daf Yomi: Berachot 42
2/15/2020 Daf Yomi: Berachot 43
2/16/2020 Daf Yomi: Berachot 44
2/17/2020 Daf Yomi: Berachot 45
2/18/2020 Daf Yomi: Berachot 46
2/19/2020 Daf Yomi: Berachot 47
2/20/2020 Daf Yomi: Berachot 48
2/21/2020 Daf Yomi: Berachot 49
2/22/2020 Daf Yomi: Berachot 50
2/23/2020 Daf Yomi: Berachot 51
2/24/2020 Daf Yomi: Berachot 52
2/25/2020 Daf Yomi: Berachot 53
2/26/2020 Daf Yomi: Berachot 54
2/27/2020 Daf Yomi: Berachot 55
2/28/2020 Daf Yomi: Berachot 56
2/29/2020 Daf Yomi: Berachot 57
3/1/2020 Daf Yomi: Berachot 58
3/2/2020 Daf Yomi: Berachot 59
3/3/2020 Daf Yomi: Berachot 60
3/4/2020 Daf Yomi: Berachot 61
3/5/2020 Daf Yomi: Berachot 62
3/6/2020 Daf Yomi: Berachot 63
3/7/2020 Daf Yomi: Berachot 64
3/8/2020 Daf Yomi: Shabbat 2
3/9/2020 Daf Yomi: Shabbat 3
3/10/2020 Daf Yomi: Shabbat 4
3/11/2020 Daf Yomi: Shabbat 5
3/12/2020 Daf Yomi: Shabbat 6
3/13/2020 Daf Yomi: Shabbat 7
3/14/2020 Daf Yomi: Shabbat 8
3/15/2020 Daf Yomi: Shabbat 9
3/16/2020 Daf Yomi: Shabbat 10
3/17/2020 Daf Yomi: Shabbat 11
3/18/2020 Daf Yomi: Shabbat 12
3/19/2020 Daf Yomi: Shabbat 13
3/20/2020 Daf Yomi: Shabbat 14
3/21/2020 Daf Yomi: Shabbat 15
3/22/2020 Daf Yomi: Shabbat 16
3/23/2020 Daf Yomi: Shabbat 17
3/24/2020 Daf Yomi: Shabbat 18
3/25/2020 Daf Yomi: Shabbat 19
3/26/2020 Daf Yomi: Shabbat 20
3/27/2020 Daf Yomi: Shabbat 21
3/28/2020 Daf Yomi: Shabbat 22
3/29/2020 Daf Yomi: Shabbat 23
3/30/2020 Daf Yomi: Shabbat 24
3/31/2020 Daf Yomi: Shabbat 25
4/1/2020 Daf Yomi: Shabbat 26
4/2/2020 Daf Yomi: Shabbat 27
4/3/2020 Daf Yomi: Shabbat 28
4/4/2020 Daf Yomi: Shabbat 29
4/5/2020 Daf Yomi: Shabbat 30
4/6/2020 Daf Yomi: Shabbat 31
4/7/2020 Daf Yomi: Shabbat 32
4/8/2020 Daf Yomi: Shabbat 33
4/9/2020 Daf Yomi: Shabbat 34
4/10/2020 Daf Yomi: Shabbat 35
4/11/2020 Daf Yomi: Shabbat 36
4/12/2020 Daf Yomi: Shabbat 37
4/13/2020 Daf Yomi: Shabbat 38
4/14/2020 Daf Yomi: Shabbat 39
4/15/2020 Daf Yomi: Shabbat 40
4/16/2020 Daf Yomi: Shabbat 41
4/17/2020 Daf Yomi: Shabbat 42
4/18/2020 Daf Yomi: Shabbat 43
4/19/2020 Daf Yomi: Shabbat 44
4/20/2020 Daf Yomi: Shabbat 45
4/21/2020 Daf Yomi: Shabbat 46
4/22/2020 Daf Yomi: Shabbat 47
4/23/2020 Daf Yomi: Shabbat 48
4/24/2020 Daf Yomi: Shabbat 49
4/25/2020 Daf Yomi: Shabbat 50
4/26/2020 Daf Yomi: Shabbat 51
4/27/2020 Daf Yomi: Shabbat 52
4/28/2020 Daf Yomi: Shabbat 53
4/29/2020 Daf Yomi: Shabbat 54
4/30/2020 Daf Yomi: Shabbat 55
5/1/2020 Daf Yomi: Shabbat 56
5/2/2020 Daf Yomi: Shabbat 57
5/3/2020 Daf Yomi: Shabbat 58
5/4/2020 Daf Yomi: Shabbat 59
5/5/2020 Daf Yomi: Shabbat 60
5/6/2020 Daf Yomi: Shabbat 61
5/7/2020 Daf Yomi: Shabbat 62
5/8/2020 Daf Yomi: Shabbat 63
5/9/2020 Daf Yomi: Shabbat 64
5/10/2020 Daf Yomi: Shabbat 65
5/11/2020 Daf Yomi: Shabbat 66
5/12/2020 Daf Yomi: Shabbat 67
5/13/2020 Daf Yomi: Shabbat 68
5/14/2020 Daf Yomi: Shabbat 69
5/15/2020 Daf Yomi: Shabbat 70
5/16/2020 Daf Yomi: Shabbat 71
5/17/2020 Daf Yomi: Shabbat 72
5/18/2020 Daf Yomi: Shabbat 73
5/19/2020 Daf Yomi: Shabbat 74
5/20/2020 Daf Yomi: Shabbat 75
5/21/2020 Daf Yomi: Shabbat 76
5/22/2020 Daf Yomi: Shabbat 77
5/23/2020 Daf Yomi: Shabbat 78
5/24/2020 Daf Yomi: Shabbat 79
5/25/2020 Daf Yomi: Shabbat 80
5/26/2020 Daf Yomi: Shabbat 81
5/27/2020 Daf Yomi: Shabbat 82
5/28/2020 Daf Yomi: Shabbat 83
5/29/2020 Daf Yomi: Shabbat 84
5/30/2020 Daf Yomi: Shabbat 85
5/31/2020 Daf Yomi: Shabbat 86
6/1/2020 Daf Yomi: Shabbat 87
6/2/2020 Daf Yomi: Shabbat 88
6/3/2020 Daf Yomi: Shabbat 89
6/4/2020 Daf Yomi: Shabbat 90
6/5/2020 Daf Yomi: Shabbat 91
6/6/2020 Daf Yomi: Shabbat 92
6/7/2020 Daf Yomi: Shabbat 93
6/8/2020 Daf Yomi: Shabbat 94
6/9/2020 Daf Yomi: Shabbat 95
6/10/2020 Daf Yomi: Shabbat 96
6/11/2020 Daf Yomi: Shabbat 97
6/12/2020 Daf Yomi: Shabbat 98
6/13/2020 Daf Yomi: Shabbat 99
6/14/2020 Daf Yomi: Shabbat 100
6/15/2020 Daf Yomi: Shabbat 101
6/16/2020 Daf Yomi: Shabbat 102
6/17/2020 Daf Yomi: Shabbat 103
6/18/2020 Daf Yomi: Shabbat 104
6/19/2020 Daf Yomi: Shabbat 105
6/20/2020 Daf Yomi: Shabbat 106
6/21/2020 Daf Yomi: Shabbat 107
6/22/2020 Daf Yomi: Shabbat 108
6/23/2020 Daf Yomi: Shabbat 109
6/24/2020 Daf Yomi: Shabbat 110
6/25/2020 Daf Yomi: Shabbat 111
6/26/2020 Daf Yomi: Shabbat 112
6/27/2020 Daf Yomi: Shabbat 113
6/28/2020 Daf Yomi: Shabbat 114
6/29/2020 Daf Yomi: Shabbat 115
6/30/2020 Daf Yomi: Shabbat 116
7/1/2020 Daf Yomi: Shabbat 117
7/2/2020 Daf Yomi: Shabbat 118
7/3/2020 Daf Yomi: Shabbat 119
7/4/2020 Daf Yomi: Shabbat 120
7/5/2020 Daf Yomi: Shabbat 121
7/6/2020 Daf Yomi: Shabbat 122
7/7/2020 Daf Yomi: Shabbat 123
7/8/2020 Daf Yomi: Shabbat 124
7/9/2020 Daf Yomi: Shabbat 125
7/10/2020 Daf Yomi: Shabbat 126
7/11/2020 Daf Yomi: Shabbat 127
7/12/2020 Daf Yomi: Shabbat 128
7/13/2020 Daf Yomi: Shabbat 129
7/14/2020 Daf Yomi: Shabbat 130
7/15/2020 Daf Yomi: Shabbat 131
7/16/2020 Daf Yomi: Shabbat 132
7/17/2020 Daf Yomi: Shabbat 133
7/18/2020 Daf Yomi: Shabbat 134
7/19/2020 Daf Yomi: Shabbat 135
7/20/2020 Daf Yomi: Shabbat 136
7/21/2020 Daf Yomi: Shabbat 137
7/22/2020 Daf Yomi: Shabbat 138
7/23/2020 Daf Yomi: Shabbat 139
7/24/2020 Daf Yomi: Shabbat 140
7/25/2020 Daf Yomi: Shabbat 141
7/26/2020 Daf Yomi: Shabbat 142
7/27/2020 Daf Yomi: Shabbat 143
7/28/2020 Daf Yomi: Shabbat 144
7/29/2020 Daf Yomi: Shabbat 145
7/30/2020 Daf Yomi: Shabbat 146
7/31/2020 Daf Yomi: Shabbat 147
8/1/2020 Daf Yomi: Shabbat 148
8/2/2020 Daf Yomi: Shabbat 149
8/3/2020 Daf Yomi: Shabbat 150
8/4/2020 Daf Yomi: Shabbat 151
8/5/2020 Daf Yomi: Shabbat 152
8/6/2020 Daf Yomi: Shabbat 153
8/7/2020 Daf Yomi: Shabbat 154
8/8/2020 Daf Yomi: Shabbat 155
8/9/2020 Daf Yomi: Shabbat 156
8/10/2020 Daf Yomi: Shabbat 157
8/11/2020 Daf Yomi: Eruvin 2
8/12/2020 Daf Yomi: Eruvin 3
8/13/2020 Daf Yomi: Eruvin 4
8/14/2020 Daf Yomi: Eruvin 5
8/15/2020 Daf Yomi: Eruvin 6
8/16/2020 Daf Yomi: Eruvin 7
8/17/2020 Daf Yomi: Eruvin 8
8/18/2020 Daf Yomi: Eruvin 9
8/19/2020 Daf Yomi: Eruvin 10
8/20/2020 Daf Yomi: Eruvin 11
8/21/2020 Daf Yomi: Eruvin 12
8/22/2020 Daf Yomi: Eruvin 13
8/23/2020 Daf Yomi: Eruvin 14
8/24/2020 Daf Yomi: Eruvin 15
8/25/2020 Daf Yomi: Eruvin 16
8/26/2020 Daf Yomi: Eruvin 17
8/27/2020 Daf Yomi: Eruvin 18
8/28/2020 Daf Yomi: Eruvin 19
8/29/2020 Daf Yomi: Eruvin 20
8/30/2020 Daf Yomi: Eruvin 21
8/31/2020 Daf Yomi: Eruvin 22
9/1/2020 Daf Yomi: Eruvin 23
9/2/2020 Daf Yomi: Eruvin 24
9/3/2020 Daf Yomi: Eruvin 25
9/4/2020 Daf Yomi: Eruvin 26
9/5/2020 Daf Yomi: Eruvin 27
9/6/2020 Daf Yomi: Eruvin 28
9/7/2020 Daf Yomi: Eruvin 29
9/8/2020 Daf Yomi: Eruvin 30
9/9/2020 Daf Yomi: Eruvin 31
9/10/2020 Daf Yomi: Eruvin 32
9/11/2020 Daf Yomi: Eruvin 33
9/12/2020 Daf Yomi: Eruvin 34
9/13/2020 Daf Yomi: Eruvin 35
9/14/2020 Daf Yomi: Eruvin 36
9/15/2020 Daf Yomi: Eruvin 37
9/16/2020 Daf Yomi: Eruvin 38
9/17/2020 Daf Yomi: Eruvin 39
9/18/2020 Daf Yomi: Eruvin 40
`.split('\n');
}
