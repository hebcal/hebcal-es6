import stream from 'stream';
import { Event, flags } from './holidays';
import Location from './location';
import md5 from 'md5';

/**
 * Options to configure which events are returned
 * @typedef {Object} HebcalOptions
 * @property {Location} location - latitude/longitude/tzid used for candle-lighting
 * @property {number} year - Gregorian or Hebrew year
 * @property {boolean} isHebrewYear - to interpret year as Hebrew year
 * @property {number} month - Gregorian or Hebrew month (to filter results to a single month)
 * @property {number} numYears - generate calendar for multiple years (default 1)
 * @property {boolean} candlelighting - calculate candle-lighting and havdalah times
 * @property {number} candleLightingMins - minutes before sundown to light candles (default 18)
 * @property {number} havdalahMins - minutes after sundown for Havdalah (typical values are 42, 50, or 72)
 * @property {boolean} havdalahTzeit - calculate Havdalah according to Tzeit Hakochavim - Nightfall (the point when 3 small stars are observable in the night time sky with the naked eye). Defaults to `true` unless havdalahMins is specified
 * @property {boolean} sedrot - calculate parashah hashavua on Saturdays
 * @property {boolean} il - Israeli holiday and sedra schedule
 * @property {boolean} noMinorFast - suppress minor fasts
 * @property {boolean} noModern - suppress modern holidays
 * @property {boolean} noRoshChodesh - suppress Rosh Chodesh & Shabbat Mevarchim
 * @property {boolean} noSpecialShabbat - suppress Special Shabbat
 * @property {boolean} noHolidays - suppress regular holidays
 * @property {boolean} dafyomi - include Daf Yomi
 * @property {boolean} omer - include Days of the Omer
 * @property {boolean} molad - include event announcing the molad
 * @property {boolean} ashkenazi - use Ashkenazi transliterations for event titles (default Sephardi transliterations)
 * @property {string} locale - translate event titles according to a locale (one of `fi`, `fr`, `he`, `hu`, `pl`, `ru`, `ashkenazi`, `ashkenazi_litvish`, `ashkenazi_poylish`, `ashkenazi_standard`)
 * @property {boolean} hour12 - use 12-hour time (1-12) instead of default 24-hour time (0-23)
 */

const VTIMEZONE = {
    "US/Eastern": "BEGIN:VTIMEZONE\r\nTZID:US/Eastern\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0500\r\nTZOFFSETFROM:-0400\r\nTZNAME:EST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0400\r\nTZOFFSETFROM:-0500\r\nTZNAME:EDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE",
    "US/Central": "BEGIN:VTIMEZONE\r\nTZID:US/Central\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0600\r\nTZOFFSETFROM:-0500\r\nTZNAME:CST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0500\r\nTZOFFSETFROM:-0600\r\nTZNAME:CDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE",
    "US/Mountain": "BEGIN:VTIMEZONE\r\nTZID:US/Mountain\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0600\r\nTZNAME:MST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0600\r\nTZOFFSETFROM:-0700\r\nTZNAME:MDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE",
    "US/Pacific": "BEGIN:VTIMEZONE\r\nTZID:US/Pacific\r\nX-MICROSOFT-CDO-TZID:13\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETFROM:-0700\r\nTZOFFSETTO:-0800\r\nTZNAME:PST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETFROM:-0800\r\nTZOFFSETTO:-0700\r\nTZNAME:PDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE",
    "US/Alaska": "BEGIN:VTIMEZONE\r\nTZID:US/Alaska\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-0900\r\nTZOFFSETFROM:+0000\r\nTZNAME:AKST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0800\r\nTZOFFSETFROM:-0900\r\nTZNAME:AKDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE",
    "US/Hawaii": "BEGIN:VTIMEZONE\r\nTZID:US/Hawaii\r\nLAST-MODIFIED:20060309T044821Z\r\nBEGIN:DAYLIGHT\r\nDTSTART:19330430T123000\r\nTZOFFSETTO:-0930\r\nTZOFFSETFROM:+0000\r\nTZNAME:HDT\r\nEND:DAYLIGHT\r\nBEGIN:STANDARD\r\nDTSTART:19330521T020000\r\nTZOFFSETTO:-1030\r\nTZOFFSETFROM:-0930\r\nTZNAME:HST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19420209T020000\r\nTZOFFSETTO:-0930\r\nTZOFFSETFROM:-1030\r\nTZNAME:HWT\r\nEND:DAYLIGHT\r\nBEGIN:DAYLIGHT\r\nDTSTART:19450814T133000\r\nTZOFFSETTO:-0930\r\nTZOFFSETFROM:-0930\r\nTZNAME:HPT\r\nEND:DAYLIGHT\r\nBEGIN:STANDARD\r\nDTSTART:19450930T020000\r\nTZOFFSETTO:-1030\r\nTZOFFSETFROM:-0930\r\nTZNAME:HST\r\nEND:STANDARD\r\nBEGIN:STANDARD\r\nDTSTART:19470608T020000\r\nTZOFFSETTO:-1000\r\nTZOFFSETFROM:-1030\r\nTZNAME:HST\r\nEND:STANDARD\r\nEND:VTIMEZONE",
    "US/Aleutian": "BEGIN:VTIMEZONE\r\nTZID:US/Aleutian\r\nBEGIN:STANDARD\r\nDTSTART:19701101T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\nTZOFFSETTO:-1000\r\nTZOFFSETFROM:-0900\r\nTZNAME:HAST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19700308T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\nTZOFFSETTO:-0900\r\nTZOFFSETFROM:-1000\r\nTZNAME:HADT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE",
    "America/Phoenix": "BEGIN:VTIMEZONE\r\nTZID:America/Phoenix\r\nBEGIN:STANDARD\r\nDTSTART:19700101T000000\r\nTZOFFSETTO:-0700\r\nTZOFFSETFROM:-0700\r\nEND:STANDARD\r\nEND:VTIMEZONE",
};

