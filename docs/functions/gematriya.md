[**@hebcal/core**](../README.md) • **Docs**

***

[@hebcal/core](../globals.md) / gematriya

# Function: gematriya()

> **gematriya**(`num`): `string`

Converts a numerical value to a string of Hebrew letters.

When specifying years of the Hebrew calendar in the present millennium,
we omit the thousands (which is presently 5 [ה]).

## Parameters

• **num**: `string` \| `number`

## Returns

`string`

## Example

```ts
gematriya(5774) // 'תשע״ד' - cropped to 774
gematriya(25) // 'כ״ה'
gematriya(60) // 'ס׳'
gematriya(3761) // 'ג׳תשס״א'
gematriya(1123) // 'א׳קכ״ג'
```

## Defined in

node\_modules/@hebcal/hdate/dist/gematriya.d.ts:15
