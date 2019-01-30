/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */

const fs = require('fs');
const glob = require('glob');
const ssearch = require('string-search');
const async = require('async');
const dot = require('dot-object');
const acorn = require('acorn');
const babel = require('@babel/core');
const deepMerge = require('lodash.merge');
const cloneDeep = require('lodash.clonedeep');
const deepDiff = require('deep-diff');
const chalk = require('chalk');
const Table = require('cli-table3');

module.exports = {
  reportDiff(source) {
    const table = new Table({
      colors: true,
      style: {
        head: ['green'],
        border: ['white'],
        compact: true,
      },
      head: ['#', 'Language file', 'Missing i18n entries'],
      colWidths: [6, 20, 90],
    });

    const filename = source.name.replace(/^.*[\\\/]/, '')

    let index = 1;
    source.diff.forEach((s) => {
      table.push([index, filename, s]);
      index += 1;
    });
    /* eslint-disable */
    console.log(table.toString());
    /* eslint-enable */
  },

  getFilesContent(src) {
    const targetFiles = glob.sync(src);
    return targetFiles.map(f => Object.assign({}, { name: f, content: fs.readFileSync(f, 'utf8') }));
  },

  parseRhs(rhs) {
    return Object.entries(rhs).reduce((accumulator, currentValue) => {
      if (typeof currentValue[1] === 'string') {
        return [...accumulator, currentValue[1]];
      }
      const prhs = this.parseRhs(currentValue[1]);
      return [...accumulator, ...prhs];
    }, []);
  },

  extractItemsFromRhsDiff(obj) {
    if (typeof obj === 'string') {
      return obj;
    }
    if (typeof obj.rhs === 'string') {
      return obj.rhs;
    }
    return Object.entries(obj.rhs).reduce((acc, currentValue) => {
      if (typeof currentValue[1] === 'object') {
        const parseRhs = this.parseRhs(currentValue[1]);
        return [...acc, ...parseRhs];
      }
      return [...acc, currentValue[1]];
    }, []);
  },

  addNewTextsToLangObj(lang, generatedObj) {
    const { default: langObj } = lang.content;
    const newObj = deepMerge(cloneDeep(langObj), cloneDeep(generatedObj));
    const diff = deepDiff(langObj, newObj).filter(d => d.kind === 'N');

    const diffElements = [];
    diff.forEach((d) => {
      const extr = this.extractItemsFromRhsDiff(d);
      if (Array.isArray(extr)) {
        diffElements.push(...extr);
      } else {
        diffElements.push(extr);
      }
    });
    return {
      name: lang.name,
      oldObj: lang.content,
      diff: diffElements,
      newObj,
    };
  },

  parseLangFiles(src) {
    const targetFiles = glob.sync(src);
    /* eslint-disable */
    return targetFiles.map(f => Object.assign({}, { name: f, content: require(f) }));
    /* eslint-enable */
  },

  extractText(filesList) {
    const content = [];
    return new Promise((resolve) => {
      async.eachSeries(filesList, (file, callback) => {
        ssearch.find(file.content, /(\$t\(')(.*)('\))/gi).then((res) => {
          if (res.length > 0) {
            res.forEach((r) => {
              content.push({
                line: r.line,
                text: r.text.substring(r.text.lastIndexOf('$t(\'') + 4, r.text.lastIndexOf('\')')),
                file: file.name,
              });
            });
          }
          callback();
        });
      }, (err) => {
        if (err) {
          /* eslint-disable */
          console.log(err); 
          /* eslint-enable */
        }
        resolve(content);
      });
    });
  },

  dotToObj(matches) {
    const obj = {};
    matches.forEach((el) => {
      obj[el.text] = el.text;
    });
    return dot.object(obj);
  },
};
