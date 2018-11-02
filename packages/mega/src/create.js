import { join, basename, resolve } from 'path';
import { sync as rm } from 'rimraf';
import vfs from 'vinyl-fs';
import { existsSync, renameSync, mkdirpSync } from 'fs-extra';
import through from 'through2';
import { sync as emptyDir } from 'empty-dir';
import chalk from 'chalk';
import download from 'download-git-repo';
import logger from '@lugia/mega-utils/lib/logger';
import canUseYarn from '@lugia/mega-utils/lib/useYarn';
import cliSpinners from '@lugia/mega-utils/lib/cliSpinners';
import homeOrTmp from '@lugia/mega-utils/lib/homeOrTmp';
import install, { isOnline } from './install';
import { isLocalScaffolding, getScaffoldingPath } from './localScaffolding';

const defaultScaffolding = join(__dirname, '../scaffolding');

export default async function create(
  createPath,
  scaffolding = defaultScaffolding,
  { autoInstall, local, verbose, clone, useNpm },
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
  const isonline = await isOnline();
  const tmpScaffoldingPath = join(
    homeOrTmp,
    '.lugia/mega/tmp/official-react-materials/scaffoldings',
    scaffolding.replace(/[\/:]/g, '-').replace(/-+/g, '-'),
  );

  if (!isonline && !isLocalScaffolding(scaffolding)) {
    logger.warn(
      `You appear to be offline. Use cached scaffolding at ${chalk.yellow(
        tmpScaffoldingPath,
      )}.`,
    );
    scaffolding = tmpScaffoldingPath;
  }

  if (local === true || isLocalScaffolding(scaffolding)) {
    const scaffoldingPath = getScaffoldingPath(scaffolding);
    if (existsSync(scaffoldingPath)) {
      g(appPath, scaffoldingPath);
    } else {
      error(`Local scaffolding [${scaffolding}] not found.`);
    }
  } else {
    if (!hasSlash) {
      scaffolding = `mega-scaffoldings/${scaffolding}`;
    }
    const spinner = cliSpinners(`downloading scaffolding [${scaffolding}]`);
    spinner.start();
    if (existsSync(tmpScaffoldingPath)) rm(tmpScaffoldingPath);
    download(scaffolding, tmpScaffoldingPath, { clone }, err => {
      spinner.stop();
      if (err) {
        error(`Failed to download repo ${scaffolding}: ${err.message.trim()}`);
      }
      g(appPath, tmpScaffoldingPath);
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
          verbose && logger.info('rename gitignore -> .gitignore'); // eslint-disable-line
          renameSync(gitignorePath, join(appPath, '.gitignore'));
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
