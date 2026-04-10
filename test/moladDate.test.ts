/* eslint-disable max-len */
import {expect, test} from 'vitest';
import {months, monthsInYear} from '@hebcal/hdate';
import {calculateMolad} from '../src/moladBase';
import {getMoladAsDate} from '../src/moladDate';
import {Molad} from '../src/molad';

interface ExpectedRecord {
  year: number;
  month: number;
  monthName: string;
  isLeapYear: boolean;
  moladYear: number;
  moladMonth: number;
  moladDay: number;
  moladHours: number;
  moladMinutes: number;
  moladChalakim: number;
  moladGregorianYear: number;
  moladGregorianMonth: number; // 1-based (Java's getGregorianMonth()+1)
  moladGregorianDay: number;
  moladAsDate: string;
  tchilasZmanKidushLevana3Days: string;
  tchilasZmanKidushLevana7Days: string;
  sofZmanKidushLevanaBetweenMoldos: string;
  sofZmanKidushLevana15Days: string;
};

const EXPECTED: Record<string,ExpectedRecord> = {
  // Year 5786 (not a leap year), 12 months starting from Tishrei
  "5786-7": { year: 5786, month: 7, monthName: 'Tishrei', isLeapYear: false, moladYear: 5785, moladMonth: 6, moladDay: 29, moladHours: 12, moladMinutes: 10, moladChalakim: 7, moladGregorianYear: 2025, moladGregorianMonth: 9, moladGregorianDay: 22, moladAsDate: '2025-09-22T09:49:26.837Z', tchilasZmanKidushLevana3Days: '2025-09-25T09:49:26.837Z', tchilasZmanKidushLevana7Days: '2025-09-29T09:49:26.837Z', sofZmanKidushLevanaBetweenMoldos: '2025-10-07T04:11:28.503Z', sofZmanKidushLevana15Days: '2025-10-07T09:49:26.837Z' },
  "5786-8": { year: 5786, month: 8, monthName: 'Cheshvan', isLeapYear: false, moladYear: 5786, moladMonth: 7, moladDay: 30, moladHours: 0, moladMinutes: 54, moladChalakim: 8, moladGregorianYear: 2025, moladGregorianMonth: 10, moladGregorianDay: 22, moladAsDate: '2025-10-21T22:33:30.170Z', tchilasZmanKidushLevana3Days: '2025-10-24T22:33:30.170Z', tchilasZmanKidushLevana7Days: '2025-10-28T22:33:30.170Z', sofZmanKidushLevanaBetweenMoldos: '2025-11-05T16:55:31.836Z', sofZmanKidushLevana15Days: '2025-11-05T22:33:30.170Z' },
  "5786-9": { year: 5786, month: 9, monthName: 'Kislev', isLeapYear: false, moladYear: 5786, moladMonth: 8, moladDay: 29, moladHours: 13, moladMinutes: 38, moladChalakim: 9, moladGregorianYear: 2025, moladGregorianMonth: 11, moladGregorianDay: 20, moladAsDate: '2025-11-20T11:17:33.504Z', tchilasZmanKidushLevana3Days: '2025-11-23T11:17:33.504Z', tchilasZmanKidushLevana7Days: '2025-11-27T11:17:33.504Z', sofZmanKidushLevanaBetweenMoldos: '2025-12-05T05:39:35.170Z', sofZmanKidushLevana15Days: '2025-12-05T11:17:33.504Z' },
  "5786-10": { year: 5786, month: 10, monthName: 'Teves', isLeapYear: false, moladYear: 5786, moladMonth: 9, moladDay: 30, moladHours: 2, moladMinutes: 22, moladChalakim: 10, moladGregorianYear: 2025, moladGregorianMonth: 12, moladGregorianDay: 20, moladAsDate: '2025-12-20T00:01:36.837Z', tchilasZmanKidushLevana3Days: '2025-12-23T00:01:36.837Z', tchilasZmanKidushLevana7Days: '2025-12-27T00:01:36.837Z', sofZmanKidushLevanaBetweenMoldos: '2026-01-03T18:23:38.503Z', sofZmanKidushLevana15Days: '2026-01-04T00:01:36.837Z' },
  "5786-11": { year: 5786, month: 11, monthName: 'Shevat', isLeapYear: false, moladYear: 5786, moladMonth: 10, moladDay: 29, moladHours: 15, moladMinutes: 6, moladChalakim: 11, moladGregorianYear: 2026, moladGregorianMonth: 1, moladGregorianDay: 18, moladAsDate: '2026-01-18T12:45:40.170Z', tchilasZmanKidushLevana3Days: '2026-01-21T12:45:40.170Z', tchilasZmanKidushLevana7Days: '2026-01-25T12:45:40.170Z', sofZmanKidushLevanaBetweenMoldos: '2026-02-02T07:07:41.836Z', sofZmanKidushLevana15Days: '2026-02-02T12:45:40.170Z' },
  "5786-12": { year: 5786, month: 12, monthName: 'Adar', isLeapYear: false, moladYear: 5786, moladMonth: 11, moladDay: 30, moladHours: 3, moladMinutes: 50, moladChalakim: 12, moladGregorianYear: 2026, moladGregorianMonth: 2, moladGregorianDay: 17, moladAsDate: '2026-02-17T01:29:43.504Z', tchilasZmanKidushLevana3Days: '2026-02-20T01:29:43.504Z', tchilasZmanKidushLevana7Days: '2026-02-24T01:29:43.504Z', sofZmanKidushLevanaBetweenMoldos: '2026-03-03T19:51:45.170Z', sofZmanKidushLevana15Days: '2026-03-04T01:29:43.504Z' },
  "5786-1": { year: 5786, month: 1, monthName: 'Nissan', isLeapYear: false, moladYear: 5786, moladMonth: 12, moladDay: 29, moladHours: 16, moladMinutes: 34, moladChalakim: 13, moladGregorianYear: 2026, moladGregorianMonth: 3, moladGregorianDay: 18, moladAsDate: '2026-03-18T14:13:46.837Z', tchilasZmanKidushLevana3Days: '2026-03-21T14:13:46.837Z', tchilasZmanKidushLevana7Days: '2026-03-25T14:13:46.837Z', sofZmanKidushLevanaBetweenMoldos: '2026-04-02T08:35:48.503Z', sofZmanKidushLevana15Days: '2026-04-02T14:13:46.837Z' },
  "5786-2": { year: 5786, month: 2, monthName: 'Iyar', isLeapYear: false, moladYear: 5786, moladMonth: 1, moladDay: 30, moladHours: 5, moladMinutes: 18, moladChalakim: 14, moladGregorianYear: 2026, moladGregorianMonth: 4, moladGregorianDay: 17, moladAsDate: '2026-04-17T02:57:50.170Z', tchilasZmanKidushLevana3Days: '2026-04-20T02:57:50.170Z', tchilasZmanKidushLevana7Days: '2026-04-24T02:57:50.170Z', sofZmanKidushLevanaBetweenMoldos: '2026-05-01T21:19:51.836Z', sofZmanKidushLevana15Days: '2026-05-02T02:57:50.170Z' },
  "5786-3": { year: 5786, month: 3, monthName: 'Sivan', isLeapYear: false, moladYear: 5786, moladMonth: 2, moladDay: 29, moladHours: 18, moladMinutes: 2, moladChalakim: 15, moladGregorianYear: 2026, moladGregorianMonth: 5, moladGregorianDay: 16, moladAsDate: '2026-05-16T15:41:53.504Z', tchilasZmanKidushLevana3Days: '2026-05-19T15:41:53.504Z', tchilasZmanKidushLevana7Days: '2026-05-23T15:41:53.504Z', sofZmanKidushLevanaBetweenMoldos: '2026-05-31T10:03:55.170Z', sofZmanKidushLevana15Days: '2026-05-31T15:41:53.504Z' },
  "5786-4": { year: 5786, month: 4, monthName: 'Tammuz', isLeapYear: false, moladYear: 5786, moladMonth: 3, moladDay: 30, moladHours: 6, moladMinutes: 46, moladChalakim: 16, moladGregorianYear: 2026, moladGregorianMonth: 6, moladGregorianDay: 15, moladAsDate: '2026-06-15T04:25:56.837Z', tchilasZmanKidushLevana3Days: '2026-06-18T04:25:56.837Z', tchilasZmanKidushLevana7Days: '2026-06-22T04:25:56.837Z', sofZmanKidushLevanaBetweenMoldos: '2026-06-29T22:47:58.503Z', sofZmanKidushLevana15Days: '2026-06-30T04:25:56.837Z' },
  "5786-5": { year: 5786, month: 5, monthName: 'Av', isLeapYear: false, moladYear: 5786, moladMonth: 4, moladDay: 29, moladHours: 19, moladMinutes: 30, moladChalakim: 17, moladGregorianYear: 2026, moladGregorianMonth: 7, moladGregorianDay: 14, moladAsDate: '2026-07-14T17:10:00.170Z', tchilasZmanKidushLevana3Days: '2026-07-17T17:10:00.170Z', tchilasZmanKidushLevana7Days: '2026-07-21T17:10:00.170Z', sofZmanKidushLevanaBetweenMoldos: '2026-07-29T11:32:01.836Z', sofZmanKidushLevana15Days: '2026-07-29T17:10:00.170Z' },
  "5786-6": { year: 5786, month: 6, monthName: 'Elul', isLeapYear: false, moladYear: 5786, moladMonth: 5, moladDay: 30, moladHours: 8, moladMinutes: 15, moladChalakim: 0, moladGregorianYear: 2026, moladGregorianMonth: 8, moladGregorianDay: 13, moladAsDate: '2026-08-13T05:54:03.504Z', tchilasZmanKidushLevana3Days: '2026-08-16T05:54:03.504Z', tchilasZmanKidushLevana7Days: '2026-08-20T05:54:03.504Z', sofZmanKidushLevanaBetweenMoldos: '2026-08-28T00:16:05.170Z', sofZmanKidushLevana15Days: '2026-08-28T05:54:03.504Z' },
  // Year 5787 (leap year), 13 months starting from Tishrei
  "5787-7": { year: 5787, month: 7, monthName: 'Tishrei', isLeapYear: true, moladYear: 5786, moladMonth: 6, moladDay: 29, moladHours: 20, moladMinutes: 59, moladChalakim: 1, moladGregorianYear: 2026, moladGregorianMonth: 9, moladGregorianDay: 11, moladAsDate: '2026-09-11T18:38:06.837Z', tchilasZmanKidushLevana3Days: '2026-09-14T18:38:06.837Z', tchilasZmanKidushLevana7Days: '2026-09-18T18:38:06.837Z', sofZmanKidushLevanaBetweenMoldos: '2026-09-26T13:00:08.503Z', sofZmanKidushLevana15Days: '2026-09-26T18:38:06.837Z' },
  "5787-8": { year: 5787, month: 8, monthName: 'Cheshvan', isLeapYear: true, moladYear: 5787, moladMonth: 7, moladDay: 30, moladHours: 9, moladMinutes: 43, moladChalakim: 2, moladGregorianYear: 2026, moladGregorianMonth: 10, moladGregorianDay: 11, moladAsDate: '2026-10-11T07:22:10.170Z', tchilasZmanKidushLevana3Days: '2026-10-14T07:22:10.170Z', tchilasZmanKidushLevana7Days: '2026-10-18T07:22:10.170Z', sofZmanKidushLevanaBetweenMoldos: '2026-10-26T01:44:11.836Z', sofZmanKidushLevana15Days: '2026-10-26T07:22:10.170Z' },
  "5787-9": { year: 5787, month: 9, monthName: 'Kislev', isLeapYear: true, moladYear: 5787, moladMonth: 8, moladDay: 29, moladHours: 22, moladMinutes: 27, moladChalakim: 3, moladGregorianYear: 2026, moladGregorianMonth: 11, moladGregorianDay: 9, moladAsDate: '2026-11-09T20:06:13.504Z', tchilasZmanKidushLevana3Days: '2026-11-12T20:06:13.504Z', tchilasZmanKidushLevana7Days: '2026-11-16T20:06:13.504Z', sofZmanKidushLevanaBetweenMoldos: '2026-11-24T14:28:15.170Z', sofZmanKidushLevana15Days: '2026-11-24T20:06:13.504Z' },
  "5787-10": { year: 5787, month: 10, monthName: 'Teves', isLeapYear: true, moladYear: 5787, moladMonth: 9, moladDay: 29, moladHours: 11, moladMinutes: 11, moladChalakim: 4, moladGregorianYear: 2026, moladGregorianMonth: 12, moladGregorianDay: 9, moladAsDate: '2026-12-09T08:50:16.837Z', tchilasZmanKidushLevana3Days: '2026-12-12T08:50:16.837Z', tchilasZmanKidushLevana7Days: '2026-12-16T08:50:16.837Z', sofZmanKidushLevanaBetweenMoldos: '2026-12-24T03:12:18.503Z', sofZmanKidushLevana15Days: '2026-12-24T08:50:16.837Z' },
  "5787-11": { year: 5787, month: 11, monthName: 'Shevat', isLeapYear: true, moladYear: 5787, moladMonth: 10, moladDay: 28, moladHours: 23, moladMinutes: 55, moladChalakim: 5, moladGregorianYear: 2027, moladGregorianMonth: 1, moladGregorianDay: 7, moladAsDate: '2027-01-07T21:34:20.170Z', tchilasZmanKidushLevana3Days: '2027-01-10T21:34:20.170Z', tchilasZmanKidushLevana7Days: '2027-01-14T21:34:20.170Z', sofZmanKidushLevanaBetweenMoldos: '2027-01-22T15:56:21.836Z', sofZmanKidushLevana15Days: '2027-01-22T21:34:20.170Z' },
  "5787-12": { year: 5787, month: 12, monthName: 'Adar', isLeapYear: true, moladYear: 5787, moladMonth: 11, moladDay: 29, moladHours: 12, moladMinutes: 39, moladChalakim: 6, moladGregorianYear: 2027, moladGregorianMonth: 2, moladGregorianDay: 6, moladAsDate: '2027-02-06T10:18:23.504Z', tchilasZmanKidushLevana3Days: '2027-02-09T10:18:23.504Z', tchilasZmanKidushLevana7Days: '2027-02-13T10:18:23.504Z', sofZmanKidushLevanaBetweenMoldos: '2027-02-21T04:40:25.170Z', sofZmanKidushLevana15Days: '2027-02-21T10:18:23.504Z' },
  "5787-13": { year: 5787, month: 13, monthName: 'Adar II', isLeapYear: true, moladYear: 5787, moladMonth: 12, moladDay: 29, moladHours: 1, moladMinutes: 23, moladChalakim: 7, moladGregorianYear: 2027, moladGregorianMonth: 3, moladGregorianDay: 8, moladAsDate: '2027-03-07T23:02:26.837Z', tchilasZmanKidushLevana3Days: '2027-03-10T23:02:26.837Z', tchilasZmanKidushLevana7Days: '2027-03-14T23:02:26.837Z', sofZmanKidushLevanaBetweenMoldos: '2027-03-22T17:24:28.503Z', sofZmanKidushLevana15Days: '2027-03-22T23:02:26.837Z' },
  "5787-1": { year: 5787, month: 1, monthName: 'Nissan', isLeapYear: true, moladYear: 5787, moladMonth: 13, moladDay: 28, moladHours: 14, moladMinutes: 7, moladChalakim: 8, moladGregorianYear: 2027, moladGregorianMonth: 4, moladGregorianDay: 6, moladAsDate: '2027-04-06T11:46:30.170Z', tchilasZmanKidushLevana3Days: '2027-04-09T11:46:30.170Z', tchilasZmanKidushLevana7Days: '2027-04-13T11:46:30.170Z', sofZmanKidushLevanaBetweenMoldos: '2027-04-21T06:08:31.836Z', sofZmanKidushLevana15Days: '2027-04-21T11:46:30.170Z' },
  "5787-2": { year: 5787, month: 2, monthName: 'Iyar', isLeapYear: true, moladYear: 5787, moladMonth: 1, moladDay: 29, moladHours: 2, moladMinutes: 51, moladChalakim: 9, moladGregorianYear: 2027, moladGregorianMonth: 5, moladGregorianDay: 6, moladAsDate: '2027-05-06T00:30:33.504Z', tchilasZmanKidushLevana3Days: '2027-05-09T00:30:33.504Z', tchilasZmanKidushLevana7Days: '2027-05-13T00:30:33.504Z', sofZmanKidushLevanaBetweenMoldos: '2027-05-20T18:52:35.170Z', sofZmanKidushLevana15Days: '2027-05-21T00:30:33.504Z' },
  "5787-3": { year: 5787, month: 3, monthName: 'Sivan', isLeapYear: true, moladYear: 5787, moladMonth: 2, moladDay: 28, moladHours: 15, moladMinutes: 35, moladChalakim: 10, moladGregorianYear: 2027, moladGregorianMonth: 6, moladGregorianDay: 4, moladAsDate: '2027-06-04T13:14:36.837Z', tchilasZmanKidushLevana3Days: '2027-06-07T13:14:36.837Z', tchilasZmanKidushLevana7Days: '2027-06-11T13:14:36.837Z', sofZmanKidushLevanaBetweenMoldos: '2027-06-19T07:36:38.503Z', sofZmanKidushLevana15Days: '2027-06-19T13:14:36.837Z' },
  "5787-4": { year: 5787, month: 4, monthName: 'Tammuz', isLeapYear: true, moladYear: 5787, moladMonth: 3, moladDay: 29, moladHours: 4, moladMinutes: 19, moladChalakim: 11, moladGregorianYear: 2027, moladGregorianMonth: 7, moladGregorianDay: 4, moladAsDate: '2027-07-04T01:58:40.170Z', tchilasZmanKidushLevana3Days: '2027-07-07T01:58:40.170Z', tchilasZmanKidushLevana7Days: '2027-07-11T01:58:40.170Z', sofZmanKidushLevanaBetweenMoldos: '2027-07-18T20:20:41.836Z', sofZmanKidushLevana15Days: '2027-07-19T01:58:40.170Z' },
  "5787-5": { year: 5787, month: 5, monthName: 'Av', isLeapYear: true, moladYear: 5787, moladMonth: 4, moladDay: 28, moladHours: 17, moladMinutes: 3, moladChalakim: 12, moladGregorianYear: 2027, moladGregorianMonth: 8, moladGregorianDay: 2, moladAsDate: '2027-08-02T14:42:43.504Z', tchilasZmanKidushLevana3Days: '2027-08-05T14:42:43.504Z', tchilasZmanKidushLevana7Days: '2027-08-09T14:42:43.504Z', sofZmanKidushLevanaBetweenMoldos: '2027-08-17T09:04:45.170Z', sofZmanKidushLevana15Days: '2027-08-17T14:42:43.504Z' },
  "5787-6": { year: 5787, month: 6, monthName: 'Elul', isLeapYear: true, moladYear: 5787, moladMonth: 5, moladDay: 29, moladHours: 5, moladMinutes: 47, moladChalakim: 13, moladGregorianYear: 2027, moladGregorianMonth: 9, moladGregorianDay: 1, moladAsDate: '2027-09-01T03:26:46.837Z', tchilasZmanKidushLevana3Days: '2027-09-04T03:26:46.837Z', tchilasZmanKidushLevana7Days: '2027-09-08T03:26:46.837Z', sofZmanKidushLevanaBetweenMoldos: '2027-09-15T21:48:48.503Z', sofZmanKidushLevana15Days: '2027-09-16T03:26:46.837Z' },
};

