import { SimpleFile, I18NItemWithBounding } from '../types';
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
    const fileName = f.replace(process.cwd(), '.');
    return { fileName, path: f, content: fs.readFileSync(f, 'utf8') };
  });
}

function* getMatches (file: SimpleFile, regExp: RegExp, captureGroup = 1): IterableIterator<I18NItemWithBounding> {
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
      line,
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
 function extractMethodMatches (file: SimpleFile): I18NItemWithBounding[] {
  const methodRegExp = /(?:[$ ."'`]t[cm]?)\(\s*?(["'`])((?:[^\\]|\\.)*?)\1/g;
  return [ ...getMatches(file, methodRegExp, 2) ];
}

function extractComponentMatches (file: SimpleFile): I18NItemWithBounding[] {
  const componentRegExp = /(?:<(?:i18n|Translation))(?:.|\n)*?(?:[^:]path=("|'))((?:[^\\]|\\.)*?)\1/gi;
  return [ ...getMatches(file, componentRegExp, 2) ];
}

function extractDirectiveMatches (file: SimpleFile): I18NItemWithBounding[] {
  const directiveRegExp = /v-t="'((?:[^\\]|\\.)*?)'"/g;
  return [ ...getMatches(file, directiveRegExp) ];
}

export function extractI18NItemsFromVueFiles (sourceFiles: SimpleFile[]): I18NItemWithBounding[] {
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
  }, [] as I18NItemWithBounding[]);
}

// This is a convenience function for users implementing in their own projects, and isn't used internally
export function parseVueFiles (vueFiles: string): I18NItemWithBounding[] {
  return extractI18NItemsFromVueFiles(readVueFiles(vueFiles));
}
