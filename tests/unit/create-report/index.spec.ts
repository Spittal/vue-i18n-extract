import path from 'path';
import { createI18NReport } from '@/create-report';
import { ReportOptions } from '@/types';
import { expectedI18NReport } from '../../fixtures/expected-values';
import { vueFiles, languageFiles } from '../../fixtures/resolved-sources';
import * as report from '@/create-report/report';
import * as languageFileActions from '@/create-report/language-files';
import Dot from 'dot-object';

describe('file: create-report/index', () => {
  let consoleTableSpy: jest.SpyInstance<unknown>;
  let consoleInfoSpy: jest.SpyInstance<unknown>;
  let consoleWarnSpy: jest.SpyInstance<unknown>;
  let options: ReportOptions;

  beforeEach(() => {
    options = {
      vueFiles,
      languageFiles,
    }

    consoleTableSpy = jest.spyOn(console, 'table');
    consoleInfoSpy = jest.spyOn(console, 'info');
    consoleWarnSpy = jest.spyOn(console, 'warn');
    consoleTableSpy.mockImplementation(() => jest.fn());
    consoleInfoSpy.mockImplementation(() => jest.fn());
    consoleWarnSpy.mockImplementation(() => jest.fn());
  });

  it('Log report to console', async () => {
    await createI18NReport(options);

    expect(consoleWarnSpy).toHaveBeenCalledWith('\nSuspected Dynamic Keys Found\nvue-i18n-extract does not compile Vue templates and therefore can not infer the correct key for the following keys.');
    expect(consoleTableSpy).toHaveBeenCalledTimes(3);
    expect(consoleTableSpy.mock.calls[0][0]).toEqual(expectedI18NReport.missingKeys);
    expect(consoleTableSpy.mock.calls[1][0]).toEqual(expectedI18NReport.unusedKeys);
  });

  it('Write report to file at output path', async () => {
    options.output = './test';
    const writeReportSpy: jest.SpyInstance<unknown> = jest.spyOn(report, 'writeReportToFile');
    writeReportSpy.mockImplementation(() => jest.fn());
    await createI18NReport(options);
    expect(writeReportSpy).toHaveBeenCalledWith(
      expectedI18NReport,
      path.resolve(process.cwd(), options.output),
    );
    expect(consoleInfoSpy).toHaveBeenLastCalledWith(`\nThe report has been has been saved to ${options.output}`);
  });

  it('Write missing keys to language files', async () => {
    options.add = true;
    const writeMissingSpy: jest.SpyInstance<unknown> = jest.spyOn(languageFileActions, 'writeMissingToLanguageFiles');
    writeMissingSpy.mockImplementation(() => jest.fn());
    await createI18NReport(options);
    expect(writeMissingSpy).toHaveBeenCalledWith(
      languageFileActions.readLanguageFiles(options.languageFiles),
      expectedI18NReport.missingKeys,
      Dot,
    );
    expect(consoleInfoSpy).toHaveBeenLastCalledWith('\nThe missing keys have been added to your language files.');
  });

  it('Remove unused keys from language files', async () => {
    options.remove = true;
    const removeUnusedSpy: jest.SpyInstance<unknown> = jest.spyOn(languageFileActions, 'removeUnusedFromLanguageFiles');
    removeUnusedSpy.mockImplementation(() => jest.fn());
    await createI18NReport(options);
    expect(removeUnusedSpy).toHaveBeenCalledWith(
      languageFileActions.readLanguageFiles(options.languageFiles),
      expectedI18NReport.unusedKeys,
      Dot,
    );
    expect(consoleInfoSpy).toHaveBeenLastCalledWith('\nThe unused keys have been removed from your language files.');
  });
});
