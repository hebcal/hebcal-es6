[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / MevarchimChodeshEvent

# Class: MevarchimChodeshEvent

Represents Mevarchim haChodesh, the announcement of the new month

## Extends

- [`Event`](Event.md)

## Constructors

### new MevarchimChodeshEvent()

> **new MevarchimChodeshEvent**(`date`, `monthName`, `memo`?): [`MevarchimChodeshEvent`](MevarchimChodeshEvent.md)

Constructs Mevarchim haChodesh event

#### Parameters

• **date**: [`HDate`](HDate.md)

Hebrew date event occurs

• **monthName**: `string`

Hebrew month name (not translated)

• **memo?**: `string`

#### Returns

[`MevarchimChodeshEvent`](MevarchimChodeshEvent.md)

#### Overrides

[`Event`](Event.md).[`constructor`](Event.md#constructors)

#### Defined in

[src/MevarchimChodeshEvent.ts:17](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/MevarchimChodeshEvent.ts#L17)

## Properties

### alarm?

> `optional` **alarm**: `string` \| `boolean` \| `Date`

#### Inherited from

[`Event`](Event.md).[`alarm`](Event.md#alarm)

#### Defined in

[src/event.ts:89](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L89)

***

### date

> `readonly` **date**: [`HDate`](HDate.md)

#### Inherited from

[`Event`](Event.md).[`date`](Event.md#date)

#### Defined in

[src/event.ts:84](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L84)

***

### desc

> `readonly` **desc**: `string`

#### Inherited from

[`Event`](Event.md).[`desc`](Event.md#desc)

#### Defined in

[src/event.ts:85](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L85)

***

### emoji?

> `optional` **emoji**: `string`

#### Inherited from

[`Event`](Event.md).[`emoji`](Event.md#emoji)

#### Defined in

[src/event.ts:87](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L87)

***

### mask

> `readonly` **mask**: `number`

#### Inherited from

[`Event`](Event.md).[`mask`](Event.md#mask)

#### Defined in

[src/event.ts:86](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L86)

***

### memo?

> `optional` **memo**: `string`

#### Inherited from

[`Event`](Event.md).[`memo`](Event.md#memo)

#### Defined in

[src/event.ts:88](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L88)

***

### monthName

> `readonly` **monthName**: `string`

#### Defined in

[src/MevarchimChodeshEvent.ts:10](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/MevarchimChodeshEvent.ts#L10)

## Methods

### basename()

> **basename**(): `string`

#### Returns

`string`

#### Overrides

[`Event`](Event.md).[`basename`](Event.md#basename)

#### Defined in

[src/MevarchimChodeshEvent.ts:31](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/MevarchimChodeshEvent.ts#L31)

***

### clone()

> **clone**(): [`Event`](Event.md)

Makes a clone of this Event object

#### Returns

[`Event`](Event.md)

#### Inherited from

[`Event`](Event.md).[`clone`](Event.md#clone)

#### Defined in

[src/event.ts:210](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L210)

***

### getCategories()

> **getCategories**(): `string`[]

Returns a list of event categories

#### Returns

`string`[]

#### Inherited from

[`Event`](Event.md).[`getCategories`](Event.md#getcategories)

#### Defined in

[src/event.ts:222](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L222)

***

### getDate()

> **getDate**(): [`HDate`](HDate.md)

Hebrew date of this event

#### Returns

[`HDate`](HDate.md)

#### Inherited from

[`Event`](Event.md).[`getDate`](Event.md#getdate)

#### Defined in

[src/event.ts:113](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L113)

***

### getDesc()

> **getDesc**(): `string`

Untranslated description of this event

#### Returns

`string`

#### Inherited from

[`Event`](Event.md).[`getDesc`](Event.md#getdesc)

#### Defined in

[src/event.ts:119](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L119)

***

### getEmoji()

> **getEmoji**(): `null` \| `string`

Optional holiday-specific Emoji or `null`.

#### Returns

`null` \| `string`

#### Inherited from

[`Event`](Event.md).[`getEmoji`](Event.md#getemoji)

#### Defined in

[src/event.ts:152](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L152)

***

### getFlags()

> **getFlags**(): `number`

Bitmask of optional event flags. See [flags](../enumerations/flags.md)

#### Returns

`number`

#### Inherited from

[`Event`](Event.md).[`getFlags`](Event.md#getflags)

#### Defined in

[src/event.ts:125](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L125)

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

[src/event.ts:204](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L204)

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

[src/event.ts:190](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L190)

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

[src/event.ts:179](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L179)

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

[src/MevarchimChodeshEvent.ts:38](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/MevarchimChodeshEvent.ts#L38)

***

### renderBrief()

> **renderBrief**(`locale`?): `string`

Returns (translated) description of this event

#### Parameters

• **locale?**: `string`

Optional locale name (defaults to active locale).

#### Returns

`string`

#### Overrides

[`Event`](Event.md).[`renderBrief`](Event.md#renderbrief)

#### Defined in

[src/MevarchimChodeshEvent.ts:47](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/MevarchimChodeshEvent.ts#L47)

***

### url()

> **url**(): `undefined` \| `string`

Returns a URL to hebcal.com or sefaria.org for more detail on the event.
Returns `undefined` for events with no detail page.

#### Returns

`undefined` \| `string`

#### Inherited from

[`Event`](Event.md).[`url`](Event.md#url)

#### Defined in

[src/event.ts:168](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L168)
