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

import suncalc from 'suncalc';

suncalc.addTime(-16.1, 'alot_hashachar', 0);
suncalc.addTime(-11.5, 'misheyakir', 0);
suncalc.addTime(-10.2, 'misheyakir_machmir', 0);
suncalc.addTime(-8.5, 0, 'tzeit');

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
   * @param {number} geoid - optional numeric geographic ID
   */
  constructor(latitude, longitude, il, tzid, cityName, countryCode, geoid) {
    this.latitude = +latitude;
    this.longitude = +longitude;
    this.il = Boolean(il);
    this.tzid = tzid;
    this.name = cityName;
    this.cc = countryCode;
    this.geoid = geoid;
  }

  /**
   * @param {Object} city
   * @return {Location}
   */
  static newFromCity(city) {
    if (typeof city !== 'object') {
      throw new TypeError('Invalid city object to Location.newFromCity');
    }
    return new Location(city.latitude, city.longitude, city.cc == 'IL',
        city.tzid, city.name, city.cc, city.geoid);
  }

  /**
   * @param {HDate} hdate
   * @return {suncalc.GetTimesResult}
   */
  suntime(hdate) {
    // reset the date to midday before calling suncalc api
    // https://github.com/mourner/suncalc/issues/11
    const date = hdate.greg();
    return suncalc.getTimes(
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0, 0),
        this.latitude,
        this.longitude,
    );
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  sunrise(hdate) {
    return this.suntime(hdate).sunrise;
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  sunset(hdate) {
    return this.suntime(hdate).sunset;
  }

  /**
   * @param {HDate} hdate
   * @return {number}
   */
  hour(hdate) {
    const st = this.suntime(hdate);
    return (st.sunset - st.sunrise) / 12; // ms in hour
  }

  /**
   * @param {HDate} hdate
   * @return {number}
   */
  hourMins(hdate) {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.hour(hdate) / (1000 * 60);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  gregEve(hdate) {
    return this.sunset(hdate.prev());
  }

  /**
   * @param {HDate} hdate
   * @return {number}
   */
  nightHour(hdate) {
    return (this.sunrise(hdate) - this.gregEve(hdate)) / 12; // ms in hour
  }

  /**
   * @param {HDate} hdate
   * @return {number}
   */
  nightHourMins(hdate) {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.nightHour(hdate) / (1000 * 60);
  }

  /**
   * @param {HDate} hdate
   * @param {number} hours
   * @return {Date}
   */
  hourOffset(hdate, hours) {
    return new Date(this.sunrise(hdate).getTime() + (this.hour(hdate) * hours));
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  chatzot(hdate) {
    return this.hourOffset(hdate, 6);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  chatzotNight(hdate) {
    return new Date(this.sunrise(hdate).getTime() - (this.nightHour(hdate) * 6));
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  alotHaShachar(hdate) {
    return this.suntime(hdate).alot_hashachar;
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  misheyakir(hdate) {
    return this.suntime(hdate).misheyakir;
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  misheyakirMachmir(hdate) {
    return this.suntime(hdate).misheyakir_machmir;
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  sofZmanShma(hdate) { // Gra
    return this.hourOffset(hdate, 3);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  sofZmanTfilla(hdate) { // Gra
    return this.hourOffset(hdate, 4);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  minchaGedola(hdate) {
    return this.hourOffset(hdate, 6.5);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  minchaKetana(hdate) {
    return this.hourOffset(hdate, 9.5);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  plagHaMincha(hdate) {
    return this.hourOffset(hdate, 10.75);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  tzeit(hdate) {
    return this.suntime(hdate).tzeit;
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  neitzHaChama(hdate) {
    return this.sunrise(hdate);
  }

  /**
   * @param {HDate} hdate
   * @return {Date}
   */
  shkiah(hdate) {
    return this.sunset(hdate);
  }
}

Location.prototype.toString = function locationToString() {
  return JSON.stringify(this);
};

export default Location;
