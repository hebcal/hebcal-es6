/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import {GeoLocation} from '@hebcal/noaa';
import citiesJson from './cities.json';
import QuickLRU from 'quick-lru';

const classicCities = new Map<string, Location>();

// Zip-Codes.com TimeZone IDs
const ZIPCODES_TZ_MAP: Record<string, string> = {
  '0': 'UTC',
  '4': 'America/Puerto_Rico', // Atlantic (GMT -04:00)
  '5': 'America/New_York', //    Eastern  (GMT -05:00)
  '6': 'America/Chicago', //     Central  (GMT -06:00)
  '7': 'America/Denver', //      Mountain (GMT -07:00)
  '8': 'America/Los_Angeles', // Pacific  (GMT -08:00)
  '9': 'America/Anchorage', //   Alaska   (GMT -09:00)
  '10': 'Pacific/Honolulu', //   Hawaii-Aleutian Islands (GMT -10:00)
  '11': 'Pacific/Pago_Pago', //  American Samoa (GMT -11:00)
  '13': 'Pacific/Funafuti', //   Marshall Islands (GMT +12:00)
  '14': 'Pacific/Guam', //       Guam     (GMT +10:00)
  '15': 'Pacific/Palau', //      Palau    (GMT +9:00)
  '16': 'Pacific/Chuuk', //      Micronesia (GMT +11:00)
} as const;

/** @private */
const timeFormatCache = new QuickLRU<string, Intl.DateTimeFormat>({
  maxSize: 120,
});

/**
 * Gets a 24-hour time formatter (e.g. 07:41 or 20:03) from cache
 * or makes a new one if needed
 * @private
 */
function getFormatter(tzid: string): Intl.DateTimeFormat {
  const fmt = timeFormatCache.get(tzid);
  if (fmt) return fmt;
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tzid,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  timeFormatCache.set(tzid, f);
  return f;
}

function initClassicCities() {
  for (const entry of citiesJson) {
    const [cityName, cc, lat, lng, tzid, elev] = entry.split('|');
    const location = new Location(
      +lat,
      +lng,
      cc === 'IL',
      tzid,
      cityName,
      cc,
      undefined,
      +elev
    );
    Location.addLocation(cityName, location);
  }
}

/**
 * Class representing a geographic location for use with candle-lighting,
 * havdalah, and zmanim calculations.
 *
 * Extends {@link GeoLocation} from `@hebcal/noaa` with Jewish-calendar
 * specific data: an Israel/Diaspora flag, ISO country code, and an optional
 * geographic identifier. Also provides {@link Location.lookup} for ~60
 * built-in "classic" Hebcal cities.
 *
 * @example
 * import {Location} from '@hebcal/core';
 *
 * // Create a location for a custom address
 * const loc = new Location(
 *   41.85003,    // latitude
 *   -87.65005,   // longitude
 *   false,       // not in Israel
 *   'America/Chicago',
 *   'Chicago, Illinois, USA',
 *   'US'
 * );
 *
 * // Or look up a built-in classic city
 * const tlv = Location.lookup('Tel Aviv');
 */
export class Location extends GeoLocation {
  private readonly il: boolean;
  private readonly cc?: string;
  private readonly geoid?: string | number;
  admin1?: string;
  stateName?: string;
  geo?: 'zip' | 'geoname';
  zip?: string;
  population?: number;
  asciiname?: string;

