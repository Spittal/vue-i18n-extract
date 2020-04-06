module.exports = {
  parser:  '@typescript-eslint/parser',
  extends:  [
    'plugin:@typescript-eslint/recommended',
  ],
 parserOptions:  {
    ecmaVersion:  2020,
  },
  rules: {
    '@typescript-eslint/camelcase': 0,
  },
};
