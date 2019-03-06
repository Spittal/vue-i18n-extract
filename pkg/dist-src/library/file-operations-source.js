import ssearch from 'string-search';
export async function extractI18nItemsFromVueFiles(sourceFiles) {
    return new Promise(async (resolve) => {
        const keysInFileCollection = await Promise.all(sourceFiles.map(async (file) => [
            ...await searchAndReplaceForMethods(file),
            ...await searchAndReplaceForComponent(file),
            ...await searchAndReplaceForDirective(file),
        ]));
        resolve(keysInFileCollection.flat(1));
    });
}
async function searchAndReplaceForMethods(file) {
    const content = [];
    const methodRegex = /\$?tc?\(["'`](.*)["'`]/;
    // use string-search for getting the line number
    // but it doesn't return the RegEX capture group so...
    const res = await ssearch.find(file.content, methodRegex);
    if (res.length > 0) {
        res.forEach((r) => {
            // We can use the RegEX exec method to get the capture group
            // This removes the need for string replacement
            const path = methodRegex.exec(r.text)[1];
            content.push(createI18nItem(r, path, file));
        });
    }
    return content;
}
async function searchAndReplaceForComponent(file) {
    const content = [];
    const componentRegex = /(?:<i18n|<I18N)(?:.|\s)*(?:path=(?:"|'))(.*)(?:"|')/;
    const res = await ssearch.find(file.content, componentRegex);
    if (res.length > 0) {
        res.forEach((r) => {
            const path = componentRegex.exec(r.text)[1];
            content.push(createI18nItem(r, path, file));
        });
    }
    return content;
}
async function searchAndReplaceForDirective(file) {
    const content = [];
    const directiveRegex = /v-t="'(.*)'"/;
    const res = await ssearch.find(file.content, directiveRegex);
    if (res.length > 0) {
        res.forEach((r) => {
            const path = directiveRegex.exec(r.text)[1];
            content.push(createI18nItem(r, path, file));
        });
    }
    return content;
}
function createI18nItem(r, path, file) {
    return {
        line: r.line,
        path,
        file: file.fileName,
    };
}
