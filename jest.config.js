module.exports = {
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  'testRegex': '/__tests__/.*\\.(ts|js)$',
  'moduleFileExtensions': [
    'ts',
    'js',
    'json'
  ],
}
