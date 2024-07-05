[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / Zmanim

# Class: Zmanim

Calculate halachic times (zmanim / זְמַנִּים) for a given day and location.
Calculations are available for tzeit / tzais (nightfall),
shkiah (sunset) and more.

Zmanim are estimated using an algorithm published by the US National Oceanic
and Atmospheric Administration. The NOAA solar calculator is based on equations
from _Astronomical Algorithms_ by Jean Meeus.

The sunrise and sunset results are theoretically accurate to within a minute for
locations between +/- 72° latitude, and within 10 minutes outside of those latitudes.
However, due to variations in atmospheric composition, temperature, pressure and
conditions, observed values may vary from calculations.
https://gml.noaa.gov/grad/solcalc/calcdetails.html

## Example

```ts
const {GeoLocation, Zmanim} = require('@hebcal/core');
const latitude = 41.822232;
const longitude = -71.448292;
const tzid = 'America/New_York';
const friday = new Date(2023, 8, 8);
const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
const zmanim = new Zmanim(gloc, friday, false);
const candleLighting = zmanim.sunsetOffset(-18, true);
const timeStr = Zmanim.formatISOWithTimeZone(tzid, candleLighting);
```

## Constructors

### new Zmanim()

> **new Zmanim**(`gloc`, `date`, `useElevation`): [`Zmanim`](Zmanim.md)

Initialize a Zmanim instance.

#### Parameters

• **gloc**: [`GeoLocation`](GeoLocation.md)

GeoLocation including latitude, longitude, and timezone

• **date**: [`HDate`](HDate.md) \| `Date`

Regular or Hebrew Date. If `date` is a regular `Date`,
   hours, minutes, seconds and milliseconds are ignored.

• **useElevation**: `boolean`

use elevation for calculations (default `false`).
   If `true`, use elevation to affect the calculation of all sunrise/sunset based
   zmanim. Note: there are some zmanim such as degree-based zmanim that are driven
   by the amount of light in the sky and are not impacted by elevation.
   These zmanim intentionally do not support elevation adjustment.

#### Returns

[`Zmanim`](Zmanim.md)

#### Defined in

[src/zmanim.ts:71](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L71)

## Methods

### alotHaShachar()

> **alotHaShachar**(): `Date`

Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:196](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L196)

***

### beinHaShmashos()

> **beinHaShmashos**(): `Date`

Rabbeinu Tam holds that bein hashmashos is a specific time
between sunset and tzeis hakochavim.
One opinion on how to calculate this time is that
it is 13.5 minutes before tzies 7.083.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:425](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L425)

***

### chatzot()

> **chatzot**(): `Date`

Midday – Chatzot; Sunrise plus 6 halachic hours

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:178](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L178)

***

### chatzotNight()

> **chatzotNight**(): `Date`

Midnight – Chatzot; Sunset plus 6 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:188](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L188)

***

### dawn()

> **dawn**(): `Date`

Civil dawn; Sun is 6° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:146](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L146)

***

### dusk()

> **dusk**(): `Date`

Civil dusk; Sun is 6° below the horizon in the evening.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:155](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L155)

***

### getUseElevation()

> **getUseElevation**(): `boolean`

Returns `true` if elevation adjustment is enabled
for zmanim support elevation adjustment

#### Returns

`boolean`

#### Defined in

[src/zmanim.ts:86](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L86)

***

### gregEve()

> **gregEve**(): `Date`

Returns sunset for the previous day.
If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:163](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L163)

***

### minchaGedola()

> **minchaGedola**(): `Date`

Earliest Mincha – Mincha Gedola (GRA); Sunrise plus 6.5 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

This method returns the latest mincha gedola, the earliest time one can pray mincha
that is 6.5 shaos zmaniyos (solar hours) after sunrise or sea level sunrise
(depending on the `useElevation` setting), according
to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).

The Ramba"m is of the opinion that it is better to delay *mincha* until
*mincha ketana* while the Ra"sh, Tur, GRA and others are of the
opinion that *mincha* can be prayed *lechatchila* starting at *mincha gedola*.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:348](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L348)

***

### minchaGedolaMGA()

> **minchaGedolaMGA**(): `Date`

Earliest Mincha – Mincha Gedola (MGA); Sunrise plus 6.5 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

This method returns the time of *mincha gedola* according to the Magen Avraham
with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
This is the earliest time to pray *mincha*.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:359](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L359)

***

### minchaKetana()

> **minchaKetana**(): `Date`

Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

This method returns *mincha ketana*, the preferred earliest time to pray *mincha* in the
opinion of the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others,
that is 9.5 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
(depending on the `useElevation` setting), according
to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:374](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L374)

***

### minchaKetanaMGA()

> **minchaKetanaMGA**(): `Date`

This method returns the time of *mincha ketana* according to the Magen Avraham
with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
This is the preferred earliest time to pray *mincha* according to the opinion of
the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others.

If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:385](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L385)

***

### misheyakir()

> **misheyakir**(): `Date`

Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:204](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L204)

***

### misheyakirMachmir()

> **misheyakirMachmir**(): `Date`

Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:212](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L212)

***

### neitzHaChama()

> **neitzHaChama**(): `Date`

Alias for sunrise

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:408](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L408)

***

### plagHaMincha()

> **plagHaMincha**(): `Date`

Plag haMincha; Sunrise plus 10.75 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:393](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L393)

