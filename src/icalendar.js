/* eslint-disable max-len */
// import stream from 'stream';
import {flags} from './event';
import md5 from 'md5';
import leyning from './leyning';
import {gettext} from 'ttag';

const VTIMEZONE = {
  'US/Eastern': 'BEGIN:VTIMEZONE\r\nTZID:US/Eastern\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0500\r\nTZOFFSETFROM:-0400\r\nTZNAME:EST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0400\r\nTZOFFSETFROM:-0500\r\nTZNAME:EDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE',
  'US/Central': 'BEGIN:VTIMEZONE\r\nTZID:US/Central\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0600\r\nTZOFFSETFROM:-0500\r\nTZNAME:CST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0500\r\nTZOFFSETFROM:-0600\r\nTZNAME:CDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE',
  'US/Mountain': 'BEGIN:VTIMEZONE\r\nTZID:US/Mountain\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0600\r\nTZNAME:MST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0600\r\nTZOFFSETFROM:-0700\r\nTZNAME:MDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE',
  'US/Pacific': 'BEGIN:VTIMEZONE\r\nTZID:US/Pacific\r\nX-MICROSOFT-CDO-TZID:13\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE',
  'US/Alaska': 'BEGIN:VTIMEZONE\r\nTZID:US/Alaska\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0900\r\nTZOFFSETFROM:+0000\r\nTZNAME:AKST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0800\r\nTZOFFSETFROM:-0900\r\nTZNAME:AKDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE',
  'US/Hawaii': 'BEGIN:VTIMEZONE\r\nTZID:US/Hawaii\r\nLAST-MODIFIED:20060309T044821Z\r\nBEGIN:DAYLIGHT\r\nDTSTART:19330430T123000\r\nTZOFFSETTO:-0930\r\nTZOFFSETFROM:+0000\r\nTZNAME:HDT\r\nEND:DAYLIGHT\r\nBEGIN:STANDARD\r\nDTSTART:19330521T020000\r\nTZOFFSETTO:-1030\r\nTZOFFSETFROM:-0930\r\nTZNAME:HST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19420209T020000\r\nTZOFFSETTO:-0930\r\nTZOFFSETFROM:-1030\r\nTZNAME:HWT\r\nEND:DAYLIGHT\r\nBEGIN:DAYLIGHT\r\nDTSTART:19450814T133000\r\nTZOFFSETTO:-0930\r\nTZOFFSETFROM:-0930\r\nTZNAME:HPT\r\nEND:DAYLIGHT\r\nBEGIN:STANDARD\r\nDTSTART:19450930T020000\r\nTZOFFSETTO:-1030\r\nTZOFFSETFROM:-0930\r\nTZNAME:HST\r\nEND:STANDARD\r\nBEGIN:STANDARD\r\nDTSTART:19470608T020000\r\nTZOFFSETTO:-1000\r\nTZOFFSETFROM:-1030\r\nTZNAME:HST\r\nEND:STANDARD\r\nEND:VTIMEZONE',
  'US/Aleutian': 'BEGIN:VTIMEZONE\r\nTZID:US/Aleutian\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-1000\r\nTZOFFSETFROM:-0900\r\nTZNAME:HAST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0900\r\nTZOFFSETFROM:-1000\r\nTZNAME:HADT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE',
  'America/Phoenix': 'BEGIN:VTIMEZONE\r\nTZID:America/Phoenix\r\nBEGIN:STANDARD\r\nDTSTART:19700101T000000\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0700\r\nEND:STANDARD\r\nEND:VTIMEZONE',
};

/**
 * @param {string} s
 * @return {string}
 */
