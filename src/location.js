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

import {Zmanim} from './zmanim';

const classicCities0 = [
  ['Ashdod', 'IL', 31.79213, 34.64966, 'Asia/Jerusalem'],
  ['Atlanta', 'US', 33.749, -84.38798, 'America/New_York'],
  ['Austin', 'US', 30.26715, -97.74306, 'America/Chicago'],
  ['Baghdad', 'IQ', 33.34058, 44.40088, 'Asia/Baghdad'],
  ['Beer Sheva', 'IL', 31.25181, 34.7913, 'Asia/Jerusalem'],
  ['Berlin', 'DE', 52.52437, 13.41053, 'Europe/Berlin'],
  ['Baltimore', 'US', 39.29038, -76.61219, 'America/New_York'],
  ['Bogota', 'CO', 4.60971, -74.08175, 'America/Bogota'],
  ['Boston', 'US', 42.35843, -71.05977, 'America/New_York'],
  ['Budapest', 'HU', 47.49801, 19.03991, 'Europe/Budapest'],
  ['Buenos Aires', 'AR', -34.61315, -58.37723, 'America/Argentina/Buenos_Aires'],
  ['Buffalo', 'US', 42.88645, -78.87837, 'America/New_York'],
  ['Chicago', 'US', 41.85003, -87.65005, 'America/Chicago'],
  ['Cincinnati', 'US', 39.162, -84.45689, 'America/New_York'],
  ['Cleveland', 'US', 41.4995, -81.69541, 'America/New_York'],
  ['Dallas', 'US', 32.78306, -96.80667, 'America/Chicago'],
  ['Denver', 'US', 39.73915, -104.9847, 'America/Denver'],
  ['Detroit', 'US', 42.33143, -83.04575, 'America/Detroit'],
  ['Eilat', 'IL', 29.55805, 34.94821, 'Asia/Jerusalem'],
  ['Gibraltar', 'GI', 36.14474, -5.35257, 'Europe/Gibraltar'],
  ['Haifa', 'IL', 32.81841, 34.9885, 'Asia/Jerusalem'],
  ['Hawaii', 'US', 21.30694, -157.85833, 'Pacific/Honolulu'],
  ['Helsinki', 'FI', 60.16952, 24.93545, 'Europe/Helsinki'],
  ['Houston', 'US', 29.76328, -95.36327, 'America/Chicago'],
  ['Jerusalem', 'IL', 31.76904, 35.21633, 'Asia/Jerusalem'],
  ['Johannesburg', 'ZA', -26.20227, 28.04363, 'Africa/Johannesburg'],
  ['Kiev', 'UA', 50.45466, 30.5238, 'Europe/Kiev'],
  ['La Paz', 'BO', -16.5, -68.15, 'America/La_Paz'],
  ['Livingston', 'US', 40.79593, -74.31487, 'America/New_York'],
  ['Las Vegas', 'US', 36.17497, -115.13722, 'America/Los_Angeles'],
  ['London', 'GB', 51.50853, -0.12574, 'Europe/London'],
  ['Los Angeles', 'US', 34.05223, -118.24368, 'America/Los_Angeles'],
  ['Marseilles', 'FR', 43.29695, 5.38107, 'Europe/Paris'],
  ['Miami', 'US', 25.77427, -80.19366, 'America/New_York'],
  ['Minneapolis', 'US', 44.97997, -93.26384, 'America/Chicago'],
  ['Melbourne', 'AU', -37.814, 144.96332, 'Australia/Melbourne'],
  ['Mexico City', 'MX', 19.42847, -99.12766, 'America/Mexico_City'],
  ['Montreal', 'CA', 45.50884, -73.58781, 'America/Toronto'],
  ['Moscow', 'RU', 55.75222, 37.61556, 'Europe/Moscow'],
  ['New York', 'US', 40.71427, -74.00597, 'America/New_York'],
  ['Omaha', 'US', 41.25861, -95.93779, 'America/Chicago'],
  ['Ottawa', 'CA', 45.41117, -75.69812, 'America/Toronto'],
  ['Panama City', 'PA', 8.9936, -79.51973, 'America/Panama'],
  ['Paris', 'FR', 48.85341, 2.3488, 'Europe/Paris'],
  ['Pawtucket', 'US', 41.87871, -71.38256, 'America/New_York'],
  ['Petach Tikvah', 'IL', 32.08707, 34.88747, 'Asia/Jerusalem'],
  ['Philadelphia', 'US', 39.95233, -75.16379, 'America/New_York'],
  ['Phoenix', 'US', 33.44838, -112.07404, 'America/Phoenix'],
  ['Pittsburgh', 'US', 40.44062, -79.99589, 'America/New_York'],
  ['Providence', 'US', 41.82399, -71.41283, 'America/New_York'],
  ['Portland', 'US', 45.52345, -122.67621, 'America/Los_Angeles'],
  ['Saint Louis', 'US', 38.62727, -90.19789, 'America/Chicago'],
  ['Saint Petersburg', 'RU', 59.93863, 30.31413, 'Europe/Moscow'],
  ['San Diego', 'US', 32.71533, -117.15726, 'America/Los_Angeles'],
  ['San Francisco', 'US', 37.77493, -122.41942, 'America/Los_Angeles'],
  ['Sao Paulo', 'BR', -23.5475, -46.63611, 'America/Sao_Paulo'],
  ['Seattle', 'US', 47.60621, -122.33207, 'America/Los_Angeles'],
  ['Sydney', 'AU', -33.86785, 151.20732, 'Australia/Sydney'],
  ['Tel Aviv', 'IL', 32.08088, 34.78057, 'Asia/Jerusalem'],
  ['Tiberias', 'IL', 32.79221, 35.53124, 'Asia/Jerusalem'],
  ['Toronto', 'CA', 43.70011, -79.4163, 'America/Toronto'],
  ['Vancouver', 'CA', 49.24966, -123.11934, 'America/Vancouver'],
  ['White Plains', 'US', 41.03399, -73.76291, 'America/New_York'],
  ['Washington DC', 'US', 38.89511, -77.03637, 'America/New_York'],
  ['Worcester', 'US', 42.26259, -71.80229, 'America/New_York'],
];
const classicCities = {};

