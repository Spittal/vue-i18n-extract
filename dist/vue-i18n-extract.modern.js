import fs from 'fs';
import path from 'path';
import isValidGlob from 'is-valid-glob';
import glob from 'glob';
import dot from 'dot-object';
import yaml from 'js-yaml';

var defaultConfig = {
  // Options documented in vue-i18n-extract readme.
  vueFiles: './src/**/*.?(js|vue)',
  languageFiles: './lang/**/*.?(json|yaml|yml|js)',
  output: false,
  add: false,
  ci: false
};

function initCommand() {
  fs.writeFileSync(path.resolve(process.cwd(), './vue-i18n-extract.config.js'), `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`);
}
function resolveConfig() {
  try {
    const pathToConfigFile = path.resolve(process.cwd(), './vue-i18n-extract.config.js'); // eslint-disable-next-line @typescript-eslint/no-var-requires

    const configFile = require(pathToConfigFile);

    console.info(`\n[vue-i18n-extract] Using config file found at ${pathToConfigFile}\n`);
    const argsFromConfigFile = Object.keys(configFile).map(key => `--${key}`).reduce((accumulator, key, index) => {
      const value = Object.values(configFile)[index];

      if (value) {
        return [...accumulator, key, ...(value === true ? [] : [value])];
      }

      return accumulator;
    }, []);
    const argv = [...process.argv, ...argsFromConfigFile];
    return argv;
  } catch (e) {
    return process.argv;
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
    const fileName = f.replace(process.cwd(), '');
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
  const methodRegExp = /(?:[$ .]tc?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g;
  return [...getMatches(file, methodRegExp, 2)];
}

function extractComponentMatches(file) {
  const componentRegExp = /(?:<i18n)(?:.|\n)*?(?:[^:]path=("|'))((?:[^\\]|\\.)*?)\1/gi;
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

function writeMissingToLanguage(resolvedLanguageFiles, missingKeys) {
  const languageFiles = readLangFiles(resolvedLanguageFiles);
  languageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content);
    missingKeys.forEach(item => {
      if (item.language && languageFile.fileName.includes(item.language) || !item.language) {
        dot.str(item.path, '', languageFileContent);
      }
    });
    const fileExtension = languageFile.fileName.substring(languageFile.fileName.lastIndexOf('.') + 1);
    const filePath = languageFile.path;
    const stringifiedContent = JSON.stringify(languageFileContent, null, 2);

    if (fileExtension === 'json') {
      fs.writeFileSync(filePath, stringifiedContent);
    } else if (fileExtension === 'js') {
      const jsFile = `export default ${stringifiedContent}; \n`;
      fs.writeFileSync(filePath, jsFile);
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      const yamlFile = yaml.dump(languageFileContent);
      fs.writeFileSync(filePath, yamlFile);
    }
  });
}
function parseLanguageFiles(languageFilesPath) {
  const filesList = readLangFiles(languageFilesPath);
  return extractI18nItemsFromLanguageFiles(filesList);
}

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
    fs.writeFile(writePath, reportString, err => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function createI18NReport(vueFiles, languageFiles) {
  const resolvedVueFiles = path.resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);
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
    await writeReportToFile(report, path.resolve(process.cwd(), output));
    console.info(`\nThe report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys.length) {
    const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);
    writeMissingToLanguage(resolvedLanguageFiles, report.missingKeys);
    console.info('\nThe missing keys have been added to your languages files');
  }

  if (ci && report.missingKeys.length) {
    console.info(`[vue-i18n-extract] ${report.missingKeys.length} missing keys found.`);
    process.exit(1);
  }

  console.log('hi');
  process.exit(0);
}

export { createI18NReport, extractI18NReport, initCommand, parseLanguageFiles, parseVueFiles, readVueFiles, reportCommand, resolveConfig, writeMissingToLanguage, writeReportToFile };
//# sourceMappingURL=vue-i18n-extract.modern.js.map
