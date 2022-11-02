
import path from 'path';
import { exec, ExecException } from 'child_process';
import rimraf from 'rimraf';

function runCLI (args: string[] = []): Promise<{
  code: number;
  error: ExecException | null;
  stdout: string;
  stderr: string;
}> {
  return new Promise(resolve => {
    exec(
      `node ${path.resolve(__dirname + '../../../bin/vue-i18n-extract.js')} ${args.join(' ')}`,
      { cwd: '.' },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr,
        });
      },
    );
})}

describe('vue-i18n-extract CLI', () => {
  it('Fail with no arugments, and give a hint.', async () => {
    const result = await runCLI();

    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain(`Required configuration vueFiles is missing.`);
  });

  it('Fail with invalid detect, and give a hint.', async () => {
    const result = await runCLI([
      '--vueFiles',
      `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
      '--languageFiles',
      `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
      '--detect',
      `'invalidDetect'`,
    ]);

    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain(`Invalid 'detect' value(s): invalidDetect`);
  });

  it('Show help', async () => {
    const result = await runCLI(['--help']);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Usage:');
    expect(result.stdout).toContain('$ vue-i18n-extract.js');
    expect(result.stdout).toContain(`Create a report from a glob of your Vue.js source files and your language files.`);
    expect(result.stdout).toContain(`init`);
  });

  describe('Report Command', () => {
    it('Run the command with defined options', async () => {
      rimraf.sync('./vue-i18n-extract.config.js');

      expect((await runCLI([
        '--vueFiles',
        `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
      ])).code).not.toBe(0); // we expect a fail if there's no languageFiles option

      expect((await runCLI([
        '--vueFiles',
        `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
      ])).code).toBe(0);

      expect((await runCLI([
        '--vueFiles',
        `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
        '--detect',
        `'missing'
        `,
      ])).code).toBe(0);

      expect((await runCLI([
        '--vueFiles',
        `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
        '--output',
        `'/dev/null'`
      ])).code).toBe(0);

      // The --add option literally adds keys to our fixtures, which breaks further tests.
      // expect((await runCLI([
      //   '--vueFiles',
      //   `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
      //   '--languageFiles',
      //   `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
      //   '--output',
      //   `'/dev/null'`,
      //   '--add',
      // ])).code).toBe(0);

      // The --remove option literally remove keys from our fixtures, which breaks further tests.
      // expect((await runCLI([
      //   '--vueFiles',
      //   `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
      //   '--languageFiles',
      //   `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
      //   '--output',
      //   `'/dev/null'`,
      //   '--remove',
      // ])).code).toBe(0);

      expect((await runCLI([
        '--vueFiles',
        `'./tests/fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./tests/fixtures/lang/**/*.?(json|yml|yaml)'`,
        '--output',
        `'/dev/null'`,
        '--ci',
      ])).code).not.toBe(0); // We expect this to fail if CI is true, because there's missing and unused keys
    });
  });

  describe('Init Command', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    it('creates a config file', async () => {
      expect((await runCLI([
        'init',
      ])).code).toBe(0);

      rimraf.sync('./vue-i18n-extract.config.js');
    });
  });
});
