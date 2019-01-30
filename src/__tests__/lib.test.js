const lib = require('../lib');


describe('Lib', () => {
  describe('getFilesContent', () => {
    test('get vue and js files from src', () => {
      const src = './src/__tests__/test_demo_files/**/*.?(js|vue)';
      const results = lib.getFilesContent(src);
      expect(results.length).toEqual(4);
    });
    test('doesnt find any file', () => {
      const src = './src/__tests__/test_demo_files/**/*.?(txt)';
      const results = lib.getFilesContent(src);
      expect(results.length).toEqual(0);
    });
    test('get vue and js files and read the content', () => {
      const src = './src/__tests__/test_demo_files/**/*.?(js|vue)';
      const results = lib.getFilesContent(src);
      results.forEach((r) => {
        expect(r.name.split('/')[r.name.split('/').length - 1]).toEqual(r.content);
      });
    });
  });
});