/**
 * @param {string} s 
 * @returns {string}
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
 * @returns {string}
 */
function getHolidayBasename(desc) {
    if (desc.startsWith("Parashat ")) {
        return desc.substring(9);
    }

    let s = desc
        .replace(/ \d{4}$/, '')
        .replace(/ \(CH''M\)$/, '')
        .replace(/ \(Hoshana Raba\)$/, '');
    
    if (s != "Rosh Chodesh Adar II") {
        s = s.replace(/ [IV]+$/, '');
    }

    return s
        .replace(/: \d Candles?$/, '')
        .replace(/: 8th Day$/, '')
        .replace(/^Erev /, '');
}

/**
 * 
 * @param {Event} e 
 * @returns {string}
 */
function getShortUrl(e) {
    if (e.getFlags() & (flags.USER_EVENT | flags.OMER_COUNT | flags.SHABBAT_MEVARCHIM)) {
        return undefined;
    }
    const desc = e.getDesc();
    if (desc.startsWith("Havdalah") || desc.startsWith("Candle lighting")) {
        return undefined;
    }
    const name = makeAnchor(getHolidayBasename(desc));
    if (e.getFlags() & flags.PARSHA_HASHAVUA) {
        return "https://hebcal.com/s/" + name;
    } else {
        return "https://hebcal.com/h/" + name;
    }
}

/**
 * @param {stream.Writable} res
 * @param {...string} str
 */
function icalWriteLine(res, ...str) {
    for (const s of str) {
        res.write(s);
        res.write("\r\n");
    }
}

/**
 * 
 * @param {Date} d 
 * @returns {string}
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
 * @returns {string}
 */
function formatTime(hour, min, sec) {
    return String(hour).padStart(2, '0') +
        String(min).padStart(2, '0') + 
        String(sec).padStart(2, '0');
}

/**
 * Returns UTC string for iCalendar
 * @param {Date} dt 
 * @returns {string}
 */
