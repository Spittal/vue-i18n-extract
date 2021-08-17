import fs from 'fs';
import { initCommand, resolveConfig } from '@/config-file';
import defaultConfig from '@/config-file/vue-i18n-extract.config';
import rimraf from 'rimraf';

describe('file: config-file/index', () => {
  describe('function: initCommand', () => {
    let fsWriteFileSync: jest.SpyInstance<unknown>;

    beforeEach(() => {
      fsWriteFileSync = jest.spyOn(fs, 'writeFileSync');
      fsWriteFileSync.mockImplementation(() => jest.fn());
    });

    it('Log report to console', () => {
      initCommand();

      expect(fsWriteFileSync).toHaveBeenCalledTimes(1);

      expect(fsWriteFileSync).toHaveBeenCalledWith(expect.stringContaining('vue-i18n-extract.config.js'), `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`);

    });
  });

  describe('function: resolveConfig', () => {
    it('Read the config file.', (done) => {
      initCommand();

      const config = resolveConfig();

      expect(config).toEqual(expect.objectContaining({
        vueFiles: './src/**/*.?(js|vue)',
        languageFiles: './lang/**/*.?(json|yaml|yml|js)',
      }));

      rimraf('./vue-i18n-extract.config.js', () => {
        done();
      });
    });
  });
});
