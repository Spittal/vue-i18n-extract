const lib = require('./lib');

module.exports = {
  async analyzeVueFiles(vueFilesPath) {
    const filesList = this.readVueFiles(vueFilesPath);
    const matches = await lib.extractI18nStringsFromFilesCollection(filesList);
    const generatedObj = lib.convertDotToObject(matches.map(m => m.text));
    return generatedObj;
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
