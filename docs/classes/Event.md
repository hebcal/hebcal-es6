[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / Event

# Class: Event

Represents an Event with a title, date, and flags

## Extended by

- [`HebrewDateEvent`](HebrewDateEvent.md)
- [`TimedEvent`](TimedEvent.md)
- [`MoladEvent`](MoladEvent.md)
- [`OmerEvent`](OmerEvent.md)
- [`ParshaEvent`](ParshaEvent.md)
- [`HolidayEvent`](HolidayEvent.md)
- [`MevarchimChodeshEvent`](MevarchimChodeshEvent.md)

## Constructors

### new Event()

> **new Event**(`date`, `desc`, `mask`?, `attrs`?): [`Event`](Event.md)

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

[`Event`](Event.md)

#### Defined in

[src/event.ts:97](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L97)

## Properties

### alarm?

> `optional` **alarm**: `string` \| `boolean` \| `Date`

#### Defined in

[src/event.ts:89](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L89)

***

### date

> `readonly` **date**: [`HDate`](HDate.md)

#### Defined in

[src/event.ts:84](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L84)

***

### desc

> `readonly` **desc**: `string`

#### Defined in

[src/event.ts:85](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L85)

***

### emoji?

> `optional` **emoji**: `string`

#### Defined in

[src/event.ts:87](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L87)

***

### mask

> `readonly` **mask**: `number`

#### Defined in

[src/event.ts:86](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L86)

***

### memo?

> `optional` **memo**: `string`

#### Defined in

[src/event.ts:88](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L88)

## Methods

### basename()

> **basename**(): `string`

Returns a simplified (untranslated) description for this event. For example,
the [HolidayEvent](HolidayEvent.md) class supports
"Erev Pesach" => "Pesach", and "Sukkot III (CH''M)" => "Sukkot".
For many holidays the basename and the event description are the same.

#### Returns

`string`

#### Defined in

[src/event.ts:161](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L161)

***

### clone()

> **clone**(): [`Event`](Event.md)

Makes a clone of this Event object

#### Returns

[`Event`](Event.md)

#### Defined in

[src/event.ts:210](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L210)

***

### getCategories()

> **getCategories**(): `string`[]

Returns a list of event categories

#### Returns

`string`[]

#### Defined in

[src/event.ts:222](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L222)

***

### getDate()

> **getDate**(): [`HDate`](HDate.md)

Hebrew date of this event

#### Returns

[`HDate`](HDate.md)

#### Defined in

[src/event.ts:113](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L113)

***

### getDesc()

> **getDesc**(): `string`

Untranslated description of this event

#### Returns

`string`

#### Defined in

[src/event.ts:119](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L119)

***

### getEmoji()

> **getEmoji**(): `null` \| `string`

Optional holiday-specific Emoji or `null`.

#### Returns

`null` \| `string`

#### Defined in

[src/event.ts:152](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L152)

***

### getFlags()

> **getFlags**(): `number`

Bitmask of optional event flags. See [flags](../enumerations/flags.md)

#### Returns

`number`

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

#### Example

```ts
const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
ev.render('en'); // 'Shavuot'
ev.render('he'); // 'שָׁבוּעוֹת'
ev.render('ashkenazi'); // 'Shavuos'
```

#### Defined in

[src/event.ts:137](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L137)

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

#### Defined in

[src/event.ts:146](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L146)

***

### url()

> **url**(): `undefined` \| `string`

Returns a URL to hebcal.com or sefaria.org for more detail on the event.
Returns `undefined` for events with no detail page.

#### Returns

`undefined` \| `string`

#### Defined in

[src/event.ts:168](https://github.com/hebcal/hebcal-es6/blob/3368d3d0f182fa8667ccf03cc5e03586ceb1661f/src/event.ts#L168)
