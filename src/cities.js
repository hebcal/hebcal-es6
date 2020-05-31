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

/**
 * A City result
 * @typedef {Object} CityResult
 * @property {string} name Short city name
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} tzid Timezone Identifier (for tzdata/Olson tzdb)
 * @property {string} cc ISO 3166 two-letter country code
 * @property {string} cityName longer city name with US State or country code
 * @property {string} [state] U.S. State name (only if cc='US')
 * @property {number} [geoid] optional numerical geoid
 */

/** Interface to lookup cities */
export const cities = {
  cities: new Map(),

  geo: {},

  /**
   * Looks up a city
   * @param {string} str city name
   * @return {CityResult}
   */
  getCity(str) {
    return this.cities.get(str.toLowerCase());
  },

  init() {
    console.debug('Loading geo.json...');
    this.geo = require('./geo.json');
    console.debug(`Parsing ${this.geo.cities.length} cities`);
    this.cities = this.loadCities(this.geo.cities);
    this.initCityAliases();
  },

  loadCities(allCities) {
    const cities = new Map();
    const cityObjs = allCities.map(this.parseCityString, this);
    for (const city of cityObjs) {
      const cityLc = city.name.toLowerCase();
      let aliasLc;
      if (city.cc == 'US') {
        const stateLc = this.geo.stateNames[city.state].toLowerCase();
        aliasLc = `${cityLc} ${stateLc}`;
      } else if (city.country) {
        const countryLc = city.country.toLowerCase();
        aliasLc = `${cityLc} ${countryLc}`;
      }
      if (!cities.has(cityLc)) {
        cities.set(cityLc, city);
      }
      cities.set(aliasLc, city);
    }
    // this is silly, but alias the first occurrence of each country and US state
    for (const city of cityObjs) {
      if (city.cc == 'US') {
        const stateLc = this.geo.stateNames[city.state].toLowerCase();
        if (!cities.has(stateLc)) {
          cities.set(stateLc, city);
        }
      } else {
        const countryLc = city.country.toLowerCase();
        if (!cities.has(countryLc)) {
          cities.set(countryLc, city);
        }
      }
    }
    return cities;
  },

  parseCityString(f) {
    const cityName = f[0];
    const country = f[1];
    const admin1 = f[2];
    const latitude = +f[3];
    const longitude = +f[4];
    const tzid = f[5];
    const geoid = f[6];

    const city = {
      name: cityName,
      cc: country,
      latitude,
      longitude,
      tzid,
    };

    if (geoid) {
      city.geoid = +geoid;
    }
    if (country == 'US') {
      city.state = admin1;
      city.cityName = `${cityName}, ${admin1}`;
    } else {
      const countryName = this.geo.countryNames[country];
      city.country = countryName;
      city.cityName = `${cityName}, ${countryName}`;
    }
    return city;
  },

  initCityAliases() {
    const aliasMap = {
      // geo.json name: [ alias1, alias2, alias3 ...]
      'new york': ['nyc', 'n y c', 'new york city', 'new york new york'],
      'beer sheva': ['beersheba'],
      'the bronx': ['bronx', 'bronx new york'],
      'los angeles': ['la', 'l a'],
      'washington': ['dc', 'd c', 'washington dc', 'washington d c'],
      'london': ['england', 'great britain', 'britain'],
      'glasgow': ['scotland'],
      'belfast': ['northern ireland'],
      'cardiff': ['wales'],
      'south lake tahoe': ['lake tahoe', 'tahoe'],
      'las vegas': ['vegas'],
      'Marseille': ['Marseilles'],
      'Panama': ['Panama City'],
      'Petah Tiqwa': ['Petach Tikvah', 'Petach Tikva', 'Petah Tikvah'],
      'Bene Beraq': ['Bnei Brak'],
    };
    const ccCityMap = {
      'Ashdod': 'IL-Ashdod',
      'Atlanta': 'US-Atlanta-GA',
      'Austin': 'US-Austin-TX',
      'Baghdad': 'IQ-Baghdad',
      'Beer Sheva': 'IL-Beer Sheva',
      'Berlin': 'DE-Berlin',
      'Baltimore': 'US-Baltimore-MD',
      'Bogota': 'CO-Bogota',
      'Boston': 'US-Boston-MA',
      'Buenos Aires': 'AR-Buenos Aires',
      'Buffalo': 'US-Buffalo-NY',
      'Chicago': 'US-Chicago-IL',
      'Cincinnati': 'US-Cincinnati-OH',
      'Cleveland': 'US-Cleveland-OH',
      'Dallas': 'US-Dallas-TX',
      'Denver': 'US-Denver-CO',
      'Detroit': 'US-Detroit-MI',
      'Eilat': 'IL-Eilat',
      'Gibraltar': 'GI-Gibraltar',
      'Haifa': 'IL-Haifa',
      'Hawaii': 'US-Honolulu-HI',
      'Houston': 'US-Houston-TX',
      'Jerusalem': 'IL-Jerusalem',
      'Johannesburg': 'ZA-Johannesburg',
      'Kiev': 'UA-Kiev',
      'La Paz': 'BO-La Paz',
      'Livingston': 'US-Livingston-NY',
      'London': 'GB-London',
      'Los Angeles': 'US-Los Angeles-CA',
      'Miami': 'US-Miami-FL',
      'Melbourne': 'AU-Melbourne',
      'Mexico City': 'MX-Mexico City',
      'Montreal': 'CA-Montreal',
      'Moscow': 'RU-Moscow',
      'New York': 'US-New York-NY',
      'Omaha': 'US-Omaha-NE',
      'Ottawa': 'CA-Ottawa',
      'Panama City': 'PA-Panama City',
      'Paris': 'FR-Paris',
      'Petach Tikvah': 'IL-Petach Tikvah',
      'Philadelphia': 'US-Philadelphia-PA',
      'Phoenix': 'US-Phoenix-AZ',
      'Pittsburgh': 'US-Pittsburgh-PA',
      'Saint Louis': 'US-Saint Louis-MO',
      'Saint Petersburg': 'RU-Saint Petersburg',
      'San Francisco': 'US-San Francisco-CA',
      'Seattle': 'US-Seattle-WA',
      'Sydney': 'AU-Sydney',
      'Tel Aviv': 'IL-Tel Aviv',
      'Tiberias': 'IL-Tiberias',
      'Toronto': 'CA-Toronto',
      'Vancouver': 'CA-Vancouver',
      'White Plains': 'US-White Plains-NY',
      'Washington DC': 'US-Washington-DC',
      'Bene Beraq': 'IL-Bnei Brak',
    };
    for (const [city, aliases] of Object.entries(aliasMap)) {
      const c = this.cities.get(city.toLowerCase());
      for (const a of aliases) {
        this.cities.set(a.toLowerCase(), c);
      }
    }
    for (const [city, alias] of Object.entries(ccCityMap)) {
      this.cities.set(alias.toLowerCase(), this.cities.get(city.toLowerCase()));
    }
  },
};

export default cities;
