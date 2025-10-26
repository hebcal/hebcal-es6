import {HDate, Locale} from '@hebcal/hdate';
import {CalOptions} from './CalOptions';
import {Location} from './location';
import {Event} from './event';
import {reformatTimeStr} from './reformatTimeStr';
import {Zmanim} from './zmanim';
import './locale'; // Adds Hebrew and Ashkenazic translations

/** An event that has an `eventTime` and `eventTimeStr` */
export class TimedEvent extends Event {
  readonly eventTime: Date;
  readonly location: Location;
  readonly eventTimeStr: string;
  readonly fmtTime: string;
  readonly linkedEvent?: Event;
  /**
   * @param desc Description (not translated)
   */
  constructor(
    date: HDate,
    desc: string,
    mask: number,
    eventTime: Date,
    location: Location,
    linkedEvent?: Event,
    options?: CalOptions
  ) {
    super(date, desc, mask);
    this.eventTime = Zmanim.roundTime(eventTime);
    this.location = location;
    const timeFormat = location.getTimeFormatter();
    this.eventTimeStr = Zmanim.formatTime(this.eventTime, timeFormat);
    const opts = {...options, location};
    this.fmtTime = reformatTimeStr(this.eventTimeStr, 'pm', opts);
    if (typeof linkedEvent !== 'undefined') {
      this.linkedEvent = linkedEvent;
    }
  }
  /**
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    return Locale.gettext(this.getDesc(), locale) + ': ' + this.fmtTime;
  }
  /**
   * Returns translation of "Candle lighting" without the time.
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  renderBrief(locale?: string): string {
    return Locale.gettext(this.getDesc(), locale);
  }

  getCategories(): string[] {
    const desc = this.getDesc();
    switch (desc) {
      // LIGHT_CANDLES or LIGHT_CANDLES_TZEIS
      case 'Candle lighting':
        return ['candles'];
      // YOM_TOV_ENDS
      case 'Havdalah':
        return ['havdalah'];
      // flags.MINOR_FAST or flags.MAJOR_FAST
      case 'Fast begins':
      case 'Fast ends':
        return ['zmanim', 'fast'];
    }
    /* NOTREACHED */
    return ['unknown'];
  }
}

/** Candle lighting before Shabbat or holiday */
export class CandleLightingEvent extends TimedEvent {
  constructor(
    date: HDate,
    mask: number,
    eventTime: Date,
    location: Location,
    linkedEvent?: Event,
    options?: CalOptions
  ) {
    super(
      date,
      'Candle lighting',
      mask,
      eventTime,
      location,
      linkedEvent,
      options
    );
  }

  getEmoji(): string {
    return '🕯️';
  }
}

/** Havdalah after Shabbat or holiday */
export class HavdalahEvent extends TimedEvent {
  private readonly havdalahMins?: number;
  constructor(
    date: HDate,
    mask: number,
    eventTime: Date,
    location: Location,
    havdalahMins?: number,
    linkedEvent?: Event,
    options?: CalOptions
  ) {
    super(date, 'Havdalah', mask, eventTime, location, linkedEvent, options);
    if (havdalahMins) {
      this.havdalahMins = havdalahMins;
    }
  }
  /**
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  render(locale?: string): string {
    return this.renderBrief(locale) + ': ' + this.fmtTime;
  }
  /**
   * Returns translation of "Havdalah" without the time.
   * @param [locale] Optional locale name (defaults to empty locale)
   */
  renderBrief(locale?: string): string {
    let str = Locale.gettext(this.getDesc(), locale);
    if (this.havdalahMins) {
      const min = Locale.gettext('min', locale);
      str += ` (${this.havdalahMins} ${min})`;
    }
    return str;
  }

  getEmoji(): string {
    return '✨';
  }
}
