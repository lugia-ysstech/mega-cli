import { CLIEngine } from 'eslint';
import { join, basename } from 'path';

const cwd = join(__dirname, '../');

function testRules(dir) {
  const rulesDir = join(cwd, './test', dir);
  const cli = new CLIEngine({
    cwd,
    allowInlineConfig: true,
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    fix: false,
    useEslintrc: true
  });
  const report = cli.executeOnFiles([rulesDir]);
  expect({
    ...report,
    results: report.results.map(r => ({
      ...r,
      filePath: basename(r.filePath)
    }))
  }).toMatchSnapshot();
}

describe('rules', () => {
  it('should report errors', () => {
    testRules('./errors');
  });

  it('lints', () => {
    testRules('./lints');
  });
});
