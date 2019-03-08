import { SimpleFile, I18NItem } from './models';

export function extractI18nItemsFromVueFiles (sourceFiles: SimpleFile[]): I18NItem[] {
  return sourceFiles.reduce((accumulator, file) => {
    const methodMatches = extractMethodMatches(file);
    const componentMatches = extractComponentMatches(file);
    const directiveMatches = extractDirectiveMatches(file);
    console.log(`${file.fileName}, method: ${methodMatches.length}, comp: ${componentMatches.length}, dir: ${directiveMatches.length}`);

    return [ ...accumulator, ...methodMatches, ...componentMatches, ...directiveMatches ];
  }, []);
}

function extractMethodMatches (file: SimpleFile): I18NItem[] {
  const methodRegExp: RegExp = /\$?tc?\(["'`](.*)["'`]/g;
  return [ ...getMatches(file, methodRegExp) ];
}

function extractComponentMatches (file: SimpleFile): I18NItem[] {
  const componentRegExp: RegExp = /(?:<i18n|<I18N)(?:.|\s)*(?:path=(?:"|'))(.*)(?:"|')/g;
  return [ ...getMatches(file, componentRegExp) ];
}

function extractDirectiveMatches (file: SimpleFile): I18NItem[] {
  const directiveRegExp: RegExp = /v-t="'(.*)'"/g;
  return [ ...getMatches(file, directiveRegExp) ];
}

function* getMatches (file: SimpleFile, regExp: RegExp): IterableIterator<I18NItem> {
  while (true) {
    const match = regExp.exec(file.content);
    if (match === null) {
      break;
    }
    const line = (file.content.substring(0, match.index).match(/\n/g) || []).length + 1;
    yield {
      path: match[1],
      line,
      file: file.fileName,
    };
  }
}
