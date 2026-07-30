# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- **Build:** `npm run build` (generates translation files from .po, wraps `src/*.json`
  as `src/*.json.ts`, version constant, then rollup)
- **Test:** `npm test` (builds first via pretest, then runs vitest)
- **Run single test:** `npx vitest run test/somefile.spec.ts`
- **Lint:** `npm run lint` (`oxlint`, `prettier --check .`, then `npm run check:types`)
- **Typecheck:** `npm run check:types` (`tsc -p tsconfig.nodenext.json`)
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
- **Every relative import needs an explicit `.js` extension**, in `test/` as well as
  `src/` — write `../src/omer.js`, which resolves to `omer.ts`. TypeScript copies
  specifiers verbatim into the `.d.ts`, so an extensionless `./foo` makes the
  published declarations unresolvable for any consumer on `moduleResolution: node16`
  or `nodenext` (`TS2835`), even though rollup writes correct extensions into the
  `.js`. The build tsconfig uses `bundler` resolution, which does _not_ catch this —
  `tsconfig.nodenext.json` exists to enforce it, and runs as part of `npm run lint`.
  That config also covers `test/`, which is otherwise never typechecked at all
  (vitest transpiles without checking), so it is the only thing type-checking the
  tests. Use `@ts-expect-error` for deliberately-wrong arguments in negative tests.
- **Import JSON as `./foo.json.js`, not `./foo.json`.** `build:json2js` wraps each
  `src/*.json` into a generated `src/*.json.ts` (`export default` + the JSON), the
  same trick used for `*.po.ts`. Direct `.json` imports would need a
  `with {type: 'json'}` attribute under `nodenext`; this sidesteps that. Generated
  `src/*.json.ts` files are gitignored — edit the `.json`.

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
