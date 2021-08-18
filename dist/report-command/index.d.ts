import { ReportOptions, I18NReport } from '../types';
export declare function createI18NReport(vueFiles: string, languageFiles: string): I18NReport;
export declare function reportCommand(command: ReportOptions): Promise<I18NReport>;
export * from './vue-files';
export * from './language-files';
export * from './report';
