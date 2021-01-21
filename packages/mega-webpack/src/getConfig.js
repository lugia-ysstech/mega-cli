import webpack from 'webpack';
import merge from 'webpack-merge';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import SystemBellWebpackPlugin from 'system-bell-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import SWPrecacheWebpackPlugin from 'sw-precache-webpack-plugin';
import ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin';
import autoprefixer from 'autoprefixer';
import { dirname, resolve, join, extname } from 'path';
import { existsSync, readJsonSync } from 'fs-extra';
import eslintFormatter from '@lugia/mega-utils/lib/eslintFormatter';
import stringifyObject from '@lugia/mega-utils/lib/stringifyObject';
import stripLastSlash from '@lugia/mega-utils/lib/stripLastSlash';
import readCommentsJSON from '@lugia/mega-utils/lib/readCommentsJSON';
import InterpolateHtmlPlugin from '@lugia/mega-utils/lib/InterpolateHtmlPlugin';
import getClientEnvironment from '@lugia/mega-utils/lib/getClientEnvironment';
import is from '@lugia/mega-utils/lib/is';
import assert from 'assert';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ProgressPlugin from 'progress-bar-webpack-plugin';
import { sync as resolveSync } from 'resolve';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import uglifyJSConfig from './defaultConfigs/uglifyJS';
import defaultBabelConfig from './defaultConfigs/babel';
import defaultBrowsers from './defaultConfigs/browsers';
import normalizeTheme from './normalizeTheme';
import { getPkgPath, shouldTransform } from './es5ImcompatibleVersions';

const debug = require('debug')('@lugia/mega-webpack:getConfig');

