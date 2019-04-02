import yargs from 'yargs';
import VueI18NExtract from './Api';
import { I18NReport, I18NItem, I18NLanguage } from './library/models';
import path from 'path';

const api = new VueI18NExtract();

const vueFilesOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'The Vue.js file(s) you want to extract i18n strings from. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern)',
  demand: true,
  alias: 'v',
};

const languageFilesOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'The language file(s) you want to compare your Vue.js file(s) to. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern) ',
  demand: true,
  alias: 'l',
};

const outputOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'Use if you want to create a json file out of your report. (ex. -o output.json)',
  demand: false,
  alias: 'o',
};

const argv = yargs
.command('report', 'Create a report from a glob of your Vue.js source files and your language files.', {
  vueFiles: vueFilesOptions,
  languageFiles: languageFilesOptions,
  output: outputOptions,
})
.help()
.demandCommand(1, '')
.showHelpOnFail(true);

export async function run (): Promise<any> {
  const command = argv.argv;

  switch (command._[0]) {
    case 'report':
      report(command);
      break;
  }
}

async function report (command: any): Promise<void> {
  const { vueFiles, languageFiles, output } = command;

  const resolvedVueFiles: string = path.resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles: string = path.resolve(process.cwd(), languageFiles);

  const i18nReport: I18NReport = api.createI18NReport(resolvedVueFiles, resolvedLanguageFiles);
  api.logI18NReport(i18nReport);

  if (output) {
    await api.writeReportToFile(i18nReport, path.resolve(process.cwd(), output));
    // tslint:disable-next-line
    console.log(`The report has been has been saved to ${output}`);
  }
}

export default api;