// Zip-Codes.com TimeZone IDs
const ZIPCODES_TZ_MAP = {
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
};

/** Class representing Location */
export class Location {
  /**
   * Initialize a Location instance
   * @param {number} latitude - Latitude as a decimal, valid range -90 thru +90 (e.g. 41.85003)
   * @param {number} longitude - Longitude as a decimal, valid range -180 thru +180 (e.g. -87.65005)
   * @param {boolean} il - in Israel (true) or Diaspora (false)
   * @param {string} tzid - Olson timezone ID, e.g. "America/Chicago"
   * @param {string} cityName - optional descriptive city name
   * @param {string} countryCode - ISO 3166 alpha-2 country code (e.g. "FR")
   * @param {string} geoid - optional string or numeric geographic ID
   */
  constructor(latitude, longitude, il, tzid, cityName, countryCode, geoid) {
    this.latitude = +latitude;
    if (this.latitude < -90 || this.latitude > 90) {
      throw new RangeError(`Latitude ${this.latitude} out of range [-90,90]`);
    }
    this.longitude = +longitude;
    if (this.longitude < -180 || this.longitude > 180) {
      throw new RangeError(`Longitude ${this.longitude} out of range [-180,180]`);
    }
    this.il = Boolean(il);
    this.tzid = tzid;
    this.name = cityName;
    this.cc = countryCode;
    this.geoid = geoid;
  }

  /** @return {number} */
  getLatitude() {
    return this.latitude;
  }

  /** @return {number} */
  getLongitude() {
    return this.longitude;
  }

  /** @return {boolean} */
  getIsrael() {
    return this.il;
  }

  /** @return {string} */
  getName() {
    return this.name;
  }

  /**
   * Returns the location name, up to the first comma
   * @return {string}
   */
  getShortName() {
    if (!this.name) return this.name;
    const comma = this.name.indexOf(',');
    return comma == -1 ? this.name : this.name.substring(0, comma);
  }

