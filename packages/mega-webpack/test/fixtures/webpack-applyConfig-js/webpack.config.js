
export default {
  applyWebpack(webpackConfig, { webpack, merge }) {
    return merge(webpackConfig, {
      plugins: [
        new webpack.DefinePlugin({
          ABC: JSON.stringify('cde')
        })
      ]
    });
  }
};
