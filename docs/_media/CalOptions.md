[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / CalOptions

# Type Alias: CalOptions

> **CalOptions**: `object`

Options to configure which events are returned

## Type declaration

### addHebrewDates?

> `optional` **addHebrewDates**: `boolean`

print the Hebrew date for the entire date range

### addHebrewDatesForEvents?

> `optional` **addHebrewDatesForEvents**: `boolean`

print the Hebrew date for dates with some events

### ashkenazi?

> `optional` **ashkenazi**: `boolean`

use Ashkenazi transliterations for event titles (default Sephardi transliterations)

### candleLightingMins?

> `optional` **candleLightingMins**: `number`

minutes before sundown to light candles (default 18)

### candlelighting?

> `optional` **candlelighting**: `boolean`

calculate candle-lighting and havdalah times

### dailyLearning?

> `optional` **dailyLearning**: `object`

map of options to enable daily study calendars
such as `dafYomi`, `mishnaYomi`, `nachYomi` with value `true`. For `yerushalmi`
the value should be a `number` for edition (`1` for Vilna, `2` for Schottenstein).

#### Index Signature

 \[`x`: `string`\]: `any`

### end?

> `optional` **end**: `number` \| [`HDate`](../classes/HDate.md) \| `Date`

use specific end date (requires start date)

### fastEndDeg?

> `optional` **fastEndDeg**: `number`

degrees for solar depression for end of fast days.
Default is 7.083 degrees for 3 medium-sized stars. Other commonly-used values include
6.45 degrees, as calculated by Rabbi Yechiel Michel Tucazinsky.

### havdalahDeg?

> `optional` **havdalahDeg**: `number`

degrees for solar depression for Havdalah.
Default is 8.5 degrees for 3 small stars. use 7.083 degrees for 3 medium-sized stars
(observed by Dr. Baruch (Berthold) Cohn in his luach published in France in 1899).
If `0`, Havdalah times are suppressed.

### havdalahMins?

> `optional` **havdalahMins**: `number`

minutes after sundown for Havdalah (typical values are 42, 50, or 72).
If `undefined` (the default), calculate Havdalah according to Tzeit Hakochavim -
Nightfall (the point when 3 small stars are observable in the night time sky with
the naked eye). If `0`, Havdalah times are suppressed.

### hour12?

> `optional` **hour12**: `boolean`

Whether to use 12-hour time (as opposed to 24-hour time).
Possible values are `true` and `false`; the default is locale dependent.

### il?

> `optional` **il**: `boolean`

Israeli holiday and sedra schedule

### isHebrewYear?

> `optional` **isHebrewYear**: `boolean`

to interpret year as Hebrew year

### locale?

> `optional` **locale**: `string`

translate event titles according to a locale
Default value is `en`, also built-in are `he` and `ashkenazi`.
Additional locales (such as `ru` or `fr`) are provided by the
[@hebcal/locales](https://github.com/hebcal/hebcal-locales) package

### location?

> `optional` **location**: [`Location`](../classes/Location.md)

latitude/longitude/tzid used for candle-lighting

### mask?

> `optional` **mask**: `number`

use bitmask from `flags` to filter events

### molad?

> `optional` **molad**: `boolean`

include event announcing the molad

### month?

> `optional` **month**: `number` \| `string`

Gregorian or Hebrew month (to filter results to a single month)

### noHolidays?

> `optional` **noHolidays**: `boolean`

suppress regular holidays

### noMinorFast?

> `optional` **noMinorFast**: `boolean`

suppress minor fasts

### noModern?

> `optional` **noModern**: `boolean`

suppress modern holidays

### noRoshChodesh?

> `optional` **noRoshChodesh**: `boolean`

suppress Rosh Chodesh

### noSpecialShabbat?

> `optional` **noSpecialShabbat**: `boolean`

suppress Special Shabbat

### numYears?

> `optional` **numYears**: `number`

generate calendar for multiple years (default 1)

### omer?

> `optional` **omer**: `boolean`

include Days of the Omer

### sedrot?

> `optional` **sedrot**: `boolean`

calculate parashah hashavua on Saturdays

### shabbatMevarchim?

> `optional` **shabbatMevarchim**: `boolean`

add Shabbat Mevarchim

### start?

> `optional` **start**: `number` \| [`HDate`](../classes/HDate.md) \| `Date`

use specific start date (requires end date)

### useElevation?

> `optional` **useElevation**: `boolean`

use elevation for calculations (default `false`).
If `true`, use elevation to affect the calculation of all sunrise/sunset based zmanim.
Note: there are some zmanim such as degree-based zmanim that are driven by the amount
of light in the sky and are not impacted by elevation.
These zmanim intentionally do not support elevation adjustment.

### year?

> `optional` **year**: `number`

Gregorian or Hebrew year

### yomKippurKatan?

> `optional` **yomKippurKatan**: `boolean`

include Yom Kippur Katan (default `false`).
יוֹם כִּפּוּר קָטָן is a minor day of atonement occurring monthly on the day preceeding each Rosh Chodesh.
Yom Kippur Katan is omitted in Elul (on the day before Rosh Hashanah),
Tishrei (Yom Kippur has just passed), Kislev (due to Chanukah)
and Nisan (fasting not permitted during Nisan).
When Rosh Chodesh occurs on Shabbat or Sunday, Yom Kippur Katan is observed on the preceding Thursday.
See [Wikipedia Yom Kippur Katan practices](https://en.wikipedia.org/wiki/Yom_Kippur_Katan#Practices)

## Defined in

[src/CalOptions.ts:7](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/CalOptions.ts#L7)