  /** @return {string} */
  getCountryCode() {
    return this.cc;
  }

  /** @return {string} */
  getTzid() {
    return this.tzid;
  }

  /** @return {string} */
  getGeoId() {
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
   * @param {string} name
   * @return {Location}
   */
  static lookup(name) {
    return classicCities[name.toLowerCase()];
  }

  /**
   * @param {Date|HDate} hdate
   * @return {Date}
   */
  sunset(hdate) {
    return new Zmanim(hdate, this.getLatitude(), this.getLongitude()).sunset();
  }

  /**
   * @param {Date|HDate} hdate
   * @return {Date}
   */
  tzeit(hdate) {
    return new Zmanim(hdate, this.getLatitude(), this.getLongitude()).tzeit();
  }

  /** @return {string} */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * Converts legacy Hebcal timezone to a standard Olson tzid.
   * @param {number} tz integer, GMT offset in hours
   * @param {string} dst 'none', 'eu', 'usa', or 'israel'
   * @return {string}
   */
  static legacyTzToTzid(tz, dst) {
    tz = +tz;
    if (dst == 'none') {
      if (tz == 0) {
        return 'UTC';
      } else {
        const plus = tz > 0 ? '+' : '';
        return `Etc/GMT${plus}${tz}`;
      }
    } else if (tz == 2 && dst == 'israel') {
      return 'Asia/Jerusalem';
    } else if (dst == 'eu') {
      switch (tz) {
        case -2: return 'Atlantic/Cape_Verde';
        case -1: return 'Atlantic/Azores';
        case 0: return 'Europe/London';
        case 1: return 'Europe/Paris';
        case 2: return 'Europe/Athens';
        default: break;
      }
    } else if (dst == 'usa') {
      return ZIPCODES_TZ_MAP[String(tz * -1)];
    }
    return undefined;
  }

  /**
   * Converts timezone info from Zip-Codes.com to a standard Olson tzid.
   * @example
   * Location.getUsaTzid('AZ', 7, 'Y') // 'America/Denver'
   * @param {string} state two-letter all-caps US state abbreviation like 'CA'
   * @param {number} tz positive number, 5=America/New_York, 8=America/Los_Angeles
   * @param {string} dst single char 'Y' or 'N'
   * @return {string}
   */
  static getUsaTzid(state, tz, dst) {
    if (tz == 10 && state == 'AK') {
      return 'America/Adak';
    } else if (tz == 7 && state == 'AZ') {
      return dst == 'Y' ? 'America/Denver' : 'America/Phoenix';
    } else {
      return ZIPCODES_TZ_MAP[tz];
    }
  }

  /**
   * Builds a city description from geonameid string components
   * @param {string} cityName e.g. 'Tel Aviv' or 'Chicago'
   * @param {string} admin1 e.g. 'England' or 'Massachusetts'
   * @param {string} countryName full country name, e.g. 'Israel' or 'United States'
   * @return {string}
   */
  static geonameCityDescr(cityName, admin1, countryName) {
    if (countryName == 'United States') countryName = 'USA';
    if (countryName == 'United Kingdom') countryName = 'UK';
    let cityDescr = cityName;
    if (admin1 && !admin1.startsWith(cityName) && countryName != 'Israel') {
      cityDescr += ', ' + admin1;
    }
    if (countryName) {
      cityDescr += ', ' + countryName;
    }
    return cityDescr;
  }

  /**
   * Adds a location name for `Location.lookup()` only if the name isn't
   * already being used. Returns `false` if the name is already taken
   * and `true` if successfully added.
   * @param {string} cityName
   * @param {Location} location
   * @return {boolean}
   */
  static addLocation(cityName, location) {
    const name = cityName.toLowerCase();
    if (classicCities[name]) {
      return false;
    }
    classicCities[name] = location;
    return true;
  }
}

classicCities0.forEach((city) => {
  const location = new Location(city[2], city[3], city[1] == 'IL', city[4], city[0], city[1]);
  Location.addLocation(location.getName(), location);
});
