/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const api = require('../api');

describe('API', () => {
  test('analyzeVueFiles', async () => {
    const src = './src/__tests__/test_demo_files/**/*.js';
    const { generatedObj } = await api.analyzeVueFiles(src);
    expect(Object.prototype.hasOwnProperty.call(generatedObj.test.a.b, 'c')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(generatedObj.test.c.d, 'e')).toBeTruthy();
  });

  test('analyzeLanguageFiles', async () => {
    const src = './src/__tests__/test_lang_files/*.js';
    const langObj = await api.analyzeLanguageFiles(src);
    expect(langObj.length).toEqual(2);
    expect(langObj[0].filename).toEqual('de_DE.js');
    expect(langObj[1].filename).toEqual('en_EN.js');
    expect(langObj[0].path).not.toBeNull();
    expect(langObj[0].content.header.paragraphs.p_b).toEqual('test');
    expect(langObj[0].content.header.titles.title_a).toEqual('test');
  });  

  test('analyzeI18n', async () => {
    const vueI18nStrings = await api.analyzeVueFiles('./src/__tests__/test_demo_files/**/*.js');
    const langObj = await api.analyzeLanguageFiles('./src/__tests__/test_lang_files/de_DE.js');
    const analysis = api.analyzeI18n(langObj[0], vueI18nStrings);
    expect(analysis.missingEntries).toEqual([
      {
        "file": "./src/__tests__/test_demo_files/file2.js",
        "line": 2,
        "text": "header.titles.title_x.test",
      },
      {
        "file": "./src/__tests__/test_demo_files/file1.js",
        "line": 1,
        "text": "test.a.b.c",
      },
      {
        "file": "./src/__tests__/test_demo_files/file2.js",
        "line": 1,
        "text": "test.c.d.e",
      },
    ]);    
    expect(Object.hasOwnProperty.call(analysis.fixedEntries.header.titles.title_x, 'test')).toBeTruthy();
    expect(Object.hasOwnProperty.call(analysis.fixedEntries, 'test')).toBeTruthy();
  });
});

