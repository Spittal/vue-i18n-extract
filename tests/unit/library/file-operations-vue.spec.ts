import { extractI18nItemsFromVueFiles, readVueFiles } from '@/library/index';
import { SimpleFile, I18NItem } from '@/library/models';
import path from 'path';

describe('file-operations-vue.ts', () => {
  it('Extract supported i18n strings from a collection of file paths', () => {
    const src: string = path.resolve(__dirname, '../fixtures/vue-files/**/*.?(js|vue)');
    const filesCollection: SimpleFile[] = readVueFiles(src);
    const results: I18NItem[] = extractI18nItemsFromVueFiles(filesCollection);
    expect(results.length).toEqual(16);
  });
});
