import path from 'path';
import fs from 'fs';
import { initCommand } from '@/init-command';

describe('file: init-command/index', () => {
  describe('function: initCommand', () => {
    let fsWriteFileSync: jest.SpyInstance<unknown>;

    beforeEach(() => {
      fsWriteFileSync = jest.spyOn(fs, 'writeFileSync');
      fsWriteFileSync.mockImplementation(() => jest.fn());
    });

  it('Log report to console', () => {
      initCommand();
      expect(fsWriteFileSync).toHaveBeenCalledTimes(1);

      const configFile = fs.readFileSync(path.resolve('./src/init-command/vue-i18n-extract.config.js'), 'utf8');
      expect(fsWriteFileSync).toHaveBeenCalledWith(expect.stringContaining('vue-i18n-extract.config.js'), configFile);
    });
  });
});
