# hebcal-es6
Hebcal, a perpetual Jewish Calendar (ES6)

## Functions

<dl>
<dt><a href="#getBirthdayOrAnniversary">getBirthdayOrAnniversary(hyear, gdate)</a> ⇒ <code><a href="#HDate">HDate</a></code></dt>
<dd><p>Calculates a birthday or anniversary (non-yahrzeit)</p>
</dd>
<dt><a href="#getYahrzeit">getYahrzeit(hyear, gdate)</a> ⇒ <code><a href="#HDate">HDate</a></code></dt>
<dd><p>Calculates yahrzeit</p>
</dd>
<dt><a href="#LEAP">LEAP(x)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if Hebrew year is a leap year</p>
</dd>
<dt><a href="#MONTH_CNT">MONTH_CNT(x)</a> ⇒ <code>number</code></dt>
<dd><p>Number of months in Hebrew year</p>
</dd>
<dt><a href="#daysInMonth">daysInMonth(month, year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in Hebrew month in a given year</p>
</dd>
<dt><a href="#monthNum">monthNum(month)</a></dt>
<dd><p>Returns the Hebrew month number</p>
</dd>
<dt><a href="#hebElapsedDays">hebElapsedDays(hYear)</a> ⇒ <code>number</code></dt>
<dd><p>Days from sunday prior to start of Hebrew calendar to mean
conjunction of Tishrei in Hebrew YEAR</p>
</dd>
<dt><a href="#daysInYear">daysInYear(year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in the hebrew YEAR</p>
</dd>
<dt><a href="#lngChesh">lngChesh(year)</a></dt>
<dd><p>true if Cheshvan is long in Hebrew YEAR</p>
</dd>
<dt><a href="#shrtKis">shrtKis(year)</a></dt>
<dd><p>true if Kislev is short in Hebrew YEAR</p>
</dd>
<dt><a href="#dayOnOrBefore">dayOnOrBefore(day_of_week, absdate)</a></dt>
<dd><p>Note: Applying this function to d+6 gives us the DAYNAME on or after an
absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
date d, and applying it to d+7 gives the DAYNAME following absolute date d.</p>
</dd>
<dt><a href="#dafyomi">dafyomi(gregdate)</a> ⇒ <code><a href="#DafYomiResult">DafYomiResult</a></code></dt>
<dd><p>Returns the Daf Yomi for given date</p>
</dd>
<dt><a href="#dafname">dafname(daf)</a> ⇒ <code>string</code></dt>
<dd><p>Formats (with translation) the dafyomi result as a string like &quot;Pesachim 34&quot;</p>
</dd>
<dt><a href="#LEAP">LEAP(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if the Gregorian year is a leap year</p>
</dd>
<dt><a href="#daysInMonth">daysInMonth(month, year)</a> ⇒ <code>number</code></dt>
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
<dt><a href="#hebrew2abs">hebrew2abs(d)</a> ⇒ <code>number</code></dt>
<dd><p>Converts Hebrew date to absolute Julian days.
The absolute date is the number of days elapsed since the (imaginary)
Gregorian date Sunday, December 31, 1 BC.</p>
</dd>
<dt><a href="#abs2hebrew">abs2hebrew(d)</a> ⇒ <code><a href="#SimpleHebrewDate">SimpleHebrewDate</a></code></dt>
<dd><p>Converts Julian days to Hebrew date to absolute Julian days</p>
</dd>
<dt><a href="#candleLightingEvents">candleLightingEvents(holidaysYear, location, startAbs, endAbs)</a></dt>
<dd><p>Returns an array of candle-lighting times and Havdalah times
for both Shabbat and holidays (based on Israel or Diaspora schedule)</p>
</dd>
<dt><a href="#hebcalEvents">hebcalEvents(options)</a></dt>
<dd><p>Generates a list of holidays</p>
</dd>
<dt><a href="#get">get(hDate)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Returns the parsha (or parshiyot) read on Hebrew date</p>
</dd>
<dt><a href="#getString">getString(hDate)</a> ⇒ <code>string</code></dt>
<dd><p>Looks up parsha for the date, then returns a (translated) string</p>
</dd>
<dt><a href="#isParsha">isParsha(hDate)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks to see if this day would be a regular parasha HaShavua
Torah reading or special holiday reading</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#DafYomiResult">DafYomiResult</a> : <code>Object</code></dt>
<dd><p>A Daf Yomi result</p>
</dd>
<dt><a href="#SimpleHebrewDate">SimpleHebrewDate</a> : <code>Object</code></dt>
<dd><p>A simple Hebrew date</p>
</dd>
<dt><a href="#HebcalOptions">HebcalOptions</a> : <code>Object</code></dt>
<dd><p>Options to configure which events are returned</p>
</dd>
</dl>

<a name="getBirthdayOrAnniversary"></a>

## getBirthdayOrAnniversary(hyear, gdate) ⇒ [<code>HDate</code>](#HDate)
Calculates a birthday or anniversary (non-yahrzeit)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of event |

<a name="getYahrzeit"></a>

## getYahrzeit(hyear, gdate) ⇒ [<code>HDate</code>](#HDate)
Calculates yahrzeit

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of death |

<a name="LEAP"></a>

## LEAP(x) ⇒ <code>boolean</code>
Returns true if Hebrew year is a leap year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Hebrew year |

<a name="MONTH_CNT"></a>

## MONTH\_CNT(x) ⇒ <code>number</code>
Number of months in Hebrew year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | Hebrew year |

<a name="daysInMonth"></a>

## daysInMonth(month, year) ⇒ <code>number</code>
Number of days in Hebrew month in a given year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="monthNum"></a>

## monthNum(month)
Returns the Hebrew month number

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>\*</code> | A number, or Hebrew month name string |

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

<a name="lngChesh"></a>

## lngChesh(year)
true if Cheshvan is long in Hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="shrtKis"></a>

## shrtKis(year)
true if Kislev is short in Hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="dayOnOrBefore"></a>

## dayOnOrBefore(day_of_week, absdate)
Note: Applying this function to d+6 gives us the DAYNAME on or after an
absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
date d, and applying it to d+7 gives the DAYNAME following absolute date d.

**Kind**: global function  

| Param | Type |
| --- | --- |
| day_of_week | <code>number</code> | 
| absdate | <code>number</code> | 

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

<a name="LEAP"></a>

## LEAP(year) ⇒ <code>boolean</code>
Returns true if the Gregorian year is a leap year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Gregorian year |

<a name="daysInMonth"></a>

## daysInMonth(month, year) ⇒ <code>number</code>
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

<a name="candleLightingEvents"></a>

## candleLightingEvents(holidaysYear, location, startAbs, endAbs)
Returns an array of candle-lighting times and Havdalah times
for both Shabbat and holidays (based on Israel or Diaspora schedule)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| holidaysYear | <code>Array.&lt;Event&gt;</code> | result of holidays.year() |
| location | <code>Object</code> | including tzid |
| startAbs | <code>number</code> | start absolute day number |
| endAbs | <code>number</code> | end absolute day number |

<a name="hebcalEvents"></a>

## hebcalEvents(options)
Generates a list of holidays

**Kind**: global function  

| Param | Type |
| --- | --- |
| options | [<code>HebcalOptions</code>](#HebcalOptions) | 

<a name="get"></a>

## get(hDate) ⇒ <code>Array.&lt;string&gt;</code>
Returns the parsha (or parshiyot) read on Hebrew date

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) | Hebrew date |

<a name="getString"></a>

## getString(hDate) ⇒ <code>string</code>
Looks up parsha for the date, then returns a (translated) string

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) | Hebrew date |

<a name="isParsha"></a>

## isParsha(hDate) ⇒ <code>boolean</code>
Checks to see if this day would be a regular parasha HaShavua
Torah reading or special holiday reading

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| hDate | [<code>HDate</code>](#HDate) | Hebrew date |

<a name="DafYomiResult"></a>

## DafYomiResult : <code>Object</code>
A Daf Yomi result

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Tractate name |
| blatt | <code>number</code> | Page number |

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

<a name="HebcalOptions"></a>

## HebcalOptions : <code>Object</code>
Options to configure which events are returned

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| location | <code>Location</code> | location.il used for Israel vs. Diaspora holidays, latitude/longitude/tzid used for candle-lighting |
| year | <code>number</code> | Gregorian or Hebrew year |
| isHebrewYear | <code>boolean</code> | to interpret year as Hebrew year |
| month | <code>number</code> | Gregorian or Hebrew month (to filter results to a single month) |
| candlelighting | <code>boolean</code> | calculate candle-lighting and havdalah times |
| candleLightingMins | <code>number</code> | minutes before sundown to light candles (default 18) |
| havdalahMins | <code>number</code> | minutes after sundown for Havdalah (default 50) |
| sedrot | <code>boolean</code> | calculate parashah hashavua on Saturdays |
| noModern | <code>boolean</code> | suppress modern holidays |
| noRoshChodesh | <code>boolean</code> | suppress Rosh Chodesh & Shabbat Mevarchim |
| noSpecialShabbat | <code>boolean</code> | suppress Special Shabbat |
| noHolidays | <code>boolean</code> | suppress regular holidays |
| dafyomi | <code>boolean</code> | include Daf Yomi |
| omer | <code>boolean</code> | include Days of the Omer |

