const lib = require('./lib');

module.exports = {
  async analyzeVueFiles(vueFilesPath) {
    const filesList = lib.readVueFiles(vueFilesPath);
    const matches = await lib.extractI18nStringsFromFilesCollection(filesList);
    return {
      astInfo: matches,
      generatedObj: lib.convertDotToObject(matches.map(m => m.text)),
    };
  },

  analyzeLanguageFiles(langFilesPath) {
    const analyzedLanguageFiles = [];
    lib.readLangFiles(langFilesPath).forEach((l) => {
      analyzedLanguageFiles.push({
        filename: l.name.replace(/^.*(\\|\/|:)/, ''),
        path: l.name,
        content: l.content,
      });
    });
    return analyzedLanguageFiles;
  },

  analyzeI18n(langFile, vueFilesAnalysis) {
    return lib.diffLangVueStrings(langFile, vueFilesAnalysis);
  },

  analyzeUnusedKeys(vueFilesAnalysis, langFile) {
    return lib.diffVueLangStrings(langFile, vueFilesAnalysis);
  },

  logReport(i18nAnalysis, title) {
    if (i18nAnalysis.missingEntries.length > 0) {
      lib.logReport(i18nAnalysis, title);
    }
  },

  logReportUnusedKeys(i18nAnalysis, title) {
    if (i18nAnalysis.missingEntries.length > 0) {
      lib.logReportUnusedKeys(i18nAnalysis, title);
    }
  },
};
