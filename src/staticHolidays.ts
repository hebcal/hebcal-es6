import {months} from '@hebcal/hdate';
import {flags} from './event';

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
const SUKKOT_III_CHM = "Sukkot III (CH''M)";
const SUKKOT_IV_CHM = "Sukkot IV (CH''M)";
const SUKKOT_V_CHM = "Sukkot V (CH''M)";
const SUKKOT_VI_CHM = "Sukkot VI (CH''M)";
const SHMINI_ATZERET = 'Shmini Atzeret';
const SIMCHAT_TORAH = 'Simchat Torah';
const SUKKOT_II_CHM = "Sukkot II (CH''M)";
const SUKKOT_VII_HOSHANA_RABA = 'Sukkot VII (Hoshana Raba)';
const CHANUKAH_1_CANDLE = 'Chanukah: 1 Candle';
const TU_BISHVAT = 'Tu BiShvat';
const EREV_PURIM = 'Erev Purim';
const PURIM = 'Purim';
const SHUSHAN_PURIM = 'Shushan Purim';
const EREV_PESACH = 'Erev Pesach';
const PESACH_I = 'Pesach I';
const PESACH_II = 'Pesach II';
const PESACH_II_CHM = "Pesach II (CH''M)";
const PESACH_III_CHM = "Pesach III (CH''M)";
const PESACH_IV_CHM = "Pesach IV (CH''M)";
const PESACH_V_CHM = "Pesach V (CH''M)";
const PESACH_VI_CHM = "Pesach VI (CH''M)";
const PESACH_VII = 'Pesach VII';
const PESACH_VIII = 'Pesach VIII';
const PESACH_SHENI = 'Pesach Sheni';
const LAG_BAOMER = 'Lag BaOmer';
const EREV_SHAVUOT = 'Erev Shavuot';
const SHAVUOT = 'Shavuot';
const SHAVUOT_I = 'Shavuot I';
const SHAVUOT_II = 'Shavuot II';
const TU_BAV = "Tu B'Av";
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

/**
 * Transliterated names of holidays, used by `Event.getDesc()`
 * @readonly
 * @enum {string}
 */
