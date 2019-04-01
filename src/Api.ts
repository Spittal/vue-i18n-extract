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

export enum VueI18NExtractReportTypes {
  None = 0,
  Missing = 1 << 0,
  Unused = 1 << 1,
  All = ~(~0 << 2)
};

export default class VueI18NExtract {
  public parseVueFiles (vueFilesPath: string): I18NItem[] {
    const filesList: SimpleFile[] = readVueFiles(vueFilesPath);
    return extractI18nItemsFromVueFiles(filesList);
  }

  public parseLanguageFiles (languageFilesPath: string): I18NLanguage {
    const filesList: SimpleFile[] = readLangFiles(languageFilesPath);
    return extractI18nItemsFromLanguageFiles(filesList);
  }

  public createI18NReport (vueFiles: string, languageFiles: string, reportType: VueI18NExtractReportTypes = VueI18NExtractReportTypes.All): I18NReport {
    const parsedVueFiles: I18NItem[] = this.parseVueFiles(vueFiles);
    const parsedLanguageFiles: I18NLanguage = this.parseLanguageFiles(languageFiles);

    return this.extractI18NReport(parsedVueFiles, parsedLanguageFiles, reportType);
  }

  public extractI18NReport (parsedVueFiles: I18NItem[], parsedLanguageFiles: I18NLanguage, reportType: VueI18NExtractReportTypes = VueI18NExtractReportTypes.All): I18NReport {
    const missingKeys = [];
    const unusedKeys = [];

    Object.keys(parsedLanguageFiles).forEach((language) => {
      if (reportType & VueI18NExtractReportTypes.Missing) {
        const languageMissingKeys = diffParsedSources(parsedVueFiles, parsedLanguageFiles[language])
          .map((item) => ({ ...item, language }));
        missingKeys.push(...languageMissingKeys);
      }

      if (reportType & VueI18NExtractReportTypes.Unused) {
        const languageUnusedKeys = diffParsedSources(parsedLanguageFiles[language], parsedVueFiles)
          .map((item) => ({ ...item, language }));
        unusedKeys.push(...languageUnusedKeys);
      }
    });

    let extracts = {};
    if (reportType & VueI18NExtractReportTypes.Missing) {
      extracts = Object.assign(extracts, { missingKeys });
    }
    if (reportType & VueI18NExtractReportTypes.Unused) {
      extracts = Object.assign(extracts, { unusedKeys });
    }

    return extracts;
  }

  public logI18NReport (report: I18NReport): void {
    Object.keys(report).forEach(key => {
      if (key === 'missingKeys') {
        logMissingKeys(report.missingKeys);
      } else if (key === 'unusedKeys') {
        logUnusedKeys(report.unusedKeys);
      }
    })
  }

  public async writeReportToFile (report: I18NReport, writePath: string): Promise<void> {
    const reportString = JSON.stringify(report);
    return fs.writeFile(
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
