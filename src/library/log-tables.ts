import Table from 'cli-table3';
import { I18NItem } from './models';

export function logMissingKeys (keys: I18NItem[]): void {
  const table = new Table({
    style: {
      head: ['green'],
      border: ['white'],
      compact: true,
    },
    head: ['#', 'Language', 'File', 'Line', 'Missing i18n Entry'],
    colWidths: [4, 12, 40, 8, 30],
  });

  keys.forEach((key, i) => {
    table.push([i, key.language, key.file, key.line, key.path]);
  });
  // tslint:disable-next-line
  console.log(table.toString());
}

export function logUnusedKeys (keys: I18NItem[]): void {
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
    table.push([i, key.language, key.file, key.line, key.path]);
  });
  // tslint:disable-next-line
  console.log(table.toString());
}
