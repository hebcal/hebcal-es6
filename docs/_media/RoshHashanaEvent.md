[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / RoshHashanaEvent

# Class: RoshHashanaEvent

Represents Rosh Hashana, the Jewish New Year

## Extends

- [`HolidayEvent`](HolidayEvent.md)

## Properties

### alarm?

> `optional` **alarm**: `string` \| `boolean` \| `Date`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`alarm`](HolidayEvent.md#alarm)

#### Defined in

[src/event.ts:89](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L89)

***

### chanukahDay?

> `optional` **chanukahDay**: `number`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`chanukahDay`](HolidayEvent.md#chanukahday)

#### Defined in

[src/HolidayEvent.ts:23](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L23)

***

### cholHaMoedDay?

> `optional` **cholHaMoedDay**: `number`

During Sukkot or Pesach

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`cholHaMoedDay`](HolidayEvent.md#cholhamoedday)

#### Defined in

[src/HolidayEvent.ts:22](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L22)

***

### date

> `readonly` **date**: [`HDate`](HDate.md)

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`date`](HolidayEvent.md#date)

#### Defined in

[src/event.ts:84](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L84)

***

### desc

> `readonly` **desc**: `string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`desc`](HolidayEvent.md#desc)

#### Defined in

[src/event.ts:85](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L85)

***

### emoji?

> `optional` **emoji**: `string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`emoji`](HolidayEvent.md#emoji)

#### Defined in

[src/event.ts:87](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L87)

***

### endEvent?

> `optional` **endEvent**: [`TimedEvent`](TimedEvent.md)

For a Fast day, this will be a "Fast ends" event

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`endEvent`](HolidayEvent.md#endevent)

#### Defined in

[src/HolidayEvent.ts:33](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L33)

***

### mask

> `readonly` **mask**: `number`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`mask`](HolidayEvent.md#mask)

#### Defined in

[src/event.ts:86](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L86)

***

### memo?

> `optional` **memo**: `string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`memo`](HolidayEvent.md#memo)

#### Defined in

[src/event.ts:88](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L88)

***

### observed?

> `optional` **observed**: `boolean`

`true` if the fast day was postponed a day to avoid Shabbat.
- Tish'a B'Av postponed from the 9th to the 10th
- Tzom Tammuz postponed from the 17th to the 18th

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`observed`](HolidayEvent.md#observed)

#### Defined in

[src/HolidayEvent.ts:29](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L29)

***

### startEvent?

> `optional` **startEvent**: [`TimedEvent`](TimedEvent.md)

For a Fast day, this will be a "Fast begins" event

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`startEvent`](HolidayEvent.md#startevent)

#### Defined in

[src/HolidayEvent.ts:31](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L31)

## Methods

### basename()

> **basename**(): `string`

#### Returns

`string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`basename`](HolidayEvent.md#basename)

#### Defined in

[src/HolidayEvent.ts:35](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L35)

***

### clone()

> **clone**(): [`HolidayEvent`](HolidayEvent.md)

Makes a clone of this Event object

#### Returns

[`HolidayEvent`](HolidayEvent.md)

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`clone`](HolidayEvent.md#clone)

#### Defined in

[src/HolidayEvent.ts:110](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L110)

***

### getCategories()

> **getCategories**(): `string`[]

#### Returns

`string`[]

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`getCategories`](HolidayEvent.md#getcategories)

#### Defined in

[src/HolidayEvent.ts:72](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L72)

***

### getDate()

> **getDate**(): [`HDate`](HDate.md)

Hebrew date of this event

#### Returns

[`HDate`](HDate.md)

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`getDate`](HolidayEvent.md#getdate)

#### Defined in

[src/event.ts:113](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L113)

***

### getDesc()

> **getDesc**(): `string`

Untranslated description of this event

#### Returns

`string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`getDesc`](HolidayEvent.md#getdesc)

#### Defined in

[src/event.ts:119](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L119)

***

### getEmoji()

> **getEmoji**(): `string`

#### Returns

`string`

#### Overrides

[`HolidayEvent`](HolidayEvent.md).[`getEmoji`](HolidayEvent.md#getemoji)

#### Defined in

[src/HolidayEvent.ts:154](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L154)

***

### getFlags()

> **getFlags**(): `number`

Bitmask of optional event flags. See [flags](../enumerations/flags.md)

#### Returns

`number`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`getFlags`](HolidayEvent.md#getflags)

#### Defined in

[src/event.ts:125](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L125)

***

### observedIn()

> **observedIn**(`il`): `boolean`

Is this event observed in Israel/Diaspora?

#### Parameters

• **il**: `boolean`

#### Returns

`boolean`

#### Example

```ts
const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
ev1.observedIn(false); // true
ev1.observedIn(true); // false
const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
ev2.observedIn(false); // true
ev2.observedIn(true); // true
```

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`observedIn`](HolidayEvent.md#observedin)

#### Defined in

[src/event.ts:204](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L204)

***

### observedInDiaspora()

> **observedInDiaspora**(): `boolean`

Is this event observed in the Diaspora?

#### Returns

`boolean`

#### Example

```ts
const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
ev1.observedInDiaspora(); // true
const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
ev2.observedInDiaspora(); // true
```

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`observedInDiaspora`](HolidayEvent.md#observedindiaspora)

#### Defined in

[src/event.ts:190](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L190)

***

### observedInIsrael()

> **observedInIsrael**(): `boolean`

Is this event observed in Israel?

#### Returns

`boolean`

#### Example

```ts
const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
ev1.observedInIsrael(); // false
const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
ev2.observedInIsrael(); // true
```

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`observedInIsrael`](HolidayEvent.md#observedinisrael)

#### Defined in

[src/event.ts:179](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L179)

***

### render()

> **render**(`locale`?): `string`

Returns (translated) description of this event

#### Parameters

• **locale?**: `string`

Optional locale name (defaults to active locale).

#### Returns

`string`

#### Overrides

[`HolidayEvent`](HolidayEvent.md).[`render`](HolidayEvent.md#render)

#### Defined in

[src/HolidayEvent.ts:150](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L150)

***

### renderBrief()

> **renderBrief**(`locale`?): `string`

Returns a brief (translated) description of this event.
For most events, this is the same as render(). For some events, it procudes
a shorter text (e.g. without a time or added description).

#### Parameters

• **locale?**: `string`

Optional locale name (defaults to active locale).

#### Returns

`string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`renderBrief`](HolidayEvent.md#renderbrief)

#### Defined in

[src/HolidayEvent.ts:103](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L103)

***

### url()

> **url**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`url`](HolidayEvent.md#url)

#### Defined in

[src/HolidayEvent.ts:46](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L46)

***

### urlDateSuffix()

> **urlDateSuffix**(): `string`

#### Returns

`string`

#### Inherited from

[`HolidayEvent`](HolidayEvent.md).[`urlDateSuffix`](HolidayEvent.md#urldatesuffix)

#### Defined in

[src/HolidayEvent.ts:57](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L57)
