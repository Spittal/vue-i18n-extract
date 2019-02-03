const lib = require('./lib');

module.exports = {
  async analyzeVueFiles(vueFilesPath) {
    const filesList = lib.readVueFiles(vueFilesPath);
    const matches = await lib.extractI18nStringsFromFilesCollection(filesList);
    const generatedObj = lib.convertDotToObject(matches.map(m => m.text));
    return generatedObj;
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

  analyzeI18n(langFileContent, vueI18nStrings) {
    return lib.diffLangVueStrings(langFileContent, vueI18nStrings);
  },

  logReport(i18nAnalysis) {
    lib.logReport(i18nAnalysis);
  },
};
