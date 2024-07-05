[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / HebrewDateEvent

# Class: HebrewDateEvent

Daily Hebrew date ("11th of Sivan, 5780")

## Extends

- [`Event`](Event.md)

## Constructors

### new HebrewDateEvent()

> **new HebrewDateEvent**(`date`): [`HebrewDateEvent`](HebrewDateEvent.md)

#### Parameters

• **date**: [`HDate`](HDate.md)

#### Returns

[`HebrewDateEvent`](HebrewDateEvent.md)

#### Overrides

[`Event`](Event.md).[`constructor`](Event.md#constructors)

#### Defined in

[src/HebrewDateEvent.ts:10](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/HebrewDateEvent.ts#L10)

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

## Methods

### basename()

> **basename**(): `string`

Returns a simplified (untranslated) description for this event. For example,
the [HolidayEvent](HolidayEvent.md) class supports
"Erev Pesach" => "Pesach", and "Sukkot III (CH''M)" => "Sukkot".
For many holidays the basename and the event description are the same.

#### Returns

`string`

#### Inherited from

[`Event`](Event.md).[`basename`](Event.md#basename)

#### Defined in

[src/event.ts:161](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/event.ts#L161)

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

#### Parameters

• **locale?**: `string`

Optional locale name (defaults to active locale).

#### Returns

`string`

#### Example

```ts
import {HDate, HebrewDateEvent, months} from '@hebcal/core';

const hd = new HDate(15, months.CHESHVAN, 5769);
const ev = new HebrewDateEvent(hd);
console.log(ev.render('en')); // '15th of Cheshvan, 5769'
console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
```

#### Overrides

[`Event`](Event.md).[`render`](Event.md#render)

#### Defined in

[src/HebrewDateEvent.ts:23](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/HebrewDateEvent.ts#L23)

***

### renderBrief()

> **renderBrief**(`locale`?): `string`

#### Parameters

• **locale?**: `string`

Optional locale name (defaults to active locale).

#### Returns

`string`

#### Example

```ts
import {HDate, HebrewDateEvent, months} from '@hebcal/core';

const hd = new HDate(15, months.CHESHVAN, 5769);
const ev = new HebrewDateEvent(hd);
console.log(ev.renderBrief()); // '15th of Cheshvan'
console.log(ev.renderBrief('he')); // 'ט״ו חֶשְׁוָן'
```

#### Overrides

[`Event`](Event.md).[`renderBrief`](Event.md#renderbrief)

#### Defined in

[src/HebrewDateEvent.ts:57](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/HebrewDateEvent.ts#L57)

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
