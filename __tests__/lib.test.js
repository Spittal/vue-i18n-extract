/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const lib = require('../src/lib');
const demoArr = [
  'a.b.c',
  'd.e.f',
  'a.b.g',
];

describe('Lib', () => {
  describe('readVueFiles', () => {
    test('get vue and js files from src', () => {
      const src = './src/__tests__/test_demo_files/default/**/*.?(js|vue)';
      const results = lib.readVueFiles(src);
      expect(results.length).toEqual(4);
    });
    test('doesnt find any file', () => {
      const src = './src/__tests__/test_demo_files/default/**/*.?(txt)';
      const results = lib.readVueFiles(src);
      expect(results.length).toEqual(0);
    });
    test('get vue and js files and read the content', () => {
      const src = './src/__tests__/test_demo_files/default/**/*.?(js|vue)';
      const results = lib.readVueFiles(src);
      results.forEach((r) => {
        expect(r.content).not.toBeNull();
      });
    });
  });

  describe('readLangFiles', () => {
    test('get vue and js files from src', () => {
      const src = './src/__tests__/test_lang_files/*.?(js|json)';
      const results = lib.readLangFiles(src);
      expect(results.length).toEqual(2);
    });
    test('doesnt find any file', () => {
      const src = './src/__tests__/test_lang_files/*.?(txt)';
      const results = lib.readLangFiles(src);
      expect(results.length).toEqual(0);
    });
    test('get vue and js files and read the content', () => {
      const src = './src/__tests__/test_lang_files/*.?(js|json)';
      const results = lib.readLangFiles(src);
      results.forEach((r) => {
        expect(typeof r.content.header).toEqual('object');
      });
    });
  });

  describe('convertDotToObject', () => {
    test('convert array of dot notation strings into an object', () => {
      const convertedObj = lib.convertDotToObject(demoArr);
      expect(Object.prototype.hasOwnProperty.call(convertedObj.a.b, 'c')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(convertedObj.d.e, 'f')).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(convertedObj.a.b, 'g')).toBeTruthy();
    });
  });

  describe('extractI18nStringsFromFilesCollection', () => {
    test('extract supported i18n strings from a collection of file paths', async () => {
      const filesCollection = lib.readVueFiles('./src/__tests__/test_demo_files/default/**/*.?(js|vue)');
      const results = await lib.extractI18nStringsFromFilesCollection(filesCollection);
      expect(results.length).toEqual(12);
    });
  });
});

