import yargs from 'yargs';
import Api from './Api';
const srcOptions = {
    // tslint:disable-next-line:max-line-length
    describe: 'The file/files you want to analyze. It can be a path to a folder or to a file. It accepts glob patterns. (ex. *, ?, (pattern|pattern|pattern), ... ',
    demand: true,
    alias: 's',
};
const langFolderOptions = {
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
export default async function run() {
    const command = argv.argv;
    switch (command._[0]) {
        case 'diff':
            diff(command);
            break;
    }
}
async function diff(command) {
    const api = new Api();
    const { src, langFolder } = command;
    const parsedVueFiles = await api.parseVueFiles(src);
    const parsedLanguageFiles = api.parseLanguageFiles(langFolder);
    const report = api.createReport(parsedVueFiles, parsedLanguageFiles);
    api.logReport(report);
}
