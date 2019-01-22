require = require("esm")(module);

const fs = require('fs');
const glob = require('glob');
const ssearch = require('string-search');
const async = require("async");
const dot = require('dot-object');
const acorn = require("acorn"); 
const babel = require("@babel/core");
const deepMerge = require('lodash.merge');
const cloneDeep = require('lodash.clonedeep')
const deepDiff = require('deep-diff')

module.exports = {
  getFilesContent(src) {
    const targetFiles = glob.sync(src);
    return targetFiles.map(f => Object.assign({}, { name: f, content: fs.readFileSync(f, 'utf8') }));
  },

  addNewTextsToLangObj(lang, generatedObj) {
    const { default: langObj} = lang.content;
    const mergedObj = deepMerge(cloneDeep(langObj), cloneDeep(generatedObj));

    const diff = deepDiff(langObj, mergedObj).filter(d => d.kind === 'N');
  },

  diffObj(obj1, obj2) {
    const diff = Object.keys(obj2).reduce((diff, key) => {
      if (obj1[key] === obj2[key]) return diff
      return {
        ...diff,
        [key]: obj2[key]
      }
    }, {});
    return diff;
  },

  parseLangFiles(src) {
    const targetFiles = glob.sync(src);
    return targetFiles.map(f => Object.assign({}, { name: f, content: require(f) }));
  },

  extractText(filesList) {
    const content = [];
    return new Promise(function(resolve, reject) {
      async.eachSeries(filesList, function (file, callback) {
        ssearch.find(file.content, /(\$t\(')(.*)('\))/gi).then((res) => {
          if(res.length > 0) {
            res.forEach(r => {
              content.push({
                line: r.line,
                text: r.text.substring(r.text.lastIndexOf('$t(\'') + 4, r.text.lastIndexOf('\')')),
                file: file.name,
              });
            });
          }
          callback();
        });
      }, function (err) {
        if (err) { console.log(err); }
        resolve(content);
      });
    });
  },
  
  dotToObj(matches) {
    const obj = {};
    matches.forEach((el) => {
      obj[el.text] = el.text;
    });
    return dot.object(obj);
  },
};
