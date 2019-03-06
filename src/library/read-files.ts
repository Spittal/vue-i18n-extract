import isValidGlob from 'is-valid-glob';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import { SimpleFile } from './models';

// tslint:disable-next-line
require = require('esm')(module);

export function readVueFiles (src: string): SimpleFile[] {
  if (!isValidGlob(src)) {
    throw new Error('Src folder isn\'\t a valid glob pattern.');
  }

  const targetFiles = glob.sync(src);
  return targetFiles.map((f) => {
    return { fileName: f, path: f, content: fs.readFileSync(f, 'utf8') };
  });
}

export function readLangFiles (src: string): SimpleFile[] {
  if (!isValidGlob(src)) {
    throw new Error('langFolder folder isn\'\t a valid glob pattern.');
  }

  const targetFiles = glob.sync(src);
  return targetFiles.map((f) => {
    const langPath = path.resolve(process.cwd(), f);

    const langModule = require(langPath);
    const { default: defaultImport } = langModule;

    const langObj = (defaultImport) ? defaultImport : langModule;

    return { fileName: f, path: f, content: langObj };
  });
}
