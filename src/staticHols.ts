import {months} from '@hebcal/hdate';
import {flags} from './event.js';

export interface Holiday {
  mm: number; // This should be an enum `Month` eventually
  dd: number;
  desc: HolidayDesc;
  flags: flags;
  chmDay?: number;
  emoji?: string;
}

export interface ModernHoliday {
  firstYear: number;
  mm: number; // This should be an enum `Month` eventually
  dd: number;
  desc: HolidayDesc;
  chul?: boolean;
  suppressEmoji?: boolean;
  satPostponeToSun?: boolean;
  friPostponeToSun?: boolean;
  friSatMovetoThu?: boolean;
}


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

/**
 * Transliterated names of holidays, used by `Event.getDesc()`
 * @readonly
 * @enum {string}
 */
export enum HolidayDesc {
  /** Asara B'Tevet */
  ASARA_BTEVET = 'Asara B\'Tevet',
  /** Birkat Hachamah */
  BIRKAT_HACHAMAH = 'Birkat Hachamah',
  /** Chag HaBanot */
  CHAG_HABANOT = 'Chag HaBanot',
  /** Chanukah: 8th Day */
  CHANUKAH_8TH_DAY = 'Chanukah: 8th Day',
  /** Erev Tish'a B'Av */
  EREV_TISHA_BAV = 'Erev Tish\'a B\'Av',
  /** Leil Selichot */
  LEIL_SELICHOT = 'Leil Selichot',
  /** Purim Katan */
  PURIM_KATAN = 'Purim Katan',
  /** Purim Meshulash */
  PURIM_MESHULASH = 'Purim Meshulash',
  /** Shabbat Chazon */
  SHABBAT_CHAZON = 'Shabbat Chazon',
  /** Shabbat HaChodesh */
  SHABBAT_HACHODESH = 'Shabbat HaChodesh',
  /** Shabbat HaGadol */
  SHABBAT_HAGADOL = 'Shabbat HaGadol',
  /** Shabbat Nachamu */
  SHABBAT_NACHAMU = 'Shabbat Nachamu',
  /** Shabbat Parah */
  SHABBAT_PARAH = 'Shabbat Parah',
  /** Shabbat Shekalim */
  SHABBAT_SHEKALIM = 'Shabbat Shekalim',
  /** Shabbat Shirah */
  SHABBAT_SHIRAH = 'Shabbat Shirah',
  /** Shabbat Shuva */
  SHABBAT_SHUVA = 'Shabbat Shuva',
  /** Shabbat Zachor */
  SHABBAT_ZACHOR = 'Shabbat Zachor',
  /** Shushan Purim Katan */
  SHUSHAN_PURIM_KATAN = 'Shushan Purim Katan',
  /** Ta'anit Bechorot */
  TAANIT_BECHOROT = 'Ta\'anit Bechorot',
  /** Ta'anit Esther */
  TAANIT_ESTHER = 'Ta\'anit Esther',
  /** Tish'a B'Av */
  TISHA_BAV = 'Tish\'a B\'Av',
  /** Tzom Gedaliah */
  TZOM_GEDALIAH = 'Tzom Gedaliah',
  /** Tzom Tammuz */
  TZOM_TAMMUZ = 'Tzom Tammuz',
  /** Yom HaAtzma'ut */
  YOM_HAATZMA_UT = 'Yom HaAtzma\'ut',
  /** Yom HaShoah */
  YOM_HASHOAH = 'Yom HaShoah',
  /** Yom HaZikaron */
  YOM_HAZIKARON = 'Yom HaZikaron',

