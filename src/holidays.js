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
import {Locale} from './locale';
import {HDate, months} from './hdate';
import {Event, flags} from './event';
import {MoladEvent} from './molad';

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
export class HolidayEvent extends Event {
  /**
   * Constructs Holiday event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} desc Description (not translated)
   * @param {number} [mask=0] optional holiday flags
   * @param {Object} [attrs={}]
   */
  constructor(date, desc, mask, attrs) {
    super(date, desc, mask, attrs);
  }
  /** @return {string} */
  basename() {
    return this.getDesc().replace(/ \d{4}$/, '')
        .replace(/ \(CH''M\)$/, '')
        .replace(/ \(observed\)$/, '')
        .replace(/ \(Hoshana Raba\)$/, '')
        .replace(/ [IV]+$/, '')
        .replace(/: \d Candles?$/, '')
        .replace(/: 8th Day$/, '')
        .replace(/^Erev /, '');
  }
  /** @return {string} */
  url() {
    const url = 'https://www.hebcal.com/holidays/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') + '-' +
      this.urlDateSuffix();
    return (this.getFlags() & flags.IL_ONLY) ? url + '?i=on' : url;
  }
  /** @return {string} */
  urlDateSuffix() {
    return this.getDate().greg().getFullYear();
  }
}

const roshChodeshStr = 'Rosh Chodesh';

/** Represents Rosh Chodesh, the beginning of a new month */
export class RoshChodeshEvent extends HolidayEvent {
  /**
   * Constructs Rosh Chodesh event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} monthName Hebrew month name (not translated)
   */
  constructor(date, monthName) {
    super(date, `${roshChodeshStr} ${monthName}`, flags.ROSH_CHODESH);
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    const monthName = this.getDesc().substring(roshChodeshStr.length + 1);
    return Locale.gettext(roshChodeshStr, locale) + ' ' + Locale.gettext(monthName, locale);
  }
  /** @return {string} */
  basename() {
    return this.getDesc();
  }
}

/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to override the `url()` method.
 */
export class AsaraBTevetEvent extends HolidayEvent {
  /**
   * Constructs AsaraBTevetEvent
   * @param {HDate} date Hebrew date event occurs
   * @param {string} desc Description (not translated)
   * @param {number} [mask=0] optional holiday flags
   * @param {Object} [attrs={}]
   */
  constructor(date, desc, mask, attrs) {
    super(date, desc, mask, attrs);
  }
  /** @return {string} */
  urlDateSuffix() {
    return this.getDate().greg().toISOString().substring(0, 10).replace(/-/g, '');
  }
}

const mevarchimChodeshStr = 'Shabbat Mevarchim Chodesh';

/** Represents Mevarchim haChodesh, the announcement of the new month */
export class MevarchimChodeshEvent extends Event {
  /**
   * Constructs Mevarchim haChodesh event
   * @param {HDate} date Hebrew date event occurs
   * @param {string} monthName Hebrew month name (not translated)
   */
  constructor(date, monthName) {
    super(date, `${mevarchimChodeshStr} ${monthName}`, flags.SHABBAT_MEVARCHIM);
    this.monthName = monthName;
    const hyear = date.getFullYear();
    const hmonth = date.getMonth();
    const monNext = (hmonth == HDate.monthsInYear(hyear) ? months.NISAN : hmonth + 1);
    const molad = new MoladEvent(date, hyear, monNext);
    this.memo = molad.render();
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale) {
    return Locale.gettext(mevarchimChodeshStr, locale) + ' ' + Locale.gettext(this.monthName, locale);
  }
}
