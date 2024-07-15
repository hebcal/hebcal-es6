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

const classicCities0: [string, string, number, number, string, number][] = [
  ['Ashdod', 'IL', 31.79213, 34.64966, 'Asia/Jerusalem', 27],
  ['Atlanta', 'US', 33.749, -84.38798, 'America/New_York', 336],
  ['Austin', 'US', 30.26715, -97.74306, 'America/Chicago', 165],
  ['Baghdad', 'IQ', 33.34058, 44.40088, 'Asia/Baghdad', 41],
  ['Beer Sheva', 'IL', 31.25181, 34.7913, 'Asia/Jerusalem', 285],
  ['Berlin', 'DE', 52.52437, 13.41053, 'Europe/Berlin', 43],
  ['Baltimore', 'US', 39.29038, -76.61219, 'America/New_York', 35],
  ['Bogota', 'CO', 4.60971, -74.08175, 'America/Bogota', 2582],
  ['Boston', 'US', 42.35843, -71.05977, 'America/New_York', 38],
  ['Budapest', 'HU', 47.49801, 19.03991, 'Europe/Budapest', 104],
  [
    'Buenos Aires',
    'AR',
    -34.61315,
    -58.37723,
    'America/Argentina/Buenos_Aires',
    31,
  ],
  ['Buffalo', 'US', 42.88645, -78.87837, 'America/New_York', 191],
  ['Chicago', 'US', 41.85003, -87.65005, 'America/Chicago', 180],
  ['Cincinnati', 'US', 39.162, -84.45689, 'America/New_York', 267],
  ['Cleveland', 'US', 41.4995, -81.69541, 'America/New_York', 204],
  ['Dallas', 'US', 32.78306, -96.80667, 'America/Chicago', 139],
  ['Denver', 'US', 39.73915, -104.9847, 'America/Denver', 1636],
  ['Detroit', 'US', 42.33143, -83.04575, 'America/Detroit', 192],
  ['Eilat', 'IL', 29.55805, 34.94821, 'Asia/Jerusalem', 63],
  ['Gibraltar', 'GI', 36.14474, -5.35257, 'Europe/Gibraltar', 11],
  ['Haifa', 'IL', 32.81841, 34.9885, 'Asia/Jerusalem', 40],
  ['Hawaii', 'US', 21.30694, -157.85833, 'Pacific/Honolulu', 18],
  ['Helsinki', 'FI', 60.16952, 24.93545, 'Europe/Helsinki', 26],
  ['Houston', 'US', 29.76328, -95.36327, 'America/Chicago', 30],
  ['Jerusalem', 'IL', 31.76904, 35.21633, 'Asia/Jerusalem', 786],
  ['Johannesburg', 'ZA', -26.20227, 28.04363, 'Africa/Johannesburg', 1767],
  ['Kiev', 'UA', 50.45466, 30.5238, 'Europe/Kiev', 187],
  ['La Paz', 'BO', -16.5, -68.15, 'America/La_Paz', 3782],
  ['Livingston', 'US', 40.79593, -74.31487, 'America/New_York', 98],
  ['Las Vegas', 'US', 36.17497, -115.13722, 'America/Los_Angeles', 613],
  ['London', 'GB', 51.50853, -0.12574, 'Europe/London', 25],
  ['Los Angeles', 'US', 34.05223, -118.24368, 'America/Los_Angeles', 96],
  ['Marseilles', 'FR', 43.29695, 5.38107, 'Europe/Paris', 28],
  ['Miami', 'US', 25.77427, -80.19366, 'America/New_York', 25],
  ['Minneapolis', 'US', 44.97997, -93.26384, 'America/Chicago', 262],
  ['Melbourne', 'AU', -37.814, 144.96332, 'Australia/Melbourne', 25],
  ['Mexico City', 'MX', 19.42847, -99.12766, 'America/Mexico_City', 2240],
  ['Montreal', 'CA', 45.50884, -73.58781, 'America/Toronto', 216],
  ['Moscow', 'RU', 55.75222, 37.61556, 'Europe/Moscow', 144],
  ['New York', 'US', 40.71427, -74.00597, 'America/New_York', 57],
  ['Omaha', 'US', 41.25861, -95.93779, 'America/Chicago', 315],
  ['Ottawa', 'CA', 45.41117, -75.69812, 'America/Toronto', 71],
  ['Panama City', 'PA', 8.9936, -79.51973, 'America/Panama', 17],
  ['Paris', 'FR', 48.85341, 2.3488, 'Europe/Paris', 42],
  ['Pawtucket', 'US', 41.87871, -71.38256, 'America/New_York', 0], // -11
  ['Petach Tikvah', 'IL', 32.08707, 34.88747, 'Asia/Jerusalem', 54],
  ['Philadelphia', 'US', 39.95233, -75.16379, 'America/New_York', 8],
  ['Phoenix', 'US', 33.44838, -112.07404, 'America/Phoenix', 366],
  ['Pittsburgh', 'US', 40.44062, -79.99589, 'America/New_York', 239],
  ['Providence', 'US', 41.82399, -71.41283, 'America/New_York', 0], // -15
  ['Portland', 'US', 45.52345, -122.67621, 'America/Los_Angeles', 15],
  ['Saint Louis', 'US', 38.62727, -90.19789, 'America/Chicago', 149],
  ['Saint Petersburg', 'RU', 59.93863, 30.31413, 'Europe/Moscow', 11],
  ['San Diego', 'US', 32.71533, -117.15726, 'America/Los_Angeles', 20],
  ['San Francisco', 'US', 37.77493, -122.41942, 'America/Los_Angeles', 28],
  ['Sao Paulo', 'BR', -23.5475, -46.63611, 'America/Sao_Paulo', 769],
  ['Seattle', 'US', 47.60621, -122.33207, 'America/Los_Angeles', 56],
  ['Sydney', 'AU', -33.86785, 151.20732, 'Australia/Sydney', 58],
  ['Tel Aviv', 'IL', 32.08088, 34.78057, 'Asia/Jerusalem', 15],
  ['Tiberias', 'IL', 32.79221, 35.53124, 'Asia/Jerusalem', 0], // -140
  ['Toronto', 'CA', 43.70011, -79.4163, 'America/Toronto', 175],
  ['Vancouver', 'CA', 49.24966, -123.11934, 'America/Vancouver', 70],
  ['White Plains', 'US', 41.03399, -73.76291, 'America/New_York', 82],
  ['Washington DC', 'US', 38.89511, -77.03637, 'America/New_York', 6],
  ['Worcester', 'US', 42.26259, -71.80229, 'America/New_York', 164],
];
const classicCities = new Map<string, Location>();

