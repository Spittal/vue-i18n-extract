export default {
  // Options documented in vue-i18n-extract readme.
  vueFiles: './src/**/*.?(js|vue)',
  languageFiles: './lang/**/*.?(json|yaml|yml|js)',
  exclude: [],
  output: false,
  add: false,
  remove: false,
  ci: false,
  separator: '.',
  noEmptyTranslation: '',
  missingTranslationString: '',
};
