import babelJest from 'babel-jest';

export default babelJest.createTransformer({
  presets: [[require.resolve('@lugia/babel-preset-mega')]],
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
  babelrc: false,
});

module.exports = exports.default;
