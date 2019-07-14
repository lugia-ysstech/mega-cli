import { CLIEngine } from 'eslint';
import { join } from 'path';

describe('rules', () => {
  it('should report semicolon errors(4)', () => {
    const cli = new CLIEngine({
      cwd: join(__dirname, '../'),
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      useEslintrc: true,
    });
    const { results } = cli.executeOnFiles([
      require.resolve('./rules/semicolon.js'),
    ]);
    expect(
      results.map(result =>
        result.messages.map(message => ({
          ...message,
          filePath: '',
        })),
      ),
    ).toMatchSnapshot();
    expect(results[0].messages.length).toBe(4);
  });
});
