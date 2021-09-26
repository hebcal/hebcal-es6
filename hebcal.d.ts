/// <reference types="node"/>

declare module '@hebcal/core' {
    export const version: string;

    /**
     * Represents an Event with a title, date, and flags
     */
    export class Event {
        /**
         * Constructs Event
         * @param date Hebrew date event occurs
         * @param desc Description (not translated)
         * @param mask optional holiday flags
         * @param attrs
         */
        constructor(date: HDate, desc: string, mask?: number, attrs?: any);
        getFlags(): number;
        /** @deprecated */
        getAttrs(): any;
        getDesc(): string;
        basename(): string;
        url(): string;
        getDate(): HDate;
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        getEmoji(): string;
        observedInIsrael(): boolean;
        observedInDiaspora(): boolean;
        clone(): Event;
    }

    /**
     * Holiday flags for Event
     */
    export const enum flags {
        CHAG,
        LIGHT_CANDLES,
        YOM_TOV_ENDS,
        CHUL_ONLY,
        IL_ONLY,
        LIGHT_CANDLES_TZEIS,
        CHANUKAH_CANDLES,
        ROSH_CHODESH,
        MINOR_FAST,
        SPECIAL_SHABBAT,
        PARSHA_HASHAVUA,
        DAF_YOMI,
        OMER_COUNT,
        MODERN_HOLIDAY,
        MAJOR_FAST,
        SHABBAT_MEVARCHIM,
        MOLAD,
        USER_EVENT,
        HEBREW_DATE,
        MINOR_HOLIDAY,
        EREV,
        CHOL_HAMOED,
    }

    export type UnitTypeShort = 'd' | 'w' | 'M' | 'y';
    export type UnitTypeLong =  'day' | 'week' | 'month' | 'year';
    export type UnitTypeLongPlural = 'days' | 'weeks' | 'months' | 'years';
    export type UnitType = UnitTypeLong | UnitTypeLongPlural | UnitTypeShort;

    /** Class representing a Hebrew date */
    export class HDate {
        /**
         * Create a Hebrew date.
         * @param day - Day of month (1-30)
         * @param month - Hebrew month of year (1=NISAN, 7=TISHREI)
         * @param year - Hebrew year
         */
        constructor(day?: number | Date | HDate, month?: number | string, year?: number);
        /**
         * Gets the Hebrew year of this Hebrew date
         */
        getFullYear(): number;
        /**
         * Tests if this date occurs during a leap year
         */
        isLeapYear(): boolean;
        /**
         * Gets the Hebrew month (1=NISAN, 7=TISHREI) of this Hebrew date
         */
        getMonth(): number;
        getTishreiMonth(): number;
        /**
         * Number of days in the month of this Hebrew date
         */
        daysInMonth(): number;
        /**
         * Gets the day within the month (1-30)
         */
        getDate(): number;
        /**
         * Gets the day of the week. 0=Sunday, 6=Saturday
         */
        getDay(): number;
        /**
         * Converts to Gregorian date
         */
        greg(): Date;
        /**
         * Returns R.D. (Rata Die) fixed days.
         * R.D. 1 == Monday, January 1, 1 (Gregorian)
         * Note also that R.D. = Julian Date − 1,721,424.5
         * https://en.wikipedia.org/wiki/Rata_Die#Dershowitz_and_Reingold
         */
        abs(): number;
        /**
         * Returns untranslated Hebrew month name
         */
        getMonthName(): string;
        /**
         * Renders this Hebrew date as a translated or transliterated string,
         * including ordinal e.g. `'15th of Cheshvan, 5769'`.
         * @param [locale] Optional locale name (defaults to active locale).
         */
        render(locale?: string): number;
        /**
         * Renders this Hebrew date in Hebrew gematriya, regardless of locale.
         */
        renderGematriya(): string;

        before(day: number): HDate;
        onOrBefore(day: number): HDate;
        nearest(day: number): HDate;
        onOrAfter(day: number): HDate;
        after(day: number): HDate;
        next(): HDate;
        prev(): HDate;
        /**
         * Returns a cloned HDate object with a specified amount of time added
         * @param units Units are case insensitive, and support plural and short forms. Note, short forms are case sensitive
         */
        add(number: number, units?: UnitType): HDate;
        /**
         * Returns a cloned HDate object with a specified amount of time subtracted
         * @param units Units are case insensitive, and support plural and short forms. Note, short forms are case sensitive
         */
        subtract(number: number, units?: UnitType): HDate;
        /**
         * Returns the difference in days between the two given HDates.
         *
         * The result is positive if `this` date is comes chronologically
         * after the `other` date, and negative
         * if the order of the two dates is reversed.
         *
         * The result is zero if the two dates are identical.
         */
        deltaDays(other: HDate): number;

