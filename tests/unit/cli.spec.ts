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
  it('Not run without arguments, but show tip', async () => {
    const result = await runCLI();
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain(`required option '-v, --vueFiles <vueFiles>' not specified`);

    const result2 = await runCLI(['report']);
    expect(result2.code).not.toBe(0);
    expect(result2.stderr).toContain(`required option '-v, --vueFiles <vueFiles>' not specified`);
  });

  it('Show help', async () => {
    const result = await runCLI(['--help']);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain(`Usage: vue-i18n-extract`);

    const result2 = await runCLI(['report', '--help']);
    expect(result2.code).toBe(0);
    expect(result2.stdout).toContain(`Usage: vue-i18n-extract report`);
  });

  describe('Report Command', () => {
    it('Run the command with defined options', async () => {
      expect((await runCLI([
        'report',
        '-v',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
      ])).code).not.toBe(0);

      expect((await runCLI([
        'report',
        '-v',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '-l',
        `'./fixtures/language-files/**/*.?(js|json|yml|yaml)'`,
      ])).code).toBe(0);

      expect((await runCLI([
        'report',
        '-v',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '-l',
        `'./fixtures/language-files/**/*.?(js|json|yml|yaml)'`,
        '-o',
        `'/dev/null'`
      ])).code).toBe(0);

      expect((await runCLI([
        'report',
        '-v',
        `'./fixtures/vue-files/**/*.?(vue|js)'`,
        '-l',
        `'./fixtures/language-files/**/*.?(js|json|yml|yaml)'`,
        '-o',
        `'/dev/null'`,
        '-a',
      ])).code).toBe(0);
    });
  });
});
