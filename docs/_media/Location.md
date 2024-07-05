[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / Location

# Class: Location

Class representing Location

## Extends

- [`GeoLocation`](GeoLocation.md)

## Constructors

### new Location()

> **new Location**(`latitude`, `longitude`, `il`, `tzid`, `cityName`?, `countryCode`?, `geoid`?, `elevation`?): [`Location`](Location.md)

Initialize a Location instance

#### Parameters

• **latitude**: `number`

Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003)

• **longitude**: `number`

Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005)

• **il**: `boolean`

in Israel (true) or Diaspora (false)

• **tzid**: `string`

Olson timezone ID, e.g. "America/Chicago"

• **cityName?**: `string`

optional descriptive city name

• **countryCode?**: `string`

ISO 3166 alpha-2 country code (e.g. "FR")

• **geoid?**: `string` \| `number`

optional string or numeric geographic ID

• **elevation?**: `number`

in meters (default `0`)

#### Returns

[`Location`](Location.md)

#### Overrides

[`GeoLocation`](GeoLocation.md).[`constructor`](GeoLocation.md#constructors)

#### Defined in

[src/location.ts:146](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L146)

## Methods

### getCountryCode()

> **getCountryCode**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Defined in

[src/location.ts:191](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L191)

***

### getElevation()

> **getElevation**(): `number`

Method to get the elevation in Meters.

#### Returns

`number`

Returns the elevation in Meters.

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`getElevation`](GeoLocation.md#getelevation)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:54

***

### getGeoId()

> **getGeoId**(): `undefined` \| `string` \| `number`

#### Returns

`undefined` \| `string` \| `number`

#### Defined in

[src/location.ts:208](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L208)

***

### getIsrael()

> **getIsrael**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/location.ts:163](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L163)

***

### getLatitude()

> **getLatitude**(): `number`

#### Returns

`number`

