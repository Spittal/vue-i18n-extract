/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const api = require('../api');

describe('API', () => {
  test('analyzeVueFiles', async () => {
    const src = './src/__tests__/test_demo_files/default/**/*.js';
    const { generatedObj } = await api.analyzeVueFiles(src);

    expect(Object.prototype.hasOwnProperty.call(generatedObj.test.a.b, 'c')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(generatedObj.test.c.d, 'e')).toBeTruthy();
  });

  test('analyzeVueFiles where key is not valid dot notation', async () => {
    const src = './src/__tests__/test_demo_files/key_as_fallback/**/*.js';
    await expect(api.analyzeVueFiles(src)).rejects.toThrow();
  });

  test('analyzeVueFiles with KeyAsFallback', async () => {
    const src = './src/__tests__/test_demo_files/key_as_fallback/**/*.?(js|vue)';
    const { generatedObj } = await api.analyzeVueFiles(src, true);
    const keys = Object.keys(generatedObj)

    keys.forEach(key => {
      expect(key).toBe(generatedObj[key]);
    });
  });

  test('analyzeLanguageFiles', async () => {
    const src = './src/__tests__/test_lang_files/*.?(js|json)';
    const langObj = await api.analyzeLanguageFiles(src);
    expect(langObj.length).toEqual(2);
    expect(langObj[0].filename).toEqual('de_DE.js');
    expect(langObj[1].filename).toEqual('en_EN.json');

    // Test .js
    expect(langObj[0].path).not.toBeNull();
    expect(langObj[0].content.header.paragraphs.p_b).toEqual('test');
    expect(langObj[0].content.header.titles.title_a).toEqual('test');

    // Test .json
    expect(langObj[1].path).not.toBeNull();
    expect(langObj[1].content.header.paragraphs.p_b).toEqual('test');
    expect(langObj[1].content.header.titles.title_a).toEqual('test');
  });

  test('analyzeI18n', async () => {
    const vueI18nStrings = await api.analyzeVueFiles('./src/__tests__/test_demo_files/default/**/*.js');
    const langObj = await api.analyzeLanguageFiles('./src/__tests__/test_lang_files/*.?(js|json)');

    const analysisJS = api.analyzeI18n(langObj[0], vueI18nStrings);
    const analysisJSON = api.analyzeI18n(langObj[1], vueI18nStrings);

    const missingEntries = [
      {
        line: 2,
        text: 'header.titles.title_x.test',
        file: './src/__tests__/test_demo_files/default/file2.js'
      },
      {
        line: 1,
        text: 'test.a.b.c',
        file: './src/__tests__/test_demo_files/default/file1.js'
      },
      {
        line: 2,
        text: 'test.plural.a',
        file: './src/__tests__/test_demo_files/default/file1.js'
      },
      {
        line: 3,
        text: 'test.plural.b',
        file: './src/__tests__/test_demo_files/default/file2.js'
      },
      {
        line: 1,
        text: 'test.c.d.e',
        file: './src/__tests__/test_demo_files/default/file2.js'
      }
    ];

    expect(analysisJS.missingEntries).toEqual(missingEntries);
    expect(analysisJSON.missingEntries).toEqual(missingEntries);

    expect(Object.hasOwnProperty.call(analysisJS.fixedEntries.header.titles.title_x, 'test')).toBeTruthy();
    expect(Object.hasOwnProperty.call(analysisJS.fixedEntries, 'test')).toBeTruthy();

    expect(Object.hasOwnProperty.call(analysisJSON.fixedEntries.header.titles.title_x, 'test')).toBeTruthy();
    expect(Object.hasOwnProperty.call(analysisJSON.fixedEntries, 'test')).toBeTruthy();
  });
});

