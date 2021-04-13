import path from 'path';
import fs from 'fs';
import glob from 'glob';
import dot from 'dot-object';
import yaml from 'js-yaml';
import isValidGlob from 'is-valid-glob';
import { LanguageFile, I18NLanguage, I18NItem } from '../types';

function readLangFiles (src: string): LanguageFile[] {
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
      langObj = yaml.safeLoad(fs.readFileSync(langPath, 'utf8'));
    } else {
      langObj = eval(fs.readFileSync(langPath, 'utf8'));
    }

    const fileName = f.replace(process.cwd(), '');

    return { fileName, path: f, content: langObj };
  });
}

function extractI18nItemsFromLanguageFiles (languageFiles: LanguageFile[]): I18NLanguage {
  return languageFiles.reduce((accumulator, file) => {
    const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));

    if (!accumulator[language]) {
      accumulator[language] = [];
    }

    const flattenedObject = dot.dot(file.content);
    Object.keys(flattenedObject).forEach((key, index) => {
      accumulator[language]?.push({
        line: index,
        path: key,
        file: file.fileName,
      });
    });

    return accumulator;
  }, {});
}

export class LanguageFileUpdater {
  languageFiles: LanguageFile[];
  hasChanges = false;

  constructor(languageFiles: string) {
    this.languageFiles = readLangFiles(path.resolve(process.cwd(), languageFiles));
  }

  addMissingKeys(missingKeys: I18NItem[]): void {
    this.hasChanges = true;
    this.languageFiles.forEach(languageFile => {
      missingKeys.forEach(item => {
        if (item.language && languageFile.fileName.includes(item.language) || !item.language) {
          dot.str(item.path, '', languageFile.content);
        }
      });
    });
  }

  removeUnusedKeys(unusedKeys: I18NItem[]): void {
    this.hasChanges = true;
    this.languageFiles.forEach(languageFile => {
      unusedKeys.forEach(item => {
        if (item.language && languageFile.fileName.includes(item.language)) {
          dot.delete(item.path, languageFile.content);
        }
      });
    });
  }

  writeChanges(): void {
    this.languageFiles.forEach(languageFile => {
      new FileAccessLayer(languageFile.path).write(languageFile.content);
    });
  }
}


class FileAccessLayer {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  write(content: Record<string, unknown>) {
    const rawJSON = JSON.stringify(content, null, 2);
    const endsWith = ext => this.path.endsWith(`.${ext}`);
    let stringifiedContent = "";

    if (endsWith('json')) {
      stringifiedContent = rawJSON;
    } else if (endsWith('js')) {
      stringifiedContent = `export default ${stringifiedContent}; \n`;
    } else if (endsWith('yaml') || endsWith('yml')) {
      stringifiedContent = yaml.safeDump(content);
    } else {
      throw new Error('Filetype not supported.')
    }
    fs.writeFileSync(this.path, stringifiedContent);
  }
  // TODO: Move reading into this class
}

export function parseLanguageFiles (languageFilesPath: string): I18NLanguage {
  const filesList = readLangFiles(languageFilesPath);
  return extractI18nItemsFromLanguageFiles(filesList);
}
