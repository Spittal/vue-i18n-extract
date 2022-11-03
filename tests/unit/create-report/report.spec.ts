import fs from 'fs';
import { extractI18NReport, writeReportToFile } from '@/create-report/report';
import { parseVueFiles } from '@/create-report/vue-files';
import { parselanguageFiles } from '@/create-report/language-files';
import { expectedI18NReport } from '../../fixtures/expected-values';
import { vueFiles, languageFiles } from '../../fixtures/resolved-sources';
import { I18NReport, I18NLanguage, I18NItemWithBounding, DetectionType } from '@/types';

describe('file: create-report/report', () => {
  let parsedVueFiles: I18NItemWithBounding[];
  let parsedLanguageFiles: I18NLanguage;
  let report: I18NReport;

  beforeAll(() => {
    parsedVueFiles = parseVueFiles(vueFiles);
    parsedLanguageFiles = parselanguageFiles(languageFiles);
    report = extractI18NReport(parsedVueFiles, parsedLanguageFiles, [DetectionType.Missing, DetectionType.Unused, DetectionType.Dynamic]);
  });

  describe('function: extractI18NReport', () => {
    it('Generate accurate report', () => {
      expect(report).toEqual(expectedI18NReport);
    });
  });

  describe('function: writeReportToFile', () => {
    it('Write report to specified file output path', async () => {
      const outputPath = './path/to/output.json';

      const spyWriteFile = jest.spyOn(fs, 'writeFile');
      spyWriteFile.mockImplementationOnce((writePath, reportString, callback) => {
        callback(null);
      });

      await writeReportToFile(report, outputPath);

      expect(spyWriteFile).toHaveBeenCalledTimes(1);
      expect(spyWriteFile.mock.calls[0][0]).toEqual(outputPath);
      expect(spyWriteFile.mock.calls[0][1]).toEqual(JSON.stringify(report));
    });
  });
});
