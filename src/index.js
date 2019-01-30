/* eslint-disable */
require = require('esm')(module);
/* eslint-enable */
const { argv } = require('yargs')
  .alias('src', 's')
  .describe('src', 'The source folder of your VueJS files.')
  .alias('langFolder', 'l')
  .describe('langFolder', 'Path of your "lang" folder')
  .demand(['src', 'langFolder']);

const lib = require('./lib');

async function main() {
  // Get the config5
  const { src, langFolder } = argv;
  // Get list of target files
  const targetVueFilesList = lib.getFilesContent(`${src}/**/*.vue`);
  // Exctract the i18n placeholders from the given files
  const matches = await lib.extractText(targetVueFilesList);
  // Parse the strings and build a JS object using the dot notation
  const generatedObj = lib.dotToObj(matches);
  // Get lang files content
  const langFiles = lib.parseLangFiles(`${langFolder}/*.js`);
  // Merge the generated object with the lang obj and save the differences
  const newLangFiles = langFiles.map(f => lib.addNewTextsToLangObj(f, generatedObj));
  // Show the report
  newLangFiles.forEach(f => lib.reportDiff(f));
}

main();
