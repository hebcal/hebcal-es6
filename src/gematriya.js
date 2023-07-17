const GERESH = '׳';
const GERSHAYIM = '״';

const heb2num = {
  'א': 1,
  'ב': 2,
  'ג': 3,
  'ד': 4,
  'ה': 5,
  'ו': 6,
  'ז': 7,
  'ח': 8,
  'ט': 9,
  'י': 10,
  'כ': 20,
  'ל': 30,
  'מ': 40,
  'נ': 50,
  'ס': 60,
  'ע': 70,
  'פ': 80,
  'צ': 90,
  'ק': 100,
  'ר': 200,
  'ש': 300,
  'ת': 400,
};
const num2heb = {};
Object.keys(heb2num).forEach((key) => {
  const val = heb2num[key];
  num2heb[val] = key;
});

/**
 * @private
 * @param {number} num
 * @return {number[]}
 */
function num2digits(num) {
  const digits = [];
  while (num > 0) {
    if (num === 15 || num === 16) {
      digits.push(9);
      digits.push(num - 9);
      break;
    }
    let incr = 100;
    let i;
    for (i = 400; i > num; i -= incr) {
      if (i === incr) {
        incr = incr / 10;
      }
    }
    digits.push(i);
    num -= i;
  }
  return digits;
}

/**
 * Converts a numerical value to a string of Hebrew letters.
 *
 * When specifying years of the Hebrew calendar in the present millennium,
 * we omit the thousands (which is presently 5 [ה]).
 * @example
 * gematriya(5774) // 'תשע״ד' - cropped to 774
 * gematriya(25) // 'כ״ה'
 * gematriya(60) // 'ס׳'
 * gematriya(3761) // 'ג׳תשס״א'
 * gematriya(1123) // 'א׳קכ״ג'
 * @param {number} number
 * @return {string}
 */
export function gematriya(number) {
  const num = parseInt(number, 10);
  if (!num) {
    throw new TypeError(`invalid parameter to gematriya ${number}`);
  }
  let str = '';
  const thousands = Math.floor(num / 1000);
  if (thousands > 0 && thousands !== 5) {
    const tdigits = num2digits(thousands);
    for (let i = 0; i < tdigits.length; i++) {
      str += num2heb[tdigits[i]];
    }
    str += GERESH;
  }
  const digits = num2digits(num % 1000);
  if (digits.length == 1) {
    return str + num2heb[digits[0]] + GERESH;
  }
  for (let i = 0; i < digits.length; i++) {
    if (i + 1 === digits.length) {
      str += GERSHAYIM;
    }
    str += num2heb[digits[i]];
  }
  return str;
}

/**
 * Converts a string of Hebrew letters to a numerical value.
 *
 * Only considers the value of Hebrew letters `א` through `ת`.
 * Ignores final Hebrew letters such as `ך` (kaf sofit) or `ם` (mem sofit)
 * and vowels (nekudot).
 *
 * @param {string} str
 * @return {number}
 */
export function gematriyaStrToNum(str) {
  let num = 0;
  const gereshIdx = str.indexOf(GERESH);
  if (gereshIdx !== -1 && gereshIdx !== str.length - 1) {
    const thousands = str.substring(0, gereshIdx);
    num += gematriyaStrToNum(thousands) * 1000;
    str = str.substring(gereshIdx);
  }
  for (let i = 0; i < str.length; i++) {
    const n = heb2num[str[i]];
    if (typeof n === 'number') {
      num += n;
    }
  }
  return num;
}
