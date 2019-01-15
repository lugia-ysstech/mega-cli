import canUseYarn, { getYarnResolved } from '@lugia/mega-utils/lib/useYarn';
import is from '@lugia/mega-utils/lib/is';
import logger from '@lugia/mega-utils/lib/logger';
import spawn from '@lugia/mega-utils/lib/crossSpawn';
import assert from 'assert';
import chalk from 'chalk';
import { lookup } from 'dns';

export default async function install({
  cwd,
  useYarn = false,
  dependencies = [],
  verbose,
}) {
  assert(
    is.array(dependencies),
    `The dependencies config must be Array, but got ${dependencies}`,
  );

  useYarn = useYarn && canUseYarn(cwd, true);
  const isonline = await isOnline();
  const isEmptyDependencies = is.empty(dependencies);

  return new Promise((resolve, reject) => {
    let command;
    let args;
    if (useYarn) {
      [command] = Object.keys(getYarnResolved());
      args = [];
      if (!isEmptyDependencies) {
        args.push('add', ...dependencies, '--exact');
      }
      if (!isonline) {
        args.push('--offline');
        logger.warn(
          'You appear to be offline. Falling back to the local Yarn cache.',
        );
        logger.br();
      }
      args.push('--cwd', cwd);
    } else {
      command = 'npm';
      args = ['install'];
      if (!isEmptyDependencies) {
        args.push(...dependencies, '--save', '--save-exact');
      }
      args.push('--loglevel', 'error');
    }

    if (verbose) {
      args.push('--verbose');
    }

    if (isEmptyDependencies) {
      logger.loading(
        `Installing all the dependencies using ${chalk.green(
          command,
        )}. This might take a couple of minutes`,
      );
    } else {
      logger.loading(
        `Installing ${dependencies.map(d => chalk.cyan(d)).join(', ')}}`,
      );
    }
    logger.br();

    runCommand(command, args, code => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')}`));
      } else {
        resolve({
          code,
          useYarn,
          command,
          args,
        });
      }
    });
  });
}

export function runCommand(command, args = [], close) {
  const child = spawn(command, args, {
    // keep color
    stdio: 'inherit',
    env: process.env,
  });

  child.on('close', code => close && close(code));
}

export function isOnline() {
  const registry = 'registry.yarnpkg.com';
  return new Promise(resolve =>
    lookup(
      registry,
      {
        all: true,
      },
      (err, address) => resolve(is.empty(err) && !is.empty(address)),
    ),
  );
}
