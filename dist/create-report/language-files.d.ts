import { SimpleFile, I18NLanguage, I18NItem } from '../types';
export declare function readLanguageFiles(src: string): SimpleFile[];
export declare function extractI18NLanguageFromLanguageFiles(languageFiles: SimpleFile[]): I18NLanguage;
export declare function writeMissingToLanguageFiles(parsedLanguageFiles: SimpleFile[], missingKeys: I18NItem[]): void;
export declare function removeUnusedFromLanguageFiles(parsedLanguageFiles: SimpleFile[], unusedKeys: I18NItem[]): void;
