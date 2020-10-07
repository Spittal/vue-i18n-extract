import path from 'path';
import fs from 'fs';
import { initCommand } from '@/init-command';

const configFile = `
  module.exports = {
    vueFilesPath: './',
    languageFilesPath: './',
    options: {
      output: true, // false or the path where you want to create a json file containing your report.
      add: false, // false or true if you want to add missing keys into your json language file.
      dynamic: false, // false
                      // 'ignore' if you want to ignore dynamic keys false-positive.
                      // 'report' if you want to get dynamic keys report,
    }
  };
`;

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
      expect(fsWriteFileSync).toHaveBeenCalledWith('.vuei18nextract.js', configFile);
    });
  });
});