function padMillis(iso8601: string): string {
  // Temporal.Instant.toString() drops trailing zeros in milliseconds (e.g. 170 → "17"),
  // Pad the fractional-seconds part to 3 digits to match Java's output format.
  return iso8601.replace(/\.(\d{1,3})Z$/, (_, ms) => `.${ms.padEnd(3, '0')}Z`);
}

function toUtcString(zdt: Temporal.ZonedDateTime): string {
  return padMillis(zdt.toInstant().toString());
}

test('molad for years 5786 and 5787 match Java reference output', () => {
  const startYears = [5786, 5787];

  for (const year of startYears) {
    const numMonths = monthsInYear(year);

    for (let month = months.NISAN; month < numMonths; month++) {
      const exp = EXPECTED[`${year}-${month}`];

      const molad = calculateMolad(year, month);
      // console.log(exp);
      // console.log(molad);

      expect(molad.hdate.getFullYear()).toBe(exp.moladYear);
      expect(molad.hdate.getMonth()).toBe(exp.moladMonth);
      expect(molad.hdate.getDate()).toBe(exp.moladDay);
      expect(molad.hour).toBe(exp.moladHours);
      expect(molad.minutes).toBe(exp.moladMinutes);
      expect(molad.chalakim).toBe(exp.moladChalakim);

      const dt = molad.hdate.greg();
      expect(dt.getFullYear()).toBe(exp.moladGregorianYear);
      // JavaScript Date's getMonth() is 0-based; expected data is already +1 (1-based)
      expect(dt.getMonth() + 1).toBe(exp.moladGregorianMonth);
      expect(dt.getDate()).toBe(exp.moladGregorianDay);

      const zdt1 = getMoladAsDate(molad);
      expect(toUtcString(zdt1)).toBe(exp.moladAsDate);
      const m = new Molad(year, month);
      expect(toUtcString(m.getTchilasZmanKidushLevana3Days())).toBe(exp.tchilasZmanKidushLevana3Days);
      expect(toUtcString(m.getTchilasZmanKidushLevana7Days())).toBe(exp.tchilasZmanKidushLevana7Days);
      expect(toUtcString(m.getSofZmanKidushLevanaBetweenMoldos())).toBe(exp.sofZmanKidushLevanaBetweenMoldos);
      expect(toUtcString(m.getSofZmanKidushLevana15Days())).toBe(exp.sofZmanKidushLevana15Days);
    }
  }
});
