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

import suncalc from "suncalc";

suncalc.addTime(-16.1, "alot_hashachar", 0);
suncalc.addTime(-11.5, "misheyakir", 0);
suncalc.addTime(-10.2, "misheyakir_machmir", 0);
suncalc.addTime(-8.5, 0, "tzeit");

/** Class representing Location */
export default class Location {
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

  static newFromCity(city) {
    return new Location(city.latitude, city.longitude, city.cc == 'IL',
      city.tzid, city.name, city.cc, city.geoid);
  }

  suntime(hdate) {
    // reset the date to midday before calling suncalc api
    // https://github.com/mourner/suncalc/issues/11
    const date = hdate.greg();
    return suncalc.getTimes(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0, 0),
      this.latitude,
      this.longitude
    );
  }

  sunrise(hdate) {
    return this.suntime(hdate).sunrise;
  }

  sunset(hdate) {
    return this.suntime(hdate).sunset;
  }

  hour(hdate) {
    const st = this.suntime(hdate);
    return (st.sunset - st.sunrise) / 12; // ms in hour
  }

  hourMins(hdate) {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.hour(hdate) / (1000 * 60);
  }

  gregEve(hdate) {
    return this.sunset(hdate.prev());
  }

  nightHour(hdate) {
    return (this.sunrise(hdate) - this.gregEve(hdate)) / 12; // ms in hour
  }

  nightHourMins(hdate) {
    // hour in ms / (1000 ms in s * 60 s in m) = mins in halachic hour
    return this.nightHour(hdate) / (1000 * 60);
  }

  hourOffset(hdate, hours) {
    return new Date(this.sunrise(hdate).getTime() + (this.hour(hdate) * hours));
  }

  chatzot(hdate) {
    return this.hourOffset(hdate, 6);
  }

  chatzot_night(hdate) {
      return new Date(this.sunrise(hdate).getTime() - (this.nightHour(hdate) * 6));
  }

  alot_hashachar(hdate) {
      return this.suntime(hdate).alot_hashachar;
  }

  alot_hashacher(hdate) {
      return this.suntime(hdate).alot_hashachar;
  }

  misheyakir(hdate) {
      return this.suntime(hdate).misheyakir;
  }

  misheyakir_machmir(hdate) {
      return this.suntime(hdate).misheyakir_machmir;
  }

  sof_zman_shma(hdate) { // Gra
      return this.hourOffset(hdate, 3);
  }

  sof_zman_tfilla(hdate) { // Gra
      return this.hourOffset(hdate, 4);
  }

  mincha_gedola(hdate) {
      return this.hourOffset(hdate, 6.5);
  }

  mincha_ketana(hdate) {
      return this.hourOffset(hdate, 9.5);
  }

  plag_hamincha(hdate) {
      return this.hourOffset(hdate, 10.75);
  }

  tzeit(hdate) {
      return this.suntime(hdate).tzeit;
  }

  neitz_hachama(hdate) {
      return this.sunrise(hdate);
  }

  shkiah(hdate) {
      return this.sunset(hdate);
  }
}
