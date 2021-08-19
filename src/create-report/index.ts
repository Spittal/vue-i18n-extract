import path from 'path';
import { ReportOptions, I18NReport } from '../types';
import { readVueFiles, extractI18NItemsFromVueFiles } from './vue-files';
import { readLanguageFiles, extractI18NLanguageFromLanguageFiles, removeUnusedFromLanguageFiles, writeMissingToLanguageFiles } from './language-files';
import { extractI18NReport,  writeReportToFile } from './report';

export async function createI18NReport (options: ReportOptions): Promise<I18NReport> {
  const {
    vueFiles: vueFilesGlob,
    languageFiles: languageFilesGlob,
    output,
    add,
    remove,
    ci
  } = options;

  if (!vueFilesGlob) throw new Error('Required configuration vueFiles is missing.');
  if (!languageFilesGlob) throw new Error('Required configuration languageFiles is missing.');

  const vueFiles = readVueFiles(path.resolve(process.cwd(), vueFilesGlob));
  const languageFiles = readLanguageFiles(path.resolve(process.cwd(), languageFilesGlob));

  const I18NItems = extractI18NItemsFromVueFiles(vueFiles);
  const I18NLanguage = extractI18NLanguageFromLanguageFiles(languageFiles);

  const report = extractI18NReport(I18NItems, I18NLanguage);

  if (report.missingKeys.length) console.info('\nMissing Keys'), console.table(report.missingKeys);
  if (report.unusedKeys.length) console.info('\nUnused Keys'), console.table(report.unusedKeys);
  if (report.maybeDynamicKeys.length) console.warn('\nSuspected Dynamic Keys Found\nvue-i18n-extract does not compile Vue templates and therefore can not infer the correct key for the following keys.'), console.table(report.maybeDynamicKeys);

  if (output) {
    await writeReportToFile(report, path.resolve(process.cwd(), output));
    console.info(`\nThe report has been has been saved to ${output}`);
  }

  if (add && report.missingKeys.length) {
    writeMissingToLanguageFiles(languageFiles, report.missingKeys);
    console.info('\nThe missing keys have been added to your language files.');
  }
  if (remove && report.unusedKeys.length) {
    removeUnusedFromLanguageFiles(languageFiles, report.unusedKeys);
    console.info('\nThe unused keys have been removed from your language files.');
  }

  if (ci && report.missingKeys.length) {
    throw new Error(`${report.missingKeys.length} missing keys found.`);
  }

  return report;
}

export * from './vue-files';
export * from './language-files';
export * from './report';
