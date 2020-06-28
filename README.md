# hebcal-es6
Hebcal, a perpetual Jewish Calendar (ES6)

[![Build Status](https://travis-ci.org/hebcal/hebcal-es6.svg?branch=master)](https://travis-ci.org/hebcal/hebcal-es6)

## Installation
```bash
$ npm install @hebcal/core
```

## Synopsis
```javascript
import {hebcal, HDate, Location, Event} from '@hebcal/core';

const options = {
  year: 1981,
  isHebrewYear: false,
  candlelighting: true,
  location: Location.lookup('San Francisco'),
  sedrot: true,
  omer: true,
};
const events = hebcal.hebrewCalendar(options);

for (const ev of events) {
  const hd = ev.getDate();
  const date = hd.greg();
  console.log(date.toLocaleDateString(), ev.render(), hd.toString());
}
```

## Classes

<dl>
<dt><a href="#Event">Event</a></dt>
<dd><p>Represents an Event with a title, date, and flags</p>
</dd>
<dt><a href="#HDate">HDate</a></dt>
<dd><p>Class representing a Hebrew date</p>
</dd>
<dt><a href="#HebrewDateEvent">HebrewDateEvent</a></dt>
<dd><p>Daily Hebrew date (&quot;11th of Sivan, 5780&quot;)</p>
</dd>
<dt><a href="#Zmanim">Zmanim</a></dt>
<dd><p>Class representing halachic times</p>
</dd>
<dt><a href="#Location">Location</a></dt>
<dd><p>Class representing Location</p>
</dd>
<dt><a href="#HavdalahEvent">HavdalahEvent</a></dt>
<dd><p>Havdalah after Shabbat or holiday</p>
</dd>
<dt><a href="#CandleLightingEvent">CandleLightingEvent</a></dt>
<dd><p>Candle lighting before Shabbat or holiday</p>
</dd>
<dt><a href="#MoladEvent">MoladEvent</a></dt>
<dd><p>Represents a Molad announcement on Shabbat Mevarchim</p>
</dd>
<dt><a href="#OmerEvent">OmerEvent</a></dt>
<dd><p>Represents a day 1-49 of counting the Omer from Pesach to Shavuot</p>
</dd>
<dt><a href="#DafYomiEvent">DafYomiEvent</a></dt>
<dd><p>For a Daf Yomi, the name is already translated
attrs.dafyomi.name contains the untranslated string</p>
</dd>
<dt><a href="#Sedra">Sedra</a></dt>
<dd><p>Represents Parashah HaShavua for an entire Hebrew year</p>
</dd>
<dt><a href="#ParshaEvent">ParshaEvent</a></dt>
<dd><p>Represents one of 54 weekly Torah portions, always on a Saturday</p>
</dd>
<dt><a href="#HolidayEvent">HolidayEvent</a></dt>
<dd><p>Represents a built-in holiday like Pesach, Purim or Tu BiShvat</p>
</dd>
<dt><a href="#RoshChodeshEvent">RoshChodeshEvent</a></dt>
<dd><p>Represents Rosh Chodesh, the beginning of a new month</p>
</dd>
<dt><a href="#MevarchimChodeshEvent">MevarchimChodeshEvent</a></dt>
<dd><p>Represents Mevarchim haChodesh, the announcement of the new month</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#common">common</a> : <code>object</code></dt>
<dd><p>Hebrew date utility functions.</p>
</dd>
<dt><a href="#greg">greg</a> : <code>object</code></dt>
<dd><p>Gregorian date helper functions.</p>
</dd>
<dt><a href="#locale">locale</a> : <code>object</code></dt>
<dd><p>A locale in Hebcal is used for translations/transliterations of
holidays. @hebcal/core supports three locales by default</p>
<ul>
<li><code>en</code> - default, Sephardic transliterations (e.g. &quot;Shabbat&quot;)</li>
<li><code>ashkenazi</code> - Ashkenazi transliterations (e.g. &quot;Shabbos&quot;)</li>
<li><code>he</code> - Hebrew (e.g. &quot;שַׁבָּת&quot;)</li>
</ul>
</dd>
<dt><a href="#dafyomi">dafyomi</a> : <code>object</code></dt>
<dd><p>Low-level interface to Daf Yomi.</p>
</dd>
<dt><a href="#holidays">holidays</a> : <code>object</code></dt>
<dd><p>Lower-level holidays interface, which returns a set of Events that must be
filtered especially for <code>flags.IL_ONLY</code> or <code>flags.CHUL_ONLY</code> depending on
Israel vs. Diaspora holiday scheme.</p>
</dd>
<dt><a href="#hebcal">hebcal</a> : <code>object</code></dt>
<dd><p>Main interface to Hebcal</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#parshiot">parshiot</a></dt>
<dd><p>The 54 parshiyot of the Torah as transilterated strings
parshiot[0] == &#39;Bereshit&#39;, parshiot[1] == &#39;Noach&#39;, parshiot[53] == &#39;Ha&#39;Azinu&#39;.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SimpleHebrewDate">SimpleHebrewDate</a> : <code>Object</code></dt>
<dd><p>A simple Hebrew date object with numeric fields <code>yy</code>, <code>mm</code>, and <code>dd</code></p>
</dd>
<dt><a href="#Molad">Molad</a> : <code>Object</code></dt>
<dd><p>Represents a Molad</p>
</dd>
<dt><a href="#DafYomiResult">DafYomiResult</a> : <code>Object</code></dt>
<dd><p>A Daf Yomi result</p>
</dd>
<dt><a href="#HebcalOptions">HebcalOptions</a> : <code>Object</code></dt>
<dd><p>Options to configure which events are returned</p>
</dd>
</dl>

<a name="Event"></a>

## Event
Represents an Event with a title, date, and flags

**Kind**: global class  

* [Event](#Event)
    * [new Event(date, desc, [mask], [attrs])](#new_Event_new)
    * [.getFlags()](#Event+getFlags) ⇒ <code>number</code>
    * [.getAttrs()](#Event+getAttrs) ⇒ <code>Object</code>
    * [.observedInIsrael()](#Event+observedInIsrael) ⇒ <code>boolean</code>
    * [.observedInDiaspora()](#Event+observedInDiaspora) ⇒ <code>boolean</code>
    * [.render([locale])](#Event+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#Event+renderBrief) ⇒ <code>string</code>
    * [.getDesc()](#Event+getDesc) ⇒ <code>string</code>
    * [.basename()](#Event+basename) ⇒ <code>string</code>
    * [.getDate()](#Event+getDate) ⇒ [<code>HDate</code>](#HDate)
    * [.url()](#Event+url) ⇒ <code>string</code>

<a name="new_Event_new"></a>

### new Event(date, desc, [mask], [attrs])
Constructs Event


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | [<code>HDate</code>](#HDate) |  | Hebrew date event occurs |
| desc | <code>string</code> |  | Description (not translated) |
| [mask] | <code>number</code> | <code>0</code> | optional holiday flags |
| [attrs] | <code>Object</code> | <code>{}</code> |  |

<a name="Event+getFlags"></a>

### event.getFlags() ⇒ <code>number</code>
**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getAttrs"></a>

### event.getAttrs() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+observedInIsrael"></a>

### event.observedInIsrael() ⇒ <code>boolean</code>
Is this event observed in Israel?

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+observedInDiaspora"></a>

### event.observedInDiaspora() ⇒ <code>boolean</code>
Is this event observed in the Diaspora?

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+render"></a>

### event.render([locale]) ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="Event+renderBrief"></a>

### event.renderBrief([locale]) ⇒ <code>string</code>
Returns a brief (translated) description of this event.
For most events, this is the same as render(). For some events, it procudes
a shorter text (e.g. without a time or added description).

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="Event+getDesc"></a>

### event.getDesc() ⇒ <code>string</code>
Returns untranslated description of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+basename"></a>

### event.basename() ⇒ <code>string</code>
Returns a simplified (untranslated) description for this event. For example,
"Erev Pesach" => "Pesach", and "Sukkot III (CH''M)" => "Sukkot".
For many holidays the basename and the event description are the same.

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getDate"></a>

### event.getDate() ⇒ [<code>HDate</code>](#HDate)
Returns Hebrew date of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+url"></a>

### event.url() ⇒ <code>string</code>
**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="HDate"></a>

## HDate
Class representing a Hebrew date

**Kind**: global class  

* [HDate](#HDate)
    * [new HDate([day], [month], [year])](#new_HDate_new)
    * [.getFullYear()](#HDate+getFullYear) ⇒ <code>number</code>
    * [.isLeapYear()](#HDate+isLeapYear) ⇒ <code>boolean</code>
    * [.getMonth()](#HDate+getMonth) ⇒ <code>number</code>
    * [.getTishreiMonth()](#HDate+getTishreiMonth) ⇒ <code>number</code>
    * [.daysInMonth()](#HDate+daysInMonth) ⇒ <code>number</code>
    * [.getDate()](#HDate+getDate) ⇒ <code>number</code>
    * [.getDay()](#HDate+getDay) ⇒ <code>number</code>
    * [.setFullYear(year)](#HDate+setFullYear) ⇒ [<code>HDate</code>](#HDate)
    * [.setMonth(month)](#HDate+setMonth) ⇒ [<code>HDate</code>](#HDate)
    * [.setTishreiMonth(month)](#HDate+setTishreiMonth) ⇒ [<code>HDate</code>](#HDate)
    * [.setDate(date)](#HDate+setDate) ⇒ [<code>HDate</code>](#HDate)
    * [.greg()](#HDate+greg) ⇒ <code>Date</code>
    * [.abs()](#HDate+abs) ⇒ <code>number</code>
    * [.getMonthName()](#HDate+getMonthName) ⇒ <code>string</code>
    * [.render([locale])](#HDate+render) ⇒ <code>string</code>
    * [.renderGematriya()](#HDate+renderGematriya) ⇒ <code>string</code>
    * [.before(day)](#HDate+before) ⇒ [<code>HDate</code>](#HDate)
    * [.onOrBefore(dow)](#HDate+onOrBefore) ⇒ [<code>HDate</code>](#HDate)
    * [.nearest(dow)](#HDate+nearest) ⇒ [<code>HDate</code>](#HDate)
    * [.onOrAfter(dow)](#HDate+onOrAfter) ⇒ [<code>HDate</code>](#HDate)
    * [.after(day)](#HDate+after) ⇒ [<code>HDate</code>](#HDate)
    * [.next()](#HDate+next) ⇒ [<code>HDate</code>](#HDate)
    * [.prev()](#HDate+prev) ⇒ [<code>HDate</code>](#HDate)
    * [.isSameDate(other)](#HDate+isSameDate) ⇒ <code>boolean</code>
    * [.toString()](#HDate+toString) ⇒ <code>string</code>

<a name="new_HDate_new"></a>

### new HDate([day], [month], [year])
Create a Hebrew date. There are 3 basic forms for the `HDate()` constructor.

1. No parameters - represents the current Hebrew date at time of instantiation
2. One parameter
   * `Date` - represents the Hebrew date corresponding to the Gregorian date using
      local time. Hours, minutes, seconds and milliseconds are ignored.
   * `HDate` - clones a copy of the given Hebrew date
   * `number` - Converts absolute Julian days to Hebrew date. The absolute Julian
      date is the number of days elapsed since the (imaginary) Gregorian date
      Sunday, December 31, 1 BC
3. Three parameters: Hebrew day, Hebrew month, Hebrew year. Hebrew day should
   be a number between 1-30, Hebrew month can be a number or string, and
   Hebrew year is always a number.


| Param | Type | Description |
| --- | --- | --- |
| [day] | <code>number</code> \| <code>Date</code> \| [<code>HDate</code>](#HDate) | Day of month (1-30) if a `number`.   If a `Date` is specified, represents the Hebrew date corresponding to the   Gregorian date using local time.   If an `HDate` is specified, clones a copy of the given Hebrew date. |
| [month] | <code>number</code> \| <code>string</code> | Hebrew month of year (1=NISAN, 7=TISHREI) |
| [year] | <code>number</code> | Hebrew year |

**Example**  
```js
import {HDate, common} from '@hebcal/core';

const hd1 = new HDate();
const hd2 = new HDate(new Date(2008, 10, 13));
const hd3 = new HDate(15, 'Cheshvan', 5769);
const hd4 = new HDate(15, common.months.CHESHVAN, 5769);
const hd5 = new HDate(733359); // ==> 15 Cheshvan 5769
const monthName = 'אייר';
const hd6 = new HDate(5, monthName, 5773);
```
<a name="HDate+getFullYear"></a>

### hDate.getFullYear() ⇒ <code>number</code>
Gets the Hebrew year of this Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+isLeapYear"></a>

### hDate.isLeapYear() ⇒ <code>boolean</code>
Tests if this date occurs during a leap year

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+getMonth"></a>

### hDate.getMonth() ⇒ <code>number</code>
Gets the Hebrew month (1=NISAN, 7=TISHREI) of this Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+getTishreiMonth"></a>

### hDate.getTishreiMonth() ⇒ <code>number</code>
The Tishrei-based month of the date. 1 is Tishrei, 7 is Nisan, 13 is Elul in a leap year

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+daysInMonth"></a>

### hDate.daysInMonth() ⇒ <code>number</code>
Number of days in the month of this Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+getDate"></a>

### hDate.getDate() ⇒ <code>number</code>
Gets the day within the month (1-30)

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+getDay"></a>

### hDate.getDay() ⇒ <code>number</code>
Gets the day of the week, using local time. 0=Sunday, 6=Saturday

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+setFullYear"></a>

### hDate.setFullYear(year) ⇒ [<code>HDate</code>](#HDate)
Sets the year of the date. Returns the object it was called upon.

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 

<a name="HDate+setMonth"></a>

### hDate.setMonth(month) ⇒ [<code>HDate</code>](#HDate)
Sets the day of the month of the date. Returns the object it was called upon

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| month | <code>number</code> | 

<a name="HDate+setTishreiMonth"></a>

### hDate.setTishreiMonth(month) ⇒ [<code>HDate</code>](#HDate)
Sets the Tishrei-based month of the date. Returns the object it was called upon

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| month | <code>number</code> | 

<a name="HDate+setDate"></a>

### hDate.setDate(date) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| date | <code>number</code> | 

<a name="HDate+greg"></a>

### hDate.greg() ⇒ <code>Date</code>
Converts to Gregorian date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+abs"></a>

### hDate.abs() ⇒ <code>number</code>
Returns Julian absolute days

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+getMonthName"></a>

### hDate.getMonthName() ⇒ <code>string</code>
Returns a transliterated Hebrew month name, e.g. `'Elul'` or `'Cheshvan'`.

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+render"></a>

### hDate.render([locale]) ⇒ <code>string</code>
Renders this Hebrew date as a translated or transliterated string,
including ordinal e.g. `'15th of Cheshvan, 5769'`.

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

**Example**  
```js
import {HDate, common} from '@hebcal/core';

const hd = new HDate(15, common.months.CHESHVAN, 5769);
console.log(hd.render()); // '15th of Cheshvan, 5769'
console.log(hd.render('he')); // '15 חֶשְׁוָן, 5769'
```
<a name="HDate+renderGematriya"></a>

### hDate.renderGematriya() ⇒ <code>string</code>
Renders this Hebrew date in Hebrew gematriya, regardless of locale.

**Kind**: instance method of [<code>HDate</code>](#HDate)  
**Example**  
```js
import {HDate, common} from '@hebcal/core';
const hd = new HDate(15, common.months.CHESHVAN, 5769);
console.log(ev.renderGematriya()); // 'ט״ו חֶשְׁוָן תשס״ט'
```
<a name="HDate+before"></a>

### hDate.before(day) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the a dayNumber before the current date.
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

**Example**  
```js
new HDate(new Date('Wednesday February 19, 2014')).before(6).greg() // Sat Feb 15 2014
```
<a name="HDate+onOrBefore"></a>

### hDate.onOrBefore(dow) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the a dayNumber on or before the current date.
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | day of week |

**Example**  
```js
new HDate(new Date('Wednesday February 19, 2014')).onOrBefore(6).greg() // Sat Feb 15 2014
new HDate(new Date('Saturday February 22, 2014')).onOrBefore(6).greg() // Sat Feb 22 2014
new HDate(new Date('Sunday February 23, 2014')).onOrBefore(6).greg() // Sat Feb 22 2014
```
<a name="HDate+nearest"></a>

### hDate.nearest(dow) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the nearest dayNumber to the current date
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | day of week |

**Example**  
```js
new HDate(new Date('Wednesday February 19, 2014')).nearest(6).greg() // Sat Feb 22 2014
new HDate(new Date('Tuesday February 18, 2014')).nearest(6).greg() // Sat Feb 15 2014
```
<a name="HDate+onOrAfter"></a>

### hDate.onOrAfter(dow) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the a dayNumber on or after the current date.
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | day of week |

**Example**  
```js
new HDate(new Date('Wednesday February 19, 2014')).onOrAfter(6).greg() // Sat Feb 22 2014
new HDate(new Date('Saturday February 22, 2014')).onOrAfter(6).greg() // Sat Feb 22 2014
new HDate(new Date('Sunday February 23, 2014')).onOrAfter(6).greg() // Sat Mar 01 2014
```
<a name="HDate+after"></a>

### hDate.after(day) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the a dayNumber after the current date.
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

**Example**  
```js
new HDate(new Date('Wednesday February 19, 2014')).after(6).greg() // Sat Feb 22 2014
new HDate(new Date('Saturday February 22, 2014')).after(6).greg() // Sat Mar 01 2014
new HDate(new Date('Sunday February 23, 2014')).after(6).greg() // Sat Mar 01 2014
```
<a name="HDate+next"></a>

### hDate.next() ⇒ [<code>HDate</code>](#HDate)
Returns the next Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+prev"></a>

### hDate.prev() ⇒ [<code>HDate</code>](#HDate)
Returns the previous Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+isSameDate"></a>

### hDate.isSameDate(other) ⇒ <code>boolean</code>
Compares this date to another date, returning `true` if the dates match.

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>HDate</code>](#HDate) | Hebrew date to compare |

<a name="HDate+toString"></a>

### hDate.toString() ⇒ <code>string</code>
**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HebrewDateEvent"></a>

## HebrewDateEvent
Daily Hebrew date ("11th of Sivan, 5780")

**Kind**: global class  

* [HebrewDateEvent](#HebrewDateEvent)
    * [new HebrewDateEvent(date)](#new_HebrewDateEvent_new)
    * _instance_
        * [.render([locale])](#HebrewDateEvent+render) ⇒ <code>string</code>
    * _static_
        * [.renderHebrew(day, monthName, fullYear)](#HebrewDateEvent.renderHebrew) ⇒ <code>string</code>

<a name="new_HebrewDateEvent_new"></a>

### new HebrewDateEvent(date)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 

<a name="HebrewDateEvent+render"></a>

### hebrewDateEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>HebrewDateEvent</code>](#HebrewDateEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

**Example**  
```js
import {HDate, HebrewDateEvent, common} from '@hebcal/core';

const hd = new HDate(15, common.months.CHESHVAN, 5769);
const ev = new HebrewDateEvent(hd);
console.log(ev.render()); // '15th of Cheshvan, 5769'
console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
```
<a name="HebrewDateEvent.renderHebrew"></a>

### HebrewDateEvent.renderHebrew(day, monthName, fullYear) ⇒ <code>string</code>
Helper function to render a Hebrew date

**Kind**: static method of [<code>HebrewDateEvent</code>](#HebrewDateEvent)  

| Param | Type |
| --- | --- |
| day | <code>number</code> | 
| monthName | <code>string</code> | 
| fullYear | <code>number</code> | 

<a name="Zmanim"></a>

## Zmanim
Class representing halachic times

**Kind**: global class  

* [Zmanim](#Zmanim)
    * [new Zmanim(date, latitude, longitude)](#new_Zmanim_new)
    * [.suntime()](#Zmanim+suntime) ⇒ <code>suncalc.GetTimesResult</code>
    * [.sunrise()](#Zmanim+sunrise) ⇒ <code>Date</code>
    * [.sunset()](#Zmanim+sunset) ⇒ <code>Date</code>
    * [.hour()](#Zmanim+hour) ⇒ <code>number</code>
    * [.hourMins()](#Zmanim+hourMins) ⇒ <code>number</code>
    * [.gregEve()](#Zmanim+gregEve) ⇒ <code>Date</code>
    * [.nightHour()](#Zmanim+nightHour) ⇒ <code>number</code>
    * [.nightHourMins()](#Zmanim+nightHourMins) ⇒ <code>number</code>
    * [.hourOffset(hours)](#Zmanim+hourOffset) ⇒ <code>Date</code>
    * [.chatzot()](#Zmanim+chatzot) ⇒ <code>Date</code>
    * [.chatzotNight()](#Zmanim+chatzotNight) ⇒ <code>Date</code>
    * [.alotHaShachar()](#Zmanim+alotHaShachar) ⇒ <code>Date</code>
    * [.misheyakir()](#Zmanim+misheyakir) ⇒ <code>Date</code>
    * [.misheyakirMachmir()](#Zmanim+misheyakirMachmir) ⇒ <code>Date</code>
    * [.sofZmanShma()](#Zmanim+sofZmanShma) ⇒ <code>Date</code>
    * [.sofZmanTfilla()](#Zmanim+sofZmanTfilla) ⇒ <code>Date</code>
    * [.minchaGedola()](#Zmanim+minchaGedola) ⇒ <code>Date</code>
    * [.minchaKetana()](#Zmanim+minchaKetana) ⇒ <code>Date</code>
    * [.plagHaMincha()](#Zmanim+plagHaMincha) ⇒ <code>Date</code>
    * [.tzeit()](#Zmanim+tzeit) ⇒ <code>Date</code>
    * [.neitzHaChama()](#Zmanim+neitzHaChama) ⇒ <code>Date</code>
    * [.shkiah()](#Zmanim+shkiah) ⇒ <code>Date</code>

<a name="new_Zmanim_new"></a>

### new Zmanim(date, latitude, longitude)
Initialize a Zmanim instance.


| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| [<code>HDate</code>](#HDate) | Regular or Hebrew Date. If `date` is a regular `Date`,    hours, minutes, seconds and milliseconds are ignored. |
| latitude | <code>number</code> |  |
| longitude | <code>number</code> |  |

<a name="Zmanim+suntime"></a>

### zmanim.suntime() ⇒ <code>suncalc.GetTimesResult</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sunrise"></a>

### zmanim.sunrise() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sunset"></a>

### zmanim.sunset() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+hour"></a>

### zmanim.hour() ⇒ <code>number</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+hourMins"></a>

### zmanim.hourMins() ⇒ <code>number</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+gregEve"></a>

### zmanim.gregEve() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+nightHour"></a>

### zmanim.nightHour() ⇒ <code>number</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+nightHourMins"></a>

### zmanim.nightHourMins() ⇒ <code>number</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+hourOffset"></a>

### zmanim.hourOffset(hours) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| hours | <code>number</code> | 

<a name="Zmanim+chatzot"></a>

### zmanim.chatzot() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+chatzotNight"></a>

### zmanim.chatzotNight() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+alotHaShachar"></a>

### zmanim.alotHaShachar() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+misheyakir"></a>

### zmanim.misheyakir() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+misheyakirMachmir"></a>

### zmanim.misheyakirMachmir() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanShma"></a>

### zmanim.sofZmanShma() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanTfilla"></a>

### zmanim.sofZmanTfilla() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+minchaGedola"></a>

### zmanim.minchaGedola() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+minchaKetana"></a>

### zmanim.minchaKetana() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+plagHaMincha"></a>

### zmanim.plagHaMincha() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+tzeit"></a>

### zmanim.tzeit() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+neitzHaChama"></a>

### zmanim.neitzHaChama() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+shkiah"></a>

### zmanim.shkiah() ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Location"></a>

## Location
Class representing Location

**Kind**: global class  

* [Location](#Location)
    * [new Location(latitude, longitude, il, tzid, cityName, countryCode, geoid)](#new_Location_new)
    * _instance_
        * [.getLatitude()](#Location+getLatitude) ⇒ <code>number</code>
        * [.getLongitude()](#Location+getLongitude) ⇒ <code>number</code>
        * [.getIsrael()](#Location+getIsrael) ⇒ <code>boolean</code>
        * [.getName()](#Location+getName) ⇒ <code>string</code>
        * [.getShortName()](#Location+getShortName) ⇒ <code>string</code>
        * [.getCountryCode()](#Location+getCountryCode) ⇒ <code>string</code>
        * [.getTzid()](#Location+getTzid) ⇒ <code>string</code>
        * [.getGeoId()](#Location+getGeoId) ⇒ <code>string</code>
        * [.sunset(hdate)](#Location+sunset) ⇒ <code>Date</code>
        * [.tzeit(hdate)](#Location+tzeit) ⇒ <code>Date</code>
        * [.toString()](#Location+toString) ⇒ <code>string</code>
    * _static_
        * [.lookup(name)](#Location.lookup) ⇒ [<code>Location</code>](#Location)
        * [.legacyTzToTzid(tz, dst)](#Location.legacyTzToTzid) ⇒ <code>string</code>
        * [.getUsaTzid(state, tz, dst)](#Location.getUsaTzid) ⇒ <code>string</code>
        * [.geonameCityDescr(cityName, admin1, countryName)](#Location.geonameCityDescr) ⇒ <code>string</code>

<a name="new_Location_new"></a>

### new Location(latitude, longitude, il, tzid, cityName, countryCode, geoid)
Initialize a Location instance


| Param | Type | Description |
| --- | --- | --- |
| latitude | <code>number</code> | Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003) |
| longitude | <code>number</code> | Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005) |
| il | <code>boolean</code> | in Israel (true) or Diaspora (false) |
| tzid | <code>string</code> | Olson timezone ID, e.g. "America/Chicago" |
| cityName | <code>string</code> | optional descriptive city name |
| countryCode | <code>string</code> | ISO 3166 alpha-2 country code (e.g. "FR") |
| geoid | <code>string</code> | optional string or numeric geographic ID |

<a name="Location+getLatitude"></a>

### location.getLatitude() ⇒ <code>number</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getLongitude"></a>

### location.getLongitude() ⇒ <code>number</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getIsrael"></a>

### location.getIsrael() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getName"></a>

### location.getName() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getShortName"></a>

### location.getShortName() ⇒ <code>string</code>
Returns the location name, up to the first comma

**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getCountryCode"></a>

### location.getCountryCode() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getTzid"></a>

### location.getTzid() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getGeoId"></a>

### location.getGeoId() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+sunset"></a>

### location.sunset(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | 

<a name="Location+tzeit"></a>

### location.tzeit(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | 

<a name="Location+toString"></a>

### location.toString() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location.lookup"></a>

### Location.lookup(name) ⇒ [<code>Location</code>](#Location)
Creates a location object from one of 60 "classic" Hebcal city names.
The following city names are supported:
'Ashdod', 'Atlanta', 'Austin', 'Baghdad', 'Beer Sheva',
'Berlin', 'Baltimore', 'Bogota', 'Boston', 'Budapest',
'Buenos Aires', 'Buffalo', 'Chicago', 'Cincinnati', 'Cleveland',
'Dallas', 'Denver', 'Detroit', 'Eilat', 'Gibraltar', 'Haifa',
'Hawaii', 'Helsinki', 'Houston', 'Jerusalem', 'Johannesburg',
'Kiev', 'La Paz', 'Livingston', 'Las Vegas', 'London', 'Los Angeles',
'Marseilles', 'Miami', 'Minneapolis', 'Melbourne', 'Mexico City',
'Montreal', 'Moscow', 'New York', 'Omaha', 'Ottawa', 'Panama City',
'Paris', 'Pawtucket', 'Petach Tikvah', 'Philadelphia', 'Phoenix',
'Pittsburgh', 'Providence', 'Portland', 'Saint Louis', 'Saint Petersburg',
'San Diego', 'San Francisco', 'Sao Paulo', 'Seattle', 'Sydney',
'Tel Aviv', 'Tiberias', 'Toronto', 'Vancouver', 'White Plains',
'Washington DC', 'Worcester'

**Kind**: static method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Location.legacyTzToTzid"></a>

### Location.legacyTzToTzid(tz, dst) ⇒ <code>string</code>
Converts legacy Hebcal timezone to a standard Olson tzid.

**Kind**: static method of [<code>Location</code>](#Location)  

| Param | Type | Description |
| --- | --- | --- |
| tz | <code>number</code> | integer, GMT offset in hours |
| dst | <code>string</code> | 'none', 'eu', 'usa', or 'israel' |

<a name="Location.getUsaTzid"></a>

### Location.getUsaTzid(state, tz, dst) ⇒ <code>string</code>
Converts timezone info from Zip-Codes.com to a standard Olson tzid.

**Kind**: static method of [<code>Location</code>](#Location)  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>string</code> | two-letter all-caps US state abbreviation like 'CA' |
| tz | <code>number</code> | positive number, 5=America/New_York, 8=America/Los_Angeles |
| dst | <code>string</code> | single char 'Y' or 'N' |

**Example**  
```js
Location.getUsaTzid('AZ', 7, 'Y') // 'America/Denver'
```
<a name="Location.geonameCityDescr"></a>

### Location.geonameCityDescr(cityName, admin1, countryName) ⇒ <code>string</code>
Builds a city description from geonameid string components

**Kind**: static method of [<code>Location</code>](#Location)  

| Param | Type | Description |
| --- | --- | --- |
| cityName | <code>string</code> | e.g. 'Tel Aviv' or 'Chicago' |
| admin1 | <code>string</code> | e.g. 'England' or 'Massachusetts' |
| countryName | <code>string</code> | full country name, e.g. 'Israel' or 'United States' |

<a name="HavdalahEvent"></a>

## HavdalahEvent
Havdalah after Shabbat or holiday

**Kind**: global class  

* [HavdalahEvent](#HavdalahEvent)
    * [new HavdalahEvent(date, mask, attrs, [havdalahMins])](#new_HavdalahEvent_new)
    * [.render([locale])](#HavdalahEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#HavdalahEvent+renderBrief) ⇒ <code>string</code>

<a name="new_HavdalahEvent_new"></a>

### new HavdalahEvent(date, mask, attrs, [havdalahMins])

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| mask | <code>number</code> | 
| attrs | <code>Object</code> | 
| [havdalahMins] | <code>number</code> | 

<a name="HavdalahEvent+render"></a>

### havdalahEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>HavdalahEvent</code>](#HavdalahEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="HavdalahEvent+renderBrief"></a>

### havdalahEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns translation of "Havdalah" without the time.

**Kind**: instance method of [<code>HavdalahEvent</code>](#HavdalahEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="CandleLightingEvent"></a>

## CandleLightingEvent
Candle lighting before Shabbat or holiday

**Kind**: global class  

* [CandleLightingEvent](#CandleLightingEvent)
    * [new CandleLightingEvent(date, mask, attrs)](#new_CandleLightingEvent_new)
    * [.render([locale])](#CandleLightingEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#CandleLightingEvent+renderBrief) ⇒ <code>string</code>

<a name="new_CandleLightingEvent_new"></a>

### new CandleLightingEvent(date, mask, attrs)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| mask | <code>number</code> | 
| attrs | <code>Object</code> | 

<a name="CandleLightingEvent+render"></a>

### candleLightingEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>CandleLightingEvent</code>](#CandleLightingEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="CandleLightingEvent+renderBrief"></a>

### candleLightingEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns translation of "Candle lighting" without the time.

**Kind**: instance method of [<code>CandleLightingEvent</code>](#CandleLightingEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="MoladEvent"></a>

## MoladEvent
Represents a Molad announcement on Shabbat Mevarchim

**Kind**: global class  

* [MoladEvent](#MoladEvent)
    * [new MoladEvent(date, hyear, hmonth)](#new_MoladEvent_new)
    * [.render([locale])](#MoladEvent+render) ⇒ <code>string</code>

<a name="new_MoladEvent_new"></a>

### new MoladEvent(date, hyear, hmonth)

| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) | Hebrew date event occurs |
| hyear | <code>number</code> | molad year |
| hmonth | <code>number</code> | molad month |

<a name="MoladEvent+render"></a>

### moladEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>MoladEvent</code>](#MoladEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="OmerEvent"></a>

## OmerEvent
Represents a day 1-49 of counting the Omer from Pesach to Shavuot

**Kind**: global class  

* [OmerEvent](#OmerEvent)
    * [new OmerEvent(date, omerDay)](#new_OmerEvent_new)
    * [.render([locale])](#OmerEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#OmerEvent+renderBrief) ⇒ <code>string</code>

<a name="new_OmerEvent_new"></a>

### new OmerEvent(date, omerDay)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| omerDay | <code>number</code> | 

<a name="OmerEvent+render"></a>

### omerEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  
**Todo**

- [ ] use gettext()


| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="OmerEvent+renderBrief"></a>

### omerEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns translation of "Omer 22" without ordinal numbers.

**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomiEvent"></a>

## DafYomiEvent
For a Daf Yomi, the name is already translated
attrs.dafyomi.name contains the untranslated string

**Kind**: global class  

* [DafYomiEvent](#DafYomiEvent)
    * [new DafYomiEvent(date, daf)](#new_DafYomiEvent_new)
    * [.render([locale])](#DafYomiEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#DafYomiEvent+renderBrief) ⇒ <code>string</code>
    * [.url()](#DafYomiEvent+url) ⇒ <code>string</code>

<a name="new_DafYomiEvent_new"></a>

### new DafYomiEvent(date, daf)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| daf | [<code>DafYomiResult</code>](#DafYomiResult) | 

<a name="DafYomiEvent+render"></a>

### dafYomiEvent.render([locale]) ⇒ <code>string</code>
Returns Daf Yomi name including the 'Daf Yomi: ' prefix (e.g. "Daf Yomi: Pesachim 107").

**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomiEvent+renderBrief"></a>

### dafYomiEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns Daf Yomi name without the 'Daf Yomi: ' prefix (e.g. "Pesachim 107").

**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomiEvent+url"></a>

### dafYomiEvent.url() ⇒ <code>string</code>
Returns a link to sefaria.org or dafyomi.org

**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  
<a name="Sedra"></a>

## Sedra
Represents Parashah HaShavua for an entire Hebrew year

**Kind**: global class  

* [Sedra](#Sedra)
    * [new Sedra(hebYr, il)](#new_Sedra_new)
    * [.get(hDate)](#Sedra+get) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getString(hDate)](#Sedra+getString) ⇒ <code>string</code>
    * [.lookup(hDate)](#Sedra+lookup) ⇒ <code>Object</code>
    * [.isParsha(hDate)](#Sedra+isParsha) ⇒ <code>boolean</code>
    * [.getSedraArray()](#Sedra+getSedraArray) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getYear()](#Sedra+getYear) ⇒ <code>number</code>

<a name="new_Sedra_new"></a>

### new Sedra(hebYr, il)
Caculates the Parashah HaShavua for an entire Hebrew year


| Param | Type | Description |
| --- | --- | --- |
| hebYr | <code>number</code> | Hebrew year (e.g. 5749) |
| il | <code>boolean</code> | Use Israel sedra schedule (false for Diaspora) |

<a name="Sedra+get"></a>

### sedra.get(hDate) ⇒ <code>Array.&lt;string&gt;</code>
Returns the parsha (or parshiyot) read on Hebrew date

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or absolute days |

<a name="Sedra+getString"></a>

### sedra.getString(hDate) ⇒ <code>string</code>
Looks up parsha for the date, then returns a (translated) string

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or absolute days |

<a name="Sedra+lookup"></a>

### sedra.lookup(hDate) ⇒ <code>Object</code>
Returns an object describing the parsha on the first Saturday on or after absdate

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or absolute days |

<a name="Sedra+isParsha"></a>

### sedra.isParsha(hDate) ⇒ <code>boolean</code>
Checks to see if this day would be a regular parasha HaShavua
Torah reading or special holiday reading

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or absolute days |

<a name="Sedra+getSedraArray"></a>

### sedra.getSedraArray() ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: instance method of [<code>Sedra</code>](#Sedra)  
<a name="Sedra+getYear"></a>

### sedra.getYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Sedra</code>](#Sedra)  
<a name="ParshaEvent"></a>

## ParshaEvent
Represents one of 54 weekly Torah portions, always on a Saturday

**Kind**: global class  

* [ParshaEvent](#ParshaEvent)
    * [new ParshaEvent(date, parsha)](#new_ParshaEvent_new)
    * [.render([locale])](#ParshaEvent+render) ⇒ <code>string</code>
    * [.basename()](#ParshaEvent+basename) ⇒ <code>string</code>
    * [.url()](#ParshaEvent+url) ⇒ <code>string</code>

<a name="new_ParshaEvent_new"></a>

### new ParshaEvent(date, parsha)

| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) |  |
| parsha | <code>Array.&lt;string&gt;</code> | untranslated name of single or double parsha,   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim'] |

<a name="ParshaEvent+render"></a>

### parshaEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>ParshaEvent</code>](#ParshaEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="ParshaEvent+basename"></a>

### parshaEvent.basename() ⇒ <code>string</code>
**Kind**: instance method of [<code>ParshaEvent</code>](#ParshaEvent)  
<a name="ParshaEvent+url"></a>

### parshaEvent.url() ⇒ <code>string</code>
**Kind**: instance method of [<code>ParshaEvent</code>](#ParshaEvent)  
<a name="HolidayEvent"></a>

## HolidayEvent
Represents a built-in holiday like Pesach, Purim or Tu BiShvat

**Kind**: global class  

* [HolidayEvent](#HolidayEvent)
    * [new HolidayEvent(date, desc, [mask], [attrs])](#new_HolidayEvent_new)
    * [.basename()](#HolidayEvent+basename) ⇒ <code>string</code>
    * [.renderFullOrBasename(locale)](#HolidayEvent+renderFullOrBasename) ⇒ <code>string</code>
    * [.url()](#HolidayEvent+url) ⇒ <code>string</code>

<a name="new_HolidayEvent_new"></a>

### new HolidayEvent(date, desc, [mask], [attrs])
Constructs Holiday event


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | [<code>HDate</code>](#HDate) |  | Hebrew date event occurs |
| desc | <code>string</code> |  | Description (not translated) |
| [mask] | <code>number</code> | <code>0</code> | optional holiday flags |
| [attrs] | <code>Object</code> | <code>{}</code> |  |

<a name="HolidayEvent+basename"></a>

### holidayEvent.basename() ⇒ <code>string</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="HolidayEvent+renderFullOrBasename"></a>

### holidayEvent.renderFullOrBasename(locale) ⇒ <code>string</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 

<a name="HolidayEvent+url"></a>

### holidayEvent.url() ⇒ <code>string</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="RoshChodeshEvent"></a>

## RoshChodeshEvent
Represents Rosh Chodesh, the beginning of a new month

**Kind**: global class  

* [RoshChodeshEvent](#RoshChodeshEvent)
    * [new RoshChodeshEvent(date, monthName)](#new_RoshChodeshEvent_new)
    * [.render([locale])](#RoshChodeshEvent+render) ⇒ <code>string</code>
    * [.basename()](#RoshChodeshEvent+basename) ⇒ <code>string</code>

<a name="new_RoshChodeshEvent_new"></a>

### new RoshChodeshEvent(date, monthName)
Constructs Rosh Chodesh event


| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) | Hebrew date event occurs |
| monthName | <code>string</code> | Hebrew month name (not translated) |

<a name="RoshChodeshEvent+render"></a>

### roshChodeshEvent.render([locale]) ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>RoshChodeshEvent</code>](#RoshChodeshEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="RoshChodeshEvent+basename"></a>

### roshChodeshEvent.basename() ⇒ <code>string</code>
**Kind**: instance method of [<code>RoshChodeshEvent</code>](#RoshChodeshEvent)  
<a name="MevarchimChodeshEvent"></a>

## MevarchimChodeshEvent
Represents Mevarchim haChodesh, the announcement of the new month

**Kind**: global class  

* [MevarchimChodeshEvent](#MevarchimChodeshEvent)
    * [new MevarchimChodeshEvent(date, monthName)](#new_MevarchimChodeshEvent_new)
    * [.render([locale])](#MevarchimChodeshEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#MevarchimChodeshEvent+renderBrief) ⇒ <code>string</code>

<a name="new_MevarchimChodeshEvent_new"></a>

### new MevarchimChodeshEvent(date, monthName)
Constructs Mevarchim haChodesh event


| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) | Hebrew date event occurs |
| monthName | <code>string</code> | Hebrew month name (not translated) |

<a name="MevarchimChodeshEvent+render"></a>

### mevarchimChodeshEvent.render([locale]) ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>MevarchimChodeshEvent</code>](#MevarchimChodeshEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="MevarchimChodeshEvent+renderBrief"></a>

### mevarchimChodeshEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>MevarchimChodeshEvent</code>](#MevarchimChodeshEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="common"></a>

## common : <code>object</code>
Hebrew date utility functions.

**Kind**: global namespace  

* [common](#common) : <code>object</code>
    * [.monthNames](#common.monthNames)
    * [.months](#common.months) : <code>enum</code>
    * [.days](#common.days) : <code>enum</code>
    * [.hebLeapYear(year)](#common.hebLeapYear) ⇒ <code>boolean</code>
    * [.monthsInHebYear(year)](#common.monthsInHebYear) ⇒ <code>number</code>
    * [.daysInHebMonth(month, year)](#common.daysInHebMonth) ⇒ <code>number</code>
    * [.getMonthName(month, year)](#common.getMonthName) ⇒ <code>string</code>
    * [.monthNum(month)](#common.monthNum) ⇒ <code>number</code>
    * [.hebElapsedDays(year)](#common.hebElapsedDays) ⇒ <code>number</code>
    * [.daysInYear(year)](#common.daysInYear) ⇒ <code>number</code>
    * [.longCheshvan(year)](#common.longCheshvan) ⇒ <code>boolean</code>
    * [.shortKislev(year)](#common.shortKislev) ⇒ <code>boolean</code>
    * [.monthFromName(c)](#common.monthFromName) ⇒ <code>number</code>
    * [.dayOnOrBefore(dayOfWeek, absdate)](#common.dayOnOrBefore) ⇒ <code>number</code>

<a name="common.monthNames"></a>

### common.monthNames
Transliterations of Hebrew month names.
Regular years are index 0 and leap years are index 1.

**Kind**: static property of [<code>common</code>](#common)  
**Read only**: true  
**Example**  
```js
common.monthNames[0][common.months.ADAR_I] // "Adar"
common.monthNames[1][common.months.ADAR_I] // "Adar I"
common.monthNames[1][common.months.ADAR_II] // "Adar II"
```
<a name="common.months"></a>

### common.months : <code>enum</code>
Hebrew months of the year (NISAN=1, TISHREI=7)

**Kind**: static enum of [<code>common</code>](#common)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| NISAN | <code>number</code> | <code>1</code> | Nissan / ניסן |
| IYYAR | <code>number</code> | <code>2</code> | Iyyar / אייר |
| SIVAN | <code>number</code> | <code>3</code> | Sivan / סיון |
| TAMUZ | <code>number</code> | <code>4</code> | Tamuz (sometimes Tammuz) / תמוז |
| AV | <code>number</code> | <code>5</code> | Av / אב |
| ELUL | <code>number</code> | <code>6</code> | Elul / אלול |
| TISHREI | <code>number</code> | <code>7</code> | Tishrei / תִשְׁרֵי |
| CHESHVAN | <code>number</code> | <code>8</code> | Cheshvan / חשון |
| KISLEV | <code>number</code> | <code>9</code> | Kislev / כסלו |
| TEVET | <code>number</code> | <code>10</code> | Tevet / טבת |
| SHVAT | <code>number</code> | <code>11</code> | Sh'vat / שבט |
| ADAR_I | <code>number</code> | <code>12</code> | Adar or Adar Rishon / אדר |
| ADAR_II | <code>number</code> | <code>13</code> | Adar Sheini (only on leap years) / אדר ב׳ |

<a name="common.days"></a>

### common.days : <code>enum</code>
Days of the week (SUN=0, SAT=6)

**Kind**: static enum of [<code>common</code>](#common)  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| SUN | <code>number</code> | <code>0</code> | Sunday |
| MON | <code>number</code> | <code>1</code> | Monday |
| TUE | <code>number</code> | <code>2</code> | Tuesday |
| WED | <code>number</code> | <code>3</code> | Wednesday |
| THU | <code>number</code> | <code>4</code> | Thursday |
| FRI | <code>number</code> | <code>5</code> | Friday |
| SAT | <code>number</code> | <code>6</code> | Saturday |

<a name="common.hebLeapYear"></a>

### common.hebLeapYear(year) ⇒ <code>boolean</code>
Returns true if Hebrew year is a leap year

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="common.monthsInHebYear"></a>

### common.monthsInHebYear(year) ⇒ <code>number</code>
Number of months in this Hebrew year (either 12 or 13 depending on leap year)

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="common.daysInHebMonth"></a>

### common.daysInHebMonth(month, year) ⇒ <code>number</code>
Number of days in Hebrew month in a given year (29 or 30)

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="common.getMonthName"></a>

### common.getMonthName(month, year) ⇒ <code>string</code>
Returns a transliterated string name of Hebrew month in year,
for example 'Elul' or 'Cheshvan'.

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="common.monthNum"></a>

### common.monthNum(month) ⇒ <code>number</code>
Returns the Hebrew month number (NISAN=1, TISHREI=7)

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> \| <code>string</code> | A number, or Hebrew month name string |

<a name="common.hebElapsedDays"></a>

### common.hebElapsedDays(year) ⇒ <code>number</code>
Days from sunday prior to start of Hebrew calendar to mean
conjunction of Tishrei in Hebrew YEAR

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="common.daysInYear"></a>

### common.daysInYear(year) ⇒ <code>number</code>
Number of days in the hebrew YEAR

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="common.longCheshvan"></a>

### common.longCheshvan(year) ⇒ <code>boolean</code>
true if Cheshvan is long in Hebrew year

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="common.shortKislev"></a>

### common.shortKislev(year) ⇒ <code>boolean</code>
true if Kislev is short in Hebrew year

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="common.monthFromName"></a>

### common.monthFromName(c) ⇒ <code>number</code>
Converts Hebrew month string name to numeric

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type | Description |
| --- | --- | --- |
| c | <code>string</code> | monthName |

<a name="common.dayOnOrBefore"></a>

### common.dayOnOrBefore(dayOfWeek, absdate) ⇒ <code>number</code>
Note: Applying this function to d+6 gives us the DAYNAME on or after an
absolute day d. Similarly, applying it to d+3 gives the DAYNAME nearest to
absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
date d, and applying it to d+7 gives the DAYNAME following absolute date d.

**Kind**: static method of [<code>common</code>](#common)  

| Param | Type |
| --- | --- |
| dayOfWeek | <code>number</code> | 
| absdate | <code>number</code> | 

<a name="greg"></a>

## greg : <code>object</code>
Gregorian date helper functions.

**Kind**: global namespace  

* [greg](#greg) : <code>object</code>
    * [.monthNames](#greg.monthNames)
    * [.gregLeapYear(year)](#greg.gregLeapYear) ⇒ <code>boolean</code>
    * [.daysInGregMonth(month, year)](#greg.daysInGregMonth) ⇒ <code>number</code>
    * [.dayOfYear(date)](#greg.dayOfYear) ⇒ <code>number</code>
    * [.greg2abs(date)](#greg.greg2abs) ⇒ <code>number</code>
    * [.abs2greg(theDate)](#greg.abs2greg) ⇒ <code>Date</code>

<a name="greg.monthNames"></a>

### greg.monthNames
Long names of the Gregorian months (1='January', 12='December')

**Kind**: static property of [<code>greg</code>](#greg)  
**Read only**: true  
<a name="greg.gregLeapYear"></a>

### greg.gregLeapYear(year) ⇒ <code>boolean</code>
Returns true if the Gregorian year is a leap year

**Kind**: static method of [<code>greg</code>](#greg)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Gregorian year |

<a name="greg.daysInGregMonth"></a>

### greg.daysInGregMonth(month, year) ⇒ <code>number</code>
Number of days in the Gregorian month for given year

**Kind**: static method of [<code>greg</code>](#greg)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Gregorian month (1=January, 12=December) |
| year | <code>number</code> | Gregorian year |

<a name="greg.dayOfYear"></a>

### greg.dayOfYear(date) ⇒ <code>number</code>
Returns number of days since January 1 of that year

**Kind**: static method of [<code>greg</code>](#greg)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Gregorian date |

<a name="greg.greg2abs"></a>

### greg.greg2abs(date) ⇒ <code>number</code>
Converts Gregorian date to Julian Day Count

**Kind**: static method of [<code>greg</code>](#greg)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Gregorian date |

<a name="greg.abs2greg"></a>

### greg.abs2greg(theDate) ⇒ <code>Date</code>
Converts from Julian Day Count to Gregorian date.
See the footnote on page 384 of ``Calendrical Calculations, Part II:
Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
Clamen, Software--Practice and Experience, Volume 23, Number 4
(April, 1993), pages 383-404 for an explanation.

**Kind**: static method of [<code>greg</code>](#greg)  

| Param | Type | Description |
| --- | --- | --- |
| theDate | <code>number</code> | absolute Julian days |

<a name="locale"></a>

## locale : <code>object</code>
A locale in Hebcal is used for translations/transliterations of
holidays. @hebcal/core supports three locales by default
* `en` - default, Sephardic transliterations (e.g. "Shabbat")
* `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
* `he` - Hebrew (e.g. "שַׁבָּת")

**Kind**: global namespace  

* [locale](#locale) : <code>object</code>
    * [.lookupTranslation(id, [locale])](#locale.lookupTranslation) ⇒ <code>string</code>
    * [.gettext(id, [locale])](#locale.gettext) ⇒ <code>string</code>
    * [.addLocale(locale, data)](#locale.addLocale)
    * [.useLocale(locale)](#locale.useLocale) ⇒ <code>LocaleData</code>
    * [.getLocaleName()](#locale.getLocaleName) ⇒ <code>string</code>
    * [.ordinal(n)](#locale.ordinal) ⇒ <code>string</code>
    * [.hebrewStripNikkud(str)](#locale.hebrewStripNikkud) ⇒ <code>string</code>

<a name="locale.lookupTranslation"></a>

### locale.lookupTranslation(id, [locale]) ⇒ <code>string</code>
Returns translation only if `locale` offers a non-empty translation for `id`.
Otherwise, returns `undefined`.

**Kind**: static method of [<code>locale</code>](#locale)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID to translate |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="locale.gettext"></a>

### locale.gettext(id, [locale]) ⇒ <code>string</code>
By default, if no translation was found, returns `id`.

**Kind**: static method of [<code>locale</code>](#locale)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID to translate |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="locale.addLocale"></a>

### locale.addLocale(locale, data)
Register locale translations.

**Kind**: static method of [<code>locale</code>](#locale)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e.: `'he'`, `'fr'`) |
| data | <code>LocaleDate</code> | parsed data from a `.po` file. |

<a name="locale.useLocale"></a>

### locale.useLocale(locale) ⇒ <code>LocaleData</code>
Activates a locale. Throws an error if the locale has not been previously added.
After setting the locale to be used, all strings marked for translations
will be represented by the corresponding translation in the specified locale.

**Kind**: static method of [<code>locale</code>](#locale)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e: `'he'`, `'fr'`) |

<a name="locale.getLocaleName"></a>

### locale.getLocaleName() ⇒ <code>string</code>
Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')

**Kind**: static method of [<code>locale</code>](#locale)  
<a name="locale.ordinal"></a>

### locale.ordinal(n) ⇒ <code>string</code>
**Kind**: static method of [<code>locale</code>](#locale)  

| Param | Type |
| --- | --- |
| n | <code>number</code> | 

<a name="locale.hebrewStripNikkud"></a>

### locale.hebrewStripNikkud(str) ⇒ <code>string</code>
Removes nekudot from Hebrew string

**Kind**: static method of [<code>locale</code>](#locale)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="dafyomi"></a>

## dafyomi : <code>object</code>
Low-level interface to Daf Yomi.

**Kind**: global namespace  

* [dafyomi](#dafyomi) : <code>object</code>
    * [.dafyomi(gregdate)](#dafyomi.dafyomi) ⇒ [<code>DafYomiResult</code>](#DafYomiResult)
    * [.dafname(daf, [locale])](#dafyomi.dafname) ⇒ <code>string</code>

<a name="dafyomi.dafyomi"></a>

### dafyomi.dafyomi(gregdate) ⇒ [<code>DafYomiResult</code>](#DafYomiResult)
Returns the Daf Yomi for given date

**Kind**: static method of [<code>dafyomi</code>](#dafyomi)  
**Returns**: [<code>DafYomiResult</code>](#DafYomiResult) - Tractact name and page number  

| Param | Type | Description |
| --- | --- | --- |
| gregdate | <code>Date</code> | Gregorian date |

<a name="dafyomi.dafname"></a>

### dafyomi.dafname(daf, [locale]) ⇒ <code>string</code>
Formats (with translation) the dafyomi result as a string like "Pesachim 34"

**Kind**: static method of [<code>dafyomi</code>](#dafyomi)  

| Param | Type | Description |
| --- | --- | --- |
| daf | [<code>DafYomiResult</code>](#DafYomiResult) | the Daf Yomi |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="holidays"></a>

## holidays : <code>object</code>
Lower-level holidays interface, which returns a set of Events that must be
filtered especially for `flags.IL_ONLY` or `flags.CHUL_ONLY` depending on
Israel vs. Diaspora holiday scheme.

**Kind**: global namespace  

* [holidays](#holidays) : <code>object</code>
    * [.getHolidaysForYear(year)](#holidays.getHolidaysForYear) ⇒ <code>Map.&lt;string, Array.&lt;Event&gt;&gt;</code>
    * [.getHolidaysOnDate(date)](#holidays.getHolidaysOnDate) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)

<a name="holidays.getHolidaysForYear"></a>

### holidays.getHolidaysForYear(year) ⇒ <code>Map.&lt;string, Array.&lt;Event&gt;&gt;</code>
Returns a Map for the year indexed by HDate.toString()

**Kind**: static method of [<code>holidays</code>](#holidays)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="holidays.getHolidaysOnDate"></a>

### holidays.getHolidaysOnDate(date) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
Returns an array of Events on this date (or undefined if no events)

**Kind**: static method of [<code>holidays</code>](#holidays)  

| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) \| <code>Date</code> \| <code>number</code> | Hebrew Date, Gregorian date, or absolute Julian date |

<a name="hebcal"></a>

## hebcal : <code>object</code>
Main interface to Hebcal

**Kind**: global namespace  

* [hebcal](#hebcal) : <code>object</code>
    * [.hebrewCalendar([options])](#hebcal.hebrewCalendar) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
    * [.getBirthdayOrAnniversary(hyear, gdate)](#hebcal.getBirthdayOrAnniversary) ⇒ [<code>HDate</code>](#HDate)
    * [.getYahrzeit(hyear, gdate)](#hebcal.getYahrzeit) ⇒ [<code>HDate</code>](#HDate)
    * [.hebrew2abs(d)](#hebcal.hebrew2abs) ⇒ <code>number</code>
    * [.abs2hebrew(d)](#hebcal.abs2hebrew) ⇒ [<code>SimpleHebrewDate</code>](#SimpleHebrewDate)
    * [.getMolad(year, month)](#hebcal.getMolad) ⇒ [<code>Molad</code>](#Molad)
    * [.makeAnchor(s)](#hebcal.makeAnchor) ⇒ <code>string</code>
    * [.reformatTimeStr(timeStr, suffix, options)](#hebcal.reformatTimeStr) ⇒ <code>string</code>
    * [.registerLocation(cityName, location)](#hebcal.registerLocation) ⇒ <code>boolean</code>

<a name="hebcal.hebrewCalendar"></a>

### hebcal.hebrewCalendar([options]) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
Generates a list of holidays and other hebrew date events based on `options`.
This is the main interface to the `@hebcal/core` library, and can be used to
retrieve holidays, rosh chodesh, candle lighting & havdalah times,
Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
Event names can be rendered in several languges using the `locale` option.

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | [<code>HebcalOptions</code>](#HebcalOptions) | <code>{}</code> | 

<a name="hebcal.getBirthdayOrAnniversary"></a>

### hebcal.getBirthdayOrAnniversary(hyear, gdate) ⇒ [<code>HDate</code>](#HDate)
Calculates a birthday or anniversary (non-yahrzeit).
`hyear` must be after original `gdate` of anniversary.
Returns `undefined` when requested year preceeds or is same as original year.

Hebcal uses the algorithm defined in "Calendrical Calculations"
by Edward M. Reingold and Nachum Dershowitz.

The birthday of someone born in Adar of an ordinary year or Adar II of
a leap year is also always in the last month of the year, be that Adar
or Adar II. The birthday in an ordinary year of someone born during the
first 29 days of Adar I in a leap year is on the corresponding day of Adar;
in a leap year, the birthday occurs in Adar I, as expected.

Someone born on the thirtieth day of Marcheshvan, Kislev, or Adar I
has his birthday postponed until the first of the following month in
years where that day does not occur. [Calendrical Calculations p. 111]

**Kind**: static method of [<code>hebcal</code>](#hebcal)  
**Returns**: [<code>HDate</code>](#HDate) - anniversary occurring in `hyear`  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of event |

**Example**  
```js
import {hebcal} from '@hebcal/core';
const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
const hd = hebcal.getBirthdayOrAnniversary(5780, dt); // '1 Nisan 5780'
console.log(hd.greg().toLocaleDateString('en-US')); // '3/26/2020'
```
<a name="hebcal.getYahrzeit"></a>

### hebcal.getYahrzeit(hyear, gdate) ⇒ [<code>HDate</code>](#HDate)
Calculates yahrzeit.
`hyear` must be after original `gdate` of death.
Returns `undefined` when requested year preceeds or is same as original year.

Hebcal uses the algorithm defined in "Calendrical Calculations"
by Edward M. Reingold and Nachum Dershowitz.

The customary anniversary date of a death is more complicated and depends
also on the character of the year in which the first anniversary occurs.
There are several cases:

* If the date of death is Marcheshvan 30, the anniversary in general depends
  on the first anniversary; if that first anniversary was not Marcheshvan 30,
  use the day before Kislev 1.
* If the date of death is Kislev 30, the anniversary in general again depends
  on the first anniversary — if that was not Kislev 30, use the day before
  Tevet 1.
* If the date of death is Adar II, the anniversary is the same day in the
  last month of the Hebrew year (Adar or Adar II).
* If the date of death is Adar I 30, the anniversary in a Hebrew year that
  is not a leap year (in which Adar only has 29 days) is the last day in
  Shevat.
* In all other cases, use the normal (that is, same month number) anniversary
  of the date of death. [Calendrical Calculations p. 113]

**Kind**: static method of [<code>hebcal</code>](#hebcal)  
**Returns**: [<code>HDate</code>](#HDate) - anniversary occurring in hyear  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of death |

**Example**  
```js
import {hebcal} from '@hebcal/core';
const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
const hd = hebcal.getYahrzeit(5780, dt); // '30 Sh\'vat 5780'
console.log(hd.greg().toLocaleDateString('en-US')); // '2/25/2020'
```
<a name="hebcal.hebrew2abs"></a>

### hebcal.hebrew2abs(d) ⇒ <code>number</code>
Converts Hebrew date to absolute Julian days.
The absolute date is the number of days elapsed since the (imaginary)
Gregorian date Sunday, December 31, 1 BC.

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type | Description |
| --- | --- | --- |
| d | [<code>HDate</code>](#HDate) \| [<code>SimpleHebrewDate</code>](#SimpleHebrewDate) | Hebrew Date |

<a name="hebcal.abs2hebrew"></a>

### hebcal.abs2hebrew(d) ⇒ [<code>SimpleHebrewDate</code>](#SimpleHebrewDate)
Converts absolute Julian days to Hebrew date

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type | Description |
| --- | --- | --- |
| d | <code>number</code> | absolute Julian days |

<a name="hebcal.getMolad"></a>

### hebcal.getMolad(year, month) ⇒ [<code>Molad</code>](#Molad)
Calculates the molad for a Hebrew month

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 
| month | <code>number</code> | 

<a name="hebcal.makeAnchor"></a>

### hebcal.makeAnchor(s) ⇒ <code>string</code>
Helper function to transform a string to make it more usable in a URL or filename.
Converts to lowercase and replaces non-word characters with hyphen ('-').

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type |
| --- | --- |
| s | <code>string</code> | 

**Example**  
```js
hebcal.makeAnchor('Rosh Chodesh Adar II') // 'rosh-chodesh-adar-ii'
```
<a name="hebcal.reformatTimeStr"></a>

### hebcal.reformatTimeStr(timeStr, suffix, options) ⇒ <code>string</code>
Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
keep as "20:13" for any other locale/country. Uses `HebcalOptions` to determine
locale.

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type | Description |
| --- | --- | --- |
| timeStr | <code>string</code> | original time like "20:30" |
| suffix | <code>string</code> | "p" or "pm" or " P.M.". Add leading space if you want it |
| options | [<code>HebcalOptions</code>](#HebcalOptions) |  |

<a name="hebcal.registerLocation"></a>

### hebcal.registerLocation(cityName, location) ⇒ <code>boolean</code>
Adds a location name for `Location.lookup()` only if the name isn't
already being used. Returns `false` if the name is already taken
and `true` if successfully added.

**Kind**: static method of [<code>hebcal</code>](#hebcal)  

| Param | Type |
| --- | --- |
| cityName | <code>string</code> | 
| location | [<code>Location</code>](#Location) | 

<a name="flags"></a>

## flags : <code>enum</code>
Holiday flags for Event

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| CHAG | <code>number</code> | <code>CHAG</code> | Chag, yontiff, yom tov |
| LIGHT_CANDLES | <code>number</code> | <code>LIGHT_CANDLES</code> | Light candles 18 minutes before sundown |
| YOM_TOV_ENDS | <code>number</code> | <code>YOM_TOV_ENDS</code> | End of holiday (end of Yom Tov) |
| CHUL_ONLY | <code>number</code> | <code>CHUL_ONLY</code> | Observed only in the Diaspora (chutz l'aretz) |
| IL_ONLY | <code>number</code> | <code>IL_ONLY</code> | Observed only in Israel |
| LIGHT_CANDLES_TZEIS | <code>number</code> | <code>LIGHT_CANDLES_TZEIS</code> | Light candles in the evening at Tzeit time (3 small stars) |
| CHANUKAH_CANDLES | <code>number</code> | <code>CHANUKAH_CANDLES</code> | Candle-lighting for Chanukah |
| ROSH_CHODESH | <code>number</code> | <code>ROSH_CHODESH</code> | Rosh Chodesh, beginning of a new Hebrew month |
| MINOR_FAST | <code>number</code> | <code>MINOR_FAST</code> | Minor fasts like Tzom Tammuz, Ta'anit Esther, ... |
| SPECIAL_SHABBAT | <code>number</code> | <code>SPECIAL_SHABBAT</code> | Shabbat Shekalim, Zachor, ... |
| PARSHA_HASHAVUA | <code>number</code> | <code>PARSHA_HASHAVUA</code> | Weekly sedrot on Saturdays |
| DAF_YOMI | <code>number</code> | <code>DAF_YOMI</code> | Daily page of Talmud |
| OMER_COUNT | <code>number</code> | <code>OMER_COUNT</code> | Days of the Omer |
| MODERN_HOLIDAY | <code>number</code> | <code>MODERN_HOLIDAY</code> | Yom HaShoah, Yom HaAtzma'ut, ... |
| MAJOR_FAST | <code>number</code> | <code>MAJOR_FAST</code> | Yom Kippur and Tish'a B'Av |
| SHABBAT_MEVARCHIM | <code>number</code> | <code>SHABBAT_MEVARCHIM</code> | On the Saturday before Rosh Chodesh |
| MOLAD | <code>number</code> | <code>MOLAD</code> | Molad |
| USER_EVENT | <code>number</code> | <code>USER_EVENT</code> | Yahrzeit or Hebrew Anniversary |
| HEBREW_DATE | <code>number</code> | <code>HEBREW_DATE</code> | Daily Hebrew date ("11th of Sivan, 5780") |

<a name="parshiot"></a>

## parshiot
The 54 parshiyot of the Torah as transilterated strings
parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[53] == 'Ha\'Azinu'.

**Kind**: global constant  
<a name="SimpleHebrewDate"></a>

## SimpleHebrewDate : <code>Object</code>
A simple Hebrew date object with numeric fields `yy`, `mm`, and `dd`

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| yy | <code>number</code> | Hebrew year |
| mm | <code>number</code> | Hebrew month of year (1=NISAN, 7=TISHREI) |
| dd | <code>number</code> | Day of month (1-30) |

<a name="Molad"></a>

## Molad : <code>Object</code>
Represents a Molad

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | Day of Week (0=Sunday, 6=Saturday) |
| hour | <code>number</code> | hour of day (0-23) |
| minutes | <code>number</code> | minutes past hour (0-59) |
| chalakim | <code>number</code> | parts of a minute (0-17) |

<a name="DafYomiResult"></a>

## DafYomiResult : <code>Object</code>
A Daf Yomi result

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Tractate name |
| blatt | <code>number</code> | Page number |

<a name="HebcalOptions"></a>

## HebcalOptions : <code>Object</code>
Options to configure which events are returned

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| location | [<code>Location</code>](#Location) | latitude/longitude/tzid used for candle-lighting |
| year | <code>number</code> | Gregorian or Hebrew year |
| isHebrewYear | <code>boolean</code> | to interpret year as Hebrew year |
| month | <code>number</code> | Gregorian or Hebrew month (to filter results to a single month) |
| numYears | <code>number</code> | generate calendar for multiple years (default 1) |
| start | <code>Date</code> \| [<code>HDate</code>](#HDate) \| <code>number</code> | use specific start date (requires end date) |
| end | <code>Date</code> \| [<code>HDate</code>](#HDate) \| <code>number</code> | use specific end date (requires start date) |
| candlelighting | <code>boolean</code> | calculate candle-lighting and havdalah times |
| candleLightingMins | <code>number</code> | minutes before sundown to light candles (default 18) |
| havdalahMins | <code>number</code> | minutes after sundown for Havdalah (typical values are 42, 50, or 72) |
| havdalahTzeit | <code>boolean</code> | calculate Havdalah according to Tzeit Hakochavim -      Nightfall (the point when 3 small stars are observable in the night time sky with      the naked eye). Defaults to `true` unless havdalahMins is specified |
| sedrot | <code>boolean</code> | calculate parashah hashavua on Saturdays |
| il | <code>boolean</code> | Israeli holiday and sedra schedule |
| noMinorFast | <code>boolean</code> | suppress minor fasts |
| noModern | <code>boolean</code> | suppress modern holidays |
| noRoshChodesh | <code>boolean</code> | suppress Rosh Chodesh |
| shabbatMevarchim | <code>boolean</code> | add Shabbat Mevarchim |
| noSpecialShabbat | <code>boolean</code> | suppress Special Shabbat |
| noHolidays | <code>boolean</code> | suppress regular holidays |
| dafyomi | <code>boolean</code> | include Daf Yomi |
| omer | <code>boolean</code> | include Days of the Omer |
| molad | <code>boolean</code> | include event announcing the molad |
| ashkenazi | <code>boolean</code> | use Ashkenazi transliterations for event titles (default Sephardi transliterations) |
| locale | <code>string</code> | translate event titles according to a locale      (one of `fi`, `fr`, `he`, `hu`, `pl`, `ru`,      `ashkenazi`, `ashkenazi_litvish`, `ashkenazi_poylish`, `ashkenazi_standard`) |
| hour12 | <code>boolean</code> | use 12-hour time (1-12) instead of default 24-hour time (0-23) |
| addHebrewDates | <code>boolean</code> | print the Hebrew date for the entire date range |
| addHebrewDatesForEvents | <code>boolean</code> | print the Hebrew date for dates with some events |
