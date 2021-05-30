#!/usr/bin/env node
// vim: set filetype=javascript:
 /* eslint-disable */
'use strict';
const program = require('commander');
const { reportCommand, initCommand, reportFromConfigCommand } = require('../dist/vue-i18n-extract.umd.js');

program
  .command('init', { isDefault: false })
  .action(initCommand);

program
  .command('use-config', { isDefault: true })
  .action(reportFromConfigCommand);

program
  .command('report', { isDefault: false })
  .description('Create a report from a glob of your Vue.js source files and your language files.')
  .requiredOption(
    '-v, --vueFiles <vueFiles>',
    'The Vue.js file(s) you want to extract i18n strings from. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern)',
  )
  .requiredOption(
    '-l, --languageFiles <languageFiles>',
    'The language file(s) you want to compare your Vue.js file(s) to. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern) ',
  )
  .option(
    '-o, --output <output>',
    'Use if you want to create a json file out of your report. (ex. -o output.json)',
  )
  .option(
    '-a, --add',
    'Use if you want to add missing keys into your json language files.',
  )
  .option(
    '-ci',
    'The process will exit with exitCode=1 if at least one translation-key is missing (useful expecially if it is part of a CI pipeline).',
  )
  .action(reportCommand);


program.parseAsync(process.argv);
