# @hebcal/core

Hebcal is a perpetual Jewish Calendar. This library converts between
Hebrew and Gregorian dates, and generates lists of Jewish holidays for
any year (past, present or future).  Shabbat and holiday candle
lighting and havdalah times are approximated based on location. Torah
readings (Parashat HaShavua), Daf Yomi, and counting of the Omer can
also be specified. Hebcal also includes algorithms to calculate
yahrzeits, birthdays and anniversaries.

[![Build Status](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml)

Hebcal was created in 1994 by Danny Sadinoff as a Unix/Linux program
written in C, inspired by similar functionality written in Emacs
Lisp. The initial JavaScript port was released in 2014 by Eyal
Schachter (age 15). This ECMAScript 2015 implementation was released
in 2020 by Michael J. Radwin. `@hebcal/core` targets both
browser-based JavaScript and server-side Node.js.

Many users of this library will utilize the [HebrewCalendar](https://hebcal.github.io/api/core/classes/HebrewCalendar.html)
and [HDate](https://hebcal.github.io/api/hdate/classes/HDate.html) interfaces.

## Installation

```bash
npm install @hebcal/core
```

## Usage

This package exports 3 categories of output:

- `dist/bundle.min.js`: This includes all dependencies in a single JS file.  It's quite large (174KB minified), and should only be used if you aren't using a bundler.
- `dist/index.cjs`: This includes all of this package's code in a single bundle.
- `dist/es/`: This directory contains ES modules for each source file in the package.  If you're using Rollup, Vite, or another bundler, you should import from here to reduce output sizes.
  - These files do not include polyfills; if you want to support older browsers, use <https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers>
  - To make tree-shaking work better, import from the most specific file possible; avoid importing from `index` or `hebcal`.  Some APIs may still need to be moved to specific files.  For example:

    ```ts
    import {getHolidaysOnDate} from '@hebcal/core/dist/es/holidays';
    ```

  - This can save hundreds of kilobytes by dropping Zmanim dependencies if your code doesn't use them.

  - You will need to include `@rollup/plugin-node-resolve` in your Rollup config.

## Synopsis

```javascript
import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';

const options: CalOptions = {
  year: 1981,
  isHebrewYear: false,
  candlelighting: true,
  location: Location.lookup('San Francisco'),
  sedrot: true,
  omer: true,
};
const events = HebrewCalendar.calendar(options);

for (const ev of events) {
  const hd = ev.getDate();
  const date = hd.greg();
  console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
}
```

## [API Documentation](https://hebcal.github.io/api/core/index.html)
