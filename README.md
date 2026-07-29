# @hebcal/core

Hebcal is a perpetual Jewish Calendar. This library converts between
Hebrew and Gregorian dates, and generates lists of Jewish holidays for
any year (past, present or future). Shabbat and holiday candle
lighting and havdalah times are approximated based on location. Torah
readings (Parashat HaShavua), Daf Yomi, and counting of the Omer can
also be specified. Hebcal also includes algorithms to calculate
yahrzeits, birthdays and anniversaries.

[![Build Status](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml)

`@hebcal/core` targets both browser-based JavaScript and server-side Node.js.

Most work starts with the [`calendar()`](https://hebcal.github.io/api/core/functions/calendar.html)
function and the [`HDate`](https://hebcal.github.io/api/hdate/classes/HDate.html) class.

Nearly everything is available as a standalone function — `calendar()`,
`getHolidaysOnDate()`, `getSedra()`, `tachanun()`, `reformatTimeStr()` — and the
examples here use that form, since importing only what you need is what lets a
bundler drop the rest. The same functions are also reachable as static methods on
[`HebrewCalendar`](https://hebcal.github.io/api/core/classes/HebrewCalendar.html).

Yahrzeits and birthdays are standalone functions too, but they live in
`@hebcal/hdate` rather than here — import `yahrzeit()` and
`birthdayOrAnniversary()` from there directly.
`HebrewCalendar.getYahrzeit()` and `.getBirthdayOrAnniversary()` are thin
wrappers over them. A few odds and ends remain class-only:
`eruvTavshilin()`, `hallel()` and `getHolidaysForYear()`.

## Installation

```bash
npm install @hebcal/core
```

## Synopsis

```javascript
import {calendar, Location} from '@hebcal/core';

const events = calendar({
  year: 1981,
  isHebrewYear: false,
  candlelighting: true,
  location: Location.lookup('San Francisco'),
  sedrot: true,
  omer: true,
});

for (const ev of events) {
  const hd = ev.getDate();
  const date = hd.greg();
  console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
}
```

## Events and flags

Everything `calendar()` returns is an [`Event`](https://hebcal.github.io/api/core/classes/Event.html):
a Hebrew date, a description, a `flags` bitmask, and optional extras. Subclasses add
detail — `HolidayEvent`, `ParshaEvent`, `OmerEvent`, `CandleLightingEvent` and
`HavdalahEvent` (both `TimedEvent`s, carrying an `eventTime`), `MoladEvent`,
`HebrewDateEvent`, and others.

Rather than testing `instanceof`, classify events with `flags`:

```javascript
import {calendar, flags} from '@hebcal/core';

const events = calendar({year: 5784, isHebrewYear: true});

for (const ev of events) {
  if (ev.getFlags() & flags.MAJOR_FAST) {
    console.log('fast day:', ev.render('en'));
  }
}
```

You can also push the filter down into generation, which is cheaper than filtering
afterwards, via `options.mask`:

```javascript
const roshChodesh = calendar({
  year: 5784,
  isHebrewYear: true,
  mask: flags.ROSH_CHODESH,
});
```

`Event.getCategories()` gives a coarser, string-based classification
(`['holiday', 'major', 'fast']`) that is handy for CSS classes or grouping.
See the [flags API docs](https://hebcal.github.io/api/core/variables/flags.html)
for the full list.

## Looking up a single date

`calendar()` is built for generating a _range_. When you only need to know what
falls on one day, `getHolidaysOnDate()` is much more direct — it reads from an
internally cached per-year map instead of running the full generator:

```javascript
import {getHolidaysOnDate, HDate, months} from '@hebcal/core';

const events = getHolidaysOnDate(new HDate(15, months.NISAN, 5784), false);
console.log(events?.map(ev => ev.getDesc())); // ['Pesach I']
```

Three things to know:

- It returns `undefined` — not an empty array — when nothing falls on that date, so
  use `events?.map(...)` or check before indexing.
- The `il` argument is optional, and **omitting it is not the same as passing
  `false`**. With `il` omitted you get both the Israel and Diaspora events for that
  date, unfiltered; pass `true` or `false` to get one schedule.
- It accepts an `HDate`, a `Date`, or an absolute R.D. day number.

It returns only holidays. Candle-lighting times, Torah readings and Omer days come
from `calendar()`, which is what `options.candlelighting`, `options.sedrot` and
`options.omer` drive.

## Daily learning (Daf Yomi and friends)

`@hebcal/core` ships **no** learning schedules itself. `DailyLearning` is a plug-in
registry; the schedules live in the separate
[`@hebcal/learning`](https://github.com/hebcal/hebcal-learning) package, which
registers them by calling `DailyLearning.addCalendar()` when you import it. This
keeps the daily-study tables — which are large and grow as new cycles are added —
out of the core bundle for the many users who don't need them.

Import `@hebcal/learning` once for its side effects, then request calendars through
`options.dailyLearning`:

```javascript
import '@hebcal/learning';
import {calendar, flags} from '@hebcal/core';

const events = calendar({
  year: 5784,
  isHebrewYear: true,
  noHolidays: true,
  dailyLearning: {dafYomi: true},
});

for (const ev of events) {
  if (ev.getFlags() & flags.DAF_YOMI) {
    console.log(ev.getDate().toString(), ev.render('en'));
  }
}
```

Daf Yomi (Babylonian Talmud) is by far the most widely used. `@hebcal/learning` also
provides Yerushalmi Yomi, Mishna Yomi, Nach Yomi, Daf Weekly, Chofetz Chaim, Rambam,
929 and more. Most take `true`; `yerushalmi` takes a number selecting the edition
(`1` for Vilna, `2` for Schottenstein):

```javascript
dailyLearning: {dafYomi: true, mishnaYomi: true, yerushalmi: 1}
```

To query a single day without generating a calendar, use `DailyLearning.lookup()`:

```javascript
import '@hebcal/learning';
import {DailyLearning, HDate, months} from '@hebcal/core';

const ev = DailyLearning.lookup(
  'dafYomi',
  new HDate(15, months.CHESHVAN, 5784),
  false
);
console.log(ev?.render('en')); // 'Daf Yomi: Kiddushin 78'
```

`DailyLearning.getCalendars()` returns the authoritative list of what the installed
version of `@hebcal/learning` actually registered; `has()` and `getStartDate()` report
whether a given calendar is available and from what date. You can register your own
schedule with `addCalendar()` — the same entry point `@hebcal/learning` uses.

## Candle lighting, Havdalah, and fast times

Set `options.candlelighting = true` and supply an `options.location` to get timed
events. Times are computed from latitude and longitude via NOAA solar equations. If
you ever have any doubts about Hebcal's times, consult your local halachic authority —
and note that coordinates above the Arctic or below the Antarctic circle are
guaranteed to be wrong.

```javascript
import {calendar, Location, flags} from '@hebcal/core';

const events = calendar({
  year: 2024,
  candlelighting: true,
  location: Location.lookup('Jerusalem'),
});

for (const ev of events) {
  if (ev.getFlags() & flags.LIGHT_CANDLES) {
    console.log(ev.getDate().toString(), ev.eventTimeStr); // '24 Tevet 5784' '16:08'
  }
}
```

**Candle lighting** defaults to 18 minutes before sunset in the Diaspora and 20
minutes in Israel, with 40 minutes for Jerusalem and 30 for Haifa and Zikhron
Ya'akov. Override with `options.candleLightingMins`.

**Havdalah** defaults to Tzeit Hakochavim — nightfall, when 3 small stars are
visible — calculated at 8.5° of solar depression. Two mutually exclusive overrides:

- `options.havdalahDeg` — a different solar depression angle (7.083° is the common
  alternative, for 3 medium-sized stars). Set to `0` to suppress Havdalah times.
- `options.havdalahMins` — a fixed number of minutes after sunset instead (42, 50
  and 72 are typical). Set to `0` to suppress Havdalah times.

**Minor fasts** begin at Alot HaShachar (16.1° in the morning). They end at 7.083°
in the Diaspora, or 15 minutes after sunset in Israel (Rabbi Deblitzky's practice).
Override with `options.fastEndDeg` or `options.fastEndMins` — again mutually
exclusive. When a minor fast falls on a Friday, the end time is suppressed, because
Shabbat begins before nightfall.

**Tish'a B'Av** does not follow those rules: it begins at sunset the previous day and
always ends at 6.45° (Rabbi Yechiel Michel Tucazinsky), ignoring `fastEndDeg` and
`fastEndMins`.

**Chanukah** candle-lighting, also generated when `candlelighting` and `location`
are set, is at Bein HaShmashos (13.5 minutes before 7.083°) on weekdays, regular
candle-lighting time on Friday, and regular Havdalah time on Saturday night.

Set `options.useElevation = true` to factor a location's elevation into sunrise and
sunset. Note that degree-based zmanim estimate the amount of light in the sky and
so are unaffected by elevation by design; `chatzot` is also always computed at sea
level.

For zmanim outside the calendar-generation flow, use the
[`Zmanim`](https://hebcal.github.io/api/core/classes/Zmanim.html) class directly.

## Yahrzeits, birthdays, and anniversaries

These are two different calculations, not one function with a flag, because the
customs genuinely differ. Both follow "Calendrical Calculations" by Reingold and
Dershowitz.

Both live in `@hebcal/hdate`; `HebrewCalendar` exposes them as wrappers for
convenience.

```javascript
import {birthdayOrAnniversary, yahrzeit} from '@hebcal/hdate';

const dt = new Date(2014, 2, 2); // 30 Adar I 5774

birthdayOrAnniversary(5785, dt)?.toString(); // '1 Nisan 5785'
yahrzeit(5785, dt)?.toString(); // '30 Sh'vat 5785'
```

The short version: **a birthday moves forward, a yahrzeit moves back.** When the
original day doesn't exist in the target year, a birthday is postponed to the first
of the following month, whereas a yahrzeit is observed on the day _before_ that — so
in the example above the two land a month apart.

A yahrzeit has one more wrinkle: for a death on 30 Marcheshvan or 30 Kislev, the
date in later years depends on what happened at the **first** anniversary, so the
observance is fixed by precedent rather than recomputed independently each year.

They also differ at the boundary, and for a reason: asking for the original year
gives you the original date back from `birthdayOrAnniversary()`, because a "0th
birthday" is a meaningful thing to ask for. `yahrzeit()` returns `undefined` there,
because a yahrzeit only has meaning from the first anniversary onward. Both return
`undefined` for years before the original.

Neither function modifies the date you pass in, so a single original date can be
reused to generate a run of years.

## Displaying the current Shabbat

`ParshaEvent` is designed for regular weekly parsha readings. On Shabbatot
with holiday readings, such as Shabbat Chol HaMoed, use holiday events or the
`@hebcal/leyning` package instead.

For a lightweight holiday title from `@hebcal/core`:

```javascript
import {HDate, getHolidaysOnDate, getSedra, ParshaEvent} from '@hebcal/core';

const hdate = new HDate(new Date(2025, 9, 11));
const sedra = getSedra(hdate.getFullYear(), true).lookup(hdate);
const event = sedra.chag
  ? getHolidaysOnDate(hdate, true)[0]
  : new ParshaEvent(sedra);

console.log(event.render('he'));
```

For full Torah reading metadata and Shabbat/holiday leyning titles:

```javascript
import {HDate} from '@hebcal/hdate';
import {getLeyningOnDate} from '@hebcal/leyning';

const hdate = new HDate(new Date(2025, 9, 11));
const reading = getLeyningOnDate(hdate, true, false, 'he');

console.log(reading.name.he);
console.log(reading.summary);
```

## `Date`, `Temporal`, and what's coming in v7

Solar calculations in this library run on
[Temporal](https://tc39.es/proposal-temporal/docs/), which arrives via the
`@hebcal/noaa` dependency. It is supplied by `temporal-polyfill`, imported through
its `/global` entry point — that installs `Temporal` onto `globalThis` only when
`globalThis.Temporal` is absent, so on an engine that ships Temporal natively you
transparently get the native implementation instead.

Temporal is newer than most of the JavaScript standard library, but it has been
running in production here for over two years. It is worth the dependency: unlike
`Date`, it models instants, wall-clock times, and time zones as distinct things,
which is exactly the distinction zmanim arithmetic depends on. Getting DST
transitions and standard-time offsets right with `Date` alone means a lot of
error-prone manual bookkeeping.

The awkward part today is that the public API is still mostly `Date`-based, and
`Zmanim` in particular mixes the two — most methods return a `Date` rounded to the
minute, while a few (`tzeit72()`, `alotHaShachar72zdt()`, the Kiddush Levana methods
on `Molad`) return a `Temporal.ZonedDateTime` with seconds precision. Where a
`Date`-returning method can't compute a time — far enough north or south that the sun
doesn't cross the relevant angle — it returns an `Invalid Date`; the
`Temporal`-returning ones return `null` instead.

That split is transitional. The intent is to move the library to `Temporal`
throughout, which is a breaking change and so is planned for `@hebcal/core` version 7.
Until then, checking `isNaN(dt.getTime())` on `Date` results and `=== null` on
`Temporal` results is the portable approach.

## Usage

This package exports two categories of output:

- `dist/bundle.min.js`: This includes all dependencies in a single JS file. It's quite large (174KB minified), and should only be used if you aren't using a bundler.
- `dist/esm/`: This directory contains ES modules for each source file in the package. If you're using Rollup, Vite, or another bundler, you should import from here to reduce output sizes.
  - These files do not include polyfills; if you want to support older browsers, use <https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers>
  - To make tree-shaking work better, import from the most specific file possible; avoid importing from `index` or `hebcal`. Some APIs may still need to be moved to specific files. For example:

    ```ts
    import {getHolidaysOnDate} from '@hebcal/core/dist/esm/holidays';
    ```

  - This can save hundreds of kilobytes by dropping Zmanim dependencies if your code doesn't use them.

  - You will need to include `@rollup/plugin-node-resolve` in your Rollup config.

## [API Documentation](https://hebcal.github.io/api/core/modules.html)

## History

Hebcal was created in 1992 by Danny Sadinoff as a Unix/Linux program
written in C, inspired by similar functionality written in Emacs
Lisp.

The initial JavaScript port was released in 2014 by Eyal
Schachter (age 15). It was updated to ES6 in 2020 by Michael J. Radwin.

This TypeScript native implementation was released in 2024,
developed by Michael J. Radwin and Yisroel Yakovson.

Version 4 (April 2023) moved daily learning schedules such as Daf Yomi
to a separate @hebcal/learning package to reduce the size of the core
package and ease extensibility for adding new calendars of daily text
study.

Version 5 (December 2023) added elevation support for zmanim
and candle-lighting times, and improved ES module support.

Version 6 (October 2025) removed support for CommonJS and Node.js 16.x.
