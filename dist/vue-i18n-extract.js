var cac = require('cac');
var fs = require('fs');
var path = require('path');
var isValidGlob = require('is-valid-glob');
var glob = require('glob');
var dot = require('dot-object');
var yaml = require('js-yaml');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cac__default = /*#__PURE__*/_interopDefaultLegacy(cac);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var isValidGlob__default = /*#__PURE__*/_interopDefaultLegacy(isValidGlob);
var glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
var dot__default = /*#__PURE__*/_interopDefaultLegacy(dot);
var yaml__default = /*#__PURE__*/_interopDefaultLegacy(yaml);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var defaultConfig = {
  // Options documented in vue-i18n-extract readme.
  vueFiles: './src/**/*.?(js|vue)',
  languageFiles: './lang/**/*.?(json|yaml|yml|js)',
  output: false,
  add: false,
  ci: false
};

function initCommand() {
  fs__default['default'].writeFileSync(path__default['default'].resolve(process.cwd(), './vue-i18n-extract.config.js'), `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`);
}
function resolveConfig() {
  const argvOptions = cac__default['default']().parse(process.argv, {
    run: false
  }).options;

  try {
    const pathToConfigFile = path__default['default'].resolve(process.cwd(), './vue-i18n-extract.config.js'); // eslint-disable-next-line @typescript-eslint/no-var-requires

    const configFile = require(pathToConfigFile);

    console.info(`\n[vue-i18n-extract] Using config file found at ${pathToConfigFile}`);
    return _extends({}, configFile, argvOptions);
  } catch (_unused) {
    return argvOptions;
  }
}

function readVueFiles(src) {
  if (!isValidGlob__default['default'](src)) {
    throw new Error(`vueFiles isn't a valid glob pattern.`);
  }

  const targetFiles = glob__default['default'].sync(src);

  if (targetFiles.length === 0) {
    throw new Error('vueFiles glob has no files.');
  }

  return targetFiles.map(f => {
    const fileName = f.replace(process.cwd(), '');
    return {
      fileName,
      path: f,
      content: fs__default['default'].readFileSync(f, 'utf8')
    };
  });
}

function* getMatches(file, regExp, captureGroup = 1) {
  while (true) {
    const match = regExp.exec(file.content);

    if (match === null) {
      break;
    }

    const path = match[captureGroup];
    const pathAtIndex = file.content.indexOf(path);
    const previousCharacter = file.content.charAt(pathAtIndex - 1);
    const nextCharacter = file.content.charAt(pathAtIndex + path.length);
    const line = (file.content.substring(0, match.index).match(/\n/g) || []).length + 1;
    yield {
      path,
      previousCharacter,
      nextCharacter,
      file: file.fileName,
      line
    };
  }
}
/**
 * Extracts translation keys from methods such as `$t` and `$tc`.
 *
 * - **regexp pattern**: (?:[$ .]tc?)\(
 *
 *   **description**: Matches the sequence t( or tc(, optionally with either “$”, “.” or “ ” in front of it.
 *
 * - **regexp pattern**: (["'`])
 *
 *   **description**: 1. capturing group. Matches either “"”, “'”, or “`”.
 *
 * - **regexp pattern**: ((?:[^\\]|\\.)*?)
 *
 *   **description**: 2. capturing group. Matches anything except a backslash
 *   *or* matches any backslash followed by any character (e.g. “\"”, “\`”, “\t”, etc.)
 *
 * - **regexp pattern**: \1
 *
 *   **description**: matches whatever was matched by capturing group 1 (e.g. the starting string character)
 *
 * @param file a file object
 * @returns a list of translation keys found in `file`.
 */


function extractMethodMatches(file) {
  const methodRegExp = /(?:[$ .]tc?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g;
  return [...getMatches(file, methodRegExp, 2)];
}

function extractComponentMatches(file) {
  const componentRegExp = /(?:<(?:i18n|Translation))(?:.|\n)*?(?:[^:]path=("|'))((?:[^\\]|\\.)*?)\1/gi;
  return [...getMatches(file, componentRegExp, 2)];
}

function extractDirectiveMatches(file) {
  const directiveRegExp = /v-t="'((?:[^\\]|\\.)*?)'"/g;
  return [...getMatches(file, directiveRegExp)];
}

function extractI18nItemsFromVueFiles(sourceFiles) {
  return sourceFiles.reduce((accumulator, file) => {
    const methodMatches = extractMethodMatches(file);
    const componentMatches = extractComponentMatches(file);
    const directiveMatches = extractDirectiveMatches(file);
    return [...accumulator, ...methodMatches, ...componentMatches, ...directiveMatches];
  }, []);
}

function parseVueFiles(vueFilesPath) {
  const filesList = readVueFiles(vueFilesPath);
  return extractI18nItemsFromVueFiles(filesList);
}

function readLangFiles(src) {
  if (!isValidGlob__default['default'](src)) {
    throw new Error(`languageFiles isn't a valid glob pattern.`);
  }

  const targetFiles = glob__default['default'].sync(src);

  if (targetFiles.length === 0) {
    throw new Error('languageFiles glob has no files.');
  }

  return targetFiles.map(f => {
    const langPath = path__default['default'].resolve(process.cwd(), f);
    const extension = langPath.substring(langPath.lastIndexOf('.')).toLowerCase();
    const isJSON = extension === '.json';
    const isYAML = extension === '.yaml' || extension === '.yml';
    let langObj;

    if (isJSON) {
      langObj = JSON.parse(fs__default['default'].readFileSync(langPath, 'utf8'));
    } else if (isYAML) {
      langObj = yaml__default['default'].load(fs__default['default'].readFileSync(langPath, 'utf8'));
    } else {
      langObj = eval(fs__default['default'].readFileSync(langPath, 'utf8'));
    }

    const fileName = f.replace(process.cwd(), '');
    return {
      path: f,
      fileName,
      content: JSON.stringify(langObj)
    };
  });
}

function extractI18nItemsFromLanguageFiles(languageFiles) {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));

    if (!accumulator[language]) {
      accumulator[language] = [];
    }

    const flattenedObject = dot__default['default'].dot(JSON.parse(file.content));
    Object.keys(flattenedObject).forEach((key, index) => {
      accumulator[language].push({
        path: key,
        file: file.fileName,
        line: index
      });
    });
    return accumulator;
  }, {});
}

