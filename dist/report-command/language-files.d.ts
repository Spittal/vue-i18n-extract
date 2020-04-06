import { SimpleFile, I18NLanguage, I18NItem } from '../types';
export declare function readLangFiles(src: string): SimpleFile[];
export declare function writeMissingToLanguage(resolvedLanguageFiles: string, missingKeys: I18NItem[]): void;
export declare function parseLanguageFiles(languageFilesPath: string): I18NLanguage;
