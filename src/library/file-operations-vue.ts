import { SimpleFile, I18NItem } from './models';

export function extractI18nItemsFromVueFiles (sourceFiles: SimpleFile[]): I18NItem[] {
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
  }, []);
}

function extractMethodMatches (file: SimpleFile): I18NItem[] {
  const methodRegExp: RegExp = /(?:\$tc?| tc?)\(("|'|`)(.*?)\1/g;
  return [ ...getMatches(file, methodRegExp, 2) ];
}

function extractComponentMatches (file: SimpleFile): I18NItem[] {
  const componentRegExp: RegExp = /(?:<i18n|<I18N)(?:.|\n)*?(?:[^:]path=("|'))(.*?)\1/g;
  return [ ...getMatches(file, componentRegExp, 2) ];
}

function extractDirectiveMatches (file: SimpleFile): I18NItem[] {
  const directiveRegExp: RegExp = /v-t="'(.*)'"/g;
  return [ ...getMatches(file, directiveRegExp) ];
}

function* getMatches (file: SimpleFile, regExp: RegExp, captureGroup: number = 1): IterableIterator<I18NItem> {
  while (true) {
    const match: RegExpExecArray = regExp.exec(file.content);
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