export default function getConfig(opts = {}, applyConfig) {
  const { cwd } = opts;
  assert(cwd, 'opts.cwd must be specified');

  const { PUBLIC_PATH } = process.env;
  const isDev = process.env.NODE_ENV === 'development';
  const publicUrl = isDev ? '' : stripLastSlash(PUBLIC_PATH || '');
  const env = getClientEnvironment(publicUrl);
  const theme = normalizeTheme(opts.theme);
  const browsers = opts.browserslist || defaultBrowsers;
  const postcssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebook/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'), // eslint-disable-line
      autoprefixer({
        browsers,
        flexbox: 'no-2009'
      }),
      ...(is.array(opts.extraPostCSSPlugins) ? opts.extraPostCSSPlugins : [])
    ]
  };
  const cssModulesConfig = {
    modules: true,
    localIdentName: isDev
      ? '[name]__[local]___[hash:base64:5]'
      : '[local]___[hash:base64:5]'
  };
  const lessOptions = {
    modifyVars: theme
  };
  const cssOptions = {
    importLoaders: 1,
    ...(isDev
      ? {}
      : {
          minimize: !(process.env.COMPRESS === 'none')
            ? {
                minifyFontValues: false
              }
            : false,
          sourceMap: !opts.disableCSSSourceMap
        })
  };

  function getCSSLoader(opt = {}) {
    const { cssModules, less, sass, sassOptions } = opt;

    // 由于 sass 安装比较慢，所以默认不启用
    // 当检测到项目里安装 node-sass、sass-loader 时，
    // 会启用 sass
    let hasSassLoader = true;
    let sassLoader;
    try {
      sassLoader = require.resolve('sass-loader', {
        paths: [opt.cwd, join(__dirname)]
      });
      require.resolve('node-sass', {
        paths: [opt.cwd, join(__dirname)]
      });
    } catch (e) {
      hasSassLoader = false;
    }

    return [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          ...cssOptions,
          ...(cssModules ? cssModulesConfig : {})
        }
      },
      {
        loader: require.resolve('postcss-loader'),
        options: postcssOptions
      },
      ...(less
        ? [
            {
              loader: require.resolve('less-loader'),
              options: lessOptions
            }
          ]
        : []),
      ...(sass && hasSassLoader
        ? [
            {
              loader: sassLoader,
              options: sassOptions
            }
          ]
        : [])
    ];
  }

  function exclude(filePath) {
    if (/node_modules/.test(filePath)) {
      return true;
    }
    if (opts.cssModulesWithAffix) {
      if (/\.module\.(css|less|sass|scss)$/.test(filePath)) return true;
    }
    if (opts.cssModulesExcludes) {
      /* eslint-disable */
      for (const exclude of opts.cssModulesExcludes) {
        if (filePath.indexOf(exclude) > -1) return true;
      }
      /* eslint-enable */
    }
  }

  function loadLugiadConfigFile(filePath) {
    if (existsSync(filePath)) {
      return readJsonSync(filePath);
    }

    return {};
  }

  function loadUiLibLugiadConfig(uiConfig) {
    let uiLugiadConfig = {};
    if (uiConfig && Array.isArray(uiConfig)) {
      uiConfig.forEach(uiLibInfo => {
        const { name } = uiLibInfo;
        const lugiadConfigFile = join(
          cwd,
          'node_modules',
          name,
          'dist/lugiad.config.json'
        );
        uiLugiadConfig = merge(
          uiLugiadConfig,
          loadLugiadConfigFile(lugiadConfigFile)
        );
      });
    }

    return uiLugiadConfig;
  }

  function loadLugiadConfig() {
    const lugiadConfigFile = join(cwd, 'config', 'lugiad.config.json');
    const projectLugiadConfig = loadLugiadConfigFile(lugiadConfigFile);
    const uiConfigPath = join(cwd, 'config', 'ui.config.json');
    const uiLibs = existsSync(uiConfigPath) ? readJsonSync(uiConfigPath) : [];
    const uiLibLugiadConfig = loadUiLibLugiadConfig(uiLibs);

    return merge(uiLibLugiadConfig, projectLugiadConfig);
  }

  const cssRules = [
    ...(opts.cssModulesExcludes
      ? opts.cssModulesExcludes.map(file => {
          return {
            test(filePath) {
              return filePath.indexOf(file) > -1;
            },
            use: getCSSLoader({
              less: extname(file).toLowerCase() === '.less',
              sass:
                extname(file).toLowerCase() === '.sass' ||
                extname(file).toLowerCase() === '.scss',
              sassOptions: opts.sass
            })
          };
        })
      : []),
    ...(opts.cssModulesWithAffix
      ? [
          {
            test: /\.module\.css$/,
            use: getCSSLoader({
              cssModules: true
            })
          },
          {
            test: /\.module\.less$/,
            use: getCSSLoader({
              cssModules: true,
              less: true
            })
          },
          {
            test: /\.module\.(sass|scss)$/,
            use: getCSSLoader({
              cssModules: true,
              sass: true,
              sassOptions: opts.sass
            })
          }
        ]
      : []),
    {
      test: /\.css$/,
      exclude,
      use: getCSSLoader({
        cssModules: !opts.disableCSSModules
      })
    },
    {
      test: /\.css$/,
      include: /node_modules/,
      use: getCSSLoader()
    },
    {
      test: /\.less$/,
      exclude,
      use: getCSSLoader({
        cssModules: !opts.disableCSSModules,
        less: true
      })
    },
    {
      test: /\.less$/,
      include: /node_modules/,
      use: getCSSLoader({
        less: true
      })
    },
    {
      test: /\.(sass|scss)$/,
      exclude,
      use: getCSSLoader({
        cssModules: !opts.disableCSSModules,
        sass: true,
        sassOptions: opts.sass
      })
    },
    {
      test: /\.(sass|scss)$/,
      include: /node_modules/,
      use: getCSSLoader({
        sass: true,
        sassOptions: opts.sass
      })
    }
  ];

  // 生产环境下用 ExtractTextPlugin 提取出来
  if (!isDev && !opts.disableCssExtract) {
    cssRules.forEach(rule => {
      // eslint-disable-next-line
      rule.use = ExtractTextPlugin.extract({
        use: rule.use.slice(1)
      });
    });
  }

  // TODO: 根据 opts.hash 自动处理这里的 filename
  const commonsPlugins = (opts.commons || []).map(common => {
    return new webpack.optimize.CommonsChunkPlugin(common);
  });

  // 下面会多次用到 outputPath
  const outputPath = opts.outputPath
    ? resolve(cwd, opts.outputPath)
    : resolve(cwd, 'dist');

  // 把公共路径下的静态资源复制到 outputPath
  const copyPlugins = opts.copy
    ? [new CopyWebpackPlugin(opts.copy.map(c => ({ to: outputPath, ...c })))]
    : [];
  if (existsSync(resolve(cwd, 'public'))) {
    copyPlugins.push(
      new CopyWebpackPlugin([
        {
          from: resolve(cwd, 'public'),
          to: outputPath,
          toType: 'dir'
        }
      ])
    );
  }

  // js 和 css 采用不同的 hash 算法
  const jsHash = !isDev && opts.hash ? '.[chunkhash:8]' : '';
  const cssHash = !isDev && opts.hash ? '.[contenthash:8]' : '';

  debug(`isDev: ${isDev}`);
  debug(`jsHash: ${jsHash}`);

  const babelOptions = {
    ...(opts.babel || defaultBabelConfig({ browsers })),
    cacheDirectory: process.env.BABEL_CACHE !== 'none',
    babelrc: !!process.env.BABELRC
  };
  babelOptions.plugins = [
    ...(babelOptions.plugins || []),
    ...(opts.disableDynamicImport
      ? [require.resolve('babel-plugin-dynamic-import-node-sync')]
      : [])
  ];
  const babelUse = [
    {
      loader: require.resolve('@lugia/mega-utils/lib/debugLoader')
    },
    {
      loader: require.resolve('babel-loader'),
      options: babelOptions
    }
  ];
  const babelOptionsDeps = {
    ...(opts.babel || defaultBabelConfig({ browsers })),
    cacheDirectory: process.env.BABEL_CACHE !== 'none',
    babelrc: !!process.env.BABELRC
  };
  const babelUseDeps = [
    {
      loader: require.resolve('@lugia/mega-utils/lib/debugLoader')
    },
    {
      loader: require.resolve('babel-loader'),
      options: babelOptionsDeps
    }
  ];

  const eslintOptions = {
    formatter: eslintFormatter,
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app')]
    },
    ignore: false,
    eslintPath: require.resolve('eslint'),
    useEslintrc: false
  };

  // 使用 user 的 eslint
  try {
    const { dependencies, devDependencies } = require(resolve('package.json')); // eslint-disable-line
    if (dependencies.eslint || devDependencies.eslint) {
      const eslintPath = resolveSync('eslint', {
        basedir: cwd
      });
      eslintOptions.eslintPath = eslintPath;
      debug(`use user's eslint bin: ${eslintPath}`);
    }
  } catch (e) {
    debug(e);
  }

  // 读取用户的 eslintrc
  if (existsSync(resolve('.eslintrc'))) {
    try {
      const userRc = readCommentsJSON(resolve('.eslintrc'));
      debug(`userRc: ${JSON.stringify(userRc)}`);
      if (userRc.extends) {
        debug(`use user's .eslintrc: ${resolve('.eslintrc')}`);
        eslintOptions.useEslintrc = true;
        eslintOptions.baseConfig = false;
        eslintOptions.ignore = true;
      } else {
        debug(`extend with user's .eslintrc: ${resolve('.eslintrc')}`);
        eslintOptions.baseConfig = {
          ...eslintOptions.baseConfig,
          ...userRc
        };
      }
    } catch (e) {
      debug(e);
    }
  }

  const extraBabelIncludes = opts.extraBabelIncludes || [];
  if (opts.es5ImcompatibleVersions) {
    extraBabelIncludes.push(a => {
      if (a.indexOf('node_modules') === -1) return false;
      const pkgPath = getPkgPath(a);
      return shouldTransform(pkgPath);
    });
  }

  let tsConfig;
  const tsConfigPath = join(cwd, 'tsconfig.json');
  if (existsSync(tsConfigPath)) {
    tsConfig = readJsonSync(tsConfigPath);
  }
  const compilerOptions = tsConfig || {
    module: 'es2015',
    declaration: true,
    sourceMap: false,
    jsx: 'react',
    target: 'es5',
    outDir: 'lib',
    strict: true,
    importHelpers: true,
    esModuleInterop: true,
    moduleResolution: 'node',
    allowSyntheticDefaultImports: true,
    lib: ['esnext', 'dom'],
    types: ['jest']
  };

  const config = {
    bail: !isDev,
    devtool: opts.devtool || undefined,
    entry: opts.entry || null,
    output: {
      path: outputPath,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isDev,
      filename: `[name]${jsHash}.js`,
      publicPath: opts.publicPath || (isDev ? '/' : './'),
      chunkFilename: `[name]${jsHash}.async.js`
    },
    resolve: {
      modules: [
        'node_modules',
        resolve(cwd, 'node_modules'),
        resolve(__dirname, '../node_modules'),
        ...(opts.extraResolveModules || [])
      ],
      // require时省略的扩展名，如：require('module') 不需要module.js
      extensions: [
        ...(opts.extraResolveExtensions || []),
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.json',
        '.jsx',
        '.ts',
        '.tsx'
      ],
      // 别名，可以直接使用别名来代表设定的路径以及其他
      alias: {
        '@babel/runtime': dirname(
          require.resolve('@babel/runtime/package.json')
        ),
        // 'core-js': dirname(require.resolve('core-js/package.json')),
        'babel-runtime': dirname(require.resolve('babel-runtime/package.json')),
        ...opts.alias
      }
    },
    module: {
      rules: [
        ...(process.env.DISABLE_ESLINT || process.env.ESLINT === 'none'
          ? []
          : [
              {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                  {
                    options: eslintOptions,
                    loader: require.resolve('eslint-loader')
                  }
                ]
              }
            ]),
        {
          exclude: [
            /\.(html|ejs)$/,
            /\.json$/,
            /\.(js|jsx|ts|tsx)$/,
            /\.lugiad$/,
            /\.lugiadac$/,
            /\.(css|less|scss|sass)$/,
            ...(opts.urlLoaderExcludes || [])
          ],
          loader: require.resolve('url-loader'),
          options: {
            limit: process.env.FILE_LIMIT || 10000,
            name: 'static/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: babelUse
        },
        {
          test: /\.jsx$/,
          use: babelUse
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            ...babelUse,
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                compilerOptions
              }
            }
          ]
        },
        {
          test: /\.lugiad$/,
          exclude: /node_modules/,
          use: [
            ...babelUse,
            {
              loader: require.resolve('@lugia/lugiad-loader'),
              options: {
                resourcesHead: '@/assets/',
                ...loadLugiadConfig()
              }
            }
          ]
        },
        {
          test: /\.lugiadac$/,
          exclude: /node_modules/,
          use: [
            ...babelUse,
            {
              loader: require.resolve('@lugia/lugiadac-loader'),
              options: {
                resourcesHead: '@/assets/'
              }
            }
          ]
        },
        ...extraBabelIncludes.map(include => {
          return {
            test: /\.(js|jsx)$/,
            include: typeof include === 'string' ? join(cwd, include) : include,
            use: babelUseDeps
          };
        }),
        {
          test: /\.html$/,
          exclude:
            opts.html && opts.html.template
              ? resolve(cwd, opts.html.template)
              : undefined,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[ext]'
          }
        },
        ...cssRules
      ]
    },
    plugins: [
      ...(isDev
        ? [
            new webpack.HotModuleReplacementPlugin(),
            // Disable this plugin since it causes 100% cpu when have lost deps
            // new WatchMissingNodeModulesPlugin(join(opts.cwd, 'node_modules')),
            new SystemBellWebpackPlugin(),
            ...(process.env.HARD_SOURCE && process.env.HARD_SOURCE !== 'none'
              ? [new HardSourceWebpackPlugin()]
              : [])
          ].concat(
            opts.devtool
              ? []
              : [
                  new webpack.SourceMapDevToolPlugin({
                    columns: false,
                    moduleFilenameTemplate: info => {
                      if (
                        /\/koi-pkgs\/packages/.test(
                          info.absoluteResourcePath
                        ) ||
                        /packages\/koi-core/.test(info.absoluteResourcePath) ||
                        /webpack\/bootstrap/.test(info.absoluteResourcePath) ||
                        /\/node_modules\//.test(info.absoluteResourcePath)
                      ) {
                        return `internal:///${info.absoluteResourcePath}`;
                      }
                      return resolve(info.absoluteResourcePath).replace(
                        /\\/g,
                        '/'
                      );
                    }
                  })
                ]
          )
        : [
            // eslint-disable-next-line
            ...(process.env.__FROM_TEST
              ? []
              : [new webpack.HashedModuleIdsPlugin()]),
            new webpack.optimize.ModuleConcatenationPlugin(),
            ...(opts.disableCssExtract
              ? []
              : [
                  new ExtractTextPlugin({
                    filename: `[name]${cssHash}.css`,
                    allChunks: true
                  })
                ]),
            ...(opts.serviceworker
              ? [
                  new SWPrecacheWebpackPlugin({
                    // By default, a cache-busting query parameter is appended to requests
                    // used to populate the caches, to ensure the responses are fresh.
                    // If a URL is already hashed by Webpack, then there is no concern
                    // about it being stale, and the cache-busting can be skipped.
                    dontCacheBustUrlsMatching: /\.\w{8}\./,
                    filename: 'service-worker.js',
                    logger(message) {
                      if (message.indexOf('Total precache size is') === 0) {
                        // This message occurs for every build and is a bit too noisy.
                        return;
                      }
                      if (message.indexOf('Skipping static resource') === 0) {
                        // This message obscures real errors so we ignore it.
                        // https://github.com/facebookincubator/create-react-app/issues/2612
                        return;
                      }
                      console.log(message);
                    },
                    minify: !(process.env.COMPRESS === 'none'),
                    // For unknown URLs, fallback to the index page
                    navigateFallback: `${publicUrl}/${(opts.html &&
                      opts.html.filename) ||
                      'index.html'}`,
                    // Ignores URLs starting from /__ (useful for Firebase):
                    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
                    navigateFallbackWhitelist: [/^(?!\/__).*/],
                    // Don't precache sourcemaps (they're large) and build asset manifest:
                    staticFileGlobsIgnorePatterns: [
                      /\.map$/,
                      /asset-manifest\.json$/
                    ],
                    ...opts.serviceworker
                  })
                ]
              : []),
            ...(opts.manifest
              ? [
                  new ManifestPlugin({
                    fileName: 'asset-manifest.json',
                    ...opts.manifest
                  })
                ]
              : [])
          ]),
      ...(isDev || process.env.COMPRESS === 'none'
        ? []
        : [
            opts.parallel
              ? new ParallelUglifyPlugin({
                  exclude: /\.min\.js$/,
                  workerCount: is.number(opts.parallel)
                    ? opts.parallel
                    : undefined,
                  sourceMap: !!opts.devtool,
                  uglifyJS: uglifyJSConfig
                })
              : new webpack.optimize.UglifyJsPlugin({
                  ...uglifyJSConfig,
                  ...(opts.devtool ? { sourceMap: true } : {})
                })
          ]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          // eslint-disable-line
          isDev ? 'development' : 'production'
        ), // eslint-disable-line
        'process.env.HMR': process.env.HMR,
        // 给 socket server 用
        ...(process.env.SOCKET_SERVER
          ? {
              'process.env.SOCKET_SERVER': JSON.stringify(
                process.env.SOCKET_SERVER
              )
            }
          : {}),
        ...stringifyObject(opts.define || {})
      }),
      ...(opts.html
        ? [new InterpolateHtmlPlugin(env.raw), new HTMLWebpackPlugin(opts.html)]
        : []),
      new CaseSensitivePathsPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname
        }
      }),
      new ProgressPlugin(),
      ...(process.env.TS_TYPECHECK ? [new ForkTsCheckerWebpackPlugin()] : []),
      ...(opts.ignoreMomentLocale
        ? [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)]
        : []),
      ...commonsPlugins,
      new CleanWebpackPlugin([outputPath, ...(opts.clean || [])], {
        root: cwd,
        verbose: false
      }),
      ...copyPlugins,
      ...(process.env.ANALYZE
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'server',
              analyzerPort: process.env.ANALYZE_PORT || 8888,
              openAnalyzer: true
            })
          ]
        : [])
    ],
    externals: opts.externals,
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    performance: isDev
      ? {
          hints: false
        }
      : {}
  };

  if (PUBLIC_PATH) {
    config.output.publicPath = `${stripLastSlash(PUBLIC_PATH)}/`;
  }

  return applyWebpackConfig(applyConfig, config);
}

export function applyWebpackConfig(applyConfig, config) {
  if (is.function(applyConfig)) {
    return applyConfig(config, {
      webpack,
      merge
    });
  }
  return config;
}
