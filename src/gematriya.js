const GERESH = '׳';
const GERSHAYIM = '״';

/**
 * @private
 * @param {number} num
 * @return {string}
 */
function num2heb(num) {
  switch (num) {
    case 1: return 'א';
    case 2: return 'ב';
    case 3: return 'ג';
    case 4: return 'ד';
    case 5: return 'ה';
    case 6: return 'ו';
    case 7: return 'ז';
    case 8: return 'ח';
    case 9: return 'ט';
    case 10: return 'י';
    case 20: return 'כ';
    case 30: return 'ל';
    case 40: return 'מ';
    case 50: return 'נ';
    case 60: return 'ס';
    case 70: return 'ע';
    case 80: return 'פ';
    case 90: return 'צ';
    case 100: return 'ק';
    case 200: return 'ר';
    case 300: return 'ש';
    case 400: return 'ת';
    default: return '*INVALID*';
  }
}

/**
 * Converts a numerical value to a string of Hebrew letters
 * @example
 * gematriya(5774) // תשע״ד - cropped to 774
 * @param {number} number
 * @return {string}
 */
export function gematriya(number) {
  let num = parseInt(number, 10);
  if (!num) {
    throw new TypeError(`invalid parameter to gematriya ${number}`);
  }
  const digits = [];
  num = num % 1000;
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
  if (digits.length == 1) {
    return num2heb(digits[0]) + GERESH;
  }
  let str = '';
  for (let i = 0; i < digits.length; i++) {
    if (i + 1 === digits.length) {
      str += GERSHAYIM;
    }
    str += num2heb(digits[i]);
  }
  return str;
}
