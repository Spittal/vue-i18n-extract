import path from 'path';
import fs from 'fs';
import dot from 'dot-object';
import { readLanguageFiles, writeMissingToLanguageFiles, removeUnusedFromLanguageFiles, parselanguageFiles } from '@/create-report/language-files';
import { expectedFromParsedLanguageFiles, expectedI18NReport } from '../../fixtures/expected-values';
import { languageFiles } from '../../fixtures/resolved-sources';

describe('file: create-report/language-files', () => {
  describe('function: parselanguageFiles', () => {
    it('Parse the file glob into an I18NLanguage object', () => {
      const I18NLanguage = parselanguageFiles(languageFiles);
      expect(I18NLanguage).toEqual(expectedFromParsedLanguageFiles);
    });

    it('Throws an error if it is not a valid glob', () => {
      const brokenLanguageSource = '';
      expect(() => readLanguageFiles(brokenLanguageSource)).toThrow(`languageFiles isn't a valid glob pattern.`);
    });

    it('Throws an error if it does not find any file', () => {
      const brokenLanguageSource = path.resolve(__dirname, '../fixtures/language-files/**/*.txt');
      expect(() => readLanguageFiles(brokenLanguageSource)).toThrow('languageFiles glob has no files.');
    });
  });

  describe('function: writeMissingToLanguageFiles', () => {
    it('Writes missing keys to language files', () => {
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
      writeFileSyncSpy.mockImplementation(() => jest.fn());
      const dotStrSpy = jest.spyOn(dot, 'str');
      writeMissingToLanguageFiles(readLanguageFiles(languageFiles), expectedI18NReport.missingKeys);
      expect(dotStrSpy).toHaveBeenCalledTimes(18);
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(3);
      expect(writeFileSyncSpy.mock.calls[0][1]).toContain('missing');
    });
  });

  describe('function: removeUnusedFromLanguageFiles', () => {
    it('Remove unused keys from language files', () => {
      const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
      writeFileSyncSpy.mockImplementation(() => jest.fn());
      jest.resetAllMocks();
      const dotDeleteSpy = jest.spyOn(dot, 'delete');
      removeUnusedFromLanguageFiles(readLanguageFiles(languageFiles), expectedI18NReport.unusedKeys);
      expect(dotDeleteSpy).toHaveBeenCalledTimes(5);
      expect(writeFileSyncSpy).toHaveBeenCalledTimes(3);
      expect(writeFileSyncSpy.mock.calls[0][1]).not.toContain('unused');
    });
  });
})

