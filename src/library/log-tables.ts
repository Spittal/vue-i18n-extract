import Table from 'cli-table3';
import { I18NItem } from './models';

export function logMissingKeys(keys: I18NItem[]): void {
  const maxDigits = (keys.length - 1).toString().length

  const table = new Table({
    style: {
      head: ['green'],
      border: ['white'],
      compact: true,
    },
    head: ['#', 'Language', 'File', 'Line', 'Missing i18n Entry'],
    colWidths: [maxDigits + 2, 12, 40, 8, 30],
  });

  keys.forEach((key, i) => {
    const file_trunc = key.file.length > 40 ? `…${key.file.slice(key.file.length - 36, key.file.length)}` : key.file;
    table.push([i, key.language, file_trunc, key.line, key.path] as any);
  });
  // tslint:disable-next-line
  console.log(table.toString());
}

export function logUnusedKeys(keys: I18NItem[]): void {
  const table = new Table({
    style: {
      head: ['yellow'],
      border: ['white'],
      compact: true,
    },
    head: ['#', 'Language', 'File', 'Line', 'Unused i18n Entry'],
    colWidths: [4, 12, 40],
  });

  keys.forEach((key, i) => {
    table.push([i, key.language, key.file, key.line, key.path] as any);
  });
  // tslint:disable-next-line
  console.log(table.toString());
}

export default {
  logMissingKeys,
  logUnusedKeys,
};
