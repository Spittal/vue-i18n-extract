/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const lib = require('../lib');

describe('Lib', () => {
  describe('readVueFiles', () => {
    test('get vue and js files from src', () => {
      const src = './src/__tests__/test_demo_files/**/*.?(js|vue)';
      const results = lib.readVueFiles(src);
      expect(results.length).toEqual(4);
    });
    test('doesnt find any file', () => {
      const src = './src/__tests__/test_demo_files/**/*.?(txt)';
      const results = lib.readVueFiles(src);
      expect(results.length).toEqual(0);
    });
    test('get vue and js files and read the content', () => {
      const src = './src/__tests__/test_demo_files/**/*.?(js|vue)';
      const results = lib.readVueFiles(src);
      results.forEach((r) => {
        expect(r.name.split('/')[r.name.split('/').length - 1]).toEqual(r.content);
      });
    });
  });

  describe('readLangFiles', () => {
    test('get vue and js files from src', () => {
      const src = './src/__tests__/test_lang_files/*.js';
      const results = lib.readLangFiles(src);
      expect(results.length).toEqual(2);
    });
    test('doesnt find any file', () => {
      const src = './src/__tests__/test_lang_files/*.?(txt)';
      const results = lib.readLangFiles(src);
      expect(results.length).toEqual(0);
    });
    test('get vue and js files and read the content', () => {
      const src = './src/__tests__/test_lang_files/*.js';
      const results = lib.readLangFiles(src);
      results.forEach((r) => {
        expect(typeof r.content.header).toEqual('object');
      });
    });
  });
});
