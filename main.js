const shell = require('shelljs');
const fs = require('fs');
const pipe = require('pipe-functions');
const lib = require('./lib');

const { argv } = require('yargs')
  .alias('src', 's')
  .describe('src', 'The source folder of your VueJS files.')
  .alias('output', 'o')
  .describe('output', 'The file where you want to write the output.')
  .alias('plugin', 'p')
  .default('plugin', '$t')
  .describe('plugin', 'The VueJS i18n plugin object')
  .demand(['src', 'output', 'plugin']);


const { src, output } = argv;

shell.rm('-f', output);

pipe(
  lib.readFilesContent(`${src}/**/*.vue`),
  lib.mergeFilesContent,
  lib.extractLocs,
  lib.normalizeStrings,
  lib.transformToObject,
  console.log,
);
