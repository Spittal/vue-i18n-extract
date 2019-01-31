const lib = require('./lib');

module.exports = {
  api() {
    return {
      readVueFiles: lib.readVueFiles,
      readLangFiles: lib.readLangFiles,
      convertDotToObject: lib.convertDotToObject,
    };
  },
};
