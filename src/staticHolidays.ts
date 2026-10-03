import {months} from '@hebcal/hdate';
import {flags} from './event.js';

const {NISAN, IYYAR, SIVAN, AV, ELUL, TISHREI, SHVAT, ADAR_II} = months;

const {
  CHAG,
  LIGHT_CANDLES,
  YOM_TOV_ENDS,
  CHUL_ONLY,
  IL_ONLY,
  LIGHT_CANDLES_TZEIS,
  MAJOR_FAST,
  MINOR_HOLIDAY,
  EREV,
  CHOL_HAMOED,
} = flags;

/**
 * Transliterated names of holidays, used by `Event.getDesc()`
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
  /** Ta'anit BeHaB */
  TAANIT_BEHAB: "Ta'anit BeHaB",
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
  BEN_GURION_DAY: 'Ben-Gurion Day',
  /** Chanukah: 1 Candle */
  CHANUKAH_1_CANDLE: 'Chanukah: 1 Candle',
  /** Erev Pesach */
  EREV_PESACH: 'Erev Pesach',
  /** Erev Purim */
  EREV_PURIM: 'Erev Purim',
  /** Erev Rosh Hashana */
  EREV_ROSH_HASHANA: 'Erev Rosh Hashana',
  /** Erev Shavuot */
  EREV_SHAVUOT: 'Erev Shavuot',
  /** Erev Sukkot */
  EREV_SUKKOT: 'Erev Sukkot',
  /** Erev Yom Kippur */
  EREV_YOM_KIPPUR: 'Erev Yom Kippur',
  /** Family Day */
  FAMILY_DAY: 'Family Day',
  /** Hebrew Language Day */
  HEBREW_LANGUAGE_DAY: 'Hebrew Language Day',
  /** Herzl Day */
  HERZL_DAY: 'Herzl Day',
  /** Jabotinsky Day */
  JABOTINSKY_DAY: 'Jabotinsky Day',
  /** Lag BaOmer */
  LAG_BAOMER: 'Lag BaOmer',
  /** Pesach I */
  PESACH_I: 'Pesach I',
  /** Pesach II */
  PESACH_II: 'Pesach II',
  /** Pesach III (CH''M) */
  PESACH_III_CHM: "Pesach III (CH''M)",
  /** Pesach II (CH''M) */
  PESACH_II_CHM: "Pesach II (CH''M)",
  /** Pesach IV (CH''M) */
  PESACH_IV_CHM: "Pesach IV (CH''M)",
  /** Pesach Sheni */
  PESACH_SHENI: 'Pesach Sheni',
  /** Pesach VII */
  PESACH_VII: 'Pesach VII',
  /** Pesach VIII */
  PESACH_VIII: 'Pesach VIII',
  /** Pesach VI (CH''M) */
  PESACH_VI_CHM: "Pesach VI (CH''M)",
  /** Pesach V (CH''M) */
  PESACH_V_CHM: "Pesach V (CH''M)",
  /** Purim */
  PURIM: 'Purim',
  /** Rosh Hashana II */
  ROSH_HASHANA_II: 'Rosh Hashana II',
  /** Rosh Hashana LaBehemot */
  ROSH_HASHANA_LABEHEMOT: 'Rosh Hashana LaBehemot',
  /** Shavuot */
  SHAVUOT: 'Shavuot',
  /** Shavuot I */
  SHAVUOT_I: 'Shavuot I',
  /** Shavuot II */
  SHAVUOT_II: 'Shavuot II',
  /** Shmini Atzeret */
  SHMINI_ATZERET: 'Shmini Atzeret',
  /** Shushan Purim */
  SHUSHAN_PURIM: 'Shushan Purim',
  /** Sigd */
  SIGD: 'Sigd',
  /** Simchat Torah */
  SIMCHAT_TORAH: 'Simchat Torah',
  /** Sukkot I */
  SUKKOT_I: 'Sukkot I',
  /** Sukkot II */
  SUKKOT_II: 'Sukkot II',
  /** Sukkot III (CH''M) */
  SUKKOT_III_CHM: "Sukkot III (CH''M)",
  /** Sukkot II (CH''M) */
  SUKKOT_II_CHM: "Sukkot II (CH''M)",
  /** Sukkot IV (CH''M) */
  SUKKOT_IV_CHM: "Sukkot IV (CH''M)",
  /** Sukkot VII (Hoshana Raba) */
  SUKKOT_VII_HOSHANA_RABA: 'Sukkot VII (Hoshana Raba)',
  /** Sukkot VI (CH''M) */
  SUKKOT_VI_CHM: "Sukkot VI (CH''M)",
  /** Sukkot V (CH''M) */
  SUKKOT_V_CHM: "Sukkot V (CH''M)",
  /** Tu B'Av */
  TU_BAV: "Tu B'Av",
  /** Tu BiShvat */
  TU_BISHVAT: 'Tu BiShvat',
  /** Yitzhak Rabin Memorial Day */
  YITZHAK_RABIN_MEMORIAL_DAY: 'Yitzhak Rabin Memorial Day',
  /** Yom HaAliyah */
  YOM_HAALIYAH: 'Yom HaAliyah',
  /** Yom HaAliyah School Observance */
  YOM_HAALIYAH_SCHOOL_OBSERVANCE: 'Yom HaAliyah School Observance',
  /** Yom Kippur */
  YOM_KIPPUR: 'Yom Kippur',
  /** Yom Yerushalayim */
  YOM_YERUSHALAYIM: 'Yom Yerushalayim',
  /** Candle lighting */
  CANDLE_LIGHTING: 'Candle lighting',
  /** Havdalah */
  HAVDALAH: 'Havdalah',
  /** Fast begins */
  FAST_BEGINS: 'Fast begins',
  /** Fast ends */
  FAST_ENDS: 'Fast ends',
  /** Biur Chametz */
  BIUR_CHAMETZ: 'Biur Chametz',
  /** Finish eating chametz */
  SOF_ZMAN_ACHILAT_CHAMETZ: 'Finish eating chametz',
  /** Yizkor */
  YIZKOR: 'Yizkor',
  /** Remembrance Day for the Fallen of the Swords of Iron War (October 7) */
  SWORDS_OF_IRON_WAR_MEMORIAL: 'Swords of Iron War Memorial Day',
} as const;