        isSameDate(other: HDate): boolean;

        /**
         * Tests if the object is an instance of `HDate`
         */
        isHDate(obj: any): boolean;

        /**
         * Converts Hebrew date to R.D. (Rata Die) fixed days.
         * R.D. 1 is the imaginary date Monday, January 1, 1 on the Gregorian
         * Calendar.
         * @param year Hebrew year
         * @param month Hebrew month of year (1=NISAN, 7=TISHREI)
         * @param day Hebrew day of month (1-30)
         */
        static hebrew2abs(year: number, month: number, day: number): number;

        /**
         * Returns true if Hebrew year is a leap year
         * @param x - Hebrew year
         */
        static isLeapYear(x: number): boolean;

        /**
         * Number of months in Hebrew year
         * @param x - Hebrew year
         */
        static monthsInYear(x: number): number;

        /**
         * Number of days in Hebrew month in a given year
         * @param month - Hebrew month (e.g. months.TISHREI)
         * @param year - Hebrew year
         */
        static daysInMonth(month: number, year: number): number;

        /**
         * Returns an (untranslated) string name of Hebrew month in year
         * @param month - Hebrew month (e.g. months.TISHREI)
         * @param year - Hebrew year
         */
        static getMonthName(month: number, year: number): string;

        /**
         * Returns the Hebrew month number
         * @param month - A number, or Hebrew month name string
         */
        static monthNum(month: number | string): number;

        /**
         * Days from sunday prior to start of Hebrew calendar to mean
         * conjunction of Tishrei in Hebrew YEAR
         * @param hYear - Hebrew year
         */
        static elapsedDays(hYear: number): number;

        /**
         * Number of days in the hebrew YEAR
         * @param year - Hebrew year
         */
        static daysInYear(year: number): number;

        /**
         * true if Cheshvan is long in Hebrew YEAR
         * @param year - Hebrew year
         */
        static longCheshvan(year: number): boolean;

        /**
         * true if Kislev is short in Hebrew YEAR
         * @param year - Hebrew year
         */
        static shortKislev(year: number): boolean;

        /**
         * Converts Hebrew month string name to numeric
         * @param c - monthName
         */
        static monthFromName(c: string): number;
    }

