'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var yargs = _interopDefault(require('yargs'));
var Table = _interopDefault(require('cli-table3'));
var isValidGlob = _interopDefault(require('is-valid-glob'));
var glob = _interopDefault(require('glob'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var ssearch = _interopDefault(require('string-search'));
var dot = _interopDefault(require('dot-object'));

function logMissingKeys(keys) {
  const table = new Table({
    style: {
      head: ['green'],
      border: ['white'],
      compact: true
    },
    head: ['#', 'Language', 'File', 'Line', 'Missing i18n Entry'],
    colWidths: [4, 12, 40, 8, 30]
  });
  keys.forEach((key, i) => {
    table.push([i, key.language, key.file, key.line, key.path]);
  }); // tslint:disable-next-line

  console.log(table.toString());
}
function logUnusedKeys(keys) {
  const table = new Table({
    style: {
      head: ['yellow'],
      border: ['white'],
      compact: true
    },
    head: ['#', 'Language', 'File', 'Line', 'Unused i18n Entry'],
    colWidths: [4, 12, 40]
  });
  keys.forEach((key, i) => {
    table.push([i, key.language, key.file, key.line, key.path]);
  }); // tslint:disable-next-line

  console.log(table.toString());
}

require = require('esm')(module);
function readVueFiles(src) {
  if (!isValidGlob(src)) {
    throw new Error('Src folder isn\'\t a valid glob pattern.');
  }

  const targetFiles = glob.sync(src);
  return targetFiles.map(f => {
    return {
      fileName: f,
      path: f,
      content: fs.readFileSync(f, 'utf8')
    };
  });
}
function readLangFiles(src) {
  if (!isValidGlob(src)) {
    throw new Error('langFolder folder isn\'\t a valid glob pattern.');
  }

  const targetFiles = glob.sync(src);
  return targetFiles.map(f => {
    const langPath = path.resolve(process.cwd(), f);

    const langModule = require(langPath);

    const {
      default: defaultImport
    } = langModule;
    const langObj = defaultImport ? defaultImport : langModule;
    return {
      fileName: f,
      path: f,
      content: langObj
    };
  });
}

function diffParsedSources(parsedSourceA, parsedSourceB) {
  const sourceBPaths = parsedSourceB.map(item => item.path);
  return parsedSourceA.filter(i18nItem => {
    return sourceBPaths.indexOf(i18nItem.path) === -1;
  });
}

async function extractI18nItemsFromVueFiles(sourceFiles) {
  return new Promise(async resolve => {
    const keysInFileCollection = await Promise.all(sourceFiles.map(async file => [...(await searchAndReplaceForMethods(file)), ...(await searchAndReplaceForComponent(file)), ...(await searchAndReplaceForDirective(file))]));
    resolve(keysInFileCollection.flat(1));
  });
}

async function searchAndReplaceForMethods(file) {
  const content = [];
  const methodRegex = /\$?tc?\(["'`](.*)["'`]/; // use string-search for getting the line number
  // but it doesn't return the RegEX capture group so...

  const res = await ssearch.find(file.content, methodRegex);

  if (res.length > 0) {
    res.forEach(r => {
      // We can use the RegEX exec method to get the capture group
      // This removes the need for string replacement
      const path = methodRegex.exec(r.text)[1];
      content.push(createI18nItem(r, path, file));
    });
  }

  return content;
}

async function searchAndReplaceForComponent(file) {
  const content = [];
  const componentRegex = /(?:<i18n|<I18N)(?:.|\s)*(?:path=(?:"|'))(.*)(?:"|')/;
  const res = await ssearch.find(file.content, componentRegex);

  if (res.length > 0) {
    res.forEach(r => {
      const path = componentRegex.exec(r.text)[1];
      content.push(createI18nItem(r, path, file));
    });
  }

  return content;
}

async function searchAndReplaceForDirective(file) {
  const content = [];
  const directiveRegex = /v-t="'(.*)'"/;
  const res = await ssearch.find(file.content, directiveRegex);

  if (res.length > 0) {
    res.forEach(r => {
      const path = directiveRegex.exec(r.text)[1];
      content.push(createI18nItem(r, path, file));
    });
  }

  return content;
}

function createI18nItem(r, path, file) {
  return {
    line: r.line,
    path,
    file: file.fileName
  };
}

function extractI18nItemsFromLanguageFiles(languageFiles) {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));
    const flattenedObject = dot.dot(file.content);
    const i18nInFile = Object.keys(flattenedObject).map((key, index) => {
      return {
        line: index,
        path: key,
        file: file.fileName
      };
    });
    accumulator[language] = i18nInFile;
    return accumulator;
  }, {});
}

class API {
  async parseVueFiles(vueFilesPath) {
    const filesList = readVueFiles(vueFilesPath);
    return extractI18nItemsFromVueFiles(filesList);
  }

  parseLanguageFiles(langFilesPath) {
    const filesList = readLangFiles(langFilesPath);
    return extractI18nItemsFromLanguageFiles(filesList);
  }

  createReport(parsedVueFiles, parsedLanguageFiles) {
    const missingKeys = [];
    const unusedKeys = [];
    Object.keys(parsedLanguageFiles).forEach(language => {
      const languageMissingKeys = diffParsedSources(parsedVueFiles, parsedLanguageFiles[language]).map(item => Object.assign({}, item, {
        language
      }));
      missingKeys.push(...languageMissingKeys);
      const languageUnusedKeys = diffParsedSources(parsedLanguageFiles[language], parsedVueFiles).map(item => Object.assign({}, item, {
        language
      }));
      unusedKeys.push(...languageUnusedKeys);
    });
    return {
      missingKeys,
      unusedKeys
    };
  }

  logReport(report) {
    logMissingKeys(report.missingKeys);
    logUnusedKeys(report.unusedKeys);
  }

}

const srcOptions = {
  // tslint:disable-next-line:max-line-length
  describe: 'The file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern), ... ',
  demand: true,
  alias: 's'
};
const langFolderOptions = {
  // tslint:disable-next-line:max-line-length
  describe: 'The language file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern), ... ',
  demand: true,
  alias: 'l'
};
const argv = yargs.command('diff', 'Diff', {
  src: srcOptions,
  langFolder: langFolderOptions
}).help().demandCommand(1, '').showHelpOnFail(true);
async function run() {
  const command = argv.argv;

  switch (command._[0]) {
    case 'diff':
      diff(command);
      break;
  }
}

async function diff(command) {
  const api = new API();
  const {
    src,
    langFolder
  } = command;
  const parsedVueFiles = await api.parseVueFiles(src);
  const parsedLanguageFiles = api.parseLanguageFiles(langFolder);
  const report = api.createReport(parsedVueFiles, parsedLanguageFiles);
  api.logReport(report);
}

exports.default = run;
