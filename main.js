const shell = require('shelljs');
const fs = require('fs');
const pipe = require('pipe-functions');
const lib = require('./lib');
const ssearch = require('string-search');
const async = require("async");
const dot = require('dot-object');

const { argv } = require('yargs')
  .alias('src', 's')
  .describe('src', 'The source folder of your VueJS files.')
  .alias('output', 'o')
  .describe('output', 'The file where you want to write the output.')
  .alias('plugin', 'p')
  .default('plugin', '$t')
  .describe('plugin', 'The VueJS i18n plugin object')
  .demand(['src', 'output', 'plugin']);

const content = [];

function extractMatches(filesList) {
  return new Promise(function(resolve, reject) {
    async.eachSeries(filesList, function (file, callback) {
      ssearch.find(file.content, /(\$t\(')(.*)('\))/gi).then((res) => {
        if(res.length > 0) {
          res.forEach(r => {
            content.push({
              line: r.line,
              text: r.text.substring(r.text.lastIndexOf('$t(\'') + 4, r.text.lastIndexOf('\')')),
              file: file.name,
            });
          });
        }
        callback();
      });
    }, function (err) {
      if (err) { console.log(err); }
      resolve(content);
    });
  });
}

function transformToObject(matches) {
  const obj = {};
  matches.forEach((el) => {
    obj[el.text] = el.text;
  });
  return dot.object(obj);
};

async function main() {
  // Get the config
  const { src, output } = argv;
  
  // Clean the output
  shell.rm('-f', output);
  
  // Get the list of target files
  const targetFilesList = lib.readFilesContent(`/Users/raffaele.pizzari/Projects/xbav/manager/app/javascript/spa/**/*.vue`);
  
  // Extract matches
  const matches = await extractMatches(targetFilesList);
  
  // Create object
  const generatedObj = transformToObject(matches);
}

main();