    /**
     * A Hebcal location is used for Zmanim and a latitude, longitude, timezone, and more
     */
    export class Location {
        /**
         * Initialize a Location instance
         * @param latitude - Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003)
         * @param longitude - Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005)
         * @param il - in Israel (true) or Diaspora (false)
         * @param tzid - Olson timezone ID, e.g. "America/Chicago"
         * @param cityName - optional descriptive city name
         * @param countryCode - ISO 3166 alpha-2 country code (e.g. "FR")
         * @param geoid - optional string or numeric geographic ID
         */
        constructor(latitude: number, longitude: number, il: boolean, tzid: string, cityName?: string, countryCode?: string, geoid?: string);
        /**
         * Creates a location object from one of 60 "classic" Hebcal city names.
         * The following city names are supported:
         * 'Ashdod', 'Atlanta', 'Austin', 'Baghdad', 'Beer Sheva',
         * 'Berlin', 'Baltimore', 'Bogota', 'Boston', 'Budapest',
         * 'Buenos Aires', 'Buffalo', 'Chicago', 'Cincinnati', 'Cleveland',
         * 'Dallas', 'Denver', 'Detroit', 'Eilat', 'Gibraltar', 'Haifa',
         * 'Hawaii', 'Helsinki', 'Houston', 'Jerusalem', 'Johannesburg',
         * 'Kiev', 'La Paz', 'Livingston', 'Las Vegas', 'London', 'Los Angeles',
         * 'Marseilles', 'Miami', 'Minneapolis', 'Melbourne', 'Mexico City',
         * 'Montreal', 'Moscow', 'New York', 'Omaha', 'Ottawa', 'Panama City',
         * 'Paris', 'Pawtucket', 'Petach Tikvah', 'Philadelphia', 'Phoenix',
         * 'Pittsburgh', 'Providence', 'Portland', 'Saint Louis', 'Saint Petersburg',
         * 'San Diego', 'San Francisco', 'Sao Paulo', 'Seattle', 'Sydney',
         * 'Tel Aviv', 'Tiberias', 'Toronto', 'Vancouver', 'White Plains',
         * 'Washington DC', 'Worcester'
         */
        static lookup(name: string): Location;
        getLatitude(): number;
        getLongitude(): number;
        getIsrael(): boolean;
        getName(): string;
        /**
         * Returns the location name, up to the first comma
         */
        getShortName(): string;
        getCountryCode(): string;
        getGeoId(): string;
        getTzid(): string;
        /**
         * Gets a 24-hour time formatter (e.g. 07:41 or 20:03) for this location
         */
        getTimeFormatter(): Intl.DateTimeFormat;
        /** @deprecated */
        sunset(hdate: Date | HDate): Date;
        /**
         * @deprecated
         * @param [angle=8.5] optional time for solar depression.
         *   Default is 8.5 degrees for 3 small stars, use 7.083 degress for 3 medium-sized stars.
         */
        tzeit(hdate: Date | HDate, angle?: number): Date;
        /**
         * Builds a city description from geonameid string components
         * @param cityName e.g. 'Tel Aviv' or 'Chicago'
         * @param admin1 e.g. 'England' or 'Massachusetts'
         * @param countryName full country name, e.g. 'Israel' or 'United States'
         */
        static geonameCityDescr(cityName: string, admin1: string, countryName: string): string;
        /**
         * Converts timezone info from Zip-Codes.com to a standard Olson tzid.
         * @example
         * Location.getUsaTzid('AZ', 7, 'Y') // 'America/Denver'
         * @param state two-letter all-caps US state abbreviation like 'CA'
         * @param tz positive number, 5=America/New_York, 8=America/Los_Angeles
         * @param dst single char 'Y' or 'N'
         */
        static getUsaTzid(state: string, tz: number, dst: string): string;
        /**
         * Converts legacy Hebcal timezone to a standard Olson tzid.
         * @param tz integer, GMT offset in hours
         * @param dst 'none', 'eu', 'usa', or 'israel'
         */
        static legacyTzToTzid(tz: number, dst: string): string;
        /**
         * Adds a location name for `Location.lookup()` only if the name isn't
         * already being used. Returns `false` if the name is already taken
         * and `true` if successfully added.
         */
        static addLocation(cityName: string, location: Location): boolean;
    }

    export interface ZmanimTimesResult {
        dawn: Date;
        dusk: Date;
        goldenHour: Date;
        goldenHourEnd: Date;
        nauticalDawn: Date;
        nauticalDusk: Date;
        night: Date;
        nightEnd: Date;
        solarNoon: Date;
        sunrise: Date;
        sunriseEnd: Date;
        sunset: Date;
        sunsetStart: Date;
        alotHaShachar: Date;
        misheyakir: Date;
        misheyakirMachmir: Date;
        tzeit: Date;
    }

    /**
     * Class representing halachic times
     */
    export class Zmanim {
        /**
         * Initialize a Zmanim instance
         * @param date Regular or Hebrew Date
         * @param latitude
         * @param longitude
         */
        constructor(date: Date | HDate, latitude: number, longitude: number);

        /**
         * Returns a string like "2022-04-01T13:06:00-11:00"
         */
        static formatISOWithTimeZone(tzid: string, date: Date): string;
        /**
         * Uses timeFormat to return a date like '20:34'
         */
        static formatTime(dt: Date, timeFormat: Intl.DateTimeFormat): string;
        /**
         * Discards seconds, rounding to nearest minute.
         */
        static roundTime(dt: Date): Date;
        /**
         * Get offset string (like "+05:00" or "-08:00") from tzid (like "Europe/Moscow")
         */
        static timeZoneOffset(tzid: string, date: Date): string;

