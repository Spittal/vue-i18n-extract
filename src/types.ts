export type ReportOptions = {
  vueFiles: string;
  languageFiles: string;
  output?: string;
  outputOrder?: OptionsOutputOrder;
  exclude?: string[];
  add?: boolean;
  remove?: boolean;
  ci?: boolean;
  separator?: string;
  noEmptyTranslation?: string;
  detect?: DetectionType[];
}

export enum DetectionType {
  Missing = "missing",
  Unused = "unused",
  Dynamic = "dynamic"
}

export type OptionsOutputOrder = 'append' | 'lexical';

export type SimpleFile = {
  fileName: string;
  path: string;
  content: string;
}

export type I18NItem = {
  line?: number;
  path: string;
  file?: string;
  language?: string;
}

export type I18NItemWithBounding = I18NItem & {
  previousCharacter: string;
  nextCharacter: string;
}

export type I18NLanguage = {
  [language: string]: I18NItem[];
}

export type I18NReport = {
  missingKeys: I18NItem[];
  unusedKeys: I18NItem[];
  maybeDynamicKeys: I18NItem[];
}
