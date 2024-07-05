**@hebcal/core** • [**Docs**](globals.md)

***

# @hebcal/core
Hebcal is a perpetual Jewish Calendar. This library converts between
Hebrew and Gregorian dates, and generates lists of Jewish holidays for
any year (past, present or future).  Shabbat and holiday candle
lighting and havdalah times are approximated based on location. Torah
readings (Parashat HaShavua), Daf Yomi, and counting of the Omer can
also be specified. Hebcal also includes algorithms to calculate
yahrzeits, birthdays and anniversaries.

[![Build Status](docs/https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml/badge.svg)](docs/https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml)

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

- [greg](_media/README.md)

## Enumerations

- [flags](_media/flags.md)
- [holidayDesc](_media/holidayDesc.md)
- [months](_media/months.md)

## Classes

- [AsaraBTevetEvent](_media/AsaraBTevetEvent.md)
- [CandleLightingEvent](_media/CandleLightingEvent.md)
- [DailyLearning](_media/DailyLearning.md)
- [Event](_media/Event.md)
- [GeoLocation](_media/GeoLocation.md)
- [HDate](_media/HDate.md)
- [HavdalahEvent](_media/HavdalahEvent.md)
- [HebrewCalendar](_media/HebrewCalendar.md)
- [HebrewDateEvent](_media/HebrewDateEvent.md)
- [HolidayEvent](_media/HolidayEvent.md)
- [Locale](_media/Locale.md)
- [Location](_media/Location.md)
- [MevarchimChodeshEvent](_media/MevarchimChodeshEvent.md)
- [Molad](_media/Molad.md)
- [MoladEvent](_media/MoladEvent.md)
- [NOAACalculator](_media/NOAACalculator.md)
- [OmerEvent](_media/OmerEvent.md)
- [ParshaEvent](_media/ParshaEvent.md)
- [RoshChodeshEvent](_media/RoshChodeshEvent.md)
- [RoshHashanaEvent](_media/RoshHashanaEvent.md)
- [Sedra](_media/Sedra.md)
- [TimedEvent](_media/TimedEvent.md)
- [Zmanim](_media/Zmanim.md)

## Interfaces

- [Headers](_media/Headers.md)
- [LocaleData](_media/LocaleData.md)
- [StringArrayMap](_media/StringArrayMap.md)

## Type Aliases

- [CalOptions](_media/CalOptions.md)
- [SedraResult](_media/SedraResult.md)
- [TachanunResult](_media/TachanunResult.md)

## Variables

- [parshiot](_media/parshiot.md)
- [version](_media/version.md)

## Functions

- [gematriya](_media/gematriya.md)
- [gematriyaStrToNum](_media/gematriyaStrToNum.md)
