[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / Molad

# Class: Molad

Represents a molad, the moment when the new moon is "born"

## Constructors

### new Molad()

> **new Molad**(`year`, `month`): [`Molad`](Molad.md)

Calculates the molad for a Hebrew month

#### Parameters

• **year**: `number`

• **month**: `number`

#### Returns

[`Molad`](Molad.md)

#### Defined in

[src/molad.ts:31](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L31)

## Methods

### getChalakim()

> **getChalakim**(): `number`

#### Returns

`number`

parts of a minute (0-17)

#### Defined in

[src/molad.ts:70](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L70)

***

### getDow()

> **getDow**(): `number`

#### Returns

`number`

Day of Week (0=Sunday, 6=Saturday)

#### Defined in

[src/molad.ts:52](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L52)

***

### getHour()

> **getHour**(): `number`

#### Returns

`number`

hour of day (0-23)

#### Defined in

[src/molad.ts:58](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L58)

***

### getMinutes()

> **getMinutes**(): `number`

#### Returns

`number`

minutes past hour (0-59)

#### Defined in

[src/molad.ts:64](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L64)

***

### getMonth()

> **getMonth**(): `number`

#### Returns

`number`

#### Defined in

[src/molad.ts:41](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L41)

***

### getMonthName()

> **getMonthName**(): `string`

#### Returns

`string`

#### Defined in

[src/molad.ts:46](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L46)

***

### getYear()

> **getYear**(): `number`

#### Returns

`number`

#### Defined in

[src/molad.ts:36](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L36)

***

### render()

> **render**(`locale`?, `options`?): `string`

#### Parameters

• **locale?**: `string`

Optional locale name (defaults to active locale)

• **options?**: [`CalOptions`](../type-aliases/CalOptions.md)

#### Returns

`string`

#### Defined in

[src/molad.ts:77](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/molad.ts#L77)
