import { months } from '@hebcal/hdate';
import { flags } from './event.js';
import { holidayDescs } from './holidayDescs.js';

const Nisan = months.NISAN;
const Iyyar = months.IYYAR;
const Sivan = months.SIVAN;
const Tamuz = months.TAMUZ;
const Av = months.AV;
const Elul = months.ELUL;
const Tishrei = months.TISHREI;
const Cheshvan = months.CHESHVAN;
const Kislev = months.KISLEV;
const Shvat = months.SHVAT;
const Adar2 = months.ADAR_II;

const CHAG = flags.CHAG;
const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
const CHUL_ONLY = flags.CHUL_ONLY;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
const MAJOR_FAST = flags.MAJOR_FAST;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;

const emojiPesach = '🫓';
const emojiSukkot = '🌿🍋';

export const staticHolidays = [
  {
    mm: Tishrei,
    dd: 2,
    desc: holidayDescs.ROSH_HASHANA_II,
    flags: CHAG | YOM_TOV_ENDS,
    emoji: '🍏🍯',
  },
  { mm: Tishrei, dd: 9, desc: holidayDescs.EREV_YOM_KIPPUR, flags: EREV | LIGHT_CANDLES },
  {
    mm: Tishrei,
    dd: 10,
    desc: holidayDescs.YOM_KIPPUR,
    flags: CHAG | MAJOR_FAST | YOM_TOV_ENDS,
  },

  {
    mm: Tishrei,
    dd: 14,
    desc: holidayDescs.EREV_SUKKOT,
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 15,
    desc: holidayDescs.SUKKOT_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 16,
    desc: holidayDescs.SUKKOT_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 17,
    desc: holidayDescs.SUKKOT_III_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 18,
    desc: holidayDescs.SUKKOT_IV_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 19,
    desc: holidayDescs.SUKKO_V_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 20,
    desc: holidayDescs.SUKKOT_VI_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 4,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 22,
    desc: holidayDescs.SHMINI_ATZERET,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
  },
  {
    mm: Tishrei,
    dd: 23,
    desc: holidayDescs.SIMCHAT_TORAH,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
  },

  {
    mm: Tishrei,
    dd: 14,
    desc: holidayDescs.EREV_SUKKOT,
    flags: IL_ONLY | EREV | LIGHT_CANDLES,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 15,
    desc: holidayDescs.SUKKOT_I,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 16,
    desc: holidayDescs.SUKKOT_II,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 17,
    desc: holidayDescs.SUKKOT_III_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 18,
    desc: holidayDescs.SUKKOT_IV_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 19,
    desc: holidayDescs.SUKKOT_V_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 4,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 20,
    desc: holidayDescs.SUKKOT_VI_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 5,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 22,
    desc: holidayDescs.SHMINI_ATZERET,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
  },

  {
    mm: Tishrei,
    dd: 21,
    desc: holidayDescs.SUKKOT_VII_HOSHANA_RABA,
    flags: LIGHT_CANDLES | CHOL_HAMOED,
    chmDay: -1,
    emoji: emojiSukkot,
  },
  {
    mm: Kislev,
    dd: 24,
    desc: holidayDescs.CHANUKAH_1_CANDLE,
    flags: EREV | MINOR_HOLIDAY | CHANUKAH_CANDLES,
    emoji: '🕎1️⃣',
  },
  { mm: Shvat, dd: 15, desc: holidayDescs.TU_BISHVAT, flags: MINOR_HOLIDAY, emoji: '🌳' },
  {
    mm: Adar2,
    dd: 13,
    desc: holidayDescs.EREV_PURIM,
    flags: EREV | MINOR_HOLIDAY,
    emoji: '🎭️📜',
  },
  { mm: Adar2, dd: 14, desc: holidayDescs.PURIM, flags: MINOR_HOLIDAY, emoji: '🎭️📜' },
  {
    mm: Adar2,
    dd: 15,
    desc: holidayDescs.SHUSHAN_PURIM,
    flags: MINOR_HOLIDAY,
    emoji: '🎭️📜',
  },
  // Pesach Israel
  {
    mm: Nisan,
    dd: 14,
    desc: holidayDescs.EREV_PESACH,
    flags: IL_ONLY | EREV | LIGHT_CANDLES,
    emoji: '🫓🍷',
  },
  {
    mm: Nisan,
    dd: 15,
    desc: holidayDescs.PESACH_I,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 16,
    desc: holidayDescs.PESACH_II_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 17,
    desc: holidayDescs.PESACH_III_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 18,
    desc: holidayDescs.PESACH_IV_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 19,
    desc: holidayDescs.PESACH_V_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 4,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 20,
    desc: holidayDescs.PESACH_VI_CHM,
    flags: IL_ONLY | CHOL_HAMOED | LIGHT_CANDLES,
    chmDay: 5,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 21,
    desc: holidayDescs.PESACH_VII,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },
  // Pesach chutz l'aretz
  {
    mm: Nisan,
    dd: 14,
    desc: holidayDescs.EREV_PESACH,
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES,
    emoji: '🫓🍷',
  },
  {
    mm: Nisan,
    dd: 15,
    desc: holidayDescs.PESACH_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: '🫓🍷',
  },
  {
    mm: Nisan,
    dd: 16,
    desc: holidayDescs.PESACH_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 17,
    desc: holidayDescs.PESACH_III_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 18,
    desc: holidayDescs.PESACH_IV_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 19,
    desc: holidayDescs.PESACH_V_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 20,
    desc: holidayDescs.PESACH_VI_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED | LIGHT_CANDLES,
    chmDay: 4,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 21,
    desc: holidayDescs.PESACH_VII,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 22,
    desc: holidayDescs.PESACH_VIII,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },

  { mm: Iyyar, dd: 14, desc: holidayDescs.PESACH_SHENI, flags: MINOR_HOLIDAY },
  { mm: Iyyar, dd: 18, desc: holidayDescs.LAG_BAOMER, flags: MINOR_HOLIDAY, emoji: '🔥' },
  {
    mm: Sivan,
    dd: 5,
    desc: holidayDescs.EREV_SHAVUOT,
    flags: EREV | LIGHT_CANDLES,
    emoji: '⛰️🌸',
  },
  {
    mm: Sivan,
    dd: 6,
    desc: holidayDescs.SHAVUOT,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: '⛰️🌸',
  },
  {
    mm: Sivan,
    dd: 6,
    desc: holidayDescs.SHAVUOT_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: '⛰️🌸',
  },
  {
    mm: Sivan,
    dd: 7,
    desc: holidayDescs.SHAVUOT_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: '⛰️🌸',
  },
  { mm: Av, dd: 15, desc: holidayDescs.TU_BAV, flags: MINOR_HOLIDAY, emoji: '❤️' },
  {
    mm: Elul,
    dd: 1,
    desc: holidayDescs.ROSH_HASHANA_LABEHEMOT,
    flags: MINOR_HOLIDAY,
    emoji: '🐑',
  },
  {
    mm: Elul,
    dd: 29,
    desc: holidayDescs.EREV_ROSH_HASHANA,
    flags: EREV | LIGHT_CANDLES,
    emoji: '🍏🍯',
  },
];

