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
import c from './common';
import greg from './greg';
import gematriya from 'gematriya';

export class HDate {
  constructor(day, month, year) {
    if (!arguments.length) {
      const d = abs2hebrew(greg.greg2abs(new Date()));
      this.day = d.dd;
      this.month = d.mm;
      this.year = d.yy;
    } else if (arguments.length == 1) {
      if (day instanceof Date) {
        const d = abs2hebrew(greg.greg2abs(day));
        this.day = d.dd;
        this.month = d.mm;
        this.year = d.yy;
      } else if (typeof day == 'number') {
        const d = abs2hebrew(day);
        this.day = d.dd;
        this.month = d.mm;
        this.year = d.yy;
      } else if (day instanceof HDate) {
        this.day = day.day;
        this.month = day.month;
        this.year = day.year;
      } else {
        throw new TypeError("HDate called with bad argument");
      }
    } else if (arguments.length == 3) {
      // Hebrew day, Hebrew month, Hebrew year
      this.day = this.month = 1;
      this.year = c.dayYearNum(year);
      this.setMonth(c.monthNum(month));
      this.setDate(c.dayYearNum(day));
    } else {
      throw new TypeError("HDate called with bad argument");
    }
  }

  getFullYear() {
    return this.year;
  }

  isLeapYear() {
    return c.LEAP(this.year);
  }

  getMonth() {
    return this.month;
  }

  getTishreiMonth() {
    const nummonths = c.MONTH_CNT(this.getFullYear());
    return (this.getMonth() + nummonths - 6) % nummonths || nummonths;
  }

  daysInMonth() {
    return c.daysInMonth(this.getMonth(), this.getFullYear());
  }

  getDate() {
    return this.day;
  }

  getDay() {
    return this.greg().getDay();
  }

  setFullYear(year) {
    this.year = year;
    fix(this);
    return this;
  }

  setMonth(month) {
    this.month = c.monthNum(month);
    fix(this);
    return this;
  }

  setTishreiMonth(month) {
    return this.setMonth((month + 6) % c.MONTH_CNT(this.getFullYear()) || 13);
  }

  setDate(date) {
    this.day = date;
    fix(this);
    return this;
  }

  greg() {
    return greg.abs2greg(hebrew2abs(this));
  }

  abs() {
    return hebrew2abs(this);
  }

  getMonthName(o) {
    return c.LANG(c.monthNames[+this.isLeapYear()][this.getMonth()], o);
  }

  before(day) {
    return onOrBefore(day, this, -1);
  }

  onOrBefore(day) {
    return onOrBefore(day, this, 0);
  }

  nearest(day) {
    return onOrBefore(day, this, 3);
  }

  onOrAfter(day) {
    return onOrBefore(day, this, 6);
  }

  after(day) {
    return onOrBefore(day, this, 7);
  }

  next() {
    return new HDate(this.abs() + 1);
  }

  prev() {
    return new HDate(this.abs() - 1);
  }

  isSameDate(other) {
    if (other instanceof HDate) {
      if (other.getFullYear() == -1) {
        other = new HDate(other).setFullYear(this.getFullYear());
      }
      return this.abs() == other.abs();
    }
    return false;
  }
}

HDate.prototype.toString = function hdateToString(o) {
    const day = this.getDate();
    const fullYear = this.getFullYear();
    return c.LANG([day, null, gematriya(day)], o) + ' ' +
        this.getMonthName(o) + ' ' +
        c.LANG([fullYear, null, gematriya(this.getFullYear())], o);
};


function fix(date) {
  fixMonth(date);
  fixDate(date);
}

function fixDate(date) {
  if (date.day < 1) {
    if (date.month == c.months.TISHREI) {
      date.year -= 1;
    }
    date.day += c.daysInMonth(date.month, date.year);
    date.month -= 1;
    fix(date);
  }
  if (date.day > c.daysInMonth(date.month, date.year)) {
    if (date.month == c.months.ELUL) {
      date.year += 1;
    }
    date.day -= c.daysInMonth(date.month, date.year);
    date.month += 1;
    fix(date);
  }
  fixMonth(date);
}

function fixMonth(date) {
  if (date.month == c.months.ADAR_II && !date.isLeapYear()) {
    date.month -= 1; // to Adar I
    fix(date);
  }
  if (date.month < 1) {
    date.month += c.MONTH_CNT(date.year);
    date.year -= 1;
    fix(date);
  }
  if (date.month > c.MONTH_CNT(date.year)) {
    date.month -= c.MONTH_CNT(date.year);
    date.year += 1;
    fix(date);
  }
}

function onOrBefore(day, t, offset) {
    return new HDate(c.dayOnOrBefore(day, t.abs() + offset));
}

/* convert hebrew date to absolute date */
/* Absolute date of Hebrew DATE.
   The absolute date is the number of days elapsed since the (imaginary)
   Gregorian date Sunday, December 31, 1 BC. */
export function hebrew2abs(d) {
  const isHDate = d instanceof HDate;
  let tempabs = isHDate ? d.getDate() : d.dd;
  const month = isHDate ? d.getMonth() : d.mm;  
  const year = isHDate ? d.getFullYear() : d.yy;
  
  if (month < c.months.TISHREI) {
    for (let m = c.months.TISHREI; m <= c.MONTH_CNT(year); m++) {
      tempabs += c.daysInMonth(m, year);
    }

    for (let m = c.months.NISAN; m < month; m++) {
      tempabs += c.daysInMonth(m, year);
    }
  } else {
    for (let m = c.months.TISHREI; m < month; m++) {
      tempabs += c.daysInMonth(m, year);
    }
  }

  return c.hebElapsedDays(year) - 1373429 + tempabs;
}

export function abs2hebrew(d) {
  if (d >= 10555144) {
    throw new RangeError(`parameter to abs2hebrew ${d} out of range`);
  }

  const gregdate = greg.abs2greg(d);
  let year = 3760 + gregdate.getFullYear();
  let hebdate = {
      dd: 1,
      mm: c.months.TISHREI,
      yy: -1
  };

  while (hebdate.yy = year + 1, d >= hebrew2abs(hebdate)) {
    year++;
  }

  const mmap = [9, 10, 11, 12, 1, 2, 3, 4, 7, 7, 7, 8];
  let month;
  if (year > 4634 && year < 10666) {
    // optimize search
    month = mmap[gregdate.getMonth()];
  } else {
    // we're outside the usual range, so assume nothing about Hebrew/Gregorian calendar drift...
    month = c.months.TISHREI;
  }

  while (hebdate.mm = month,
         hebdate.dd = c.daysInMonth(month, year),
         hebdate.yy = year,
         d > hebrew2abs(hebdate)) {
        month = (month % c.MONTH_CNT(year)) + 1;
    }

  hebdate.dd = 1;
  const day = d - hebrew2abs(hebdate) + 1;
  hebdate.dd = day;
  
  return hebdate;
}

export default HDate;
