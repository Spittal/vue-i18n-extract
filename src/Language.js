
/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const path = require('path');

class Language {
  constructor(asd) {
    this.filePath = path.resolve(process.cwd(), asd);
    this.parsedContent = this.readFile();
  }

  readFile() {
    const languageModule = require(this.filePath);
    const langModule = require(this.filePath);
    const { default: defaultImport } = langModule;
    const langObj = (defaultImport) ? defaultImport : langModule;
    return langObj;
  }
};

const l = new Language('./demo/lang/de_DE.js');

console.log(l.parsedContent);
console.log(l.parsedContent);

module.exports = Language;