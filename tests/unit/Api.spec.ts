import Api from '@/Api';
import path from 'path';
import { I18NItem, I18NLanguage, Report } from '@/library/models';

describe('Api.ts', () => {
  let api: Api;

  beforeEach(() => {
    api = new Api();
  });

  it('function: parseVueFiles', async () => {
    const src: string = path.resolve(__dirname, './fixtures/vue-files/**/*.?(js|vue)');
    const extractedI18NItems: I18NItem[] = await api.parseVueFiles(src);
    expect(extractedI18NItems).toHaveLength(13);
  });

  it('function: parseLanguageFiles', async () => {
    const src: string = path.resolve(__dirname, './fixtures/language-files/**/*.?(js|json)');
    const extractedI18NLanguage: I18NLanguage = await api.parseLanguageFiles(src);
    expect(extractedI18NLanguage).toHaveProperty('en_EN');
    expect(extractedI18NLanguage.en_EN).toHaveLength(7);
    expect(extractedI18NLanguage).toHaveProperty('de_DE');
    expect(extractedI18NLanguage.de_DE).toHaveLength(6);
  });

  it('function: createReport', async () => {
    const vueSrc: string = path.resolve(__dirname, './fixtures/vue-files/**/*.?(js|vue)');
    const extractedI18NItems: I18NItem[] = await api.parseVueFiles(vueSrc);
    const langSrc: string = path.resolve(__dirname, './fixtures/language-files/**/*.?(js|json)');
    const extractedI18NLanguage: I18NLanguage = await api.parseLanguageFiles(langSrc);

    const report: Report = api.createReport(extractedI18NItems, extractedI18NLanguage);

    expect(report.missingKeys).toEqual([
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/file1.js',
        language: 'de_DE',
        line: 2,
        path: 'missing.a',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/file2.js',
        language: 'de_DE',
        line: 2,
        path: 'missing.b',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/file3.vue',
        language: 'de_DE',
        line: 2,
        path: 'Missing',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'de_DE',
        line: 2,
        path: 'missing.c',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'de_DE',
        line: 4,
        path: 'missing.d',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'de_DE',
        line: 1,
        path: 'header.paragraphs.english_only',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'de_DE',
        line: 2,
        path: 'missing.e',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'de_DE',
        line: 3,
        path: 'missing.f.a',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/file1.js',
        language: 'en_EN',
        line: 2,
        path: 'missing.a',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/file2.js',
        language: 'en_EN',
        line: 2,
        path: 'missing.b',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/file3.vue',
        language: 'en_EN',
        line: 2,
        path: 'Missing',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'en_EN',
        line: 2,
        path: 'missing.c',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'en_EN',
        line: 4,
        path: 'missing.d',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'en_EN',
        line: 2,
        path: 'missing.e',
      },
      {
        file: '/Users/jamie/web/vue-i18n-extract/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'en_EN',
        line: 3,
        path: 'missing.f.a',
      },
    ]);
  });
});
