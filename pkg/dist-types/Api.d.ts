import { I18NItem, I18NLanguage, Report } from './library/models';
export default class API {
    parseVueFiles(vueFilesPath: string): Promise<I18NItem[]>;
    parseLanguageFiles(langFilesPath: string): I18NLanguage;
    createReport(parsedVueFiles: I18NItem[], parsedLanguageFiles: I18NLanguage): Report;
    logReport(report: Report): void;
}
