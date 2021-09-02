import { readVueFiles, parseVueFiles } from '@/create-report/vue-files';
import { expectedFromParsedVueFiles } from '../../fixtures/expected-values';
import { vueFiles } from '../../fixtures/resolved-sources';
import path from 'path';

describe('file: create-report/vue-files', () => {
  describe('function: parseVueFiles', () => {
    it('Parse the file glob into I18n items', () => {
      const I18NItems = parseVueFiles(vueFiles);
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
