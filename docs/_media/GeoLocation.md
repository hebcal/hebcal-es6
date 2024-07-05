[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / GeoLocation

# Class: GeoLocation

A class that contains location information such as latitude and longitude required for astronomical calculations. The
elevation field may not be used by some calculation engines and would be ignored if set.

## Author

&copy; Eliyahu Hershfeld 2004 - 2016

## Version

1.1

## Extended by

- [`Location`](Location.md)

## Constructors

### new GeoLocation()

> **new GeoLocation**(`name`, `latitude`, `longitude`, `elevation`, `timeZoneId`): [`GeoLocation`](GeoLocation.md)

GeoLocation constructor with parameters for all required fields.

#### Parameters

• **name**: `null` \| `string`

The location name for display use such as &quot;Lakewood, NJ&quot;

• **latitude**: `number`

the latitude in a double format such as 40.095965 for Lakewood, NJ.
           <b>Note: </b> For latitudes south of the equator, a negative value should be used.

• **longitude**: `number`

double the longitude in a double format such as -74.222130 for Lakewood, NJ.
           <b>Note: </b> For longitudes west of the <a href="http://en.wikipedia.org/wiki/Prime_Meridian">Prime
           Meridian </a> (Greenwich), a negative value should be used.

• **elevation**: `number`

the elevation above sea level in Meters. Elevation is not used in most algorithms used for calculating
           sunrise and set.

• **timeZoneId**: `string`

the <code>TimeZone</code> for the location.

#### Returns

[`GeoLocation`](GeoLocation.md)

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:28

## Methods

### getElevation()

> **getElevation**(): `number`

Method to get the elevation in Meters.

#### Returns

`number`

Returns the elevation in Meters.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:54

***

### getLatitude()

> **getLatitude**(): `number`

#### Returns

`number`

Returns the latitude.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:66

***

### getLocationName()

> **getLocationName**(): `null` \| `string`

#### Returns

`null` \| `string`

Returns the location name.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:75

***

### getLongitude()

> **getLongitude**(): `number`

#### Returns

`number`

Returns the longitude.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:71

***

### getTimeZone()

> **getTimeZone**(): `string`

#### Returns

`string`

Returns the timeZone.

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:84

***

### setElevation()

> **setElevation**(`elevation`): `void`

Method to set the elevation in Meters <b>above </b> sea level.

#### Parameters

• **elevation**: `number`

The elevation to set in Meters. An Error will be thrown if the value is a negative.

#### Returns

`void`

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:61

***

### setLatitude()

> **setLatitude**(`latitude`): `void`

#### Parameters

• **latitude**: `number`

#### Returns

`void`

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

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:80

***

### setLongitude()

> **setLongitude**(`longitude`): `void`

#### Parameters

• **longitude**: `number`

#### Returns

`void`

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

#### Defined in

node\_modules/@hebcal/noaa/dist/index.d.ts:90