  /**
   * Initialize a Location instance
   * @param latitude - Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003)
   * @param longitude - Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005)
   * @param il - in Israel (true) or Diaspora (false)
   * @param tzid - Olson timezone ID, e.g. "America/Chicago"
   * @param [cityName] - optional descriptive city name
   * @param [countryCode] - ISO 3166 alpha-2 country code (e.g. "FR")
   * @param [geoid] - optional string or numeric geographic ID
   * @param [elevation] - in meters (default `0`)
   */
  constructor(
    latitude: number,
    longitude: number,
    il: boolean,
    tzid: string,
    cityName?: string,
    countryCode?: string,
    geoid?: string | number,
    elevation?: number
  ) {
    const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      throw new RangeError(`Latitude ${latitude} out of range [-90,90]`);
    }
    const long = typeof longitude === 'number' ? longitude : parseFloat(longitude);
    if (isNaN(long) || long < -180 || long > 180) {
      throw new RangeError(`Longitude ${longitude} out of range [-180,180]`);
    }
    if (!tzid) {
      throw new RangeError('Invalid timezone');
    }
    const elev = typeof elevation === 'number' && elevation > 0 ? elevation : 0;
    if (cityName && typeof cityName !== 'string') {
      cityName = String(cityName);
    }
    super(cityName || null, lat, long, elev, tzid);
    this.il = Boolean(il);
    this.cc = countryCode;
    if (countryCode === 'IL') {
      this.il = true;
    }
    this.geoid = geoid;
  }

  /**
   * Returns `true` if this location is in Israel (uses the Israeli holiday
   * and Torah-reading schedule), `false` for the Diaspora.
   */
  getIsrael(): boolean {
    return this.il;
  }

  /**
   * Returns the full descriptive location name passed to the constructor,
   * or `null` if no name was provided.
   * @example
   * Location.lookup('San Francisco')?.getName(); // 'San Francisco, California, USA'
   */
  getName(): string | null {
    return this.getLocationName();
  }

  /**
   * Returns the location name truncated at the first comma. Useful for
   * compact display where only the city name is desired.
   *
   * Special-cased so that US locations of the form `"Washington, DC"` or
   * `"Washington, D.C., ..."` keep the `DC` / `D.C.` suffix attached.
   * @example
   * Location.lookup('San Francisco')?.getShortName(); // 'San Francisco'
   * Location.lookup('Washington DC')?.getShortName(); // 'Washington, DC'
   */
  getShortName(): string | null {
    const name = this.getLocationName();
    if (!name) return name;
    const comma = name.indexOf(', ');
    if (comma === -1) return name;
    if (this.cc === 'US' && name[comma + 2] === 'D') {
      if (name[comma + 3] === 'C') {
        return name.substring(0, comma + 4);
      }
      if (name[comma + 3] === '.' && name[comma + 4] === 'C') {
        return name.substring(0, comma + 6);
      }
    }
    return name.substring(0, comma);
  }

  /**
   * Returns the ISO 3166 alpha-2 country code (e.g. `"US"`, `"IL"`, `"FR"`)
   * passed to the constructor, or `undefined` if none was provided.
   */
  getCountryCode(): string | undefined {
    return this.cc;
  }

  /**
   * Returns the Olson timezone identifier (e.g. `"America/Chicago"`).
   * Alias for `getTimeZone()` from the parent `GeoLocation` class.
   */
  getTzid(): string {
    return this.getTimeZone();
  }

  /**
   * Returns a cached 24-hour `Intl.DateTimeFormat` (e.g. `07:41` or `20:03`)
   * configured for this location's timezone. Formatters are memoized by
   * timezone so repeated calls do not allocate.
   * @example
   * const loc = Location.lookup('Tel Aviv')!;
   * const fmt = loc.getTimeFormatter();
   * fmt.format(new Date()); // e.g. '18:42'
   */
  getTimeFormatter(): Intl.DateTimeFormat {
    return getFormatter(this.getTimeZone());
  }

  /**
   * Returns the optional geographic identifier passed to the constructor
   * (typically a GeoNames numeric ID or a US Zip Code string), or
   * `undefined` if none was provided.
   */
  getGeoId(): string | number | undefined {
    return this.geoid;
  }

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
   *
   * Lookups are case-insensitive. Returns `undefined` if the name is not
   * recognized. The list can be extended with {@link Location.addLocation}.
   * @example
   * const loc = Location.lookup('San Francisco');
   * console.log(loc?.getTzid()); // 'America/Los_Angeles'
   * @param name case-insensitive classic city name
   */
  static lookup(name: string): Location | undefined {
    if (classicCities.size === 0) {
      initClassicCities();
    }
    return classicCities.get(name.toLowerCase());
  }

  /**
   * Returns a JSON-serialized representation of this Location.
   * Useful for debugging and structured logging.
   */
  toString(): string {
    return JSON.stringify(this);
  }

  /**
   * Converts a legacy Hebcal-style timezone (a numeric GMT offset plus a
   * coarse DST region) to a standard IANA/Olson timezone ID.
   *
   * This exists to migrate data from older Hebcal versions that stored
   * timezones as GMT offset + DST scheme rather than as a full tzid.
   * @example
   * Location.legacyTzToTzid(2, 'israel'); // 'Asia/Jerusalem'
   * Location.legacyTzToTzid(0, 'eu');     // 'Europe/London'
   * Location.legacyTzToTzid(0, 'none');   // 'UTC'
   * Location.legacyTzToTzid(-5, 'none');  // 'Etc/GMT-5'
   * @param tz integer, GMT offset in hours
   * @param dst 'none', 'eu', 'usa', or 'israel'
   */
  static legacyTzToTzid(tz: number, dst: string): string | undefined {
    tz = +tz;
    if (dst === 'none') {
      if (tz === 0) {
        return 'UTC';
      }
      const plus = tz > 0 ? '+' : '';
      return `Etc/GMT${plus}${tz}`;
    }
    if (tz === 2 && dst === 'israel') {
      return 'Asia/Jerusalem';
    }
    if (dst === 'eu') {
      switch (tz) {
        case -2:
          return 'Atlantic/Cape_Verde';
        case -1:
          return 'Atlantic/Azores';
        case 0:
          return 'Europe/London';
        case 1:
          return 'Europe/Paris';
        case 2:
          return 'Europe/Athens';
        default:
          break;
      }
    }
    if (dst === 'usa') {
      return ZIPCODES_TZ_MAP[String(tz * -1)];
    }
    return undefined;
  }

  /**
   * Converts timezone info from Zip-Codes.com to a standard Olson tzid.
   * @example
   * Location.getUsaTzid('AZ', 7, 'Y') // 'America/Denver'
   * @param state two-letter all-caps US state abbreviation like 'CA'
   * @param tz positive number, 5=America/New_York, 8=America/Los_Angeles
   * @param dst single char 'Y' or 'N'
   */
  static getUsaTzid(state: string, tz: number, dst: string): string {
    tz = +tz;
    if (tz === 10 && state === 'AK') {
      return 'America/Adak';
    }
    if (tz === 7 && state === 'AZ') {
      return dst === 'Y' ? 'America/Denver' : 'America/Phoenix';
    }
    return ZIPCODES_TZ_MAP[tz];
  }

  /**
   * Registers a new named location with the built-in `Location.lookup()`
   * registry. Names are stored case-insensitively. Returns `false` if a
   * location with the same (lower-cased) name is already registered, and
   * `true` if successfully added.
   *
   * Use this to extend the built-in set of ~60 classic Hebcal cities with
   * your own custom locations.
   * @example
   * const tlv = new Location(32.0853, 34.7818, true,
   *   'Asia/Tel_Aviv', 'My Office, Tel Aviv', 'IL');
   * Location.addLocation('My Office', tlv);   // true
   * Location.lookup('my office')?.getTzid();  // 'Asia/Tel_Aviv'
   */
  static addLocation(cityName: string, location: Location): boolean {
    const name = cityName.toLowerCase();
    if (classicCities.has(name)) {
      return false;
    }
    classicCities.set(name, location);
    return true;
  }
}
