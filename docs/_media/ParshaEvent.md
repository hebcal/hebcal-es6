[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / ParshaEvent

# Class: ParshaEvent

Represents one of 54 weekly Torah portions, always on a Saturday

## Extends

- [`Event`](Event.md)

## Constructors

### new ParshaEvent()

> **new ParshaEvent**(`date`, `parsha`, `il`, `num`): [`ParshaEvent`](ParshaEvent.md)

#### Parameters

• **date**: [`HDate`](HDate.md)

• **parsha**: `string`[]

untranslated name of single or double parsha,
  such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim']

• **il**: `boolean` = `false`

• **num**: `number` \| `number`[] = `-1`

#### Returns

[`ParshaEvent`](ParshaEvent.md)

#### Overrides

[`Event`](Event.md).[`constructor`](Event.md#constructors)

#### Defined in

[src/ParshaEvent.ts:16](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L16)

## Properties

### alarm?

> `optional` **alarm**: `string` \| `boolean` \| `Date`

#### Inherited from

[`Event`](Event.md).[`alarm`](Event.md#alarm)

#### Defined in

[src/event.ts:89](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L89)

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

### il

> `readonly` **il**: `boolean`

#### Defined in

[src/ParshaEvent.ts:10](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L10)

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

### num

> `readonly` **num**: `number` \| `number`[]

#### Defined in

[src/ParshaEvent.ts:11](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L11)

***

### parsha

> `readonly` **parsha**: `string`[]

#### Defined in

[src/ParshaEvent.ts:9](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L9)

## Methods

### basename()

> **basename**(): `string`

#### Returns

`string`

#### Overrides

[`Event`](Event.md).[`basename`](Event.md#basename)

#### Defined in

[src/ParshaEvent.ts:42](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L42)

***

### clone()

> **clone**(): [`Event`](Event.md)

Makes a clone of this Event object

#### Returns

[`Event`](Event.md)

#### Inherited from

[`Event`](Event.md).[`clone`](Event.md#clone)

#### Defined in

[src/event.ts:210](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L210)

***

### getCategories()

> **getCategories**(): `string`[]

Returns a list of event categories

#### Returns

`string`[]

#### Inherited from

[`Event`](Event.md).[`getCategories`](Event.md#getcategories)

#### Defined in

[src/event.ts:222](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L222)

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

> **getEmoji**(): `null` \| `string`

Optional holiday-specific Emoji or `null`.

#### Returns

`null` \| `string`

#### Inherited from

[`Event`](Event.md).[`getEmoji`](Event.md#getemoji)

#### Defined in

[src/event.ts:152](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L152)

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

#### Parameters

• **locale?**: `string`

Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.

#### Returns

`string`

#### Overrides

[`Event`](Event.md).[`render`](Event.md#render)

#### Defined in

[src/ParshaEvent.ts:29](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L29)

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

[`Event`](Event.md).[`renderBrief`](Event.md#renderbrief)

#### Defined in

[src/event.ts:146](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L146)

***

### url()

> **url**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

#### Overrides

[`Event`](Event.md).[`url`](Event.md#url)

#### Defined in

[src/ParshaEvent.ts:46](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L46)

***

### urlDateSuffix()

> **urlDateSuffix**(): `string`

#### Returns

`string`

#### Defined in

[src/ParshaEvent.ts:58](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/ParshaEvent.ts#L58)
