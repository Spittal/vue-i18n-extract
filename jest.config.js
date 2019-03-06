module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],
  testEnvironment: "node",
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|ts)|**/__tests__/*.(js|ts)'
  ]
};
