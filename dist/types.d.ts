export declare type ReportOptions = {
    vueFiles: string;
    languageFiles: string;
    output?: string;
    add?: boolean;
    remove?: boolean;
    ci?: boolean;
    separator?: string;
};
export declare type SimpleFile = {
    fileName: string;
    path: string;
    content: string;
};
export declare type I18NItem = {
    line?: number;
    path: string;
    file?: string;
    language?: string;
};
export declare type I18NItemWithBounding = I18NItem & {
    previousCharacter: string;
    nextCharacter: string;
};
export declare type I18NLanguage = {
    [language: string]: I18NItem[];
};
export declare type I18NReport = {
    missingKeys: I18NItem[];
    unusedKeys: I18NItem[];
    maybeDynamicKeys: I18NItem[];
};
