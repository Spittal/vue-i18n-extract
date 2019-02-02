/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const api = require('../api');

describe('API', () => {
  test('analyzeVueFiles', async () => {
    const src = './src/__tests__/test_demo_files/**/*.js';
    const generateObj = await api.analyzeVueFiles(src);
    expect(Object.prototype.hasOwnProperty.call(generateObj.test.a.b, 'c')).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(generateObj.test.c.d, 'e')).toBeTruthy();
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
});

