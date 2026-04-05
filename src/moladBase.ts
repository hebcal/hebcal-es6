import {HDate, isLeapYear} from '@hebcal/hdate';

/**
 * Represents a molad, the moment when the new moon is "born"
 */
export type MoladBase = {
  /** Hebrew date */
  readonly hdate: HDate;
  /** hour of day (0-23) */
  readonly hour: number;
  /** minutes past hour (0-59) */
  readonly minutes: number;
  /** parts of a minute (0-17) */
  readonly chalakim: number;
};

/*
 * Includes code ported from KosherJava, copyright 2004 Eliyahu Hershfeld,
 * released under LGPL 2.1.
 */

/**
 * the Jewish epoch using the RD (Rata Die/Fixed Date or Reingold Dershowitz) day used in Calendrical Calculations.
 * Day 1 is January 1, 0001 of the Gregorian calendar
 */
const JEWISH_EPOCH: number = -1373429;

/** The number of _chalakim_ (18) in a minute. */
const CHALAKIM_PER_MINUTE: number = 18;

/** The number of _chalakim_ (1080) in an hour. */
const CHALAKIM_PER_HOUR: number = 1080;

/** The number of _chalakim_ (25,920) in a 24-hour day. */
const CHALAKIM_PER_DAY: number = 25920; // 24 * 1080

/** The number of _chalakim_ in an average Jewish month. A month has 29 days, 12 hours and 793
 * _chalakim_ (44 minutes and 3.3 seconds) for a total of 765,433 _chalakim_ */
const CHALAKIM_PER_MONTH: number = 765433; // (29 * 24 + 12) * 1080 + 793

/**
 * Days from the beginning of Sunday till _molad BaHaRaD_. Calculated as 1 day, 5 hours and 204 _chalakim_ =
 * (24 + 5) * 1080 + 204 = 31524
 */
const CHALAKIM_MOLAD_TOHU: number = 31524;

/**
 * Converts the NISSAN-based constants used by this class to numeric month starting from
 * TISHREI. This is required for _molad_ calculations.
 */
function getJewishMonthOfYear(year: number, month: number): number {
  const leap: boolean = isLeapYear(year);
  return ((month + (leap ? 6 : 5)) % (leap ? 13 : 12)) + 1;
}

/**
 * Returns the number of _chalakim_ (parts - 1080 to the hour) from
 * the original hypothetical _Molad Tohu_ to the year and month
 * passed in.
 */
function getChalakimSinceMoladTohu(year: number, month: number): number {
  // Jewish lunar month = 29 days, 12 hours and 793 chalakim
  // chalakim since Molad Tohu BeHaRaD - 1 day, 5 hours and 204 chalakim
  const monthOfYear: number = getJewishMonthOfYear(year, month);
  const monthsElapsed: number =
    235 * Math.trunc((year - 1) / 19) + // Months in complete 19-year lunar (Metonic) cycles so far
    12 * ((year - 1) % 19) + // Regular months in this cycle
    Math.trunc((7 * ((year - 1) % 19) + 1) / 19) + // Leap months this cycle
    (monthOfYear - 1); // add elapsed months till the start of the molad of the month
  // return chalakim prior to BeHaRaD + number of chalakim since
  return CHALAKIM_MOLAD_TOHU + CHALAKIM_PER_MONTH * monthsElapsed;
}

/**
 * Returns the number of days from the Jewish epoch from the number of chalakim from the epoch passed in.
 * @param chalakim the number of _chalakim_ since the beginning of Sunday prior to BaHaRaD
 * @return the number of days from the Jewish epoch
 */
function moladToAbsDate(chalakim: number): number {
  return Math.trunc(chalakim / CHALAKIM_PER_DAY) + JEWISH_EPOCH;
}

export function calculateMolad(year: number, month: number): MoladBase {
  const chalakim = getChalakimSinceMoladTohu(year, month);
  const absDate = moladToAbsDate(chalakim);
  let hd = new HDate(absDate);
  const conjunctionDay: number = Math.trunc(chalakim / CHALAKIM_PER_DAY);
  const conjunctionParts: number = Math.trunc(
    chalakim - conjunctionDay * CHALAKIM_PER_DAY
  );

  let adjustedChalakim: number = conjunctionParts;
  let hour = Math.trunc(adjustedChalakim / CHALAKIM_PER_HOUR);
  adjustedChalakim = adjustedChalakim - hour * CHALAKIM_PER_HOUR;
  const minutes = Math.trunc(adjustedChalakim / CHALAKIM_PER_MINUTE);

  if (hour >= 6) {
    hd = hd.next();
  }
  hour = (hour + 18) % 24;

  const m: MoladBase = {
    hdate: hd,
    hour,
    minutes,
    chalakim: adjustedChalakim - minutes * CHALAKIM_PER_MINUTE,
  };

  return m;
}
