import { readVueFiles, readLangFiles } from '@/library/index';
import { SimpleFile } from '@/library/models';
import path from 'path';

describe('read-files.ts', () => {
  describe('readVueFiles', () => {
    const src: string = path.resolve(__dirname, '../fixtures/vue-files/**/*.?(js|vue)');

    it('Get vueFiles', () => {
      const results: SimpleFile[] = readVueFiles(src);
      expect(results.length).toEqual(5);
    });

    it('Throws an error if it is not a valid glob', () => {
      const breakingSrc: string = '';
      expect(() => readVueFiles(breakingSrc)).toThrow('vueFiles isn\'\t a valid glob pattern.');
    });

    it('Throws an error if it does not find any file', () => {
      const breakingSrc: string = path.resolve(__dirname, '../fixtures/vue-files/**/*.txt');
      expect(() => readVueFiles(breakingSrc)).toThrow('vueFiles glob has no files.');
    });

    it('Get vueFiles, then read the content', () => {
      const results: SimpleFile[] = readVueFiles(src);
      results.forEach((r) => {
        expect(r.content).not.toBeNull();
      });
    });
  });

  describe('readLangFiles', () => {
    const src: string = path.resolve(__dirname, '../fixtures/language-files/**/*.?(js|json)');

    it('Get languageFiles', () => {
      const results = readLangFiles(src);
      expect(results.length).toEqual(2);
    });

    it('Throws an error if it is not a valid glob', () => {
      const breakingSrc: string = '';
      expect(() => readLangFiles(breakingSrc)).toThrow('languageFiles isn\'\t a valid glob pattern.');
    });

    it('Throws an error if it does not find any file', () => {
      const breakingSrc = path.resolve(__dirname, '../fixtures/language-files/**/*.txt');
      expect(() => readLangFiles(breakingSrc)).toThrow('languageFiles glob has no files.');
    });

    it('Get languageFiles, then read the content', () => {
      const results = readLangFiles(src);
      results.forEach((r) => {
        expect(typeof r.content.header).toEqual('object');
      });
    });
  });
});
