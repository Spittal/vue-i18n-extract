import path from 'path';

import { ReportOptions, I18NReport } from '../types';
import { parseVueFiles } from './vue-files';
import { parseLanguageFiles, writeMissingToLanguage } from './language-files';
import { extractI18NReport,  writeReportToFile } from './report';

export function createI18NReport (vueFiles: string, languageFiles: string): I18NReport {
  const resolvedVueFiles = path.resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);

  const parsedVueFiles = parseVueFiles(resolvedVueFiles);
  const parsedLanguageFiles = parseLanguageFiles(resolvedLanguageFiles);

  return extractI18NReport(parsedVueFiles, parsedLanguageFiles);
}

export async function reportFromConfigCommand(): Promise<void> {
  const config = await require(path.resolve(process.cwd(), './vue-i18n-extract.config.js')) as ReportOptions;

  if (!config) throw new Error('[vue-i18n-extract] Config file is missing, run `vue-i18n-extract init` to create one.');
  if (!config.vueFiles) throw new Error('[vue-i18n-extract] Required option vueFiles missing from config file.');
  if (!config.languageFiles) throw new Error('[vue-i18n-extract] Required option languageFiles missing from config file.');

  return reportCommand(config);
}

export async function reportCommand (command: ReportOptions): Promise<void> {
  const { vueFiles, languageFiles, output, add, ci } = command;
  const report = createI18NReport(vueFiles, languageFiles);

  if (report.missingKeys.length) console.info('\nMissing Keys'), console.table(report.missingKeys);
  if (report.unusedKeys.length) console.info('\nUnused Keys'), console.table(report.unusedKeys);
  if (report.maybeDynamicKeys.length) console.warn('\nSuspected Dynamic Keys Found\nvue-i18n-extract does not compile Vue templates and can not guarantee an accurate match with the following keys.'), console.table(report.maybeDynamicKeys);

  if (output) {
    await writeReportToFile(report, path.resolve(process.cwd(), output));
    console.info(`\nThe report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys.length) {
    const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);
    writeMissingToLanguage(resolvedLanguageFiles, report.missingKeys);
    console.info('\nThe missing keys have been added to your languages files');
  }

  if (ci && report.missingKeys.length) {
    console.info(`[vue-i18n-extract] ${report.missingKeys.length} missing keys found.`);
    process.exit(1);
  }

  process.exit(0);
}

export * from './vue-files';
export * from './language-files';
export * from './report';
