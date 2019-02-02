const lib = require('./lib');

module.exports = {
  async analyzeVueFiles(vueFilesPath) {
    const filesList = this.readVueFiles(vueFilesPath);
    const matches = await lib.extractI18nStringsFromFilesCollection(filesList);
    const generatedObj = lib.convertDotToObject(matches.map(m => m.text));
    return generatedObj;
  },

  analyzeLanguageFiles(langFilesPath) {
    const analyzedLanguageFiles = [];
    this.readLangFiles(langFilesPath).forEach((l) => {
      analyzedLanguageFiles.push({
        filename: l.name.replace(/^.*(\\|\/|:)/, ''),
        path: l.name,
        content: l.content,
      });
    });
    return analyzedLanguageFiles;
  },

  readVueFiles(src) {
    return lib.readVueFiles(src);
  },

  readLangFiles(src) {
    return lib.readLangFiles(src);
  },

  convertDotToObject(dotNotationStrings) {
    return lib.convertDotToObject(dotNotationStrings);
  },

  extractI18nStringsFromFilesCollection(filesCollection) {
    return lib.extractI18nStringsFromFilesCollection(filesCollection);
  },
};
