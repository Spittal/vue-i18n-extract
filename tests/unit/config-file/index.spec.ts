import { initCommand, resolveConfig } from '@/config-file';
import defaultConfig from '@/config-file/vue-i18n-extract.config';
import rimraf from 'rimraf';

describe('file: config-file/index', () => {
  it('Init and Read the config file.', (done) => {
    initCommand();

    const config = resolveConfig();

    expect(config).toEqual(expect.objectContaining({
      vueFiles: defaultConfig.vueFiles,
      languageFiles: defaultConfig.languageFiles,
    }));

    rimraf('./vue-i18n-extract.config.js', () => {
      done();
    });
  });
});
