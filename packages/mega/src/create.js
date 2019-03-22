import { join, basename, resolve } from 'path';
import { parse as urlParse } from 'url';
import { sync as rm } from 'rimraf';
import vfs from 'vinyl-fs';
import {
  existsSync,
  renameSync,
  mkdirpSync,
  readJsonSync,
  writeJSONSync,
} from 'fs-extra';
import through from 'through2';
import { sync as emptyDir } from 'empty-dir';
import chalk from 'chalk';
import logger from '@lugia/mega-utils/lib/logger';
import canUseYarn from '@lugia/mega-utils/lib/useYarn';
import cliSpinners from '@lugia/mega-utils/lib/cliSpinners';
import downloadGit, {
  normalize as normalizeGitRepo,
} from '@lugia/mega-utils/lib/downloadGitRepo';
import downloadNpm from '@lugia/mega-utils/lib/downloadNpmPackage';
import getPackageInfo from '@lugia/mega-utils/lib/npmUtils';
import homeOrTmp from '@lugia/mega-utils/lib/homeOrTmp';
import install, { isOnline } from './install';
import { isLocalScaffolding, getScaffoldingPath } from './localScaffolding';

const DefaultScaffolding = join(__dirname, '../scaffolding');
const CacheScaffoldingDir = join(homeOrTmp, '.lugia/mega/cache/scaffoldings');
const disableCache = !!process.env.MEGA_DISABLE_CACHE;
const cwd = process.cwd();

export default async function create(
  createPath,
  scaffolding = DefaultScaffolding,
  { autoInstall, local, verbose, clone, npm, npmRegistry, useNpm },
) {
  let appPath = resolve(process.cwd(), createPath);
  if (existsSync(appPath)) {
    error(
      'Existing directory here, please run new command for an empty folder!',
    );
  }

  try {
    mkdirpSync(appPath);
  } catch (e) {
    error(e);
  }
  process.chdir(appPath);
  appPath = process.cwd();
  if (!emptyDir(appPath)) {
    error('Existing files here, please run create command in an empty folder!');
  }

  const appName = basename(appPath);
  const hasSlash = scaffolding.indexOf('/') > -1;
  const useYarn = useNpm ? false : canUseYarn(appPath);
  const fromLocal =
    local === true || (isLocalScaffolding(scaffolding) && npm !== true);
  const fromNpm = npm === true;
  const isonline = await isOnline();
  const offlineWarn = () => {
    if (!isonline) {
      logger.warn('You appear to be offline.');
    }
  };
  const getCacheScaffoldingPath = post =>
    join(CacheScaffoldingDir, post.replace(/[\/:]/g, '-').replace(/-+/g, '-'));

  let cacheScaffoldingPath;
  let spinner;

  if (fromLocal) {
    const scaffoldingPath = getScaffoldingPath(scaffolding, cwd);
    if (existsSync(scaffoldingPath)) {
      g(appPath, scaffoldingPath);
    } else {
      error(`Local scaffolding [${scaffolding}] not found.`);
    }
    return;
  }

  if (fromNpm) {
    try {
      const {
        name,
        version,
        dist: { shasum, tarball },
      } = await getPackageInfo(scaffolding, { registry: npmRegistry });
      cacheScaffoldingPath = getCacheScaffoldingPath(
        `npm-${name}-${version}-${shasum}`,
      );
      if (existsSync(cacheScaffoldingPath) && !disableCache) {
        g(appPath, cacheScaffoldingPath);
      } else {
        offlineWarn();
        const { protocol, host } = urlParse(tarball);
        spinner = cliSpinners(
          `downloading scaffolding [${scaffolding}] from npm(${protocol}${host})`,
        );
        spinner.start();
        if (existsSync(cacheScaffoldingPath)) rm(cacheScaffoldingPath);
        await downloadNpm(scaffolding, cacheScaffoldingPath, {
          registry: npmRegistry,
        });
        spinner.stop();
        g(appPath, cacheScaffoldingPath);
      }
    } catch (error) {
      error(error);
    }
    return;
  }

  if (!hasSlash) {
    scaffolding = `mega-scaffoldings/${scaffolding}`;
  }
  const { type, checkout, url, origin } = normalizeGitRepo(scaffolding);
  cacheScaffoldingPath = getCacheScaffoldingPath(
    `${type}-${scaffolding}-${checkout}`,
  );
  if (existsSync(cacheScaffoldingPath) && !disableCache) {
    g(appPath, cacheScaffoldingPath);
  } else {
    offlineWarn();
    spinner = cliSpinners(
      `downloading scaffolding [${scaffolding}] from ${url || origin}`,
    );
    spinner.start();
    if (existsSync(cacheScaffoldingPath)) rm(cacheScaffoldingPath);
    downloadGit(scaffolding, cacheScaffoldingPath, { clone }, err => {
      spinner.stop();
      if (err) {
        error(`Failed to download repo ${scaffolding}: ${err.message.trim()}`);
      }
      g(appPath, cacheScaffoldingPath);
    });
  }

  // scaffolding (generate) => appPath
  function g(appPath, scaffoldingPath) {
    logger.info(`Creating a new React app in ${chalk.green(appPath)}.`);
    vfs
      .src(['**/*', '!node_modules/**/*'], {
        cwd: scaffoldingPath,
        cwdbase: true,
        dot: true,
      })
      .pipe(fileFilter(appPath, scaffoldingPath, verbose))
      .pipe(vfs.dest(appPath))
      .on('end', () => {
        const gitignorePath = join(appPath, 'gitignore');
        if (existsSync(gitignorePath)) {
          if (verbose) {
            logger.info('rename gitignore -> .gitignore');
          }
          renameSync(gitignorePath, join(appPath, '.gitignore'));
        }
        try {
          const pkgPath = join(appPath, 'package.json');
          const pkg = readJsonSync(pkgPath);
          if (verbose) {
            logger.info(`update package.json#name ${pkg.name} -> ${appName}`);
          }
          writeJSONSync(pkgPath, { ...pkg, name: appName });
        } catch (error) {
          error(error);
        }
        if (autoInstall) {
          install({
            cwd: appPath,
            useYarn,
            verbose,
          })
            .then(printSuccess)
            .catch(e => error(e));
        } else {
          printSuccess();
        }
      })
      .resume();
  }

  function printSuccess() {
    const displayedCommand = useYarn ? 'yarn' : 'npm';
    console.log(`
${chalk.green('Success!')} Created ${chalk.green(appName)} at ${chalk.green(
      appPath,
    )}

Inside that directory, you can run several commands:

  ${chalk.cyan(`${displayedCommand} start`)}
    Starts the development server.

  ${chalk.cyan(`${displayedCommand} ${useYarn ? '' : 'run '}build`)}
    Bundles the app into static files for production.

  ${chalk.cyan(`${displayedCommand} test`)}
    Starts the test runner.

We suggest that you begin by typing:

  ${chalk.cyan(`cd ${appPath}`)}
  ${chalk.cyan(`${displayedCommand} start`)}

Happy hacking!
`);
  }
}

function fileFilter(appPath, scaffoldingPath, verbose) {
  return through.obj(function(file, enc, cb) {
    // file => https://github.com/gulpjs/vinyl
    if (!file.stat.isFile()) {
      return cb();
    }
    if (verbose) {
      logger.create(file.path.replace(`${scaffoldingPath}/`, ''));
    }
    this.push(file);
    cb();
  });
}

function error(msg) {
  logger.br();
  logger.error(msg);
  logger.br();
  process.exit(1);
}
