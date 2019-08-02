// mocking ...
jest.mock('@/library/log-tables');

import fs from 'fs';
import Api from '@/Api';
import path from 'path';
import logTables from '@/library/log-tables'
import { I18NItem, I18NLanguage, I18NReport } from '@/library/models';

describe('Api.ts', () => {
  let api: Api;
  let spyLogMissingKeys;
  let spyLogUnusedKeys;
  let spyWriteFile;

  beforeEach(() => {
    api = new Api();
    spyLogMissingKeys = jest.spyOn(logTables, 'logMissingKeys');
    spyLogMissingKeys.mockImplementation((keys) => {});
    spyLogUnusedKeys = jest.spyOn(logTables, 'logUnusedKeys');
    spyLogUnusedKeys.mockImplementation((keys) => {});
    spyWriteFile = jest.spyOn(fs, 'writeFile');
    spyWriteFile.mockImplementation((path, content, fn) => fn());
  });

  afterEach(() => {
    spyWriteFile.mockClear();
    spyLogUnusedKeys.mockClear();
    spyLogMissingKeys.mockClear();
  });

  it('function: parseVueFiles', () => {
    const src: string = path.resolve(__dirname, './fixtures/vue-files/**/*.?(js|vue)');
    const extractedI18NItems: I18NItem[] = api.parseVueFiles(src);
    expect(extractedI18NItems).toHaveLength(16);
  });

  it('function: parseLanguageFiles', () => {
    const src: string = path.resolve(__dirname, './fixtures/language-files/**/*.?(js|json)');
    const extractedI18NLanguage: I18NLanguage = api.parseLanguageFiles(src);
    expect(extractedI18NLanguage).toHaveProperty('en_EN');
    expect(extractedI18NLanguage.en_EN).toHaveLength(10);
    expect(extractedI18NLanguage).toHaveProperty('de_DE');
    expect(extractedI18NLanguage.de_DE).toHaveLength(9);
  });

  it('function: createI18NReport', () => {
    const vueSrc: string = path.resolve(__dirname, './fixtures/vue-files/**/*.?(js|vue)');
    const langSrc: string = path.resolve(__dirname, './fixtures/language-files/**/*.?(js|json)');

    const report: I18NReport = api.createI18NReport(vueSrc, langSrc);

    expect(report.missingKeys).toEqual([
      {
        file: '/tests/unit/fixtures/vue-files/file1.js',
        language: 'de_DE',
        line: 2,
        path: 'missing.a',
      },
      {
        file: '/tests/unit/fixtures/vue-files/file2.js',
        language: 'de_DE',
        line: 2,
        path: 'missing.b',
      },
      {
        file: '/tests/unit/fixtures/vue-files/file3.vue',
        language: 'de_DE',
        line: 2,
        path: 'Missing',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'de_DE',
        line: 2,
        path: 'missing.c',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'de_DE',
        line: 4,
        path: 'missing.d',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'de_DE',
        line: 1,
        path: 'header.paragraphs.english_only',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'de_DE',
        line: 2,
        path: 'missing.e',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'de_DE',
        line: 3,
        path: 'missing.f.a',
      },
      {
        file: '/tests/unit/fixtures/vue-files/file1.js',
        language: 'en_EN',
        line: 2,
        path: 'missing.a',
      },
      {
        file: '/tests/unit/fixtures/vue-files/file2.js',
        language: 'en_EN',
        line: 2,
        path: 'missing.b',
      },
      {
        file: '/tests/unit/fixtures/vue-files/file3.vue',
        language: 'en_EN',
        line: 2,
        path: 'Missing',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'en_EN',
        line: 2,
        path: 'missing.c',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/file3.vue',
        language: 'en_EN',
        line: 4,
        path: 'missing.d',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'en_EN',
        line: 2,
        path: 'missing.e',
      },
      {
        file: '/tests/unit/fixtures/vue-files/folder/folder 2/file4.vue',
        language: 'en_EN',
        line: 3,
        path: 'missing.f.a',
      },
    ]);
  });

  it('function: logI18NReport', () => {
    const vueSrc: string = path.resolve(__dirname, './fixtures/vue-files/**/*.?(js|vue)');
    const langSrc: string = path.resolve(__dirname, './fixtures/language-files/**/*.?(js|json)');
    const report: I18NReport = api.createI18NReport(vueSrc, langSrc);

    api.logI18NReport(report);

    expect(spyLogMissingKeys).toHaveBeenCalledTimes(1);
    expect(spyLogMissingKeys.mock.calls[0][0]).toEqual(report['missingKeys']);
    expect(spyLogUnusedKeys).toHaveBeenCalledTimes(1);
    expect(spyLogUnusedKeys.mock.calls[0][0]).toEqual(report['unusedKeys']);
  });

  it('function: writeReportToFile', async () => {
    const vueSrc: string = path.resolve(__dirname, './fixtures/vue-files/**/*.?(js|vue)');
    const langSrc: string = path.resolve(__dirname, './fixtures/language-files/**/*.?(js|json)');
    const report: I18NReport = api.createI18NReport(vueSrc, langSrc);

    await api.writeReportToFile(report, './path/to/output.json');

    expect(spyWriteFile).toHaveBeenCalledTimes(1);
    expect(spyWriteFile.mock.calls[0][1]).toEqual(JSON.stringify(report))
  });
});
