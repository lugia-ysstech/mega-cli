#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const updater = require('update-notifier');
const pkg = require('../package.json');

// Update notifications for your CLI app
// Notify update when process exits
updater({ pkg }).notify({ defer: true });

const allCommands = ['create', 'list', 'generate', 'g', 'help'];

program
  .version(pkg.version)
  .description(
    'Quickly create react apps. Based on redux, lugiax and react-router.',
  )
  .command(
    'create <app-name> [options]',
    'create a new application from a scaffolding',
  )
  .command('list', 'list available official scaffoldings')
  .command(
    'generate <type> [options]',
    'generate pages / components / models to application',
  )
  .alias('g');

program.on('--help', () => {
  console.log('');
  console.log(
    `  All commands can be run ${chalk.green(
      'mega <command> --help',
    )} (or -h) for more information.`,
  );
});

program.on('command:*', cmd => {
  cmd = cmd[0] || 'help';
  if (allCommands.includes(cmd)) return;
  program.outputHelp();
  console.log('');
  console.log(
    `  ${chalk.red('Unknown command')} ${chalk.yellow(cmd)}${chalk.red('.')}`,
  );
  console.log('');
});

program.parse(process.argv);

process.on('SIGINT', () => {
  if (program.runningCommand) program.runningCommand.kill('SIGKILL');
  process.exit(0);
});
