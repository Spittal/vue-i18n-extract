import isValidGlob from 'is-valid-glob';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { SimpleFile } from './models';

// tslint:disable-next-line
require = require('esm')(module);

export function readVueFiles (src: string): SimpleFile[] {
  if (!isValidGlob(src)) {
    throw new Error('vueFiles isn\'\t a valid glob pattern.');
  }

  const targetFiles = glob.sync(src);

  if (targetFiles.length === 0) {
    throw new Error('vueFiles glob has no files.');
  }

  return targetFiles.map((f) => {
    const fileName = f.replace(process.cwd(), '');
    return { fileName, path: f, content: fs.readFileSync(f, 'utf8') };
  });
}

export function readLangFiles (src: string): SimpleFile[] {
  if (!isValidGlob(src)) {
    throw new Error('languageFiles isn\'\t a valid glob pattern.');
  }

  const targetFiles = glob.sync(src);

  if (targetFiles.length === 0) {
    throw new Error('languageFiles glob has no files.');
  }

  return targetFiles.map((f) => {
    const langPath = path.resolve(process.cwd(), f);

    let langModule;
    const extension = langPath.substring(langPath.lastIndexOf('.')).toLowerCase();
    if ( extension === '.yaml' || extension === '.yml') {
      langModule = yaml.safeLoad(fs.readFileSync(langPath, 'utf8'));
    } else {
      langModule = require(langPath);
    }
    
    const { default: defaultImport } = langModule;

    const langObj = (defaultImport) ? defaultImport : langModule;

    const fileName = f.replace(process.cwd(), '');

    return { fileName, path: f, content: langObj };
  });
}
