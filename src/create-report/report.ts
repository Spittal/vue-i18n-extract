import fs from 'fs';
import { DetectionType, I18NItem, I18NItemWithBounding, I18NLanguage, I18NReport } from '../types';

function stripBounding (item: I18NItemWithBounding): I18NItem {
  return {
    path: item.path,
    file: item.file,
    line: item.line,
  }
}

function mightBeDynamic (item: I18NItemWithBounding): boolean {
  return item.path.includes('${') && !!item.previousCharacter.match(/`/g) && !!item.nextCharacter.match(/`/g);
}

// Looping through the arays multiple times might not be the most effecient, but it's the easiest to read and debug. Which at this scale is an accepted trade-off.
export function extractI18NReport (vueItems: I18NItemWithBounding[], languageFiles: I18NLanguage, detect: DetectionType[]): I18NReport {
  const missingKeys: I18NItem[] = [];
  const unusedKeys: I18NItem[] = [];
  const maybeDynamicKeys: I18NItem[] = [];

  if (detect.includes(DetectionType.Dynamic)) {
   maybeDynamicKeys. push( ...vueItems
    .filter(vueItem => mightBeDynamic(vueItem))
    .map(vueItem => stripBounding(vueItem)));
   }

  Object.keys(languageFiles).forEach(language => {
    const languageItems = languageFiles[language];

    if (detect.includes(DetectionType.Missing)) {
    const missingKeysInLanguage = vueItems
      .filter(vueItem => !mightBeDynamic(vueItem))
      .filter(vueItem => !languageItems.some(languageItem => vueItem.path === languageItem.path))
      .map(vueItem => ({ ...stripBounding(vueItem), language }));

    missingKeys.push(...missingKeysInLanguage);
    }

    if (detect.includes(DetectionType.Unused)) {
    const unusedKeysInLanguage = languageItems
      .filter(languageItem => !vueItems.some(vueItem => languageItem.path === vueItem.path || languageItem.path.startsWith(vueItem.path + '.')))
      .map(languageItem => ({ ...languageItem, language }));

    unusedKeys.push(...unusedKeysInLanguage);
    }
  });

  return {
    missingKeys,
    unusedKeys,
    maybeDynamicKeys,
  };
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