function makeAnchor(s) {
  return s.toLowerCase()
      .replace(/'/g, '')
      .replace(/[^\w]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/g, '')
      .replace(/-$/g, '');
}

/**
 * @param {string} desc
 * @return {string}
 */
function getHolidayBasename(desc) {
  if (desc.startsWith('Parashat ')) {
    return desc.substring(9);
  }

  let s = desc
      .replace(/ \d{4}$/, '')
      .replace(/ \(CH''M\)$/, '')
      .replace(/ \(Hoshana Raba\)$/, '');

  if (s != 'Rosh Chodesh Adar II') {
    s = s.replace(/ [IV]+$/, '');
  }

  return s
      .replace(/: \d Candles?$/, '')
      .replace(/: 8th Day$/, '')
      .replace(/^Erev /, '');
}

const NO_URL_FLAGS = flags.USER_EVENT |
    flags.OMER_COUNT |
    flags.SHABBAT_MEVARCHIM |
    flags.DAF_YOMI |
    flags.MOLAD;

/**
 *
 * @param {Event} e
 * @return {string}
 */
function getShortUrl(e) {
  const mask = e.getFlags();
  if (mask & NO_URL_FLAGS) {
    return undefined;
  }
  const desc = e.getDesc();
  if (desc.startsWith('Havdalah') || desc.startsWith('Candle lighting')) {
    return undefined;
  }
  const name = makeAnchor(getHolidayBasename(desc));
  const dir = (mask & flags.PARSHA_HASHAVUA) ? 's' : 'h';
  return `https://hebcal.com/${dir}/${name}`;
}

/**
 * @param {stream.Writable} res
 * @param {...string} str
 */
function icalWriteLine(res, ...str) {
  for (const s of str) {
    res.write(s);
    res.write('\r\n');
  }
}

/**
 *
 * @param {Date} d
 * @return {string}
 */
function formatYYYYMMDD(d) {
  return String(d.getFullYear()).padStart(4, '0') +
        String(d.getMonth() + 1).padStart(2, '0') +
        String(d.getDate()).padStart(2, '0');
}

/**
 * @param {number|string} hour
 * @param {number|string} min
 * @param {number|string} sec
 * @return {string}
 */
function formatTime(hour, min, sec) {
  return String(hour).padStart(2, '0') +
        String(min).padStart(2, '0') +
        String(sec).padStart(2, '0');
}

/**
 * Returns UTC string for iCalendar
 * @param {Date} dt
 * @return {string}
 */
function makeDtstamp(dt) {
  const s = dt.toISOString();
  return s.slice(0, 4) + s.slice(5, 7) + s.slice(8, 13) +
            s.slice(14, 16) + s.slice(17, 19) + 'Z';
}

/**
 *
 * @param {stream.Writable} res
 * @param {Event} e
 * @param {string} dtstamp
 * @param {HebcalOptions} options
 */
function icalWriteEvent(res, e, dtstamp, options) {
  options.dtstamp = dtstamp;
  res.write(eventToIcal(e, options));
}

/**
 * @param {string[]} arr
 * @param {string} key
 * @param {string} val
 */
function addOptional(arr, key, val) {
  if (val) {
    const str = val.replace(/,/g, '\\,').replace(/;/g, '\\;');
    arr.push(key + ':' + str);
  }
}

/**
 *
 * @param {Event} e
 * @param {HebcalOptions} options
 * @return {string} multi-line result, delimited by \r\n
 */
export function eventToIcal(e, options) {
  const dtstamp = options.dtstamp || makeDtstamp(new Date());
  let subj = e.render();
  const desc = e.getDesc(); // original untranslated
  const attrs = e.getAttrs();
  const mask = e.getFlags();
  const timed = Boolean(attrs && attrs.eventTime);
  let location = timed ? options.location.name : undefined;
  if (mask & flags.DAF_YOMI) {
    subj = gettext(desc);
    location = gettext('Daf Yomi');
  }

  // create memo (holiday descr, Torah, etc)
  const url = getShortUrl(e);
  let memo = '';
  if (mask & flags.PARSHA_HASHAVUA) {
    const parshaLeyning = leyning.getLeyningForParshaHaShavua(e, options.il);
    memo = `Torah: ${parshaLeyning.summary}`;
    if (parshaLeyning.reason) {
      for (const num of ['7', '8', 'M']) {
        if (parshaLeyning.reason[num]) {
          const aname = Number(num) ? `${num}th aliyah` : 'Maftir';
          memo += `\\n${aname}: ` +
                        leyning.formatAliyahWithBook(parshaLeyning.fullkriyah[num]) +
                        ' | ' +
                        parshaLeyning.reason[num];
        }
      }
    }
    if (parshaLeyning.haftara) {
      memo += '\\nHaftarah: ' + parshaLeyning.haftara;
    }
    memo += '\\n\\n' + url;
  } else if (url) {
    memo = url;
  }

  const date = formatYYYYMMDD(e.getDate().greg());
  let startDate = date;
  let dtargs; let endDate;
  let transp = 'TRANSPARENT'; let busyStatus = 'FREE';
  if (timed) {
    let [hour, minute] = attrs.eventTimeStr.split(':');
    if (Number(hour) < 12) {
      hour = 12 + Number(hour);
    }
    startDate += 'T' + formatTime(hour, minute, 0);
    endDate = startDate;
    dtargs = `;TZID=${options.location.tzid}`;
    subj = gettext(desc); // replace "Candle lighting: 15:34" with shorter title
  } else {
    endDate = formatYYYYMMDD(e.getDate().next().greg());
    // for all-day untimed, use DTEND;VALUE=DATE intsead of DURATION:P1D.
    // It's more compatible with everthing except ancient versions of
    // Lotus Notes circa 2004
    dtargs = ';VALUE=DATE';
    if (mask & flags.CHAG) {
      transp = 'OPAQUE';
      busyStatus = 'OOF';
    }
  }

  const digest = md5(subj);
  let uid = `hebcal-${date}-${digest}`;
  if (timed && options.location) {
    if (options.location.geoid) {
      uid += `-${options.location.geoid}`;
    } else if (options.location.name) {
      uid += '-' + makeAnchor(options.location.name);
    }
  }

  // make subject safe for iCalendar
  subj = subj.replace(/,/g, '\\,');

  const arr = [
    'BEGIN:VEVENT',
    `DTSTAMP:${dtstamp}`,
    'CATEGORIES:Holiday',
    'CLASS:PUBLIC',
    `SUMMARY:${subj}`,
    `DTSTART${dtargs}:${startDate}`,
    `DTEND${dtargs}:${endDate}`,
    `TRANSP:${transp}`,
    `X-MICROSOFT-CDO-BUSYSTATUS:${busyStatus}`,
    `UID:${uid}`,
  ];

  addOptional(arr, 'DESCRIPTION', memo);
  addOptional(arr, 'LOCATION', location);
  if (options.location) {
    arr.push('GEO:' + options.location.latitude + ';' + options.location.longitude);
  }
  if (url) {
    arr.push(`URL:${url}`); // don't munge [;,]
  }

  let alarm;
  if (e.getFlags() & flags.OMER_COUNT) {
    alarm = '3H'; // 9pm Omer alarm evening before
  } else if (e.getFlags() & flags.USER_EVENT) {
    alarm = '12H'; // noon the day before
  } else if (timed && desc.startsWith('Candle lighting')) {
    alarm = '10M'; // ten minutes
  }
  if (alarm) {
    arr.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        'DESCRIPTION:REMINDER',
        `TRIGGER;RELATED=START:-PT${alarm}`,
        'END:VALARM',
    );
  }

  arr.push('END:VEVENT');

  return arr.join('\r\n');
}