***

### seaLevelSunrise()

> **seaLevelSunrise**(): `Date`

Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon).
This function does not support elevation adjustment.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:121](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L121)

***

### seaLevelSunset()

> **seaLevelSunset**(): `Date`

When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
This function does not support elevation adjustment.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:137](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L137)

***

### setUseElevation()

> **setUseElevation**(`useElevation`): `void`

Enables or disables elevation adjustment for zmanim support elevation adjustment

#### Parameters

• **useElevation**: `boolean`

#### Returns

`void`

#### Defined in

[src/zmanim.ts:93](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L93)

***

### shkiah()

> **shkiah**(): `Date`

Alias for sunset

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:414](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L414)

***

### sofZmanShma()

> **sofZmanShma**(): `Date`

Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra.
If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:232](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L232)

***

### sofZmanShmaMGA()

> **sofZmanShmaMGA**(): `Date`

Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn being fixed 72 minutes before sea-level sunrise, and nightfall is fixed
72 minutes after sea-level sunset.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:274](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L274)

***

### sofZmanShmaMGA16Point1()

> **sofZmanShmaMGA16Point1**(): `Date`

Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 16.1° below the horizon.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:284](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L284)

***

### sofZmanShmaMGA19Point8()

> **sofZmanShmaMGA19Point8**(): `Date`

Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 19.8° below the horizon.

This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
around the equinox / equilux which calculates to 19.8° below geometric zenith.
https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:298](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L298)

***

### sofZmanTfilla()

> **sofZmanTfilla**(): `Date`

Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra.

This method returns the latest *zman tfila* (time to recite shema in the morning)
that is 4 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
(depending on the `useElevation` setting), according
to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).

If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:245](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L245)

***

### sofZmanTfillaMGA()

> **sofZmanTfillaMGA**(): `Date`

Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:306](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L306)

***

### sofZmanTfillaMGA16Point1()

> **sofZmanTfillaMGA16Point1**(): `Date`

Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 16.1° below the horizon.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:316](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L316)

***

### sofZmanTfillaMGA19Point8()

> **sofZmanTfillaMGA19Point8**(): `Date`

Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 19.8° below the horizon.

This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
around the equinox / equilux which calculates to 19.8° below geometric zenith.
https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:330](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L330)

***

### sunrise()

> **sunrise**(): `Date`

Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:113](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L113)

***

### sunriseOffset()

> **sunriseOffset**(`offset`, `roundMinute`, `forceSeaLevel`): `Date`

Returns sunrise + `offset` minutes (either positive or negative).
If elevation is enabled, this function will include elevation in the calculation
 unless `forceSeaLevel` is `true`.

#### Parameters

• **offset**: `number`

minutes

• **roundMinute**: `boolean` = `true`

round time to nearest minute (default true)

• **forceSeaLevel**: `boolean` = `false`

use sea-level sunrise (default false)

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:498](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L498)

***

### sunset()

> **sunset**(): `Date`

When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
If elevation is enabled, this function will include elevation in the calculation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:129](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L129)

***

### sunsetOffset()

> **sunsetOffset**(`offset`, `roundMinute`, `forceSeaLevel`): `Date`

Returns sunset + `offset` minutes (either positive or negative).
If elevation is enabled, this function will include elevation in the calculation
 unless `forceSeaLevel` is `true`.

#### Parameters

• **offset**: `number`

minutes

• **roundMinute**: `boolean` = `true`

round time to nearest minute (default true)

• **forceSeaLevel**: `boolean` = `false`

use sea-level sunset (default false)

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:521](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L521)

***

### timeAtAngle()

> **timeAtAngle**(`angle`, `rising`): `Date`

Convenience function to get the time when sun is above or below the horizon
for a certain angle (in degrees).
This function does not support elevation adjustment.

#### Parameters

• **angle**: `number`

• **rising**: `boolean`

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:103](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L103)

***

### tzeit()

> **tzeit**(`angle`?): `Date`

#### Parameters

• **angle?**: `number` = `8.5`

optional time for solar depression.
  Default is 8.5 degrees for 3 small stars, use 7.083 degrees for 3 medium-sized stars.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:402](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L402)

***

### formatISOWithTimeZone()

> `static` **formatISOWithTimeZone**(`tzid`, `date`): `string`

Returns a string like "2022-04-01T13:06:00-11:00"

#### Parameters

• **tzid**: `string`

• **date**: `Date`

#### Returns

`string`

#### Defined in

[src/zmanim.ts:483](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L483)

***

### formatTime()

> `static` **formatTime**(`dt`, `timeFormat`): `string`

Uses timeFormat to return a date like '20:34'

#### Parameters

• **dt**: `Date`

• **timeFormat**: `DateTimeFormat`

#### Returns

`string`

#### Defined in

[src/zmanim.ts:436](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L436)

***

### roundTime()

> `static` **roundTime**(`dt`): `Date`

Discards seconds, rounding to nearest minute.

#### Parameters

• **dt**: `Date`

#### Returns

`Date`

#### Defined in

[src/zmanim.ts:449](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L449)

***

### timeZoneOffset()

> `static` **timeZoneOffset**(`tzid`, `date`): `string`

Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")

#### Parameters

• **tzid**: `string`

• **date**: `Date`

#### Returns

`string`

#### Defined in

[src/zmanim.ts:470](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/zmanim.ts#L470)
