# @lugia/mega-webpack

> 对 `webpack` 的包装，零配置使用

## based on `@lugia/mega-webpack`

- @lugia/mega-scripts

## How to config

在项目根目录下新建文件 `webpack.config.js`：

```js
module.exports = {
  alias: {
    react: 'preact-compat',
  },
};
```

### Options

|                        | Default Value                                             | Notes |
| :--------------------- | :-------------------------------------------------------- | :---- |
| entry                  | null                                                      |       |
| browsers               | [ '>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' ] |       |
| theme                  | {}                                                        |       |
| babel                  |                                                           |       |
| define                 | {}                                                        |       |
| outputPath             | null                                                      |       |
| publicPath             | undefined                                                 |       |
| commons                | []                                                        |       |
| hash                   | false                                                     |       |
| externals              | {}                                                        |       |
| copy                   | []                                                        |       |
| disableCSSModules      | false                                                     |       |
| extraBabelIncludes     | []                                                        |       |
| extraResolveExtensions | []                                                        |       |
| extraPostCSSPlugins    | []                                                        |       |
| ignoreMomentLocale     | false                                                     |       |
| extraResolveModules    | []                                                        |       |
| disableCSSSourceMap    | false                                                     |       |
| sass                   | {}                                                        |       |
| devtool                | false                                                     |       |

## API

**mega-webpack/getConfig**

通过参数获取 webpack 配置

在开发或者构建时使用，会获取预设的配置，包含构建 react 技术栈应用的所有 loader 和 plugin

```js
import { getConfig } from '@lugia/mega-webpack';

const webpackConfig = getConfig(options);
```

**mega-webpack/dev**

启动服务，开发

```js
import { dev } from '@lugia/mega-webpack';

dev({
  webpackConfig,
  beforeServer,
  afterServer,
  proxy,
  ...otherConfig,
});
```

**mega-webpack/build**

打包构建

```js
import { build } from '@lugia/mega-webpack';

build({
  webpackConfig,
  success,
  ...otherConfig,
});
```

**mega-webpack/webpack**

```js
import webpack from '@lugia/mega-webpack';
```

## 相关

- [debug](https://github.com/visionmedia/debug)
- [glob](https://github.com/isaacs/node-glob)
- [resolve](https://github.com/browserify/resolve)
- [webpack-merge](https://github.com/survivejs/webpack-merge)
- [babel-plugin-import](https://github.com/ant-design/babel-plugin-import)
- [autoprefixer](https://github.com/postcss/autoprefixer)
- [eslint](https://github.com/eslint/eslint)
- [babel-eslint](https://github.com/babel/babel-eslint)
