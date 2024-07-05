[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / DailyLearning

# Class: DailyLearning

Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.

Learning schedules are provided by the `@hebcal/learning` package.

## Constructors

### new DailyLearning()

> **new DailyLearning**(): [`DailyLearning`](DailyLearning.md)

#### Returns

[`DailyLearning`](DailyLearning.md)

## Methods

### addCalendar()

> `static` **addCalendar**(`name`, `calendar`): `void`

Register a new learning calendar.

#### Parameters

• **name**: `string`

• **calendar**: `Function`

#### Returns

`void`

#### Defined in

[src/DailyLearning.ts:16](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/DailyLearning.ts#L16)

***

### lookup()

> `static` **lookup**(`name`, `hd`, `il`): `null` \| [`Event`](Event.md)

Returns an event from daily calendar for a given date. Returns `null` if there
is no learning from this calendar on this date.

#### Parameters

• **name**: `string`

• **hd**: [`HDate`](HDate.md)

• **il**: `boolean`

#### Returns

`null` \| [`Event`](Event.md)

#### Defined in

[src/DailyLearning.ts:30](https://github.com/hebcal/hebcal-es6/blob/7a48c07548d61e9c93ae14253436cf206e280c87/src/DailyLearning.ts#L30)