function makeDtstamp(dt) {
    const s = dt.toISOString();
    return s.slice(0,4) + s.slice(5, 7) + s.slice(8,13) +
            s.slice(14,16) + s.slice(17,19) + 'Z';
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
 * @returns {string} multi-line result, delimited by \r\n
 */
export function eventToIcal(e, options) {
    const dtstamp = options.dtstamp || makeDtstamp(new Date());
    let subj = e.render();
    const desc = e.getDesc(); // original untranslated
    const attrs = e.getAttrs();
    const mask = e.getFlags();
    const untimed = !attrs || !attrs.eventTime;
    let location = untimed ? undefined : options.location.name;
    if (mask & flags.DAF_YOMI) {
        subj = subj.substring(subj.indexOf(':') + 1);
        location = 'Daf Yomi';
    }

    // create memo (holiday descr, Torah, etc)
    const url = getShortUrl(e);
    let memo = '';

    const date = formatYYYYMMDD(e.getDate().greg());
    let startDate = date;
    let dtargs, endDate;
    let transp = 'TRANSPARENT', busyStatus = 'FREE';
    if (untimed) {
        endDate = formatYYYYMMDD(e.getDate().next().greg());
        // for all-day untimed, use DTEND;VALUE=DATE intsead of DURATION:P1D.
        // It's more compatible with everthing except ancient versions of
        // Lotus Notes circa 2004
        dtargs = ';VALUE=DATE';
        if (mask & flags.CHAG) {
            transp = 'OPAQUE';
            busyStatus = 'OOF';
        }
    } else {
        let [hour,minute] = attrs.eventTimeStr.split(':');        
        if (Number(hour) < 12) {
            hour = 12 + Number(hour);
        }
        startDate += 'T' + formatTime(hour, minute, 0);
        endDate = startDate;
        dtargs = `;TZID=${options.location.tzid}`;
    }

    const digest = md5(subj);
    let uid = `hebcal-${date}-${digest}`;
    if (!untimed && options.location) {
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
        `UID:${uid}`
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
    } else if (!untimed && desc.startsWith("Candle lighting")) {
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

    return arr.join("\r\n");
}

/**
 * 
 * @param {stream.Writable} res 
 * @param {Event[]} events 
 * @param {string} title
 * @param {HebcalOptions} options
 */
export function icalWriteContents(res, events, title, options) {
    if (options.icalendar) {
        const mimeType = "text/calendar; charset=UTF-8";
        if (options.subscribe) {
            res.setHeader('Content-Type', mimeType);
        } else {
            res.setHeader('Content-Type', "${mimeType}; filename=\"${fileName}\"");
            res.setHeader('Content-Disposition', "attachment; filename=${fileName}");
            res.setHeader('Last-Modified', new Date().toUTCString());
        }
    }

    icalWriteLine(res, "BEGIN:VCALENDAR");
    if (!options.icalendar) {
        icalWriteLine(res, "VERSION:1.0", "METHOD:PUBLISH");
    } else {
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

        icalWriteLine(res, "VERSION:2.0");
        const uclang = (options.locale || "en").toUpperCase();
        icalWriteLine(res,
            "PRODID:-//hebcal.com/NONSGML Hebcal Calendar v7.0//${uclang}",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "X-LOTUS-CHARSET:UTF-8",
            "X-PUBLISHED-TTL:PT7D");
        if (title) {
            icalWriteLine(res, `X-WR-CALNAME:Hebcal ${title}`);
        } else {
            icalWriteLine(res, "X-WR-CALNAME:Hebcal");
        }

        // include an iCal description
        const caldesc = options.yahrzeit ? "Yahrzeits + Anniversaries from www.hebcal.com" : "Jewish Holidays from www.hebcal.com";
        icalWriteLine(res, `X-WR-CALDESC:${caldesc}`);

        if (location && location.tzid) {
            icalWriteLine(res, `X-WR-TIMEZONE;VALUE=TEXT:${tzid}`);
            if (VTIMEZONE[tzid]) {
                icalWriteLine(res, VTIMEZONE[tzid]);
            } else {
                const vtimezoneIcs = `/foo/zoneinfo/${tzid}.ics`;
                // read it from disk
            }
        }
    }

    const dtstamp = makeDtstamp(new Date());
    events.forEach(e => icalWriteEvent(res, e, dtstamp, options));
    icalWriteLine(res, "END:VCALENDAR");
}


export default {
    eventToIcal,
    icalWriteContents
};
