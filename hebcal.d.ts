/**
 * Represents an Event with a title, date, and flags
 */
declare class Event {
    /**
     * Constructs Event
     * @param date Hebrew date event occurs
     * @param desc Description (not translated)
     * @param mask optional holiday flags
     * @param attrs
     */
    constructor(date: HDate, desc: string, mask?: number, attrs?: any);
    getFlags(): number;
    getAttrs(): number;
    getDesc(): string;
    getDate(): HDate;
    render(): string;
    observedInIsrael(): boolean;
    observedInDiaspora(): boolean;
}

/**
 * Holiday flags for Event
 */
declare const enum flags {
}

/** Class representing a Hebrew date */
declare class HDate {
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
     * Gets the day of the week, using local time.
     */
    getDay(): number;
    /**
     * Converts to Gregorian date
     */
    greg(): Date;
    /**
     * Returns Julian absolute days
     */
    abs(): number;
    /**
     * Returns untranslated Hebrew month name
     */
    getMonthName(): string;
    /**
     * Returns translated/transliterated Hebrew date
     */
    render(): number;

    before(day: number): HDate;
    onOrBefore(day: number): HDate;
    nearest(day: number): HDate;
    onOrAfter(day: number): HDate;
    after(day: number): HDate;
    next(): HDate;
    prev(): HDate;
    isSameDate(other: HDate): boolean;
}

declare namespace hebcal {
    /**
     * A simple Hebrew date
     * @property yy - Hebrew year
     * @property mm - Hebrew month of year (1=NISAN, 7=TISHREI)
     * @property dd - Day of month (1-30)
     */
    declare type SimpleHebrewDate = {
        yy: number;
        mm: number;
        dd: number;
    };

    /**
     * Calculates a birthday or anniversary (non-yahrzeit).
     * Year must be after original date of anniversary.
     * Returns undefined when requested year preceeds or is same as original year.
     * @param hyear - Hebrew year
     * @param gdate - Gregorian or Hebrew date of event
     * @returns anniversary occurring in hyear
     */
    declare function getBirthdayOrAnniversary(hyear: number, gdate: Date | HDate): HDate;

    /**
     * Calculates yahrzeit.
     * Year must be after original date of death.
     * Returns undefined when requested year preceeds or is same as original year.
     * @param hyear - Hebrew year
     * @param gdate - Gregorian or Hebrew date of death
     * @returns anniversary occurring in hyear
     */
    declare function getYahrzeit(hyear: number, gdate: Date | HDate): HDate;

    /**
     * Converts Gregorian date to Julian Day Count
     * @param date - Gregorian date
     */
    declare function greg2abs(date: Date): number;

    /**
     * Converts from Julian Day Count to Gregorian date.
     * See the footnote on page 384 of ``Calendrical Calculations, Part II:
     * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
     * Clamen, Software--Practice and Experience, Volume 23, Number 4
     * (April, 1993), pages 383-404 for an explanation.
     * @param theDate - absolute Julian days
     */
    declare function abs2greg(theDate: number): Date;

    /**
     * Converts Hebrew date to absolute Julian days.
     * The absolute date is the number of days elapsed since the (imaginary)
     * Gregorian date Sunday, December 31, 1 BC.
     * @param d - Hebrew Date
     */
    declare function hebrew2abs(d: HDate | SimpleHebrewDate): number;

    /**
     * Converts Julian days to Hebrew date to absolute Julian days
     * @param d - absolute Julian days
     */
    declare function abs2hebrew(d: number): SimpleHebrewDate;

    /**
     * Options to configure which events are returned
     * @property location - latitude/longitude/tzid used for candle-lighting
     * @property year - Gregorian or Hebrew year
     * @property isHebrewYear - to interpret year as Hebrew year
     * @property month - Gregorian or Hebrew month (to filter results to a single month)
     * @property numYears - generate calendar for multiple years (default 1)
     * @property candlelighting - calculate candle-lighting and havdalah times
     * @property candleLightingMins - minutes before sundown to light candles (default 18)
     * @property havdalahMins - minutes after sundown for Havdalah (typical values are 42, 50, or 72)
     * @property havdalahTzeit - calculate Havdalah according to Tzeit Hakochavim -
     *      Nightfall (the point when 3 small stars are observable in the night time sky with
     *      the naked eye). Defaults to `true` unless havdalahMins is specified
     * @property sedrot - calculate parashah hashavua on Saturdays
     * @property il - Israeli holiday and sedra schedule
     * @property noMinorFast - suppress minor fasts
     * @property noModern - suppress modern holidays
     * @property noRoshChodesh - suppress Rosh Chodesh & Shabbat Mevarchim
     * @property noSpecialShabbat - suppress Special Shabbat
     * @property noHolidays - suppress regular holidays
     * @property dafyomi - include Daf Yomi
     * @property omer - include Days of the Omer
     * @property molad - include event announcing the molad
     * @property ashkenazi - use Ashkenazi transliterations for event titles (default Sephardi transliterations)
     * @property locale - translate event titles according to a locale
     *      (one of `fi`, `fr`, `he`, `hu`, `pl`, `ru`,
     *      `ashkenazi`, `ashkenazi_litvish`, `ashkenazi_poylish`, `ashkenazi_standard`)
     * @property hour12 - use 12-hour time (1-12) instead of default 24-hour time (0-23)
     */
    declare type HebcalOptions = {
        location: Location;
        year: number;
        isHebrewYear: boolean;
        month: number;
        numYears: number;
        candlelighting: boolean;
        candleLightingMins: number;
        havdalahMins: number;
        havdalahTzeit: boolean;
        sedrot: boolean;
        il: boolean;
        noMinorFast: boolean;
        noModern: boolean;
        noRoshChodesh: boolean;
        noSpecialShabbat: boolean;
        noHolidays: boolean;
        dafyomi: boolean;
        omer: boolean;
        molad: boolean;
        ashkenazi: boolean;
        locale: string;
        hour12: boolean;
    };

