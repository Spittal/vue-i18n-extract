require = require("esm")(module);
// module.exports = require("./index.js");

const shell = require('shelljs');
const lib = require('./lib');

const { argv } = require('yargs')
  .alias('src', 's')
  .describe('src', 'The source folder of your VueJS files.')
  .alias('report', 'o')
  .describe('report', 'The file where you want to write the report.')
  .alias('lang_folder', 'l')
  .describe('lang-folder', 'Where you place the language files (examples: en_EN.js, de_DE.js)')
  .demand(['src', 'report', 'lang_folder']);

async function main() {
  // Get the config5
  const { src, report, lang_folder } = argv;
  
  // Clean the log file
  shell.rm('-f', report);
  
  // Get list of target files
  const targetVueFilesList = lib.getFilesContent(`${src}/**/*.vue`);
  
  // Exctract the i18n placeholders from the given files
  const matches = await lib.extractText(targetVueFilesList);
  
  // Parse the strings and build a JS object using the dot notation
  const generatedObj = lib.dotToObj(matches);
  
  // Get lang files content
  const langFiles = lib.parseLangFiles(`${lang_folder}/*.js`);
  
  // Merge the generated object with the lang obj and save the differences
  newLangFiles = langFiles.map(f => lib.addNewTextsToLangObj(f, generatedObj));

  // Show the report
  newLangFiles.forEach(f => lib.reportDiff(f));
}

main();
