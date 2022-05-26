import { initCommand, resolveConfig } from '@/config-file';
import defaultConfig from '@/config-file/vue-i18n-extract.config';
import rimraf from 'rimraf';

describe('file: config-file/index', () => {
  it('Init default config and read it.', (done) => {
    initCommand();

    const config = resolveConfig();

    expect(config).toEqual(expect.objectContaining({
      exclude: defaultConfig.exclude,
      vueFiles: defaultConfig.vueFiles,
      languageFiles: defaultConfig.languageFiles,
    }));

    rimraf('./vue-i18n-extract.config.js', () => {
      done();
    });
  });

  it('Read non-default config.', (done) => {
    jest.doMock('@/config-file/vue-i18n-extract.config', () => ({
      vueFiles: './src/**/*.?(js|vue)',
      languageFiles: './lang/**/*.?(json|yaml|yml|js)',
      exclude: ['test', 'hello']
    }));

    initCommand();

    const config = resolveConfig();

    expect(config).toEqual(expect.objectContaining({
      exclude: defaultConfig.exclude,
      vueFiles: defaultConfig.vueFiles,
      languageFiles: defaultConfig.languageFiles,
    }));

    rimraf('./vue-i18n-extract.config.js', () => {
      done();
    });
  });
});
