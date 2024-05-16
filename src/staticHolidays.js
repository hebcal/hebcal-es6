import {months} from '@hebcal/hdate';
import {flags} from './event.js';

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

const ROSH_HASHANA_II = 'Rosh Hashana II';
const EREV_YOM_KIPPUR = 'Erev Yom Kippur';
const YOM_KIPPUR = 'Yom Kippur';
const EREV_SUKKOT = 'Erev Sukkot';
const SUKKOT_I = 'Sukkot I';
const SUKKOT_II = 'Sukkot II';
const SUKKOT_III_CHM = 'Sukkot III (CH\'\'M)';
const SUKKOT_IV_CHM = 'Sukkot IV (CH\'\'M)';
const SUKKOT_V_CHM = 'Sukkot V (CH\'\'M)';
const SUKKOT_VI_CHM = 'Sukkot VI (CH\'\'M)';
const SHMINI_ATZERET = 'Shmini Atzeret';
const SIMCHAT_TORAH = 'Simchat Torah';
const SUKKOT_II_CHM = 'Sukkot II (CH\'\'M)';
const SUKKOT_VII_HOSHANA_RABA = 'Sukkot VII (Hoshana Raba)';
const CHANUKAH_1_CANDLE = 'Chanukah: 1 Candle';
const TU_BISHVAT = 'Tu BiShvat';
const EREV_PURIM = 'Erev Purim';
const PURIM = 'Purim';
const SHUSHAN_PURIM = 'Shushan Purim';
const EREV_PESACH = 'Erev Pesach';
const PESACH_I = 'Pesach I';
const PESACH_II = 'Pesach II';
const PESACH_II_CHM = 'Pesach II (CH\'\'M)';
const PESACH_III_CHM = 'Pesach III (CH\'\'M)';
const PESACH_IV_CHM = 'Pesach IV (CH\'\'M)';
const PESACH_V_CHM = 'Pesach V (CH\'\'M)';
const PESACH_VI_CHM = 'Pesach VI (CH\'\'M)';
const PESACH_VII = 'Pesach VII';
const PESACH_VIII = 'Pesach VIII';
const PESACH_SHENI = 'Pesach Sheni';
const LAG_BAOMER = 'Lag BaOmer';
const EREV_SHAVUOT = 'Erev Shavuot';
const SHAVUOT = 'Shavuot';
const SHAVUOT_I = 'Shavuot I';
const SHAVUOT_II = 'Shavuot II';
const TU_BAV = 'Tu B\'Av';
const ROSH_HASHANA_LABEHEMOT = 'Rosh Hashana LaBehemot';
const EREV_ROSH_HASHANA = 'Erev Rosh Hashana';
const YOM_YERUSHALAYIM = 'Yom Yerushalayim';
const BEN_GURION_DAY = 'Ben-Gurion Day';
const FAMILY_DAY = 'Family Day';
const YITZHAK_RABIN_MEMORIAL_DAY = 'Yitzhak Rabin Memorial Day';
const HERZL_DAY = 'Herzl Day';
const JABOTINSKY_DAY = 'Jabotinsky Day';
const SIGD = 'Sigd';
const YOM_HAALIYAH = 'Yom HaAliyah';
const YOM_HAALIYAH_SCHOOL_OBSERVANCE = 'Yom HaAliyah School Observance';
const HEBREW_LANGUAGE_DAY = 'Hebrew Language Day';

