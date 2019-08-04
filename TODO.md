# TODO

## import { isPlainObject } from '@lugia/mega-utils/lib/is';

## mega-webpack 的配置文件调整

[cosmiconfig](https://github.com/davidtheclark/cosmiconfig)

配置文件需要单独做一个包，以便供其他包使用用户的配置项

lugia.config.js

## lib ~ src sourcemap

## mega-scripts

- ~~[browser-sync](https://github.com/BrowserSync/browser-sync)~~
- ~~mock: 支持引入 json、excel、csv 格式的文件作为数据来源~~

proxy 代理的配置需要丰富，参考 [a](https://webpack.js.org/configuration/dev-server/#devserver-proxy)，[b](https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js)，直接在 mock.config.js 中加一个 proxy 字段做配置扩展，使用 http-proxy-middleware

browser-sync 热更新时命令行不刷新界面

## use [react-hot-loader](https://github.com/gaearon/react-hot-loader)

## [HMR] 支持

## webpack 4

## BUG

### packages/mega-webpack/test/build.test.js

```
F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\loader-runner\
lib\loadLoader.js:35
                        throw new Error("Module '" + loader.path + "' is not a loader (must have normal or
pitch function)");
                        ^

Error: Module 'F:\yssgitlab\lugia-mega\packages\mega-webpack\lib\debugLoader.js' is not a loader (must have
 normal or pitch function)
    at loadLoader (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\loader-runner\lib\loadLoader.
js:35:10)
    at iteratePitchingLoaders (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\loader-runner\lib
\LoaderRunner.js:169:2)
    at runLoaders (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\loader-runner\lib\LoaderRunne
r.js:362:2)
    at NormalModule.doBuild (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\lib\NormalM
odule.js:182:3)
    at NormalModule.build (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\lib\NormalMod
ule.js:275:15)
    at Compilation.buildModule (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\lib\Comp
ilation.js:157:10)
    at moduleFactory.create (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\lib\Compila
tion.js:460:10)
    at factory (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\lib\NormalModuleFactory.
js:243:5)
    at applyPluginsAsyncWaterfall (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\lib\N
ormalModuleFactory.js:94:13)
    at F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\tapable\lib\Tapable.js:268:11
    at NormalModuleFactory.params.normalModuleFactory.plugin (F:\yssgitlab\lugia-mega\packages\mega-webpack
\node_modules\webpack\lib\CompatibilityPlugin.js:52:5)
    at F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\tapable\lib\Tapable.js:270:14
    at fileExistsWithCase (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-paths-
webpack-plugin\index.js:160:11)
    at that.fileExistsWithCase (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-p
aths-webpack-plugin\index.js:112:7)
    at that.fileExistsWithCase (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-p
aths-webpack-plugin\index.js:112:7)
    at CaseSensitivePathsPlugin.Object.<anonymous>.CaseSensitivePathsPlugin.fileExistsWithCase (F:\yssgitla
b\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-paths-webpack-plugin\index.js:82:5)
    at that.getFilenamesInDir (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-pa
ths-webpack-plugin\index.js:105:10)
    at CaseSensitivePathsPlugin.Object.<anonymous>.CaseSensitivePathsPlugin.getFilenamesInDir (F:\yssgitlab
\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-paths-webpack-plugin\index.js:50:5)
    at CaseSensitivePathsPlugin.Object.<anonymous>.CaseSensitivePathsPlugin.fileExistsWithCase (F:\yssgitla
b\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-paths-webpack-plugin\index.js:88:8)
    at that.getFilenamesInDir (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-pa
ths-webpack-plugin\index.js:105:10)
    at Array.fs.readdir (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\case-sensitive-paths-we
bpack-plugin\index.js:66:5)
    at Storage.Object.<anonymous>.Storage.finished (F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modu
les\webpack\node_modules\enhanced-resolve\lib\CachedInputFileSystem.js:40:15)
    at F:\yssgitlab\lugia-mega\packages\mega-webpack\node_modules\webpack\node_modules\enhanced-resolve\lib
```

## v1.x

![todo](./docs/design/v1_todo.png)

- [ ] 页面管理面板需要重做优化

- [ ] 日志可以发送给我们，以分析

- [ ] package.json 修改面板

- [ ] mega-scripts 在部分机器上不能多开项目的问题

* [x] ~~_崩溃时可以恢复，对 redux store 修改时做存储到 IndexedDB 做恢复_~~ [2019-07-04]

* [x] ~~_用户日志查看、存储到本地_~~ [2019-07-04]

* [x] ~~_资源图片管理_~~ [2019-07-04]

* [x] ~~_mega 文档_~~ [2019-06-17]

* [x] ~~_在 xxx 中打开_~~ [2019-06-17]

* [x] ~~_依赖管理_~~ [2019-06-17]

* [x] ~~_打开已存在的项目_~~ [2019-06-17]

* [ ] 项目发布面板优化

* [x] ~~_mega 安装包安装慢_~~ [2019-08-05]

* [ ] 多级路由修改，动态路由，看下最初的设计

* [x] ~~_model 缺刷新按钮_~~ [2019-08-05]

* [ ] npm 源可以修改设置

* [x] ~~_预览和导出缺少日志消息_~~ [2019-08-05]

* [ ] 依赖面板需要优化，模糊查询，最新版本信息

* [x] ~~_菜单图标样式不对_~~ [2019-08-05]

* [ ] 图片选择器

* [x] ~~_项目启动慢_~~ [2019-08-05]

* [x] ~~_model 新增时没有 loading 状态提示而且新增比较慢_~~ [2019-08-05]

* [x] ~~\*点击预览反应很慢而且没有提示~~~\*~~ [2019-08-05]

* [ ] 设置加个清除缓存的按钮

* [ ] 微应用的优化，模型 页面都可以自定义选择，需要从 lugiad 中获取模型，依赖，组建，资源等的信息

* [ ] lugia.config.js 设置面板

* [ ] 可以选择启用 yarn workspace，需要提醒注意事项

* [ ] 设计器的错误需要单独捕获

* [ ] mega 内存文件系统，减少文件的读写 I/O

* [ ] Technical Preview

* [ ] 在线升级

* [x] ~~_微前端的改造。_~~ [2019-08-05]
      mega 建主项目，可以集成微前端项目。
      用 mega 建的项目可以发布，发布之前把 lugiad 文件转义为 js 文件。
      模型层上需要替换掉 name 为 packagename+name

* [x] ~~_mega 建 lerna 工程_~~ [2019-06-17]
      里面提供几个样例 package，
      在工程里有个脚本可以快捷新建 package，
      可以继续使用 mega 新建 lerna 子 package

* [ ] mega 菜单改造，功能加上

* [ ] 用户习惯交互优化，存储起来
      分为应用级别、项目级别、页面级别等

* [x] ~~_创建项目的目录选择可选可输_~~ [2019-07-04]

* [ ] 可以将 SVG 作为一个 React 组件导入，还可以在 JSX 中使用这个 SVG
      [Transform SVGs into React components](https://github.com/smooth-code/svgr)

* [ ] @lugia/mega-polyfill
      This package includes polyfills for various browsers.
      [react-app-polyfill](https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill)

* [ ] [Workbox service worker](https://github.com/facebook/create-react-app/pull/4169)

* [ ] 性能优化

* [ ] Set baseUrl from jsconfig.json/tsconfig.json
      https://github.com/facebook/create-react-app/pull/6656

* [ ] Adds PostCSS Normalize
      https://github.com/facebook/create-react-app/pull/5810

* [ ] Support React Hooks
      https://github.com/facebook/create-react-app/pull/5997

* [ ] Update to core-js@3
      https://github.com/facebook/create-react-app/pull/6769
      https://babeljs.io/blog/2019/03/19/7.4.0#core-js-3-7646-https-githubcom-babel-babel-pull-7646

* [ ] .graphql and .gql file loading with graphql.macro
      https://github.com/facebook/create-react-app/pull/5481

* [ ] move the TypeScript codebase from TSLint to typescript-eslint
      https://github.com/typescript-eslint/typescript-eslint
      https://github.com/facebook/create-react-app/pull/6513

* [ ] 优化 browserslist 的配置项在 babel、autoprefixer
      区分生产和开发环境？
      https://github.com/facebook/create-react-app/pull/6608

* [x] ~~_@lugia/mega-jest_~~ [2019-04-30]
      更新到 Jest 24
      https://github.com/facebook/create-react-app/pull/6278

* [ ] Getting Started With Plug'n'Play
      https://gist.github.com/arcanis/02b49752c385908479734d8027d7a6c7
      https://github.com/facebook/create-react-app/pull/5269

* [ ] @lugia/mega-config
      lugia.config.js
      [cosmiconfig](https://github.com/davidtheclark/cosmiconfig)
      [craco](https://github.com/sharegate/craco/blob/master/packages/craco/README.md)
      [react-app-rewired](https://github.com/timarney/react-app-rewired)

## NEXT v2

总体目标是通过提供以物料体系、插件体系为内核的生态能力，加上官方维护的核心物料、插件，繁荣的社区物料、插件，实现一个开放、自由定制的大前端可视化设计开发工具。

标准、高效、开箱即用的设计开发体验。

- [ ] 插件体系
      插件式，支持热插拔
      [webpack-chain](https://github.com/neutrinojs/webpack-chain)
      移动端
      微前端
      electron
      vscode 插件设计
      vue-cli 3 插件设计

- [ ] 快捷的生态共建能力，物料体系、插件体系

- [ ] 自定义主题功能，脚手架可以配置

- [ ] 在 cli 上对标 [umi](https://github.com/umijs/umi) 和 [vue-cli 3](https://github.com/vuejs/vue-cli)

- [ ] 在图形化界面上对标 [vue ui](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-ui/README.md) 和 [ice](https://github.com/alibaba/ice/)

- [ ] 在可视化页面设计系统上对标 [fusion](https://fusion.design/) 和 [sketch](https://www.sketch.com/)

- [ ] 重构 mock 服务，功能上 [mockit](https://github.com/boyney123/mockit)，[zero](https://github.com/boyney123/mockit)的基于文件系统的路由

- [ ] 引入文档服务，[ebook-cli](http://192.168.102.73:8081/hanjingbo/ebook-cli)、[语雀](https://www.yuque.com/)

- [ ] 场景化 IDE，引入 [Monaco](https://github.com/react-monaco-editor/react-monaco-editor)、[xterm.js](https://github.com/xtermjs/xterm.js)、[ChromeDevTools](https://github.com/ChromeDevTools/awesome-chrome-devtools)、文件操作、Android/ios 模拟器，[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)，[蚂蚁开发者工具，服务蚂蚁生态的场景化 IDE 研发框架](https://zhuanlan.zhihu.com/p/32329583)
