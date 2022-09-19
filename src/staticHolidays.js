import {months} from './hdate';
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
// const Tevet = months.TEVET;
const Shvat = months.SHVAT;
// const Adar1 = months.ADAR_I;
const Adar2 = months.ADAR_II;

const CHAG = flags.CHAG;
const LIGHT_CANDLES = flags.LIGHT_CANDLES;
const YOM_TOV_ENDS = flags.YOM_TOV_ENDS;
const CHUL_ONLY = flags.CHUL_ONLY;
const IL_ONLY = flags.IL_ONLY;
const LIGHT_CANDLES_TZEIS = flags.LIGHT_CANDLES_TZEIS;
const CHANUKAH_CANDLES = flags.CHANUKAH_CANDLES;
// const MINOR_FAST = flags.MINOR_FAST;
const MAJOR_FAST = flags.MAJOR_FAST;
const MINOR_HOLIDAY = flags.MINOR_HOLIDAY;
const EREV = flags.EREV;
const CHOL_HAMOED = flags.CHOL_HAMOED;

const emojiPesach = '🫓';
const emojiSukkot = '🌿🍋';

export const staticHolidays = [
  {mm: Tishrei, dd: 2, desc: 'Rosh Hashana II', flags: CHAG | YOM_TOV_ENDS, emoji: '🍏🍯'},
  {mm: Tishrei, dd: 9, desc: 'Erev Yom Kippur', flags: EREV | LIGHT_CANDLES},
  {mm: Tishrei, dd: 10, desc: 'Yom Kippur', flags: CHAG | MAJOR_FAST | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 14, desc: 'Erev Sukkot', flags: CHUL_ONLY | EREV | LIGHT_CANDLES, emoji: emojiSukkot},
  {mm: Tishrei, dd: 15, desc: 'Sukkot I', flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 16, desc: 'Sukkot II', flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 17, desc: 'Sukkot III (CH\'\'M)', flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiSukkot},
  {mm: Tishrei, dd: 18, desc: 'Sukkot IV (CH\'\'M)', flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiSukkot},
  {mm: Tishrei, dd: 19, desc: 'Sukkot V (CH\'\'M)', flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiSukkot},
  {mm: Tishrei, dd: 20, desc: 'Sukkot VI (CH\'\'M)', flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiSukkot},
  {mm: Tishrei, dd: 22, desc: 'Shmini Atzeret',
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS},
  {mm: Tishrei, dd: 23, desc: 'Simchat Torah',
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 14, desc: 'Erev Sukkot', flags: IL_ONLY | EREV | LIGHT_CANDLES, emoji: emojiSukkot},
  {mm: Tishrei, dd: 15, desc: 'Sukkot I', flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiSukkot},
  {mm: Tishrei, dd: 16, desc: 'Sukkot II (CH\'\'M)', flags: IL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiSukkot},
  {mm: Tishrei, dd: 17, desc: 'Sukkot III (CH\'\'M)', flags: IL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiSukkot},
  {mm: Tishrei, dd: 18, desc: 'Sukkot IV (CH\'\'M)', flags: IL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiSukkot},
  {mm: Tishrei, dd: 19, desc: 'Sukkot V (CH\'\'M)', flags: IL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiSukkot},
  {mm: Tishrei, dd: 20, desc: 'Sukkot VI (CH\'\'M)', flags: IL_ONLY | CHOL_HAMOED, chmDay: 5, emoji: emojiSukkot},
  {mm: Tishrei, dd: 22, desc: 'Shmini Atzeret',
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS},

  {mm: Tishrei, dd: 21, desc: 'Sukkot VII (Hoshana Raba)',
    flags: LIGHT_CANDLES | CHOL_HAMOED, chmDay: -1, emoji: emojiSukkot},
  {mm: Kislev, dd: 24, desc: 'Chanukah: 1 Candle',
    flags: EREV | MINOR_HOLIDAY | CHANUKAH_CANDLES, emoji: '🕎1️⃣'},
  {mm: Shvat, dd: 15, desc: 'Tu BiShvat', flags: MINOR_HOLIDAY, emoji: '🌳'},
  {mm: Adar2, dd: 13, desc: 'Erev Purim', flags: EREV | MINOR_HOLIDAY, emoji: '🎭️📜'},
  {mm: Adar2, dd: 14, desc: 'Purim', flags: MINOR_HOLIDAY, emoji: '🎭️📜'},
  // Pesach Israel
  {mm: Nisan, dd: 14, desc: 'Erev Pesach',
    flags: IL_ONLY | EREV | LIGHT_CANDLES, emoji: '🫓🍷'},
  {mm: Nisan, dd: 15, desc: 'Pesach I',
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  {mm: Nisan, dd: 16, desc: 'Pesach II (CH\'\'M)',
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiPesach},
  {mm: Nisan, dd: 17, desc: 'Pesach III (CH\'\'M)',
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiPesach},
  {mm: Nisan, dd: 18, desc: 'Pesach IV (CH\'\'M)',
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiPesach},
  {mm: Nisan, dd: 19, desc: 'Pesach V (CH\'\'M)',
    flags: IL_ONLY | CHOL_HAMOED, chmDay: 4, emoji: emojiPesach},
  {mm: Nisan, dd: 20, desc: 'Pesach VI (CH\'\'M)',
    flags: IL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, chmDay: 5, emoji: emojiPesach},
  {mm: Nisan, dd: 21, desc: 'Pesach VII',
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  // Pesach chutz l'aretz
  {mm: Nisan, dd: 14, desc: 'Erev Pesach',
    flags: CHUL_ONLY | EREV | LIGHT_CANDLES, emoji: '🫓🍷'},
  {mm: Nisan, dd: 15, desc: 'Pesach I',
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: '🫓🍷'},
  {mm: Nisan, dd: 16, desc: 'Pesach II',
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},
  {mm: Nisan, dd: 17, desc: 'Pesach III (CH\'\'M)',
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 1, emoji: emojiPesach},
  {mm: Nisan, dd: 18, desc: 'Pesach IV (CH\'\'M)',
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 2, emoji: emojiPesach},
  {mm: Nisan, dd: 19, desc: 'Pesach V (CH\'\'M)',
    flags: CHUL_ONLY | CHOL_HAMOED, chmDay: 3, emoji: emojiPesach},
  {mm: Nisan, dd: 20, desc: 'Pesach VI (CH\'\'M)',
    flags: CHUL_ONLY | CHOL_HAMOED | LIGHT_CANDLES, chmDay: 4, emoji: emojiPesach},
  {mm: Nisan, dd: 21, desc: 'Pesach VII',
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: emojiPesach},
  {mm: Nisan, dd: 22, desc: 'Pesach VIII',
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: emojiPesach},

  {mm: Iyyar, dd: 14, desc: 'Pesach Sheni', flags: MINOR_HOLIDAY},
  {mm: Iyyar, dd: 18, desc: 'Lag BaOmer', flags: MINOR_HOLIDAY, emoji: '🔥'},
  {mm: Sivan, dd: 5, desc: 'Erev Shavuot',
    flags: EREV | LIGHT_CANDLES, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 6, desc: 'Shavuot',
    flags: IL_ONLY | CHAG | YOM_TOV_ENDS, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 6, desc: 'Shavuot I',
    flags: CHUL_ONLY | CHAG | LIGHT_CANDLES_TZEIS, emoji: '⛰️🌸'},
  {mm: Sivan, dd: 7, desc: 'Shavuot II',
    flags: CHUL_ONLY | CHAG | YOM_TOV_ENDS, emoji: '⛰️🌸'},
  {mm: Av, dd: 15, desc: 'Tu B\'Av',
    flags: MINOR_HOLIDAY, emoji: '❤️'},
  {mm: Elul, dd: 1, desc: 'Rosh Hashana LaBehemot',
    flags: MINOR_HOLIDAY, emoji: '🐑'},
  {mm: Elul, dd: 29, desc: 'Erev Rosh Hashana',
    flags: EREV | LIGHT_CANDLES, emoji: '🍏🍯'},
];

export const staticModernHolidays = [
  {firstYear: 5727, mm: Iyyar, dd: 28, desc: 'Yom Yerushalayim',
    chul: true},
  {firstYear: 5737, mm: Kislev, dd: 6, desc: 'Ben-Gurion Day',
    satPostponeToSun: true, friPostponeToSun: true},
  {firstYear: 5750, mm: Shvat, dd: 30, desc: 'Family Day',
    suppressEmoji: true},
  {firstYear: 5758, mm: Cheshvan, dd: 12, desc: 'Yitzhak Rabin Memorial Day'},
  {firstYear: 5764, mm: Iyyar, dd: 10, desc: 'Herzl Day',
    satPostponeToSun: true},
  {firstYear: 5765, mm: Tamuz, dd: 29, desc: 'Jabotinsky Day',
    satPostponeToSun: true},
  {firstYear: 5769, mm: Cheshvan, dd: 29, desc: 'Sigd',
    chul: true, suppressEmoji: true},
  {firstYear: 5777, mm: Nisan, dd: 10, desc: 'Yom HaAliyah',
    chul: true},
  {firstYear: 5777, mm: Cheshvan, dd: 7, desc: 'Yom HaAliyah School Observance'},
];
