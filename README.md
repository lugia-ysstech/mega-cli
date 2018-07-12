# Lugia MEGA

**一个基于前端物料库体系的可视化开发工具**

> 高效、开箱即用、标准的前端工程化开发体验

![](docs/design/2018-05-18-10-28-24.png)

- [设计](./docs/design)

## Development, Contribute

```bash
$ git clone http://repo
```

> 安装 [yarn](https://yarnpkg.com)

```bash
# 安装依赖
$ yarn
```

> 使用 [lerna](https://github.com/lerna/lerna) 管理 packages

```bash
# 引导安装所有 packages 的依赖
$ yarn run bootstrap
```

### 开发

使用 babel 转义并监听所有的改动文件

```bash
$ yarn start
```

### 测试

```bash
$ yarn run test
```

### 生产构建

```bash
$ yarn run build
```

### 运行单个 package 的测试

```bash
$ yarn run lerna exec --scope mega-webpack -- yarn run test
```

### 发布 package 到 npm 或 私服

```bash
$ yarn run publish

# 忽略
$ yarn run publish -- --ignore mega-webpack
```

## 看 packages/\*/README.md