export const holidayDesc = {
  /** Asara B'Tevet */
  ASARA_BTEVET: "Asara B'Tevet",
  /** Birkat Hachamah */
  BIRKAT_HACHAMAH: 'Birkat Hachamah',
  /** Chag HaBanot */
  CHAG_HABANOT: 'Chag HaBanot',
  /** Chanukah: 8th Day */
  CHANUKAH_8TH_DAY: 'Chanukah: 8th Day',
  /** Erev Tish'a B'Av */
  EREV_TISHA_BAV: "Erev Tish'a B'Av",
  /** Leil Selichot */
  LEIL_SELICHOT: 'Leil Selichot',
  /** Purim Katan */
  PURIM_KATAN: 'Purim Katan',
  /** Purim Meshulash */
  PURIM_MESHULASH: 'Purim Meshulash',
  /** Shabbat Chazon */
  SHABBAT_CHAZON: 'Shabbat Chazon',
  /** Shabbat HaChodesh */
  SHABBAT_HACHODESH: 'Shabbat HaChodesh',
  /** Shabbat HaGadol */
  SHABBAT_HAGADOL: 'Shabbat HaGadol',
  /** Shabbat Nachamu */
  SHABBAT_NACHAMU: 'Shabbat Nachamu',
  /** Shabbat Parah */
  SHABBAT_PARAH: 'Shabbat Parah',
  /** Shabbat Shekalim */
  SHABBAT_SHEKALIM: 'Shabbat Shekalim',
  /** Shabbat Shirah */
  SHABBAT_SHIRAH: 'Shabbat Shirah',
  /** Shabbat Shuva */
  SHABBAT_SHUVA: 'Shabbat Shuva',
  /** Shabbat Zachor */
  SHABBAT_ZACHOR: 'Shabbat Zachor',
  /** Shushan Purim Katan */
  SHUSHAN_PURIM_KATAN: 'Shushan Purim Katan',
  /** Ta'anit Bechorot */
  TAANIT_BECHOROT: "Ta'anit Bechorot",
  /** Ta'anit Esther */
  TAANIT_ESTHER: "Ta'anit Esther",
  /** Tish'a B'Av */
  TISHA_BAV: "Tish'a B'Av",
  /** Tzom Gedaliah */
  TZOM_GEDALIAH: 'Tzom Gedaliah',
  /** Tzom Tammuz */
  TZOM_TAMMUZ: 'Tzom Tammuz',
  /** Yom HaAtzma'ut */
  YOM_HAATZMA_UT: "Yom HaAtzma'ut",
  /** Yom HaShoah */
  YOM_HASHOAH: 'Yom HaShoah',
  /** Yom HaZikaron */
  YOM_HAZIKARON: 'Yom HaZikaron',

  /** Ben-Gurion Day */
  BEN_GURION_DAY,
  /** Chanukah: 1 Candle */
  CHANUKAH_1_CANDLE,
  /** Erev Pesach */
  EREV_PESACH,
  /** Erev Purim */
  EREV_PURIM,
  /** Erev Rosh Hashana */
  EREV_ROSH_HASHANA,
  /** Erev Shavuot */
  EREV_SHAVUOT,
  /** Erev Sukkot */
  EREV_SUKKOT,
  /** Erev Yom Kippur */
  EREV_YOM_KIPPUR,
  /** Family Day */
  FAMILY_DAY,
  /** Hebrew Language Day */
  HEBREW_LANGUAGE_DAY,
  /** Herzl Day */
  HERZL_DAY,
  /** Jabotinsky Day */
  JABOTINSKY_DAY,
  /** Lag BaOmer */
  LAG_BAOMER,
  /** Pesach I */
  PESACH_I,
  /** Pesach II */
  PESACH_II,
  /** Pesach III (CH''M) */
  PESACH_III_CHM,
  /** Pesach II (CH''M) */
  PESACH_II_CHM,
  /** Pesach IV (CH''M) */
  PESACH_IV_CHM,
  /** Pesach Sheni */
  PESACH_SHENI,
  /** Pesach VII */
  PESACH_VII,
  /** Pesach VIII */
  PESACH_VIII,
  /** Pesach VI (CH''M) */
  PESACH_VI_CHM,
  /** Pesach V (CH''M) */
  PESACH_V_CHM,
  /** Purim */
  PURIM,
  /** Rosh Hashana II */
  ROSH_HASHANA_II,
  /** Rosh Hashana LaBehemot */
  ROSH_HASHANA_LABEHEMOT,
  /** Shavuot */
  SHAVUOT,
  /** Shavuot I */
  SHAVUOT_I,
  /** Shavuot II */
  SHAVUOT_II,
  /** Shmini Atzeret */
  SHMINI_ATZERET,
  /** Shushan Purim */
  SHUSHAN_PURIM,
  /** Sigd */
  SIGD,
  /** Simchat Torah */
  SIMCHAT_TORAH,
  /** Sukkot I */
  SUKKOT_I,
  /** Sukkot II */
  SUKKOT_II,
  /** Sukkot III (CH''M) */
  SUKKOT_III_CHM,
  /** Sukkot II (CH''M) */
  SUKKOT_II_CHM,
  /** Sukkot IV (CH''M) */
  SUKKOT_IV_CHM,
  /** Sukkot VII (Hoshana Raba) */
  SUKKOT_VII_HOSHANA_RABA,
  /** Sukkot VI (CH''M) */
  SUKKOT_VI_CHM,
  /** Sukkot V (CH''M) */
  SUKKOT_V_CHM,
  /** Tu B\'Av */
  TU_BAV,
  /** Tu BiShvat */
  TU_BISHVAT,
  /** Yitzhak Rabin Memorial Day */
  YITZHAK_RABIN_MEMORIAL_DAY,
  /** Yom HaAliyah */
  YOM_HAALIYAH,
  /** Yom HaAliyah School Observance */
  YOM_HAALIYAH_SCHOOL_OBSERVANCE,
  /** Yom Kippur */
  YOM_KIPPUR,
  /** Yom Yerushalayim */
  YOM_YERUSHALAYIM,
} as const;

