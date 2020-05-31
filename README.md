
# hebcal-es6
Hebcal, a perpetual Jewish Calendar (ES6)

## Classes

<dl>
<dt><a href="#HDate">HDate</a></dt>
<dd><p>Class representing a Hebrew date</p>
</dd>
<dt><a href="#Event">Event</a></dt>
<dd><p>Represents an Event with a title, date, and flags</p>
</dd>
<dt><a href="#OmerEvent">OmerEvent</a></dt>
<dd><p>Represents a day 1-49 of counting the Omer from Pesach to Shavuot</p>
</dd>
<dt><a href="#DafYomiEvent">DafYomiEvent</a></dt>
<dd><p>For a Daf Yomi, the name is already translated
attrs.dafyomi.name contains the untranslated string</p>
</dd>
<dt><a href="#HavdalahEvent">HavdalahEvent</a></dt>
<dd><p>Havdalah after Shabbat or holiday</p>
</dd>
<dt><a href="#CandleLightingEvent">CandleLightingEvent</a></dt>
<dd><p>Candle lighting before Shabbat or holiday</p>
</dd>
<dt><a href="#Location">Location</a></dt>
<dd><p>Class representing Location</p>
</dd>
<dt><a href="#Sedra">Sedra</a></dt>
<dd><p>Represents Parashah HaShavua for an entire Hebrew year</p>
</dd>
<dt><a href="#Triennial">Triennial</a></dt>
<dd><p>Triennial Torah readings</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#cities">cities</a></dt>
<dd><p>Interface to lookup cities</p>
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
<dt><a href="#getMolad">getMolad(year, month)</a> ⇒ <code><a href="#Molad">Molad</a></code></dt>
<dd><p>Calculates the molad for a Hebrew month</p>
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
<dt><a href="#dafyomi">dafyomi(gregdate)</a> ⇒ <code><a href="#DafYomiResult">DafYomiResult</a></code></dt>
<dd><p>Returns the Daf Yomi for given date</p>
</dd>
<dt><a href="#dafname">dafname(daf)</a> ⇒ <code>string</code></dt>
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
<dt><a href="#getLeyningKeyForEvent">getLeyningKeyForEvent(e, [il])</a> ⇒ <code>string</code></dt>
<dd><p>Based on the event date, type and title, finds the relevant leyning key</p>
</dd>
<dt><a href="#getLeyningForHoliday">getLeyningForHoliday(e, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a given holiday name. Name should be an
(untranslated) string used in holiday-readons.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah</p>
</dd>
<dt><a href="#parshaToString">parshaToString(parsha)</a> ⇒ <code>string</code></dt>
<dd><p>Formats parsha as a string</p>
</dd>
<dt><a href="#getHaftaraKey">getHaftaraKey(parsha)</a> ⇒ <code>string</code></dt>
<dd><p>on doubled parshiot, read only the second Haftarah
except for Nitzavim-Vayelech</p>
</dd>
<dt><a href="#getChanukahShabbatKey">getChanukahShabbatKey(e, key)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getHolidayEvents">getHolidayEvents(hd, il)</a> ⇒ <code><a href="#Event">Array.&lt;Event&gt;</a></code></dt>
<dd><p>Filters out Rosh Chodesh and events that don&#39;t occur in this location</p>
</dd>
<dt><a href="#getLeyningForParshaHaShavua">getLeyningForParshaHaShavua(e, [il])</a> ⇒ <code><a href="#Leyning">Leyning</a></code></dt>
<dd><p>Looks up leyning for a regular Shabbat parsha.</p>
</dd>
<dt><a href="#formatAliyahWithBook">formatAliyahWithBook(a)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an aliyah object like &quot;Numbers 28:9 - 28:15&quot;</p>
</dd>
<dt><a href="#makeAnchor">makeAnchor(s)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getHolidayBasename">getHolidayBasename(desc)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#getShortUrl">getShortUrl(e)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#icalWriteLine">icalWriteLine(res, ...str)</a></dt>
<dd></dd>
<dt><a href="#formatYYYYMMDD">formatYYYYMMDD(d)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#formatTime">formatTime(hour, min, sec)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#makeDtstamp">makeDtstamp(dt)</a> ⇒ <code>string</code></dt>
<dd><p>Returns UTC string for iCalendar</p>
</dd>
<dt><a href="#icalWriteEvent">icalWriteEvent(res, e, dtstamp, options)</a></dt>
<dd></dd>
<dt><a href="#addOptional">addOptional(arr, key, val)</a></dt>
<dd></dd>
<dt><a href="#eventToIcal">eventToIcal(e, options)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#exportHttpHeader">exportHttpHeader(res, mimeType, fileName)</a></dt>
<dd></dd>
<dt><a href="#icalWriteContents">icalWriteContents(res, events, title, options)</a></dt>
<dd></dd>
<dt><a href="#getDownloadFilename">getDownloadFilename(options)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#eventToCsv">eventToCsv(e, options)</a> ⇒ <code>string</code></dt>
<dd><p>Renders an Event as a string</p>
</dd>
<dt><a href="#csvWriteContents">csvWriteContents(res, events, options)</a></dt>
<dd></dd>
<dt><a href="#getDoubledName">getDoubledName(id)</a> ⇒ <code>string</code></dt>
<dd><p>takes a 0-based (Bereshit=0) parsha ID</p>
</dd>
<dt><a href="#getTriennial">getTriennial(year)</a> ⇒ <code><a href="#Triennial">Triennial</a></code></dt>
<dd><p>Calculates the 3-year readings for a given year</p>
</dd>
<dt><a href="#formatTime$1">formatTime$1(timeFormat, dt)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#sunsetTime">sunsetTime(hd, location, timeFormat, offset)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#tzeitTime">tzeitTime(hd, location, timeFormat)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd></dd>
<dt><a href="#candleEvent">candleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset)</a> ⇒ <code><a href="#Event">Event</a></code></dt>
<dd></dd>
<dt><a href="#getCandleLightingMinutes">getCandleLightingMinutes(options)</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#getStartAndEnd">getStartAndEnd(options)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Parse options object to determine start &amp; end days</p>
</dd>
<dt><a href="#getOmerStartAndEnd">getOmerStartAndEnd(hyear)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd></dd>
<dt><a href="#getMaskFromOptions">getMaskFromOptions(options)</a> ⇒ <code>number</code></dt>
<dd><p>Mask to filter Holiday array</p>
</dd>
<dt><a href="#hebcalEvents">hebcalEvents(options)</a> ⇒ <code><a href="#Event">Array.&lt;Event&gt;</a></code></dt>
<dd><p>Generates a list of holidays</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SimpleHebrewDate">SimpleHebrewDate</a> : <code>Object</code></dt>
<dd><p>A simple Hebrew date</p>
</dd>
<dt><a href="#Molad">Molad</a> : <code>Object</code></dt>
<dd><p>Represents an Molad</p>
</dd>
<dt><a href="#CityResult">CityResult</a> : <code>Object</code></dt>
<dd><p>A City result</p>
</dd>
<dt><a href="#DafYomiResult">DafYomiResult</a> : <code>Object</code></dt>
<dd><p>A Daf Yomi result</p>
</dd>
<dt><a href="#Aliyah">Aliyah</a> : <code>Object</code></dt>
<dd><p>Represents an aliyah</p>
</dd>
<dt><a href="#Leyning">Leyning</a> : <code>Object</code></dt>
<dd><p>Leyning for a parsha hashavua or holiday</p>
</dd>
<dt><a href="#HebcalOptions">HebcalOptions</a> : <code>Object</code></dt>
<dd><p>Options to configure which events are returned</p>
</dd>
</dl>

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
    * [.render()](#HDate+render) ⇒ <code>string</code>
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

### hDate.render() ⇒ <code>string</code>
Returns translated/transliterated Hebrew date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
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

<a name="Event"></a>

## Event
Represents an Event with a title, date, and flags

**Kind**: global class  

* [Event](#Event)
    * [new Event(date, desc, [mask], [attrs])](#new_Event_new)
    * [.getFlags()](#Event+getFlags) ⇒ <code>number</code>
    * [.getAttrs()](#Event+getAttrs) ⇒ <code>\*</code>
    * [.observedInIsrael()](#Event+observedInIsrael) ⇒ <code>boolean</code>
    * [.observedInDiaspora()](#Event+observedInDiaspora) ⇒ <code>boolean</code>
    * [.render()](#Event+render) ⇒ <code>string</code>
    * [.getDesc()](#Event+getDesc) ⇒ <code>string</code>
    * [.getDate()](#Event+getDate) ⇒ [<code>HDate</code>](#HDate)

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

### event.getAttrs() ⇒ <code>\*</code>
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

### event.render() ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getDesc"></a>

### event.getDesc() ⇒ <code>string</code>
Returns untranslated description of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getDate"></a>

### event.getDate() ⇒ [<code>HDate</code>](#HDate)
Returns Hebrew date of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="OmerEvent"></a>

## OmerEvent
Represents a day 1-49 of counting the Omer from Pesach to Shavuot

**Kind**: global class  

* [OmerEvent](#OmerEvent)
    * [new OmerEvent(date, omerDay)](#new_OmerEvent_new)
    * [.render()](#OmerEvent+render) ⇒ <code>string</code>

<a name="new_OmerEvent_new"></a>

### new OmerEvent(date, omerDay)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| omerDay | <code>number</code> | 

<a name="OmerEvent+render"></a>

### omerEvent.render() ⇒ <code>string</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  
**Todo**

- [ ] use gettext()

<a name="DafYomiEvent"></a>

## DafYomiEvent
For a Daf Yomi, the name is already translated
attrs.dafyomi.name contains the untranslated string

**Kind**: global class  

* [DafYomiEvent](#DafYomiEvent)
    * [new DafYomiEvent(date, desc, attrs)](#new_DafYomiEvent_new)
    * [.render()](#DafYomiEvent+render) ⇒ <code>string</code>

<a name="new_DafYomiEvent_new"></a>

### new DafYomiEvent(date, desc, attrs)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| desc | <code>string</code> | 
| attrs | <code>\*</code> | 

<a name="DafYomiEvent+render"></a>

### dafYomiEvent.render() ⇒ <code>string</code>
**Kind**: instance method of [<code>DafYomiEvent</code>](#DafYomiEvent)  
<a name="HavdalahEvent"></a>

## HavdalahEvent
Havdalah after Shabbat or holiday

**Kind**: global class  

* [HavdalahEvent](#HavdalahEvent)
    * [new HavdalahEvent(date, mask, attrs, [havdalahMins])](#new_HavdalahEvent_new)
    * [.render()](#HavdalahEvent+render) ⇒ <code>string</code>

<a name="new_HavdalahEvent_new"></a>

### new HavdalahEvent(date, mask, attrs, [havdalahMins])

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| mask | <code>number</code> | 
| attrs | <code>\*</code> | 
| [havdalahMins] | <code>number</code> | 

<a name="HavdalahEvent+render"></a>

### havdalahEvent.render() ⇒ <code>string</code>
**Kind**: instance method of [<code>HavdalahEvent</code>](#HavdalahEvent)  
<a name="CandleLightingEvent"></a>

## CandleLightingEvent
Candle lighting before Shabbat or holiday

**Kind**: global class  

* [CandleLightingEvent](#CandleLightingEvent)
    * [new CandleLightingEvent(date, mask, attrs)](#new_CandleLightingEvent_new)
    * [.render()](#CandleLightingEvent+render) ⇒ <code>string</code>

<a name="new_CandleLightingEvent_new"></a>

### new CandleLightingEvent(date, mask, attrs)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| mask | <code>number</code> | 
| attrs | <code>\*</code> | 

<a name="CandleLightingEvent+render"></a>

### candleLightingEvent.render() ⇒ <code>string</code>
**Kind**: instance method of [<code>CandleLightingEvent</code>](#CandleLightingEvent)  
<a name="Location"></a>

## Location
Class representing Location

**Kind**: global class  

* [Location](#Location)
    * [new Location(latitude, longitude, il, tzid, cityName, countryCode, geoid)](#new_Location_new)
    * _instance_
        * [.suntime(hdate)](#Location+suntime) ⇒ <code>suncalc.GetTimesResult</code>
        * [.sunrise(hdate)](#Location+sunrise) ⇒ <code>Date</code>
        * [.sunset(hdate)](#Location+sunset) ⇒ <code>Date</code>
        * [.hour(hdate)](#Location+hour) ⇒ <code>number</code>
        * [.hourMins(hdate)](#Location+hourMins) ⇒ <code>number</code>
        * [.gregEve(hdate)](#Location+gregEve) ⇒ <code>Date</code>
        * [.nightHour(hdate)](#Location+nightHour) ⇒ <code>number</code>
        * [.nightHourMins(hdate)](#Location+nightHourMins) ⇒ <code>number</code>
        * [.hourOffset(hdate, hours)](#Location+hourOffset) ⇒ <code>Date</code>
        * [.chatzot(hdate)](#Location+chatzot) ⇒ <code>Date</code>
        * [.chatzotNight(hdate)](#Location+chatzotNight) ⇒ <code>Date</code>
        * [.alotHaShachar(hdate)](#Location+alotHaShachar) ⇒ <code>Date</code>
        * [.misheyakir(hdate)](#Location+misheyakir) ⇒ <code>Date</code>
        * [.misheyakirMachmir(hdate)](#Location+misheyakirMachmir) ⇒ <code>Date</code>
        * [.sofZmanShma(hdate)](#Location+sofZmanShma) ⇒ <code>Date</code>
        * [.sofZmanTfilla(hdate)](#Location+sofZmanTfilla) ⇒ <code>Date</code>
        * [.minchaGedola(hdate)](#Location+minchaGedola) ⇒ <code>Date</code>
        * [.minchaKetana(hdate)](#Location+minchaKetana) ⇒ <code>Date</code>
        * [.plagHaMincha(hdate)](#Location+plagHaMincha) ⇒ <code>Date</code>
        * [.tzeit(hdate)](#Location+tzeit) ⇒ <code>Date</code>
        * [.neitzHaChama(hdate)](#Location+neitzHaChama) ⇒ <code>Date</code>
        * [.shkiah(hdate)](#Location+shkiah) ⇒ <code>Date</code>
    * _static_
        * [.newFromCity(city)](#Location.newFromCity) ⇒ [<code>Location</code>](#Location)

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

<a name="Location+suntime"></a>

### location.suntime(hdate) ⇒ <code>suncalc.GetTimesResult</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+sunrise"></a>

### location.sunrise(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+sunset"></a>

### location.sunset(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+hour"></a>

### location.hour(hdate) ⇒ <code>number</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+hourMins"></a>

### location.hourMins(hdate) ⇒ <code>number</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+gregEve"></a>

### location.gregEve(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+nightHour"></a>

### location.nightHour(hdate) ⇒ <code>number</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+nightHourMins"></a>

### location.nightHourMins(hdate) ⇒ <code>number</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+hourOffset"></a>

### location.hourOffset(hdate, hours) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 
| hours | <code>number</code> | 

<a name="Location+chatzot"></a>

### location.chatzot(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+chatzotNight"></a>

### location.chatzotNight(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+alotHaShachar"></a>

### location.alotHaShachar(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+misheyakir"></a>

### location.misheyakir(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+misheyakirMachmir"></a>

### location.misheyakirMachmir(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+sofZmanShma"></a>

### location.sofZmanShma(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+sofZmanTfilla"></a>

### location.sofZmanTfilla(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+minchaGedola"></a>

### location.minchaGedola(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+minchaKetana"></a>

### location.minchaKetana(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+plagHaMincha"></a>

### location.plagHaMincha(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+tzeit"></a>

### location.tzeit(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+neitzHaChama"></a>

### location.neitzHaChama(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location+shkiah"></a>

### location.shkiah(hdate) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 

<a name="Location.newFromCity"></a>

### Location.newFromCity(city) ⇒ [<code>Location</code>](#Location)
**Kind**: static method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| city | <code>Object</code> | 

<a name="Sedra"></a>

## Sedra
Represents Parashah HaShavua for an entire Hebrew year

**Kind**: global class  

* [Sedra](#Sedra)
    * [new Sedra(hebYr, il)](#new_Sedra_new)
    * _instance_
        * [.get(hDate)](#Sedra+get) ⇒ <code>Array.&lt;string&gt;</code>
        * [.getString(hDate)](#Sedra+getString) ⇒ <code>string</code>
        * [.lookup(hDate)](#Sedra+lookup) ⇒ <code>Object</code>
        * [.isParsha(hDate)](#Sedra+isParsha) ⇒ <code>boolean</code>
        * [.getSedraArray()](#Sedra+getSedraArray) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.getYear()](#Sedra+getYear) ⇒ <code>number</code>
    * _static_
        * [.parshaToString(parsha)](#Sedra.parshaToString) ⇒ <code>string</code>

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
<a name="Sedra.parshaToString"></a>

### Sedra.parshaToString(parsha) ⇒ <code>string</code>
Translates object describing the parsha to a string

**Kind**: static method of [<code>Sedra</code>](#Sedra)  

| Param | Type |
| --- | --- |
| parsha | <code>Array.&lt;string&gt;</code> | 

<a name="Triennial"></a>

## Triennial
Triennial Torah readings

**Kind**: global class  

* [Triennial](#Triennial)
    * [new Triennial([hebrewYear], [aliyot])](#new_Triennial_new)
    * _instance_
        * [.getReadings()](#Triennial+getReadings) ⇒ <code>Object</code>
        * [.getStartYear()](#Triennial+getStartYear) ⇒ <code>number</code>
        * [.getThreeYearPattern(id)](#Triennial+getThreeYearPattern) ⇒ <code>string</code>
        * [.cycleReadings(cycleOption)](#Triennial+cycleReadings) ⇒ <code>Object</code>
        * [.cycleReadingsForYear(option, readings, yr)](#Triennial+cycleReadingsForYear)
    * _static_
        * [.getYearNumber(year)](#Triennial.getYearNumber) ⇒ <code>number</code>
        * [.getCycleStartYear(year)](#Triennial.getCycleStartYear) ⇒ <code>number</code>
        * [.getTriennialAliyot()](#Triennial.getTriennialAliyot) ⇒ <code>Object</code>
        * [.resolveSameAs(parsha, book, triennial)](#Triennial.resolveSameAs) ⇒ <code>Object</code>

<a name="new_Triennial_new"></a>

### new Triennial([hebrewYear], [aliyot])
Builds a Triennial object


| Param | Type | Description |
| --- | --- | --- |
| [hebrewYear] | <code>number</code> | Hebrew Year (default current year) |
| [aliyot] | <code>Object</code> | aliyot.json object |

<a name="Triennial+getReadings"></a>

### triennial.getReadings() ⇒ <code>Object</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial+getStartYear"></a>

### triennial.getStartYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial+getThreeYearPattern"></a>

### triennial.getThreeYearPattern(id) ⇒ <code>string</code>
First, determine if a doubled parsha is read [T]ogether or [S]eparately
in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.

**Kind**: instance method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Triennial+cycleReadings"></a>

### triennial.cycleReadings(cycleOption) ⇒ <code>Object</code>
Builds a lookup table readings["Bereshit"][1], readings["Matot-Masei"][3]

**Kind**: instance method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| cycleOption | <code>Object</code> | 

<a name="Triennial+cycleReadingsForYear"></a>

### triennial.cycleReadingsForYear(option, readings, yr)
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| option | <code>string</code> | 
| readings | <code>Object</code> | 
| yr | <code>number</code> | 

<a name="Triennial.getYearNumber"></a>

### Triennial.getYearNumber(year) ⇒ <code>number</code>
Returns triennial year 1, 2 or 3 based on this Hebrew year

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="Triennial.getCycleStartYear"></a>

### Triennial.getCycleStartYear(year) ⇒ <code>number</code>
Returns Hebrew year that this 3-year triennial cycle began

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="Triennial.getTriennialAliyot"></a>

### Triennial.getTriennialAliyot() ⇒ <code>Object</code>
Walks parshiyotObj and builds lookup table for triennial aliyot

**Kind**: static method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial.resolveSameAs"></a>

### Triennial.resolveSameAs(parsha, book, triennial) ⇒ <code>Object</code>
Transforms input JSON with sameAs shortcuts like "D.2":"A.3" to
actual aliyot objects for a given variation/year

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type |
| --- | --- |
| parsha | <code>string</code> | 
| book | <code>string</code> | 
| triennial | <code>Object</code> | 

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
| LIGHT_CANDLES | <code>number</code> | <code>LIGHT_CANDLES</code> | Light candles before sundown |
| YOM_TOV_ENDS | <code>number</code> | <code>YOM_TOV_ENDS</code> | End of holiday (end of Yom Tov) |
| CHUL_ONLY | <code>number</code> | <code>CHUL_ONLY</code> |  |
| IL_ONLY | <code>number</code> | <code>IL_ONLY</code> |  |
| LIGHT_CANDLES_TZEIS | <code>number</code> | <code>LIGHT_CANDLES_TZEIS</code> |  |
| CHANUKAH_CANDLES | <code>number</code> | <code>CHANUKAH_CANDLES</code> |  |
| ROSH_CHODESH | <code>number</code> | <code>ROSH_CHODESH</code> |  |
| MINOR_FAST | <code>number</code> | <code>MINOR_FAST</code> |  |
| SPECIAL_SHABBAT | <code>number</code> | <code>SPECIAL_SHABBAT</code> |  |
| PARSHA_HASHAVUA | <code>number</code> | <code>PARSHA_HASHAVUA</code> |  |
| DAF_YOMI | <code>number</code> | <code>DAF_YOMI</code> |  |
| OMER_COUNT | <code>number</code> | <code>OMER_COUNT</code> |  |
| MODERN_HOLIDAY | <code>number</code> | <code>MODERN_HOLIDAY</code> |  |
| MAJOR_FAST | <code>number</code> | <code>MAJOR_FAST</code> |  |
| SHABBAT_MEVARCHIM | <code>number</code> | <code>SHABBAT_MEVARCHIM</code> |  |
| MOLAD | <code>number</code> | <code>MOLAD</code> |  |
| USER_EVENT | <code>number</code> | <code>USER_EVENT</code> |  |

<a name="cities"></a>

## cities
Interface to lookup cities

**Kind**: global constant  
<a name="cities.getCity"></a>

### cities.getCity(str) ⇒ [<code>CityResult</code>](#CityResult)
Looks up a city

**Kind**: static method of [<code>cities</code>](#cities)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | city name |

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

<a name="getMolad"></a>

## getMolad(year, month) ⇒ [<code>Molad</code>](#Molad)
Calculates the molad for a Hebrew month

**Kind**: global function  

| Param | Type |
| --- | --- |
| year | <code>number</code> | 
| month | <code>number</code> | 

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

<a name="dafyomi"></a>

## dafyomi(gregdate) ⇒ [<code>DafYomiResult</code>](#DafYomiResult)
Returns the Daf Yomi for given date

**Kind**: global function  
**Returns**: [<code>DafYomiResult</code>](#DafYomiResult) - Tractact name and page number  

| Param | Type | Description |
| --- | --- | --- |
| gregdate | <code>Date</code> | Gregorian date |

<a name="dafname"></a>

## dafname(daf) ⇒ <code>string</code>
Formats (with translation) the dafyomi result as a string like "Pesachim 34"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| daf | [<code>DafYomiResult</code>](#DafYomiResult) | the Daf Yomi |

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

<a name="getLeyningKeyForEvent"></a>

## getLeyningKeyForEvent(e, [il]) ⇒ <code>string</code>
Based on the event date, type and title, finds the relevant leyning key

**Kind**: global function  
**Returns**: <code>string</code> - key to look up in holiday-reading.json  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>Event</code>](#Event) | event |
| [il] | <code>boolean</code> | true if Israel holiday scheme |

<a name="getLeyningForHoliday"></a>

## getLeyningForHoliday(e, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a given holiday name. Name should be an
(untranslated) string used in holiday-readons.json. Returns some
of full kriyah aliyot, special Maftir, special Haftarah

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>Event</code>](#Event) | the Hebcal event associated with this leyning |
| [il] | <code>boolean</code> | true if Israel holiday scheme |

<a name="parshaToString"></a>

## parshaToString(parsha) ⇒ <code>string</code>
Formats parsha as a string

**Kind**: global function  

| Param | Type |
| --- | --- |
| parsha | <code>Array.&lt;string&gt;</code> | 

<a name="getHaftaraKey"></a>

## getHaftaraKey(parsha) ⇒ <code>string</code>
on doubled parshiot, read only the second Haftarah
except for Nitzavim-Vayelech

**Kind**: global function  

| Param | Type |
| --- | --- |
| parsha | <code>Array.&lt;string&gt;</code> | 

<a name="getChanukahShabbatKey"></a>

## getChanukahShabbatKey(e, key) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| e | [<code>Event</code>](#Event) | 
| key | <code>string</code> | 

<a name="getHolidayEvents"></a>

## getHolidayEvents(hd, il) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
Filters out Rosh Chodesh and events that don't occur in this location

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hd | [<code>HDate</code>](#HDate) | Hebrew date |
| il | <code>boolean</code> | in Israel |

<a name="getLeyningForParshaHaShavua"></a>

## getLeyningForParshaHaShavua(e, [il]) ⇒ [<code>Leyning</code>](#Leyning)
Looks up leyning for a regular Shabbat parsha.

**Kind**: global function  
**Returns**: [<code>Leyning</code>](#Leyning) - map of aliyot  

| Param | Type | Description |
| --- | --- | --- |
| e | [<code>Event</code>](#Event) | the Hebcal event associated with this leyning |
| [il] | <code>booleam</code> | in Israel |

<a name="formatAliyahWithBook"></a>

## formatAliyahWithBook(a) ⇒ <code>string</code>
Formats an aliyah object like "Numbers 28:9 - 28:15"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| a | [<code>Aliyah</code>](#Aliyah) | aliyah |

<a name="makeAnchor"></a>

## makeAnchor(s) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| s | <code>string</code> | 

<a name="getHolidayBasename"></a>

## getHolidayBasename(desc) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| desc | <code>string</code> | 

<a name="getShortUrl"></a>

## getShortUrl(e) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| e | [<code>Event</code>](#Event) | 

<a name="icalWriteLine"></a>

## icalWriteLine(res, ...str)
**Kind**: global function  

| Param | Type |
| --- | --- |
| res | <code>stream.Writable</code> | 
| ...str | <code>string</code> | 

<a name="formatYYYYMMDD"></a>

## formatYYYYMMDD(d) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| d | <code>Date</code> | 

<a name="formatTime"></a>

## formatTime(hour, min, sec) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| hour | <code>number</code> \| <code>string</code> | 
| min | <code>number</code> \| <code>string</code> | 
| sec | <code>number</code> \| <code>string</code> | 

<a name="makeDtstamp"></a>

## makeDtstamp(dt) ⇒ <code>string</code>
Returns UTC string for iCalendar

**Kind**: global function  

| Param | Type |
| --- | --- |
| dt | <code>Date</code> | 

<a name="icalWriteEvent"></a>

## icalWriteEvent(res, e, dtstamp, options)
**Kind**: global function  

| Param | Type |
| --- | --- |
| res | <code>stream.Writable</code> | 
| e | [<code>Event</code>](#Event) | 
| dtstamp | <code>string</code> | 
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="addOptional"></a>

## addOptional(arr, key, val)
**Kind**: global function  

| Param | Type |
| --- | --- |
| arr | <code>Array.&lt;string&gt;</code> | 
| key | <code>string</code> | 
| val | <code>string</code> | 

<a name="eventToIcal"></a>

## eventToIcal(e, options) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - multi-line result, delimited by \r\n  

| Param | Type |
| --- | --- |
| e | [<code>Event</code>](#Event) | 
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="exportHttpHeader"></a>

## exportHttpHeader(res, mimeType, fileName)
**Kind**: global function  

| Param | Type |
| --- | --- |
| res | <code>stream.Writable</code> | 
| mimeType | <code>string</code> | 
| fileName | <code>string</code> | 

<a name="icalWriteContents"></a>

## icalWriteContents(res, events, title, options)
**Kind**: global function  

| Param | Type |
| --- | --- |
| res | <code>stream.Writable</code> | 
| events | [<code>Array.&lt;Event&gt;</code>](#Event) | 
| title | <code>string</code> | 
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="getDownloadFilename"></a>

## getDownloadFilename(options) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="eventToCsv"></a>

## eventToCsv(e, options) ⇒ <code>string</code>
Renders an Event as a string

**Kind**: global function  

| Param | Type |
| --- | --- |
| e | [<code>Event</code>](#Event) | 
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="csvWriteContents"></a>

## csvWriteContents(res, events, options)
**Kind**: global function  

| Param | Type |
| --- | --- |
| res | <code>stream.Writable</code> | 
| events | [<code>Array.&lt;Event&gt;</code>](#Event) | 
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="getDoubledName"></a>

## getDoubledName(id) ⇒ <code>string</code>
takes a 0-based (Bereshit=0) parsha ID

**Kind**: global function  

| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="getTriennial"></a>

## getTriennial(year) ⇒ [<code>Triennial</code>](#Triennial)
Calculates the 3-year readings for a given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="formatTime$1"></a>

## formatTime$1(timeFormat, dt) ⇒ <code>string</code>
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

<a name="candleEvent"></a>

## candleEvent(e, hd, dow, location, timeFormat, candlesOffset, havdalahOffset) ⇒ [<code>Event</code>](#Event)
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

<a name="getCandleLightingMinutes"></a>

## getCandleLightingMinutes(options) ⇒ <code>number</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

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

<a name="hebcalEvents"></a>

## hebcalEvents(options) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
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
Represents an Molad

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | Day of Week (0=Sunday, 6=Saturday) |
| hour | <code>number</code> | hour of day (0-23) |
| minutes | <code>number</code> | minutes past hour (0-59) |
| chalakim | <code>number</code> | parts of a minute (0-17) |

<a name="CityResult"></a>

## CityResult : <code>Object</code>
A City result

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Short city name |
| latitude | <code>number</code> |  |
| longitude | <code>number</code> |  |
| tzid | <code>string</code> | Timezone Identifier (for tzdata/Olson tzdb) |
| cc | <code>string</code> | ISO 3166 two-letter country code |
| cityName | <code>string</code> | longer city name with US State or country code |
| [state] | <code>string</code> | U.S. State name (only if cc='US') |
| [geoid] | <code>number</code> | optional numerical geoid |

<a name="DafYomiResult"></a>

## DafYomiResult : <code>Object</code>
A Daf Yomi result

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Tractate name |
| blatt | <code>number</code> | Page number |

<a name="Aliyah"></a>

## Aliyah : <code>Object</code>
Represents an aliyah

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| k | <code>string</code> | Book (e.g. "Numbers") |
| b | <code>string</code> | beginning verse (e.g. "28:9") |
| e | <code>string</code> | ending verse (e.g. "28:15") |
| [v] | <code>number</code> | number of verses |
| [p] | <code>number</code> | parsha number (1=Bereshit, 54=Vezot HaBracha) |

<a name="Leyning"></a>

## Leyning : <code>Object</code>
Leyning for a parsha hashavua or holiday

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| summary | <code>string</code> |  |
| haftara | <code>string</code> | Haftarah |
| fullkriyah | [<code>Array.&lt;Aliyah&gt;</code>](#Aliyah) |  |
| [triennial] | <code>Object</code> |  |
| [reason] | <code>Object</code> |  |

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
| candlelighting | <code>boolean</code> | calculate candle-lighting and havdalah times |
| candleLightingMins | <code>number</code> | minutes before sundown to light candles (default 18) |
| havdalahMins | <code>number</code> | minutes after sundown for Havdalah (typical values are 42, 50, or 72) |
| havdalahTzeit | <code>boolean</code> | calculate Havdalah according to Tzeit Hakochavim -      Nightfall (the point when 3 small stars are observable in the night time sky with      the naked eye). Defaults to `true` unless havdalahMins is specified |
| sedrot | <code>boolean</code> | calculate parashah hashavua on Saturdays |
| il | <code>boolean</code> | Israeli holiday and sedra schedule |
| noMinorFast | <code>boolean</code> | suppress minor fasts |
| noModern | <code>boolean</code> | suppress modern holidays |
| noRoshChodesh | <code>boolean</code> | suppress Rosh Chodesh & Shabbat Mevarchim |
| noSpecialShabbat | <code>boolean</code> | suppress Special Shabbat |
| noHolidays | <code>boolean</code> | suppress regular holidays |
| dafyomi | <code>boolean</code> | include Daf Yomi |
| omer | <code>boolean</code> | include Days of the Omer |
| molad | <code>boolean</code> | include event announcing the molad |
| ashkenazi | <code>boolean</code> | use Ashkenazi transliterations for event titles (default Sephardi transliterations) |
| locale | <code>string</code> | translate event titles according to a locale      (one of `fi`, `fr`, `he`, `hu`, `pl`, `ru`,      `ashkenazi`, `ashkenazi_litvish`, `ashkenazi_poylish`, `ashkenazi_standard`) |
| hour12 | <code>boolean</code> | use 12-hour time (1-12) instead of default 24-hour time (0-23) |

