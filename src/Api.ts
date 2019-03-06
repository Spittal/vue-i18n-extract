import {
  readVueFiles,
  readLangFiles,
  extractI18nItemsFromVueFiles,
  extractI18nItemsFromLanguageFiles,
  diffParsedSources,
  logMissingKeys,
  logUnusedKeys,
} from './library/index';

import { SimpleFile, I18NItem, I18NLanguage, Report } from './library/models';

export default class API {
  public async parseVueFiles (vueFilesPath: string): Promise<I18NItem[]> {
    const filesList: SimpleFile[] = readVueFiles(vueFilesPath);
    return extractI18nItemsFromVueFiles(filesList);
  }

  public parseLanguageFiles (langFilesPath: string): I18NLanguage {
    const filesList: SimpleFile[] = readLangFiles(langFilesPath);
    return extractI18nItemsFromLanguageFiles(filesList);
  }

  public createReport (parsedVueFiles: I18NItem[], parsedLanguageFiles: I18NLanguage): Report {
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

  public logReport (report: Report): void {
    logMissingKeys(report.missingKeys);
    logUnusedKeys(report.unusedKeys);
  }
}
