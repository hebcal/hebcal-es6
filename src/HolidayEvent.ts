import {isoDateString} from '@hebcal/hdate';
import {Event, flags} from './event';
import {TimedEvent} from './TimedEvent';
import {holidayDesc as hdesc} from './staticHolidays.js';

const minorHolidays = [
  hdesc.LAG_BAOMER,
  hdesc.LEIL_SELICHOT,
  hdesc.PESACH_SHENI,
  hdesc.EREV_PURIM,
  hdesc.PURIM_KATAN,
  hdesc.SHUSHAN_PURIM,
  hdesc.TU_BAV,
  hdesc.TU_BISHVAT,
  hdesc.ROSH_HASHANA_LABEHEMOT,
];

/** Represents a built-in holiday like Pesach, Purim or Tu BiShvat */
export class HolidayEvent extends Event {
  readonly cholHaMoedDay?: number;
  startEvent?: TimedEvent | null;
  endEvent?: TimedEvent | null;
  /** @return {string} */
  basename(): string {
    return this.getDesc().replace(/ \d{4}$/, '')
        .replace(/ \(CH''M\)$/, '')
        .replace(/ \(observed\)$/, '')
        .replace(/ \(Hoshana Raba\)$/, '')
        .replace(/ [IV]+$/, '')
        .replace(/: \d Candles?$/, '')
        .replace(/: 8th Day$/, '')
        .replace(/^Erev /, '');
  }
  /** @return {string | undefined} */
  url(): string | undefined {
    const year = this.getDate().greg().getFullYear();
    if (year < 100) {
      return undefined;
    }
    const url = 'https://www.hebcal.com/holidays/' +
      this.basename().toLowerCase().replace(/'/g, '').replace(/ /g, '-') + '-' +
      this.urlDateSuffix();
    return (this.getFlags() & flags.IL_ONLY) ? url + '?i=on' : url;
  }
  /** @return {string} */
  urlDateSuffix(): string {
    const year = this.getDate().greg().getFullYear();
    return String(year);
  }
  /** @return {string} */
  getEmoji(): string {
    if (this.emoji) {
      return this.emoji;
    } else if (this.getFlags() & flags.SPECIAL_SHABBAT) {
      return '🕍';
    } else {
      return '✡️';
    }
  }
  /** @return {string[]} */
  getCategories(): string[] {
    if (this.cholHaMoedDay) {
      return ['holiday', 'major', 'cholhamoed'];
    }
    const cats = super.getCategories();
    if (cats[0] !== 'unknown') {
      return cats;
    }
    // Don't depend on flags.MINOR_HOLIDAY always being set. Look for minor holidays.
    const desc = this.getDesc();

    if (minorHolidays.includes(desc)) {
      return ['holiday', 'minor'];
    }

    return ['holiday', 'major'];
  }
  /**
   * Returns (translated) description of this event
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  render(locale?: string): string {
    const str = super.render(locale);
    return str.replace(/'/g, '’');
  }
  /**
   * Returns a brief (translated) description of this event.
   * For most events, this is the same as render(). For some events, it procudes
   * a shorter text (e.g. without a time or added description).
   * @param {string} [locale] Optional locale name (defaults to active locale).
   * @return {string}
   */
  renderBrief(locale?: string): string {
    const str = super.renderBrief(locale);
    return str.replace(/'/g, '’');
  }
  /**
   * Makes a clone of this Event object
   * @return {Event}
   */
  clone(): HolidayEvent {
    const ev = new HolidayEvent(this.date, this.desc, this.mask);
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        Object.defineProperty(ev, property, {value: this[property]});
      }
    }
    return ev;
  }
}

/**
 * Because Asara B'Tevet often occurs twice in the same Gregorian year,
 * we subclass HolidayEvent to override the `url()` method.
 */
export class AsaraBTevetEvent extends HolidayEvent {
  /** @return {string} */
  urlDateSuffix(): string {
    const isoDate = isoDateString(this.getDate().greg());
    return isoDate.replace(/-/g, '');
  }
}
