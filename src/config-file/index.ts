import cac from 'cac';
import fs from 'fs';
import path from 'path';
import defaultConfig from './vue-i18n-extract.config';

export function initCommand(): void {
  fs.writeFileSync(
    path.resolve(process.cwd(), './vue-i18n-extract.config.js'),
    `module.exports = ${JSON.stringify(defaultConfig, null, 2)}`,
  );
}

export function resolveConfig (): Record<string, string>  {
  const argvOptions = cac().parse(process.argv, { run: false }).options;

  let options;

  try {
    const pathToConfigFile = path.resolve(process.cwd(), './vue-i18n-extract.config.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const configOptions = require(pathToConfigFile);

    console.info(`\nUsing config file found at ${pathToConfigFile}`);

    options = {
      ...configOptions,
      ...argvOptions
    };
  } catch {
    options = argvOptions;
  }

  options.exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude];

  return options;
}