        /** @deprecated */
        suntime(): ZmanimTimesResult;
        sunrise(): Date;
        sunset(): Date;
        dawn(): Date;
        dusk(): Date;
        hour(): number;
        hourMins(): number;
        gregEve(): Date;
        nightHour(): number;
        nightHourMins(): number;
        hourOffset(hours: number): Date;
        chatzot(): Date;
        chatzotNight(): Date;
        alotHaShachar(): Date;
        misheyakir(): Date;
        misheyakirMachmir(): Date;
        sofZmanShma(): Date;
        sofZmanTfilla(): Date;
        minchaGedola(): Date;
        minchaKetana(): Date;
        plagHaMincha(): Date;
        /**
         * @param [angle=8.5] optional time for solar depression.
         *   Default is 8.5 degrees for 3 small stars, use 7.083 degress for 3 medium-sized stars.
         */
        tzeit(angle?: number): Date;
        /** Alias for sunrise */
        neitzHaChama(): Date;
        /** Alias for sunset */
        shkiah(): Date;
        /**
         * Returns sunset + offset (either positive or negative).
         */
        sunsetOffset(offset: number): Date;
        /**
         * Returns an array with sunset + offset Date object, and a 24-hour string formatted time.
         * @deprecated
         */
        sunsetOffsetTime(offset: number, timeFormat: Intl.DateTimeFormat): any[];
        /**
         * Returns an array with tzeit Date object and a 24-hour string formatted time.
         * @deprecated
         * @param angle optional time for solar depression.
         *   Default is 8.5 degrees for 3 small stars, use 7.083 degress for 3 medium-sized stars.
         */
        tzeitTime(angle: number, timeFormat: Intl.DateTimeFormat): any[];
    }

    /**
     * A locale in Hebcal is used for translations/transliterations of
     * holidays. @hebcal/core supports three locales by default
     * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
     * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
     * * `he` - Hebrew (e.g. "שַׁבָּת")
     */
    export namespace Locale {
        export interface Headers {
            'content-type'?: string;
            'plural-forms'?: string;
        }
        export interface Translations {
            [key: string]: any;
        }
        export interface LocaleData {
            headers: Headers;
            translations: Translations;
        }
        /**
         * Returns translation only if `locale` offers a non-empty translation for `id`.
         * Otherwise, returns `undefined`.
         * @param id - Message ID to translate
         * @param [locale] - Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
         */
        export function lookupTranslation(id: string, locale?: string): string;
        /**
         * By default, if no translation was found, returns `id`.
         * @param id - Message ID to translate
         * @param [locale] - Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
         */
        export function gettext(id: string, locale?: string): string;
        /**
         * Register locale translations.
         * @param locale - Locale name (i.e.: `'he'`, `'fr'`)
         * @param data - parsed data from a `.po` file.
         */
        export function addLocale(locale: string, data: LocaleData): void;
        /**
         * Activates a locale. Throws an error if the locale has not been previously added.
         * After setting the locale to be used, all strings marked for translations
         * will be represented by the corresponding translation in the specified locale.
         * @param locale - Locale name (i.e: `'he'`, `'fr'`)
         */
        export function useLocale(locale: string): LocaleData;
        /**
         * Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')
         */
        export function getLocaleName(): string;
        export function ordinal(n: number, locale?: string): string;
        /**
         * Removes nekudot from Hebrew string
         */
        export function hebrewStripNikkud(str: string): string;
    }

    /**
     * A simple Hebrew date
     */
    export type SimpleHebrewDate = {
        /** Hebrew year */
        yy: number;
        /** Hebrew month of year (1=NISAN, 7=TISHREI) */
        mm: number;
        /** Day of month (1-30) */
        dd: number;
    };

