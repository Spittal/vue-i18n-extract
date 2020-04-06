import { ReportOptions, I18NReport } from '../types';
export declare function createI18NReport(vueFiles: string, languageFiles: string): I18NReport;
export declare function reportCommand(command: ReportOptions): Promise<void>;
