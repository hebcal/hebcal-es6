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
<dt><a href="#Location">Location</a></dt>
<dd><p>Class representing Location</p>
</dd>
<dt><a href="#Zmanim">Zmanim</a></dt>
<dd><p>Class representing halachic times</p>
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
<dd><p>Common hebrew date routines</p>
</dd>
<dt><a href="#dafyomi$1">dafyomi$1</a> : <code>object</code></dt>
<dd><p>Daf Yomi</p>
</dd>
<dt><a href="#greg">greg</a> : <code>object</code></dt>
<dd><p>Gregorian date routines</p>
</dd>
<dt><a href="#holidays">holidays</a> : <code>object</code></dt>
<dd><p>Lower-level holidays interface</p>
</dd>
<dt><a href="#hebcal">hebcal</a> : <code>object</code></dt>
<dd><p>Main interface to Hebcal</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#hebLeapYear">hebLeapYear(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if Hebrew year is a leap year</p>
</dd>
<dt><a href="#monthsInHebYear">monthsInHebYear(x)</a> ⇒ <code>number</code></dt>
<dd><p>Number of months in Hebrew year</p>
</dd>
<dt><a href="#daysInHebMonth">daysInHebMonth(month, year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in Hebrew month in a given year</p>
</dd>
<dt><a href="#getMonthName">getMonthName(month, year)</a> ⇒ <code>string</code></dt>
<dd><p>Returns an (untranslated) string name of Hebrew month in year</p>
</dd>
<dt><a href="#monthNum">monthNum(month)</a> ⇒ <code>number</code></dt>
<dd><p>Returns the Hebrew month number</p>
</dd>
<dt><a href="#hebElapsedDays">hebElapsedDays(hYear)</a> ⇒ <code>number</code></dt>
<dd><p>Days from sunday prior to start of Hebrew calendar to mean
conjunction of Tishrei in Hebrew YEAR</p>
</dd>
<dt><a href="#daysInYear">daysInYear(year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in the hebrew YEAR</p>
</dd>
<dt><a href="#longCheshvan">longCheshvan(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>true if Cheshvan is long in Hebrew YEAR</p>
</dd>
<dt><a href="#shortKislev">shortKislev(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>true if Kislev is short in Hebrew YEAR</p>
</dd>
<dt><a href="#monthFromName">monthFromName(c)</a> ⇒ <code>number</code></dt>
<dd><p>Converts Hebrew month string name to numeric</p>
</dd>
<dt><a href="#dayOnOrBefore">dayOnOrBefore(day_of_week, absdate)</a> ⇒ <code>number</code></dt>
<dd><p>Note: Applying this function to d+6 gives us the DAYNAME on or after an
absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
date d, and applying it to d+7 gives the DAYNAME following absolute date d.</p>
</dd>
<dt><a href="#range">range(start, end, [step])</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Returns an array from start to end</p>
</dd>
<dt><a href="#gregLeapYear">gregLeapYear(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if the Gregorian year is a leap year</p>
</dd>
<dt><a href="#daysInGregMonth">daysInGregMonth(month, year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in the Gregorian month for given year</p>
</dd>
<dt><a href="#dayOfYear">dayOfYear(date)</a> ⇒ <code>number</code></dt>
<dd><p>Returns number of days since January 1 of that year</p>
</dd>
<dt><a href="#greg2abs">greg2abs(date)</a> ⇒ <code>number</code></dt>
<dd><p>Converts Gregorian date to Julian Day Count</p>
</dd>
<dt><a href="#abs2greg">abs2greg(theDate)</a> ⇒ <code>Date</code></dt>
<dd><p>Converts from Julian Day Count to Gregorian date.
See the footnote on page 384 of ``Calendrical Calculations, Part II:
Three Historical Calendars&#39;&#39; by E. M. Reingold,  N. Dershowitz, and S. M.
Clamen, Software--Practice and Experience, Volume 23, Number 4
(April, 1993), pages 383-404 for an explanation.</p>
</dd>
<dt><a href="#lookupTranslation">lookupTranslation(id, [locale])</a> ⇒ <code>string</code></dt>
<dd><p>Returns translation only if <code>locale</code> offers a translation for <code>id</code>.
Otherwise, returns undefined.</p>
</dd>
<dt><a href="#gettext">gettext(id, [locale])</a> ⇒ <code>string</code></dt>
<dd><p>By default, if no translation was found, returns <code>id</code>.</p>
</dd>
<dt><a href="#addLocale">addLocale(locale, data)</a></dt>
<dd><p>Register locale translations.</p>
</dd>
<dt><a href="#registerLocale">registerLocale(locale, data)</a></dt>
<dd><p>Alias for addLocale()</p>
</dd>
<dt><a href="#useLocale">useLocale(locale)</a> ⇒ <code>LocaleData</code></dt>
<dd><p>Activates a locale. Throws an error if the locale has not been previously added.
After setting the locale to be used, all strings marked for translations
will be represented by the corresponding translation in the specified locale.</p>
</dd>
<dt><a href="#hebrewStripNikkud">hebrewStripNikkud(str)</a> ⇒ <code>string</code></dt>
<dd><p>Removes nekudot from Hebrew string</p>
</dd>
<dt><a href="#onOrBefore">onOrBefore(day, t, offset)</a> ⇒ <code><a href="#HDate">HDate</a></code></dt>
<dd></dd>
<dt><a href="#hebrew2abs">hebrew2abs(d)</a> ⇒ <code>number</code></dt>
<dd><p>Converts Hebrew date to absolute Julian days.
The absolute date is the number of days elapsed since the (imaginary)
Gregorian date Sunday, December 31, 1 BC.</p>
</dd>
<dt><a href="#abs2hebrew">abs2hebrew(d)</a> ⇒ <code><a href="#SimpleHebrewDate">SimpleHebrewDate</a></code></dt>
<dd><p>Converts Julian days to Hebrew date to absolute Julian days</p>
</dd>
<dt><a href="#getBirthdayOrAnniversary">getBirthdayOrAnniversary(hyear, gdate)</a> ⇒ <code><a href="#HDate">HDate</a></code></dt>
<dd><p>Calculates a birthday or anniversary (non-yahrzeit).
Year must be after original date of anniversary.
Returns undefined when requested year preceeds or is same as original year.</p>
</dd>
<dt><a href="#getYahrzeit">getYahrzeit(hyear, gdate)</a> ⇒ <code><a href="#HDate">HDate</a></code></dt>
<dd><p>Calculates yahrzeit.
Year must be after original date of death.
Returns undefined when requested year preceeds or is same as original year.</p>
</dd>
<dt><a href="#registerLocation">registerLocation(cityName, location)</a> ⇒ <code>boolean</code></dt>
<dd><p>Adds a location name for <code>Location.lookup()</code> only if the name isn&#39;t
already being used. Returns <code>false</code> if the name is already taken
and <code>true</code> if successfully added.</p>
</dd>
<dt><a href="#formatTime">formatTime(timeFormat, dt)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#sunsetTime">sunsetTime(hd, location, timeFormat, offset)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#tzeitTime">tzeitTime(hd, location, timeFormat)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#makeCandleEvent">makeCandleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset)</a> ⇒ <code><a href="#Event">Event</a></code></dt>
<dd></dd>
<dt><a href="#getMolad">getMolad(year, month)</a> ⇒ <code><a href="#Molad">Molad</a></code></dt>
<dd><p>Calculates the molad for a Hebrew month</p>
</dd>
<dt><a href="#dafyomi">dafyomi(gregdate)</a> ⇒ <code><a href="#DafYomiResult">DafYomiResult</a></code></dt>
<dd><p>Returns the Daf Yomi for given date</p>
</dd>
<dt><a href="#dafname">dafname(daf, [locale])</a> ⇒ <code>string</code></dt>
<dd><p>Formats (with translation) the dafyomi result as a string like &quot;Pesachim 34&quot;</p>
</dd>
<dt><a href="#D">D(p)</a> ⇒ <code>number</code></dt>
<dd><p>parsha doubler/undoubler</p>
</dd>
<dt><a href="#abs">abs(year, absDate)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns an object describing the parsha on the first Saturday on or after absdate</p>
</dd>
<dt><a href="#chanukah">chanukah(day)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getHolidaysForYear">getHolidaysForYear(year)</a> ⇒ <code>Map.&lt;string, Array.&lt;Event&gt;&gt;</code></dt>
<dd><p>Returns a Map for the year indexed by HDate.toString()</p>
</dd>
<dt><a href="#getHolidaysOnDate">getHolidaysOnDate(date)</a> ⇒ <code><a href="#Event">Array.&lt;Event&gt;</a></code></dt>
<dd><p>Returns an array of Events on this date (or undefined if no events)</p>
</dd>
<dt><a href="#reformatTimeStr">reformatTimeStr(timeStr, suffix, options)</a> ⇒ <code>string</code></dt>
<dd><p>Returns &quot;8:13p&quot; for US or &quot;20:13&quot; for any other locale/country</p>
</dd>
<dt><a href="#makeAnchor">makeAnchor(s)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getCandleLightingMinutes">getCandleLightingMinutes(options)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#getAbs">getAbs(d)</a> ⇒ <code>number</code></dt>
<dd><p>Gets the Julian absolute days for a number, Date, or HDate</p>
</dd>
<dt><a href="#getStartAndEnd">getStartAndEnd(options)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Parse options object to determine start &amp; end days</p>
</dd>
<dt><a href="#getOmerStartAndEnd">getOmerStartAndEnd(hyear)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd></dd>
<dt><a href="#getMaskFromOptions">getMaskFromOptions(options)</a> ⇒ <code>number</code></dt>
<dd><p>Mask to filter Holiday array</p>
</dd>
<dt><a href="#hebrewCalendar">hebrewCalendar(options)</a> ⇒ <code><a href="#Event">Array.&lt;Event&gt;</a></code></dt>
<dd><p>Generates a list of holidays</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SimpleHebrewDate">SimpleHebrewDate</a> : <code>Object</code></dt>
<dd><p>A simple Hebrew date</p>
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
    * [.before(day)](#HDate+before) ⇒ [<code>HDate</code>](#HDate)
    * [.onOrBefore(day)](#HDate+onOrBefore) ⇒ [<code>HDate</code>](#HDate)
    * [.nearest(day)](#HDate+nearest) ⇒ [<code>HDate</code>](#HDate)
    * [.onOrAfter(day)](#HDate+onOrAfter) ⇒ [<code>HDate</code>](#HDate)
    * [.after(day)](#HDate+after) ⇒ [<code>HDate</code>](#HDate)
    * [.next()](#HDate+next) ⇒ [<code>HDate</code>](#HDate)
    * [.prev()](#HDate+prev) ⇒ [<code>HDate</code>](#HDate)
    * [.isSameDate(other)](#HDate+isSameDate) ⇒ <code>boolean</code>

<a name="new_HDate_new"></a>

### new HDate([day], [month], [year])
Create a Hebrew date.


| Param | Type | Description |
| --- | --- | --- |
| [day] | <code>number</code> \| <code>Date</code> \| [<code>HDate</code>](#HDate) | Day of month (1-30) |
| [month] | <code>number</code> | Hebrew month of year (1=NISAN, 7=TISHREI) |
| [year] | <code>number</code> | Hebrew year |

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
Gets the day of the week, using local time.

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+setFullYear"></a>

### hDate.setFullYear(year) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 

<a name="HDate+setMonth"></a>

### hDate.setMonth(month) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| month | <code>number</code> | 

<a name="HDate+setTishreiMonth"></a>

### hDate.setTishreiMonth(month) ⇒ [<code>HDate</code>](#HDate)
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
Returns untranslated Hebrew month name

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+render"></a>

### hDate.render([locale]) ⇒ <code>string</code>
Returns translated/transliterated Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="HDate+before"></a>

### hDate.before(day) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

<a name="HDate+onOrBefore"></a>

### hDate.onOrBefore(day) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

<a name="HDate+nearest"></a>

### hDate.nearest(day) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

<a name="HDate+onOrAfter"></a>

### hDate.onOrAfter(day) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

<a name="HDate+after"></a>

### hDate.after(day) ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| day | <code>number</code> | day of week |

<a name="HDate+next"></a>

### hDate.next() ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+prev"></a>

### hDate.prev() ⇒ [<code>HDate</code>](#HDate)
**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+isSameDate"></a>

### hDate.isSameDate(other) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>HDate</code>](#HDate) | Hebrew date to compare |

<a name="HebrewDateEvent"></a>

## HebrewDateEvent
Daily Hebrew date ("11th of Sivan, 5780")

**Kind**: global class  

* [HebrewDateEvent](#HebrewDateEvent)
    * [new HebrewDateEvent(date, locale)](#new_HebrewDateEvent_new)
    * _instance_
        * [.render([locale])](#HebrewDateEvent+render) ⇒ <code>string</code>
    * _static_
        * [.renderHebrew(day, monthName, fullYear)](#HebrewDateEvent.renderHebrew) ⇒ <code>string</code>

<a name="new_HebrewDateEvent_new"></a>

### new HebrewDateEvent(date, locale)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| locale | <code>string</code> | 

<a name="HebrewDateEvent+render"></a>

### hebrewDateEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>HebrewDateEvent</code>](#HebrewDateEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="HebrewDateEvent.renderHebrew"></a>

### HebrewDateEvent.renderHebrew(day, monthName, fullYear) ⇒ <code>string</code>
Helper function to render a Hebrew date

**Kind**: static method of [<code>HebrewDateEvent</code>](#HebrewDateEvent)  

| Param | Type |
| --- | --- |
| day | <code>number</code> | 
| monthName | <code>string</code> | 
| fullYear | <code>number</code> | 

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
        * [.getCountryCode()](#Location+getCountryCode) ⇒ <code>string</code>
        * [.getTzid()](#Location+getTzid) ⇒ <code>string</code>
        * [.sunset(hdate)](#Location+sunset) ⇒ <code>Date</code>
        * [.tzeit(hdate)](#Location+tzeit) ⇒ <code>Date</code>
    * _static_
        * [.lookup(name)](#Location.lookup) ⇒ [<code>Location</code>](#Location)

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
| geoid | <code>number</code> | optional numeric geographic ID |

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
<a name="Location+getCountryCode"></a>

### location.getCountryCode() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getTzid"></a>

### location.getTzid() ⇒ <code>string</code>
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

<a name="Zmanim"></a>

## Zmanim
Class representing halachic times

**Kind**: global class  

* [Zmanim](#Zmanim)
    * [new Zmanim(date, location)](#new_Zmanim_new)
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

### new Zmanim(date, location)
Initialize a Zmanim instance


| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> \| [<code>HDate</code>](#HDate) | Regular or Hebrew Date |
| location | [<code>Location</code>](#Location) |  |

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
**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomiEvent+renderBrief"></a>

### dafYomiEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns daf yomi name the 'Daf Yomi: ' prefix.

**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="DafYomiEvent+url"></a>

### dafYomiEvent.url() ⇒ <code>string</code>
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
Common hebrew date routines

**Kind**: global namespace  
<a name="dafyomi$1"></a>

## dafyomi$1 : <code>object</code>
Daf Yomi

**Kind**: global namespace  
<a name="greg"></a>

## greg : <code>object</code>
Gregorian date routines

**Kind**: global namespace  
<a name="holidays"></a>

## holidays : <code>object</code>
Lower-level holidays interface

**Kind**: global namespace  
<a name="hebcal"></a>

## hebcal : <code>object</code>
Main interface to Hebcal

**Kind**: global namespace  
<a name="months"></a>

## months : <code>enum</code>
Hebrew months of the year (NISAN=1, TISHREI=7)

**Kind**: global enum  
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

<a name="days"></a>

## days : <code>enum</code>
Days of the week (SUN=0, SAT=6)

**Kind**: global enum  
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

<a name="hebLeapYear"></a>

## hebLeapYear(x) ⇒ <code>boolean</code>
Returns true if Hebrew year is a leap year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Hebrew year |

<a name="monthsInHebYear"></a>

## monthsInHebYear(x) ⇒ <code>number</code>
Number of months in Hebrew year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Hebrew year |

<a name="daysInHebMonth"></a>

## daysInHebMonth(month, year) ⇒ <code>number</code>
Number of days in Hebrew month in a given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="getMonthName"></a>

## getMonthName(month, year) ⇒ <code>string</code>
Returns an (untranslated) string name of Hebrew month in year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="monthNum"></a>

## monthNum(month) ⇒ <code>number</code>
Returns the Hebrew month number

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> \| <code>string</code> | A number, or Hebrew month name string |

<a name="hebElapsedDays"></a>

## hebElapsedDays(hYear) ⇒ <code>number</code>
Days from sunday prior to start of Hebrew calendar to mean
conjunction of Tishrei in Hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hYear | <code>number</code> | Hebrew year |

<a name="daysInYear"></a>

## daysInYear(year) ⇒ <code>number</code>
Number of days in the hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="longCheshvan"></a>

## longCheshvan(year) ⇒ <code>boolean</code>
true if Cheshvan is long in Hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="shortKislev"></a>

## shortKislev(year) ⇒ <code>boolean</code>
true if Kislev is short in Hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="monthFromName"></a>

## monthFromName(c) ⇒ <code>number</code>
Converts Hebrew month string name to numeric

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| c | <code>string</code> | monthName |

<a name="dayOnOrBefore"></a>

## dayOnOrBefore(day_of_week, absdate) ⇒ <code>number</code>
Note: Applying this function to d+6 gives us the DAYNAME on or after an
absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
date d, and applying it to d+7 gives the DAYNAME following absolute date d.

**Kind**: global function  

| Param | Type |
| --- | --- |
| day_of_week | <code>number</code> | 
| absdate | <code>number</code> | 

<a name="range"></a>

## range(start, end, [step]) ⇒ <code>Array.&lt;number&gt;</code>
Returns an array from start to end

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| start | <code>number</code> |  | beginning number, inclusive |
| end | <code>number</code> |  | ending number, inclusive |
| [step] | <code>number</code> | <code>1</code> |  |

<a name="gregLeapYear"></a>

## gregLeapYear(year) ⇒ <code>boolean</code>
Returns true if the Gregorian year is a leap year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Gregorian year |

<a name="daysInGregMonth"></a>

## daysInGregMonth(month, year) ⇒ <code>number</code>
Number of days in the Gregorian month for given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Gregorian month (1=January, 12=December) |
| year | <code>number</code> | Gregorian year |

<a name="dayOfYear"></a>

## dayOfYear(date) ⇒ <code>number</code>
Returns number of days since January 1 of that year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Gregorian date |

<a name="greg2abs"></a>

## greg2abs(date) ⇒ <code>number</code>
Converts Gregorian date to Julian Day Count

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Gregorian date |

<a name="abs2greg"></a>

## abs2greg(theDate) ⇒ <code>Date</code>
Converts from Julian Day Count to Gregorian date.
See the footnote on page 384 of ``Calendrical Calculations, Part II:
Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
Clamen, Software--Practice and Experience, Volume 23, Number 4
(April, 1993), pages 383-404 for an explanation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| theDate | <code>number</code> | absolute Julian days |

<a name="lookupTranslation"></a>

## lookupTranslation(id, [locale]) ⇒ <code>string</code>
Returns translation only if `locale` offers a translation for `id`.
Otherwise, returns undefined.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID to translate |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="gettext"></a>

## gettext(id, [locale]) ⇒ <code>string</code>
By default, if no translation was found, returns `id`.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID to translate |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="addLocale"></a>

## addLocale(locale, data)
Register locale translations.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e.: `'he'`, `'fr'`) |
| data | <code>LocaleDate</code> | parsed data from a `.po` file. |

<a name="registerLocale"></a>

## registerLocale(locale, data)
Alias for addLocale()

**Kind**: global function  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 
| data | <code>any</code> | 

<a name="useLocale"></a>

## useLocale(locale) ⇒ <code>LocaleData</code>
Activates a locale. Throws an error if the locale has not been previously added.
After setting the locale to be used, all strings marked for translations
will be represented by the corresponding translation in the specified locale.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e: `'he'`, `'fr'`) |

<a name="hebrewStripNikkud"></a>

## hebrewStripNikkud(str) ⇒ <code>string</code>
Removes nekudot from Hebrew string

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="onOrBefore"></a>

## onOrBefore(day, t, offset) ⇒ [<code>HDate</code>](#HDate)
**Kind**: global function  

| Param | Type |
| --- | --- |
| day | <code>number</code> | 
| t | [<code>HDate</code>](#HDate) | 
| offset | <code>number</code> | 

<a name="hebrew2abs"></a>

## hebrew2abs(d) ⇒ <code>number</code>
Converts Hebrew date to absolute Julian days.
The absolute date is the number of days elapsed since the (imaginary)
Gregorian date Sunday, December 31, 1 BC.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| d | [<code>HDate</code>](#HDate) \| [<code>SimpleHebrewDate</code>](#SimpleHebrewDate) | Hebrew Date |

<a name="abs2hebrew"></a>

## abs2hebrew(d) ⇒ [<code>SimpleHebrewDate</code>](#SimpleHebrewDate)
Converts Julian days to Hebrew date to absolute Julian days

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| d | <code>number</code> | absolute Julian days |

<a name="getBirthdayOrAnniversary"></a>

## getBirthdayOrAnniversary(hyear, gdate) ⇒ [<code>HDate</code>](#HDate)
Calculates a birthday or anniversary (non-yahrzeit).
Year must be after original date of anniversary.
Returns undefined when requested year preceeds or is same as original year.

**Kind**: global function  
**Returns**: [<code>HDate</code>](#HDate) - anniversary occurring in hyear  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of event |

<a name="getYahrzeit"></a>

## getYahrzeit(hyear, gdate) ⇒ [<code>HDate</code>](#HDate)
Calculates yahrzeit.
Year must be after original date of death.
Returns undefined when requested year preceeds or is same as original year.

**Kind**: global function  
**Returns**: [<code>HDate</code>](#HDate) - anniversary occurring in hyear  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of death |

<a name="registerLocation"></a>

## registerLocation(cityName, location) ⇒ <code>boolean</code>
Adds a location name for `Location.lookup()` only if the name isn't
already being used. Returns `false` if the name is already taken
and `true` if successfully added.

**Kind**: global function  

| Param | Type |
| --- | --- |
| cityName | <code>string</code> | 
| location | [<code>Location</code>](#Location) | 

<a name="formatTime"></a>

## formatTime(timeFormat, dt) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| timeFormat | <code>Intl.DateTimeFormat</code> | 
| dt | <code>Date</code> | 

<a name="sunsetTime"></a>

## sunsetTime(hd, location, timeFormat, offset) ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| hd | [<code>HDate</code>](#HDate) | 
| location | [<code>Location</code>](#Location) | 
| timeFormat | <code>Intl.DateTimeFormat</code> | 
| offset | <code>number</code> | 

<a name="tzeitTime"></a>

## tzeitTime(hd, location, timeFormat) ⇒ <code>Array.&lt;Object&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| hd | [<code>HDate</code>](#HDate) | 
| location | [<code>Location</code>](#Location) | 
| timeFormat | <code>Intl.DateTimeFormat</code> | 

<a name="makeCandleEvent"></a>

## makeCandleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset) ⇒ [<code>Event</code>](#Event)
**Kind**: global function  

| Param | Type |
| --- | --- |
| e | [<code>Event</code>](#Event) | 
| hd | [<code>HDate</code>](#HDate) | 
| dow | <code>number</code> | 
| location | [<code>Location</code>](#Location) | 
| timeFormat | <code>Intl.DateTimeFormat</code> | 
| candlesOffset | <code>number</code> | 
| havdalahOffset | <code>number</code> | 

<a name="getMolad"></a>

## getMolad(year, month) ⇒ [<code>Molad</code>](#Molad)
Calculates the molad for a Hebrew month

**Kind**: global function  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 
| month | <code>number</code> | 

<a name="dafyomi"></a>

## dafyomi(gregdate) ⇒ [<code>DafYomiResult</code>](#DafYomiResult)
Returns the Daf Yomi for given date

**Kind**: global function  
**Returns**: [<code>DafYomiResult</code>](#DafYomiResult) - Tractact name and page number  

| Param | Type | Description |
| --- | --- | --- |
| gregdate | <code>Date</code> | Gregorian date |

<a name="dafname"></a>

## dafname(daf, [locale]) ⇒ <code>string</code>
Formats (with translation) the dafyomi result as a string like "Pesachim 34"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| daf | [<code>DafYomiResult</code>](#DafYomiResult) | the Daf Yomi |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="D"></a>

## D(p) ⇒ <code>number</code>
parsha doubler/undoubler

**Kind**: global function  

| Param | Type |
| --- | --- |
| p | <code>number</code> | 

<a name="abs"></a>

## abs(year, absDate) ⇒ <code>Object</code>
Returns an object describing the parsha on the first Saturday on or after absdate

**Kind**: global function  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 
| absDate | <code>number</code> | 

<a name="chanukah"></a>

## chanukah(day) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| day | <code>number</code> | 

<a name="getHolidaysForYear"></a>

## getHolidaysForYear(year) ⇒ <code>Map.&lt;string, Array.&lt;Event&gt;&gt;</code>
Returns a Map for the year indexed by HDate.toString()

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="getHolidaysForYear..addEvents"></a>

### getHolidaysForYear~addEvents(year, arr)
**Kind**: inner method of [<code>getHolidaysForYear</code>](#getHolidaysForYear)  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 
| arr | <code>Array.&lt;Object&gt;</code> | 

<a name="getHolidaysOnDate"></a>

## getHolidaysOnDate(date) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
Returns an array of Events on this date (or undefined if no events)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) \| <code>Date</code> \| <code>number</code> | Hebrew Date, Gregorian date, or absolute Julian date |

<a name="reformatTimeStr"></a>

## reformatTimeStr(timeStr, suffix, options) ⇒ <code>string</code>
Returns "8:13p" for US or "20:13" for any other locale/country

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| timeStr | <code>string</code> | original time like "20:30" |
| suffix | <code>string</code> | "p" or "pm" or " P.M.". Add leading space if you want it |
| options | <code>Object</code> |  |

<a name="makeAnchor"></a>

## makeAnchor(s) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| s | <code>string</code> | 

<a name="getCandleLightingMinutes"></a>

## getCandleLightingMinutes(options) ⇒ <code>number</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="getAbs"></a>

## getAbs(d) ⇒ <code>number</code>
Gets the Julian absolute days for a number, Date, or HDate

**Kind**: global function  

| Param | Type |
| --- | --- |
| d | <code>Date</code> \| [<code>HDate</code>](#HDate) \| <code>number</code> | 

<a name="getStartAndEnd"></a>

## getStartAndEnd(options) ⇒ <code>Array.&lt;number&gt;</code>
Parse options object to determine start & end days

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="getOmerStartAndEnd"></a>

## getOmerStartAndEnd(hyear) ⇒ <code>Array.&lt;number&gt;</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| hyear | <code>number</code> | 

<a name="getMaskFromOptions"></a>

## getMaskFromOptions(options) ⇒ <code>number</code>
Mask to filter Holiday array

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="hebrewCalendar"></a>

## hebrewCalendar(options) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
Generates a list of holidays

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="SimpleHebrewDate"></a>

## SimpleHebrewDate : <code>Object</code>
A simple Hebrew date

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