export const holidayDesc = {
  ROSH_HASHANA_II,
  EREV_YOM_KIPPUR,
  YOM_KIPPUR,
  EREV_SUKKOT,
  SUKKOT_I,
  SUKKOT_II,
  SUKKOT_III_CHM,
  SUKKOT_IV_CHM,
  SUKKOT_V_CHM,
  SUKKOT_VI_CHM,
  SHMINI_ATZERET,
  SIMCHAT_TORAH,
  SUKKOT_II_CHM,
  SUKKOT_VII_HOSHANA_RABA,
  CHANUKAH_1_CANDLE,
  TU_BISHVAT,
  EREV_PURIM,
  PURIM,
  SHUSHAN_PURIM,
  EREV_PESACH,
  PESACH_I,
  PESACH_II,
  PESACH_II_CHM,
  PESACH_III_CHM,
  PESACH_IV_CHM,
  PESACH_V_CHM,
  PESACH_VI_CHM,
  PESACH_VII,
  PESACH_VIII,
  PESACH_SHENI,
  LAG_BAOMER,
  EREV_SHAVUOT,
  SHAVUOT,
  SHAVUOT_I,
  SHAVUOT_II,
  TU_BAV,
  ROSH_HASHANA_LABEHEMOT,
  EREV_ROSH_HASHANA,
  YOM_YERUSHALAYIM,
  BEN_GURION_DAY,
  FAMILY_DAY,
  YITZHAK_RABIN_MEMORIAL_DAY,
  HERZL_DAY,
  JABOTINSKY_DAY,
  SIGD,
  YOM_HAALIYAH,
  YOM_HAALIYAH_SCHOOL_OBSERVANCE,
  HEBREW_LANGUAGE_DAY,
};