    /**
     * HebrewCalendar is the main interface to the `@hebcal/core` library.
     * This class is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
     * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
     * Event names can be rendered in several languges using the `locale` option.
     */
    export namespace HebrewCalendar {
        /**
         * Options to configure which events are returned
         */
        export type Options = {
            /** latitude/longitude/tzid used for candle-lighting */
            location?: Location;
            /** Gregorian or Hebrew year */
            year?: number;
            /** to interpret year as Hebrew year */
            isHebrewYear?: boolean;
            /** Gregorian or Hebrew month (to filter results to a single month) */
            month?: number;
            /** generate calendar for multiple years (default 1) */
            numYears?: number;
            /** use specific start date (requires end date) */
            start?: Date | HDate | number;
            /** use specific end date (requires start date) */
            end?: Date | HDate | number;
            /** calculate candle-lighting and havdalah times */
            candlelighting?: boolean;
            /** minutes before sundown to light candles (default 18) */
            candleLightingMins?: number;
            /**
             * minutes after sundown for Havdalah (typical values are 42, 50, or 72).
             * If `undefined` (the default), calculate Havdalah according to Tzeit Hakochavim -
             * Nightfall (the point when 3 small stars are observable in the night time sky with
             * the naked eye). If `0`, Havdalah times are supressed.
             */
            havdalahMins?: number;
            /**
             * degrees for solar depression for Havdalah.
             * Default is 8.5 degrees for 3 small stars.
             * Use 7.083 degress for 3 medium-sized stars.
             * Havdalah times are supressed when `havdalahDeg=0`.
             */
            havdalahDeg?: number;
            /** calculate parashah hashavua on Saturdays */
            sedrot?: boolean;
            /** Israeli holiday and sedra schedule */
            il?: boolean;
            /** suppress minor fasts */
            noMinorFast?: boolean;
            /** suppress modern holidays */
            noModern?: boolean;
            /** suppress Rosh Chodesh & Shabbat Mevarchim */
            noRoshChodesh?: boolean;
            shabbatMevarchim?: boolean;
            /** suppress Special Shabbat */
            noSpecialShabbat?: boolean;
            /** suppress regular holidays */
            noHolidays?: boolean;
            /** include Daf Yomi */
            dafyomi?: boolean;
            /** include Days of the Omer */
            omer?: boolean;
            /** include event announcing the molad */
            molad?: boolean;
            /** use Ashkenazi transliterations for event titles (default Sephardi transliterations) */
            ashkenazi?: boolean;
            /**
             * translate event titles according to a locale
             * Default value is `en`, also built-in are `he` and `ashkenazi`.
             * Additional locales (such as `ru` or `fr`) are provided by the
             * {@link https://github.com/hebcal/hebcal-locales @hebcal/locales} package
             */
            locale?: string;
            /** print the Hebrew date for the entire date range */
            addHebrewDates?: boolean;
            /** print the Hebrew date for dates with some events */
            addHebrewDatesForEvents?: boolean;
            /** use bitmask from `flags` to filter events */
            mask?: number;
        };

        /**
         * Generates a list of holidays and other hebrew date events based on `options`.
         * This is the main interface to the `@hebcal/core` library, and can be used to
         * retrieve holidays, rosh chodesh, candle lighting & havdalah times,
         * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
         * Event names can be rendered in several languges using the `locale` option.
         */
        function calendar(options: Options): Event[];

        /**
         * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
         * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
         * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme
         * @param year - Hebrew year
         */
        function getHolidaysForYear(year: number): Map<string, Event[]>;

        /**
         * Returns an array of holidays for the year
         * @param year - Hebrew year
         * @param il - use the Israeli schedule for holidays
         */
        function getHolidaysForYearArray(year: number, il: boolean): Event[];

        /**
         * Returns an array of Events on this date (or undefined if no events)
         * @param date - Hebrew Date, Gregorian date, or absolute R.D. day number
         * @param il - use the Israeli schedule for holidays
         */
        function getHolidaysOnDate(date: HDate | Date | number, il?: boolean): Event[];

        /**
         * Calculates a birthday or anniversary (non-yahrzeit).
         * `hyear` must be after original `gdate` of anniversary.
         * Returns `undefined` when requested year preceeds or is same as original year.
         *
         * Hebcal uses the algorithm defined in "Calendrical Calculations"
         * by Edward M. Reingold and Nachum Dershowitz.
         *
         * The birthday of someone born in Adar of an ordinary year or Adar II of
         * a leap year is also always in the last month of the year, be that Adar
         * or Adar II. The birthday in an ordinary year of someone born during the
         * first 29 days of Adar I in a leap year is on the corresponding day of Adar;
         * in a leap year, the birthday occurs in Adar I, as expected.
         *
         * Someone born on the thirtieth day of Marcheshvan, Kislev, or Adar I
         * has his birthday postponed until the first of the following month in
         * years where that day does not occur. [Calendrical Calculations p. 111]
         * @param hyear - Hebrew year
         * @param gdate - Gregorian or Hebrew date of event
         * @returns anniversary occurring in hyear
         */
        function getBirthdayOrAnniversary(hyear: number, gdate: Date | HDate): HDate;

