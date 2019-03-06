import dot from 'dot-object';
export function extractI18nItemsFromLanguageFiles(languageFiles) {
    return languageFiles.reduce((accumulator, file) => {
        const language = file.fileName.substring(file.fileName.lastIndexOf('/') + 1, file.fileName.lastIndexOf('.'));
        const flattenedObject = dot.dot(file.content);
        const i18nInFile = Object.keys(flattenedObject).map((key, index) => {
            return {
                line: index,
                path: key,
                file: file.fileName,
            };
        });
        accumulator[language] = i18nInFile;
        return accumulator;
    }, {});
}
