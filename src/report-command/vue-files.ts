import { SimpleFile, I18NItem } from '../types';
import isValidGlob from 'is-valid-glob';
import glob from 'glob';
import fs from 'fs';

export function readVueFiles (src: string): SimpleFile[] {
  if (!isValidGlob(src)) {
    throw new Error(`vueFiles isn't a valid glob pattern.`);
  }

  const targetFiles = glob.sync(src);

  if (targetFiles.length === 0) {
    throw new Error('vueFiles glob has no files.');
  }

  return targetFiles.map((f) => {
    const fileName = f.replace(process.cwd(), '');
    return { fileName, path: f, content: fs.readFileSync(f, 'utf8') };
  });
}

function* getMatches (file: SimpleFile, regExp: RegExp, captureGroup = 1): IterableIterator<I18NItem> {
  while (true) {
    const match = regExp.exec(file.content);
    if (match === null) {
      break;
    }
    const line = (file.content.substring(0, match.index).match(/\n/g) || []).length + 1;
    yield {
      path: match[captureGroup],
      line,
      file: file.fileName,
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
 function extractMethodMatches (file: SimpleFile): I18NItem[] {
  const methodRegExp = /(?:[$ .]tc?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g;
  return [ ...getMatches(file, methodRegExp, 2) ];
}

function extractComponentMatches (file: SimpleFile): I18NItem[] {
  const componentRegExp = /(?:<i18n|<I18N)(?:.|\n)*?(?:[^:]path=("|'))(.*?)\1/g;
  return [ ...getMatches(file, componentRegExp, 2) ];
}

function extractDirectiveMatches (file: SimpleFile): I18NItem[] {
  const directiveRegExp = /v-t="'(.*?)'"/g;
  return [ ...getMatches(file, directiveRegExp) ];
}

function extractI18nItemsFromVueFiles (sourceFiles: SimpleFile[]): I18NItem[] {
  return sourceFiles.reduce((accumulator, file) => {
    const methodMatches = extractMethodMatches(file);
    const componentMatches = extractComponentMatches(file);
    const directiveMatches = extractDirectiveMatches(file);
    return [
      ...accumulator,
      ...methodMatches,
      ...componentMatches,
      ...directiveMatches,
    ];
  }, [] as I18NItem[]);
}

export function parseVueFiles (vueFilesPath: string): I18NItem[] {
  const filesList = readVueFiles(vueFilesPath);
  return extractI18nItemsFromVueFiles(filesList);
}
