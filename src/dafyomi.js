/*
    Hebcal - A Jewish Calendar Generator
    Copyright (c) 1994-2020 Danny Sadinoff
    Portions copyright Eyal Schachter and Michael J. Radwin

    https://github.com/hebcal/hebcal-es6

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import greg from './greg';
import { gettext } from 'ttag';

const shas = [
    [ "Berachot",       64      ],
    [ "Shabbat",        157     ],
    [ "Eruvin",         105     ],
    [ "Pesachim",       121     ],
    [ "Shekalim",       22      ],
    [ "Yoma",           88      ],
    [ "Sukkah",         56      ],
    [ "Beitzah",        40      ],
    [ "Rosh Hashana",   35      ],
    [ "Taanit",         31      ],
    [ "Megillah",       32      ],
    [ "Moed Katan",     29      ],
    [ "Chagigah",       27      ],
    [ "Yevamot",        122     ],
    [ "Ketubot",        112     ],
    [ "Nedarim",        91      ],
    [ "Nazir",          66      ],
    [ "Sotah",          49      ],
    [ "Gitin",          90      ],
    [ "Kiddushin",      82      ],
    [ "Baba Kamma",     119     ],
    [ "Baba Metzia",    119     ],
    [ "Baba Batra",     176     ],
    [ "Sanhedrin",      113     ],
    [ "Makkot",         24      ],
    [ "Shevuot",        49      ],
    [ "Avodah Zarah",   76      ],
    [ "Horayot",        14      ],
    [ "Zevachim",       120     ],
    [ "Menachot",       110     ],
    [ "Chullin",        142     ],
    [ "Bechorot",       61      ],
    [ "Arachin",        34      ],
    [ "Temurah",        34      ],
    [ "Keritot",        28      ],
    [ "Meilah",         22      ],
    [ "Kinnim",         4       ],
    [ "Tamid",          10      ],
    [ "Midot",          4       ],
    [ "Niddah",         73      ]
  ].map(m => {
    return {name: m[0], blatt: m[1]};
});

/**
 * A Daf Yomi result
 * @typedef {Object} DafYomiResult
 * @property {string} name Tractate name
 * @property {number} blatt Page number 
 */

/**
 * Returns the Daf Yomi for given date
 * @param {Date} gregdate Gregorian date
 * @returns {DafYomiResult} Tractact name and page number
 */
export function dafyomi(gregdate) {
    const dafcnt = 40;
    let cno;
    let dno;

    if (!(gregdate instanceof Date)) {
        throw new TypeError('non-date given to dafyomi');
    }

    let osday = greg.greg2abs(new Date(1923, 8, 11));
    let nsday = greg.greg2abs(new Date(1975, 5, 24));
    let cday = greg.greg2abs(gregdate);

    if (cday < osday) { // no cycle; dy didn't start yet
        return {name: [], blatt: 0};
    }
    if (cday >= nsday) { // "new" cycle
        cno = 8 + ( (cday - nsday) / 2711 );
        dno = (cday - nsday) % 2711;
    } else { // old cycle
        cno = 1 + ( (cday - osday) / 2702 );
        dno = (cday - osday) % 2702;
    }

    // Find the daf taking note that the cycle changed slightly after cycle 7.

    let total = 0;
    let blatt = 0;
    let count = -1;

    // Fix Shekalim for old cycles
    if (cno <= 7) {
        shas[4].blatt = 13;
    } else {
        shas[4].blatt = 22;
    }

    // Find the daf
    let j = 0;
    while (j < dafcnt) {
        count++;
        total = total + shas[j].blatt - 1;
        if (dno < total) {
            blatt = (shas[j].blatt + 1) - (total - dno);
            // fiddle with the weird ones near the end
            switch (count) {
                case 36:
                    blatt = blatt + 21;
                    break;
                case 37:
                    blatt = blatt + 24;
                    break;
                case 38:
                    blatt = blatt + 33;
                    break;
                default:
                    break;
            }
            // Bailout
            j = 1 + dafcnt;
        }
        j++;
    }

    return {name: shas[count].name, blatt};
}

/**
 * Formats (with translation) the dafyomi result as a string like "Pesachim 34"
 * @param {DafYomiResult} daf the Daf Yomi
 * @returns {string}
 */
export function dafname(daf) {
    return gettext(daf.name) + " " + daf.blatt;
}

const api = {
  dafyomi,
  dafname,
};
export default api;
