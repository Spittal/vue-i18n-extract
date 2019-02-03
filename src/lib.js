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
const isValidGlob = require('is-valid-glob');

module.exports = {
  logReport(analysis) {
    const table = new Table({
      colors: true,
      style: {
        head: ['green'],
        border: ['white'],
        compact: true,
      },
      head: ['#', 'Language file', 'Missing i18n entries'],
      colWidths: [6, 15, 70],
    });

    let index = 1;
    analysis.missingEntries.forEach((s) => {
      table.push([index, analysis.filename, s]);
      index += 1;
    });
    /* eslint-disable */
    console.log(table.toString());
    /* eslint-enable */
  },

  readVueFiles(src) {
    if (!isValidGlob(src)) {
      throw new Error('Src folder isn\'\t a valid grob pattern.');
    }
    const targetFiles = glob.sync(src);
    return targetFiles.map(f => Object.assign({}, { name: f, content: fs.readFileSync(f, 'utf8') }));
  },

  readLangFiles(src) {
    const targetFiles = glob.sync(src);
    /* eslint-disable */
    return targetFiles.map((f) => {
      const validPath = null;
      const langModule = require(`../${f}`);
      const { default: langObj } = langModule;
      return Object.assign({}, { name: f, content: langObj });
    });
    /* eslint-enable */
  },

  convertDotToObject(matches) {
    const obj = {};
    matches.forEach((el) => {
      obj[el] = el;
    });
    return dot.object(obj);
  },

  extractI18nStringsFromFilesCollection(filesCollection) {
    const content = [];
    return new Promise((resolve) => {
      async.eachSeries(filesCollection, (file, callback) => {
        ssearch.find(file.content, /[$ ]t\(['`](.*)['`]\)/gi).then((res) => {
          if (res.length > 0) {
            res.forEach((r) => {
              let { text } = r;
              text = text.replace('$t(\'', 'i18nSTART###');
              text = text.replace('$t(`', 'i18nSTART###');
              text = text.replace(' t(`', 'i18nSTART###');
              text = text.replace(' t(\'', 'i18nSTART###');
              text = text.replace('\')', '###i18nEND');
              text = text.replace('`)', '###i18nEND');
              content.push({
                line: r.line,
                text: text.substring(text.lastIndexOf('i18nSTART###') + 12, text.lastIndexOf('###i18nEND')),
                file: file.name,
              });
            });
          }
          callback();
        });
      }, (err) => {
        if (err) /* eslint-disable */ throw new Error(err); /* eslint-enable */
        resolve(content);
      });
    });
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

  diffLangVueStrings(lang, generatedObj) {
    const fixedEntries = deepMerge(cloneDeep(lang.content), cloneDeep(generatedObj));
    const diff = deepDiff(lang.content, fixedEntries).filter(d => d.kind === 'N');

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
      filename: lang.filename,
      currentEntries: lang.content,
      missingEntries: diffElements,
      fixedEntries,
    };
  },
};
