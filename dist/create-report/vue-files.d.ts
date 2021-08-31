import { SimpleFile, I18NItemWithBounding } from '../types';
export declare function readVueFiles(src: string): SimpleFile[];
export declare function extractI18NItemsFromVueFiles(sourceFiles: SimpleFile[]): I18NItemWithBounding[];
export declare function parseVueFiles(vueFiles: string): I18NItemWithBounding[];
