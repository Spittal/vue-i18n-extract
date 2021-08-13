import fs from 'fs';
import path from 'path';
import defaultConfig from './vue-i18n-extract.config.js';

export function initCommand(): void {
  fs.writeFileSync(
    path.resolve(process.cwd(), './vue-i18n-extract.config.js'),
    `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`,
  );
}

export function resolveConfig (): string[] {
  try {
    const pathToConfigFile = path.resolve(process.cwd(), './vue-i18n-extract.config.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const configFile = require(pathToConfigFile);

    console.info(`\n[vue-i18n-extract] Using config file found at ${pathToConfigFile}\n`);

    const argsFromConfigFile: string[] = Object.keys(configFile).map(key => `--${key}`).reduce((accumulator, key, index) => {
      const value = Object.values(configFile)[index];
      if (value) {
        return [
          ...accumulator,
          key,
          ...((value === true) ? [] : [value]) as string[],
        ];
      }
      return accumulator;
    }, [] as string[]);

    const argv = [
      ...process.argv,
      ...argsFromConfigFile,
    ];

    return argv;
  }
}
