import fs from 'fs';
import { I18NItem, I18NLanguage, I18NReport } from '../types';

export enum VueI18NExtractReportTypes {
  None = 0,
  Missing = 1 << 0,
  Unused = 1 << 1,
  Dynamic = 1 << 2,
  All = ~(~0 << 3)
};

const mightBeUsedDynamically = function (languageItem: I18NItem, dynamicKeys: I18NItem[]): boolean {
  return dynamicKeys.some(dynamicKey => languageItem.path.includes(dynamicKey.path));
}

export function extractI18NReport (parsedVueFiles: I18NItem[], parsedLanguageFiles: I18NLanguage, reportType: VueI18NExtractReportTypes = VueI18NExtractReportTypes.Missing + VueI18NExtractReportTypes.Unused): I18NReport {
  const missingKeys: I18NItem[] = [];
  const unusedKeys: I18NItem[] = [];
  const dynamicKeys: I18NItem[] = [];
  const dynamicReportEnabled = reportType & VueI18NExtractReportTypes.Dynamic;

  Object.keys(parsedLanguageFiles).forEach(language => {
    let languageItems = parsedLanguageFiles[language];

    parsedVueFiles.forEach(vueItem => {
      const usedByVueItem = function (languageItem: I18NItem): boolean {
        return languageItem.path === vueItem.path || languageItem.path.startsWith(vueItem.path + '.');
      }

      if (dynamicReportEnabled && (vueItem.path.includes('${') || vueItem.path.endsWith('.'))) {
        dynamicKeys.push(({ ...vueItem, language }))
        return
      }

      if (!parsedLanguageFiles[language].some(usedByVueItem)) {
        missingKeys.push(({ ...vueItem, language }));
      }

      languageItems = languageItems.filter(languageItem => dynamicReportEnabled ?
        !mightBeUsedDynamically(languageItem, dynamicKeys) && !usedByVueItem(languageItem) :
        !usedByVueItem(languageItem));
    });

    unusedKeys.push(...languageItems.map((item) => ({ ...item, language })));
  });

  let extracts = {};
  if (reportType & VueI18NExtractReportTypes.Missing) {
    extracts = Object.assign(extracts, { missingKeys });
  }
  if (reportType & VueI18NExtractReportTypes.Unused) {
    extracts = Object.assign(extracts, { unusedKeys });
  }
  if (dynamicReportEnabled) {
    extracts = Object.assign(extracts, { dynamicKeys });
  }

  return extracts;
}

export async function writeReportToFile (report: I18NReport, writePath: string): Promise<NodeJS.ErrnoException | void> {
  const reportString = JSON.stringify(report);
  return new Promise((resolve, reject) => {
    fs.writeFile(
      writePath,
      reportString,
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      },
    );
  });
}

