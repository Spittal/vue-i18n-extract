import ssearch from 'string-search';
import { SimpleFile, I18NItem } from './models';

export async function extractI18nItemsFromVueFiles (sourceFiles: SimpleFile[]): Promise<I18NItem[]> {
  return new Promise(async (resolve) => {
    const keysInFileCollection: any[] = await Promise.all(
      sourceFiles.map(async (file: SimpleFile) => [
        ...await searchAndReplaceForMethods(file),
        ...await searchAndReplaceForComponent(file),
        ...await searchAndReplaceForDirective(file),
      ] as any[]),
    );
    resolve(keysInFileCollection.flat(1));
  });
}

async function searchAndReplaceForMethods (file: SimpleFile): Promise<I18NItem[]> {
  const content: I18NItem[] = [];
  const methodRegex: RegExp = /\$?tc?\(["'`](.*)["'`]/;
  // use string-search for getting the line number
  // but it doesn't return the RegEX capture group so...
  const res: StringSearchResult[] = await ssearch.find(file.content, methodRegex);
  if (res.length > 0) {
    res.forEach((r) => {
      // We can use the RegEX exec method to get the capture group
      // This removes the need for string replacement
      const path = methodRegex.exec(r.text)[1];
      content.push(createI18nItem(r, path, file));
    });
  }
  return content;
}

async function searchAndReplaceForComponent (file: SimpleFile): Promise<I18NItem[]> {
  const content: I18NItem[] = [];
  const componentRegex: RegExp = /(?:<i18n|<I18N)(?:.|\s)*(?:path=(?:"|'))(.*)(?:"|')/;
  const res: StringSearchResult[] = await ssearch.find(file.content, componentRegex);
  if (res.length > 0) {
    res.forEach((r) => {
      const path = componentRegex.exec(r.text)[1];
      content.push(createI18nItem(r, path, file));
    });
  }
  return content;
}

async function searchAndReplaceForDirective (file: SimpleFile): Promise<I18NItem[]> {
  const content: I18NItem[] = [];
  const directiveRegex: RegExp = /v-t="'(.*)'"/;
  const res: StringSearchResult[] = await ssearch.find(file.content, directiveRegex);
  if (res.length > 0) {
    res.forEach((r) => {
      const path = directiveRegex.exec(r.text)[1];
      content.push(createI18nItem(r, path, file));
    });
  }
  return content;
}

function createI18nItem (r: StringSearchResult, path: string, file: SimpleFile): I18NItem {
  return {
    line: r.line,
    path,
    file: file.fileName,
  };
}
