import path from 'path';
import fs from 'fs';
import glob from 'glob';
import dot from 'dot-object';
import yaml from 'js-yaml';
import isValidGlob from 'is-valid-glob';
import { SimpleFile, I18NLanguage, I18NItem } from '../types';

import esm from 'esm';
require = esm(module);

function readLangFiles (src: string): SimpleFile[] {
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
    const isYaml = extension === '.yaml' || extension === '.yml';

    const langModule = (isYaml) ? yaml.safeLoad(fs.readFileSync(langPath, 'utf8')) : require(langPath);
    const langObj = (langModule.default) ? langModule.default : langModule;

    const fileName = f.replace(process.cwd(), '');

    return { fileName, path: f, content: JSON.stringify(langObj) };
  });
}

function extractI18nItemsFromLanguageFiles (languageFiles: SimpleFile[]): I18NLanguage {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));

    const flattenedObject = dot.dot(JSON.parse(file.content));
    const i18nInFile = Object.keys(flattenedObject).map((key, index) => {
      return {
        line: index,
        path: key,
        file: file.fileName,
      };
    });

    accumulator[language] = i18nInFile;
    return accumulator;
  }, {});
}

export function writeMissingToLanguage (resolvedLanguageFiles: string, missingKeys: I18NItem[]): void {
  const languageFiles = readLangFiles(resolvedLanguageFiles);
  languageFiles.forEach(languageFile => {
    const languageFileContent = JSON.parse(languageFile.content);

    missingKeys.forEach(item => {
      if (item.language && languageFile.fileName.includes(item.language) || !item.language) {
        dot.str(item.path, '', languageFileContent);
      }
    });

    const fileExtension = languageFile.fileName.substring(languageFile.fileName.lastIndexOf('.') + 1);
    const filePath = path.resolve(process.cwd() + languageFile.fileName);
    const stringifiedContent = JSON.stringify(languageFileContent, null, 2);

    if (fileExtension === 'json') {
      fs.writeFileSync(filePath, stringifiedContent);
    } else if (fileExtension === 'js') {
      const jsFile = `export default ${stringifiedContent}; \n`;
      fs.writeFileSync(filePath, jsFile);
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      const yamlFile = yaml.safeDump(languageFileContent);
      fs.writeFileSync(filePath, yamlFile);
    }
  });
}

export function parseLanguageFiles (languageFilesPath: string): I18NLanguage {
  const filesList = readLangFiles(languageFilesPath);
  return extractI18nItemsFromLanguageFiles(filesList);
}
