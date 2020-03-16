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
    throw new Error('languageFiles isn\'\t a valid glob pattern.');
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

    return { fileName, path: f, content: langObj };
  });
}

function extractI18nItemsFromLanguageFiles (languageFiles: SimpleFile[]): I18NLanguage {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));

    const flattenedObject = dot.dot(file.content);
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
  const globArray = glob.sync(resolvedLanguageFiles)
  const parsedContent = globArray
    .map(f => fs.readFileSync(f, 'utf8'))
    .map(i => JSON.parse(i));

  missingKeys.forEach(item => {
    parsedContent.forEach(i => dot.str(item.path, '', i));
  });

  const stringifyiedContent = parsedContent
    .map(i => JSON.stringify(i, null, 2));

  stringifyiedContent
    .forEach((i, index) => fs.writeFileSync(globArray[index], i));
}

export function parseLanguageFiles (languageFilesPath: string): I18NLanguage {
  const filesList: SimpleFile[] = readLangFiles(languageFilesPath);
  return extractI18nItemsFromLanguageFiles(filesList);
}
