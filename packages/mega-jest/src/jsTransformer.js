import { join } from 'path';
import babelJest from 'babel-jest';
import excapeRegExp from 'lodash.escaperegexp';
import getUserConfig from '@lugia/mega-config';
import registerBabel from '@lugia/mega-utils/lib/registerBabel';

const CONFIG_FILE_NAME = 'lugia.config.js';

const cwd = process.cwd();
const defaultConfig = {
  presets: [
    [
      require.resolve('@lugia/babel-preset-mega'),
      {
        corejs: false,
        helpers: false,
      },
    ],
  ],
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-transform-modules-commonjs'),
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          'ts-jest-babel-7': require.resolve('ts-jest-babel-7', [
            cwd,
            join(__dirname),
          ]),
          react: require.resolve('react', [cwd, join(__dirname)]),
          'react-dom': require.resolve('react-dom', [cwd, join(__dirname)]),
          enzyme: require.resolve('enzyme', [cwd, join(__dirname)]),
        },
      },
    ],
  ],
  babelrc: !!process.env.BABELRC,
};

registerBabel({
  only: [new RegExp(excapeRegExp(join(cwd, CONFIG_FILE_NAME)))],
  babelPreset: [
    require.resolve('@lugia/babel-preset-mega'),
    {
      corejs: false,
      helpers: false,
    },
  ],
  disablePreventTest: true,
});

const { config } = getUserConfig({
  cwd,
  configFileName: CONFIG_FILE_NAME,
});

export default babelJest.createTransformer(
  config.babel
    ? { ...defaultConfig, ...config.babel }
    : {
        presets: [
          ...defaultConfig.presets,
          ...(config.extraBabelPresets || []),
        ],
        plugins: [
          ...defaultConfig.plugins,
          ...(config.extraBabelPlugins || []),
        ],
        babelrc: defaultConfig.babelrc,
      },
);

module.exports = exports.default;
