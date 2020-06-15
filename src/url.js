import {flags} from './event';

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

/**
 * @param {string} desc
 * @return {string}
 */
export function getHolidayBasename(desc) {
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
    flags.MOLAD;

const dafYomiSefaria = {
  'Berachot': 'Berakhot',
  'Rosh Hashana': 'Rosh Hashanah',
  'Gitin': 'Gittin',
  'Baba Kamma': 'Bava Kamma',
  'Baba Metzia': 'Bava Metzia',
  'Baba Batra': 'Bava Batra',
  'Bechorot': 'Bekhorot',
  'Arachin': 'Arakhin',
  'Midot': 'Middot',
};

/**
 * @param {Event} e
 * @param {string} hostname
 * @param {string[]} dirs
 * @return {string}
 */
function getUrlInternal(e, hostname, dirs) {
  const mask = e.getFlags();
  if (mask & NO_URL_FLAGS) {
    return undefined;
  } else if (mask & flags.DAF_YOMI) {
    const tractate = e.getAttrs().dafyomi.name;
    const blatt = e.getAttrs().dafyomi.blatt;
    if (tractate == 'Kinnim' || tractate == 'Midot') {
      return `https://www.dafyomi.org/index.php?masechta=meilah&daf=${blatt}a`;
    } else {
      const name0 = dafYomiSefaria[tractate] || tractate;
      const name = name0.replace(/ /g, '_');
      return `https://www.sefaria.org/${name}.${blatt}a?lang=bi`;
    }
  }
  const desc = e.getDesc();
  if (desc.startsWith('Havdalah') || desc.startsWith('Candle lighting')) {
    return undefined;
  }
  const name = makeAnchor(getHolidayBasename(desc));
  const dir = dirs[(mask & flags.PARSHA_HASHAVUA) ? 0 : 1];
  return `https://${hostname}/${dir}/${name}`;
}


/**
 * Gets a short redirector URL for hebcal.com
 * @param {Event} e
 * @return {string}
 */
export function getShortUrl(e) {
  return getUrlInternal(e, 'hebcal.com', ['s', 'h']);
}

/**
 * Gets a regular (long, non-redirector) URL for hebcal.com
 * @param {Event} e
 * @return {string}
 */
export function getEventUrl(e) {
  return getUrlInternal(e, 'www.hebcal.com', ['sedrot', 'holidays']);
}
