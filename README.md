# @hebcal/core
Hebcal is a perpetual Jewish Calendar. This library converts between
Hebrew and Gregorian dates, and generates lists of Jewish holidays for
any year (past, present or future).  Shabbat and holiday candle
lighting and havdalah times are approximated based on location. Torah
readings (Parashat HaShavua), Daf Yomi, and counting of the Omer can
also be specified. Hebcal also includes algorithms to calculate
yahrzeits, birthdays and anniversaries.

[![Build Status](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-es6/actions/workflows/node.js.yml)

Hebcal was created in 1994 by Danny Sadinoff as a Unix/Linux program
written in C, inspired by similar functionality written in Emacs
Lisp. The initial JavaScript port was released in 2014 by Eyal
Schachter (age 15). This ECMAScript 2015 implementation was released
in 2020 by Michael J. Radwin. `@hebcal/core` targets both
browser-based JavaScript and server-side Node.js.

Many users of this library will utilize the [HebrewCalendar](#HebrewCalendar)
and [HDate](#HDate) interfaces.

## Installation
```bash
$ npm install @hebcal/core
```

## Synopsis
```javascript
import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';

const options: CalOptions = {
  year: 1981,
  isHebrewYear: false,
  candlelighting: true,
  location: Location.lookup('San Francisco'),
  sedrot: true,
  omer: true,
};
const events = HebrewCalendar.calendar(options);

for (const ev of events) {
  const hd = ev.getDate();
  const date = hd.greg();
  console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
}
```

## Classes

<dl>
<dt><a href="#Locale">Locale</a></dt>
<dd><p>A locale in Hebcal is used for translations/transliterations of
holidays. <code>@hebcal/hdate</code> supports four locales by default</p>
<ul>
<li><code>en</code> - default, Sephardic transliterations (e.g. &quot;Shabbat&quot;)</li>
<li><code>ashkenazi</code> - Ashkenazi transliterations (e.g. &quot;Shabbos&quot;)</li>
<li><code>he</code> - Hebrew (e.g. &quot;שַׁבָּת&quot;)</li>
<li><code>he-x-NoNikud</code> - Hebrew without nikud (e.g. &quot;שבת&quot;)</li>
</ul>
</dd>
<dt><a href="#HDate">HDate</a></dt>
<dd><p>Represents a Hebrew date</p>
</dd>
<dt><a href="#Event">Event</a></dt>
<dd><p>Represents an Event with a title, date, and flags</p>
</dd>
<dt><a href="#HebrewDateEvent">HebrewDateEvent</a></dt>
<dd><p>Daily Hebrew date (&quot;11th of Sivan, 5780&quot;)</p>
</dd>
<dt><a href="#GeoLocation">GeoLocation</a></dt>
<dd><p>A class that contains location information such as latitude and longitude required for astronomical calculations. The
elevation field may not be used by some calculation engines and would be ignored if set.</p>
</dd>
<dt><a href="#NOAACalculator">NOAACalculator</a></dt>
<dd><p>Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>&#39;s <a href =
"http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA&#39;s <a
href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
to account for elevation. The algorithm can be found in the <a
href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.</p>
</dd>
<dt><a href="#Location">Location</a></dt>
<dd><p>Class representing Location</p>
</dd>
<dt><a href="#Zmanim">Zmanim</a></dt>
<dd><p>Calculate halachic times (zmanim / זְמַנִּים) for a given day and location.
Calculations are available for tzeit / tzais (nightfall),
shkiah (sunset) and more.</p>
<p>Zmanim are estimated using an algorithm published by the US National Oceanic
and Atmospheric Administration. The NOAA solar calculator is based on equations
from <em>Astronomical Algorithms</em> by Jean Meeus.</p>
<p>The sunrise and sunset results are theoretically accurate to within a minute for
locations between +/- 72° latitude, and within 10 minutes outside of those latitudes.
However, due to variations in atmospheric composition, temperature, pressure and
conditions, observed values may vary from calculations.
<a href="https://gml.noaa.gov/grad/solcalc/calcdetails.html">https://gml.noaa.gov/grad/solcalc/calcdetails.html</a></p>
</dd>
<dt><a href="#TimedEvent">TimedEvent</a></dt>
<dd><p>An event that has an <code>eventTime</code> and <code>eventTimeStr</code></p>
</dd>
<dt><a href="#CandleLightingEvent">CandleLightingEvent</a></dt>
<dd><p>Candle lighting before Shabbat or holiday</p>
</dd>
<dt><a href="#HavdalahEvent">HavdalahEvent</a></dt>
<dd><p>Havdalah after Shabbat or holiday</p>
</dd>
<dt><a href="#Molad">Molad</a></dt>
<dd><p>Represents a molad, the moment when the new moon is &quot;born&quot;</p>
</dd>
<dt><a href="#MoladEvent">MoladEvent</a></dt>
<dd><p>Represents a Molad announcement on Shabbat Mevarchim</p>
</dd>
<dt><a href="#OmerEvent">OmerEvent</a></dt>
<dd><p>Represents a day 1-49 of counting the Omer from Pesach to Shavuot</p>
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
<dt><a href="#AsaraBTevetEvent">AsaraBTevetEvent</a></dt>
<dd><p>Because Asara B&#39;Tevet often occurs twice in the same Gregorian year,
we subclass HolidayEvent to override the <code>url()</code> method.</p>
</dd>
<dt><a href="#RoshChodeshEvent">RoshChodeshEvent</a></dt>
<dd><p>Represents Rosh Chodesh, the beginning of a new month</p>
</dd>
<dt><a href="#MevarchimChodeshEvent">MevarchimChodeshEvent</a></dt>
<dd><p>Represents Mevarchim haChodesh, the announcement of the new month</p>
</dd>
<dt><a href="#DailyLearning">DailyLearning</a></dt>
<dd><p>Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.</p>
<p>Learning schedules are provided by the <code>@hebcal/learning</code> package.</p>
</dd>
<dt><a href="#HebrewCalendar">HebrewCalendar</a></dt>
<dd><p>HebrewCalendar is the main interface to the <code>@hebcal/core</code> library.
This namespace is used to calculate holidays, rosh chodesh, candle lighting &amp; havdalah times,
Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
Event names can be rendered in several languges using the <code>locale</code> option.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#greg">greg</a></dt>
<dd><p>Gregorian date helper functions.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#parshiot">parshiot</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>The 54 parshiyot of the Torah as transilterated strings
parshiot[0] == &#39;Bereshit&#39;, parshiot[1] == &#39;Noach&#39;, parshiot[52] == &quot;Ha&#39;azinu&quot;.</p>
</dd>
<dt><a href="#version">version</a></dt>
<dd><p>DO NOT EDIT THIS AUTO-GENERATED FILE!</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#hebrew2abs">hebrew2abs(year, month, day)</a> ⇒ <code>number</code></dt>
<dd><p>Converts Hebrew date to R.D. (Rata Die) fixed days.
R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
Calendar.</p>
</dd>
<dt><a href="#abs2hebrew">abs2hebrew(abs)</a> ⇒ <code>SimpleHebrewDate</code></dt>
<dd><p>Converts absolute R.D. days to Hebrew date</p>
</dd>
<dt><a href="#isLeapYear">isLeapYear(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true if Hebrew year is a leap year</p>
</dd>
<dt><a href="#monthsInYear">monthsInYear(year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of months in this Hebrew year (either 12 or 13 depending on leap year)</p>
</dd>
<dt><a href="#daysInMonth">daysInMonth(month, year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in Hebrew month in a given year (29 or 30)</p>
</dd>
<dt><a href="#getMonthName">getMonthName(month, year)</a></dt>
<dd><p>Returns a transliterated string name of Hebrew month in year,
for example &#39;Elul&#39; or &#39;Cheshvan&#39;.</p>
</dd>
<dt><a href="#elapsedDays">elapsedDays(year)</a> ⇒ <code>number</code></dt>
<dd><p>Days from sunday prior to start of Hebrew calendar to mean
conjunction of Tishrei in Hebrew YEAR</p>
</dd>
<dt><a href="#daysInYear">daysInYear(year)</a> ⇒ <code>number</code></dt>
<dd><p>Number of days in the hebrew YEAR.
A common Hebrew calendar year can have a length of 353, 354 or 355 days
A leap Hebrew calendar year can have a length of 383, 384 or 385 days</p>
</dd>
<dt><a href="#longCheshvan">longCheshvan(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>true if Cheshvan is long in Hebrew year</p>
</dd>
<dt><a href="#shortKislev">shortKislev(year)</a> ⇒ <code>boolean</code></dt>
<dd><p>true if Kislev is short in Hebrew year</p>
</dd>
<dt><a href="#monthFromName">monthFromName(monthName)</a> ⇒ <code>number</code></dt>
<dd><p>Converts Hebrew month string name to numeric</p>
</dd>
<dt><a href="#gematriya">gematriya(num)</a> ⇒ <code>string</code></dt>
<dd><p>Converts a numerical value to a string of Hebrew letters.</p>
<p>When specifying years of the Hebrew calendar in the present millennium,
we omit the thousands (which is presently 5 [ה]).</p>
</dd>
<dt><a href="#gematriyaStrToNum">gematriyaStrToNum(str)</a> ⇒ <code>number</code></dt>
<dd><p>Converts a string of Hebrew letters to a numerical value.</p>
<p>Only considers the value of Hebrew letters <code>א</code> through <code>ת</code>.
Ignores final Hebrew letters such as <code>ך</code> (kaf sofit) or <code>ם</code> (mem sofit)
and vowels (nekudot).</p>
</dd>
<dt><a href="#omerSefira">omerSefira(omerDay, lang)</a> ⇒</dt>
<dd><p>Returns the sefira. For example, on day 8
 חֶֽסֶד שֶׁבִּגְבוּרָה
 Chesed shebiGevurah
 Lovingkindness within Might</p>
</dd>
<dt><a href="#omerTodayIs">omerTodayIs(omerDay, lang)</a> ⇒</dt>
<dd><p>Returns a sentence with that evening&#39;s omer count</p>
</dd>
<dt><a href="#omerEmoji">omerEmoji(omerDay)</a> ⇒</dt>
<dd><p>Returns an emoji number symbol with a circle, for example <code>㊲</code>
 from the “Enclosed CJK Letters and Months” block of the Unicode standard</p>
</dd>
<dt><a href="#molad">molad()</a></dt>
<dd><p>Calculates the molad for a Hebrew month</p>
</dd>
<dt><a href="#getPseudoISO">getPseudoISO(tzid, date)</a> ⇒ <code>string</code></dt>
<dd><p>Returns a string similar to <code>Date.toISOString()</code> but in the
timezone <code>tzid</code>. Contrary to the typical meaning of <code>Z</code> at the end
of the string, this is not actually a UTC date.</p>
</dd>
<dt><a href="#getTimezoneOffset">getTimezoneOffset(tzid, date)</a> ⇒ <code>number</code></dt>
<dd><p>Returns number of minutes <code>tzid</code> is offset from UTC on date <code>date</code>.</p>
</dd>
<dt><a href="#pad4">pad4(number)</a> ⇒ <code>string</code></dt>
<dd><p>Formats a number with leading zeros so the resulting string is 4 digits long.
Similar to <code>string.padStart(4, &#39;0&#39;)</code> but will also format
negative numbers similar to how the JavaScript date formats
negative year numbers (e.g. <code>-37</code> is formatted as <code>-000037</code>).</p>
</dd>
<dt><a href="#pad2">pad2(number)</a> ⇒ <code>string</code></dt>
<dd><p>Formats a number with leading zeros so the resulting string is 2 digits long.
Similar to <code>string.padStart(2, &#39;0&#39;)</code>.</p>
</dd>
</dl>

<a name="Locale"></a>

## Locale
A locale in Hebcal is used for translations/transliterations of
holidays. `@hebcal/hdate` supports four locales by default
* `en` - default, Sephardic transliterations (e.g. "Shabbat")
* `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
* `he` - Hebrew (e.g. "שַׁבָּת")
* `he-x-NoNikud` - Hebrew without nikud (e.g. "שבת")

**Kind**: global class  

* [Locale](#Locale)
    * [.lookupTranslation(id, [locale])](#Locale.lookupTranslation) ⇒ <code>string</code>
    * [.gettext(id, [locale])](#Locale.gettext) ⇒ <code>string</code>
    * [.addLocale(locale, data)](#Locale.addLocale)
    * [.addTranslation(locale, id, translation)](#Locale.addTranslation)
    * [.addTranslations(locale, data)](#Locale.addTranslations)
    * [.useLocale(locale)](#Locale.useLocale)
    * [.getLocaleName()](#Locale.getLocaleName) ⇒ <code>string</code>
    * [.getLocaleNames()](#Locale.getLocaleNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [.ordinal(n, [locale])](#Locale.ordinal) ⇒ <code>string</code>
    * [.hebrewStripNikkud(str)](#Locale.hebrewStripNikkud) ⇒ <code>string</code>

<a name="Locale.lookupTranslation"></a>

### Locale.lookupTranslation(id, [locale]) ⇒ <code>string</code>
Returns translation only if `locale` offers a non-empty translation for `id`.
Otherwise, returns `undefined`.

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID to translate |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="Locale.gettext"></a>

### Locale.gettext(id, [locale]) ⇒ <code>string</code>
By default, if no translation was found, returns `id`.

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Message ID to translate |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="Locale.addLocale"></a>

### Locale.addLocale(locale, data)
Register locale translations.

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e.: `'he'`, `'fr'`) |
| data | <code>LocaleData</code> | parsed data from a `.po` file. |

<a name="Locale.addTranslation"></a>

### Locale.addTranslation(locale, id, translation)
Adds a translation to `locale`, replacing any previous translation.

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e: `'he'`, `'fr'`). |
| id | <code>string</code> | Message ID to translate |
| translation | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Translation text |

<a name="Locale.addTranslations"></a>

### Locale.addTranslations(locale, data)
Adds multiple translations to `locale`, replacing any previous translations.

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e: `'he'`, `'fr'`). |
| data | <code>LocaleData</code> | parsed data from a `.po` file. |

<a name="Locale.useLocale"></a>

### Locale.useLocale(locale)
Activates a locale. Throws an error if the locale has not been previously added.
After setting the locale to be used, all strings marked for translations
will be represented by the corresponding translation in the specified locale.

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| locale | <code>string</code> | Locale name (i.e: `'he'`, `'fr'`) |

<a name="Locale.getLocaleName"></a>

### Locale.getLocaleName() ⇒ <code>string</code>
Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')

**Kind**: static method of [<code>Locale</code>](#Locale)  
<a name="Locale.getLocaleNames"></a>

### Locale.getLocaleNames() ⇒ <code>Array.&lt;string&gt;</code>
Returns the names of registered locales

**Kind**: static method of [<code>Locale</code>](#Locale)  
<a name="Locale.ordinal"></a>

### Locale.ordinal(n, [locale]) ⇒ <code>string</code>
**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>number</code> |  |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale. |

<a name="Locale.hebrewStripNikkud"></a>

### Locale.hebrewStripNikkud(str) ⇒ <code>string</code>
Removes nekudot from Hebrew string

**Kind**: static method of [<code>Locale</code>](#Locale)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="HDate"></a>

## HDate
Represents a Hebrew date

**Kind**: global class  

* [HDate](#HDate)
    * [new HDate([day], [month], [year])](#new_HDate_new)
    * _instance_
        * [.getFullYear()](#HDate+getFullYear) ⇒ <code>number</code>
        * [.isLeapYear()](#HDate+isLeapYear) ⇒ <code>boolean</code>
        * [.getMonth()](#HDate+getMonth) ⇒ <code>number</code>
        * [.getTishreiMonth()](#HDate+getTishreiMonth) ⇒ <code>number</code>
        * [.daysInMonth()](#HDate+daysInMonth) ⇒ <code>number</code>
        * [.getDate()](#HDate+getDate) ⇒ <code>number</code>
        * [.getDay()](#HDate+getDay) ⇒ <code>number</code>
        * [.greg()](#HDate+greg) ⇒ <code>Date</code>
        * [.abs()](#HDate+abs) ⇒ <code>number</code>
        * [.getMonthName()](#HDate+getMonthName) ⇒ <code>string</code>
        * [.render([locale], [showYear])](#HDate+render) ⇒ <code>string</code>
        * [.renderGematriya([suppressNikud])](#HDate+renderGematriya) ⇒ <code>string</code>
        * [.before(dow)](#HDate+before) ⇒ [<code>HDate</code>](#HDate)
        * [.onOrBefore(dow)](#HDate+onOrBefore) ⇒ [<code>HDate</code>](#HDate)
        * [.nearest(dow)](#HDate+nearest) ⇒ [<code>HDate</code>](#HDate)
        * [.onOrAfter(dow)](#HDate+onOrAfter) ⇒ [<code>HDate</code>](#HDate)
        * [.after(dow)](#HDate+after) ⇒ [<code>HDate</code>](#HDate)
        * [.next()](#HDate+next) ⇒ [<code>HDate</code>](#HDate)
        * [.prev()](#HDate+prev) ⇒ [<code>HDate</code>](#HDate)
        * [.add(amount, [units])](#HDate+add) ⇒ [<code>HDate</code>](#HDate)
        * [.subtract(amount, [units])](#HDate+subtract) ⇒ [<code>HDate</code>](#HDate)
        * [.deltaDays(other)](#HDate+deltaDays) ⇒ <code>number</code>
        * [.isSameDate(other)](#HDate+isSameDate) ⇒ <code>boolean</code>
        * [.toString()](#HDate+toString) ⇒ <code>string</code>
    * _static_
        * [.hebrew2abs(year, month, day)](#HDate.hebrew2abs) ⇒ <code>number</code>
        * [.isLeapYear(year)](#HDate.isLeapYear) ⇒ <code>boolean</code>
        * [.monthsInYear(year)](#HDate.monthsInYear) ⇒ <code>number</code>
        * [.daysInMonth(month, year)](#HDate.daysInMonth) ⇒ <code>number</code>
        * [.getMonthName(month, year)](#HDate.getMonthName) ⇒ <code>string</code>
        * [.monthNum(month)](#HDate.monthNum) ⇒ <code>number</code>
        * [.daysInYear(year)](#HDate.daysInYear) ⇒ <code>number</code>
        * [.longCheshvan(year)](#HDate.longCheshvan) ⇒ <code>boolean</code>
        * [.shortKislev(year)](#HDate.shortKislev) ⇒ <code>boolean</code>
        * [.monthFromName(monthName)](#HDate.monthFromName) ⇒ <code>number</code>
        * [.dayOnOrBefore(dayOfWeek, absdate)](#HDate.dayOnOrBefore) ⇒ <code>number</code>
        * [.isHDate(obj)](#HDate.isHDate) ⇒ <code>boolean</code>
        * [.fromGematriyaString(str, currentThousands)](#HDate.fromGematriyaString) ⇒ [<code>HDate</code>](#HDate)

<a name="new_HDate_new"></a>

### new HDate([day], [month], [year])
Create a Hebrew date. There are 3 basic forms for the `HDate()` constructor.

1. No parameters - represents the current Hebrew date at time of instantiation
2. One parameter
   * `Date` - represents the Hebrew date corresponding to the Gregorian date using
      local time. Hours, minutes, seconds and milliseconds are ignored.
   * `HDate` - clones a copy of the given Hebrew date
   * `number` - Converts absolute R.D. days to Hebrew date.
      R.D. 1 == the imaginary date January 1, 1 (Gregorian)
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
import {HDate, months} from '@hebcal/hdate';

const hd1 = new HDate();
const hd2 = new HDate(new Date(2008, 10, 13));
const hd3 = new HDate(15, 'Cheshvan', 5769);
const hd4 = new HDate(15, months.CHESHVAN, 5769);
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
Gets the day of the week. 0=Sunday, 6=Saturday

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+greg"></a>

### hDate.greg() ⇒ <code>Date</code>
Converts to Gregorian date

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+abs"></a>

### hDate.abs() ⇒ <code>number</code>
Returns R.D. (Rata Die) fixed days.
R.D. 1 == Monday, January 1, 1 (Gregorian)
Note also that R.D. = Julian Date − 1,721,424.5
https://en.wikipedia.org/wiki/Rata_Die#Dershowitz_and_Reingold

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+getMonthName"></a>

### hDate.getMonthName() ⇒ <code>string</code>
Returns a transliterated Hebrew month name, e.g. `'Elul'` or `'Cheshvan'`.

**Kind**: instance method of [<code>HDate</code>](#HDate)  
<a name="HDate+render"></a>

### hDate.render([locale], [showYear]) ⇒ <code>string</code>
Renders this Hebrew date as a translated or transliterated string,
including ordinal e.g. `'15th of Cheshvan, 5769'`.

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [locale] | <code>string</code> |  | Optional locale name (defaults to active locale). |
| [showYear] | <code>boolean</code> | <code>true</code> | Display year (defaults to true). |

**Example**  
```js
import {HDate, months} from '@hebcal/hdate';

const hd = new HDate(15, months.CHESHVAN, 5769);
console.log(hd.render('en')); // '15th of Cheshvan, 5769'
console.log(hd.render('he')); // '15 חֶשְׁוָן, 5769'
```
<a name="HDate+renderGematriya"></a>

### hDate.renderGematriya([suppressNikud]) ⇒ <code>string</code>
Renders this Hebrew date in Hebrew gematriya, regardless of locale.

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Default |
| --- | --- | --- |
| [suppressNikud] | <code>boolean</code> | <code>false</code> | 

**Example**  
```js
import {HDate, months} from '@hebcal/hdate';
const hd = new HDate(15, months.CHESHVAN, 5769);
console.log(hd.renderGematriya()); // 'ט״ו חֶשְׁוָן תשס״ט'
```
<a name="HDate+before"></a>

### hDate.before(dow) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the a dayNumber before the current date.
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | day of week |

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

### hDate.after(dow) ⇒ [<code>HDate</code>](#HDate)
Returns an `HDate` representing the a dayNumber after the current date.
Sunday=0, Saturday=6

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| dow | <code>number</code> | day of week |

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
<a name="HDate+add"></a>

### hDate.add(amount, [units]) ⇒ [<code>HDate</code>](#HDate)
Returns a cloned `HDate` object with a specified amount of time added

Units are case insensitive, and support plural and short forms.
Note, short forms are case sensitive.

| Unit | Shorthand | Description
| --- | --- | --- |
| `day` | `d` | days |
| `week` | `w` | weeks |
| `month` | `M` | months |
| `year` | `y` | years |

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Default |
| --- | --- | --- |
| amount | <code>number</code> |  | 
| [units] | <code>string</code> | <code>&quot;d&quot;</code> | 

<a name="HDate+subtract"></a>

### hDate.subtract(amount, [units]) ⇒ [<code>HDate</code>](#HDate)
Returns a cloned `HDate` object with a specified amount of time subracted

Units are case insensitive, and support plural and short forms.
Note, short forms are case sensitive.

| Unit | Shorthand | Description
| --- | --- | --- |
| `day` | `d` | days |
| `week` | `w` | weeks |
| `month` | `M` | months |
| `year` | `y` | years |

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Default |
| --- | --- | --- |
| amount | <code>number</code> |  | 
| [units] | <code>string</code> | <code>&quot;d&quot;</code> | 

**Example**  
```js
import {HDate, months} from '@hebcal/hdate';

const hd1 = new HDate(15, months.CHESHVAN, 5769);
const hd2 = hd1.add(1, 'weeks'); // 7 Kislev 5769
const hd3 = hd1.add(-3, 'M'); // 30 Av 5768
```
<a name="HDate+deltaDays"></a>

### hDate.deltaDays(other) ⇒ <code>number</code>
Returns the difference in days between the two given HDates.

The result is positive if `this` date is comes chronologically
after the `other` date, and negative
if the order of the two dates is reversed.

The result is zero if the two dates are identical.

**Kind**: instance method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>HDate</code>](#HDate) | Hebrew date to compare |

**Example**  
```js
import {HDate, months} from '@hebcal/hdate';

const hd1 = new HDate(25, months.KISLEV, 5770);
const hd2 = new HDate(15, months.CHESHVAN, 5769);
const days = hd1.deltaDays(hd2); // 394
```
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
<a name="HDate.hebrew2abs"></a>

### HDate.hebrew2abs(year, month, day) ⇒ <code>number</code>
Converts Hebrew date to R.D. (Rata Die) fixed days.
R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
Calendar.

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |
| month | <code>number</code> | Hebrew month |
| day | <code>number</code> | Hebrew date (1-30) |

<a name="HDate.isLeapYear"></a>

### HDate.isLeapYear(year) ⇒ <code>boolean</code>
Returns true if Hebrew year is a leap year

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="HDate.monthsInYear"></a>

### HDate.monthsInYear(year) ⇒ <code>number</code>
Number of months in this Hebrew year (either 12 or 13 depending on leap year)

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="HDate.daysInMonth"></a>

### HDate.daysInMonth(month, year) ⇒ <code>number</code>
Number of days in Hebrew month in a given year (29 or 30)

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="HDate.getMonthName"></a>

### HDate.getMonthName(month, year) ⇒ <code>string</code>
Returns a transliterated string name of Hebrew month in year,
for example 'Elul' or 'Cheshvan'.

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="HDate.monthNum"></a>

### HDate.monthNum(month) ⇒ <code>number</code>
Returns the Hebrew month number (NISAN=1, TISHREI=7)

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> \| <code>string</code> | A number, or Hebrew month name string |

<a name="HDate.daysInYear"></a>

### HDate.daysInYear(year) ⇒ <code>number</code>
Number of days in the hebrew YEAR

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="HDate.longCheshvan"></a>

### HDate.longCheshvan(year) ⇒ <code>boolean</code>
true if Cheshvan is long in Hebrew year

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="HDate.shortKislev"></a>

### HDate.shortKislev(year) ⇒ <code>boolean</code>
true if Kislev is short in Hebrew year

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="HDate.monthFromName"></a>

### HDate.monthFromName(monthName) ⇒ <code>number</code>
Converts Hebrew month string name to numeric

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Description |
| --- | --- | --- |
| monthName | <code>string</code> \| <code>number</code> | monthName |

<a name="HDate.dayOnOrBefore"></a>

### HDate.dayOnOrBefore(dayOfWeek, absdate) ⇒ <code>number</code>
Note: Applying this function to d+6 gives us the DAYNAME on or after an
absolute day d. Similarly, applying it to d+3 gives the DAYNAME nearest to
absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
date d, and applying it to d+7 gives the DAYNAME following absolute date d.

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| dayOfWeek | <code>number</code> | 
| absdate | <code>number</code> | 

<a name="HDate.isHDate"></a>

### HDate.isHDate(obj) ⇒ <code>boolean</code>
Tests if the object is an instance of `HDate`

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type |
| --- | --- |
| obj | <code>any</code> | 

<a name="HDate.fromGematriyaString"></a>

### HDate.fromGematriyaString(str, currentThousands) ⇒ [<code>HDate</code>](#HDate)
Construct a new instance of `HDate` from a Gematriya-formatted string

**Kind**: static method of [<code>HDate</code>](#HDate)  

| Param | Type | Default |
| --- | --- | --- |
| str | <code>string</code> |  | 
| currentThousands | <code>number</code> | <code>5000</code> | 

**Example**  
```js
HDate.fromGematriyaString('כ״ז בְּתַמּוּז תשפ״ג') // 27 Tamuz 5783
 HDate.fromGematriyaString('כ׳ סיון תש״ד') // 20 Sivan 5704
 HDate.fromGematriyaString('ה׳ אִיָיר תש״ח') // 5 Iyyar 5708
```
<a name="Event"></a>

## Event
Represents an Event with a title, date, and flags

**Kind**: global class  

* [Event](#Event)
    * [new Event(date, desc, [mask], [attrs])](#new_Event_new)
    * [.getDate()](#Event+getDate) ⇒ [<code>HDate</code>](#HDate)
    * [.getDesc()](#Event+getDesc) ⇒ <code>string</code>
    * [.getFlags()](#Event+getFlags) ⇒ <code>number</code>
    * [.render([locale])](#Event+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#Event+renderBrief) ⇒ <code>string</code>
    * [.getEmoji()](#Event+getEmoji) ⇒ <code>string</code> \| <code>null</code>
    * [.basename()](#Event+basename) ⇒ <code>string</code>
    * [.url()](#Event+url) ⇒ <code>string</code> \| <code>undefined</code>
    * [.observedInIsrael()](#Event+observedInIsrael) ⇒ <code>boolean</code>
    * [.observedInDiaspora()](#Event+observedInDiaspora) ⇒ <code>boolean</code>
    * [.observedIn(il)](#Event+observedIn) ⇒ <code>boolean</code>
    * [.clone()](#Event+clone) ⇒ [<code>Event</code>](#Event)
    * [.getCategories()](#Event+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_Event_new"></a>

### new Event(date, desc, [mask], [attrs])
Constructs Event


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | [<code>HDate</code>](#HDate) |  | Hebrew date event occurs |
| desc | <code>string</code> |  | Description (not translated) |
| [mask] | <code>number</code> | <code>0</code> | optional bitmask of holiday flags (see [flags](#flags)) |
| [attrs] | <code>Object</code> | <code>{}</code> | optional additional attributes (e.g. `eventTimeStr`, `cholHaMoedDay`) |

<a name="Event+getDate"></a>

### event.getDate() ⇒ [<code>HDate</code>](#HDate)
Hebrew date of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getDesc"></a>

### event.getDesc() ⇒ <code>string</code>
Untranslated description of this event

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getFlags"></a>

### event.getFlags() ⇒ <code>number</code>
Bitmask of optional event flags. See [flags](#flags)

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+render"></a>

### event.render([locale]) ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

**Example**  
```js
const ev = new Event(new HDate(6, 'Sivan', 5749), 'Shavuot', flags.CHAG);
ev.render('en'); // 'Shavuot'
ev.render('he'); // 'שָׁבוּעוֹת'
ev.render('ashkenazi'); // 'Shavuos'
```
<a name="Event+renderBrief"></a>

### event.renderBrief([locale]) ⇒ <code>string</code>
Returns a brief (translated) description of this event.
For most events, this is the same as render(). For some events, it procudes
a shorter text (e.g. without a time or added description).

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="Event+getEmoji"></a>

### event.getEmoji() ⇒ <code>string</code> \| <code>null</code>
Optional holiday-specific Emoji or `null`.

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+basename"></a>

### event.basename() ⇒ <code>string</code>
Returns a simplified (untranslated) description for this event. For example,
the [HolidayEvent](#HolidayEvent) class supports
"Erev Pesach" => "Pesach", and "Sukkot III (CH''M)" => "Sukkot".
For many holidays the basename and the event description are the same.

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+url"></a>

### event.url() ⇒ <code>string</code> \| <code>undefined</code>
Returns a URL to hebcal.com or sefaria.org for more detail on the event.
Returns `undefined` for events with no detail page.

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+observedInIsrael"></a>

### event.observedInIsrael() ⇒ <code>boolean</code>
Is this event observed in Israel?

**Kind**: instance method of [<code>Event</code>](#Event)  
**Example**  
```js
const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
ev1.observedInIsrael(); // false
const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
ev2.observedInIsrael(); // true
```
<a name="Event+observedInDiaspora"></a>

### event.observedInDiaspora() ⇒ <code>boolean</code>
Is this event observed in the Diaspora?

**Kind**: instance method of [<code>Event</code>](#Event)  
**Example**  
```js
const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
ev1.observedInDiaspora(); // true
const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
ev2.observedInDiaspora(); // true
```
<a name="Event+observedIn"></a>

### event.observedIn(il) ⇒ <code>boolean</code>
Is this event observed in Israel/Diaspora?

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type |
| --- | --- |
| il | <code>boolean</code> | 

**Example**  
```js
const ev1 = new Event(new HDate(7, 'Sivan', 5749), 'Shavuot II', flags.CHAG | flags.CHUL_ONLY);
ev1.observedIn(false); // true
ev1.observedIn(true); // false
const ev2 = new Event(new HDate(26, 'Kislev', 5749), 'Chanukah: 3 Candles', 0);
ev2.observedIn(false); // true
ev2.observedIn(true); // true
```
<a name="Event+clone"></a>

### event.clone() ⇒ [<code>Event</code>](#Event)
Makes a clone of this Event object

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="Event+getCategories"></a>

### event.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
Returns a list of event categories

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="HebrewDateEvent"></a>

## HebrewDateEvent
Daily Hebrew date ("11th of Sivan, 5780")

**Kind**: global class  

* [HebrewDateEvent](#HebrewDateEvent)
    * [new HebrewDateEvent(date)](#new_HebrewDateEvent_new)
    * [.render([locale])](#HebrewDateEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#HebrewDateEvent+renderBrief) ⇒ <code>string</code>

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
import {HDate, HebrewDateEvent, months} from '@hebcal/core';

const hd = new HDate(15, months.CHESHVAN, 5769);
const ev = new HebrewDateEvent(hd);
console.log(ev.render('en')); // '15th of Cheshvan, 5769'
console.log(ev.render('he')); // 'ט״ו חֶשְׁוָן תשס״ט'
```
<a name="HebrewDateEvent+renderBrief"></a>

### hebrewDateEvent.renderBrief([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>HebrewDateEvent</code>](#HebrewDateEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

**Example**  
```js
import {HDate, HebrewDateEvent, months} from '@hebcal/core';

const hd = new HDate(15, months.CHESHVAN, 5769);
const ev = new HebrewDateEvent(hd);
console.log(ev.renderBrief()); // '15th of Cheshvan'
console.log(ev.renderBrief('he')); // 'ט״ו חֶשְׁוָן'
```
<a name="GeoLocation"></a>

## GeoLocation
A class that contains location information such as latitude and longitude required for astronomical calculations. The
elevation field may not be used by some calculation engines and would be ignored if set.

**Kind**: global class  
**Version**: 1.1  
**Author**: &copy; Eliyahu Hershfeld 2004 - 2016  

* [GeoLocation](#GeoLocation)
    * [new GeoLocation(name, latitude, longitude, elevation, timeZoneId)](#new_GeoLocation_new)
    * [.getElevation()](#GeoLocation+getElevation) ⇒ <code>number</code>
    * [.setElevation(elevation)](#GeoLocation+setElevation)
    * [.getLatitude()](#GeoLocation+getLatitude) ⇒ <code>number</code>
    * [.getLongitude()](#GeoLocation+getLongitude) ⇒ <code>number</code>
    * [.getLocationName()](#GeoLocation+getLocationName) ⇒ <code>string</code> \| <code>null</code>
    * [.setLocationName(name)](#GeoLocation+setLocationName)
    * [.getTimeZone()](#GeoLocation+getTimeZone) ⇒ <code>string</code>
    * [.setTimeZone(timeZoneId)](#GeoLocation+setTimeZone)

<a name="new_GeoLocation_new"></a>

### new GeoLocation(name, latitude, longitude, elevation, timeZoneId)
GeoLocation constructor with parameters for all required fields.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The location name for display use such as &quot;Lakewood, NJ&quot; |
| latitude | <code>number</code> | the latitude in a double format such as 40.095965 for Lakewood, NJ.            <b>Note: </b> For latitudes south of the equator, a negative value should be used. |
| longitude | <code>number</code> | double the longitude in a double format such as -74.222130 for Lakewood, NJ.            <b>Note: </b> For longitudes west of the <a href="http://en.wikipedia.org/wiki/Prime_Meridian">Prime            Meridian </a> (Greenwich), a negative value should be used. |
| elevation | <code>number</code> | the elevation above sea level in Meters. Elevation is not used in most algorithms used for calculating            sunrise and set. |
| timeZoneId | <code>string</code> | the <code>TimeZone</code> for the location. |

<a name="GeoLocation+getElevation"></a>

### geoLocation.getElevation() ⇒ <code>number</code>
Method to get the elevation in Meters.

**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>number</code> - Returns the elevation in Meters.  
<a name="GeoLocation+setElevation"></a>

### geoLocation.setElevation(elevation)
Method to set the elevation in Meters <b>above </b> sea level.

**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  

| Param | Type | Description |
| --- | --- | --- |
| elevation | <code>number</code> | The elevation to set in Meters. An Error will be thrown if the value is a negative. |

<a name="GeoLocation+getLatitude"></a>

### geoLocation.getLatitude() ⇒ <code>number</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>number</code> - Returns the latitude.  
<a name="GeoLocation+getLongitude"></a>

### geoLocation.getLongitude() ⇒ <code>number</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>number</code> - Returns the longitude.  
<a name="GeoLocation+getLocationName"></a>

### geoLocation.getLocationName() ⇒ <code>string</code> \| <code>null</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>string</code> \| <code>null</code> - Returns the location name.  
<a name="GeoLocation+setLocationName"></a>

### geoLocation.setLocationName(name)
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>null</code> | The setter method for the display name. |

<a name="GeoLocation+getTimeZone"></a>

### geoLocation.getTimeZone() ⇒ <code>string</code>
**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  
**Returns**: <code>string</code> - Returns the timeZone.  
<a name="GeoLocation+setTimeZone"></a>

### geoLocation.setTimeZone(timeZoneId)
Method to set the TimeZone.

**Kind**: instance method of [<code>GeoLocation</code>](#GeoLocation)  

| Param | Type | Description |
| --- | --- | --- |
| timeZoneId | <code>string</code> | The timeZone to set. |

<a name="NOAACalculator"></a>

## NOAACalculator
Implementation of sunrise and sunset methods to calculate astronomical times based on the <a
href="http://noaa.gov">NOAA</a> algorithm. This calculator uses the Java algorithm based on the implementation by <a
href="http://noaa.gov">NOAA - National Oceanic and Atmospheric Administration</a>'s <a href =
"http://www.srrb.noaa.gov/highlights/sunrise/sunrise.html">Surface Radiation Research Branch</a>. NOAA's <a
href="http://www.srrb.noaa.gov/highlights/sunrise/solareqns.PDF">implementation</a> is based on equations from <a
href="http://www.willbell.com/math/mc1.htm">Astronomical Algorithms</a> by <a
href="http://en.wikipedia.org/wiki/Jean_Meeus">Jean Meeus</a>. Added to the algorithm is an adjustment of the zenith
to account for elevation. The algorithm can be found in the <a
href="http://en.wikipedia.org/wiki/Sunrise_equation">Wikipedia Sunrise Equation</a> article.

**Kind**: global class  
**Author**: &copy; Eliyahu Hershfeld 2011 - 2019  

* [NOAACalculator](#NOAACalculator)
    * [new NOAACalculator(geoLocation, date)](#new_NOAACalculator_new)
    * _instance_
        * [.getSunrise()](#NOAACalculator+getSunrise) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSeaLevelSunrise()](#NOAACalculator+getSeaLevelSunrise) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getBeginCivilTwilight()](#NOAACalculator+getBeginCivilTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getBeginNauticalTwilight()](#NOAACalculator+getBeginNauticalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getBeginAstronomicalTwilight()](#NOAACalculator+getBeginAstronomicalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSunset()](#NOAACalculator+getSunset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSeaLevelSunset()](#NOAACalculator+getSeaLevelSunset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getEndCivilTwilight()](#NOAACalculator+getEndCivilTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getEndNauticalTwilight()](#NOAACalculator+getEndNauticalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getEndAstronomicalTwilight()](#NOAACalculator+getEndAstronomicalTwilight) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSunriseOffsetByDegrees(offsetZenith)](#NOAACalculator+getSunriseOffsetByDegrees) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSunsetOffsetByDegrees(offsetZenith)](#NOAACalculator+getSunsetOffsetByDegrees) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getUTCSunrise0(zenith)](#NOAACalculator+getUTCSunrise0) ⇒ <code>number</code>
        * [.getUTCSeaLevelSunrise(zenith)](#NOAACalculator+getUTCSeaLevelSunrise) ⇒ <code>number</code>
        * [.getUTCSunset0(zenith)](#NOAACalculator+getUTCSunset0) ⇒ <code>number</code>
        * [.getUTCSeaLevelSunset(zenith)](#NOAACalculator+getUTCSeaLevelSunset) ⇒ <code>number</code>
        * [.getElevationAdjustment(elevation)](#NOAACalculator+getElevationAdjustment) ⇒ <code>number</code>
        * [.adjustZenith(zenith, elevation)](#NOAACalculator+adjustZenith) ⇒ <code>number</code>
        * [.getUTCSunrise(date, geoLocation, zenith, adjustForElevation)](#NOAACalculator+getUTCSunrise) ⇒
        * [.getUTCSunset(date, geoLocation, zenith, adjustForElevation)](#NOAACalculator+getUTCSunset) ⇒
        * [.getTemporalHour(startOfDay, endOfDay)](#NOAACalculator+getTemporalHour) ⇒ <code>number</code>
        * [.getSunTransit(startOfDay, endOfDay)](#NOAACalculator+getSunTransit) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getDateFromTime(time, isSunrise)](#NOAACalculator+getDateFromTime) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
    * _static_
        * [.CIVIL_ZENITH](#NOAACalculator.CIVIL_ZENITH)
        * [.NAUTICAL_ZENITH](#NOAACalculator.NAUTICAL_ZENITH)
        * [.ASTRONOMICAL_ZENITH](#NOAACalculator.ASTRONOMICAL_ZENITH)
        * [.getTimeOffset(time, offset)](#NOAACalculator.getTimeOffset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
        * [.getSolarElevation(date, lat, lon)](#NOAACalculator.getSolarElevation) ⇒ <code>number</code>
        * [.getSolarAzimuth(date, latitude, lon)](#NOAACalculator.getSolarAzimuth) ⇒ <code>number</code>

<a name="new_NOAACalculator_new"></a>

### new NOAACalculator(geoLocation, date)
A constructor that takes in <a href="http://en.wikipedia.org/wiki/Geolocation">geolocation</a> information as a
parameter.


| Param | Type | Description |
| --- | --- | --- |
| geoLocation | [<code>GeoLocation</code>](#GeoLocation) | The location information used for calculating astronomical sun times. |
| date | <code>Temporal.PlainDate</code> |  |

<a name="NOAACalculator+getSunrise"></a>

### noaaCalculator.getSunrise() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
The getSunrise method Returns a `Date` representing the
[elevation adjusted](getElevationAdjustment) sunrise time. The zenith used
for the calculation uses [geometric zenith](GEOMETRIC_ZENITH) of 90&deg; plus
[getElevationAdjustment](getElevationAdjustment). This is adjusted
to add approximately 50/60 of a degree to account for 34 archminutes of refraction
and 16 archminutes for the sun's radius for a total of [90.83333&deg;](adjustZenith).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - the `Date` representing the exact sunrise time. If the calculation can't be computed such as
        in the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
        does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- adjustZenith
- getSeaLevelSunrise()
- getUTCSunrise

<a name="NOAACalculator+getSeaLevelSunrise"></a>

### noaaCalculator.getSeaLevelSunrise() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the sunrise without [elevation
adjustment](getElevationAdjustment). Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
something that is not affected by elevation. This method returns sunrise calculated at sea level. This forms the
base for dawn calculations that are calculated as a dip below the horizon before sunrise.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - the `Date` representing the exact sea-level sunrise time. If the calculation can't be computed
        such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
        where it does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- getSunrise
- getUTCSeaLevelSunrise
- getSeaLevelSunset()

<a name="NOAACalculator+getBeginCivilTwilight"></a>

### noaaCalculator.getBeginCivilTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the beginning of civil twilight (dawn) using a zenith of [96&deg;](CIVIL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the beginning of civil twilight using a zenith of 96&deg;. If the calculation
        can't be computed, null will be returned. See detailed explanation on top of the page.  
**See**: CIVIL_ZENITH  
<a name="NOAACalculator+getBeginNauticalTwilight"></a>

### noaaCalculator.getBeginNauticalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the beginning of nautical twilight using a zenith of [102&deg;](NAUTICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the beginning of nautical twilight using a zenith of 102&deg;. If the
        calculation can't be computed null will be returned. See detailed explanation on top of the page.  
**See**: NAUTICAL_ZENITH  
<a name="NOAACalculator+getBeginAstronomicalTwilight"></a>

### noaaCalculator.getBeginAstronomicalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the beginning of astronomical twilight using a zenith of [108&deg;](ASTRONOMICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the beginning of astronomical twilight using a zenith of 108&deg;. If the
        calculation can't be computed, null will be returned. See detailed explanation on top of the page.  
**See**: ASTRONOMICAL_ZENITH  
<a name="NOAACalculator+getSunset"></a>

### noaaCalculator.getSunset() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
The getSunset method Returns a `Date` representing the
[elevation adjusted](getElevationAdjustment) sunset time. The zenith used for
the calculation uses [geometric zenith](GEOMETRIC_ZENITH) of 90&deg; plus
[getElevationAdjustment](getElevationAdjustment). This is adjusted
to add approximately 50/60 of a degree to account for 34 archminutes of refraction
and 16 archminutes for the sun's radius for a total of [90.83333&deg;](adjustZenith).
Note:
In certain cases the calculates sunset will occur before sunrise. This will typically happen when a timezone
other than the local timezone is used (calculating Los Angeles sunset using a GMT timezone for example). In this
case the sunset date will be incremented to the following date.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` representing the exact sunset time. If the calculation can't be computed such as in
        the Arctic Circle where there is at least one day a year where the sun does not rise, and one where it
        does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- adjustZenith
- getSeaLevelSunset()
- getUTCSunset

<a name="NOAACalculator+getSeaLevelSunset"></a>

### noaaCalculator.getSeaLevelSunset() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the sunset without [elevation
adjustment](getElevationAdjustment). Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible light,
something that is not affected by elevation. This method returns sunset calculated at sea level. This forms the
base for dusk calculations that are calculated as a dip below the horizon after sunset.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` representing the exact sea-level sunset time. If the calculation can't be computed
        such as in the Arctic Circle where there is at least one day a year where the sun does not rise, and one
        where it does not set, a null will be returned. See detailed explanation on top of the page.  
**See**

- getSunset
- getUTCSeaLevelSunset

<a name="NOAACalculator+getEndCivilTwilight"></a>

### noaaCalculator.getEndCivilTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the end of civil twilight using a zenith of [96&deg;](CIVIL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the end of civil twilight using a zenith of [96&deg;](CIVIL_ZENITH). If
        the calculation can't be computed, null will be returned. See detailed explanation on top of the page.  
**See**: CIVIL_ZENITH  
<a name="NOAACalculator+getEndNauticalTwilight"></a>

### noaaCalculator.getEndNauticalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the end of nautical twilight using a zenith of [102&deg;](NAUTICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the end of nautical twilight using a zenith of [102&deg;](NAUTICAL_ZENITH)
        . If the calculation can't be computed, null will be returned. See detailed explanation on top of the
        page.  
**See**: NAUTICAL_ZENITH  
<a name="NOAACalculator+getEndAstronomicalTwilight"></a>

### noaaCalculator.getEndAstronomicalTwilight() ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns the end of astronomical twilight using a zenith of [108&deg;](ASTRONOMICAL_ZENITH).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the end of astronomical twilight using a zenith of [108&deg;](ASTRONOMICAL_ZENITH). If the calculation can't be computed, null will be returned. See detailed explanation on top
        of the page.  
**See**: ASTRONOMICAL_ZENITH  
<a name="NOAACalculator+getSunriseOffsetByDegrees"></a>

### noaaCalculator.getSunriseOffsetByDegrees(offsetZenith) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A utility method that returns the time of an offset by degrees below or above the horizon of
[sunrise](getSunrise()). Note that the degree offset is from the vertical, so for a calculation of 14&deg;
before sunrise, an offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a parameter.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` of the offset after (or before) [getSunrise](getSunrise). If the calculation
        can't be computed such as in the Arctic Circle where there is at least one day a year where the sun does
        not rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
        page.  

| Param | Type | Description |
| --- | --- | --- |
| offsetZenith | <code>number</code> | the degrees before [getSunrise](getSunrise) to use in the calculation. For time after sunrise use            negative numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg;            before sunrise, an offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a            parameter. |

<a name="NOAACalculator+getSunsetOffsetByDegrees"></a>

### noaaCalculator.getSunsetOffsetByDegrees(offsetZenith) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A utility method that returns the time of an offset by degrees below or above the horizon of [sunset](getSunset()). Note that the degree offset is from the vertical, so for a calculation of 14&deg; after sunset, an
offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a parameter.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date`of the offset after (or before) [getSunset](getSunset). If the calculation can't
        be computed such as in the Arctic Circle where there is at least one day a year where the sun does not
        rise, and one where it does not set, a null will be returned. See detailed explanation on top of the
        page.  

| Param | Type | Description |
| --- | --- | --- |
| offsetZenith | <code>number</code> | the degrees after [getSunset](getSunset) to use in the calculation. For time before sunset use negative            numbers. Note that the degree offset is from the vertical, so for a calculation of 14&deg; after            sunset, an offset of 14 + [GEOMETRIC_ZENITH](GEOMETRIC_ZENITH) = 104 would have to be passed as a parameter. |

<a name="NOAACalculator+getUTCSunrise0"></a>

### noaaCalculator.getUTCSunrise0(zenith) ⇒ <code>number</code>
A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
daylight savings time.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  

| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time after sunrise use negative numbers. |

<a name="NOAACalculator+getUTCSeaLevelSunrise"></a>

### noaaCalculator.getUTCSeaLevelSunrise(zenith) ⇒ <code>number</code>
A method that returns the sunrise in UTC time without correction for time zone offset from GMT and without using
daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the amount of visible
light, something that is not affected by elevation. This method returns UTC sunrise calculated at sea level. This
forms the base for dawn calculations that are calculated as a dip below the horizon before sunrise.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  
**See**

- getUTCSunrise
- getUTCSeaLevelSunset


| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time after sunrise use negative numbers. |

<a name="NOAACalculator+getUTCSunset0"></a>

### noaaCalculator.getUTCSunset0(zenith) ⇒ <code>number</code>
A method that returns the sunset in UTC time without correction for time zone offset from GMT and without using
daylight savings time.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  
**See**: getUTCSeaLevelSunset  

| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time after sunset use negative numbers. |

<a name="NOAACalculator+getUTCSeaLevelSunset"></a>

### noaaCalculator.getUTCSeaLevelSunset(zenith) ⇒ <code>number</code>
A method that returns the sunset in UTC time without correction for elevation, time zone offset from GMT and
without using daylight savings time. Non-sunrise and sunset calculations such as dawn and dusk, depend on the
amount of visible light, something that is not affected by elevation. This method returns UTC sunset calculated
at sea level. This forms the base for dusk calculations that are calculated as a dip below the horizon after
sunset.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The time in the format: 18.75 for 18:45:00 UTC/GMT. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, `NaN` will be returned. See detailed explanation on top of the page.  
**See**

- getUTCSunset
- getUTCSeaLevelSunrise


| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the degrees below the horizon. For time before sunset use negative numbers. |

<a name="NOAACalculator+getElevationAdjustment"></a>

### noaaCalculator.getElevationAdjustment(elevation) ⇒ <code>number</code>
Method to return the adjustment to the zenith required to account for the elevation. Since a person at a higher
elevation can see farther below the horizon, the calculation for sunrise / sunset is calculated below the horizon
used at sea level. This is only used for sunrise and sunset and not times before or after it such as
[nautical twilight](getBeginNauticalTwilight()) since those
calculations are based on the level of available light at the given dip below the horizon, something that is not
affected by elevation, the adjustment should only made if the zenith == 90&deg; [adjusted](adjustZenith)
for refraction and solar radius. The algorithm used is

<pre>
elevationAdjustment = Math.toDegrees(Math.acos(earthRadiusInMeters / (earthRadiusInMeters + elevationMeters)));
</pre>

The source of this algorithm is <a href="http://www.calendarists.com">Calendrical Calculations</a> by Edward M.
Reingold and Nachum Dershowitz. An alternate algorithm that produces an almost identical (but not accurate)
result found in Ma'aglay Tzedek by Moishe Kosower and other sources is:

<pre>
elevationAdjustment = 0.0347 * Math.sqrt(elevationMeters);
</pre>

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - the adjusted zenith  

| Param | Type | Description |
| --- | --- | --- |
| elevation | <code>number</code> | elevation in Meters. |

<a name="NOAACalculator+adjustZenith"></a>

### noaaCalculator.adjustZenith(zenith, elevation) ⇒ <code>number</code>
Adjusts the zenith of astronomical sunrise and sunset to account for solar refraction, solar radius and
elevation. The value for Sun's zenith and true rise/set Zenith (used in this class and subclasses) is the angle
that the center of the Sun makes to a line perpendicular to the Earth's surface. If the Sun were a point and the
Earth were without an atmosphere, true sunset and sunrise would correspond to a 90&deg; zenith. Because the Sun
is not a point, and because the atmosphere refracts light, this 90&deg; zenith does not, in fact, correspond to
true sunset or sunrise, instead the centre of the Sun's disk must lie just below the horizon for the upper edge
to be obscured. This means that a zenith of just above 90&deg; must be used. The Sun subtends an angle of 16
minutes of arc, and atmospheric refraction
accounts for 34 minutes or so, giving a total
of 50 arcminutes. The total value for ZENITH is 90+(5/6) or 90.8333333&deg; for true sunrise/sunset. Since a
person at an elevation can see blow the horizon of a person at sea level, this will also adjust the zenith to
account for elevation if available. Note that this will only adjust the value if the zenith is exactly 90 degrees.
For values below and above this no correction is done. As an example, astronomical twilight is when the sun is
18&deg; below the horizon or [108&deg;
below the zenith](ASTRONOMICAL_ZENITH). This is traditionally calculated with none of the above mentioned adjustments. The same goes
for various <em>tzais</em> and <em>alos</em> times such as the
[16.1&deg;](ZmanimCalendar#ZENITH_16_POINT_1) dip used in
[ComplexZmanimCalendar#getAlos16Point1Degrees](ComplexZmanimCalendar#getAlos16Point1Degrees).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - The zenith adjusted to include the sun's radius, refracton
        and [elevation](getElevationAdjustment) adjustment. This will only be adjusted for
        sunrise and sunset (if the zenith == 90&deg;)  
**See**: getElevationAdjustment  

| Param | Type | Description |
| --- | --- | --- |
| zenith | <code>number</code> | the azimuth below the vertical zenith of 90&deg;. For sunset typically the [zenith](adjustZenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](adjustZenith)            this slightly to account for solar refraction and the sun's radius. Another example would be            [getEndNauticalTwilight](getEndNauticalTwilight) that passes            [NAUTICAL_ZENITH](NAUTICAL_ZENITH) to this method. |
| elevation | <code>number</code> | elevation in Meters. |

<a name="NOAACalculator+getUTCSunrise"></a>

### noaaCalculator.getUTCSunrise(date, geoLocation, zenith, adjustForElevation) ⇒
A method that calculates UTC sunrise as well as any time based on an angle above or below sunrise.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: The UTC time of sunrise in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
        the calculation (expected behavior for some locations such as near the poles,
        `NaN` will be returned.  

| Param | Description |
| --- | --- |
| date | Used to calculate day of year. |
| geoLocation | The location information used for astronomical calculating sun times. |
| zenith | the azimuth below the vertical zenith of 90 degrees. for sunrise typically the [zenith](adjustZenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](adjustZenith)            this slightly to account for solar refraction and the sun's radius. Another example would be            [getBeginNauticalTwilight](getBeginNauticalTwilight) that passes            [NAUTICAL_ZENITH](NAUTICAL_ZENITH) to this method. |
| adjustForElevation | Should the time be adjusted for elevation |

<a name="NOAACalculator+getUTCSunset"></a>

### noaaCalculator.getUTCSunset(date, geoLocation, zenith, adjustForElevation) ⇒
A method that calculates UTC sunset as well as any time based on an angle above or below sunset.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: The UTC time of sunset in 24 hour format. 5:45:00 AM will return 5.75.0. If an error was encountered in
        the calculation (expected behavior for some locations such as near the poles,
        `NaN` will be returned.  

| Param | Description |
| --- | --- |
| date | Used to calculate day of year. |
| geoLocation | The location information used for astronomical calculating sun times. |
| zenith | the azimuth below the vertical zenith of 90&deg;. For sunset typically the [zenith](adjustZenith) used for the calculation uses geometric zenith of 90&deg; and [adjusts](adjustZenith)            this slightly to account for solar refraction and the sun's radius. Another example would be            [getEndNauticalTwilight](getEndNauticalTwilight) that passes            [NAUTICAL_ZENITH](NAUTICAL_ZENITH) to this method. |
| adjustForElevation | Should the time be adjusted for elevation |

<a name="NOAACalculator+getTemporalHour"></a>

### noaaCalculator.getTemporalHour(startOfDay, endOfDay) ⇒ <code>number</code>
A utility method that will allow the calculation of a temporal (solar) hour based on the sunrise and sunset
passed as parameters to this method. An example of the use of this method would be the calculation of a
non-elevation adjusted temporal hour by passing in [sea level sunrise](getSeaLevelSunrise()) and
[sea level sunset](getSeaLevelSunset()) as parameters.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - the <code>long</code> millisecond length of the temporal hour. If the calculation can't be computed a
        `NaN` will be returned. See detailed explanation on top of the page.  
**See**: getTemporalHour()  

| Param | Type | Description |
| --- | --- | --- |
| startOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | The start of the day. |
| endOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | The end of the day. |

<a name="NOAACalculator+getSunTransit"></a>

### noaaCalculator.getSunTransit(startOfDay, endOfDay) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns sundial or solar noon. It occurs when the Sun is <a href
="http://en.wikipedia.org/wiki/Transit_%28astronomy%29">transiting</a> the <a
href="http://en.wikipedia.org/wiki/Meridian_%28astronomy%29">celestial meridian</a>. In this class it is
calculated as halfway between the sunrise and sunset passed to this method. This time can be slightly off the
real transit time due to changes in declination (the lengthening or shortening day).

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The `Date` representing Sun's transit. If the calculation can't be computed such as in the
        Arctic Circle where there is at least one day a year where the sun does not rise, and one where it does
        not set, null will be returned. See detailed explanation on top of the page.  

| Param | Type | Description |
| --- | --- | --- |
| startOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | the start of day for calculating the sun's transit. This can be sea level sunrise, visual sunrise (or            any arbitrary start of day) passed to this method. |
| endOfDay | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | the end of day for calculating the sun's transit. This can be sea level sunset, visual sunset (or any            arbitrary end of day) passed to this method. |

<a name="NOAACalculator+getDateFromTime"></a>

### noaaCalculator.getDateFromTime(time, isSunrise) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A method that returns a `Date` from the time passed in as a parameter.

**Kind**: instance method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - The Date.  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>number</code> | The time to be set as the time for the `Date`. The time expected is in the format: 18.75            for 6:45:00 PM. |
| isSunrise | <code>boolean</code> | true if the time is sunrise, and false if it is sunset |

<a name="NOAACalculator.CIVIL_ZENITH"></a>

### NOAACalculator.CIVIL\_ZENITH
Sun's zenith at civil twilight (96&deg;).

**Kind**: static property of [<code>NOAACalculator</code>](#NOAACalculator)  
<a name="NOAACalculator.NAUTICAL_ZENITH"></a>

### NOAACalculator.NAUTICAL\_ZENITH
Sun's zenith at nautical twilight (102&deg;).

**Kind**: static property of [<code>NOAACalculator</code>](#NOAACalculator)  
<a name="NOAACalculator.ASTRONOMICAL_ZENITH"></a>

### NOAACalculator.ASTRONOMICAL\_ZENITH
Sun's zenith at astronomical twilight (108&deg;).

**Kind**: static property of [<code>NOAACalculator</code>](#NOAACalculator)  
<a name="NOAACalculator.getTimeOffset"></a>

### NOAACalculator.getTimeOffset(time, offset) ⇒ <code>Temporal.ZonedDateTime</code> \| <code>null</code>
A utility method that returns a date offset by the offset time passed in. Please note that the level of light
during twilight is not affected by elevation, so if this is being used to calculate an offset before sunrise or
after sunset with the intent of getting a rough "level of light" calculation, the sunrise or sunset time passed
to this method should be sea level sunrise and sunset.

**Kind**: static method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>Temporal.ZonedDateTime</code> \| <code>null</code> - the `Date` with the offset in milliseconds added to it  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Temporal.ZonedDateTime</code> \| <code>null</code> | the start time |
| offset | <code>number</code> | the offset in milliseconds to add to the time. |

<a name="NOAACalculator.getSolarElevation"></a>

### NOAACalculator.getSolarElevation(date, lat, lon) ⇒ <code>number</code>
Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Elevation</a> for the
horizontal coordinate system at the given location at the given time. Can be negative if the sun is below the
horizon. Not corrected for altitude.

**Kind**: static method of [<code>NOAACalculator</code>](#NOAACalculator)  
**Returns**: <code>number</code> - solar elevation in degrees - horizon is 0 degrees, civil twilight is -6 degrees  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Temporal.ZonedDateTime</code> | time of calculation |
| lat | <code>number</code> | latitude of location for calculation |
| lon | <code>number</code> | longitude of location for calculation |

<a name="NOAACalculator.getSolarAzimuth"></a>

### NOAACalculator.getSolarAzimuth(date, latitude, lon) ⇒ <code>number</code>
Return the <a href="http://en.wikipedia.org/wiki/Celestial_coordinate_system">Solar Azimuth</a> for the
horizontal coordinate system at the given location at the given time. Not corrected for altitude. True south is 0
degrees.

**Kind**: static method of [<code>NOAACalculator</code>](#NOAACalculator)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Temporal.ZonedDateTime</code> | time of calculation |
| latitude | <code>number</code> | latitude of location for calculation |
| lon | <code>number</code> | longitude of location for calculation |

<a name="Location"></a>

## Location
Class representing Location

**Kind**: global class  

* [Location](#Location)
    * [new Location(latitude, longitude, il, tzid, [cityName], [countryCode], [geoid], [elevation])](#new_Location_new)
    * _instance_
        * [.getIsrael()](#Location+getIsrael) ⇒ <code>boolean</code>
        * [.getName()](#Location+getName) ⇒ <code>string</code> \| <code>null</code>
        * [.getShortName()](#Location+getShortName) ⇒ <code>string</code> \| <code>null</code>
        * [.getCountryCode()](#Location+getCountryCode) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getTzid()](#Location+getTzid) ⇒ <code>string</code>
        * [.getTimeFormatter()](#Location+getTimeFormatter) ⇒ <code>Intl.DateTimeFormat</code>
        * [.getGeoId()](#Location+getGeoId) ⇒ <code>string</code> \| <code>number</code> \| <code>undefined</code>
        * [.toString()](#Location+toString) ⇒ <code>string</code>
    * _static_
        * [.lookup(name)](#Location.lookup) ⇒ [<code>Location</code>](#Location) \| <code>undefined</code>
        * [.legacyTzToTzid(tz, dst)](#Location.legacyTzToTzid) ⇒ <code>string</code> \| <code>undefined</code>
        * [.getUsaTzid(state, tz, dst)](#Location.getUsaTzid) ⇒ <code>string</code>
        * [.addLocation(cityName, location)](#Location.addLocation) ⇒ <code>boolean</code>

<a name="new_Location_new"></a>

### new Location(latitude, longitude, il, tzid, [cityName], [countryCode], [geoid], [elevation])
Initialize a Location instance


| Param | Type | Description |
| --- | --- | --- |
| latitude | <code>number</code> | Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003) |
| longitude | <code>number</code> | Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005) |
| il | <code>boolean</code> | in Israel (true) or Diaspora (false) |
| tzid | <code>string</code> | Olson timezone ID, e.g. "America/Chicago" |
| [cityName] | <code>string</code> | optional descriptive city name |
| [countryCode] | <code>string</code> | ISO 3166 alpha-2 country code (e.g. "FR") |
| [geoid] | <code>string</code> \| <code>number</code> | optional string or numeric geographic ID |
| [elevation] | <code>number</code> | in meters (default `0`) |

<a name="Location+getIsrael"></a>

### location.getIsrael() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getName"></a>

### location.getName() ⇒ <code>string</code> \| <code>null</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getShortName"></a>

### location.getShortName() ⇒ <code>string</code> \| <code>null</code>
Returns the location name, up to the first comma

**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getCountryCode"></a>

### location.getCountryCode() ⇒ <code>string</code> \| <code>undefined</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getTzid"></a>

### location.getTzid() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getTimeFormatter"></a>

### location.getTimeFormatter() ⇒ <code>Intl.DateTimeFormat</code>
Gets a 24-hour time formatter (e.g. 07:41 or 20:03) for this location

**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+getGeoId"></a>

### location.getGeoId() ⇒ <code>string</code> \| <code>number</code> \| <code>undefined</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location+toString"></a>

### location.toString() ⇒ <code>string</code>
**Kind**: instance method of [<code>Location</code>](#Location)  
<a name="Location.lookup"></a>

### Location.lookup(name) ⇒ [<code>Location</code>](#Location) \| <code>undefined</code>
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

### Location.legacyTzToTzid(tz, dst) ⇒ <code>string</code> \| <code>undefined</code>
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
<a name="Location.addLocation"></a>

### Location.addLocation(cityName, location) ⇒ <code>boolean</code>
Adds a location name for `Location.lookup()` only if the name isn't
already being used. Returns `false` if the name is already taken
and `true` if successfully added.

**Kind**: static method of [<code>Location</code>](#Location)  

| Param | Type |
| --- | --- |
| cityName | <code>string</code> | 
| location | [<code>Location</code>](#Location) | 

<a name="Zmanim"></a>

## Zmanim
Calculate halachic times (zmanim / זְמַנִּים) for a given day and location.
Calculations are available for tzeit / tzais (nightfall),
shkiah (sunset) and more.

Zmanim are estimated using an algorithm published by the US National Oceanic
and Atmospheric Administration. The NOAA solar calculator is based on equations
from _Astronomical Algorithms_ by Jean Meeus.

The sunrise and sunset results are theoretically accurate to within a minute for
locations between +/- 72° latitude, and within 10 minutes outside of those latitudes.
However, due to variations in atmospheric composition, temperature, pressure and
conditions, observed values may vary from calculations.
https://gml.noaa.gov/grad/solcalc/calcdetails.html

**Kind**: global class  

* [Zmanim](#Zmanim)
    * [new Zmanim(gloc, date, useElevation)](#new_Zmanim_new)
    * _instance_
        * [.getUseElevation()](#Zmanim+getUseElevation) ⇒ <code>boolean</code>
        * [.setUseElevation(useElevation)](#Zmanim+setUseElevation)
        * [.timeAtAngle(angle, rising)](#Zmanim+timeAtAngle) ⇒ <code>Date</code>
        * [.sunrise()](#Zmanim+sunrise) ⇒ <code>Date</code>
        * [.seaLevelSunrise()](#Zmanim+seaLevelSunrise) ⇒ <code>Date</code>
        * [.sunset()](#Zmanim+sunset) ⇒ <code>Date</code>
        * [.seaLevelSunset()](#Zmanim+seaLevelSunset) ⇒ <code>Date</code>
        * [.dawn()](#Zmanim+dawn) ⇒ <code>Date</code>
        * [.dusk()](#Zmanim+dusk) ⇒ <code>Date</code>
        * [.gregEve()](#Zmanim+gregEve) ⇒ <code>Date</code>
        * [.chatzot()](#Zmanim+chatzot) ⇒ <code>Date</code>
        * [.chatzotNight()](#Zmanim+chatzotNight) ⇒ <code>Date</code>
        * [.alotHaShachar()](#Zmanim+alotHaShachar) ⇒ <code>Date</code>
        * [.misheyakir()](#Zmanim+misheyakir) ⇒ <code>Date</code>
        * [.misheyakirMachmir()](#Zmanim+misheyakirMachmir) ⇒ <code>Date</code>
        * [.sofZmanShma()](#Zmanim+sofZmanShma) ⇒ <code>Date</code>
        * [.sofZmanTfilla()](#Zmanim+sofZmanTfilla) ⇒ <code>Date</code>
        * [.sofZmanShmaMGA()](#Zmanim+sofZmanShmaMGA) ⇒ <code>Date</code>
        * [.sofZmanShmaMGA16Point1()](#Zmanim+sofZmanShmaMGA16Point1) ⇒ <code>Date</code>
        * [.sofZmanShmaMGA19Point8()](#Zmanim+sofZmanShmaMGA19Point8) ⇒ <code>Date</code>
        * [.sofZmanTfillaMGA()](#Zmanim+sofZmanTfillaMGA) ⇒ <code>Date</code>
        * [.sofZmanTfillaMGA16Point1()](#Zmanim+sofZmanTfillaMGA16Point1) ⇒ <code>Date</code>
        * [.sofZmanTfillaMGA19Point8()](#Zmanim+sofZmanTfillaMGA19Point8) ⇒ <code>Date</code>
        * [.minchaGedola()](#Zmanim+minchaGedola) ⇒ <code>Date</code>
        * [.minchaGedolaMGA()](#Zmanim+minchaGedolaMGA) ⇒ <code>Date</code>
        * [.minchaKetana()](#Zmanim+minchaKetana) ⇒ <code>Date</code>
        * [.minchaKetanaMGA()](#Zmanim+minchaKetanaMGA) ⇒ <code>Date</code>
        * [.plagHaMincha()](#Zmanim+plagHaMincha) ⇒ <code>Date</code>
        * [.tzeit([angle])](#Zmanim+tzeit) ⇒ <code>Date</code>
        * [.neitzHaChama()](#Zmanim+neitzHaChama) ⇒ <code>Date</code>
        * [.shkiah()](#Zmanim+shkiah) ⇒ <code>Date</code>
        * [.beinHaShmashos()](#Zmanim+beinHaShmashos) ⇒ <code>Date</code>
        * [.sunriseOffset(offset, roundMinute, forceSeaLevel)](#Zmanim+sunriseOffset) ⇒ <code>Date</code>
        * [.sunsetOffset(offset, roundMinute, forceSeaLevel)](#Zmanim+sunsetOffset) ⇒ <code>Date</code>
    * _static_
        * [.formatTime(dt, timeFormat)](#Zmanim.formatTime) ⇒ <code>string</code>
        * [.roundTime(dt)](#Zmanim.roundTime) ⇒ <code>Date</code>
        * [.timeZoneOffset(tzid, date)](#Zmanim.timeZoneOffset) ⇒ <code>string</code>
        * [.formatISOWithTimeZone(tzid, date)](#Zmanim.formatISOWithTimeZone) ⇒ <code>string</code>

<a name="new_Zmanim_new"></a>

### new Zmanim(gloc, date, useElevation)
Initialize a Zmanim instance.


| Param | Type | Description |
| --- | --- | --- |
| gloc | [<code>GeoLocation</code>](#GeoLocation) | GeoLocation including latitude, longitude, and timezone |
| date | <code>Date</code> \| [<code>HDate</code>](#HDate) | Regular or Hebrew Date. If `date` is a regular `Date`,    hours, minutes, seconds and milliseconds are ignored. |
| useElevation | <code>boolean</code> | use elevation for calculations (default `false`).    If `true`, use elevation to affect the calculation of all sunrise/sunset based    zmanim. Note: there are some zmanim such as degree-based zmanim that are driven    by the amount of light in the sky and are not impacted by elevation.    These zmanim intentionally do not support elevation adjustment. |

**Example**  
```js
const {GeoLocation, Zmanim} = require('@hebcal/core');
const latitude = 41.822232;
const longitude = -71.448292;
const tzid = 'America/New_York';
const friday = new Date(2023, 8, 8);
const gloc = new GeoLocation(null, latitude, longitude, 0, tzid);
const zmanim = new Zmanim(gloc, friday, false);
const candleLighting = zmanim.sunsetOffset(-18, true);
const timeStr = Zmanim.formatISOWithTimeZone(tzid, candleLighting);
```
<a name="Zmanim+getUseElevation"></a>

### zmanim.getUseElevation() ⇒ <code>boolean</code>
Returns `true` if elevation adjustment is enabled
for zmanim support elevation adjustment

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+setUseElevation"></a>

### zmanim.setUseElevation(useElevation)
Enables or disables elevation adjustment for zmanim support elevation adjustment

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| useElevation | <code>boolean</code> | 

<a name="Zmanim+timeAtAngle"></a>

### zmanim.timeAtAngle(angle, rising) ⇒ <code>Date</code>
Convenience function to get the time when sun is above or below the horizon
for a certain angle (in degrees).
This function does not support elevation adjustment.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| angle | <code>number</code> | 
| rising | <code>boolean</code> | 

<a name="Zmanim+sunrise"></a>

### zmanim.sunrise() ⇒ <code>Date</code>
Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon)
If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+seaLevelSunrise"></a>

### zmanim.seaLevelSunrise() ⇒ <code>Date</code>
Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon).
This function does not support elevation adjustment.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sunset"></a>

### zmanim.sunset() ⇒ <code>Date</code>
When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+seaLevelSunset"></a>

### zmanim.seaLevelSunset() ⇒ <code>Date</code>
When the upper edge of the Sun disappears below the horizon (0.833° below horizon).
This function does not support elevation adjustment.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+dawn"></a>

### zmanim.dawn() ⇒ <code>Date</code>
Civil dawn; Sun is 6° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+dusk"></a>

### zmanim.dusk() ⇒ <code>Date</code>
Civil dusk; Sun is 6° below the horizon in the evening.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+gregEve"></a>

### zmanim.gregEve() ⇒ <code>Date</code>
Returns sunset for the previous day.
If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+chatzot"></a>

### zmanim.chatzot() ⇒ <code>Date</code>
Midday – Chatzot; Sunrise plus 6 halachic hours

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+chatzotNight"></a>

### zmanim.chatzotNight() ⇒ <code>Date</code>
Midnight – Chatzot; Sunset plus 6 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+alotHaShachar"></a>

### zmanim.alotHaShachar() ⇒ <code>Date</code>
Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+misheyakir"></a>

### zmanim.misheyakir() ⇒ <code>Date</code>
Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+misheyakirMachmir"></a>

### zmanim.misheyakirMachmir() ⇒ <code>Date</code>
Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanShma"></a>

### zmanim.sofZmanShma() ⇒ <code>Date</code>
Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra.
If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanTfilla"></a>

### zmanim.sofZmanTfilla() ⇒ <code>Date</code>
Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra.

This method returns the latest *zman tfila* (time to recite shema in the morning)
that is 4 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
(depending on the `useElevation` setting), according
to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).

If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanShmaMGA"></a>

### zmanim.sofZmanShmaMGA() ⇒ <code>Date</code>
Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn being fixed 72 minutes before sea-level sunrise, and nightfall is fixed
72 minutes after sea-level sunset.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanShmaMGA16Point1"></a>

### zmanim.sofZmanShmaMGA16Point1() ⇒ <code>Date</code>
Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 16.1° below the horizon.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanShmaMGA19Point8"></a>

### zmanim.sofZmanShmaMGA19Point8() ⇒ <code>Date</code>
Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 19.8° below the horizon.

This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
around the equinox / equilux which calculates to 19.8° below geometric zenith.
https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanTfillaMGA"></a>

### zmanim.sofZmanTfillaMGA() ⇒ <code>Date</code>
Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanTfillaMGA16Point1"></a>

### zmanim.sofZmanTfillaMGA16Point1() ⇒ <code>Date</code>
Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 16.1° below the horizon.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sofZmanTfillaMGA19Point8"></a>

### zmanim.sofZmanTfillaMGA19Point8() ⇒ <code>Date</code>
Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham.
Based on the opinion of the MGA that the day is calculated from
dawn to nightfall with both being 19.8° below the horizon.

This calculation is based on the position of the sun 90 minutes after sunset in Jerusalem
around the equinox / equilux which calculates to 19.8° below geometric zenith.
https://kosherjava.com/2022/01/12/equinox-vs-equilux-zmanim-calculations/

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+minchaGedola"></a>

### zmanim.minchaGedola() ⇒ <code>Date</code>
Earliest Mincha – Mincha Gedola (GRA); Sunrise plus 6.5 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

This method returns the latest mincha gedola, the earliest time one can pray mincha
that is 6.5 shaos zmaniyos (solar hours) after sunrise or sea level sunrise
(depending on the `useElevation` setting), according
to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).

The Ramba"m is of the opinion that it is better to delay *mincha* until
*mincha ketana* while the Ra"sh, Tur, GRA and others are of the
opinion that *mincha* can be prayed *lechatchila* starting at *mincha gedola*.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+minchaGedolaMGA"></a>

### zmanim.minchaGedolaMGA() ⇒ <code>Date</code>
Earliest Mincha – Mincha Gedola (MGA); Sunrise plus 6.5 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

This method returns the time of *mincha gedola* according to the Magen Avraham
with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
This is the earliest time to pray *mincha*.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+minchaKetana"></a>

### zmanim.minchaKetana() ⇒ <code>Date</code>
Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

This method returns *mincha ketana*, the preferred earliest time to pray *mincha* in the
opinion of the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others,
that is 9.5 *shaos zmaniyos* (solar hours) after sunrise or sea level sunrise
(depending on the `useElevation` setting), according
to the [GRA](https://en.wikipedia.org/wiki/Vilna_Gaon).

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+minchaKetanaMGA"></a>

### zmanim.minchaKetanaMGA() ⇒ <code>Date</code>
This method returns the time of *mincha ketana* according to the Magen Avraham
with the day starting 72 minutes before sunrise and ending 72 minutes after sunset.
This is the preferred earliest time to pray *mincha* according to the opinion of
the [Rambam](https://en.wikipedia.org/wiki/Maimonides) and others.

If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+plagHaMincha"></a>

### zmanim.plagHaMincha() ⇒ <code>Date</code>
Plag haMincha; Sunrise plus 10.75 halachic hours.
If elevation is enabled, this function will include elevation in the calculation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+tzeit"></a>

### zmanim.tzeit([angle]) ⇒ <code>Date</code>
**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [angle] | <code>number</code> | <code>8.5</code> | optional time for solar depression.   Default is 8.5 degrees for 3 small stars, use 7.083 degrees for 3 medium-sized stars. Because degree-based functions estimate the amount of light in the sky, the result is not impacted by elevation. |

<a name="Zmanim+neitzHaChama"></a>

### zmanim.neitzHaChama() ⇒ <code>Date</code>
Alias for sunrise

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+shkiah"></a>

### zmanim.shkiah() ⇒ <code>Date</code>
Alias for sunset

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+beinHaShmashos"></a>

### zmanim.beinHaShmashos() ⇒ <code>Date</code>
Rabbeinu Tam holds that bein hashmashos is a specific time
between sunset and tzeis hakochavim.
One opinion on how to calculate this time is that
it is 13.5 minutes before tzies 7.083.
Because degree-based functions estimate the amount of light in the sky,
the result is not impacted by elevation.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  
<a name="Zmanim+sunriseOffset"></a>

### zmanim.sunriseOffset(offset, roundMinute, forceSeaLevel) ⇒ <code>Date</code>
Returns sunrise + `offset` minutes (either positive or negative).
If elevation is enabled, this function will include elevation in the calculation
 unless `forceSeaLevel` is `true`.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| offset | <code>number</code> |  | minutes |
| roundMinute | <code>boolean</code> | <code>true</code> | round time to nearest minute (default true) |
| forceSeaLevel | <code>boolean</code> | <code>false</code> | use sea-level sunrise (default false) |

<a name="Zmanim+sunsetOffset"></a>

### zmanim.sunsetOffset(offset, roundMinute, forceSeaLevel) ⇒ <code>Date</code>
Returns sunset + `offset` minutes (either positive or negative).
If elevation is enabled, this function will include elevation in the calculation
 unless `forceSeaLevel` is `true`.

**Kind**: instance method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| offset | <code>number</code> |  | minutes |
| roundMinute | <code>boolean</code> | <code>true</code> | round time to nearest minute (default true) |
| forceSeaLevel | <code>boolean</code> | <code>false</code> | use sea-level sunset (default false) |

<a name="Zmanim.formatTime"></a>

### Zmanim.formatTime(dt, timeFormat) ⇒ <code>string</code>
Uses timeFormat to return a date like '20:34'

**Kind**: static method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| dt | <code>Date</code> | 
| timeFormat | <code>Intl.DateTimeFormat</code> | 

<a name="Zmanim.roundTime"></a>

### Zmanim.roundTime(dt) ⇒ <code>Date</code>
Discards seconds, rounding to nearest minute.

**Kind**: static method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| dt | <code>Date</code> | 

<a name="Zmanim.timeZoneOffset"></a>

### Zmanim.timeZoneOffset(tzid, date) ⇒ <code>string</code>
Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")

**Kind**: static method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| tzid | <code>string</code> | 
| date | <code>Date</code> | 

<a name="Zmanim.formatISOWithTimeZone"></a>

### Zmanim.formatISOWithTimeZone(tzid, date) ⇒ <code>string</code>
Returns a string like "2022-04-01T13:06:00-11:00"

**Kind**: static method of [<code>Zmanim</code>](#Zmanim)  

| Param | Type |
| --- | --- |
| tzid | <code>string</code> | 
| date | <code>Date</code> | 

<a name="TimedEvent"></a>

## TimedEvent
An event that has an `eventTime` and `eventTimeStr`

**Kind**: global class  

* [TimedEvent](#TimedEvent)
    * [new TimedEvent(desc)](#new_TimedEvent_new)
    * [.render([locale])](#TimedEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#TimedEvent+renderBrief) ⇒ <code>string</code>
    * [.getCategories()](#TimedEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>

<a name="new_TimedEvent_new"></a>

### new TimedEvent(desc)

| Param | Type | Description |
| --- | --- | --- |
| desc | <code>string</code> | Description (not translated) |

<a name="TimedEvent+render"></a>

### timedEvent.render([locale]) ⇒ <code>string</code>
**Kind**: instance method of [<code>TimedEvent</code>](#TimedEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="TimedEvent+renderBrief"></a>

### timedEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns translation of "Candle lighting" without the time.

**Kind**: instance method of [<code>TimedEvent</code>](#TimedEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="TimedEvent+getCategories"></a>

### timedEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>TimedEvent</code>](#TimedEvent)  
<a name="CandleLightingEvent"></a>

## CandleLightingEvent
Candle lighting before Shabbat or holiday

**Kind**: global class  
<a name="CandleLightingEvent+getEmoji"></a>

### candleLightingEvent.getEmoji() ⇒ <code>string</code>
**Kind**: instance method of [<code>CandleLightingEvent</code>](#CandleLightingEvent)  
<a name="HavdalahEvent"></a>

## HavdalahEvent
Havdalah after Shabbat or holiday

**Kind**: global class  

* [HavdalahEvent](#HavdalahEvent)
    * [.render([locale])](#HavdalahEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#HavdalahEvent+renderBrief) ⇒ <code>string</code>
    * [.getEmoji()](#HavdalahEvent+getEmoji) ⇒ <code>string</code>

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

<a name="HavdalahEvent+getEmoji"></a>

### havdalahEvent.getEmoji() ⇒ <code>string</code>
**Kind**: instance method of [<code>HavdalahEvent</code>](#HavdalahEvent)  
<a name="Molad"></a>

## Molad
Represents a molad, the moment when the new moon is "born"

**Kind**: global class  

* [Molad](#Molad)
    * [new Molad(year, month)](#new_Molad_new)
    * [.getYear()](#Molad+getYear) ⇒ <code>number</code>
    * [.getMonth()](#Molad+getMonth) ⇒ <code>number</code>
    * [.getMonthName()](#Molad+getMonthName) ⇒ <code>string</code>
    * [.getDow()](#Molad+getDow) ⇒ <code>number</code>
    * [.getHour()](#Molad+getHour) ⇒ <code>number</code>
    * [.getMinutes()](#Molad+getMinutes) ⇒ <code>number</code>
    * [.getChalakim()](#Molad+getChalakim) ⇒ <code>number</code>
    * [.render([locale], options)](#Molad+render) ⇒ <code>string</code>

<a name="new_Molad_new"></a>

### new Molad(year, month)
Calculates the molad for a Hebrew month


| Param | Type |
| --- | --- |
| year | <code>number</code> | 
| month | <code>number</code> | 

<a name="Molad+getYear"></a>

### molad.getYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
<a name="Molad+getMonth"></a>

### molad.getMonth() ⇒ <code>number</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
<a name="Molad+getMonthName"></a>

### molad.getMonthName() ⇒ <code>string</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
<a name="Molad+getDow"></a>

### molad.getDow() ⇒ <code>number</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
**Returns**: <code>number</code> - Day of Week (0=Sunday, 6=Saturday)  
<a name="Molad+getHour"></a>

### molad.getHour() ⇒ <code>number</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
**Returns**: <code>number</code> - hour of day (0-23)  
<a name="Molad+getMinutes"></a>

### molad.getMinutes() ⇒ <code>number</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
**Returns**: <code>number</code> - minutes past hour (0-59)  
<a name="Molad+getChalakim"></a>

### molad.getChalakim() ⇒ <code>number</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  
**Returns**: <code>number</code> - parts of a minute (0-17)  
<a name="Molad+render"></a>

### molad.render([locale], options) ⇒ <code>string</code>
**Kind**: instance method of [<code>Molad</code>](#Molad)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale) |
| options | <code>CalOptions</code> |  |

<a name="MoladEvent"></a>

## MoladEvent
Represents a Molad announcement on Shabbat Mevarchim

**Kind**: global class  

* [MoladEvent](#MoladEvent)
    * [new MoladEvent(date, hyear, hmonth, options)](#new_MoladEvent_new)
    * [.render([locale])](#MoladEvent+render) ⇒ <code>string</code>

<a name="new_MoladEvent_new"></a>

### new MoladEvent(date, hyear, hmonth, options)

| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) | Hebrew date event occurs |
| hyear | <code>number</code> | molad year |
| hmonth | <code>number</code> | molad month |
| options | <code>CalOptions</code> |  |

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
    * [.sefira(lang)](#OmerEvent+sefira) ⇒ <code>string</code>
    * [.render([locale])](#OmerEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#OmerEvent+renderBrief) ⇒ <code>string</code>
    * [.getEmoji()](#OmerEvent+getEmoji) ⇒ <code>string</code>
    * [.getWeeks()](#OmerEvent+getWeeks) ⇒ <code>number</code>
    * [.getDaysWithinWeeks()](#OmerEvent+getDaysWithinWeeks) ⇒ <code>number</code>
    * [.getTodayIs(locale)](#OmerEvent+getTodayIs) ⇒ <code>string</code>
    * [.url()](#OmerEvent+url) ⇒ <code>string</code>

<a name="new_OmerEvent_new"></a>

### new OmerEvent(date, omerDay)

| Param | Type |
| --- | --- |
| date | [<code>HDate</code>](#HDate) | 
| omerDay | <code>number</code> | 

<a name="OmerEvent+sefira"></a>

### omerEvent.sefira(lang) ⇒ <code>string</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  

| Param | Type | Default |
| --- | --- | --- |
| lang | <code>string</code> | <code>&quot;en&quot;</code> | 

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
Returns translation of "Omer day 22" without ordinal numbers.

**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="OmerEvent+getEmoji"></a>

### omerEvent.getEmoji() ⇒ <code>string</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  
<a name="OmerEvent+getWeeks"></a>

### omerEvent.getWeeks() ⇒ <code>number</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  
<a name="OmerEvent+getDaysWithinWeeks"></a>

### omerEvent.getDaysWithinWeeks() ⇒ <code>number</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  
<a name="OmerEvent+getTodayIs"></a>

### omerEvent.getTodayIs(locale) ⇒ <code>string</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  

| Param | Type |
| --- | --- |
| locale | <code>string</code> | 

<a name="OmerEvent+url"></a>

### omerEvent.url() ⇒ <code>string</code>
**Kind**: instance method of [<code>OmerEvent</code>](#OmerEvent)  
<a name="Sedra"></a>

## Sedra
Represents Parashah HaShavua for an entire Hebrew year

**Kind**: global class  

* [Sedra](#Sedra)
    * [new Sedra(hyear, il)](#new_Sedra_new)
    * [.get(hd)](#Sedra+get) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getString(hd, [locale])](#Sedra+getString) ⇒ <code>string</code>
    * [.isParsha(hd)](#Sedra+isParsha) ⇒ <code>boolean</code>
    * [.find(parsha)](#Sedra+find) ⇒ [<code>HDate</code>](#HDate) \| <code>null</code>
    * [.getSedraArray()](#Sedra+getSedraArray) ⇒ <code>Array.&lt;NumberOrString&gt;</code>
    * [.getFirstSaturday()](#Sedra+getFirstSaturday) ⇒ <code>number</code>
    * [.getYear()](#Sedra+getYear) ⇒ <code>number</code>
    * [.lookup(hd)](#Sedra+lookup) ⇒ <code>SedraResult</code>

<a name="new_Sedra_new"></a>

### new Sedra(hyear, il)
Caculates the Parashah HaShavua for an entire Hebrew year


| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year (e.g. 5749) |
| il | <code>boolean</code> | Use Israel sedra schedule (false for Diaspora) |

<a name="Sedra+get"></a>

### sedra.get(hd) ⇒ <code>Array.&lt;string&gt;</code>
Returns the parsha (or parshiyot) read on Hebrew date

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hd | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or R.D. days |

<a name="Sedra+getString"></a>

### sedra.getString(hd, [locale]) ⇒ <code>string</code>
Looks up parsha for the date, then returns a translated or transliterated string

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hd | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or R.D. days |
| [locale] | <code>string</code> | Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale |

<a name="Sedra+isParsha"></a>

### sedra.isParsha(hd) ⇒ <code>boolean</code>
Checks to see if this day would be a regular parasha HaShavua
Torah reading or special holiday reading

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hd | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or R.D. days |

<a name="Sedra+find"></a>

### sedra.find(parsha) ⇒ [<code>HDate</code>](#HDate) \| <code>null</code>
Returns the date that a parsha occurs
or `null` if the parsha doesn't occur this year

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type |
| --- | --- |
| parsha | <code>number</code> \| <code>string</code> \| <code>Array.&lt;string&gt;</code> | 

<a name="Sedra+getSedraArray"></a>

### sedra.getSedraArray() ⇒ <code>Array.&lt;NumberOrString&gt;</code>
Returns the underlying annual sedra schedule.
Used by `@hebcal/triennial`

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  
<a name="Sedra+getFirstSaturday"></a>

### sedra.getFirstSaturday() ⇒ <code>number</code>
R.D. date of the first Saturday on or after Rosh Hashana

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  
<a name="Sedra+getYear"></a>

### sedra.getYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Sedra</code>](#Sedra)  
<a name="Sedra+lookup"></a>

### sedra.lookup(hd) ⇒ <code>SedraResult</code>
Returns an object describing the parsha on the first Saturday on or after `hd`

**Kind**: instance method of [<code>Sedra</code>](#Sedra)  

| Param | Type | Description |
| --- | --- | --- |
| hd | [<code>HDate</code>](#HDate) \| <code>number</code> | Hebrew date or R.D. days |

<a name="ParshaEvent"></a>

## ParshaEvent
Represents one of 54 weekly Torah portions, always on a Saturday

**Kind**: global class  

* [ParshaEvent](#ParshaEvent)
    * [new ParshaEvent(date, parsha, [il], [num])](#new_ParshaEvent_new)
    * [.render([locale])](#ParshaEvent+render) ⇒ <code>string</code>
    * [.basename()](#ParshaEvent+basename) ⇒ <code>string</code>
    * [.url()](#ParshaEvent+url) ⇒ <code>string</code> \| <code>undefined</code>
    * [.urlDateSuffix()](#ParshaEvent+urlDateSuffix) ⇒ <code>string</code>

<a name="new_ParshaEvent_new"></a>

### new ParshaEvent(date, parsha, [il], [num])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| date | [<code>HDate</code>](#HDate) |  |  |
| parsha | <code>Array.&lt;string&gt;</code> |  | untranslated name of single or double parsha,   such as ['Bereshit'] or ['Achrei Mot', 'Kedoshim'] |
| [il] | <code>boolean</code> | <code>false</code> |  |
| [num] | <code>number</code> \| <code>Array.&lt;number&gt;</code> |  |  |

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

### parshaEvent.url() ⇒ <code>string</code> \| <code>undefined</code>
**Kind**: instance method of [<code>ParshaEvent</code>](#ParshaEvent)  
<a name="ParshaEvent+urlDateSuffix"></a>

### parshaEvent.urlDateSuffix() ⇒ <code>string</code>
**Kind**: instance method of [<code>ParshaEvent</code>](#ParshaEvent)  
<a name="HolidayEvent"></a>

## HolidayEvent
Represents a built-in holiday like Pesach, Purim or Tu BiShvat

**Kind**: global class  

* [HolidayEvent](#HolidayEvent)
    * [.basename()](#HolidayEvent+basename) ⇒ <code>string</code>
    * [.url()](#HolidayEvent+url) ⇒ <code>string</code> \| <code>undefined</code>
    * [.urlDateSuffix()](#HolidayEvent+urlDateSuffix) ⇒ <code>string</code>
    * [.getEmoji()](#HolidayEvent+getEmoji) ⇒ <code>string</code>
    * [.getCategories()](#HolidayEvent+getCategories) ⇒ <code>Array.&lt;string&gt;</code>
    * [.render([locale])](#HolidayEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#HolidayEvent+renderBrief) ⇒ <code>string</code>
    * [.clone()](#HolidayEvent+clone) ⇒ [<code>Event</code>](#Event)

<a name="HolidayEvent+basename"></a>

### holidayEvent.basename() ⇒ <code>string</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="HolidayEvent+url"></a>

### holidayEvent.url() ⇒ <code>string</code> \| <code>undefined</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="HolidayEvent+urlDateSuffix"></a>

### holidayEvent.urlDateSuffix() ⇒ <code>string</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="HolidayEvent+getEmoji"></a>

### holidayEvent.getEmoji() ⇒ <code>string</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="HolidayEvent+getCategories"></a>

### holidayEvent.getCategories() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="HolidayEvent+render"></a>

### holidayEvent.render([locale]) ⇒ <code>string</code>
Returns (translated) description of this event

**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="HolidayEvent+renderBrief"></a>

### holidayEvent.renderBrief([locale]) ⇒ <code>string</code>
Returns a brief (translated) description of this event.
For most events, this is the same as render(). For some events, it procudes
a shorter text (e.g. without a time or added description).

**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  

| Param | Type | Description |
| --- | --- | --- |
| [locale] | <code>string</code> | Optional locale name (defaults to active locale). |

<a name="HolidayEvent+clone"></a>

### holidayEvent.clone() ⇒ [<code>Event</code>](#Event)
Makes a clone of this Event object

**Kind**: instance method of [<code>HolidayEvent</code>](#HolidayEvent)  
<a name="AsaraBTevetEvent"></a>

## AsaraBTevetEvent
Because Asara B'Tevet often occurs twice in the same Gregorian year,
we subclass HolidayEvent to override the `url()` method.

**Kind**: global class  
<a name="AsaraBTevetEvent+urlDateSuffix"></a>

### asaraBTevetEvent.urlDateSuffix() ⇒ <code>string</code>
**Kind**: instance method of [<code>AsaraBTevetEvent</code>](#AsaraBTevetEvent)  
<a name="RoshChodeshEvent"></a>

## RoshChodeshEvent
Represents Rosh Chodesh, the beginning of a new month

**Kind**: global class  

* [RoshChodeshEvent](#RoshChodeshEvent)
    * [new RoshChodeshEvent(date, monthName)](#new_RoshChodeshEvent_new)
    * [.render([locale])](#RoshChodeshEvent+render) ⇒ <code>string</code>
    * [.basename()](#RoshChodeshEvent+basename) ⇒ <code>string</code>
    * [.getEmoji()](#RoshChodeshEvent+getEmoji) ⇒ <code>string</code>

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
<a name="RoshChodeshEvent+getEmoji"></a>

### roshChodeshEvent.getEmoji() ⇒ <code>string</code>
**Kind**: instance method of [<code>RoshChodeshEvent</code>](#RoshChodeshEvent)  
<a name="MevarchimChodeshEvent"></a>

## MevarchimChodeshEvent
Represents Mevarchim haChodesh, the announcement of the new month

**Kind**: global class  

* [MevarchimChodeshEvent](#MevarchimChodeshEvent)
    * [new MevarchimChodeshEvent(date, monthName, [memo])](#new_MevarchimChodeshEvent_new)
    * [.basename()](#MevarchimChodeshEvent+basename) ⇒ <code>string</code>
    * [.render([locale])](#MevarchimChodeshEvent+render) ⇒ <code>string</code>
    * [.renderBrief([locale])](#MevarchimChodeshEvent+renderBrief) ⇒ <code>string</code>

<a name="new_MevarchimChodeshEvent_new"></a>

### new MevarchimChodeshEvent(date, monthName, [memo])
Constructs Mevarchim haChodesh event


| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) | Hebrew date event occurs |
| monthName | <code>string</code> | Hebrew month name (not translated) |
| [memo] | <code>string</code> |  |

<a name="MevarchimChodeshEvent+basename"></a>

### mevarchimChodeshEvent.basename() ⇒ <code>string</code>
**Kind**: instance method of [<code>MevarchimChodeshEvent</code>](#MevarchimChodeshEvent)  
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

<a name="DailyLearning"></a>

## DailyLearning
Plug-ins for daily learning calendars such as Daf Yomi, Mishna Yomi, Nach Yomi, etc.

Learning schedules are provided by the `@hebcal/learning` package.

**Kind**: global class  

* [DailyLearning](#DailyLearning)
    * [.addCalendar(name, calendar)](#DailyLearning.addCalendar)
    * [.lookup(name, hd, il)](#DailyLearning.lookup) ⇒ [<code>Event</code>](#Event) \| <code>null</code>

<a name="DailyLearning.addCalendar"></a>

### DailyLearning.addCalendar(name, calendar)
Register a new learning calendar.

**Kind**: static method of [<code>DailyLearning</code>](#DailyLearning)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| calendar | <code>function</code> | 

<a name="DailyLearning.lookup"></a>

### DailyLearning.lookup(name, hd, il) ⇒ [<code>Event</code>](#Event) \| <code>null</code>
Returns an event from daily calendar for a given date. Returns `null` if there
is no learning from this calendar on this date.

**Kind**: static method of [<code>DailyLearning</code>](#DailyLearning)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| hd | [<code>HDate</code>](#HDate) | 
| il | <code>boolean</code> | 

<a name="HebrewCalendar"></a>

## HebrewCalendar
HebrewCalendar is the main interface to the `@hebcal/core` library.
This namespace is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
Event names can be rendered in several languges using the `locale` option.

**Kind**: global class  

* [HebrewCalendar](#HebrewCalendar)
    * [.calendar([options])](#HebrewCalendar.calendar) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
    * [.getBirthdayOrAnniversary(hyear, gdate)](#HebrewCalendar.getBirthdayOrAnniversary) ⇒ [<code>HDate</code>](#HDate) \| <code>undefined</code>
    * [.getYahrzeit(hyear, gdate)](#HebrewCalendar.getYahrzeit) ⇒ [<code>HDate</code>](#HDate) \| <code>undefined</code>
    * [.getHolidaysForYear(year)](#HebrewCalendar.getHolidaysForYear) ⇒ <code>HolidayYearMap</code>
    * [.getHolidaysForYearArray(year, il)](#HebrewCalendar.getHolidaysForYearArray) ⇒ [<code>Array.&lt;HolidayEvent&gt;</code>](#HolidayEvent)
    * [.getHolidaysOnDate(date, [il])](#HebrewCalendar.getHolidaysOnDate) ⇒ [<code>Array.&lt;HolidayEvent&gt;</code>](#HolidayEvent) \| <code>undefined</code>
    * [.eruvTavshilin(date, il)](#HebrewCalendar.eruvTavshilin) ⇒ <code>boolean</code>
    * [.reformatTimeStr(timeStr, suffix, options)](#HebrewCalendar.reformatTimeStr) ⇒ <code>string</code>
    * [.version()](#HebrewCalendar.version) ⇒ <code>string</code>
    * [.getSedra(hyear, il)](#HebrewCalendar.getSedra) ⇒ [<code>Sedra</code>](#Sedra)
    * [.hallel(hdate, il)](#HebrewCalendar.hallel) ⇒ <code>number</code>
    * [.tachanun(hdate, il)](#HebrewCalendar.tachanun) ⇒ <code>TachanunResult</code>

<a name="HebrewCalendar.calendar"></a>

### HebrewCalendar.calendar([options]) ⇒ [<code>Array.&lt;Event&gt;</code>](#Event)
Calculates holidays and other Hebrew calendar events based on [CalOptions](CalOptions).

Each holiday is represented by an [Event](#Event) object which includes a date,
a description, flags and optional attributes.
If given no options, returns holidays for the Diaspora for the current Gregorian year.

The date range returned by this function can be controlled by:
* `options.year` - Gregorian (e.g. 1993) or Hebrew year (e.g. 5749)
* `options.isHebrewYear` - to interpret `year` as Hebrew year
* `options.numYears` - generate calendar for multiple years (default 1)
* `options.month` - Gregorian or Hebrew month (to filter results to a single month)

Alternatively, specify start and end days with `Date` or [HDate](#HDate) instances:
* `options.start` - use specific start date (requires `end` date)
* `options.end` - use specific end date (requires `start` date)

Unless `options.noHolidays == true`, default holidays include:
* Major holidays - Rosh Hashana, Yom Kippur, Pesach, Sukkot, etc.
* Minor holidays - Purim, Chanukah, Tu BiShvat, Lag BaOmer, etc.
* Minor fasts - Ta'anit Esther, Tzom Gedaliah, etc. (unless `options.noMinorFast`)
* Special Shabbatot - Shabbat Shekalim, Zachor, etc. (unless `options.noSpecialShabbat`)
* Modern Holidays - Yom HaShoah, Yom HaAtzma'ut, etc. (unless `options.noModern`)
* Rosh Chodesh (unless `options.noRoshChodesh`)

Holiday and Torah reading schedules differ between Israel and the Disapora.
Set `options.il=true` to use the Israeli schedule.

Additional non-default event types can be specified:
* Parashat HaShavua - weekly Torah Reading on Saturdays (`options.sedrot`)
* Counting of the Omer (`options.omer`)
* Shabbat Mevarchim HaChodesh on Saturday before Rosh Chodesh (`options.shabbatMevarchim`)
* Molad announcement on Saturday before Rosh Chodesh (`options.molad`)
* Yom Kippur Katan (`options.yomKippurKatan`)

Daily Study of texts are supported by the
[@hebcal/learning](https://github.com/hebcal/hebcal-learning) package,
for example:
* Babylonian Talmud Daf Yomi (`options.dailyLearning.dafYomi`)
* Jerusalem Talmud (Yerushalmi) Yomi (`options.dailyLearning.yerushalmi`)
* Mishna Yomi (`options.dailyLearning.mishnaYomi`)
* Nach Yomi (`options.dailyLearning.nachYomi`)

Candle-lighting and Havdalah times are approximated using latitude and longitude
specified by the [Location](#Location) class. The `Location` class contains a small
database of cities with their associated geographic information and time-zone information.
If you ever have any doubts about Hebcal's times, consult your local halachic authority.
If you enter geographic coordinates above the arctic circle or antarctic circle,
the times are guaranteed to be wrong.

To add candle-lighting options, set `options.candlelighting=true` and set
`options.location` to an instance of `Location`. By default, candle lighting
time is 18 minutes before sundown (40 minutes for Jerusalem,
30 minutes for Haifa and Zikhron Ya'akov) and Havdalah is
calculated according to Tzeit Hakochavim - Nightfall (the point when 3 small stars
are observable in the night time sky with the naked eye). The default Havdalah
option (Tzeit Hakochavim) is calculated when the sun is 8.5° below the horizon.
These defaults can be changed using these options:
* `options.candleLightingMins` - minutes before sundown to light candles
* `options.havdalahMins` - minutes after sundown for Havdalah (typical values are 42, 50, or 72).
   Havdalah times are suppressed when `options.havdalahMins=0`.
* `options.havdalahDeg` - degrees for solar depression for Havdalah.
   Default is 8.5 degrees for 3 small stars. Use 7.083 degrees for 3 medium-sized stars.
   Havdalah times are suppressed when `options.havdalahDeg=0`.

If both `options.candlelighting=true` and `options.location` is specified,
Chanukah candle-lighting times and minor fast start/end times will also be generated.
Chanukah candle-lighting is at Bein HaShmashos (13.5 minutes before
the sun is 7.083° below the horizon in the evening)
on weekdays, at regular candle-lighting time on Fridays, and at regular Havdalah time on
Saturday night (see above).

Minor fasts begin at Alot HaShachar (sun is 16.1° below the horizon in the morning) and
end when 3 medium-sized stars are observable in the night sky (sun is 7.083° below the horizon
in the evening).

Two options also exist for generating an Event with the Hebrew date:
* `options.addHebrewDates` - print the Hebrew date for the entire date range
* `options.addHebrewDatesForEvents` - print the Hebrew date for dates with some events

Lastly, translation and transliteration of event titles is controlled by
`options.locale` and the [Locale](#Locale) API.
`@hebcal/core` supports three locales by default:
* `en` - default, Sephardic transliterations (e.g. "Shabbat")
* `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
* `he` - Hebrew (e.g. "שַׁבָּת")

Additional locales (such as `ru` or `fr`) are supported by the
[@hebcal/locales](https://github.com/hebcal/hebcal-locales) package

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>CalOptions</code> | <code>{}</code> | 

**Example**  
```js
import {HebrewCalendar, HDate, Location, Event} from '@hebcal/core';
const options: CalOptions = {
  year: 1981,
  isHebrewYear: false,
  candlelighting: true,
  location: Location.lookup('San Francisco'),
  sedrot: true,
  omer: true,
};
const events = HebrewCalendar.calendar(options);
for (const ev of events) {
  const hd = ev.getDate();
  const date = hd.greg();
  console.log(date.toLocaleDateString(), ev.render('en'), hd.toString());
}
```
<a name="HebrewCalendar.getBirthdayOrAnniversary"></a>

### HebrewCalendar.getBirthdayOrAnniversary(hyear, gdate) ⇒ [<code>HDate</code>](#HDate) \| <code>undefined</code>
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

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  
**Returns**: [<code>HDate</code>](#HDate) \| <code>undefined</code> - anniversary occurring in `hyear`  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of event |

**Example**  
```js
import {HebrewCalendar} from '@hebcal/core';
const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
const hd = HebrewCalendar.getBirthdayOrAnniversary(5780, dt); // '1 Nisan 5780'
console.log(hd.greg().toLocaleDateString('en-US')); // '3/26/2020'
```
<a name="HebrewCalendar.getYahrzeit"></a>

### HebrewCalendar.getYahrzeit(hyear, gdate) ⇒ [<code>HDate</code>](#HDate) \| <code>undefined</code>
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

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  
**Returns**: [<code>HDate</code>](#HDate) \| <code>undefined</code> - anniversary occurring in hyear  

| Param | Type | Description |
| --- | --- | --- |
| hyear | <code>number</code> | Hebrew year |
| gdate | <code>Date</code> \| [<code>HDate</code>](#HDate) | Gregorian or Hebrew date of death |

**Example**  
```js
import {HebrewCalendar} from '@hebcal/core';
const dt = new Date(2014, 2, 2); // '2014-03-02' == '30 Adar I 5774'
const hd = HebrewCalendar.getYahrzeit(5780, dt); // '30 Sh\'vat 5780'
console.log(hd.greg().toLocaleDateString('en-US')); // '2/25/2020'
```
<a name="HebrewCalendar.getHolidaysForYear"></a>

### HebrewCalendar.getHolidaysForYear(year) ⇒ <code>HolidayYearMap</code>
Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
`HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme.

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="HebrewCalendar.getHolidaysForYearArray"></a>

### HebrewCalendar.getHolidaysForYearArray(year, il) ⇒ [<code>Array.&lt;HolidayEvent&gt;</code>](#HolidayEvent)
Returns an array of holidays for the year

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |
| il | <code>boolean</code> | use the Israeli schedule for holidays |

<a name="HebrewCalendar.getHolidaysOnDate"></a>

### HebrewCalendar.getHolidaysOnDate(date, [il]) ⇒ [<code>Array.&lt;HolidayEvent&gt;</code>](#HolidayEvent) \| <code>undefined</code>
Returns an array of Events on this date (or `undefined` if no events)

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| date | [<code>HDate</code>](#HDate) \| <code>Date</code> \| <code>number</code> | Hebrew Date, Gregorian date, or absolute R.D. day number |
| [il] | <code>boolean</code> | use the Israeli schedule for holidays |

<a name="HebrewCalendar.eruvTavshilin"></a>

### HebrewCalendar.eruvTavshilin(date, il) ⇒ <code>boolean</code>
Eruv Tavshilin

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> \| [<code>HDate</code>](#HDate) | 
| il | <code>boolean</code> | 

<a name="HebrewCalendar.reformatTimeStr"></a>

### HebrewCalendar.reformatTimeStr(timeStr, suffix, options) ⇒ <code>string</code>
Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
keep as "20:13" for any other locale/country. Uses [CalOptions](CalOptions) to determine
locale.
If `options.hour12` is `false`, locale is ignored and always returns 24-hour time.
If `options.hour12` is `true`, locale is ignored and always returns 12-hour time.

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type | Description |
| --- | --- | --- |
| timeStr | <code>string</code> | original time like "20:30" |
| suffix | <code>string</code> | "p" or "pm" or " P.M.". Add leading space if you want it |
| options | <code>CalOptions</code> |  |

<a name="HebrewCalendar.version"></a>

### HebrewCalendar.version() ⇒ <code>string</code>
**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  
<a name="HebrewCalendar.getSedra"></a>

### HebrewCalendar.getSedra(hyear, il) ⇒ [<code>Sedra</code>](#Sedra)
Convenience function to create an instance of `Sedra` or reuse a previously
created and cached instance.

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type |
| --- | --- |
| hyear | <code>number</code> | 
| il | <code>boolean</code> | 

<a name="HebrewCalendar.hallel"></a>

### HebrewCalendar.hallel(hdate, il) ⇒ <code>number</code>
Return a number containing information on what Hallel is said on that day.

Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
Yom Ha'atzmaut, and Yom Yerushalayim.

Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.

The number is one of the following values:

0 - No Hallel
1 - Half Hallel
2 - Whole Hallel

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 
| il | <code>boolean</code> | 

<a name="HebrewCalendar.tachanun"></a>

### HebrewCalendar.tachanun(hdate, il) ⇒ <code>TachanunResult</code>
Return details on what Tachanun (or Tzidchatcha on Shabbat) is said on `hdate`.

Tachanun is not said on Rosh Chodesh, the month of Nisan, Lag Baomer,
Rosh Chodesh Sivan until Isru Chag, Tisha B'av, 15 Av, Erev Rosh Hashanah,
Rosh Hashanah, Erev Yom Kippur until after Simchat Torah, Chanukah,
Tu B'shvat, Purim and Shushan Purim, and Purim and Shushan Purim Katan.

In some congregations Tachanun is not said until from Rosh Chodesh Sivan
until 14th Sivan, Sukkot until after Rosh Chodesh Cheshvan, Pesach Sheini,
Yom Ha'atzmaut, and Yom Yerushalayim.

Tachanun is not said at Mincha on days before it is not said at Shacharit.

Tachanun is not said at Shacharit on Shabbat, but is at Mincha, usually.

**Kind**: static method of [<code>HebrewCalendar</code>](#HebrewCalendar)  

| Param | Type |
| --- | --- |
| hdate | [<code>HDate</code>](#HDate) | 
| il | <code>boolean</code> | 

<a name="greg"></a>

## greg
Gregorian date helper functions.

**Kind**: global variable  
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
| TISHREI | <code>number</code> | <code>7</code> | Tishrei / תִּשְׁרֵי |
| CHESHVAN | <code>number</code> | <code>8</code> | Cheshvan / חשון |
| KISLEV | <code>number</code> | <code>9</code> | Kislev / כסלו |
| TEVET | <code>number</code> | <code>10</code> | Tevet / טבת |
| SHVAT | <code>number</code> | <code>11</code> | Sh'vat / שבט |
| ADAR_I | <code>number</code> | <code>12</code> | Adar or Adar Rishon / אדר |
| ADAR_II | <code>number</code> | <code>13</code> | Adar Sheini (only on leap years) / אדר ב׳ |

<a name="flags"></a>

## flags : <code>enum</code>
Holiday flags for Event

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| CHAG | <code>number</code> | <code>1</code> | Chag, yontiff, yom tov |
| LIGHT_CANDLES | <code>number</code> | <code>2</code> | Light candles 18 minutes before sundown |
| YOM_TOV_ENDS | <code>number</code> | <code>4</code> | End of holiday (end of Yom Tov) |
| CHUL_ONLY | <code>number</code> | <code>8</code> | Observed only in the Diaspora (chutz l'aretz) |
| IL_ONLY | <code>number</code> | <code>16</code> | Observed only in Israel |
| LIGHT_CANDLES_TZEIS | <code>number</code> | <code>32</code> | Light candles in the evening at Tzeit time (3 small stars) |
| CHANUKAH_CANDLES | <code>number</code> | <code>64</code> | Candle-lighting for Chanukah |
| ROSH_CHODESH | <code>number</code> | <code>128</code> | Rosh Chodesh, beginning of a new Hebrew month |
| MINOR_FAST | <code>number</code> | <code>256</code> | Minor fasts like Tzom Tammuz, Ta'anit Esther, ... |
| SPECIAL_SHABBAT | <code>number</code> | <code>512</code> | Shabbat Shekalim, Zachor, ... |
| PARSHA_HASHAVUA | <code>number</code> | <code>1024</code> | Weekly sedrot on Saturdays |
| DAF_YOMI | <code>number</code> | <code>2048</code> | Daily page of Talmud (Bavli) |
| OMER_COUNT | <code>number</code> | <code>4096</code> | Days of the Omer |
| MODERN_HOLIDAY | <code>number</code> | <code>8192</code> | Yom HaShoah, Yom HaAtzma'ut, ... |
| MAJOR_FAST | <code>number</code> | <code>16384</code> | Yom Kippur and Tish'a B'Av |
| SHABBAT_MEVARCHIM | <code>number</code> | <code>32768</code> | On the Saturday before Rosh Chodesh |
| MOLAD | <code>number</code> | <code>65536</code> | Molad |
| USER_EVENT | <code>number</code> | <code>131072</code> | Yahrzeit or Hebrew Anniversary |
| HEBREW_DATE | <code>number</code> | <code>262144</code> | Daily Hebrew date ("11th of Sivan, 5780") |
| MINOR_HOLIDAY | <code>number</code> | <code>524288</code> | A holiday that's not major, modern, rosh chodesh, or a fast day |
| EREV | <code>number</code> | <code>1048576</code> | Evening before a major or minor holiday |
| CHOL_HAMOED | <code>number</code> | <code>2097152</code> | Chol haMoed, intermediate days of Pesach or Sukkot |
| MISHNA_YOMI | <code>number</code> | <code>4194304</code> | Mishna Yomi |
| YOM_KIPPUR_KATAN | <code>number</code> | <code>8388608</code> | Yom Kippur Katan, minor day of atonement on the day preceeding each Rosh Chodesh |
| YERUSHALMI_YOMI | <code>number</code> | <code>16777216</code> | Daily page of Jerusalem Talmud (Yerushalmi) |
| NACH_YOMI | <code>number</code> | <code>33554432</code> | Nach Yomi |
| DAILY_LEARNING | <code>number</code> | <code>67108864</code> | Daily Learning |

<a name="holidayDesc"></a>

## holidayDesc : <code>enum</code>
Transliterated names of holidays, used by `Event.getDesc()`

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| ASARA_BTEVET | <code>string</code> | <code>&quot;Asara B&#x27;Tevet&quot;</code> | Asara B'Tevet |
| BIRKAT_HACHAMAH | <code>string</code> | <code>&quot;Birkat Hachamah&quot;</code> | Birkat Hachamah |
| CHAG_HABANOT | <code>string</code> | <code>&quot;Chag HaBanot&quot;</code> | Chag HaBanot |
| CHANUKAH_8TH_DAY | <code>string</code> | <code>&quot;Chanukah: 8th Day&quot;</code> | Chanukah: 8th Day |
| EREV_TISHA_BAV | <code>string</code> | <code>&quot;Erev Tish&#x27;a B&#x27;Av&quot;</code> | Erev Tish'a B'Av |
| LEIL_SELICHOT | <code>string</code> | <code>&quot;Leil Selichot&quot;</code> | Leil Selichot |
| PURIM_KATAN | <code>string</code> | <code>&quot;Purim Katan&quot;</code> | Purim Katan |
| PURIM_MESHULASH | <code>string</code> | <code>&quot;Purim Meshulash&quot;</code> | Purim Meshulash |
| SHABBAT_CHAZON | <code>string</code> | <code>&quot;Shabbat Chazon&quot;</code> | Shabbat Chazon |
| SHABBAT_HACHODESH | <code>string</code> | <code>&quot;Shabbat HaChodesh&quot;</code> | Shabbat HaChodesh |
| SHABBAT_HAGADOL | <code>string</code> | <code>&quot;Shabbat HaGadol&quot;</code> | Shabbat HaGadol |
| SHABBAT_NACHAMU | <code>string</code> | <code>&quot;Shabbat Nachamu&quot;</code> | Shabbat Nachamu |
| SHABBAT_PARAH | <code>string</code> | <code>&quot;Shabbat Parah&quot;</code> | Shabbat Parah |
| SHABBAT_SHEKALIM | <code>string</code> | <code>&quot;Shabbat Shekalim&quot;</code> | Shabbat Shekalim |
| SHABBAT_SHIRAH | <code>string</code> | <code>&quot;Shabbat Shirah&quot;</code> | Shabbat Shirah |
| SHABBAT_SHUVA | <code>string</code> | <code>&quot;Shabbat Shuva&quot;</code> | Shabbat Shuva |
| SHABBAT_ZACHOR | <code>string</code> | <code>&quot;Shabbat Zachor&quot;</code> | Shabbat Zachor |
| SHUSHAN_PURIM_KATAN | <code>string</code> | <code>&quot;Shushan Purim Katan&quot;</code> | Shushan Purim Katan |
| TAANIT_BECHOROT | <code>string</code> | <code>&quot;Ta&#x27;anit Bechorot&quot;</code> | Ta'anit Bechorot |
| TAANIT_ESTHER | <code>string</code> | <code>&quot;Ta&#x27;anit Esther&quot;</code> | Ta'anit Esther |
| TISHA_BAV | <code>string</code> | <code>&quot;Tish&#x27;a B&#x27;Av&quot;</code> | Tish'a B'Av |
| TZOM_GEDALIAH | <code>string</code> | <code>&quot;Tzom Gedaliah&quot;</code> | Tzom Gedaliah |
| TZOM_TAMMUZ | <code>string</code> | <code>&quot;Tzom Tammuz&quot;</code> | Tzom Tammuz |
| YOM_HAATZMA_UT | <code>string</code> | <code>&quot;Yom HaAtzma&#x27;ut&quot;</code> | Yom HaAtzma'ut |
| YOM_HASHOAH | <code>string</code> | <code>&quot;Yom HaShoah&quot;</code> | Yom HaShoah |
| YOM_HAZIKARON | <code>string</code> | <code>&quot;Yom HaZikaron&quot;</code> | Yom HaZikaron |
| BEN_GURION_DAY | <code>string</code> | <code>&quot;BEN_GURION_DAY&quot;</code> | Ben-Gurion Day |
| CHANUKAH_1_CANDLE | <code>string</code> | <code>&quot;CHANUKAH_1_CANDLE&quot;</code> | Chanukah: 1 Candle |
| EREV_PESACH | <code>string</code> | <code>&quot;EREV_PESACH&quot;</code> | Erev Pesach |
| EREV_PURIM | <code>string</code> | <code>&quot;EREV_PURIM&quot;</code> | Erev Purim |
| EREV_ROSH_HASHANA | <code>string</code> | <code>&quot;EREV_ROSH_HASHANA&quot;</code> | Erev Rosh Hashana |
| EREV_SHAVUOT | <code>string</code> | <code>&quot;EREV_SHAVUOT&quot;</code> | Erev Shavuot |
| EREV_SUKKOT | <code>string</code> | <code>&quot;EREV_SUKKOT&quot;</code> | Erev Sukkot |
| EREV_YOM_KIPPUR | <code>string</code> | <code>&quot;EREV_YOM_KIPPUR&quot;</code> | Erev Yom Kippur |
| FAMILY_DAY | <code>string</code> | <code>&quot;FAMILY_DAY&quot;</code> | Family Day |
| HEBREW_LANGUAGE_DAY | <code>string</code> | <code>&quot;HEBREW_LANGUAGE_DAY&quot;</code> | Hebrew Language Day |
| HERZL_DAY | <code>string</code> | <code>&quot;HERZL_DAY&quot;</code> | Herzl Day |
| JABOTINSKY_DAY | <code>string</code> | <code>&quot;JABOTINSKY_DAY&quot;</code> | Jabotinsky Day |
| LAG_BAOMER | <code>string</code> | <code>&quot;LAG_BAOMER&quot;</code> | Lag BaOmer |
| PESACH_I | <code>string</code> | <code>&quot;PESACH_I&quot;</code> | Pesach I |
| PESACH_II | <code>string</code> | <code>&quot;PESACH_II&quot;</code> | Pesach II |
| PESACH_III_CHM | <code>string</code> | <code>&quot;PESACH_III_CHM&quot;</code> | Pesach III (CH''M) |
| PESACH_II_CHM | <code>string</code> | <code>&quot;PESACH_II_CHM&quot;</code> | Pesach II (CH''M) |
| PESACH_IV_CHM | <code>string</code> | <code>&quot;PESACH_IV_CHM&quot;</code> | Pesach IV (CH''M) |
| PESACH_SHENI | <code>string</code> | <code>&quot;PESACH_SHENI&quot;</code> | Pesach Sheni |
| PESACH_VII | <code>string</code> | <code>&quot;PESACH_VII&quot;</code> | Pesach VII |
| PESACH_VIII | <code>string</code> | <code>&quot;PESACH_VIII&quot;</code> | Pesach VIII |
| PESACH_VI_CHM | <code>string</code> | <code>&quot;PESACH_VI_CHM&quot;</code> | Pesach VI (CH''M) |
| PESACH_V_CHM | <code>string</code> | <code>&quot;PESACH_V_CHM&quot;</code> | Pesach V (CH''M) |
| PURIM | <code>string</code> | <code>&quot;PURIM&quot;</code> | Purim |
| ROSH_HASHANA_II | <code>string</code> | <code>&quot;ROSH_HASHANA_II&quot;</code> | Rosh Hashana II |
| ROSH_HASHANA_LABEHEMOT | <code>string</code> | <code>&quot;ROSH_HASHANA_LABEHEMOT&quot;</code> | Rosh Hashana LaBehemot |
| SHAVUOT | <code>string</code> | <code>&quot;SHAVUOT&quot;</code> | Shavuot |
| SHAVUOT_I | <code>string</code> | <code>&quot;SHAVUOT_I&quot;</code> | Shavuot I |
| SHAVUOT_II | <code>string</code> | <code>&quot;SHAVUOT_II&quot;</code> | Shavuot II |
| SHMINI_ATZERET | <code>string</code> | <code>&quot;SHMINI_ATZERET&quot;</code> | Shmini Atzeret |
| SHUSHAN_PURIM | <code>string</code> | <code>&quot;SHUSHAN_PURIM&quot;</code> | Shushan Purim |
| SIGD | <code>string</code> | <code>&quot;SIGD&quot;</code> | Sigd |
| SIMCHAT_TORAH | <code>string</code> | <code>&quot;SIMCHAT_TORAH&quot;</code> | Simchat Torah |
| SUKKOT_I | <code>string</code> | <code>&quot;SUKKOT_I&quot;</code> | Sukkot I |
| SUKKOT_II | <code>string</code> | <code>&quot;SUKKOT_II&quot;</code> | Sukkot II |
| SUKKOT_III_CHM | <code>string</code> | <code>&quot;SUKKOT_III_CHM&quot;</code> | Sukkot III (CH''M) |
| SUKKOT_II_CHM | <code>string</code> | <code>&quot;SUKKOT_II_CHM&quot;</code> | Sukkot II (CH''M) |
| SUKKOT_IV_CHM | <code>string</code> | <code>&quot;SUKKOT_IV_CHM&quot;</code> | Sukkot IV (CH''M) |
| SUKKOT_VII_HOSHANA_RABA | <code>string</code> | <code>&quot;SUKKOT_VII_HOSHANA_RABA&quot;</code> | Sukkot VII (Hoshana Raba) |
| SUKKOT_VI_CHM | <code>string</code> | <code>&quot;SUKKOT_VI_CHM&quot;</code> | Sukkot VI (CH''M) |
| SUKKOT_V_CHM | <code>string</code> | <code>&quot;SUKKOT_V_CHM&quot;</code> | Sukkot V (CH''M) |
| TU_BAV | <code>string</code> | <code>&quot;TU_BAV&quot;</code> | Tu B\'Av |
| TU_BISHVAT | <code>string</code> | <code>&quot;TU_BISHVAT&quot;</code> | Tu BiShvat |
| YITZHAK_RABIN_MEMORIAL_DAY | <code>string</code> | <code>&quot;YITZHAK_RABIN_MEMORIAL_DAY&quot;</code> | Yitzhak Rabin Memorial Day |
| YOM_HAALIYAH | <code>string</code> | <code>&quot;YOM_HAALIYAH&quot;</code> | Yom HaAliyah |
| YOM_HAALIYAH_SCHOOL_OBSERVANCE | <code>string</code> | <code>&quot;YOM_HAALIYAH_SCHOOL_OBSERVANCE&quot;</code> | Yom HaAliyah School Observance |
| YOM_KIPPUR | <code>string</code> | <code>&quot;YOM_KIPPUR&quot;</code> | Yom Kippur |
| YOM_YERUSHALAYIM | <code>string</code> | <code>&quot;YOM_YERUSHALAYIM&quot;</code> | Yom Yerushalayim |

<a name="parshiot"></a>

## parshiot : <code>Array.&lt;string&gt;</code>
The 54 parshiyot of the Torah as transilterated strings
parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[52] == "Ha'azinu".

**Kind**: global constant  
**Read only**: true  
<a name="version"></a>

## version
DO NOT EDIT THIS AUTO-GENERATED FILE!

**Kind**: global constant  
<a name="hebrew2abs"></a>

## hebrew2abs(year, month, day) ⇒ <code>number</code>
Converts Hebrew date to R.D. (Rata Die) fixed days.
R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
Calendar.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |
| month | <code>number</code> | Hebrew month |
| day | <code>number</code> | Hebrew date (1-30) |

<a name="abs2hebrew"></a>

## abs2hebrew(abs) ⇒ <code>SimpleHebrewDate</code>
Converts absolute R.D. days to Hebrew date

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| abs | <code>number</code> | absolute R.D. days |

<a name="isLeapYear"></a>

## isLeapYear(year) ⇒ <code>boolean</code>
Returns true if Hebrew year is a leap year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="monthsInYear"></a>

## monthsInYear(year) ⇒ <code>number</code>
Number of months in this Hebrew year (either 12 or 13 depending on leap year)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="daysInMonth"></a>

## daysInMonth(month, year) ⇒ <code>number</code>
Number of days in Hebrew month in a given year (29 or 30)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="getMonthName"></a>

## getMonthName(month, year)
Returns a transliterated string name of Hebrew month in year,
for example 'Elul' or 'Cheshvan'.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| month | <code>number</code> | Hebrew month (e.g. months.TISHREI) |
| year | <code>number</code> | Hebrew year |

<a name="elapsedDays"></a>

## elapsedDays(year) ⇒ <code>number</code>
Days from sunday prior to start of Hebrew calendar to mean
conjunction of Tishrei in Hebrew YEAR

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="daysInYear"></a>

## daysInYear(year) ⇒ <code>number</code>
Number of days in the hebrew YEAR.
A common Hebrew calendar year can have a length of 353, 354 or 355 days
A leap Hebrew calendar year can have a length of 383, 384 or 385 days

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="longCheshvan"></a>

## longCheshvan(year) ⇒ <code>boolean</code>
true if Cheshvan is long in Hebrew year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="shortKislev"></a>

## shortKislev(year) ⇒ <code>boolean</code>
true if Kislev is short in Hebrew year

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="monthFromName"></a>

## monthFromName(monthName) ⇒ <code>number</code>
Converts Hebrew month string name to numeric

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| monthName | <code>string</code> | monthName |

<a name="gematriya"></a>

## gematriya(num) ⇒ <code>string</code>
Converts a numerical value to a string of Hebrew letters.

When specifying years of the Hebrew calendar in the present millennium,
we omit the thousands (which is presently 5 [ה]).

**Kind**: global function  

| Param | Type |
| --- | --- |
| num | <code>number</code> | 

**Example**  
```js
gematriya(5774) // 'תשע״ד' - cropped to 774
gematriya(25) // 'כ״ה'
gematriya(60) // 'ס׳'
gematriya(3761) // 'ג׳תשס״א'
gematriya(1123) // 'א׳קכ״ג'
```
<a name="gematriyaStrToNum"></a>

## gematriyaStrToNum(str) ⇒ <code>number</code>
Converts a string of Hebrew letters to a numerical value.

Only considers the value of Hebrew letters `א` through `ת`.
Ignores final Hebrew letters such as `ך` (kaf sofit) or `ם` (mem sofit)
and vowels (nekudot).

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="omerSefira"></a>

## omerSefira(omerDay, lang) ⇒
Returns the sefira. For example, on day 8
 חֶֽסֶד שֶׁבִּגְבוּרָה
 Chesed shebiGevurah
 Lovingkindness within Might

**Kind**: global function  
**Returns**: a string such as `Lovingkindness within Might` or `חֶֽסֶד שֶׁבִּגְבוּרָה`  

| Param | Description |
| --- | --- |
| omerDay | the day of the omer, 1-49 inclusive |
| lang | `en` (English), `he` (Hebrew with nikud), or `translit` (Hebrew in Sephardic transliteration) |

<a name="omerTodayIs"></a>

## omerTodayIs(omerDay, lang) ⇒
Returns a sentence with that evening's omer count

**Kind**: global function  
**Returns**: a string such as `Today is 10 days, which is 1 week and 3 days of the Omer`
 or `הַיוֹם עֲשָׂרָה יָמִים, שְׁהֵם שָׁבוּעַ אֶחָד וְשְׁלוֹשָׁה יָמִים לָעוֹמֶר`  

| Param | Description |
| --- | --- |
| omerDay | the day of the omer, 1-49 inclusive |
| lang | `en` (English), `he` (Hebrew with nikud) |

<a name="omerEmoji"></a>

## omerEmoji(omerDay) ⇒
Returns an emoji number symbol with a circle, for example `㊲`
 from the “Enclosed CJK Letters and Months” block of the Unicode standard

**Kind**: global function  
**Returns**: a single Unicode character from `①` through `㊾`  

| Param | Description |
| --- | --- |
| omerDay | the day of the omer, 1-49 inclusive |

<a name="molad"></a>

## molad()
Calculates the molad for a Hebrew month

**Kind**: global function  
<a name="getPseudoISO"></a>

## getPseudoISO(tzid, date) ⇒ <code>string</code>
Returns a string similar to `Date.toISOString()` but in the
timezone `tzid`. Contrary to the typical meaning of `Z` at the end
of the string, this is not actually a UTC date.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tzid | <code>string</code> | 
| date | <code>Date</code> | 

<a name="getTimezoneOffset"></a>

## getTimezoneOffset(tzid, date) ⇒ <code>number</code>
Returns number of minutes `tzid` is offset from UTC on date `date`.

**Kind**: global function  

| Param | Type |
| --- | --- |
| tzid | <code>string</code> | 
| date | <code>Date</code> | 

<a name="pad4"></a>

## pad4(number) ⇒ <code>string</code>
Formats a number with leading zeros so the resulting string is 4 digits long.
Similar to `string.padStart(4, '0')` but will also format
negative numbers similar to how the JavaScript date formats
negative year numbers (e.g. `-37` is formatted as `-000037`).

**Kind**: global function  

| Param | Type |
| --- | --- |
| number | <code>number</code> | 

<a name="pad2"></a>

## pad2(number) ⇒ <code>string</code>
Formats a number with leading zeros so the resulting string is 2 digits long.
Similar to `string.padStart(2, '0')`.

**Kind**: global function  

| Param | Type |
| --- | --- |
| number | <code>number</code> | 

