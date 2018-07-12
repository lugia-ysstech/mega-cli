const vfs = require('vinyl-fs');
const babel = require('@babel/core');
const through = require('through2');
const chalk = require('chalk');
const rimraf = require('rimraf');
const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const chokidar = require('chokidar');
const slash = require('slash');

const cwd = process.cwd();

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
    [require.resolve('@babel/preset-stage-0'), { decoratorsLegacy: true }],
  ],
};

const browserBabelConfig = {
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        browsers: ['last 2 versions', 'IE 10'],
      },
    ],
    require.resolve('@babel/preset-react'),
    [require.resolve('@babel/preset-stage-0'), { decoratorsLegacy: true }],
  ],
};

const BROWSER_FILES = ['packages/mega-utils/src/stripLastSlash.js'];

function isBrowserTransform(path) {
  return BROWSER_FILES.includes(path.replace(`${slash(cwd)}/`, ''));
}

function transform(opts = {}) {
  const { content, path } = opts;
  const winPath = slash(path);
  const isBrowser = isBrowserTransform(winPath);
  console.log(
    chalk[isBrowser ? 'yellow' : 'blue'](
      `[TRANSFORM] ${winPath.replace(`${cwd}/`, '')}`,
    ),
  );
  const config = isBrowser ? browserBabelConfig : nodeBabelConfig;
  return babel.transform(content, config).code;
}

function buildPkg(pkg) {
  const pkgPath = join(cwd, 'packages', pkg);
  if (!existsSync(pkgPath)) {
    chalk.yellow(`[${pkg}] was not found`);
    return;
  }
  rimraf.sync(join(pkgPath, 'lib'));

  vfs
    .src([
      `./packages/${pkg}/src/**/*.js`,
      `!./packages/${pkg}/src/**/fixtures/**/*.js`,
      `!./packages/${pkg}/src/**/*.test.js`,
    ])
    .pipe(
      through.obj((f, enc, cb) => {
        f.contents = new Buffer( // eslint-disable-line
          transform({
            content: f.contents,
            path: f.path,
          }),
        );
        cb(null, f);
      }),
    )
    .pipe(vfs.dest(`./packages/${pkg}/lib/`));
}

function watch(pkg) {
  const watcher = chokidar.watch(join(cwd, 'packages', pkg, 'src'), {
    ignoreInitial: true,
  });
  watcher.on('all', (event, fullPath) => {
    fullPath = slash(fullPath);
    if (!existsSync(fullPath)) return;
    const relPath = fullPath.replace(slash(`${cwd}/packages/${pkg}/src/`), '');
    const content = readFileSync(fullPath, 'utf-8');
    try {
      const code = transform({
        content,
        path: fullPath,
      });
      writeFileSync(join(cwd, 'packages', pkg, 'lib', relPath), code, 'utf-8');
    } catch (e) {
      console.log(chalk.red('Compiled failed.'));
      console.log(chalk.red(e.message));
    }
  });
}

function build() {
  const dirs = readdirSync(join(cwd, 'packages'));
  const arg = process.argv[2];
  const isWatch = arg === '-w' || arg === '--watch';
  dirs.forEach(pkg => {
    if (pkg.charAt(0) === '.') return;
    buildPkg(pkg);
    if (isWatch) watch(pkg);
  });
}

module.exports = { buildPkg, build, watch };
