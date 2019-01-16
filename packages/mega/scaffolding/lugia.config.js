/* eslint-disable */
export default {
  disableCSSModules: true,
  cssModulesWithAffix: true,
  publicPath: '/',
  entry: './.lugia/index.js',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@lugia/lugia-web',
        libraryDirectory: 'dist',
      },
    ],
  ],
  applyWebpack(webpackConfig, { webpack, merge }) {
    return webpackConfig;
  },
};
