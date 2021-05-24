const _formatters = {};

/**
 * @private
 * @param {string} tzid
 * @return {Intl.DateTimeFormat}
 */
function getFormatter(tzid) {
  const fmt = _formatters[tzid];
  if (fmt) return fmt;
  const f = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: tzid,
  });
  _formatters[tzid] = f;
  return f;
}

const dateFormatRegex = /^(\d+).(\d+).(\d+),?\s+(\d+).(\d+).(\d+)/;

/**
 * @private
 * @param {string} tzid
 * @param {Date} date
 * @return {string}
 */
export function getPseudoISO(tzid, date) {
  const str = getFormatter(tzid).format(date);
  const m = dateFormatRegex.exec(str);
  let hour = m[4];
  if (hour == '24') hour = '00';
  m[3] = pad4(m[3]);
  return `${m[3]}-${m[1]}-${m[2]}T${hour}:${m[5]}:${m[6]}Z`;
}

/**
 * @private
 * @param {string} tzid
 * @param {Date} date
 * @return {number}
 */
export function getTimezoneOffset(tzid, date) {
  const utcStr = getPseudoISO('UTC', date);
  const localStr = getPseudoISO(tzid, date);
  const diffMs = new Date(utcStr).getTime() - new Date(localStr).getTime();
  return Math.ceil(diffMs / 1000 / 60);
}

/**
 * @private
 * @param {number} number
 * @return {string}
 */
function pad4(number) {
  if (number < 0) {
    return '-00' + pad4(-number);
  } else if (number < 10) {
    return '000' + number;
  } else if (number < 100) {
    return '00' + number;
  } else if (number < 1000) {
    return '0' + number;
  }
  return String(number);
}
