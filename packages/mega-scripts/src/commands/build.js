import chalk from 'chalk';
import yargs from 'yargs';

const { argv } = yargs.option('watch', {
  alias: 'w',
  default: false,
});

let entry;
if (argv._.length > 0) {
  [entry] = argv._;
}

process.env.NODE_ENV = 'production';
require('../utils/build')({
  cwd: process.cwd(),
  watch: argv.watch,
  entry,
}).catch(e => {
  console.error(chalk.red(`Build failed: ${e.message}`));
  console.log(e);
});
