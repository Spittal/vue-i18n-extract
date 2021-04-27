export type ReportOptions = {
  vueFiles: string;
  languageFiles: string;
  output?: string;
  add?: boolean;
  remove?: boolean;
  dynamic?: number;
  ci?: boolean;
}

export type LanguageFile = {
  fileName: string;
  path: string;
  content: Record<string, unknown>;
}

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

export type I18NLanguage = {
  [language: string]: I18NItem[];
}

export type I18NReport = {
  missingKeys?: I18NItem[];
  unusedKeys?: I18NItem[];
  dynamicKeys?: I18NItem[];
}
