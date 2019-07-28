import chalk from 'chalk';
import yargs from 'yargs';
import { BUILD_LIB_DIR } from '../utils/constants';

const { argv } = yargs
  .option('target', {
    alias: 't',
    default: 'app',
    describe: 'Build target (app | lib, default: app)'
  })
  .option('watch', {
    alias: 'w',
    default: false,
    describe:
      'Turn on watch mode when the build target is an app (default: false)',
    type: 'boolean'
  })
  .option('dest', {
    alias: 'd',
    default: BUILD_LIB_DIR,
    describe:
      'output directory when the build target is a library (default: lib)'
  })
  .option('minify', {
    alias: 'm',
    default: true,
    describe: 'minify when the build target is a library (default: lib)',
    type: 'boolean'
  })
  .option('sourcemap', {
    alias: 's',
    default: false,
    describe: 'sourcemap when the build target is a library (default: lib)',
    type: 'boolean'
  })
  .help();

let entry;
if (argv._.length > 0) {
  [entry] = argv._;
}

process.env.NODE_ENV = 'production';

if (argv.target === 'app') {
  // eslint-disable-next-line
  require('../utils/buildApp')({
    cwd: process.cwd(),
    watch: argv.watch,
    entry
  }).catch(e => {
    console.error(chalk.red(`Build App failed: ${e.message}`));
    console.log(e);
  });
}

if (argv.target === 'lib') {
  // eslint-disable-next-line
  require('../utils/buildLib')({
    cwd: process.cwd(),
    dest: argv.dest,
    entry,
    minify: argv.minify,
    sourcemap: argv.sourcemap
  }).catch(e => {
    console.error(chalk.red(`Build Lib failed: ${e.message}`));
    console.log(e);
  });
}
