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
const api = require('../src/api');

async function main() {
  // Get the config5
  const { src, langFolder } = argv;
  // Analyse Vue Files
  const vueFilesAnalysis = await api.analyzeVueFiles(src);
  // Analyse Lang Files
  const languageFilesAnalysis = api.analyzeLanguageFiles(langFolder);
  // i18n analysis
  const analysis = await languageFilesAnalysis.map(l => api.analyzeI18n(l, vueFilesAnalysis));

  // Show results as a console.log
  analysis.forEach(a => api.logReport(a));
}

main();
