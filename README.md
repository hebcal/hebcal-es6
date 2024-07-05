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

Many users of this library will utilize the [HebrewCalendar](docs/#HebrewCalendar)
and [HDate](docs/#HDate) interfaces.

## Installation
```bash
$ npm install @hebcal/core
```

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

## Namespaces

- [greg](docs/namespaces/greg/README.md)

## Enumerations

- [flags](docs/enumerations/flags.md)
- [holidayDesc](docs/enumerations/holidayDesc.md)
- [months](docs/enumerations/months.md)

## Classes

- [AsaraBTevetEvent](docs/classes/AsaraBTevetEvent.md)
- [CandleLightingEvent](docs/classes/CandleLightingEvent.md)
- [DailyLearning](docs/classes/DailyLearning.md)
- [Event](docs/classes/Event.md)
- [GeoLocation](docs/classes/GeoLocation.md)
- [HDate](docs/classes/HDate.md)
- [HavdalahEvent](docs/classes/HavdalahEvent.md)
- [HebrewCalendar](docs/classes/HebrewCalendar.md)
- [HebrewDateEvent](docs/classes/HebrewDateEvent.md)
- [HolidayEvent](docs/classes/HolidayEvent.md)
- [Locale](docs/classes/Locale.md)
- [Location](docs/classes/Location.md)
- [MevarchimChodeshEvent](docs/classes/MevarchimChodeshEvent.md)
- [Molad](docs/classes/Molad.md)
- [MoladEvent](docs/classes/MoladEvent.md)
- [NOAACalculator](docs/classes/NOAACalculator.md)
- [OmerEvent](docs/classes/OmerEvent.md)
- [ParshaEvent](docs/classes/ParshaEvent.md)
- [RoshChodeshEvent](docs/classes/RoshChodeshEvent.md)
- [RoshHashanaEvent](docs/classes/RoshHashanaEvent.md)
- [Sedra](docs/classes/Sedra.md)
- [TimedEvent](docs/classes/TimedEvent.md)
- [Zmanim](docs/classes/Zmanim.md)

## Interfaces

- [Headers](docs/interfaces/Headers.md)
- [LocaleData](docs/interfaces/LocaleData.md)
- [StringArrayMap](docs/interfaces/StringArrayMap.md)

## Type Aliases

- [CalOptions](docs/type-aliases/CalOptions.md)
- [SedraResult](docs/type-aliases/SedraResult.md)
- [TachanunResult](docs/type-aliases/TachanunResult.md)

## Variables

- [parshiot](docs/variables/parshiot.md)
- [version](docs/variables/version.md)

## Functions

- [gematriya](docs/functions/gematriya.md)
- [gematriyaStrToNum](docs/functions/gematriyaStrToNum.md)
