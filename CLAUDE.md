# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Build:** `npm run build` (generates translation files from .po, version constant, then rollup)
- **Test:** `npm test` (builds first via pretest, then runs vitest)
- **Run single test:** `npx vitest run test/somefile.spec.ts`
- **Lint:** `npm run lint` (runs `oxlint`, then `prettier --check .`)
- **Fix lint:** `npm run fix` (runs `oxlint --fix`, then `prettier --write .`)
- **Coverage:** `npm run coverage`
- **API docs:** `npm run docs` (runs `typedoc` into `docs/`)
  - **Expected baseline: 7 warnings, none from our source.** 4 are `{@link}`s inside
    `@hebcal/hdate`'s `greg` comments, 2 are dangling Java references inside
    `@hebcal/noaa`, and 1 is a cosmetic asset-path notice. They are known and
    accepted — see `externalSymbolLinkMappings` in `typedoc.json` for the ones
    that could be fixed.
  - **Anything above 7, or any warning naming a file in `src/`, is a regression.**
    Since the count never goes to zero, CI does not enforce it; check it by eye
    when you touch doc comments.

## Architecture

**@hebcal/core** is a perpetual Jewish Calendar library targeting both browser and Node.js (ESM only, no CommonJS).

### Key layers

1. **`HebrewCalendar`** (`src/hebcal.ts`) — primary public facade. Delegates to `calendar()` for event generation, `getHolidaysForYear_()` for holiday lookups (LRU-cached), and `Sedra` for Torah readings.

2. **Event system** — `Event` base class (`src/event.ts`) with subclasses: `HolidayEvent`, `TimedEvent`, `CandleLightingEvent`, `HavdalahEvent`, `ParshaEvent`, `OmerEvent`, `MoladEvent`, `MevarchimChodeshEvent`, `HebrewDateEvent`, `YomKippurKatanEvent`. Events are classified via the `flags` bitmask enum.

3. **`CalOptions`** (`src/CalOptions.ts`) — configuration interface (~30 fields) controlling which events `HebrewCalendar.calendar()` generates. The `mask` field filters by `flags`.

4. **`Zmanim`** (`src/zmanim.ts`) — wraps `NOAACalculator` from `@hebcal/noaa` for halachic times (sunrise, sunset, candle-lighting).

5. **`Molad`** (`src/molad.ts`) — new moon calculations using traditional chalakim arithmetic, with Kiddush Levana timing methods.

6. **`Location`** (`src/location.ts`) — extends `GeoLocation` from `@hebcal/noaa`, includes 65 built-in "classic" city definitions (`cities.json`).

7. **`DailyLearning`** (`src/DailyLearning.ts`) — plugin registration system for daily study calendars (implementations in separate `@hebcal/learning` package).

### Key dependencies

- `@hebcal/hdate` — Hebrew date primitives (HDate, months, gematriya, locale)
- `@hebcal/noaa` — NOAA solar calculator, GeoLocation
- `temporal-polyfill` — Temporal API polyfill

### Build outputs

- `dist/esm/` — per-file ES modules (tree-shakeable, with sourcemaps)
- `dist/bundle.js` / `dist/bundle.min.js` — IIFE bundle for standalone browser use

For tree-shaking, prefer deep imports: `import {getHolidaysOnDate} from '@hebcal/core/dist/esm/holidays'`

## Code Style

- **Formatter:** Prettier (`.prettierrc.cjs`) — no bracket spacing, single quotes, trailing commas (es5), no parens on single-arg arrows
- **Linter:** Oxlint (`.oxlintrc.json`)
- **Tests:** Vitest with `.spec.ts` suffix in `test/` directory. Tests import directly from `../src/` modules.
- **Translation files** (`*.po.ts`) are generated — do not edit by hand

## Documentation conventions

- **Never write an `@example` you haven't executed.** An audit found 16 examples
  whose stated output was plausible and wrong. `test/docexamples.spec.ts` asserts
  the documented output of the runnable ones — add a case there when you add an
  example, and when one fails, fix whichever is wrong rather than deleting the test.
- **Don't duplicate long doc comments across a function and its wrapper.**
  `HebrewCalendar.calendar` and `calendar()` drifted apart while duplicated. The
  canonical prose lives on the standalone function; the wrapper carries a short
  summary plus `{@link}`. Note that TypeDoc's `{@inheritDoc}` discards sibling
  tags, so an inherited comment loses its `@example`.
- **Markdown, not HTML,** in comments (`[text](url)`, `_em_`, `°`) — much of this
  file tree was ported from KosherJava's Javadoc and still carries `<a href>`,
  `<code>` and `&deg;` in places.
- **`@private` on a member that ships in the `.d.ts` is a lie to consumers** — use
  the TypeScript `private` keyword or `@internal`.
- JSDoc type annotations (`@enum`, `@readonly`, `@type`) are ignored by TypeDoc in
  a TS codebase; let the types speak.
- Zmanim methods returning `Date` yield an **`Invalid Date`** when a time can't be
  computed; the `Temporal`-returning ones yield **`null`**. Don't describe either
  as the other.
