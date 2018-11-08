import babelJest from 'babel-jest';
import { getUserConfig } from '@lugia/mega-webpack';

const { config } = getUserConfig({
  cwd: process.cwd(),
  configFileName: 'lugia.config.js',
});
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
          'ts-jest-babel-7': require.resolve('ts-jest-babel-7'),
          react: require.resolve('react'),
          'react-dom': require.resolve('react-dom'),
          enzyme: require.resolve('enzyme'),
        },
      },
    ],
  ],
  babelrc: !!process.env.BABELRC,
};

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
