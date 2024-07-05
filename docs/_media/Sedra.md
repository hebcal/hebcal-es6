[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / Sedra

# Class: Sedra

Represents Parashah HaShavua for an entire Hebrew year

## Constructors

### new Sedra()

> **new Sedra**(`hyear`, `il`): [`Sedra`](Sedra.md)

Caculates the Parashah HaShavua for an entire Hebrew year

#### Parameters

• **hyear**: `number`

Hebrew year (e.g. 5749)

• **il**: `boolean`

Use Israel sedra schedule (false for Diaspora)

#### Returns

[`Sedra`](Sedra.md)

#### Defined in

[src/sedra.ts:89](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L89)

## Methods

### find()

> **find**(`parsha`): `null` \| [`HDate`](HDate.md)

Returns the date that a parsha occurs
or `null` if the parsha doesn't occur this year

#### Parameters

• **parsha**: `string` \| `number` \| `string`[]

#### Returns

`null` \| [`HDate`](HDate.md)

#### Defined in

[src/sedra.ts:154](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L154)

***

### get()

> **get**(`hd`): `string`[]

Returns the parsha (or parshiyot) read on Hebrew date

#### Parameters

• **hd**: `number` \| [`HDate`](HDate.md)

Hebrew date or R.D. days

#### Returns

`string`[]

#### Defined in

[src/sedra.ts:120](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L120)

***

### getFirstSaturday()

> **getFirstSaturday**(): `number`

R.D. date of the first Saturday on or after Rosh Hashana

#### Returns

`number`

#### Defined in

[src/sedra.ts:208](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L208)

***

### getSedraArray()

> **getSedraArray**(): `NumberOrString`[]

Returns the underlying annual sedra schedule.
Used by `@hebcal/triennial`

#### Returns

`NumberOrString`[]

#### Defined in

[src/sedra.ts:201](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L201)

***

### getString()

> **getString**(`hd`, `locale`?): `string`

Looks up parsha for the date, then returns a translated or transliterated string

#### Parameters

• **hd**: `number` \| [`HDate`](HDate.md)

Hebrew date or R.D. days

• **locale?**: `string`

Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale

#### Returns

`string`

#### Defined in

[src/sedra.ts:129](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L129)

***

### getYear()

> **getYear**(): `number`

#### Returns

`number`

#### Defined in

[src/sedra.ts:213](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L213)

***

### isParsha()

> **isParsha**(`hd`): `boolean`

Checks to see if this day would be a regular parasha HaShavua
Torah reading or special holiday reading

#### Parameters

• **hd**: `number` \| [`HDate`](HDate.md)

Hebrew date or R.D. days

#### Returns

`boolean`

#### Defined in

[src/sedra.ts:146](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L146)

***

### lookup()

> **lookup**(`hd`): [`SedraResult`](../type-aliases/SedraResult.md)

Returns an object describing the parsha on the first Saturday on or after `hd`

#### Parameters

• **hd**: `number` \| [`HDate`](HDate.md)

Hebrew date or R.D. days

#### Returns

[`SedraResult`](../type-aliases/SedraResult.md)

#### Defined in

[src/sedra.ts:221](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/sedra.ts#L221)
