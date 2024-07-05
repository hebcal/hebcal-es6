[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / HolidayEvent

# Class: HolidayEvent

Represents a built-in holiday like Pesach, Purim or Tu BiShvat

## Extends

- [`Event`](Event.md)

## Extended by

- [`AsaraBTevetEvent`](AsaraBTevetEvent.md)
- [`RoshChodeshEvent`](RoshChodeshEvent.md)
- [`RoshHashanaEvent`](RoshHashanaEvent.md)

## Constructors

### new HolidayEvent()

> **new HolidayEvent**(`date`, `desc`, `mask`?, `attrs`?): [`HolidayEvent`](HolidayEvent.md)

Constructs Event

#### Parameters

• **date**: [`HDate`](HDate.md)

Hebrew date event occurs

• **desc**: `string`

Description (not translated)

• **mask?**: `number` = `0`

optional bitmask of holiday flags (see [flags](../enumerations/flags.md))

• **attrs?**: `object`

optional additional attributes (e.g. `eventTimeStr`, `cholHaMoedDay`)

#### Returns

[`HolidayEvent`](HolidayEvent.md)

#### Inherited from

[`Event`](Event.md).[`constructor`](Event.md#constructors)

#### Defined in

[src/event.ts:97](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L97)

## Properties

### alarm?

> `optional` **alarm**: `string` \| `boolean` \| `Date`

#### Inherited from

[`Event`](Event.md).[`alarm`](Event.md#alarm)

#### Defined in

[src/event.ts:89](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L89)

***

### chanukahDay?

> `optional` **chanukahDay**: `number`

#### Defined in

[src/HolidayEvent.ts:23](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L23)

***

### cholHaMoedDay?

> `optional` **cholHaMoedDay**: `number`

During Sukkot or Pesach

#### Defined in

[src/HolidayEvent.ts:22](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L22)

***

### date

> `readonly` **date**: [`HDate`](HDate.md)

#### Inherited from

[`Event`](Event.md).[`date`](Event.md#date)

#### Defined in

[src/event.ts:84](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L84)

***

### desc

> `readonly` **desc**: `string`

#### Inherited from

[`Event`](Event.md).[`desc`](Event.md#desc)

#### Defined in

[src/event.ts:85](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L85)

***

### emoji?

> `optional` **emoji**: `string`

#### Inherited from

[`Event`](Event.md).[`emoji`](Event.md#emoji)

#### Defined in

[src/event.ts:87](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L87)

***

### endEvent?

> `optional` **endEvent**: [`TimedEvent`](TimedEvent.md)

For a Fast day, this will be a "Fast ends" event

#### Defined in

[src/HolidayEvent.ts:33](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L33)

***

### mask

> `readonly` **mask**: `number`

#### Inherited from

[`Event`](Event.md).[`mask`](Event.md#mask)

#### Defined in

[src/event.ts:86](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L86)

***

### memo?

> `optional` **memo**: `string`

#### Inherited from

[`Event`](Event.md).[`memo`](Event.md#memo)

#### Defined in

[src/event.ts:88](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L88)

***

### observed?

> `optional` **observed**: `boolean`

`true` if the fast day was postponed a day to avoid Shabbat.
- Tish'a B'Av postponed from the 9th to the 10th
- Tzom Tammuz postponed from the 17th to the 18th

#### Defined in

[src/HolidayEvent.ts:29](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L29)

***

### startEvent?

> `optional` **startEvent**: [`TimedEvent`](TimedEvent.md)

For a Fast day, this will be a "Fast begins" event

#### Defined in

[src/HolidayEvent.ts:31](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L31)

## Methods

### basename()

> **basename**(): `string`

#### Returns

`string`

#### Overrides

[`Event`](Event.md).[`basename`](Event.md#basename)

#### Defined in

[src/HolidayEvent.ts:35](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L35)

***

### clone()

> **clone**(): [`HolidayEvent`](HolidayEvent.md)

Makes a clone of this Event object

#### Returns

[`HolidayEvent`](HolidayEvent.md)

#### Overrides

[`Event`](Event.md).[`clone`](Event.md#clone)

#### Defined in

[src/HolidayEvent.ts:110](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L110)

***

### getCategories()

> **getCategories**(): `string`[]

#### Returns

`string`[]

#### Overrides

[`Event`](Event.md).[`getCategories`](Event.md#getcategories)

#### Defined in

[src/HolidayEvent.ts:72](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L72)

***

### getDate()

> **getDate**(): [`HDate`](HDate.md)

Hebrew date of this event

#### Returns

[`HDate`](HDate.md)

#### Inherited from

[`Event`](Event.md).[`getDate`](Event.md#getdate)

#### Defined in

[src/event.ts:113](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L113)

***

### getDesc()

> **getDesc**(): `string`

Untranslated description of this event

#### Returns

`string`

#### Inherited from

[`Event`](Event.md).[`getDesc`](Event.md#getdesc)

#### Defined in

[src/event.ts:119](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L119)

***

### getEmoji()

> **getEmoji**(): `string`

#### Returns

`string`

#### Overrides

[`Event`](Event.md).[`getEmoji`](Event.md#getemoji)

#### Defined in

[src/HolidayEvent.ts:62](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L62)

***

### getFlags()

> **getFlags**(): `number`

Bitmask of optional event flags. See [flags](../enumerations/flags.md)

#### Returns

`number`

#### Inherited from

[`Event`](Event.md).[`getFlags`](Event.md#getflags)

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

[`Event`](Event.md).[`observedIn`](Event.md#observedin)

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

[`Event`](Event.md).[`observedInDiaspora`](Event.md#observedindiaspora)

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

[`Event`](Event.md).[`observedInIsrael`](Event.md#observedinisrael)

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

[`Event`](Event.md).[`render`](Event.md#render)

#### Defined in

[src/HolidayEvent.ts:93](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L93)

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

#### Overrides

[`Event`](Event.md).[`renderBrief`](Event.md#renderbrief)

#### Defined in

[src/HolidayEvent.ts:103](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L103)

***

### url()

> **url**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Overrides

[`Event`](Event.md).[`url`](Event.md#url)

#### Defined in

[src/HolidayEvent.ts:46](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L46)

***

### urlDateSuffix()

> **urlDateSuffix**(): `string`

#### Returns

`string`

#### Defined in

[src/HolidayEvent.ts:57](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/HolidayEvent.ts#L57)
