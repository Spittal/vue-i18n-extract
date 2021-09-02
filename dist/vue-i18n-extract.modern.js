import cac from 'cac';
import fs from 'fs';
import path from 'path';
import isValidGlob from 'is-valid-glob';
import glob from 'glob';
import Dot from 'dot-object';
import yaml from 'js-yaml';

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
  remove: false,
  ci: false,
  separator: '.'
};

function initCommand() {
  fs.writeFileSync(path.resolve(process.cwd(), './vue-i18n-extract.config.js'), `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`);
}
function resolveConfig() {
  const argvOptions = cac().parse(process.argv, {
    run: false
  }).options;

  try {
    const pathToConfigFile = path.resolve(process.cwd(), './vue-i18n-extract.config.js'); // eslint-disable-next-line @typescript-eslint/no-var-requires

    const configFile = require(pathToConfigFile);

    console.info(`\nUsing config file found at ${pathToConfigFile}`);
    return _extends({}, configFile, argvOptions);
  } catch (_unused) {
    return argvOptions;
  }
}

function readVueFiles(src) {
  if (!isValidGlob(src)) {
    throw new Error(`vueFiles isn't a valid glob pattern.`);
  }

  const targetFiles = glob.sync(src);

  if (targetFiles.length === 0) {
    throw new Error('vueFiles glob has no files.');
  }

  return targetFiles.map(f => {
    const fileName = f.replace(process.cwd(), '.');
    return {
      fileName,
      path: f,
      content: fs.readFileSync(f, 'utf8')
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
  const methodRegExp = /(?:[$ ."'`]t[cm]?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g;
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

function extractI18NItemsFromVueFiles(sourceFiles) {
  return sourceFiles.reduce((accumulator, file) => {
    const methodMatches = extractMethodMatches(file);
    const componentMatches = extractComponentMatches(file);
    const directiveMatches = extractDirectiveMatches(file);
    return [...accumulator, ...methodMatches, ...componentMatches, ...directiveMatches];
  }, []);
} // This is a convenience function for users implementing in their own projects, and isn't used internally

function parseVueFiles(vueFiles) {
  return extractI18NItemsFromVueFiles(readVueFiles(vueFiles));
}

function readLanguageFiles(src) {
  if (!isValidGlob(src)) {
    throw new Error(`languageFiles isn't a valid glob pattern.`);
  }

  const targetFiles = glob.sync(src);

  if (targetFiles.length === 0) {
    throw new Error('languageFiles glob has no files.');
  }

  return targetFiles.map(f => {
    const langPath = path.resolve(process.cwd(), f);
    const extension = langPath.substring(langPath.lastIndexOf('.')).toLowerCase();
    const isJSON = extension === '.json';
    const isYAML = extension === '.yaml' || extension === '.yml';
    let langObj;

    if (isJSON) {
      langObj = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    } else if (isYAML) {
      langObj = yaml.load(fs.readFileSync(langPath, 'utf8'));
    } else {
      langObj = eval(fs.readFileSync(langPath, 'utf8'));
    }

    const fileName = f.replace(process.cwd(), '.');
    return {
      path: f,
      fileName,
      content: JSON.stringify(langObj)
    };
  });
}
function extractI18NLanguageFromLanguageFiles(languageFiles, dot = Dot) {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));

    if (!accumulator[language]) {
      accumulator[language] = [];
    }

    const flattenedObject = dot.dot(JSON.parse(file.content));
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
function writeMissingToLanguageFiles(parsedLanguageFiles, missingKeys, dot = Dot) {
  parsedLanguageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content);
    missingKeys.forEach(item => {
      if (item.language && languageFile.fileName.includes(item.language) || !item.language) {
        dot.str(item.path, '', languageFileContent);
      }
    });
    writeLanguageFile(languageFile, languageFileContent);
  });
}
function removeUnusedFromLanguageFiles(parsedLanguageFiles, unusedKeys, dot = Dot) {
  parsedLanguageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content);
    unusedKeys.forEach(item => {
      if (item.language && languageFile.fileName.includes(item.language)) {
        dot.delete(item.path, languageFileContent);
      }
    });
    writeLanguageFile(languageFile, languageFileContent);
  });
}

