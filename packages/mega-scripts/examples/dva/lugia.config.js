export default {
  define: {
    'process.env.contextPath': process.env.contextPath,
  },
  applyWebpack(webpackConfig) {
    return webpackConfig;
  },
};
