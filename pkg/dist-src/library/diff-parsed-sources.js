export function diffParsedSources(parsedSourceA, parsedSourceB) {
    const sourceBPaths = parsedSourceB.map((item) => item.path);
    return parsedSourceA.filter((i18nItem) => {
        return sourceBPaths.indexOf(i18nItem.path) === -1;
    });
}
