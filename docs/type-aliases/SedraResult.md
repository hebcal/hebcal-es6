[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / SedraResult

# Type Alias: SedraResult

> **SedraResult**: `object`

The result from `Sedra.lookup()`

## Type declaration

### chag

> **chag**: `boolean`

True if this is a regular parasha HaShavua
Torah reading, false if it's a special holiday reading

### num?

> `optional` **num**: `number` \| `number`[]

The parsha number (or numbers) using 1-indexing.
A `number` for a regular (single) parsha, and a `number[]`
for a doubled parsha.
For Parashat *Bereshit*, `num` would be equal to `1`, and for
*Matot-Masei* it would be `[42, 43]`

### parsha

> **parsha**: `string`[]

Name of the parsha (or parshiyot) read on
Hebrew date, e.g. `['Noach']` or `['Matot', 'Masei']`

## Defined in

[src/sedra.ts:55](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/sedra.ts#L55)
