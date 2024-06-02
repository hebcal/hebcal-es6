/* eslint-disable require-jsdoc */
const fs = require('fs');
const path = require('path');
const parser = require('ttag-cli/dist/src/lib/parser');
const utils = require('ttag-cli/dist/src/lib/utils');

for (const arg of process.argv.slice(2)) {
  const outpath = './src/' + path.basename(arg) + '.ts';
  console.log(`${arg} => ${outpath}`);
  writePoFile(arg, outpath, false);
}

function writePoFile(inpath, outpath, nostrip) {
  const poData = parser.parse(
      fs.readFileSync(inpath).toString().normalize(),
  );
  const messages = utils.iterateTranslations(poData.translations);
  if (!nostrip) {
    const header = messages.next().value;
    delete header.comments;
    for (const msg of messages) {
      delete msg.comments;
    }
  }
  const outstream = fs.createWriteStream(outpath, {flags: 'w'});
  outstream.write('export default ');
  outstream.write(JSON.stringify(utils.convert2Compact(poData), null, 0));
  outstream.end();
}
