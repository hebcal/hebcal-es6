/* eslint-disable require-jsdoc */
import fs from 'fs';

const inpath = process.argv[2];
const outpath = process.argv[3];

const contents = fs.readFileSync(inpath).toString();
const manifest = JSON.parse(contents);
const line = `/** DO NOT EDIT THIS AUTO-GENERATED FILE! */
export const version = '${manifest.version}';\n`;

fs.writeFileSync(outpath, line, {flags: 'w'});
