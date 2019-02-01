/* eslint-disable */
require = require('esm')(module);
/* eslint-disable */
const api = require('../api');

describe('API', () => {
  test('analyzeVueFiles', async () => {
    const src = './src/__tests__/test_demo_files/**/*.js';
    const generateObj = await api.analyzeVueFiles(src);
    expect(generateObj ).toEqual({"test": "test"});
  });
});

