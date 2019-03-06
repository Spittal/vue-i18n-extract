import yargs from 'yargs';
import Api from './Api';
import { I18NItem, I18NLanguage } from './library/models';

const srcOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'The file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern), ... ',
  demand: true,
  alias: 's',
};

const langFolderOptions: yargs.Options = {
  // tslint:disable-next-line:max-line-length
  describe: 'The language file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns (ex. *, ?, (pattern|pattern|pattern), ... ',
  demand: true,
  alias: 'l',
};

const argv = yargs
.command('diff', 'Diff', {
  src: srcOptions,
  langFolder: langFolderOptions,
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

  const { src, langFolder } = command;

  const parsedVueFiles: I18NItem[] = await api.parseVueFiles(src);
  const parsedLanguageFiles: I18NLanguage = api.parseLanguageFiles(langFolder);

  const report = api.createReport(parsedVueFiles, parsedLanguageFiles);

  api.logReport(report);
}
