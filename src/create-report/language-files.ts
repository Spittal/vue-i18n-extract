import path from 'path';
import fs from 'fs';
import glob from 'glob';
import dot from 'dot-object';
import yaml from 'js-yaml';
import isValidGlob from 'is-valid-glob';
import { SimpleFile, I18NLanguage, I18NItem } from '../types';

export function readLanguageFiles (src: string): SimpleFile[] {
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

    return { path: f, fileName, content: JSON.stringify(langObj) };
  });
}

export function extractI18NLanguageFromLanguageFiles (languageFiles: SimpleFile[]): I18NLanguage {
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
        line: index,
      });
    });

    return accumulator;
  }, {});
}

export function writeMissingToLanguageFiles (parsedLanguageFiles: SimpleFile[], missingKeys: I18NItem[]): void {
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

export function removeUnusedFromLanguageFiles (parsedLanguageFiles: SimpleFile[], unusedKeys: I18NItem[]): void {
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

function writeLanguageFile (languageFile: SimpleFile, newLanguageFileContent: unknown) {
  const fileExtension = languageFile.fileName.substring(languageFile.fileName.lastIndexOf('.') + 1);
    const filePath = languageFile.path;
    const stringifiedContent = JSON.stringify(newLanguageFileContent, null, 2);

    if (fileExtension === 'json') {
      fs.writeFileSync(filePath, stringifiedContent);
    } else if (fileExtension === 'js') {
      const jsFile = `export default ${stringifiedContent}; \n`;
      fs.writeFileSync(filePath, jsFile);
    } else if (fileExtension === 'yaml' || fileExtension === 'yml') {
      const yamlFile = yaml.dump(newLanguageFileContent);
      fs.writeFileSync(filePath, yamlFile);
    } else {
      throw new Error(`Language filetype of ${fileExtension} not supported.`)
    }
}

// This is a convenience function for users implementing in their own projects, and isn't used internally
export function parselanguageFiles (languageFiles: string): I18NLanguage {
  return extractI18NLanguageFromLanguageFiles(readLanguageFiles(languageFiles));
}
