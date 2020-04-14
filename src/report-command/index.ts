import path from 'path';

import { ReportOptions, I18NReport } from '../types';
import { parseVueFiles } from './vue-files';
import { parseLanguageFiles, writeMissingToLanguage } from './language-files';
import { extractI18NReport, writeReportToFile } from './report';

export function createI18NReport (vueFiles: string, languageFiles: string): I18NReport {
  const resolvedVueFiles = path.resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);

  const parsedVueFiles = parseVueFiles(resolvedVueFiles);
  const parsedLanguageFiles = parseLanguageFiles(resolvedLanguageFiles);

  return extractI18NReport(parsedVueFiles, parsedLanguageFiles);
}

export async function reportCommand (command: ReportOptions): Promise<void> {
  const { vueFiles, languageFiles, output, add } = command;

  const report = createI18NReport(vueFiles, languageFiles);

  if (report.missingKeys) console.table(report.missingKeys);
  if (report.unusedKeys) console.table(report.unusedKeys);

  if (output) {
    await writeReportToFile(report, path.resolve(process.cwd(), output));
    console.log(`The report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys && report.missingKeys.length > 0) {
    const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);
    writeMissingToLanguage(resolvedLanguageFiles, report.missingKeys);
    console.log('The missing keys have been added to your languages files');
  }
}

export * from './vue-files';
export * from './language-files';
export * from './report';