// Zip-Codes.com TimeZone IDs
const ZIPCODES_TZ_MAP: {[x: string]: string} = {
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
const timeFormatCache = new Map<string, Intl.DateTimeFormat>();

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

/** Class representing Location */
export class Location extends GeoLocation {
  private readonly il: boolean;
  private readonly cc?: string;
  private readonly geoid?: string | number;
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
    const long =
      typeof longitude === 'number' ? longitude : parseFloat(longitude);
    if (isNaN(long) || long < -180 || long > 180) {
      throw new RangeError(`Longitude ${longitude} out of range [-180,180]`);
    }
    const elev = typeof elevation === 'number' && elevation > 0 ? elevation : 0;
    super(cityName || null, lat, long, elev, tzid);
    this.il = Boolean(il);
    this.cc = countryCode;
    this.geoid = geoid;
  }

  getIsrael(): boolean {
    return this.il;
  }

  getName(): string | null {
    return this.getLocationName();
  }

  /**
   * Returns the location name, up to the first comma
   */
  getShortName(): string | null {
    const name = this.getLocationName();
    if (!name) return name;
    const comma = name.indexOf(', ');
    if (comma === -1) return name;
    if (this.cc === 'US' && name[comma + 2] === 'D') {
      if (name[comma + 3] === 'C') {
        return name.substring(0, comma + 4);
      } else if (name[comma + 3] === '.' && name[comma + 4] === 'C') {
        return name.substring(0, comma + 6);
      }
    }
    return name.substring(0, comma);
  }

  getCountryCode(): string | undefined {
    return this.cc;
  }

  getTzid(): string {
    return this.getTimeZone();
  }

  /**
   * Gets a 24-hour time formatter (e.g. 07:41 or 20:03) for this location
   */
  getTimeFormatter(): Intl.DateTimeFormat {
    return getFormatter(this.getTimeZone());
  }

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
   * @param name
   */
  static lookup(name: string): Location | undefined {
    return classicCities.get(name.toLowerCase());
  }

  toString(): string {
    return JSON.stringify(this);
  }

  /**
   * Converts legacy Hebcal timezone to a standard Olson tzid.
   * @param tz integer, GMT offset in hours
   * @param dst 'none', 'eu', 'usa', or 'israel'
   */
  static legacyTzToTzid(tz: number, dst: string): string | undefined {
    tz = +tz;
    if (dst === 'none') {
      if (tz === 0) {
        return 'UTC';
      } else {
        const plus = tz > 0 ? '+' : '';
        return `Etc/GMT${plus}${tz}`;
      }
    } else if (tz === 2 && dst === 'israel') {
      return 'Asia/Jerusalem';
    } else if (dst === 'eu') {
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
    } else if (dst === 'usa') {
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
    if (tz === 10 && state === 'AK') {
      return 'America/Adak';
    } else if (tz === 7 && state === 'AZ') {
      return dst === 'Y' ? 'America/Denver' : 'America/Phoenix';
    } else {
      return ZIPCODES_TZ_MAP[tz];
    }
  }

  /**
   * Adds a location name for `Location.lookup()` only if the name isn't
   * already being used. Returns `false` if the name is already taken
   * and `true` if successfully added.
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

for (const city of classicCities0) {
  const location = new Location(
    city[2],
    city[3],
    city[1] === 'IL',
    city[4],
    city[0],
    city[1],
    undefined,
    city[5]
  );
  Location.addLocation(city[0], location);
}
