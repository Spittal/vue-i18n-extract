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
  public async parseVueFiles (vueFilesPath: string): Promise<I18NItem[]> {
    const filesList: SimpleFile[] = readVueFiles(vueFilesPath);
    return extractI18nItemsFromVueFiles(filesList);
  }

  public parseLanguageFiles (languageFilesPath: string): I18NLanguage {
    const filesList: SimpleFile[] = readLangFiles(languageFilesPath);
    return extractI18nItemsFromLanguageFiles(filesList);
  }

  public async createI18NReport (vueFilesPath: string, languageFilesPath: string): Promise<I18NReport> {
    const parsedVueFiles: I18NItem[] = await this.parseVueFiles(vueFilesPath);
    const parsedLanguageFiles: I18NLanguage = this.parseLanguageFiles(languageFilesPath);

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
}