  /** Ben-Gurion Day */
  BEN_GURION_DAY = 'Ben-Gurion Day',
  /** Chanukah: 1 Candle */
  CHANUKAH_1_CANDLE = 'Chanukah: 1 Candle',
  /** Erev Pesach */
  EREV_PESACH = 'Erev Pesach',
  /** Erev Purim */
  EREV_PURIM = 'Erev Purim',
  /** Erev Rosh Hashana */
  EREV_ROSH_HASHANA = 'Erev Rosh Hashana',
  /** Erev Shavuot */
  EREV_SHAVUOT = 'Erev Shavuot',
  /** Erev Sukkot */
  EREV_SUKKOT = 'Erev Sukkot',
  /** Erev Yom Kippur */
  EREV_YOM_KIPPUR = 'Erev Yom Kippur',
  /** Family Day */
  FAMILY_DAY = 'Family Day',
  /** Hebrew Language Day */
  HEBREW_LANGUAGE_DAY = 'Hebrew Language Day',
  /** Herzl Day */
  HERZL_DAY = 'Herzl Day',
  /** Jabotinsky Day */
  JABOTINSKY_DAY = 'Jabotinsky Day',
  /** Lag BaOmer */
  LAG_BAOMER = 'Lag BaOmer',
  /** Pesach I */
  PESACH_I = 'Pesach I',
  /** Pesach II */
  PESACH_II = 'Pesach II',
  /** Pesach III (CH''M) */
  PESACH_III_CHM = 'Pesach III (CH\'\'M)',
  /** Pesach II (CH''M) */
  PESACH_II_CHM = 'Pesach II (CH\'\'M)',
  /** Pesach IV (CH''M) */
  PESACH_IV_CHM = 'Pesach IV (CH\'\'M)',
  /** Pesach Sheni */
  PESACH_SHENI = 'Pesach Sheni',
  /** Pesach VII */
  PESACH_VII = 'Pesach VII',
  /** Pesach VIII */
  PESACH_VIII = 'Pesach VIII',
  /** Pesach VI (CH''M) */
  PESACH_VI_CHM = 'Pesach VI (CH\'\'M)',
  /** Pesach V (CH''M) */
  PESACH_V_CHM = 'Pesach V (CH\'\'M)',
  /** Purim */
  PURIM = 'Purim',
  /** Rosh Hashana II */
  ROSH_HASHANA_II = 'Rosh Hashana II',
  /** Rosh Hashana LaBehemot */
  ROSH_HASHANA_LABEHEMOT = 'Rosh Hashana LaBehemot',
  /** Shavuot */
  SHAVUOT = 'Shavuot',
  /** Shavuot I */
  SHAVUOT_I = 'Shavuot I',
  /** Shavuot II */
  SHAVUOT_II = 'Shavuot II',
  /** Shmini Atzeret */
  SHMINI_ATZERET = 'Shmini Atzeret',
  /** Shushan Purim */
  SHUSHAN_PURIM =   'Shushan Purim',
  /** Sigd */
  SIGD = 'Sigd',
  /** Simchat Torah */
  SIMCHAT_TORAH = 'Simchat Torah',
  /** Sukkot I */
  SUKKOT_I = 'Sukkot I',
  /** Sukkot II */
  SUKKOT_II = 'Sukkot II',
  /** Sukkot III (CH''M) */
  SUKKOT_III_CHM = 'Sukkot III (CH\'\'M)',
  /** Sukkot II (CH''M) */
  SUKKOT_II_CHM = 'Sukkot II (CH\'\'M)',
  /** Sukkot IV (CH''M) */
  SUKKOT_IV_CHM = 'Sukkot IV (CH\'\'M)',
  /** Sukkot VII (Hoshana Raba) */
  SUKKOT_VII_HOSHANA_RABA = 'Sukkot VII (Hoshana Raba)',
  /** Sukkot VI (CH''M) */
  SUKKOT_VI_CHM = 'Sukkot VI (CH\'\'M)',
  /** Sukkot V (CH''M) */
  SUKKOT_V_CHM = 'Sukkot V (CH\'\'M)',
  /** Tu B\'Av */
  TU_BAV = 'Tu B\'Av',
  /** Tu BiShvat */
  TU_BISHVAT = 'Tu BiShvat',
  /** Yitzhak Rabin Memorial Day */
  YITZHAK_RABIN_MEMORIAL_DAY = 'Yitzhak Rabin Memorial Day',
  /** Yom HaAliyah */
  YOM_HAALIYAH = 'Yom HaAliyah',
  /** Yom HaAliyah School Observance */
  YOM_HAALIYAH_SCHOOL_OBSERVANCE = 'Yom HaAliyah School Observance',
  /** Yom Kippur */
  YOM_KIPPUR = 'Yom Kippur',
  /** Yom Yerushalayim */
  YOM_YERUSHALAYIM = 'Yom Yerushalayim',
};




