import fs from 'fs';
import path from 'path';
import defaultConfig from './vue-i18n-extract.config.js';

export function initCommand(): void {
  fs.writeFileSync(
    path.resolve(process.cwd(), './vue-i18n-extract.config.js'),
    `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`,
  );
}

