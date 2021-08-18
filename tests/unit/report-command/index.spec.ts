import path from 'path';
import { reportCommand } from '@/report-command';
import { ReportOptions } from '@/types';
import { expectedI18NReport } from '../../fixtures/expected-values';
import { vueFiles, languageFiles } from '../../fixtures/resolved-sources';
import * as report from '@/report-command/report';
import * as languageFileActions from '@/report-command/language-files';

describe('file: report-command/index', () => {
  let consoleTableSpy: jest.SpyInstance<unknown>;
  let consoleInfoSpy: jest.SpyInstance<unknown>;
  let consoleWarnSpy: jest.SpyInstance<unknown>;
  let command: ReportOptions;

  beforeEach(() => {
    command = {
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
    await reportCommand(command);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleTableSpy).toHaveBeenCalledTimes(3);
    expect(consoleTableSpy.mock.calls[0][0]).toEqual(expectedI18NReport.missingKeys);
    expect(consoleTableSpy.mock.calls[1][0]).toEqual(expectedI18NReport.unusedKeys);
  });

  it('Write report to file at output path', async () => {
    command.output = './test';
    const writeReportSpy: jest.SpyInstance<unknown> = jest.spyOn(report, 'writeReportToFile');
    writeReportSpy.mockImplementation(() => jest.fn());
    await reportCommand(command);
    expect(writeReportSpy).toHaveBeenCalledWith(
      expectedI18NReport,
      path.resolve(process.cwd(), command.output),
    );
    expect(consoleInfoSpy).toHaveBeenLastCalledWith(`\nThe report has been has been saved to ${command.output}`);
  });

  it('Write missing keys to language files', async () => {
    command.add = true;
    const writeMissingSpy: jest.SpyInstance<unknown> = jest.spyOn(languageFileActions, 'writeMissingToLanguage');
    writeMissingSpy.mockImplementation(() => jest.fn());
    await reportCommand(command);
    expect(writeMissingSpy).toHaveBeenCalledWith(
      command.languageFiles,
      expectedI18NReport.missingKeys,
    );
    expect(consoleInfoSpy).toHaveBeenLastCalledWith('\nThe missing keys have been added to your languages files');
  });
});