/**
 * @param {stream.Writable} res
 * @param {string} mimeType
 * @param {string} fileName
 */
function exportHttpHeader(res, mimeType, fileName) {
  res.setHeader('Content-Type', `${mimeType}; filename=\"${fileName}\"`);
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.setHeader('Last-Modified', new Date().toUTCString());
}

/**
 *
 * @param {stream.Writable} res
 * @param {Event[]} events
 * @param {string} title
 * @param {HebcalOptions} options
 */
export function icalWriteContents(res, events, title, options) {
  const mimeType = 'text/calendar; charset=UTF-8';
  if (options.subscribe) {
    res.setHeader('Content-Type', mimeType);
  } else {
    const fileName = getDownloadFilename(options) + '.ics';
    exportHttpHeader(res, mimeType, fileName);
  }

  icalWriteLine(res, 'BEGIN:VCALENDAR');
  const location = options.location;
  if (location && location.name) {
    title = location.name + ' ' + title;
  } else if (!options.yahrzeit) {
    title = (options.il ? 'Israel' : 'Diaspora') + ' ' + title;
  }
  title = title
      .replace(/,/g, '\\,')
      .replace(/\s+/g, ' ')
      .trim();

  icalWriteLine(res, 'VERSION:2.0');
  const uclang = (options.locale || 'en').toUpperCase();
  icalWriteLine(res,
      `PRODID:-//hebcal.com/NONSGML Hebcal Calendar v7.0//${uclang}`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-LOTUS-CHARSET:UTF-8',
      'X-PUBLISHED-TTL:PT7D');
  if (title) {
    icalWriteLine(res, `X-WR-CALNAME:Hebcal ${title}`);
  } else {
    icalWriteLine(res, 'X-WR-CALNAME:Hebcal');
  }

  // include an iCal description
  const caldesc = options.yahrzeit ? 'Yahrzeits + Anniversaries from www.hebcal.com' : 'Jewish Holidays from www.hebcal.com';
  icalWriteLine(res, `X-WR-CALDESC:${caldesc}`);

  if (location && location.tzid) {
    icalWriteLine(res, `X-WR-TIMEZONE;VALUE=TEXT:${tzid}`);
    if (VTIMEZONE[tzid]) {
      icalWriteLine(res, VTIMEZONE[tzid]);
    } else {
      // const vtimezoneIcs = `/foo/zoneinfo/${tzid}.ics`;
      // read it from disk
    }
  }

  const dtstamp = makeDtstamp(new Date());
  events.forEach((e) => icalWriteEvent(res, e, dtstamp, options));
  icalWriteLine(res, 'END:VCALENDAR');
}