function writeMissingToLanguage(resolvedLanguageFiles, missingKeys) {
  const languageFiles = readLangFiles(resolvedLanguageFiles);
  languageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content);
    missingKeys.forEach(item => {
      if (item.language && languageFile.fileName.includes(item.language) || !item.language) {
        dot__default['default'].str(item.path, '', languageFileContent);
      }
    });
    const fileExtension = languageFile.fileName.substring(languageFile.fileName.lastIndexOf('.') + 1);
    const filePath = languageFile.path;
    const stringifiedContent = JSON.stringify(languageFileContent, null, 2);

    if (fileExtension === 'json') {
      fs__default['default'].writeFileSync(filePath, stringifiedContent);
    } else if (fileExtension === 'js') {
      const jsFile = `export default ${stringifiedContent}; \n`;
      fs__default['default'].writeFileSync(filePath, jsFile);
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      const yamlFile = yaml__default['default'].dump(languageFileContent);
      fs__default['default'].writeFileSync(filePath, yamlFile);
    }
  });
}
function parseLanguageFiles(languageFilesPath) {
  const filesList = readLangFiles(languageFilesPath);
  return extractI18nItemsFromLanguageFiles(filesList);
}

function stripBounding(item) {
  return {
    path: item.path,
    file: item.file,
    line: item.line
  };
}

function mightBeDynamic(item) {
  return item.path.includes('${') && !!item.previousCharacter.match(/`/g) && !!item.nextCharacter.match(/`/g);
} // Looping through the arays multiple times might not be the most effecient, but it's the easiest to read and debug. Which at this scales is an accepted trade-off.


function extractI18NReport(vueItems, languageFiles) {
  const missingKeys = [];
  const unusedKeys = [];
  const maybeDynamicKeys = vueItems.filter(vueItem => mightBeDynamic(vueItem)).map(vueItem => stripBounding(vueItem));
  Object.keys(languageFiles).forEach(language => {
    const languageItems = languageFiles[language];
    const missingKeysInLanguage = vueItems.filter(vueItem => !mightBeDynamic(vueItem)).filter(vueItem => !languageItems.some(languageItem => vueItem.path === languageItem.path)).map(vueItem => _extends({}, stripBounding(vueItem), {
      language
    }));
    const unusedKeysInLanguage = languageItems.filter(languageItem => !vueItems.some(vueItem => languageItem.path === vueItem.path || languageItem.path.startsWith(vueItem.path + '.'))).map(languageItem => _extends({}, languageItem, {
      language
    }));
    missingKeys.push(...missingKeysInLanguage);
    unusedKeys.push(...unusedKeysInLanguage);
  });
  return {
    missingKeys,
    unusedKeys,
    maybeDynamicKeys
  };
}
async function writeReportToFile(report, writePath) {
  const reportString = JSON.stringify(report);
  return new Promise((resolve, reject) => {
    fs__default['default'].writeFile(writePath, reportString, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function createI18NReport(vueFiles, languageFiles) {
  const resolvedVueFiles = path__default['default'].resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles = path__default['default'].resolve(process.cwd(), languageFiles);
  const parsedVueFiles = parseVueFiles(resolvedVueFiles);
  const parsedLanguageFiles = parseLanguageFiles(resolvedLanguageFiles);
  return extractI18NReport(parsedVueFiles, parsedLanguageFiles);
}
async function reportCommand(command) {
  const {
    vueFiles,
    languageFiles,
    output,
    add,
    ci
  } = command;
  const report = createI18NReport(vueFiles, languageFiles);
  if (report.missingKeys.length) console.info('\nMissing Keys'), console.table(report.missingKeys);
  if (report.unusedKeys.length) console.info('\nUnused Keys'), console.table(report.unusedKeys);
  if (report.maybeDynamicKeys.length) console.warn('\nSuspected Dynamic Keys Found\nvue-i18n-extract does not compile Vue templates and therefore can not infer the correct key for the following keys.'), console.table(report.maybeDynamicKeys);

  if (output) {
    await writeReportToFile(report, path__default['default'].resolve(process.cwd(), output));
    console.info(`\nThe report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys.length) {
    const resolvedLanguageFiles = path__default['default'].resolve(process.cwd(), languageFiles);
    writeMissingToLanguage(resolvedLanguageFiles, report.missingKeys);
    console.info('\nThe missing keys have been added to your languages files');
  }

  if (ci && report.missingKeys.length) {
    console.info(`[vue-i18n-extract] ${report.missingKeys.length} missing keys found.`);
    process.exit(1);
  }

  process.exit(0);
}

exports.createI18NReport = createI18NReport;
exports.extractI18NReport = extractI18NReport;
exports.initCommand = initCommand;
exports.parseLanguageFiles = parseLanguageFiles;
exports.parseVueFiles = parseVueFiles;
exports.readVueFiles = readVueFiles;
exports.reportCommand = reportCommand;
exports.resolveConfig = resolveConfig;
exports.writeMissingToLanguage = writeMissingToLanguage;
exports.writeReportToFile = writeReportToFile;
//# sourceMappingURL=vue-i18n-extract.js.map
