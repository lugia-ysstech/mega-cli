const vfs = require('vinyl-fs');
const babel = require('@babel/core');
const through = require('through2');
const Terser = require('terser');
const chalk = require('chalk');
const rimraf = require('rimraf');
const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { join, parse } = require('path');
const chokidar = require('chokidar');
const slash = require('slash');

const cwd = slash(process.cwd());

const nodeBabelConfig = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          node: 8,
        },
      },
    ],
  ],
  plugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],
    [require.resolve('babel-plugin-add-module-exports')],
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false,
      },
    ],
  ],
};

// need Webpack
const browserBabelConfig = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          ie: 9,
        },
        ignoreBrowserslistConfig: true,
        useBuiltIns: false, // use @babel/polyfill
        modules: false,
      },
    ],
    require.resolve('@babel/preset-react'),
  ],
  plugins: [
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],
    [require.resolve('babel-plugin-add-module-exports')],
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
  ],
};

// const BROWSER_FILES = ['packages/mega-utils/src/stripLastSlash.js'];
const BROWSER_FILES = [];

function isBrowserTransform(path) {
  return BROWSER_FILES.includes(path.replace(`${cwd}/`, ''));
}

function transform(opts = {}) {
  const { content, path, sourcemap } = opts;
  const sourceMaps = !!sourcemap;
  const winPath = slash(path);
  const { base: fileName } = parse(winPath);
  const isBrowser = isBrowserTransform(winPath);
  console.log(
    chalk[isBrowser ? 'yellow' : 'green'](
      `[TRANSFORM] ${winPath.replace(`${cwd}/`, '')}`,
    ),
  );
  const config = isBrowser ? browserBabelConfig : nodeBabelConfig;
  const { code, map, ast } = babel.transform(content, {
    ...config,
    sourceMaps,
  });
  return {
    code: sourceMaps ? `${code}\n//# sourceMappingURL=${fileName}.map` : code,
    map: sourceMaps ? { ...map, sources: [fileName], file: fileName } : map,
    ast,
  };
}

function buildPkg(pkg, minify = false, sourcemap = false) {
  const pkgPath = join(cwd, 'packages', pkg);
  if (!existsSync(pkgPath)) {
    chalk.yellow(`[${pkg}] was not found`);
    return;
  }
  rimraf.sync(join(pkgPath, 'lib'));

  vfs
    .src(
      [
        `./packages/${pkg}/src/**/*.js`,
        `!./packages/${pkg}/src/**/fixtures/**/*.js`,
        `!./packages/${pkg}/src/**/*.test.js`,
      ],
      sourcemap ? { sourcemaps: true } : undefined,
    )
    .pipe(
      through.obj((f, enc, cb) => {
        const { contents, path } = f;
        let { code: tcode } = transform({
          content: contents,
          path,
        });
        if (minify) {
          tcode = Terser.minify(tcode).code;
        }
        f.contents = Buffer.from(tcode);
        cb(null, f);
      }),
    )
    .pipe(
      vfs.dest(
        `./packages/${pkg}/lib/`,
        sourcemap ? { sourcemaps: '.' } : undefined,
      ),
    );
}

function watch(pkg, sourcemap) {
  const watcher = chokidar.watch(join(cwd, 'packages', pkg, 'src'), {
    ignoreInitial: true,
  });
  watcher.on('all', (event, fullPath) => {
    fullPath = slash(fullPath);
    if (!existsSync(fullPath)) return;
    const relPath = fullPath.replace(slash(`${cwd}/packages/${pkg}/src/`), '');
    const content = readFileSync(fullPath, 'utf-8');
    try {
      const { code, map } = transform({
        content,
        path: fullPath,
        sourcemap,
      });
      const destPath = join(cwd, 'packages', pkg, 'lib', relPath);
      writeFileSync(destPath, code, 'utf-8');
      if (sourcemap) {
        writeFileSync(`${destPath}.map`, JSON.stringify(map), 'utf-8');
      }
    } catch (e) {
      console.log(chalk.red('Compiled failed.'));
      console.log(chalk.red(e.message));
    }
  });
}

function build() {
  const dirs = readdirSync(join(cwd, 'packages'));
  const { argv } = process;
  const isWatch = argv.includes('-w') || argv.includes('--watch');
  const minify = argv.includes('-m') || argv.includes('--minify');
  const sourcemap = argv.includes('--map') || argv.includes('--sourcemap');
  dirs.forEach(pkg => {
    if (pkg.charAt(0) === '.') return;
    buildPkg(pkg, minify, sourcemap);
    if (isWatch) watch(pkg, sourcemap);
  });
}

module.exports = { buildPkg, build, watch };