export interface Holiday {
  mm: number; // This should be an enum `Month` eventually
  dd: number;
  desc: string;
  flags: number;
  chmDay?: number;
  emoji?: string;
}

export const staticHolidays: Holiday[] = [
  {
    mm: Tishrei,
    dd: 2,
    desc: ROSH_HASHANA_II,
    flags: CHAG | YOM_TOV_ENDS,
    emoji: '🍏🍯',
  },
  {mm: Tishrei, dd: 9, desc: EREV_YOM_KIPPUR, flags: EREV | LIGHT_CANDLES},
  {
    mm: Tishrei,
    dd: 10,
    desc: YOM_KIPPUR,
    flags: CHAG | MAJOR_FAST | YOM_TOV_ENDS,
  },

  {
    mm: Tishrei,
    dd: 14,
    desc: EREV_SUKKOT,
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 15,
    desc: SUKKOT_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 16,
    desc: SUKKOT_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 17,
    desc: SUKKOT_III_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 18,
    desc: SUKKOT_IV_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 19,
    desc: SUKKOT_V_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 20,
    desc: SUKKOT_VI_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 4,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 22,
    desc: SHMINI_ATZERET,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
  },
  {
    mm: Tishrei,
    dd: 23,
    desc: SIMCHAT_TORAH,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
  },

  {
    mm: Tishrei,
    dd: 14,
    desc: EREV_SUKKOT,
    flags: IL_ONLY | EREV | LIGHT_CANDLES,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 15,
    desc: SUKKOT_I,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 16,
    desc: SUKKOT_II_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 17,
    desc: SUKKOT_III_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 18,
    desc: SUKKOT_IV_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 19,
    desc: SUKKOT_V_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 4,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 20,
    desc: SUKKOT_VI_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 5,
    emoji: emojiSukkot,
  },
  {
    mm: Tishrei,
    dd: 22,
    desc: SHMINI_ATZERET,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
  },

  {
    mm: Tishrei,
    dd: 21,
    desc: SUKKOT_VII_HOSHANA_RABA,
    flags: LIGHT_CANDLES | CHOL_HAMOED,
    chmDay: -1,
    emoji: emojiSukkot,
  },
  {mm: Shvat, dd: 15, desc: TU_BISHVAT, flags: MINOR_HOLIDAY, emoji: '🌳'},
  {
    mm: Adar2,
    dd: 13,
    desc: EREV_PURIM,
    flags: EREV | MINOR_HOLIDAY,
    emoji: '🎭️📜',
  },
  {mm: Adar2, dd: 14, desc: PURIM, flags: MINOR_HOLIDAY, emoji: '🎭️📜'},
  {
    mm: Adar2,
    dd: 15,
    desc: SHUSHAN_PURIM,
    flags: MINOR_HOLIDAY,
    emoji: '🎭️📜',
  },
  // Pesach Israel
  {
    mm: Nisan,
    dd: 14,
    desc: EREV_PESACH,
    flags: IL_ONLY | EREV | LIGHT_CANDLES,
    emoji: '🫓🍷',
  },
  {
    mm: Nisan,
    dd: 15,
    desc: PESACH_I,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 16,
    desc: PESACH_II_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 17,
    desc: PESACH_III_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 18,
    desc: PESACH_IV_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 19,
    desc: PESACH_V_CHM,
    flags: IL_ONLY | CHOL_HAMOED,
    chmDay: 4,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 20,
    desc: PESACH_VI_CHM,
    flags: IL_ONLY | CHOL_HAMOED | LIGHT_CANDLES,
    chmDay: 5,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 21,
    desc: PESACH_VII,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },
  // Pesach chutz l'aretz
  {
    mm: Nisan,
    dd: 14,
    desc: EREV_PESACH,
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES,
    emoji: '🫓🍷',
  },
  {
    mm: Nisan,
    dd: 15,
    desc: PESACH_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: '🫓🍷',
  },
  {
    mm: Nisan,
    dd: 16,
    desc: PESACH_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 17,
    desc: PESACH_III_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 1,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 18,
    desc: PESACH_IV_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 2,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 19,
    desc: PESACH_V_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED,
    chmDay: 3,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 20,
    desc: PESACH_VI_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED | LIGHT_CANDLES,
    chmDay: 4,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 21,
    desc: PESACH_VII,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: emojiPesach,
  },
  {
    mm: Nisan,
    dd: 22,
    desc: PESACH_VIII,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: emojiPesach,
  },

  {mm: Iyyar, dd: 14, desc: PESACH_SHENI, flags: MINOR_HOLIDAY},
  {mm: Iyyar, dd: 18, desc: LAG_BAOMER, flags: MINOR_HOLIDAY, emoji: '🔥'},
  {
    mm: Sivan,
    dd: 5,
    desc: EREV_SHAVUOT,
    flags: EREV | LIGHT_CANDLES,
    emoji: '⛰️🌸',
  },
  {
    mm: Sivan,
    dd: 6,
    desc: SHAVUOT,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: '⛰️🌸',
  },
  {
    mm: Sivan,
    dd: 6,
    desc: SHAVUOT_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS,
    emoji: '⛰️🌸',
  },
  {
    mm: Sivan,
    dd: 7,
    desc: SHAVUOT_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS,
    emoji: '⛰️🌸',
  },
  {mm: Av, dd: 15, desc: TU_BAV, flags: MINOR_HOLIDAY, emoji: '❤️'},
  {
    mm: Elul,
    dd: 1,
    desc: ROSH_HASHANA_LABEHEMOT,
    flags: MINOR_HOLIDAY,
    emoji: '🐑',
  },
  {
    mm: Elul,
    dd: 29,
    desc: EREV_ROSH_HASHANA,
    flags: EREV | LIGHT_CANDLES,
    emoji: '🍏🍯',
  },
] as const;

