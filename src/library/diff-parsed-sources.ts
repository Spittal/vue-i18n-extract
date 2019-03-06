import { merge } from 'lodash';
import { I18NItem } from './models';

export function diffParsedSources (
  parsedSourceA: I18NItem[],
  parsedSourceB: I18NItem[],
): I18NItem[] {
  const sourceBPaths = parsedSourceB.map((item) => item.path);

  return parsedSourceA.filter((i18nItem) => {
    return sourceBPaths.indexOf(i18nItem.path) === -1;
  });
}
