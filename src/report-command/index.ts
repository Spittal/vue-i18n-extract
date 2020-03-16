import path from 'path';

import { I18NItem, I18NLanguage, I18NReport, ReportOptions } from '../types';
import { parseVueFiles } from './vue-files';
import { parseLanguageFiles, writeMissingToLanguage } from './language-files';
import { extractI18NReport, writeReportToFile } from './report';

export async function reportCommand (command: ReportOptions): Promise<void> {
  const { vueFiles, languageFiles, output, add } = command;

  const resolvedVueFiles: string = path.resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles: string = path.resolve(process.cwd(), languageFiles);

  const parsedVueFiles: I18NItem[] = parseVueFiles(resolvedVueFiles);
  const parsedLanguageFiles: I18NLanguage = parseLanguageFiles(resolvedLanguageFiles);

  const report: I18NReport = extractI18NReport(parsedVueFiles, parsedLanguageFiles);

  if (report.missingKeys) console.table(report.missingKeys);
  if (report.unusedKeys) console.table(report.unusedKeys);

  if (output) {
    await writeReportToFile(report, path.resolve(process.cwd(), output));
    console.log(`The report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys && report.missingKeys.length > 0) {
    writeMissingToLanguage(resolvedLanguageFiles, report.missingKeys)
    console.log('The missing keys has been has been saved to your languages files');
  }
}
