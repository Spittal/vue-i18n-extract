import { readVueFiles, parseVueFiles } from '@/create-report/vue-files';
import { expectedFromParsedVueFiles } from '../../fixtures/expected-values';
import { vueFiles } from '../../fixtures/resolved-sources';
import path from 'path';

const vueFilesWithBackslashes = vueFiles.replace(/\//g, '\\');

describe('file: create-report/vue-files', () => {
  describe('function: parseVueFiles', () => {
    it.each([
      vueFiles,
      vueFilesWithBackslashes
    ])('Parse the file glob into I18n items', (files) => {
      const I18NItems = parseVueFiles(files);
      expect(I18NItems).toEqual(expectedFromParsedVueFiles);
    });

    it('Throws an error if it is not a valid glob', () => {
      const breakingVueFiles = '';
      expect(() => readVueFiles(breakingVueFiles)).toThrow(`vueFiles isn't a valid glob pattern.`);
    });

    it('Throws an error if it does not find any file', () => {
      const breakingVueFiles = path.resolve(__dirname, '../fixtures/vue-files/**/*.txt');
      expect(() => readVueFiles(breakingVueFiles)).toThrow('vueFiles glob has no files.');
    });
  });
});
