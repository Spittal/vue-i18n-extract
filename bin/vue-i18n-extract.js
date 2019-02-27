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
  .describe('langFolder', 'The language file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern), ... ')
  .alias('keyAsFallback', 'k')
  .describe('keyAsFallback', 'use if you do not use dot notation for your keys but instead use the key as the translation value for fallback purposes. Default: False')
  .demand(['src', 'langFolder']);

const api = require('../src/api');

async function main() {
  // Get the config5
  const { src, langFolder, keyAsFallback } = argv;
  // Analyse Vue Files
  const vueFilesAnalysis = await api.analyzeVueFiles(src, keyAsFallback);
  // Analyse Lang Files
  const languageFilesAnalysis = api.analyzeLanguageFiles(langFolder);
  // i18n analysis
  const analyzeI18n = await languageFilesAnalysis.map(l => api.analyzeI18n(l, vueFilesAnalysis));
  // Extract unused keys
  const analyzeUnusedKeys = await languageFilesAnalysis.map(
    l => api.analyzeUnusedKeys(vueFilesAnalysis, l),
  );

  analyzeI18n.forEach(a => api.logReport(a, 'Missing i18n entry'));
  // Show results as a console.log
  analyzeUnusedKeys.forEach(a => api.logReportUnusedKeys(a, 'Unused language file entries'));
}

main();
