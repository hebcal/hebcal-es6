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
        observedIn(il: boolean): boolean;
        clone(): Event;
        getCategories(): string[];
        readonly date: Date;
        readonly desc: string;
        readonly mask: number;
        readonly emoji?: string;
        readonly memo?: string;
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
        MISHNA_YOMI,
        YERUSHALMI_YOMI,
        NACH_YOMI,
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
         * @param [showYear] Display year (defaults to `true`).
         */
        render(locale?: string, showYear?: boolean): string;
        /**
         * Renders this Hebrew date in Hebrew gematriya, regardless of locale.
         * @param [suppressNikud] suppress nekudot (defaults to `false`).
         */
        renderGematriya(suppressNikud?: boolean): string;

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
        static isHDate(obj: any): boolean;

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

        /**
         * Construct a new instance of `HDate` from a Gematriya-formatted string
         * @example
         *  HDate.fromGematriyaString('כ״ז בְּתַמּוּז תשפ״ג') // 27 Tamuz 5783
         *  HDate.fromGematriyaString('כ׳ סיון תש״ד') // 20 Sivan 5704
         *  HDate.fromGematriyaString('ה׳ אִיָיר תש״ח') // 5 Iyyar 5708
         */
        static fromGematriyaString(str: string, currentThousands?: number): HDate;
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
         * @deprecated
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
        /** Upper edge of the Sun appears over the eastern horizon in the morning (0.833° above horizon) */
        sunrise(): Date;
        /** When the upper edge of the Sun disappears below the horizon (0.833° below horizon) */
        sunset(): Date;
        /** Civil dawn; Sun is 6° below the horizon in the morning */
        dawn(): Date;
        /** Civil dusk; Sun is 6° below the horizon in the evening */
        dusk(): Date;
        hour(): number;
        hourMins(): number;
        gregEve(): Date;
        nightHour(): number;
        nightHourMins(): number;
        hourOffset(hours: number): Date;
        /** Midday – Chatzot; Sunrise plus 6 halachic hours */
        chatzot(): Date;
        /** Midnight – Chatzot; Sunset plus 6 halachic hours */
        chatzotNight(): Date;
        /** Dawn – Alot haShachar; Sun is 16.1° below the horizon in the morning */
        alotHaShachar(): Date;
        /** Earliest talis & tefillin – Misheyakir; Sun is 11.5° below the horizon in the morning */
        misheyakir(): Date;
        /** Earliest talis & tefillin – Misheyakir Machmir; Sun is 10.2° below the horizon in the morning */
        misheyakirMachmir(): Date;
        /** Latest Shema (Gra); Sunrise plus 3 halachic hours, according to the Gra */
        sofZmanShma(): Date;
        /** Latest Shacharit (Gra); Sunrise plus 4 halachic hours, according to the Gra */
        sofZmanTfilla(): Date;
        /** Latest Shema (MGA); Sunrise plus 3 halachic hours, according to Magen Avraham */
        sofZmanShmaMGA(): Date;
        /** Latest Shacharit (MGA); Sunrise plus 4 halachic hours, according to Magen Avraham */
        sofZmanTfillaMGA(): Date;
        /** Earliest Mincha – Mincha Gedola; Sunrise plus 6.5 halachic hours */
        minchaGedola(): Date;
        /** Preferable earliest time to recite Minchah – Mincha Ketana; Sunrise plus 9.5 halachic hours */
        minchaKetana(): Date;
        /** Plag haMincha; Sunrise plus 10.75 halachic hours */
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
         * Returns sunrise + `offset` minutes (either positive or negative).
         * @param roundMinute round time to nearest minute (default true)
         * @param offset minutes
         */
        sunriseOffset(offset: number, roundMinute?: boolean): Date;
        /**
         * Returns sunset + `offset` minutes (either positive or negative).
         * @param offset minutes
         * @param roundMinute round time to nearest minute (default true)
         */
        sunsetOffset(offset: number, roundMinute?: boolean): Date;
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
     * A locale in Hebcal is used for translations/transliterations of
     * holidays. @hebcal/core supports three locales by default
     * * `en` - default, Sephardic transliterations (e.g. "Shabbat")
     * * `ashkenazi` - Ashkenazi transliterations (e.g. "Shabbos")
     * * `he` - Hebrew (e.g. "שַׁבָּת")
     */
    export class Locale {
        /**
         * Returns translation only if `locale` offers a non-empty translation for `id`.
         * Otherwise, returns `undefined`.
         * @param id - Message ID to translate
         * @param [locale] - Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
         */
        static lookupTranslation(id: string, locale?: string): string;
        /**
         * By default, if no translation was found, returns `id`.
         * @param id - Message ID to translate
         * @param [locale] - Optional locale name (i.e: `'he'`, `'fr'`). Defaults to active locale.
         */
        static gettext(id: string, locale?: string): string;
        /**
         * Register locale translations.
         * @param locale - Locale name (i.e.: `'he'`, `'fr'`)
         * @param data - parsed data from a `.po` file.
         */
        static addLocale(locale: string, data: LocaleData): void;
        /**
         * Adds a translation to `locale`, replacing any previous translation.
         * @param locale - Locale name (i.e: `'he'`, `'fr'`).
         * @param id - Message ID to translate
         * @param translation - Translation text
         */
        static addTranslation(locale: string, id: string, translation: string | string[]): void;
        /**
         * Adds multiple translations to `locale`, replacing any previous translations.
         * @param locale - Locale name (i.e: `'he'`, `'fr'`).
         * @param data - parsed data from a `.po` file.
         */
        static addTranslations(locale: string, data: LocaleData): void;
        /**
         * Activates a locale. Throws an error if the locale has not been previously added.
         * After setting the locale to be used, all strings marked for translations
         * will be represented by the corresponding translation in the specified locale.
         * @param locale - Locale name (i.e: `'he'`, `'fr'`)
         */
        static useLocale(locale: string): LocaleData;
        /**
         * Returns the name of the active locale (i.e. 'he', 'ashkenazi', 'fr')
         */
        static getLocaleName(): string;
        static getLocaleNames(): string[];
        static ordinal(n: number, locale?: string): string;
        /**
         * Removes nekudot from Hebrew string
         */
        static hebrewStripNikkud(str: string): string;
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

    export interface DailyLearningOptions {
        [key: string]: any;
    }

    /**
     * Options to configure which events are returned
     */
    export type CalOptions = {
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
        /**
         * include Yom Kippur Katan (default `false`).
         * יוֹם כִּפּוּר קָטָן is a minor day of atonement occurring monthly on the day preceeding each Rosh Chodesh.
         * Yom Kippur Katan is omitted in Elul (on the day before Rosh Hashanah),
         * Tishrei (Yom Kippur has just passed), Kislev (due to Chanukah)
         * and Nisan (fasting not permitted during Nisan).
         * When Rosh Chodesh occurs on Shabbat or Sunday, Yom Kippur Katan is observed on the preceding Thursday.
         * @see {@link https://en.wikipedia.org/wiki/Yom_Kippur_Katan#Practices Wikipedia Yom Kippur Katan practices}
         */
        yomKippurKatan?: boolean;
        /**
         * Whether to use 12-hour time (as opposed to 24-hour time).
         * Possible values are `true` and `false`; the default is locale dependent.
         */
        hour12?: boolean;
        /**
         * map of options to enable daily study calendars such as `dafYomi`, `mishnaYomi`,
         * `nachYomi`, etc. with value `true`.
         * For `yerushalmi` the value should be a `number` for edition (`1` for Vilna, `2` for Schottenstein).
         */
        dailyLearning?: DailyLearningOptions;
    };

    export type TachanunResult = {
        /** Tachanun is said at Shacharit */
        shacharit: boolean;
        /** Tachanun is said at Mincha */
        mincha: boolean;
        /** All congregations say Tachanun on the day */
        allCongs: boolean;
    };

    /**
     * HebrewCalendar is the main interface to the `@hebcal/core` library.
     * This class is used to calculate holidays, rosh chodesh, candle lighting & havdalah times,
     * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
     * Event names can be rendered in several languges using the `locale` option.
     */
    export class HebrewCalendar {
        /**
         * Generates a list of holidays and other hebrew date events based on `options`.
         * This is the main interface to the `@hebcal/core` library, and can be used to
         * retrieve holidays, rosh chodesh, candle lighting & havdalah times,
         * Parashat HaShavua, Daf Yomi, days of the omer, and the molad.
         * Event names can be rendered in several languges using the `locale` option.
         */
        static calendar(options: CalOptions): Event[];

        /**
         * Lower-level holidays interface, which returns a `Map` of `Event`s indexed by
         * `HDate.toString()`. These events must filtered especially for `flags.IL_ONLY`
         * or `flags.CHUL_ONLY` depending on Israel vs. Diaspora holiday scheme
         * @param year - Hebrew year
         */
        static getHolidaysForYear(year: number): Map<string, Event[]>;

        /**
         * Returns an array of holidays for the year
         * @param year - Hebrew year
         * @param il - use the Israeli schedule for holidays
         */
        static getHolidaysForYearArray(year: number, il: boolean): Event[];

        /**
         * Returns an array of Events on this date (or undefined if no events)
         * @param date - Hebrew Date, Gregorian date, or absolute R.D. day number
         * @param il - use the Israeli schedule for holidays
         */
        static getHolidaysOnDate(date: HDate | Date | number, il?: boolean): Event[];

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
        static getBirthdayOrAnniversary(hyear: number, gdate: Date | HDate): HDate;

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
        static getYahrzeit(hyear: number, gdate: Date | HDate): HDate;

        /**
         * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
         * keep as "20:13" for any other locale/country. Uses `Options` to determine
         * locale.
         * @param timeStr - original time like "20:30"
         * @param suffix - "p" or "pm" or " P.M.". Add leading space if you want it
         * @param options
         */
        static reformatTimeStr(timeStr: string, suffix: string, options: CalOptions): string;

        static version(): string;

        /**
         * Convenience function to create an instance of `Sedra` or reuse a previously
         * created and cached instance.
         */
        static getSedra(hyear: number, il: boolean): Sedra;

        /**
         * Return a number containing information on what Hallel is said on that day.
         *
         * Whole Hallel is said on Chanukah, the first Yom Tov of Pesach, Shavuot, Sukkot,
         * Yom Ha'atzmaut, and Yom Yerushalayim.
         *
         * Half Hallel is said on Rosh Chodesh (not Rosh Hashanah), and the last 6 days of Pesach.
         *
         * The number is one of the following values:
         *
         * 0 - No Hallel
         * 1 - Half Hallel
         * 2 - Whole Hallel
         */
        static hallel(hdate: HDate, il: boolean): number;

        /**
         * Return details on what Tachanun (or Tzidchatcha on Shabbat) is said on `hdate`.
         *
         * Tachanun is not said on Rosh Chodesh, the month of Nisan, Lag Baomer,
         * Rosh Chodesh Sivan until Isru Chag, Tisha B'av, 15 Av, Erev Rosh Hashanah,
         * Rosh Hashanah, Erev Yom Kippur until after Simchat Torah, Chanukah,
         * Tu B'shvat, Purim and Shushan Purim, and Purim and Shushan Purim Katan.
         *
         * In some congregations Tachanun is not said until from Rosh Chodesh Sivan
         * until 14th Sivan, Sukkot until after Rosh Chodesh Cheshvan, Pesach Sheini,
         * Yom Ha'atzmaut, and Yom Yerushalayim.
         *
         * Tachanun is not said at Mincha on days before it is not said at Shacharit.
         *
         * Tachanun is not said at Shacharit on Shabbat, but is at Mincha, usually.
         */
        static tachanun(hdate: HDate, il: boolean): TachanunResult;
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
     * Gregorian date helper functions.
     */
    export class greg {
        /**
         * Long names of the Gregorian months (1='January', 12='December')
         */
        static monthNames: string[];
        /**
         * Returns true if the object is a Javascript Date
         */
        static isDate(obj: any): boolean;
        /**
         * Returns true if the Gregorian year is a leap year
         * @param year - Gregorian year
         */
        static isLeapYear(year: number): boolean;
        /**
         * Number of days in the Gregorian month for given year
         * @param month - Gregorian month (1=January, 12=December)
         * @param year - Gregorian year
         */
        static daysInMonth(month: number, year: number): number;
        /**
         * Returns number of days since January 1 of that year
         * @deprecated
         * @param date - Gregorian date
         */
        static dayOfYear(date: Date): number;
        /**
         * Converts Gregorian date to absolute R.D. (Rata Die) days
         * @param date - Gregorian date
         */
        static greg2abs(date: Date): number;
        /**
         * Converts from Rata Die (R.D. number) to Gregorian date.
         * See the footnote on page 384 of ``Calendrical Calculations, Part II:
         * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
         * Clamen, Software--Practice and Experience, Volume 23, Number 4
         * (April, 1993), pages 383-404 for an explanation.
         * @param theDate - R.D. number of days
         */
        static abs2greg(theDate: number): Date;
    }

    /**
     * Hebrew months of the year (NISAN=1, TISHREI=7)
     */
    export const enum months {
        /**
         * Nissan / ניסן
         */
        NISAN = 1,
        /**
         * Iyyar / אייר
         */
        IYYAR = 2,
        /**
         * Sivan / סיון
         */
        SIVAN = 3,
        /**
         * Tamuz (sometimes Tammuz) / תמוז
         */
        TAMUZ = 4,
        /**
         * Av / אב
         */
        AV = 5,
        /**
         * Elul / אלול
         */
        ELUL = 6,
        /**
         * Tishrei / תִשְׁרֵי
         */
        TISHREI = 7,
        /**
         * Cheshvan / חשון
         */
        CHESHVAN = 8,
        /**
         * Kislev / כסלו
         */
        KISLEV = 9,
        /**
         * Tevet / טבת
         */
        TEVET = 10,
        /**
         * Sh'vat / שבט
         */
        SHVAT = 11,
        /**
         * Adar or Adar Rishon / אדר
         */
        ADAR_I = 12,
        /**
         * Adar Sheini (only on leap years) / אדר ב׳
         */
        ADAR_II = 13
    }

    /**
     * The 54 parshiyot of the Torah as transilterated strings
     * parshiot[0] == 'Bereshit', parshiot[1] == 'Noach', parshiot[53] == 'Ha\'azinu'.
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
        /**
         * The parsha number (or numbers) using 1-indexing.
         * A `number` for a regular (single) parsha, and a `number[]`
         * for a doubled parsha.
         * For Parashat *Bereshit*, `num` would be equal to `1`, and for
         * *Matot-Masei* it would be `[42, 43]`
         */
        num: number | number[];
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

    /**
     * An event that has an `eventTime` and `eventTimeStr`
     * @param desc - Description (not translated)
     */
    export class TimedEvent extends Event {
        constructor(date: HDate, desc: string, mask: number, eventTime: Date, location: Location, linkedEvent?: Event);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        getCategories(): string[];
        readonly eventTime: Date;
        readonly location: Location;
        readonly eventTimeStr: string;
        readonly linkedEvent?: Event;
    }
    export class CandleLightingEvent extends TimedEvent {
        constructor(date: HDate, mask: number, eventTime: Date, location: Location, linkedEvent?: Event);
        getEmoji(): string;
    }
    export class HavdalahEvent extends TimedEvent {
        constructor(date: HDate, mask: number, eventTime: Date, location: Location, havdalahMins?: number, linkedEvent?: Event);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        getEmoji(): string;
        readonly havdalahMins?: number;
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
        getCategories(): string[];
        readonly cholHaMoedDay?: number;
        readonly startEvent?: TimedEvent;
        readonly endEvent?: TimedEvent;
    }
    export class AsaraBTevetEvent extends HolidayEvent {
        constructor(date: HDate, desc: string, mask?: number);
        urlDateSuffix(): string;
    }
    export class YomKippurKatanEvent extends HolidayEvent {
        constructor(date: HDate, nextMonthName: string);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        urlDateSuffix(): string;
    }
    export class MevarchimChodeshEvent extends Event {
        constructor(date: HDate, monthName: string);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        readonly monthName: string;
    }
    export class MoladEvent extends Event {
        constructor(date: HDate, hyear: number, hmonth: number);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        readonly molad: Molad;
    }
    export type OmerSefiraLang = 'en' | 'he' | 'translit';
    export class OmerEvent extends Event {
        constructor(date: HDate, omerDay: number);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        getEmoji(): string;
        getWeeks(): number;
        getDaysWithinWeeks(): number;
        getTodayIs(locale?: string): string;
        sefira(lang: OmerSefiraLang): string;
        url(): string;
        readonly weekNumber: number;
        readonly daysWithinWeeks: number;
        readonly memo: string;
        readonly alarm?: Date;
    }
    export class ParshaEvent extends Event {
        constructor(date: HDate, parsha: string[], il: boolean);
        render(locale?: string): string;
        renderBrief(locale?: string): string;
        url(): string;
        readonly parsha: string[];
        readonly il: boolean;
        readonly num: number | number[];
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

    /**
     * Converts a string of Hebrew letters to a numerical value.
     *
     * Only considers the value of Hebrew letters `א` through `ת`.
     * Ignores final Hebrew letters such as `ך` (kaf sofit) or `ם` (mem sofit)
     * and vowels (nekudot).
     */
    export function gematriyaStrToNum(str: string): number;

    /**
     * Daf Yomi, Mishna Yomi, Nach Yomi, etc.
     */
    export class DailyLearning {
        /**
         * Register a new learning calendar.
         */
        static addCalendar(name: string, calendar: Function): void;
        /**
         * Returns an event from daily calendar for a given date
         */
        static lookup(name: string, hd: HDate): Event;
    }
}
