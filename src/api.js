const lib = require('./lib');

module.exports = {
  api() {
    return {
      getFilesContent: lib.getFilesContent,
    };
  },
}