export const staticHolidays = [
  {mm: Tishrei, dd: 2, desc: ROSH_HASHANA_II, flags: CHAG | YOM_TOV_ENDS, emoji: '🍏🍯'},
  {mm: Tishrei, dd: 9, desc: EREV_YOM_KIPPUR, flags: EREV | LIGHT_CANDLES},
  {mm: Tishrei, dd: 10, desc: YOM_KIPPUR, flags: CHAG | MAJOR_FAST | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 14, desc: EREV_SUKKOT, flags: CHUL_ONLY | EREV | LIGHT_CANDLES, emoji: emojiSukkot},
  {mm: Tishrei, dd: 15, desc: SUKKOT_I, flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 16, desc: SUKKOT_II, flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 17, desc: SUKKOT_III_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiSukkot},
  {mm: Tishrei, dd: 18, desc: SUKKOT_IV_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiSukkot},
  {mm: Tishrei, dd: 19, desc: SUKKOT_V_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiSukkot},
  {mm: Tishrei, dd: 20, desc: SUKKOT_VI_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiSukkot},
  {mm: Tishrei, dd: 22, desc: SHMINI_ATZERET,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS},
  {mm: Tishrei, dd: 23, desc: SIMCHAT_TORAH,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 14, desc: EREV_SUKKOT, flags: IL_ONLY | EREV | LIGHT_CANDLES, emoji: emojiSukkot},
  {mm: Tishrei, dd: 15, desc: SUKKOT_I, flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 16, desc: SUKKOT_II_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiSukkot},
  {mm: Tishrei, dd: 17, desc: SUKKOT_III_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiSukkot},
  {mm: Tishrei, dd: 18, desc: SUKKOT_IV_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiSukkot},
  {mm: Tishrei, dd: 19, desc: SUKKOT_V_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiSukkot},
  {mm: Tishrei, dd: 20, desc: SUKKOT_VI_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 5, emoji: emojiSukkot},
  {mm: Tishrei, dd: 22, desc: SHMINI_ATZERET,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 21, desc: SUKKOT_VII_HOSHANA_RABA,
    flags: LIGHT_CANDLES | CHOL_HAMOED, chmDay: -1, emoji: emojiSukkot},
  {mm: Kislev, dd: 24, desc: CHANUKAH_1_CANDLE,
    flags: EREV | MINOR_HOLIDAY | CHANUKAH_CANDLES, emoji: '🕎1️⃣'},
  {mm: Shvat, dd: 15, desc: TU_BISHVAT, flags: MINOR_HOLIDAY, emoji: '🌳'},
  {mm: Adar2, dd: 13, desc: EREV_PURIM, flags: EREV | MINOR_HOLIDAY, emoji: '🎭️📜'},
  {mm: Adar2, dd: 14, desc: PURIM, flags: MINOR_HOLIDAY, emoji: '🎭️📜'},
  {mm: Adar2, dd: 15, desc: SHUSHAN_PURIM, flags: MINOR_HOLIDAY, emoji: '🎭️📜'},
  // Pesach Israel
  {mm: Nisan, dd: 14, desc: EREV_PESACH,
    flags: IL_ONLY | EREV | LIGHT_CANDLES, emoji: '🫓🍷'},
  {mm: Nisan, dd: 15, desc: PESACH_I,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  {mm: Nisan, dd: 16, desc: PESACH_II_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiPesach},
  {mm: Nisan, dd: 17, desc: PESACH_III_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiPesach},
  {mm: Nisan, dd: 18, desc: PESACH_IV_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiPesach},
  {mm: Nisan, dd: 19, desc: PESACH_V_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiPesach},
  {mm: Nisan, dd: 20, desc: PESACH_VI_CHM,
    flags: IL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, chmDay: 5, emoji: emojiPesach},
  {mm: Nisan, dd: 21, desc: PESACH_VII,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  // Pesach chutz l'aretz
  {mm: Nisan, dd: 14, desc: EREV_PESACH,
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES, emoji: '🫓🍷'},
  {mm: Nisan, dd: 15, desc: PESACH_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: '🫓🍷'},
  {mm: Nisan, dd: 16, desc: PESACH_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  {mm: Nisan, dd: 17, desc: PESACH_III_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiPesach},
  {mm: Nisan, dd: 18, desc: PESACH_IV_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiPesach},
  {mm: Nisan, dd: 19, desc: PESACH_V_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiPesach},
  {mm: Nisan, dd: 20, desc: PESACH_VI_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, chmDay: 4, emoji: emojiPesach},
  {mm: Nisan, dd: 21, desc: PESACH_VII,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: emojiPesach},
  {mm: Nisan, dd: 22, desc: PESACH_VIII,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},

  {mm: Iyyar, dd: 14, desc: PESACH_SHENI, flags: MINOR_HOLIDAY},
  {mm: Iyyar, dd: 18, desc: LAG_BAOMER, flags: MINOR_HOLIDAY, emoji: '🔥'},
  {mm: Sivan, dd: 5, desc: EREV_SHAVUOT,
    flags: EREV | LIGHT_CANDLES, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 6, desc: SHAVUOT,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 6, desc: SHAVUOT_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 7, desc: SHAVUOT_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: '⛰️🌸'},
  {mm: Av, dd: 15, desc: TU_BAV,
    flags: MINOR_HOLIDAY, emoji: '❤️'},
  {mm: Elul, dd: 1, desc: ROSH_HASHANA_LABEHEMOT,
    flags: MINOR_HOLIDAY, emoji: '🐑'},
  {mm: Elul, dd: 29, desc: EREV_ROSH_HASHANA,
    flags: EREV | LIGHT_CANDLES, emoji: '🍏🍯'},
];

export const staticModernHolidays = [
  {firstYear: 5727, mm: Iyyar, dd: 28, desc: YOM_YERUSHALAYIM,
    chul: true},
  {firstYear: 5737, mm: Kislev, dd: 6, desc: BEN_GURION_DAY,
    satPostponeToSun: true, friPostponeToSun: true},
  {firstYear: 5750, mm: Shvat, dd: 30, desc: FAMILY_DAY},
  {firstYear: 5758, mm: Cheshvan, dd: 12, desc: YITZHAK_RABIN_MEMORIAL_DAY,
    friSatMovetoThu: true},
  {firstYear: 5764, mm: Iyyar, dd: 10, desc: HERZL_DAY,
    satPostponeToSun: true},
  {firstYear: 5765, mm: Tamuz, dd: 29, desc: JABOTINSKY_DAY,
    satPostponeToSun: true},
  {firstYear: 5769, mm: Cheshvan, dd: 29, desc: SIGD,
    chul: true, suppressEmoji: true},
  {firstYear: 5777, mm: Nisan, dd: 10, desc: YOM_HAALIYAH,
    chul: true},
  {firstYear: 5777, mm: Cheshvan, dd: 7, desc: YOM_HAALIYAH_SCHOOL_OBSERVANCE},
  // https://www.gov.il/he/departments/policies/2012_des5234
  {firstYear: 5773, mm: months.TEVET, dd: 21, desc: HEBREW_LANGUAGE_DAY,
    friSatMovetoThu: true},
];