function writeLanguageFile(languageFile, newLanguageFileContent) {
  const fileExtension = languageFile.fileName.substring(languageFile.fileName.lastIndexOf('.') + 1);
  const filePath = languageFile.path;
  const stringifiedContent = JSON.stringify(newLanguageFileContent, null, 2);

  if (fileExtension === 'json') {
    fs.writeFileSync(filePath, stringifiedContent);
  } else if (fileExtension === 'js') {
    const jsFile = `module.exports = ${stringifiedContent}; \n`;
    fs.writeFileSync(filePath, jsFile);
  } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
    const yamlFile = yaml.dump(newLanguageFileContent);
    fs.writeFileSync(filePath, yamlFile);
  } else {
    throw new Error(`Language filetype of ${fileExtension} not supported.`);
  }
} // This is a convenience function for users implementing in their own projects, and isn't used internally


function parselanguageFiles(languageFiles, dot = Dot) {
  return extractI18NLanguageFromLanguageFiles(readLanguageFiles(languageFiles), dot);
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
} // Looping through the arays multiple times might not be the most effecient, but it's the easiest to read and debug. Which at this scale is an accepted trade-off.


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
    fs.writeFile(writePath, reportString, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

async function createI18NReport(options) {
  const {
    vueFiles: vueFilesGlob,
    languageFiles: languageFilesGlob,
    output,
    add,
    remove,
    ci,
    separator
  } = options;
  if (!vueFilesGlob) throw new Error('Required configuration vueFiles is missing.');
  if (!languageFilesGlob) throw new Error('Required configuration languageFiles is missing.');
  const dot = typeof separator === 'string' ? new Dot(separator) : Dot;
  const vueFiles = readVueFiles(path.resolve(process.cwd(), vueFilesGlob));
  const languageFiles = readLanguageFiles(path.resolve(process.cwd(), languageFilesGlob));
  const I18NItems = extractI18NItemsFromVueFiles(vueFiles);
  const I18NLanguage = extractI18NLanguageFromLanguageFiles(languageFiles, dot);
  const report = extractI18NReport(I18NItems, I18NLanguage);
  if (report.missingKeys.length) console.info('\nMissing Keys'), console.table(report.missingKeys);
  if (report.unusedKeys.length) console.info('\nUnused Keys'), console.table(report.unusedKeys);
  if (report.maybeDynamicKeys.length) console.warn('\nSuspected Dynamic Keys Found\nvue-i18n-extract does not compile Vue templates and therefore can not infer the correct key for the following keys.'), console.table(report.maybeDynamicKeys);

  if (output) {
    await writeReportToFile(report, path.resolve(process.cwd(), output));
    console.info(`\nThe report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys.length) {
    writeMissingToLanguageFiles(languageFiles, report.missingKeys, dot);
    console.info('\nThe missing keys have been added to your language files.');
  }

  if (remove && report.unusedKeys.length) {
    removeUnusedFromLanguageFiles(languageFiles, report.unusedKeys, dot);
    console.info('\nThe unused keys have been removed from your language files.');
  }

  if (ci && report.missingKeys.length) {
    throw new Error(`${report.missingKeys.length} missing keys found.`);
  }

  if (ci && report.unusedKeys.length) {
    throw new Error(`${report.unusedKeys.length} unused keys found.`);
  }

  return report;
}

process.on('uncaughtException', err => {
  console.error('[vue-i18n-extract]', err);
  process.exit(1);
});
process.on('unhandledRejection', err => {
  console.error('[vue-i18n-extract]', err);
  process.exit(1);
});

export { createI18NReport, extractI18NItemsFromVueFiles, extractI18NLanguageFromLanguageFiles, extractI18NReport, initCommand, parseVueFiles, parselanguageFiles, readLanguageFiles, readVueFiles, removeUnusedFromLanguageFiles, resolveConfig, writeMissingToLanguageFiles, writeReportToFile };
//# sourceMappingURL=vue-i18n-extract.modern.js.map
