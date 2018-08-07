import chalk from 'chalk';
import { fork } from 'child_process';

require('graceful-process')({ logLevel: 'warn' });

let script = process.argv[2];
const args = process.argv.slice(3);

// Update notifications for your CLI app
// Notify update when process exits
const updater = require('update-notifier');
const pkg = require('../package.json');
updater({ pkg }).notify({ defer: true });

if (script === 'start') script = 'dev';

switch (script) {
  case '-V':
  case '--version': {
    console.log(pkg.version);
    break;
  }
  case 'build':
  case 'dev':
  case 'test': {
    const proc = fork(require.resolve(`./${script}.js`), args, {
      stdio: 'inherit',
    });
    proc.once('exit', code => {
      process.exit(code);
    });
    process.once('exit', () => {
      proc.kill();
    });
    break;
  }
  default:
    console.log(`Unknown script ${chalk.cyan(script)}.`);
    break;
}
