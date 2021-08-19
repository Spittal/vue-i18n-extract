/// <reference types="node" />
import { I18NItemWithBounding, I18NLanguage, I18NReport } from '../types';
export declare function extractI18NReport(vueItems: I18NItemWithBounding[], languageFiles: I18NLanguage): I18NReport;
export declare function writeReportToFile(report: I18NReport, writePath: string): Promise<NodeJS.ErrnoException | void>;
