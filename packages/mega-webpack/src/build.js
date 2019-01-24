import webpack from 'webpack';
import chalk from 'chalk';
import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';
import formatWebpackMessages from '@lugia/mega-utils/lib/formatWebpackMessages';
import printBuildError from '@lugia/mega-utils/lib/printBuildError';
import { printFileSizesAfterBuild } from '@lugia/mega-utils/lib/FileSizeReporter';

const debug = require('debug')('@lugia/mega-webpack:build');

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function buildWebpack(opts = {}) {
  const { webpackConfig, watch, success, fail } = opts;
  debug(`webpack config: ${JSON.stringify(webpackConfig)}`);

  const preLog = '[Lugia Mega]';
  const logColor = (color, log, post) => {
    console.log(chalk[color](`${preLog} ${log}`) + (post || ''));
  };
  const errorLog = (log, post) => {
    logColor('red', log, post);
  };
  const warnLog = (log, post) => {
    logColor('yellow', log, post);
  };
  const successLog = (log, post) => {
    logColor('green', log, post);
  };

  function successHandler({ stats, warnings }) {
    if (warnings.length) {
      warnLog('Compiled with warnings.', ` ${new Date()}\n`);
      console.log(warnings.join('\n\n'));
      console.log();
    } else {
      successLog('Compiled successfully.', ` ${new Date()}\n`);
    }

    console.log(`${chalk.green('[Lugia Mega]')} File sizes after gzip:\n`);
    printFileSizesAfterBuild(
      stats,
      {
        root: webpackConfig.output.path,
        sizes: {},
      },
      webpackConfig.output.path,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE,
    );
    console.log();
    console.log('  Images and other types of assets omitted.\n');

    successLog('Build complete. The dist directory is ready to be deployed.\n');

    if (success) {
      success({ stats, warnings });
    }
  }

  function errorHandler(err) {
    errorLog('Failed to compile.\n');
    printBuildError(err);
    debug(err);
    if (fail) fail(err);
    if (!watch) {
      throw new Error(err);
    }
  }

  function doneHandler(err, stats) {
    debug('build done');
    if (err) {
      return errorHandler(err);
    }
    const messages = formatWebpackMessages(stats.toJson({}, true));
    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      return errorHandler(new Error(messages.errors.join('\n\n')));
    }

    return successHandler({
      stats,
      warnings: messages.warnings,
    });
  }

  const compiler = webpack(webpackConfig);
  if (watch) {
    compiler.watch(200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}

export default function build(opts = {}) {
  const { webpackConfig } = opts;
  assert(webpackConfig, 'webpackConfig should be supplied.');
  assert(
    is.plainObject(webpackConfig),
    'webpackConfig should be plain object.',
  );

  buildWebpack(opts);
}
