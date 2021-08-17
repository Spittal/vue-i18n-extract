
import path from 'path';
import { exec, ExecException } from 'child_process';

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
    expect(result.stderr).toContain(`[vue-i18n-extract] Required configuration vueFiles is missing.`);
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
      expect((await runCLI([
        '--vueFiles',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
      ])).code).not.toBe(0);

      expect((await runCLI([
        'report',
        '--vueFiles',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./fixtures/language-files/**/*.?(json|yml|yaml)'`,
      ])).code).toBe(0);

      expect((await runCLI([
        'report',
        '--vueFiles',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./fixtures/language-files/**/*.?(json|yml|yaml)'`,
        '--output',
        `'/dev/null'`
      ])).code).toBe(0);

      expect((await runCLI([
        'report',
        '--vueFiles',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./fixtures/language-files/**/*.?(json|yml|yaml)'`,
        '--output',
        `'/dev/null'`,
        '--add',
      ])).code).toBe(0);

      expect((await runCLI([
        'report',
        '--vueFiles',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '--languageFiles',
        `'./fixtures/language-files/**/*.?(json|yml|yaml)'`,
        '--output',
        `'/dev/null'`,
        '--add',
        '--ci',
      ])).code).toBe(0);
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
    });
  });
});