export interface ModernHoliday {
  firstYear: number;
  mm: number; // This should be an enum `Month` eventually
  dd: number;
  desc: string;
  chul?: boolean;
  suppressEmoji?: boolean;
  satPostponeToSun?: boolean;
  friPostponeToSun?: boolean;
  friSatMovetoThu?: boolean;
}

export const staticModernHolidays: ModernHoliday[] = [
  {firstYear: 5727, mm: Iyyar, dd: 28, desc: YOM_YERUSHALAYIM, chul: true},
  {
    firstYear: 5737,
    mm: Kislev,
    dd: 6,
    desc: BEN_GURION_DAY,
    satPostponeToSun: true,
    friPostponeToSun: true,
  },
  {firstYear: 5750, mm: Shvat, dd: 30, desc: FAMILY_DAY},
  {
    firstYear: 5758,
    mm: Cheshvan,
    dd: 12,
    desc: YITZHAK_RABIN_MEMORIAL_DAY,
    friSatMovetoThu: true,
  },
  {firstYear: 5764, mm: Iyyar, dd: 10, desc: HERZL_DAY, satPostponeToSun: true},
  {
    firstYear: 5765,
    mm: Tamuz,
    dd: 29,
    desc: JABOTINSKY_DAY,
    satPostponeToSun: true,
  },
  {
    firstYear: 5769,
    mm: Cheshvan,
    dd: 29,
    desc: SIGD,
    chul: true,
    suppressEmoji: true,
    friSatMovetoThu: true,
  },
  {firstYear: 5777, mm: Nisan, dd: 10, desc: YOM_HAALIYAH, chul: true},
  {firstYear: 5777, mm: Cheshvan, dd: 7, desc: YOM_HAALIYAH_SCHOOL_OBSERVANCE},
  // https://www.gov.il/he/departments/policies/2012_des5234
  {
    firstYear: 5773,
    mm: months.TEVET,
    dd: 21,
    desc: HEBREW_LANGUAGE_DAY,
    friSatMovetoThu: true,
  },
] as const;
