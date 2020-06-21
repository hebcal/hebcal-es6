/**
 * Returns "8:13p" for US or "20:13" for any other locale/country
 * @param {string} timeStr - original time like "20:30"
 * @param {string} suffix - "p" or "pm" or " P.M.". Add leading space if you want it
 * @param {Object} options
 * @return {string}
 */
export function reformatTimeStr(timeStr, suffix, options) {
  const cc = (options.location && options.location.cc) || (options.il ? 'IL' : 'US');
  if ((options.locale && options.locale.length == 2) || cc != 'US') {
    return timeStr;
  }
  let [hour, minute] = timeStr.split(':');
  hour = Number(hour);
  if (hour > 12) {
    hour = hour % 12;
  }
  return `${hour}:${minute}${suffix}`;
}

/**
 * @param {string} s
 * @return {string}
 */
export function makeAnchor(s) {
  return s.toLowerCase()
      .replace(/'/g, '')
      .replace(/[^\w]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/g, '')
      .replace(/-$/g, '');
}