        /**
         * Calculates yahrzeit.
         * `hyear` must be after original `gdate` of death.
         * Returns `undefined` when requested year preceeds or is same as original year.
         *
         * Hebcal uses the algorithm defined in "Calendrical Calculations"
         * by Edward M. Reingold and Nachum Dershowitz.
         *
         * The customary anniversary date of a death is more complicated and depends
         * also on the character of the year in which the first anniversary occurs.
         * There are several cases:
         *
         * * If the date of death is Marcheshvan 30, the anniversary in general depends
         *   on the first anniversary; if that first anniversary was not Marcheshvan 30,
         *   use the day before Kislev 1.
         * * If the date of death is Kislev 30, the anniversary in general again depends
         *   on the first anniversary — if that was not Kislev 30, use the day before
         *   Tevet 1.
         * * If the date of death is Adar II, the anniversary is the same day in the
         *   last month of the Hebrew year (Adar or Adar II).
         * * If the date of death is Adar I 30, the anniversary in a Hebrew year that
         *   is not a leap year (in which Adar only has 29 days) is the last day in
         *   Shevat.
         * * In all other cases, use the normal (that is, same month number) anniversary
         *   of the date of death. [Calendrical Calculations p. 113]
         * @param hyear - Hebrew year
         * @param gdate - Gregorian or Hebrew date of death
         * @returns anniversary occurring in hyear
         */
        function getYahrzeit(hyear: number, gdate: Date | HDate): HDate;

        /**
         * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
         * keep as "20:13" for any other locale/country. Uses `HebrewCalendar.Options` to determine
         * locale.
         * @param timeStr - original time like "20:30"
         * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
         * @param options
         */
        function reformatTimeStr(timeStr: string, suffix: string, options: Options): string;

        function version(): string;
    }

    /**
     * Represents a molad, the moment when the new moon is "born"
     */
    export class Molad {
        /**
         * Calculates the molad for a Hebrew month
         */
        constructor(year: number, month: number);
        getYear(): number;
        getMonth(): number;
        getMonthName(): string;
        /**
         * @return Day of Week (0=Sunday, 6=Saturday)
         */
        getDow(): number;
        /**
         * @return hour of day (0-23)
         */
        getHour(): number;
        /**
         * @return minutes past hour (0-59)
         */
        getMinutes(): number;
        /**
         * @return parts of a minute (0-17)
         */
        getChalakim(): number;
    }

    /**
     * Returns the Daf Yomi for given date
     */
    export class DafYomi {
        /**
         * Initializes a daf yomi instance
         * @param gregdate Gregorian date
         */
        constructor(gregdate: Date);
        getBlatt(): number;
        getName(): string;
        /**
         * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
         * @param [locale] Optional locale name (defaults to active locale).
         */
        render(locale?: string): string;
    }

    /**
     * Gregorian date helper functions.
     */
    export namespace greg {
        /**
         * Long names of the Gregorian months (1='January', 12='December')
         */
        export const monthNames: string[];
        /**
         * Returns true if the object is a Javascript Date
         */
        export function isDate(obj: any): boolean;
        /**
         * Returns true if the Gregorian year is a leap year
         * @param year - Gregorian year
         */
        export function isLeapYear(year: number): boolean;
        /**
         * Number of days in the Gregorian month for given year
         * @param month - Gregorian month (1=January, 12=December)
         * @param year - Gregorian year
         */
        export function daysInMonth(month: number, year: number): number;
        /**
         * Returns number of days since January 1 of that year
         * @param date - Gregorian date
         */
        export function dayOfYear(date: Date): number;
        /**
         * Converts Gregorian date to absolute R.D. (Rata Die) days
         * @param date - Gregorian date
         */
        export function greg2abs(date: Date): number;
        /**
         * Converts from Rata Die (R.D. number) to Gregorian date.
         * See the footnote on page 384 of ``Calendrical Calculations, Part II:
         * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
         * Clamen, Software--Practice and Experience, Volume 23, Number 4
         * (April, 1993), pages 383-404 for an explanation.
         * @param theDate - R.D. number of days
         */
        export function abs2greg(theDate: number): Date;
    }

    /**
     * Hebrew months of the year (NISAN=1, TISHREI=7)
     */
    export const enum months {
        NISAN = 1,
        IYYAR = 2,
        SIVAN = 3,
        TAMUZ = 4,
        AV = 5,
        ELUL = 6,
        TISHREI = 7,
        CHESHVAN = 8,
        KISLEV = 9,
        TEVET = 10,
        SHVAT = 11,
        ADAR_I = 12,
        ADAR_II = 13
    }

