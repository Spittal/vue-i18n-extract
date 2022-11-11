/// <reference types="node" />
import { DetectionType, I18NItemWithBounding, I18NLanguage, I18NReport } from '../types';
export declare function extractI18NReport(vueItems: I18NItemWithBounding[], languageFiles: I18NLanguage, detect: DetectionType[]): I18NReport;
export declare function writeReportToFile(report: I18NReport, writePath: string): Promise<NodeJS.ErrnoException | void>;
