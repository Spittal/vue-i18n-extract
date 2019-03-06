import yargs from 'yargs';
import Api from './Api';
import { I18NItem, I18NLanguage } from './library/models';
import path from 'path';

const vueFilesOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'The file/files you want to extract i18n strings from. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern), ... ',
  demand: true,
  alias: 'v',
};

const languageFilesOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'The language file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern), ... ',
  demand: true,
  alias: 'l',
};

const argv = yargs
.command('diff', 'Diff', {
  vueFiles: vueFilesOptions,
  languageFiles: languageFilesOptions,
})
.help()
.demandCommand(1, '')
.showHelpOnFail(true);

export default async function run (): Promise<any> {
  const command = argv.argv;

  switch (command._[0]) {
    case 'diff':
      diff(command);
      break;
  }
}

async function diff (command: any): Promise<any> {
  const api = new Api();

  const { vueFiles, languageFiles } = command;

  const resolvedVueFiles = path.resolve(process.cwd(), vueFiles);
  const resolvedLanguageFiles = path.resolve(process.cwd(), languageFiles);

  const parsedVueFiles: I18NItem[] = await api.parseVueFiles(resolvedVueFiles);
  const parsedLanguageFiles: I18NLanguage = api.parseLanguageFiles(resolvedLanguageFiles);

  const report = api.createReport(parsedVueFiles, parsedLanguageFiles);

  api.logReport(report);
}
