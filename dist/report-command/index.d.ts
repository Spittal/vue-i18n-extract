import { ReportOptions, I18NReport } from '../types';
export declare function createI18NReport(vueFiles: string, languageFiles: string, command: ReportOptions): I18NReport;
export declare function reportFromConfigCommand(): Promise<void> | void;
export declare function reportCommand(command: ReportOptions): Promise<void>;
export * from './vue-files';
export * from './language-files';
export * from './report';
