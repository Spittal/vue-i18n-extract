import { extractI18nItemsFromVueFiles, readVueFiles } from '@/library/index';
import { SimpleFile, I18NItem } from '@/library/models';
import path from 'path';

describe('file-operations-vue.ts', () => {
  it('extracts supported i18n strings from a collection of file paths', () => {
    const src: string = path.resolve(__dirname, '../fixtures/vue-files/**/*.?(js|vue)');
    const filesCollection: SimpleFile[] = readVueFiles(src);
    const results: I18NItem[] = extractI18nItemsFromVueFiles(filesCollection);
    expect(results.length).toEqual(28);
  });

  it('extracts translation keys from methods correctly', () => {
    const testFiles = [
      {
        content: `$t('Natural-language key with spaces')`,
        translationKey: 'Natural-language key with spaces',
        fileName: '',
        path: ''
      },
      {
        content: `$t('path.without.spaces')`,
        translationKey: 'path.without.spaces',
        fileName: '',
        path: ''
      },
      {
        content: `$t('Don\\'t leave me behind!')`,
        translationKey: 'Don\\\'t leave me behind!',
        fileName: '',
        path: ''
      },
      {
        content: `$t('Early ' string termination')`,
        translationKey: 'Early ',
        fileName: '',
        path: ''
      },
      {
        content: `$t("Early " string termination")`,
        translationKey: 'Early ',
        fileName: '',
        path: ''
      },
      {
        content: `$t(\`Escaped backtick: \\\`\`)`,
        translationKey: 'Escaped backtick: \\\`',
        fileName: '',
        path: ''
      },
      {
        content: `$t('Nested "quotes"')`,
        translationKey: 'Nested "quotes"',
        fileName: '',
        path: ''
      },
      {
        content: `$t(
          'Argument on new line'
        )`,
        translationKey: 'Argument on new line',
        fileName: '',
        path: ''
      },
    ]

    const results = extractI18nItemsFromVueFiles(testFiles);
    for (let i = 0; i < results.length; i++) {
      expect(testFiles[i].translationKey).toBe(results[i].path)
    }
  });
});
