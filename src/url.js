/**
 * Helper function to format a 23-hour (00:00-23:59) time in US format ("8:13pm") or
 * keep as "20:13" for any other locale/country. Uses `HebcalOptions` to determine
 * locale.
 * @private
 * @param {string} timeStr - original time like "20:30"
 * @param {string} suffix - "p" or "pm" or " P.M.". Add leading space if you want it
 * @param {HebcalOptions} options
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
 * Helper function to transform a string to make it more usable in a URL or filename.
 * Converts to lowercase and replaces non-word characters with hyphen ('-').
 * @example
 * hebcal.makeAnchor('Rosh Chodesh Adar II') // 'rosh-chodesh-adar-ii'
 * @private
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
