import jestCli from 'jest-cli';

const debugJest = require('debug')('mega-jest');
const explorer = require('cosmiconfig')('jest', { stopDir: process.cwd() });

process.env.NODE_ENV = 'test';

export default async function({
  watch,
  updateSnapshot,
  clearCache,
  showConfig,
  debug,
  coverage,
  cwd = process.cwd(),
}) {
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
    setupFilesAfterEnv: [require.resolve('./jasmine.js')],
    moduleNameMapper: {
      'react-native$': 'react-native-web',
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
        './fileTransform.js',
      ),
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
          updateSnapshot,
          clearCache,
          showConfig,
          debug,
          testPathPattern: process.argv
            .slice(2)
            .filter(arg => !arg.startsWith('-')),
          config: JSON.stringify(config),
        },
        [cwd],
      )
      .then(result => {
        debugJest(result);
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
