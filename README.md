# @hebcal/core

Hebcal is a perpetual Jewish Calendar. This library converts between
Hebrew and Gregorian dates, and generates lists of Jewish holidays for
any year (past, present or future).  Shabbat and holiday candle
lighting and havdalah times are approximated based on location. Torah
readings (Parashat HaShavua), Daf Yomi, and counting of the Omer can
also be specified. Hebcal also includes algorithms to calculate
yahrzeits, birthdays and anniversaries.

[![Build Status](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml)

`@hebcal/core` targets both browser-based JavaScript and server-side Node.js.

Many users of this library will utilize the [HebrewCalendar](https://hebcal.github.io/api/core/classes/HebrewCalendar.html)
and [HDate](https://hebcal.github.io/api/hdate/classes/HDate.html) interfaces.

## Installation

```bash
npm install @hebcal/core
```

## Synopsis

```javascript
import {HebrewCalendar, Location} from '@hebcal/core';

const events = HebrewCalendar.calendar({
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

## Usage

This package exports two categories of output:

- `dist/bundle.min.js`: This includes all dependencies in a single JS file.  It's quite large (174KB minified), and should only be used if you aren't using a bundler.
- `dist/esm/`: This directory contains ES modules for each source file in the package.  If you're using Rollup, Vite, or another bundler, you should import from here to reduce output sizes.
  - These files do not include polyfills; if you want to support older browsers, use <https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers>
  - To make tree-shaking work better, import from the most specific file possible; avoid importing from `index` or `hebcal`.  Some APIs may still need to be moved to specific files.  For example:

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