/**
 * @param {HebcalOptions} options
 * @return {string}
 */
function getDownloadFilename(options) {
  let fileName = 'hebcal_' + options.year;
  if (options.isHebrewYear) {
    fileName += 'H';
  }
  if (options.month) {
    fileName += '_' + options.month;
  }
  if (options.location && options.location.name) {
    fileName += '_' + makeAnchor(options.location.name);
  }
  return fileName;
}

/**
 * Renders an Event as a string
 * @param {Event} e
 * @param {HebcalOptions} options
 * @return {string}
 */
export function eventToCsv(e, options) {
  const d = e.getDate().greg();
  const mday = d.getDate();
  const mon = d.getMonth() + 1;
  const year = String(d.getFullYear()).padStart(4, '0');
  const date = options.euro ? `${mday}/${mon}/${year}` : `${mon}/${mday}/${year}`;

  let subj = e.render();
  let startTime = '';
  let endTime = '';
  let endDate = '';
  let allDay = '"true"';

  const attrs = e.getAttrs();
  const timed = Boolean(attrs && attrs.eventTime);
  if (timed) {
    let [hour, minute] = attrs.eventTimeStr.split(':');
    hour = Number(hour);
    if (hour > 12) {
      hour = hour % 12;
    }
    endTime = startTime = `"${hour}:${minute} PM"`;
    endDate = date;
    allDay = '"false"';
    subj = gettext(e.getDesc()); // replace "Candle lighting: 15:34" with shorter title
  }

  let loc = 'Jewish Holidays';
  const mask = e.getFlags();
  if (timed && options.location && options.location.name) {
    loc = options.location.name;
  } else if (mask & flags.DAF_YOMI) {
    subj = gettext(e.getDesc());
    loc = gettext('Daf Yomi');
  }

  subj = subj.replace(/,/g, '').replace(/"/g, '\'\'');
  const memo = ''; // update this eventually
  //    memo = memo.replace(/,/g, ';').replace(/"/g, "''");

  const showTimeAs = (timed || (mask & flags.CHAG)) ? 4 : 3;
  return `"${subj}",${date},${startTime},${endDate},${endTime},${allDay},"${memo}",${showTimeAs},"${loc}"`;
}

/**
 * @param {stream.Writable} res
 * @param {Event[]} events
 * @param {HebcalOptions} options
 */
export function csvWriteContents(res, events, options) {
  const fileName = getDownloadFilename(options) + '.csv';
  exportHttpHeader(res, 'text/x-csv', fileName);
  res.write('"Subject","Start Date","Start Time","End Date","End Time","All day event","Description","Show time as","Location"\r\n');
  events.forEach((e) => {
    res.write(eventToCsv(e, options));
    res.write('\r\n');
  });
}

export default {
  eventToCsv,
  csvWriteContents,
  eventToIcal,
  icalWriteContents,
};