    /**
     * Generates a list of holidays
     */
    declare function hebrewCalendar(options: HebcalOptions): Event[];
}

/**
 * Interface to lookup cities
 */
declare namespace cities {
    /**
     * A City result
     * @property name - Short city name
     * @property tzid - Timezone Identifier (for tzdata/Olson tzdb)
     * @property cc - ISO 3166 two-letter country code
     * @property cityName - longer city name with US State or country code
     * @property [state] - U.S. State name (only if cc='US')
     * @property [geoid] - optional numerical geoid
     */
    declare type CityResult = {
        name: string;
        latitude: number;
        longitude: number;
        tzid: string;
        cc: string;
        cityName: string;
        state?: string;
        geoid?: number;
    };

    /**
     * Looks up a city
     * @param str - city name (such as "San Francisco" or "Jerusalem")
     */
    function getCity(str: string): CityResult;
    /**
     * Parses `geo.json`; must be called before `getCity()`
     */
    function init(): void;
}

declare namespace dafyomi {
    /**
     * A Daf Yomi result
     * @property name - Tractate name
     * @property blatt - Page number
     */
    declare type DafYomiResult = {
        name: string;
        blatt: number;
    };

    /**
     * Returns the Daf Yomi for given date
     * @param gregdate - Gregorian date
     * @returns Tractact name and page number
     */
    declare function dafyomi(gregdate: Date): DafYomiResult;

    /**
     * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
     * @param daf - the Daf Yomi
     */
    declare function dafname(daf: DafYomiResult): string;
}

/**
 * Gregorian date routines
 */
declare namespace greg {
    /**
     * Returns true if the Gregorian year is a leap year
     * @param year - Gregorian year
     */
    declare function gregLeapYear(year: number): boolean;

    /**
     * Number of days in the Gregorian month for given year
     * @param month - Gregorian month (1=January, 12=December)
     * @param year - Gregorian year
     */
    declare function daysInGregMonth(month: number, year: number): number;

    /**
     * Returns number of days since January 1 of that year
     * @param date - Gregorian date
     */
    declare function dayOfYear(date: Date): number;
}

/**
 * Common hebrew date routines
 */
declare namespace common {
    /**
     * Hebrew months of the year (NISAN=1, TISHREI=7)
     */
    declare const enum months {
    }

    /**
     * Days of the week (SUN=0, SAT=6)
     */
    declare const enum days {
    }

    /**
     * Returns true if Hebrew year is a leap year
     * @param x - Hebrew year
     */
    declare function hebLeapYear(x: number): boolean;

    /**
     * Number of months in Hebrew year
     * @param x - Hebrew year
     */
    declare function monthsInHebYear(x: number): number;

    /**
     * Number of days in Hebrew month in a given year
     * @param month - Hebrew month (e.g. months.TISHREI)
     * @param year - Hebrew year
     */
    declare function daysInHebMonth(month: number, year: number): number;

    /**
     * Returns an (untranslated) string name of Hebrew month in year
     * @param month - Hebrew month (e.g. months.TISHREI)
     * @param year - Hebrew year
     */
    declare function getMonthName(month: number, year: number): string;

    /**
     * Returns the Hebrew month number
     * @param month - A number, or Hebrew month name string
     */
    declare function monthNum(month: number | string): number;

    /**
     * Days from sunday prior to start of Hebrew calendar to mean
     * conjunction of Tishrei in Hebrew YEAR
     * @param hYear - Hebrew year
     */
    declare function hebElapsedDays(hYear: number): number;

    /**
     * Number of days in the hebrew YEAR
     * @param year - Hebrew year
     */
    declare function daysInYear(year: number): number;

    /**
     * true if Cheshvan is long in Hebrew YEAR
     * @param year - Hebrew year
     */
    declare function longCheshvan(year: number): boolean;

    /**
     * true if Kislev is short in Hebrew YEAR
     * @param year - Hebrew year
     */
    declare function shortKislev(year: number): boolean;

    /**
     * Converts Hebrew month string name to numeric
     * @param c - monthName
     */
    declare function monthFromName(c: string): number;

    /**
     * Note: Applying this function to d+6 gives us the DAYNAME on or after an
     * absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
     * absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
     * date d, and applying it to d+7 gives the DAYNAME following absolute date d.
     */
    declare function dayOnOrBefore(day_of_week: number, absdate: number): number;

    /**
     * Returns an array from start to end
     * @param start - beginning number, inclusive
     * @param end - ending number, inclusive
     */
    declare function range(start: number, end: number, step?: number): number[];
}

/**
 * Lower-level holidays interface
 */
declare namespace holidays {
    /**
     * Returns a Map for the year indexed by HDate.toString()
     * @param year - Hebrew year
     */
    declare function getHolidaysForYear(year: number): Map<string, Event[]>;

    /**
     * Returns an array of Events on this date (or undefined if no events)
     * @param date - Hebrew Date, Gregorian date, or absolute Julian date
     */
    declare function getHolidaysOnDate(date: HDate | Date | number): Event[];
}