    /**
     * The 54 parshiyot of the Torah as transilterated strings
     * parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[53] == 'Ha\'Azinu'.
     */
    export const parshiot: string[];

    /** The result from `Sedra.lookup()` */
    export type SedraResult = {
        /**
         * Name of the parsha (or parshiyot) read on
         * Hebrew date, e.g. `['Noach']` or `['Matot', 'Masei']`
         */
        parsha: string[];
        /**
         * True if this is a regular parasha HaShavua
         * Torah reading, false if it's a special holiday reading
         */
        chag: boolean;
    }

    export class Sedra {
        /**
         * Caculates the Parashah HaShavua for an entire Hebrew year
         * @param hebYr - Hebrew year (e.g. 5749)
         * @param il - Use Israel sedra schedule (false for Diaspora)
         */
        constructor(hebYr: number, il: boolean);
        /**
         * Returns the parsha (or parshiyot) read on Hebrew date
         * @param hDate Hebrew date or R.D. days
         */
        get(hDate: HDate | number): string[];
        /**
         * Looks up parsha for the date, then returns a (translated) string
         * @param hDate Hebrew date or R.D. days
         * @param locale Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale
         */
        getString(hDate: HDate | number, locale?: string): string;
        /**
         * Returns an object describing the parsha on the first Saturday on or after absdate
         * @param hDate Hebrew date or R.D. days
         */
        lookup(hDate: HDate | number): SedraResult;
        /**
         * Checks to see if this day would be a regular parasha HaShavua
         * Torah reading or special holiday reading
         * @param hDate Hebrew date or R.D. days
         */
        isParsha(hDate: HDate | number): boolean;
        /**
         * Returns the date that a parsha occurs
         */
        find(parsha: number | string | string[]): HDate;
        getYear(): number;
        /**
         * R.D. date of the first Saturday on or after Rosh Hashana
         */
        getFirstSaturday(): number;
    }

    export class TimedEvent extends Event {
        constructor(date: HDate, desc: string, mask: number, eventTime: Date, location: Location, linkedEvent?: Event);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
    }
    export class CandleLightingEvent extends TimedEvent {
        constructor(date: HDate, mask: number, eventTime: Date, location: Location, linkedEvent?: Event);
        getEmoji(): string;
    }
    export class DafYomiEvent extends Event {
        constructor(date: HDate);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        url(): string;
    }
    export class HavdalahEvent extends TimedEvent {
        constructor(date: HDate, mask: number, eventTime: Date, location: Location, havdalahMins?: number, linkedEvent?: Event);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        getEmoji(): string;
    }
    export class HebrewDateEvent extends Event {
        constructor(date: HDate, locale?: string);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
    }
    export class HolidayEvent extends Event {
        constructor(date: HDate, desc: string, mask?: number, attrs?: any);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        basename(): string;
        url(): string;
        urlDateSuffix(): string;
        getEmoji(): string;
    }
    export class AsaraBTevetEvent extends HolidayEvent {
        constructor(date: HDate, desc: string, mask?: number, attrs?: any);
        urlDateSuffix(): string;
    }
    export class MevarchimChodeshEvent extends Event {
        constructor(date: HDate, monthName: string);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
    }
    export class MoladEvent extends Event {
        constructor(date: HDate, hyear: number, hmonth: number);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
    }
    export class OmerEvent extends Event {
        constructor(date: HDate, omerDay: number);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        getEmoji(): string;
        getWeeks(): number;
        getDaysWithinWeeks(): number;
        getTodayIs(locale?: string): string;
    }
    export class ParshaEvent extends Event {
        constructor(date: HDate, parsha: string[], il: boolean);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        url(): string;
    }
    export class RoshChodeshEvent extends HolidayEvent {
        constructor(date: HDate, monthName: string);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        basename(): string;
        getEmoji(): string;
    }
    export class RoshHashanaEvent extends HolidayEvent {
        constructor(date: HDate, hyear: number, mask: number);
        render(locale?: string): string;
    }

    /**
     * Converts a numerical value to a string of Hebrew letters
     * @example
     * gematriya(5774) // תשע״ד - cropped to 774
     */
    export function gematriya(number: number): string;
}