export interface Holiday {
  mm: number; // This should be an enum `Month` eventually
  dd: number;
  desc: string;
  flags: number;
  chmDay?: number;
  emoji?: string;
}

const d = holidayDesc;

const emojiRoshHashana = '🍏🍯';
const emojiSukkot = '🌿🍋';
const emojiPurim = '🎭️📜';
const emojiPesach = '🫓';
const emojiErevPesach = '🫓🍷';
const emojiShavuot = '⛰️🌸';

/** Optional fields of a {@link Holiday} */
type Extras = Pick<Holiday, 'chmDay' | 'emoji'>;

function holiday(
  mm: number,
  dd: number,
  desc: string,
  holidayFlags: number,
  extras?: Extras
): Holiday {
  return {mm, dd, desc, flags: holidayFlags, ...extras};
}

/**
 * Holidays that fall on a fixed Hebrew date. Entries marked `IL_ONLY` or
 * `CHUL_ONLY` differ between Israel and the Diaspora.
 */
export const staticHolidays: readonly Holiday[] = [
  holiday(TISHREI, 2, d.ROSH_HASHANA_II, CHAG | YOM_TOV_ENDS, {
    emoji: emojiRoshHashana,
  }),
  holiday(TISHREI, 9, d.EREV_YOM_KIPPUR, EREV | LIGHT_CANDLES),
  holiday(TISHREI, 10, d.YOM_KIPPUR, CHAG | MAJOR_FAST | YOM_TOV_ENDS),

  // Sukkot chutz l'aretz
  holiday(TISHREI, 14, d.EREV_SUKKOT, CHUL_ONLY | EREV | LIGHT_CANDLES, {
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 15, d.SUKKOT_I, CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, {
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 16, d.SUKKOT_II, CHUL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 17, d.SUKKOT_III_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 1,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 18, d.SUKKOT_IV_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 2,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 19, d.SUKKOT_V_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 3,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 20, d.SUKKOT_VI_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 4,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 22, d.SHMINI_ATZERET, CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS),
  holiday(TISHREI, 23, d.SIMCHAT_TORAH, CHUL_ONLY | CHAG | YOM_TOV_ENDS),

  // Sukkot Israel
  holiday(TISHREI, 14, d.EREV_SUKKOT, IL_ONLY | EREV | LIGHT_CANDLES, {
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 15, d.SUKKOT_I, IL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 16, d.SUKKOT_II_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 1,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 17, d.SUKKOT_III_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 2,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 18, d.SUKKOT_IV_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 3,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 19, d.SUKKOT_V_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 4,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 20, d.SUKKOT_VI_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 5,
    emoji: emojiSukkot,
  }),
  holiday(TISHREI, 22, d.SHMINI_ATZERET, IL_ONLY | CHAG | YOM_TOV_ENDS),

  // Hoshana Raba (both Israel and Diaspora)
  holiday(TISHREI, 21, d.SUKKOT_VII_HOSHANA_RABA, LIGHT_CANDLES | CHOL_HAMOED, {
    chmDay: -1,
    emoji: emojiSukkot,
  }),

  holiday(SHVAT, 15, d.TU_BISHVAT, MINOR_HOLIDAY, {emoji: '🌳'}),
  holiday(ADAR_II, 13, d.EREV_PURIM, EREV | MINOR_HOLIDAY, {
    emoji: emojiPurim,
  }),
  holiday(ADAR_II, 14, d.PURIM, MINOR_HOLIDAY, {emoji: emojiPurim}),
  holiday(ADAR_II, 15, d.SHUSHAN_PURIM, MINOR_HOLIDAY, {emoji: emojiPurim}),

  // Pesach Israel
  holiday(NISAN, 14, d.EREV_PESACH, IL_ONLY | EREV | LIGHT_CANDLES, {
    emoji: emojiErevPesach,
  }),
  holiday(NISAN, 15, d.PESACH_I, IL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiPesach,
  }),
  holiday(NISAN, 16, d.PESACH_II_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 1,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 17, d.PESACH_III_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 2,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 18, d.PESACH_IV_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 3,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 19, d.PESACH_V_CHM, IL_ONLY | CHOL_HAMOED, {
    chmDay: 4,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 20, d.PESACH_VI_CHM, IL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, {
    chmDay: 5,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 21, d.PESACH_VII, IL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiPesach,
  }),

  // Pesach chutz l'aretz
  holiday(NISAN, 14, d.EREV_PESACH, CHUL_ONLY | EREV | LIGHT_CANDLES, {
    emoji: emojiErevPesach,
  }),
  holiday(NISAN, 15, d.PESACH_I, CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, {
    emoji: emojiErevPesach,
  }),
  holiday(NISAN, 16, d.PESACH_II, CHUL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiPesach,
  }),
  holiday(NISAN, 17, d.PESACH_III_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 1,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 18, d.PESACH_IV_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 2,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 19, d.PESACH_V_CHM, CHUL_ONLY | CHOL_HAMOED, {
    chmDay: 3,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 20, d.PESACH_VI_CHM, CHUL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, {
    chmDay: 4,
    emoji: emojiPesach,
  }),
  holiday(NISAN, 21, d.PESACH_VII, CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, {
    emoji: emojiPesach,
  }),
  holiday(NISAN, 22, d.PESACH_VIII, CHUL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiPesach,
  }),

  holiday(IYYAR, 14, d.PESACH_SHENI, MINOR_HOLIDAY),
  holiday(IYYAR, 18, d.LAG_BAOMER, MINOR_HOLIDAY, {emoji: '🔥'}),
  holiday(SIVAN, 5, d.EREV_SHAVUOT, EREV | LIGHT_CANDLES, {
    emoji: emojiShavuot,
  }),
  holiday(SIVAN, 6, d.SHAVUOT, IL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiShavuot,
  }),
  holiday(SIVAN, 6, d.SHAVUOT_I, CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, {
    emoji: emojiShavuot,
  }),
  holiday(SIVAN, 7, d.SHAVUOT_II, CHUL_ONLY | CHAG | YOM_TOV_ENDS, {
    emoji: emojiShavuot,
  }),
  holiday(AV, 15, d.TU_BAV, MINOR_HOLIDAY, {emoji: '❤️'}),
  holiday(ELUL, 1, d.ROSH_HASHANA_LABEHEMOT, MINOR_HOLIDAY, {emoji: '🐑'}),
  holiday(ELUL, 29, d.EREV_ROSH_HASHANA, EREV | LIGHT_CANDLES, {
    emoji: emojiRoshHashana,
  }),
];
