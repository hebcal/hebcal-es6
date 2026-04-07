# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Build:** `npm run build` (generates translation files from .po, version constant, then rollup)
- **Test:** `npm test` (builds first via pretest, runs vitest, then lints via posttest)
- **Run single test:** `npx vitest run test/somefile.spec.ts`
- **Lint:** `npm run lint` (uses `gts lint` — Google TypeScript Style)
- **Fix lint:** `npm run fix` (uses `gts fix`)
- **Type check:** `npm run compile` (runs `tsc`)
- **Coverage:** `npm run coverage`

## Architecture

**@hebcal/core** is a perpetual Jewish Calendar library targeting both browser and Node.js (ESM only, no CommonJS).

### Key layers

1. **`HebrewCalendar`** (`src/hebcal.ts`) — primary public facade. Delegates to `calendar()` for event generation, `getHolidaysForYear_()` for holiday lookups (LRU-cached), and `Sedra` for Torah readings.

2. **Event system** — `Event` base class (`src/event.ts`) with subclasses: `HolidayEvent`, `TimedEvent`, `CandleLightingEvent`, `HavdalahEvent`, `ParshaEvent`, `OmerEvent`, `MoladEvent`, `MevarchimChodeshEvent`, `HebrewDateEvent`, `YomKippurKatanEvent`. Events are classified via the `flags` bitmask enum.

3. **`CalOptions`** (`src/CalOptions.ts`) — configuration interface (~30 fields) controlling which events `HebrewCalendar.calendar()` generates. The `mask` field filters by `flags`.

4. **`Zmanim`** (`src/zmanim.ts`) — wraps `NOAACalculator` from `@hebcal/noaa` for halachic times (sunrise, sunset, candle-lighting).

5. **`Molad`** (`src/molad.ts`) — new moon calculations using traditional chalakim arithmetic, with Kiddush Levana timing methods.

6. **`Location`** (`src/location.ts`) — extends `GeoLocation` from `@hebcal/noaa`, includes 60+ built-in city definitions.

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

- **Formatter:** Prettier — no bracket spacing, single quotes, trailing commas (es5), no parens on single-arg arrows
- **Linter:** GTS (Google TypeScript Style) via eslint
- **Tests:** Vitest with `.spec.ts` suffix in `test/` directory. Tests import directly from `../src/` modules.
- **Translation files** (`*.po.ts`) are generated — do not edit by hand
