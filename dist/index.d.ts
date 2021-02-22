/// <reference types="node" />
import * as report from './report-command';
export * from './init-command';
export * from './types';
export * from './report-command';
declare const _default: {
    createI18NReport(vueFiles: string, languageFiles: string, command: import("./types").ReportOptions): import("./types").I18NReport;
    reportFromConfigCommand(): void | Promise<void>;
    reportCommand(command: import("./types").ReportOptions): Promise<void>;
    readVueFiles(src: string): import("./types").SimpleFile[];
    parseVueFiles(vueFilesPath: string): import("./types").I18NItem[];
    writeMissingToLanguage(resolvedLanguageFiles: string, missingKeys: import("./types").I18NItem[]): void;
    parseLanguageFiles(languageFilesPath: string): import("./types").I18NLanguage;
    extractI18NReport(parsedVueFiles: import("./types").I18NItem[], parsedLanguageFiles: import("./types").I18NLanguage, reportType?: report.VueI18NExtractReportTypes): import("./types").I18NReport;
    writeReportToFile(report: import("./types").I18NReport, writePath: string): Promise<void | NodeJS.ErrnoException>;
    VueI18NExtractReportTypes: typeof report.VueI18NExtractReportTypes;
};
export default _default;