export const staticModernHolidays = [
  { firstYear: 5727, mm: Iyyar, dd: 28, desc: holidayDescs.YOM_YERUSHALAYIM, chul: true },
  {
    firstYear: 5737,
    mm: Kislev,
    dd: 6,
    desc: holidayDescs.BEN_GURION_DAY,
    satPostponeToSun: true,
    friPostponeToSun: true,
  },
  { firstYear: 5750, mm: Shvat, dd: 30, desc: holidayDescs.FAMILY_DAY, chul: true},
  {
    firstYear: 5758,
    mm: Cheshvan,
    dd: 12,
    descAlt: holidayDescs.YITZHAK_RABIN_MEMORIAL_DAY,
    friSatMovetoThu: true,
  },
  {
    firstYear: 5764,
    mm: Iyyar,
    dd: 10,
    desc: holidayDescs.HERZL_DAY,
    satPostponeToSun: true,
  },
  {
    firstYear: 5765,
    mm: Tamuz,
    dd: 29,
    desc: holidayDescs.JABOTINSKY_DAY,
    satPostponeToSun: true,
  },
  {
    firstYear: 5769,
    mm: Cheshvan,
    dd: 29,
    desc: holidayDescs.SIGD,
    chul: true,
    suppressEmoji: true,
  },
  { firstYear: 5777, mm: Nisan, dd: 10, desc: holidayDescs.YOM_HAALIYAH, chul: true },
  {
    firstYear: 5777,
    mm: Cheshvan,
    dd: 7,
    desc: holidayDescs.YOM_HAALIYAH_SCHOOL_OBSERVANCE,
  },
  // https://www.gov.il/he/departments/policies/2012_des5234
  {
    firstYear: 5773,
    mm: months.TEVET,
    dd: 21,
    desc: holidayDescs.HEBREW_LANGUAGE_DAY,
    friSatMovetoThu: true,
  },
];
