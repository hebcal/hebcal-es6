/// <reference types="node"/>

import suncalc from 'suncalc';

declare module '@hebcal/core' {
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
        getAttrs(): any;
        getDesc(): string;
        getDate(): HDate;
        render(): string;
        observedInIsrael(): boolean;
        observedInDiaspora(): boolean;
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
        HEBREW_DATE
    }

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

    /**
     * Class representing Location
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
         * @param geoid - optional numeric geographic ID
         */
        constructor(latitude: number, longitude: number, il: boolean, tzid: string, cityName?: string, countryCode?: string, geoid?: number);
        suntime(hdate: HDate): suncalc.GetTimesResult;
        sunrise(hdate: HDate): Date;
        sunset(hdate: HDate): Date;
        hour(hdate: HDate): number;
        hourMins(hdate: HDate): number;
        gregEve(hdate: HDate): Date;
        nightHour(hdate: HDate): number;
        nightHourMins(hdate: HDate): number;
        hourOffset(hdate: HDate, hours: number): Date;
        chatzot(hdate: HDate): Date;
        chatzotNight(hdate: HDate): Date;
        alotHaShachar(hdate: HDate): Date;
        misheyakir(hdate: HDate): Date;
        misheyakirMachmir(hdate: HDate): Date;
        sofZmanShma(hdate: HDate): Date;
        sofZmanTfilla(hdate: HDate): Date;
        minchaGedola(hdate: HDate): Date;
        minchaKetana(hdate: HDate): Date;
        plagHaMincha(hdate: HDate): Date;
        tzeit(hdate: HDate): Date;
        neitzHaChama(hdate: HDate): Date;
        shkiah(hdate: HDate): Date;
        static lookup(name: string): Location;
        getLatitude(): number;
        getLongitude(): number;
        getIsrael(): boolean;
        getName(): string;
        getCountryCode(): string;
        getTzid(): string;
    }

    export namespace hebcal {
        /**
         * A simple Hebrew date
         * @property yy - Hebrew year
         * @property mm - Hebrew month of year (1=NISAN, 7=TISHREI)
         * @property dd - Day of month (1-30)
         */
        export type SimpleHebrewDate = {
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
        export function getBirthdayOrAnniversary(hyear: number, gdate: Date | HDate): HDate;

        /**
         * Calculates yahrzeit.
         * Year must be after original date of death.
         * Returns undefined when requested year preceeds or is same as original year.
         * @param hyear - Hebrew year
         * @param gdate - Gregorian or Hebrew date of death
         * @returns anniversary occurring in hyear
         */
        export function getYahrzeit(hyear: number, gdate: Date | HDate): HDate;

        /**
         * Converts Gregorian date to Julian Day Count
         * @param date - Gregorian date
         */
        export function greg2abs(date: Date): number;

        /**
         * Converts from Julian Day Count to Gregorian date.
         * See the footnote on page 384 of ``Calendrical Calculations, Part II:
         * Three Historical Calendars'' by E. M. Reingold,  N. Dershowitz, and S. M.
         * Clamen, Software--Practice and Experience, Volume 23, Number 4
         * (April, 1993), pages 383-404 for an explanation.
         * @param theDate - absolute Julian days
         */
        export function abs2greg(theDate: number): Date;

        /**
         * Converts Hebrew date to absolute Julian days.
         * The absolute date is the number of days elapsed since the (imaginary)
         * Gregorian date Sunday, December 31, 1 BC.
         * @param d - Hebrew Date
         */
        export function hebrew2abs(d: HDate | SimpleHebrewDate): number;

        /**
         * Converts Julian days to Hebrew date to absolute Julian days
         * @param d - absolute Julian days
         */
        export function abs2hebrew(d: number): SimpleHebrewDate;

        /**
         * Options to configure which events are returned
         * @property location - latitude/longitude/tzid used for candle-lighting
         * @property year - Gregorian or Hebrew year
         * @property isHebrewYear - to interpret year as Hebrew year
         * @property month - Gregorian or Hebrew month (to filter results to a single month)
         * @property numYears - generate calendar for multiple years (default 1)
         * @property start - use specific start date (requires end date)
         * @property end - use specific end date (requires start date)
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
         * @property addHebrewDates - print the Hebrew date for the entire date range
         * @property addHebrewDatesForEvents - print the Hebrew date for dates with some events
         */
        export type HebcalOptions = {
            location: Location;
            year: number;
            isHebrewYear: boolean;
            month: number;
            numYears: number;
            start: Date | HDate | number;
            end: Date | HDate | number;
            candlelighting: boolean;
            candleLightingMins: number;
            havdalahMins: number;
            havdalahTzeit: boolean;
            sedrot: boolean;
            il: boolean;
            noMinorFast: boolean;
            noModern: boolean;
            noRoshChodesh: boolean;
            shabbatMevarchim: boolean;
            noSpecialShabbat: boolean;
            noHolidays: boolean;
            dafyomi: boolean;
            omer: boolean;
            molad: boolean;
            ashkenazi: boolean;
            locale: string;
            hour12: boolean;
            addHebrewDates: boolean;
            addHebrewDatesForEvents: boolean;
        };

        /**
         * Generates a list of holidays
         */
        export function hebrewCalendar(options: HebcalOptions): Event[];

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
         * Registers a ttag locale for hebcal.hebrewCalendar()
         */
        export function registerLocale(locale: string, data: LocaleData): void;

        export function makeAnchor(s: string): string;
        export function getHolidayBasename(s: string): string;
        export function getShortUrl(e: Event): string;
        export function getEventUrl(e: Event): string;
        export function reformatTimeStr(timeStr: string, suffix: string, options: HebcalOptions): string;

        /**
         * Adds a location name for `Location.lookup()` only if the name isn't
         * already being used. Returns `false` if the name is already taken
         * and `true` if successfully added.
         */
        export function registerLocation(cityName: string, location: Location): boolean;

        /**
         * A little bit like `gettext()` but only returns a non-empty string
         */
        export function getHebrewText(str: string): string | undefined;
        export function getHebrewForEvent(ev: Event): string;
        /**
         * Removes nekudot from Hebrew string
         */
        export function hebrewStripNikkud(str: string): string;
    }

    export namespace dafyomi {
        /**
         * A Daf Yomi result
         * @property name - Tractate name
         * @property blatt - Page number
         */
        export type DafYomiResult = {
            name: string;
            blatt: number;
        };

        /**
         * Returns the Daf Yomi for given date
         * @param gregdate - Gregorian date
         * @returns Tractact name and page number
         */
        export function dafyomi(gregdate: Date): DafYomiResult;

        /**
         * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
         * @param daf - the Daf Yomi
         */
        export function dafname(daf: DafYomiResult): string;
    }

    /**
     * Gregorian date routines
     */
    export namespace greg {
        /**
         * Returns true if the Gregorian year is a leap year
         * @param year - Gregorian year
         */
        export function gregLeapYear(year: number): boolean;

        /**
         * Number of days in the Gregorian month for given year
         * @param month - Gregorian month (1=January, 12=December)
         * @param year - Gregorian year
         */
        export function daysInGregMonth(month: number, year: number): number;

        /**
         * Returns number of days since January 1 of that year
         * @param date - Gregorian date
         */
        export function dayOfYear(date: Date): number;
    }

    /**
     * Common hebrew date routines
     */
    export namespace common {
        /**
         * Hebrew months of the year (NISAN=1, TISHREI=7)
         */
        export const enum months {
            NISAN,
            IYYAR,
            SIVAN,
            TAMUZ,
            AV,
            ELUL,
            TISHREI,
            CHESHVAN,
            KISLEV,
            TEVET,
            SHVAT,
            ADAR_I,
            ADAR_II,
        }

        /**
         * Days of the week (SUN=0, SAT=6)
         */
        export const enum days {
            SUN,
            MON,
            TUE,
            WED,
            THU,
            FRI,
            SAT,
        }

        /**
         * Returns true if Hebrew year is a leap year
         * @param x - Hebrew year
         */
        export function hebLeapYear(x: number): boolean;

        /**
         * Number of months in Hebrew year
         * @param x - Hebrew year
         */
        export function monthsInHebYear(x: number): number;

        /**
         * Number of days in Hebrew month in a given year
         * @param month - Hebrew month (e.g. months.TISHREI)
         * @param year - Hebrew year
         */
        export function daysInHebMonth(month: number, year: number): number;

        /**
         * Returns an (untranslated) string name of Hebrew month in year
         * @param month - Hebrew month (e.g. months.TISHREI)
         * @param year - Hebrew year
         */
        export function getMonthName(month: number, year: number): string;

        /**
         * Returns the Hebrew month number
         * @param month - A number, or Hebrew month name string
         */
        export function monthNum(month: number | string): number;

        /**
         * Days from sunday prior to start of Hebrew calendar to mean
         * conjunction of Tishrei in Hebrew YEAR
         * @param hYear - Hebrew year
         */
        export function hebElapsedDays(hYear: number): number;

        /**
         * Number of days in the hebrew YEAR
         * @param year - Hebrew year
         */
        export function daysInYear(year: number): number;

        /**
         * true if Cheshvan is long in Hebrew YEAR
         * @param year - Hebrew year
         */
        export function longCheshvan(year: number): boolean;

        /**
         * true if Kislev is short in Hebrew YEAR
         * @param year - Hebrew year
         */
        export function shortKislev(year: number): boolean;

        /**
         * Converts Hebrew month string name to numeric
         * @param c - monthName
         */
        export function monthFromName(c: string): number;

        /**
         * Note: Applying this function to d+6 gives us the DAYNAME on or after an
         * absolute day d.  Similarly, applying it to d+3 gives the DAYNAME nearest to
         * absolute date d, applying it to d-1 gives the DAYNAME previous to absolute
         * date d, and applying it to d+7 gives the DAYNAME following absolute date d.
         */
        export function dayOnOrBefore(day_of_week: number, absdate: number): number;

        /**
         * Returns an array from start to end
         * @param start - beginning number, inclusive
         * @param end - ending number, inclusive
         */
        export function range(start: number, end: number, step?: number): number[];
    }

    /**
     * Lower-level holidays interface
     */
    export namespace holidays {
        /**
         * Returns a Map for the year indexed by HDate.toString()
         * @param year - Hebrew year
         */
        export function getHolidaysForYear(year: number): Map<string, Event[]>;

        /**
         * Returns an array of Events on this date (or undefined if no events)
         * @param date - Hebrew Date, Gregorian date, or absolute Julian date
         */
        export function getHolidaysOnDate(date: HDate | Date | number): Event[];
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
         * @param hDate Hebrew date or absolute days
         */
        get(hDate: HDate | number): string[];
        /**
         * Looks up parsha for the date, then returns a (translated) string
         * @param hDate Hebrew date or absolute days
         */
        getString(hDate: HDate | number): string;
        /**
         * Translates object describing the parsha to a string
         * @param parsha
         */
        static parshaToString(parsha: string[]): string;
        /**
         * Returns an object describing the parsha on the first Saturday on or after absdate
         * @param hDate Hebrew date or absolute days
         */
        lookup(hDate: HDate | number): Object;
        /**
         * Checks to see if this day would be a regular parasha HaShavua
         * Torah reading or special holiday reading
         * @param hDate Hebrew date or absolute days
         */
        isParsha(hDate: HDate | number): boolean;
        getYear(): number;
    }

    export const parshiyot: string[];
}
