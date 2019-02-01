#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the vue-i18n-extract command.
 * @author Raffaele Pizzari <raffaele.pizzari@gmail.com>
 */

/* eslint-disable */
require = require('esm')(module);
/* eslint-enable */
const { argv } = require('yargs')
  .alias('src', 's')
  .describe('src', 'The file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern), ... ')
  .alias('langFolder', 'l')
  .describe('langFolder', 'The language file/files (note: is must be ES6 Module) you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern), ... ')
  .demand(['src', 'langFolder']);

const lib = require('../src/lib');

async function main() {
  // Get the config5
  const { src, langFolder } = argv;
  // Get list of target files
  const filesList = lib.readVueFiles(src);
  // Exctract the i18n placeholders from the given files
  const matches = await lib.extractI18nStringsFromFilesCollection(filesList);
  // Parse the strings and build a JS object using the dot notation
  // const ma = matches.map(m => m.text);
  const generatedObj = lib.convertDotToObject(matches.map(m => m.text));
  // Get lang files content
  const langFiles = lib.readLangFiles(langFolder);
  // Merge the generated object with the lang obj and save the differences
  const newLangFiles = langFiles.map(f => lib.addNewTextsToLangObj(f, generatedObj));
  // Show the report
  newLangFiles.forEach(f => lib.reportDiff(f));
}

main();
