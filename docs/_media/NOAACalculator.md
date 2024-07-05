[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / NOAACalculator

# Class: NOAACalculator

Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
"http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
to account for elevation. The algorithm can be found in the <a
href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.

## Author

&copy; Eliyahu Hershfeld 2011 - 2019

## Constructors

### new NOAACalculator()

> **new NOAACalculator**(`geoLocation`, `date`): [`NOAACalculator`](NOAACalculator.md)

A constructor that takes in <a href="http://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
parameter.

#### Parameters

• **geoLocation**: [`GeoLocation`](GeoLocation.md)

The location information used for calculating astronomical sun times.

• **date**: `PlainDate`

#### Returns

[`NOAACalculator`](NOAACalculator.md)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:114

## Properties

### ASTRONOMICAL\_ZENITH

> `readonly` `static` **ASTRONOMICAL\_ZENITH**: `number`

Sun's zenith at astronomical twilight (108&deg;).

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:136

***

### CIVIL\_ZENITH

> `readonly` `static` **CIVIL\_ZENITH**: `number`

Sun's zenith at civil twilight (96&deg;).

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:132

***

### NAUTICAL\_ZENITH

> `readonly` `static` **NAUTICAL\_ZENITH**: `number`

Sun's zenith at nautical twilight (102&deg;).

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:134

## Methods

### adjustZenith()

> **adjustZenith**(`zenith`, `elevation`): `number`

Adjusts the zenith of astronomical sunrise and sunset to account for solar refraction, solar radius and
elevation. The value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle
that the center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the
Earth were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun
is not a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to
true sunset or sunrise, instead the centre of the Sun's disk must lie just below the horizon for the upper edge
to be obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16
minutes of arc, and atmospheric refraction
accounts for 34 minutes or so, giving a total
of 50 arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset. Since a
person at an elevation can see blow the horizon of a person at sea level, this will also adjust the zenith to
account for elevation if available. Note that this will only adjust the value if the zenith is exactly 90 degrees.
For values below and above this no correction is done. As an example, astronomical twilight is when the sun is
18&deg; below the horizon or [108&deg;](NOAACalculator.md#astronomical_zenith). This is traditionally calculated with none of the above mentioned adjustments. The same goes
for various <em>tzais</em> and <em>alos</em> times such as the
ZmanimCalendar#ZENITH_16_POINT_1 16.1&deg; dip used in
ComplexZmanimCalendar#getAlos16Point1Degrees.

#### Parameters

• **zenith**: `number`

the azimuth below the vertical zenith of 90&deg;. For sunset typically the [*            zenith](NOAACalculator.md#adjustzenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](NOAACalculator.md#adjustzenith)
           this slightly to account for solar refraction and the sun's radius. Another example would be
           [getEndNauticalTwilight](NOAACalculator.md#getendnauticaltwilight) that passes
           [NAUTICAL_ZENITH](NOAACalculator.md#nautical_zenith) to this method.

• **elevation**: `number`

elevation in Meters.

#### Returns

`number`

The zenith adjusted to include the sun's radius, refracton
        and [elevation](NOAACalculator.md#getelevationadjustment) adjustment. This will only be adjusted for
        sunrise and sunset (if the zenith == 90&deg;)

#### See

getElevationAdjustment

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:425

***

### getBeginAstronomicalTwilight()

> **getBeginAstronomicalTwilight**(): `null` \| `ZonedDateTime`

A method that returns the beginning of astronomical twilight using a zenith of [* 108&deg;](NOAACalculator.md#astronomical_zenith).

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the beginning of astronomical twilight using a zenith of 108&deg;. If the
        calculation can't be computed, null will be returned. See detailed explanation on top of the page.

#### See

ASTRONOMICAL_ZENITH

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:201

***

### getBeginCivilTwilight()

> **getBeginCivilTwilight**(): `null` \| `ZonedDateTime`

A method that returns the beginning of civil twilight (dawn) using a zenith of [96&deg;](NOAACalculator.md#civil_zenith).

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
        can't be computed, null will be returned. See detailed explanation on top of the page.

#### See

CIVIL_ZENITH

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:184

***

### getBeginNauticalTwilight()

> **getBeginNauticalTwilight**(): `null` \| `ZonedDateTime`

A method that returns the beginning of nautical twilight using a zenith of [102&deg;](NOAACalculator.md#nautical_zenith).

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the beginning of nautical twilight using a zenith of 102&deg;. If the
        calculation can't be computed null will be returned. See detailed explanation on top of the page.

#### See

NAUTICAL_ZENITH

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:192

***

### getDateFromTime()

> `protected` **getDateFromTime**(`time`, `isSunrise`): `null` \| `ZonedDateTime`

A method that returns a `Date` from the time passed in as a parameter.

#### Parameters

• **time**: `number`

The time to be set as the time for the `Date`. The time expected is in the format: 18.75
           for 6:45:00 PM.

• **isSunrise**: `boolean`

true if the time is sunrise, and false if it is sunset

#### Returns

`null` \| `ZonedDateTime`

The Date.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:519

***

### getElevationAdjustment()

> **getElevationAdjustment**(`elevation`): `number`

Method to return the adjustment to the zenith required to account for the elevation. Since a person at a higher
elevation can see farther below the horizon, the calculation for sunrise / sunset is calculated below the horizon
used at sea level. This is only used for sunrise and sunset and not times before or after it such as
[() nautical twilight](NOAACalculator.md#getbeginnauticaltwilight) since those
calculations are based on the level of available light at the given dip below the horizon, something that is not
affected by elevation, the adjustment should only made if the zenith == 90&deg; [adjusted](NOAACalculator.md#adjustzenith)
for refraction and solar radius. The algorithm used is

<pre>
elevationAdjustment = Math.toDegrees(Math.acos(earthRadiusInMeters / (earthRadiusInMeters + elevationMeters)));
</pre>

The source of this algorithm is <a href="http://www.calendarists.com">Calendrical Calculations</a> by Edward M.
Reingold and Nachum Dershowitz. An alternate algorithm that produces an almost identical (but not accurate)
result found in Ma'aglay Tzedek by Moishe Kosower and other sources is:

<pre>
elevationAdjustment = 0.0347 * Math.sqrt(elevationMeters);
</pre>

#### Parameters

• **elevation**: `number`

elevation in Meters.

#### Returns

`number`

the adjusted zenith

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:391

***

### getEndAstronomicalTwilight()

> **getEndAstronomicalTwilight**(): `null` \| `ZonedDateTime`

A method that returns the end of astronomical twilight using a zenith of [108&deg;](NOAACalculator.md#astronomical_zenith).

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the end of astronomical twilight using a zenith of [*         108&deg;](NOAACalculator.md#astronomical_zenith). If the calculation can't be computed, null will be returned. See detailed explanation on top
        of the page.

#### See

ASTRONOMICAL_ZENITH

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:260

***

### getEndCivilTwilight()

> **getEndCivilTwilight**(): `null` \| `ZonedDateTime`

A method that returns the end of civil twilight using a zenith of [96&deg;](NOAACalculator.md#civil_zenith).

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the end of civil twilight using a zenith of [96&deg;](NOAACalculator.md#civil_zenith). If
        the calculation can't be computed, null will be returned. See detailed explanation on top of the page.

#### See

CIVIL_ZENITH

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:242

***

### getEndNauticalTwilight()

> **getEndNauticalTwilight**(): `null` \| `ZonedDateTime`

A method that returns the end of nautical twilight using a zenith of [102&deg;](NOAACalculator.md#nautical_zenith).

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the end of nautical twilight using a zenith of [102&deg;](NOAACalculator.md#nautical_zenith)
        . If the calculation can't be computed, null will be returned. See detailed explanation on top of the
        page.

#### See

NAUTICAL_ZENITH

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:251

***

### getSeaLevelSunrise()

> **getSeaLevelSunrise**(): `null` \| `ZonedDateTime`

A method that returns the sunrise without [elevation](NOAACalculator.md#getelevationadjustment). Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
something that is not affected by elevation. This method returns sunrise calculated at sea level. This forms the
base for dawn calculations that are calculated as a dip below the horizon before sunrise.

#### Returns

`null` \| `ZonedDateTime`

the `Date` representing the exact sea-level sunrise time. If the calculation can't be computed
        such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
        where it does not set, a null will be returned. See detailed explanation on top of the page.

#### See

 - getSunrise
 - getUTCSeaLevelSunrise
 - getSeaLevelSunset()

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:176

***

### getSeaLevelSunset()

> **getSeaLevelSunset**(): `null` \| `ZonedDateTime`

A method that returns the sunset without [elevation](NOAACalculator.md#getelevationadjustment). Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
something that is not affected by elevation. This method returns sunset calculated at sea level. This forms the
base for dusk calculations that are calculated as a dip below the horizon after sunset.

#### Returns

`null` \| `ZonedDateTime`

The `Date` representing the exact sea-level sunset time. If the calculation can't be computed
        such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
        where it does not set, a null will be returned. See detailed explanation on top of the page.

#### See

 - getSunset
 - getUTCSeaLevelSunset

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:234

***

### getSunTransit()

> **getSunTransit**(`startOfDay`?, `endOfDay`?): `null` \| `ZonedDateTime`

A method that returns sundial or solar noon. It occurs when the Sun is <a href
="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
calculated as halfway between the sunrise and sunset passed to this method. This time can be slightly off the
real transit time due to changes in declination (the lengthening or shortening day).

#### Parameters

• **startOfDay?**: `null` \| `ZonedDateTime`

the start of day for calculating the sun's transit. This can be sea level sunrise, visual sunrise (or
           any arbitrary start of day) passed to this method.

• **endOfDay?**: `null` \| `ZonedDateTime`

the end of day for calculating the sun's transit. This can be sea level sunset, visual sunset (or any
           arbitrary end of day) passed to this method.

#### Returns

`null` \| `ZonedDateTime`

The `Date` representing Sun's transit. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, null will be returned. See detailed explanation on top of the page.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:509

***

### getSunrise()

> **getSunrise**(): `null` \| `ZonedDateTime`

The getSunrise method Returns a `Date` representing the
[elevation adjusted](NOAACalculator.md#getelevationadjustment) sunrise time. The zenith used
for the calculation uses GEOMETRIC_ZENITH geometric zenith of 90&deg; plus
[getElevationAdjustment](NOAACalculator.md#getelevationadjustment). This is adjusted
to add approximately 50/60 of a degree to account for 34 archminutes of refraction
and 16 archminutes for the sun's radius for a total of [90.83333&deg;](NOAACalculator.md#adjustzenith).

#### Returns

`null` \| `ZonedDateTime`

the `Date` representing the exact sunrise time. If the calculation can't be computed such as
        in the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
        does not set, a null will be returned. See detailed explanation on top of the page.

#### See

 - adjustZenith
 - getSeaLevelSunrise()
 - getUTCSunrise

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:162

***

### getSunriseOffsetByDegrees()

> **getSunriseOffsetByDegrees**(`offsetZenith`): `null` \| `ZonedDateTime`

A utility method that returns the time of an offset by degrees below or above the horizon of
[() sunrise](NOAACalculator.md#getsunrise). Note that the degree offset is from the vertical, so for a calculation of 14&deg;
before sunrise, an offset of 14 + GEOMETRIC_ZENITH = 104 would have to be passed as a parameter.

#### Parameters

• **offsetZenith**: `number`

the degrees before [getSunrise](NOAACalculator.md#getsunrise) to use in the calculation. For time after sunrise use
           negative numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg;
           before sunrise, an offset of 14 + GEOMETRIC_ZENITH = 104 would have to be passed as a
           parameter.

#### Returns

`null` \| `ZonedDateTime`

The `Date` of the offset after (or before) [getSunrise](NOAACalculator.md#getsunrise). If the calculation
        can't be computed such as in the Arctic Circle where there is at least one day a year where the sun does
        not rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
        page.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:289

***

### getSunset()

> **getSunset**(): `null` \| `ZonedDateTime`

The getSunset method Returns a `Date` representing the
[elevation adjusted](NOAACalculator.md#getelevationadjustment) sunset time. The zenith used for
the calculation uses GEOMETRIC_ZENITH geometric zenith of 90&deg; plus
[getElevationAdjustment](NOAACalculator.md#getelevationadjustment). This is adjusted
to add approximately 50/60 of a degree to account for 34 archminutes of refraction
and 16 archminutes for the sun's radius for a total of [90.83333&deg;](NOAACalculator.md#adjustzenith).
Note:
In certain cases the calculates sunset will occur before sunrise. This will typically happen when a timezone
other than the local timezone is used (calculating Los Angeles sunset using a GMT timezone for example). In this
case the sunset date will be incremented to the following date.

#### Returns

`null` \| `ZonedDateTime`

The `Date` representing the exact sunset time. If the calculation can't be computed such as in
        the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
        does not set, a null will be returned. See detailed explanation on top of the page.

#### See

 - adjustZenith
 - getSeaLevelSunset()
 - getUTCSunset

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:221

***

### getSunsetOffsetByDegrees()

> **getSunsetOffsetByDegrees**(`offsetZenith`): `null` \| `ZonedDateTime`

A utility method that returns the time of an offset by degrees below or above the horizon of [()](NOAACalculator.md#getsunset). Note that the degree offset is from the vertical, so for a calculation of 14&deg; after sunset, an
offset of 14 + GEOMETRIC_ZENITH = 104 would have to be passed as a parameter.

#### Parameters

• **offsetZenith**: `number`

the degrees after [getSunset](NOAACalculator.md#getsunset) to use in the calculation. For time before sunset use negative
           numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after
           sunset, an offset of 14 + GEOMETRIC_ZENITH = 104 would have to be passed as a parameter.

#### Returns

`null` \| `ZonedDateTime`

The `Date`of the offset after (or before) [getSunset](NOAACalculator.md#getsunset). If the calculation can't
        be computed such as in the Arctic Circle where there is at least one day a year where the sun does not
        rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
        page.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:304

***

### getTemporalHour()

> **getTemporalHour**(`startOfDay`?, `endOfDay`?): `number`

A utility method that will allow the calculation of a temporal (solar) hour based on the sunrise and sunset
passed as parameters to this method. An example of the use of this method would be the calculation of a
non-elevation adjusted temporal hour by passing in [() sea level sunrise](NOAACalculator.md#getsealevelsunrise) and
[() sea level sunset](NOAACalculator.md#getsealevelsunset) as parameters.

#### Parameters

• **startOfDay?**: `null` \| `ZonedDateTime`

The start of the day.

• **endOfDay?**: `null` \| `ZonedDateTime`

The end of the day.

#### Returns

`number`

the <code>long</code> millisecond length of the temporal hour. If the calculation can't be computed a
        `NaN` will be returned. See detailed explanation on top of the page.

#### See

getTemporalHour()

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:490

***

### getUTCSeaLevelSunrise()

> **getUTCSeaLevelSunrise**(`zenith`): `number`

A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible
light, something that is not affected by elevation. This method returns UTC sunrise calculated at sea level. This
forms the base for dawn calculations that are calculated as a dip below the horizon before sunrise.

#### Parameters

• **zenith**: `number`

the degrees below the horizon. For time after sunrise use negative numbers.

#### Returns

`number`

The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.

#### See

 - getUTCSunrise
 - getUTCSeaLevelSunset

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:330

***

### getUTCSeaLevelSunset()

> **getUTCSeaLevelSunset**(`zenith`): `number`

A method that returns the sunset in UTC time without correction for elevation, time zone offset from GMT and
without using daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the
amount of visible light, something that is not affected by elevation. This method returns UTC sunset calculated
at sea level. This forms the base for dusk calculations that are calculated as a dip below the horizon after
sunset.

#### Parameters

• **zenith**: `number`

the degrees below the horizon. For time before sunset use negative numbers.

#### Returns

`number`

The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.

#### See

 - getUTCSunset
 - getUTCSeaLevelSunrise

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:358

***

### getUTCSunrise()

> **getUTCSunrise**(`date`, `geoLocation`, `zenith`, `adjustForElevation`): `number`

A method that calculates UTC sunrise as well as any time based on an angle above or below sunrise.

#### Parameters

• **date**: `PlainDate`

Used to calculate day of year.

• **geoLocation**: [`GeoLocation`](GeoLocation.md)

The location information used for astronomical calculating sun times.

• **zenith**: `number`

the azimuth below the vertical zenith of 90 degrees. for sunrise typically the [*            zenith](NOAACalculator.md#adjustzenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](NOAACalculator.md#adjustzenith)
           this slightly to account for solar refraction and the sun's radius. Another example would be
           [getBeginNauticalTwilight](NOAACalculator.md#getbeginnauticaltwilight) that passes
           [NAUTICAL_ZENITH](NOAACalculator.md#nautical_zenith) to this method.

• **adjustForElevation**: `boolean`

Should the time be adjusted for elevation

#### Returns

`number`

The UTC time of sunrise in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
        the calculation (expected behavior for some locations such as near the poles,
        `NaN` will be returned.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:454

***

### getUTCSunrise0()

> **getUTCSunrise0**(`zenith`): `number`

A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
daylight savings time.

#### Parameters

• **zenith**: `number`

the degrees below the horizon. For time after sunrise use negative numbers.

#### Returns

`number`

The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:315

***

### getUTCSunset()

> **getUTCSunset**(`date`, `geoLocation`, `zenith`, `adjustForElevation`): `number`

A method that calculates UTC sunset as well as any time based on an angle above or below sunset.

#### Parameters

• **date**: `PlainDate`

Used to calculate day of year.

• **geoLocation**: [`GeoLocation`](GeoLocation.md)

The location information used for astronomical calculating sun times.

• **zenith**: `number`

the azimuth below the vertical zenith of 90&deg;. For sunset typically the [*            zenith](NOAACalculator.md#adjustzenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](NOAACalculator.md#adjustzenith)
           this slightly to account for solar refraction and the sun's radius. Another example would be
           [getEndNauticalTwilight](NOAACalculator.md#getendnauticaltwilight) that passes
           [NAUTICAL_ZENITH](NOAACalculator.md#nautical_zenith) to this method.

• **adjustForElevation**: `boolean`

Should the time be adjusted for elevation

#### Returns

`number`

The UTC time of sunset in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
        the calculation (expected behavior for some locations such as near the poles,
        `NaN` will be returned.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:473

***

### getUTCSunset0()

> **getUTCSunset0**(`zenith`): `number`

A method that returns the sunset in UTC time without correction for time zone offset from GMT and without using
daylight savings time.

#### Parameters

• **zenith**: `number`

the degrees below the horizon. For time after sunset use negative numbers.

#### Returns

`number`

The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.

#### See

getUTCSeaLevelSunset

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:342

***

### getSolarAzimuth()

> `static` **getSolarAzimuth**(`date`, `latitude`, `lon`): `number`

Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
degrees.

#### Parameters

• **date**: `ZonedDateTime`

time of calculation

• **latitude**: `number`

latitude of location for calculation

• **lon**: `number`

longitude of location for calculation

#### Returns

`number`

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:681

***

### getSolarElevation()

> `static` **getSolarElevation**(`date`, `lat`, `lon`): `number`

Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
horizon. Not corrected for altitude.

#### Parameters

• **date**: `ZonedDateTime`

time of calculation

• **lat**: `number`

latitude of location for calculation

• **lon**: `number`

longitude of location for calculation

#### Returns

`number`

solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:667

***

### getTimeOffset()

> `static` **getTimeOffset**(`time`, `offset`): `null` \| `ZonedDateTime`

A utility method that returns a date offset by the offset time passed in. Please note that the level of light
during twilight is not affected by elevation, so if this is being used to calculate an offset before sunrise or
after sunset with the intent of getting a rough "level of light" calculation, the sunrise or sunset time passed
to this method should be sea level sunrise and sunset.

#### Parameters

• **time**: `null` \| `ZonedDateTime`

the start time

• **offset**: `number`

the offset in milliseconds to add to the time.

#### Returns

`null` \| `ZonedDateTime`

the `Date` with the offset in milliseconds added to it

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:273
