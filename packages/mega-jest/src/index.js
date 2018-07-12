import jestCli from 'jest-cli';

const debug = require('debug')('mega-jest');
const explorer = require('cosmiconfig')('jest', { stopDir: process.cwd() });

process.env.NODE_ENV = 'test';

export default async function(opts = {}) {
  const { watch, coverage, cwd = process.cwd() } = opts;

  let jestConfig = {};
  try {
    const { config } = await explorer.search();
    if (config) jestConfig = config;
  } catch (e) {} // eslint-disable-line

  const config = {
    rootDir: process.cwd(),
    setupFiles: [
      require.resolve('./shim.js'),
      require.resolve('./setupTests.js'),
    ],
    transform: {
      '\\.jsx?$': require.resolve('./jsTransformer.js'),
      '\\.tsx?$': require.resolve('./tsTransformer.js'),
    },
    testMatch: ['**/?(*.)(spec|test|e2e).(j|t)s?(x)'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    setupTestFrameworkScriptFile: require.resolve('./jasmine.js'),
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': require.resolve('identity-obj-proxy'),
    },
    globals: {
      'ts-jest': {
        useBabelrc: true,
      },
    },
    ...(coverage
      ? {
          collectCoverageFrom: [
            '**/*.{ts,tsx,js,jsx}',
            '!**/node_modules/**',
            '!**/vendor/**',
            '!**/*.d.ts',
          ],
          collectCoverage: true,
          coveragePathIgnorePatterns: ['/node_modules/'],
        }
      : {}),
    ...jestConfig,
  };

  return new Promise((resolve, reject) => {
    jestCli
      .runCLI(
        {
          watch,
          testPathPattern: process.argv
            .slice(2)
            .filter(arg => !arg.startsWith('-')),
          config: JSON.stringify(config),
        },
        [cwd],
      )
      .then(result => {
        debug(result);
        const { results } = result;
        // const success = results.every(result => result.success);
        if (results.success) {
          resolve();
        } else {
          reject(new Error('Jest failed'));
        }
      })
      .catch(e => {
        console.log(e);
      });
  });
}