Returns the latitude.

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`getLatitude`](GeoLocation.md#getlatitude)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:66

***

### getLocationName()

> **getLocationName**(): `null` \| `string`

#### Returns

`null` \| `string`

Returns the location name.

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`getLocationName`](GeoLocation.md#getlocationname)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:75

***

### getLongitude()

> **getLongitude**(): `number`

#### Returns

`number`

Returns the longitude.

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`getLongitude`](GeoLocation.md#getlongitude)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:71

***

### getName()

> **getName**(): `null` \| `string`

#### Returns

`null` \| `string`

#### Defined in

[src/location.ts:168](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L168)

***

### getShortName()

> **getShortName**(): `null` \| `string`

Returns the location name, up to the first comma

#### Returns

`null` \| `string`

#### Defined in

[src/location.ts:175](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L175)

***

### getTimeFormatter()

> **getTimeFormatter**(): `DateTimeFormat`

Gets a 24-hour time formatter (e.g. 07:41 or 20:03) for this location

#### Returns

`DateTimeFormat`

#### Defined in

[src/location.ts:203](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L203)

***

### getTimeZone()

> **getTimeZone**(): `string`

#### Returns

`string`

Returns the timeZone.

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`getTimeZone`](GeoLocation.md#gettimezone)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:84

***

### getTzid()

> **getTzid**(): `string`

#### Returns

`string`

#### Defined in

[src/location.ts:196](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L196)

***

### setElevation()

> **setElevation**(`elevation`): `void`

Method to set the elevation in Meters <b>above </b> sea level.

#### Parameters

• **elevation**: `number`

The elevation to set in Meters. An Error will be thrown if the value is a negative.

#### Returns

`void`

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`setElevation`](GeoLocation.md#setelevation)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:61

***

### setLatitude()

> **setLatitude**(`latitude`): `void`

#### Parameters

• **latitude**: `number`

#### Returns

`void`

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`setLatitude`](GeoLocation.md#setlatitude)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:62

***

### setLocationName()

> **setLocationName**(`name`): `void`

#### Parameters

• **name**: `null` \| `string`

The setter method for the display name.

#### Returns

`void`

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`setLocationName`](GeoLocation.md#setlocationname)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:80

***

### setLongitude()

> **setLongitude**(`longitude`): `void`

#### Parameters

• **longitude**: `number`

#### Returns

`void`

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`setLongitude`](GeoLocation.md#setlongitude)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:67

***

### setTimeZone()

> **setTimeZone**(`timeZoneId`): `void`

Method to set the TimeZone.

#### Parameters

• **timeZoneId**: `string`

The timeZone to set.

#### Returns

`void`

#### Inherited from

[`GeoLocation`](GeoLocation.md).[`setTimeZone`](GeoLocation.md#settimezone)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:90

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/location.ts:235](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L235)

***

### addLocation()

> `static` **addLocation**(`cityName`, `location`): `boolean`

Adds a location name for `Location.lookup()` only if the name isn't
already being used. Returns `false` if the name is already taken
and `true` if successfully added.

#### Parameters

• **cityName**: `string`

• **location**: [`Location`](Location.md)

#### Returns

`boolean`

#### Defined in

[src/location.ts:293](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L293)

***

### getUsaTzid()

> `static` **getUsaTzid**(`state`, `tz`, `dst`): `string`

Converts timezone info from Zip-Codes.com to a standard Olson tzid.

#### Parameters

• **state**: `string`

two-letter all-caps US state abbreviation like 'CA'

• **tz**: `number`

positive number, 5=America/New_York, 8=America/Los_Angeles

• **dst**: `string`

single char 'Y' or 'N'

#### Returns

`string`

#### Example

```ts
Location.getUsaTzid('AZ', 7, 'Y') // 'America/Denver'
```

#### Defined in

[src/location.ts:278](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L278)

***

### legacyTzToTzid()

> `static` **legacyTzToTzid**(`tz`, `dst`): `undefined` \| `string`

Converts legacy Hebcal timezone to a standard Olson tzid.

#### Parameters

• **tz**: `number`

integer, GMT offset in hours

• **dst**: `string`

'none', 'eu', 'usa', or 'israel'

#### Returns

`undefined` \| `string`

#### Defined in

[src/location.ts:244](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L244)

***

### lookup()

> `static` **lookup**(`name`): `undefined` \| [`Location`](Location.md)

Creates a location object from one of 60 "classic" Hebcal city names.
The following city names are supported:
'Ashdod', 'Atlanta', 'Austin', 'Baghdad', 'Beer Sheva',
'Berlin', 'Baltimore', 'Bogota', 'Boston', 'Budapest',
'Buenos Aires', 'Buffalo', 'Chicago', 'Cincinnati', 'Cleveland',
'Dallas', 'Denver', 'Detroit', 'Eilat', 'Gibraltar', 'Haifa',
'Hawaii', 'Helsinki', 'Houston', 'Jerusalem', 'Johannesburg',
'Kiev', 'La Paz', 'Livingston', 'Las Vegas', 'London', 'Los Angeles',
'Marseilles', 'Miami', 'Minneapolis', 'Melbourne', 'Mexico City',
'Montreal', 'Moscow', 'New York', 'Omaha', 'Ottawa', 'Panama City',
'Paris', 'Pawtucket', 'Petach Tikvah', 'Philadelphia', 'Phoenix',
'Pittsburgh', 'Providence', 'Portland', 'Saint Louis', 'Saint Petersburg',
'San Diego', 'San Francisco', 'Sao Paulo', 'Seattle', 'Sydney',
'Tel Aviv', 'Tiberias', 'Toronto', 'Vancouver', 'White Plains',
'Washington DC', 'Worcester'

#### Parameters

• **name**: `string`

#### Returns

`undefined` \| [`Location`](Location.md)

#### Defined in

[src/location.ts:230](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/location.ts#L230)
