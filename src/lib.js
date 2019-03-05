/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const dot = require('dot-object');
const ssearch = require('string-search');
const deepMerge = require('lodash.merge');
const cloneDeep = require('lodash.clonedeep');
const deepDiff = require('deep-diff');
const Table = require('cli-table3');
const isValidGlob = require('is-valid-glob');

module.exports = {
  logReportUnusedKeys(analysis, title) {
    const table = new Table({
      colors: true,
      style: {
        head: ['yellow'],
        border: ['white'],
        compact: true,
      },
      head: ['#', 'Language', title],
      colWidths: [4, 12, 40],
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

  logReport(analysis, title) {
    const table = new Table({
      colors: true,
      style: {
        head: ['green'],
        border: ['white'],
        compact: true,
      },
      head: ['#', 'Language', 'File', 'Line', title],
      colWidths: [4, 12, 40, 8, 30],
    });

    let index = 1;
    analysis.missingEntries.forEach((s) => {
      table.push([index, analysis.filename, s.file, s.line, s.text]);
      index += 1;
    });
    /* eslint-disable */
    console.log(table.toString());
    /* eslint-enable */
  },

  readVueFiles(src) {
    if (!isValidGlob(src)) {
      throw new Error('Src folder isn\'\t a valid glob pattern.');
    }
    const targetFiles = glob.sync(src);
    return targetFiles.map(f => Object.assign({}, { name: f, content: fs.readFileSync(f, 'utf8') }));
  },

  readLangFiles(src) {
    const targetFiles = glob.sync(src);
    /* eslint-disable */
    return targetFiles.map((f) => {
      const validPath = null;
      const langPath = path.resolve(process.cwd(), f)
      const langModule = require(langPath);
      const { default: defaultImport } = langModule;
      const langObj = (defaultImport) ? defaultImport : langModule;
      return Object.assign({}, { name: f, content: langObj });
    });
    /* eslint-enable */
  },

  convertDotToObject(matches) {
    const obj = {};
    matches.forEach((el) => {
      if (el.includes(' ')) {
        throw new Error(`Found key "${el}" is not valid dot notation. If your keys are full translations for fallback purposes considering using the -k argument in your command.`);
      }
      obj[el] = el;
    });
    console.log(obj);

    return dot.object(obj);
  },

  extractI18nStringsFromFilesCollection(filesCollection) {
    return new Promise(async (resolve) => {
      const keysInFile = await Promise.all(
        filesCollection.map(async file => [
          ...await this.searchAndReplaceForMethods(file),
          ...await this.searchAndReplaceForComponent(file),
          ...await this.searchAndReplaceForDirective(file),
        ]),
      );
      resolve(keysInFile.flat(1));
    });
  },

  async searchAndReplaceForMethods(file) {
    const content = [];
    const methodRegex = /\$?tc?\(["'`](.*)["'`]/;
    // use string-search for getting the line number
    // but it doesn't return the RegEX capture group so...
    const res = await ssearch.find(file.content, methodRegex);
    if (res.length > 0) {
      res.forEach((r) => {
        // We can use the RegEX exec method to get the capture group
        // This removes the need for string replacement
        const key = methodRegex.exec(r.text)[1];
        content.push(this.createI18nItem(r, key, file));
      });
    }
    return content;
  },

  async searchAndReplaceForComponent(file) {
    const content = [];
    const componentRegex = /(?:<i18n|<I18N)(?:.|\s)*(?:path=(?:"|'))(.*)(?:"|')/;
    const res = await ssearch.find(file.content, componentRegex);
    if (res.length > 0) {
      res.forEach((r) => {
        const key = componentRegex.exec(r.text)[1];
        content.push(this.createI18nItem(r, key, file));
      });
    }
    return content;
  },

  async searchAndReplaceForDirective(file) {
    const content = [];
    const directiveRegex = /v-t="'(.*)'"/;
    const res = await ssearch.find(file.content, directiveRegex);
    if (res.length > 0) {
      res.forEach((r) => {
        const key = directiveRegex.exec(r.text)[1];
        content.push(this.createI18nItem(r, key, file));
      });
    }
    return content;
  },

  createI18nItem(r, text, file) {
    return {
      line: r.line,
      text,
      file: file.name,
    };
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

  buildDiffRep(diff, lang, fixedEntries, astInfo) {
    let diffElements = [];
    diff.forEach((d) => {
      const extr = this.extractItemsFromRhsDiff(d);
      if (Array.isArray(extr)) {
        diffElements.push(...extr);
      } else {
        diffElements.push(extr);
      }
    });

    diffElements = [...new Set(diffElements)];
    if (astInfo) {
      diffElements = diffElements.map((e) => {
        const entry = astInfo.filter(a => a.text === e);
        return entry[0];
      });
    }
    return {
      filename: lang.filename,
      currentEntries: lang.content,
      missingEntries: diffElements,
      fixedEntries,
    };
  },

  diffLangVueStrings(lang, vueFilesAnaylsis) {
    const fixedEntries = deepMerge(
      cloneDeep(lang.content),
      cloneDeep(vueFilesAnaylsis.generatedObj),
    );
    const diff = deepDiff(lang.content, vueFilesAnaylsis.generatedObj).filter(d => d.kind === 'N');
    return this.buildDiffRep(diff, lang, fixedEntries, vueFilesAnaylsis.astInfo);
  },

  diffVueLangStrings(lang, generatedObj) {
    const fixedEntries = deepMerge(cloneDeep(lang.content), cloneDeep(generatedObj));
    const diff = deepDiff(generatedObj, lang.content).filter(d => d.kind === 'N');
    return this.buildDiffRep(diff, lang, fixedEntries);
  },
};
