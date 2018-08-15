import webpack from 'webpack';
import chalk from 'chalk';
import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';
import formatWebpackMessages from '@lugia/mega-utils/lib/formatWebpackMessages';
import printBuildError from '@lugia/mega-utils/lib/printBuildError';
import { printFileSizesAfterBuild } from '@lugia/mega-utils/lib/FileSizeReporter';
// import { warnIfExists as warnIfWebpackConfigExists } from './applyWebpackConfig';

const debug = require('debug')('@lugia/mega-webpack:build');

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function buildWebpack(opts = {}) {
  const { webpackConfig, watch, success, fail } = opts;
  debug(`webpack config: ${JSON.stringify(webpackConfig)}`);

  function successHandler({ stats, warnings }) {
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(warnings.join('\n\n'));
    } else {
      console.log(chalk.green('Compiled successfully.\n'));
    }

    console.log('File sizes after gzip:\n');
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

    if (success) {
      success({ stats, warnings });
    }
  }

  function errorHandler(err) {
    console.log(chalk.red('Failed to compile.\n'));
    printBuildError(err);
    debug(err);
    if (fail) fail(err);
    if (!watch) process.exit(1);
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

  // 存在 webpack.config.js 时提醒用户
  // warnIfWebpackConfigExists(opts.cwd || cwd);

  buildWebpack(opts);
}