export const staticHolidays: Holiday[] = [
  {mm: Tishrei, dd: 2, desc: HolidayDesc.ROSH_HASHANA_II, flags: CHAG | YOM_TOV_ENDS, emoji: '🍏🍯'},
  {mm: Tishrei, dd: 9, desc: HolidayDesc.EREV_YOM_KIPPUR, flags: EREV | LIGHT_CANDLES},
  {mm: Tishrei, dd: 10, desc: HolidayDesc.YOM_KIPPUR, flags: CHAG | MAJOR_FAST | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 14, desc: HolidayDesc.EREV_SUKKOT, flags: CHUL_ONLY | EREV | LIGHT_CANDLES, emoji: emojiSukkot},
  {mm: Tishrei, dd: 15, desc: HolidayDesc.SUKKOT_I, flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 16, desc: HolidayDesc.SUKKOT_II, flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 17, desc: HolidayDesc.SUKKOT_III_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiSukkot},
  {mm: Tishrei, dd: 18, desc: HolidayDesc.SUKKOT_IV_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiSukkot},
  {mm: Tishrei, dd: 19, desc: HolidayDesc.SUKKOT_V_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiSukkot},
  {mm: Tishrei, dd: 20, desc: HolidayDesc.SUKKOT_VI_CHM, flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiSukkot},
  {mm: Tishrei, dd: 22, desc: HolidayDesc.SHMINI_ATZERET,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS},
  {mm: Tishrei, dd: 23, desc: HolidayDesc.SIMCHAT_TORAH,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 14, desc: HolidayDesc.EREV_SUKKOT, flags: IL_ONLY | EREV | LIGHT_CANDLES, emoji: emojiSukkot},
  {mm: Tishrei, dd: 15, desc: HolidayDesc.SUKKOT_I, flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 16, desc: HolidayDesc.SUKKOT_II_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiSukkot},
  {mm: Tishrei, dd: 17, desc: HolidayDesc.SUKKOT_III_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiSukkot},
  {mm: Tishrei, dd: 18, desc: HolidayDesc.SUKKOT_IV_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiSukkot},
  {mm: Tishrei, dd: 19, desc: HolidayDesc.SUKKOT_V_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiSukkot},
  {mm: Tishrei, dd: 20, desc: HolidayDesc.SUKKOT_VI_CHM, flags: IL_ONLY | CHOL_HAMOED, chmDay: 5, emoji: emojiSukkot},
  {mm: Tishrei, dd: 22, desc: HolidayDesc.SHMINI_ATZERET,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 21, desc: HolidayDesc.SUKKOT_VII_HOSHANA_RABA,
    flags: LIGHT_CANDLES | CHOL_HAMOED, chmDay: -1, emoji: emojiSukkot},
  {mm: Kislev, dd: 24, desc: HolidayDesc.CHANUKAH_1_CANDLE,
    flags: EREV | MINOR_HOLIDAY | CHANUKAH_CANDLES, emoji: '🕎1️⃣'},
  {mm: Shvat, dd: 15, desc: HolidayDesc.TU_BISHVAT, flags: MINOR_HOLIDAY, emoji: '🌳'},
  {mm: Adar2, dd: 13, desc: HolidayDesc.EREV_PURIM, flags: EREV | MINOR_HOLIDAY, emoji: '🎭️📜'},
  {mm: Adar2, dd: 14, desc: HolidayDesc.PURIM, flags: MINOR_HOLIDAY, emoji: '🎭️📜'},
  {mm: Adar2, dd: 15, desc: HolidayDesc.SHUSHAN_PURIM, flags: MINOR_HOLIDAY, emoji: '🎭️📜'},
  // Pesach Israel
  {mm: Nisan, dd: 14, desc: HolidayDesc.EREV_PESACH,
    flags: IL_ONLY | EREV | LIGHT_CANDLES, emoji: '🫓🍷'},
  {mm: Nisan, dd: 15, desc: HolidayDesc.PESACH_I,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  {mm: Nisan, dd: 16, desc: HolidayDesc.PESACH_II_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiPesach},
  {mm: Nisan, dd: 17, desc: HolidayDesc.PESACH_III_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiPesach},
  {mm: Nisan, dd: 18, desc: HolidayDesc.PESACH_IV_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiPesach},
  {mm: Nisan, dd: 19, desc: HolidayDesc.PESACH_V_CHM,
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiPesach},
  {mm: Nisan, dd: 20, desc: HolidayDesc.PESACH_VI_CHM,
    flags: IL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, chmDay: 5, emoji: emojiPesach},
  {mm: Nisan, dd: 21, desc: HolidayDesc.PESACH_VII,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  // Pesach chutz l'aretz
  {mm: Nisan, dd: 14, desc: HolidayDesc.EREV_PESACH,
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES, emoji: '🫓🍷'},
  {mm: Nisan, dd: 15, desc: HolidayDesc.PESACH_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: '🫓🍷'},
  {mm: Nisan, dd: 16, desc: HolidayDesc.PESACH_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  {mm: Nisan, dd: 17, desc: HolidayDesc.PESACH_III_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiPesach},
  {mm: Nisan, dd: 18, desc: HolidayDesc.PESACH_IV_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiPesach},
  {mm: Nisan, dd: 19, desc: HolidayDesc.PESACH_V_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiPesach},
  {mm: Nisan, dd: 20, desc: HolidayDesc.PESACH_VI_CHM,
    flags: CHUL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, chmDay: 4, emoji: emojiPesach},
  {mm: Nisan, dd: 21, desc: HolidayDesc.PESACH_VII,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: emojiPesach},
  {mm: Nisan, dd: 22, desc: HolidayDesc.PESACH_VIII,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},

  {mm: Iyyar, dd: 14, desc: HolidayDesc.PESACH_SHENI, flags: MINOR_HOLIDAY},
  {mm: Iyyar, dd: 18, desc: HolidayDesc.LAG_BAOMER, flags: MINOR_HOLIDAY, emoji: '🔥'},
  {mm: Sivan, dd: 5, desc: HolidayDesc.EREV_SHAVUOT,
    flags: EREV | LIGHT_CANDLES, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 6, desc: HolidayDesc.SHAVUOT,
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 6, desc: HolidayDesc.SHAVUOT_I,
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 7, desc: HolidayDesc.SHAVUOT_II,
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: '⛰️🌸'},
  {mm: Av, dd: 15, desc: HolidayDesc.TU_BAV,
    flags: MINOR_HOLIDAY, emoji: '❤️'},
  {mm: Elul, dd: 1, desc: HolidayDesc.ROSH_HASHANA_LABEHEMOT,
    flags: MINOR_HOLIDAY, emoji: '🐑'},
  {mm: Elul, dd: 29, desc: HolidayDesc.EREV_ROSH_HASHANA,
    flags: EREV | LIGHT_CANDLES, emoji: '🍏🍯'},
];

export const staticModernHolidays: ModernHoliday[] = [
  {firstYear: 5727, mm: Iyyar, dd: 28, desc: HolidayDesc.YOM_YERUSHALAYIM,
    chul: true},
  {firstYear: 5737, mm: Kislev, dd: 6, desc: HolidayDesc.BEN_GURION_DAY,
    satPostponeToSun: true, friPostponeToSun: true},
  {firstYear: 5750, mm: Shvat, dd: 30, desc: HolidayDesc.FAMILY_DAY},
  {firstYear: 5758, mm: Cheshvan, dd: 12, desc: HolidayDesc.YITZHAK_RABIN_MEMORIAL_DAY,
    friSatMovetoThu: true},
  {firstYear: 5764, mm: Iyyar, dd: 10, desc: HolidayDesc.HERZL_DAY,
    satPostponeToSun: true},
  {firstYear: 5765, mm: Tamuz, dd: 29, desc: HolidayDesc.JABOTINSKY_DAY,
    satPostponeToSun: true},
  {firstYear: 5769, mm: Cheshvan, dd: 29, desc: HolidayDesc.SIGD,
    chul: true, suppressEmoji: true},
  {firstYear: 5777, mm: Nisan, dd: 10, desc: HolidayDesc.YOM_HAALIYAH,
    chul: true},
  {firstYear: 5777, mm: Cheshvan, dd: 7, desc: HolidayDesc.YOM_HAALIYAH_SCHOOL_OBSERVANCE},
  // https://www.gov.il/he/departments/policies/2012_des5234
  {firstYear: 5773, mm: months.TEVET, dd: 21, desc: HolidayDesc.HEBREW_LANGUAGE_DAY,
    friSatMovetoThu: true},
];
