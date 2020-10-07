import fs from 'fs';

const configFile = `
  module.exports = {
    vueFilesPath: './',
    languageFilesPath: './',
    options: {
      output: false, // false or the path where you want to create a json file containing your report.
      add: true, // false or true if you want to add missing keys into your json language file.
      dynamic: false, // false
                      // 'ignore' if you want to ignore dynamic keys false-positive.
                      // 'report' if you want to get dynamic keys report,
    }
  };
`;

export function initCommand(): void {
  fs.writeFileSync('.vuei18nextract.js', configFile);
}

