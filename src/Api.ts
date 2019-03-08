import path from 'path';
import fs from 'fs';
import {
  readVueFiles,
  readLangFiles,
  extractI18nItemsFromVueFiles,
  extractI18nItemsFromLanguageFiles,
  diffParsedSources,
  logMissingKeys,
  logUnusedKeys,
} from './library/index';

import { SimpleFile, I18NItem, I18NLanguage, I18NReport } from './library/models';

export default class VueI18NExtract {
  public parseVueFiles (vueFilesPath: string): I18NItem[] {
    const filesList: SimpleFile[] = readVueFiles(vueFilesPath);
    return extractI18nItemsFromVueFiles(filesList);
  }

  public parseLanguageFiles (languageFilesPath: string): I18NLanguage {
    const filesList: SimpleFile[] = readLangFiles(languageFilesPath);
    return extractI18nItemsFromLanguageFiles(filesList);
  }

  public createI18NReport (vueFiles: string, languageFiles: string): I18NReport {
    const parsedVueFiles: I18NItem[] = this.parseVueFiles(vueFiles);
    const parsedLanguageFiles: I18NLanguage = this.parseLanguageFiles(languageFiles);

    return this.extractI18NReport(parsedVueFiles, parsedLanguageFiles);
  }

  public extractI18NReport (parsedVueFiles: I18NItem[], parsedLanguageFiles: I18NLanguage): I18NReport {
    const missingKeys = [];
    const unusedKeys = [];

    Object.keys(parsedLanguageFiles).forEach((language) => {
      const languageMissingKeys = diffParsedSources(parsedVueFiles, parsedLanguageFiles[language])
        .map((item) => ({ ...item, language }));
      missingKeys.push(...languageMissingKeys);

      const languageUnusedKeys = diffParsedSources(parsedLanguageFiles[language], parsedVueFiles)
        .map((item) => ({ ...item, language }));
      unusedKeys.push(...languageUnusedKeys);
    });

    return {
      missingKeys,
      unusedKeys,
    };
  }

  public logI18NReport (report: I18NReport): void {
    logMissingKeys(report.missingKeys);
    logUnusedKeys(report.unusedKeys);
  }

  public writeReportToFile (report: I18NReport, writePath: string): void {
    const reportString = JSON.stringify(report);
    fs.writeFile(
      path.resolve(process.cwd(), writePath),
      reportString,
      (err) => {
        if (err) {
          throw err;
        }
        // tslint:disable-next-line
        console.log(`The report has been has been saved to ${writePath}`);
      },
    );
  }
}
