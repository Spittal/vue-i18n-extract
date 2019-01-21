const fs = require('fs');
const glob = require('glob');
const dot = require('dot-object');
const ss = require('string-search');

module.exports = {
  readFilesContent(src) {
    const targetFiles = glob.sync(src);
    return targetFiles.map(f => Object.assign({}, { name: f, content: fs.readFileSync(f, 'utf8') }));
  },

  async mergeFilesContent(files) {
    let content;
    files.forEach((f) => {
      content += f.content;
    });
    return content;
  },

  extractLocs(content) {
    const regex = /(\$t\(')(.*)('\))/gi;
    return content.match(regex);
  },

  normalizeStrings(stringsArray) {
    return stringsArray.map(s => s.substring(s.lastIndexOf('$t(\'') + 4, s.lastIndexOf('\')')));
  },

  transformToObject(stringsArray) {
    const obj = {};
    stringsArray.forEach((el) => {
      obj[el] = el;
    });
    return dot.object(obj);
  },
};
