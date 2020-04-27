/// <reference types="node" />
import { I18NItem, I18NLanguage, I18NReport } from '../types';
export declare enum VueI18NExtractReportTypes {
    None = 0,
    Missing = 1,
    Unused = 2,
    Dynamic = 4,
    All = 7
}
export declare function extractI18NReport(parsedVueFiles: I18NItem[], parsedLanguageFiles: I18NLanguage, reportType?: VueI18NExtractReportTypes): I18NReport;
export declare function writeReportToFile(report: I18NReport, writePath: string): Promise<NodeJS.ErrnoException | void>;
