import { readVueFiles, readLangFiles, extractI18nItemsFromVueFiles, extractI18nItemsFromLanguageFiles, diffParsedSources, logMissingKeys, logUnusedKeys, } from './library/index';
export default class API {
    async parseVueFiles(vueFilesPath) {
        const filesList = readVueFiles(vueFilesPath);
        return extractI18nItemsFromVueFiles(filesList);
    }
    parseLanguageFiles(langFilesPath) {
        const filesList = readLangFiles(langFilesPath);
        return extractI18nItemsFromLanguageFiles(filesList);
    }
    createReport(parsedVueFiles, parsedLanguageFiles) {
        const missingKeys = [];
        const unusedKeys = [];
        Object.keys(parsedLanguageFiles).forEach((language) => {
            const languageMissingKeys = diffParsedSources(parsedVueFiles, parsedLanguageFiles[language])
                .map((item) => (Object.assign({}, item, { language })));
            missingKeys.push(...languageMissingKeys);
            const languageUnusedKeys = diffParsedSources(parsedLanguageFiles[language], parsedVueFiles)
                .map((item) => (Object.assign({}, item, { language })));
            unusedKeys.push(...languageUnusedKeys);
        });
        return {
            missingKeys,
            unusedKeys,
        };
    }
    logReport(report) {
        logMissingKeys(report.missingKeys);
        logUnusedKeys(report.unusedKeys);
    }
}
