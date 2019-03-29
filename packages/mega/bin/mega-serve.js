#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const program = require('commander');
const singleServe = require('../lib/singleServe');
const missingArgument = require('../lib/missingArgument');

program
  .name('serve')
  .arguments('[entry]')
  .description(
    'serve a .js or .jsx file in development mode with zero config',
    {
      entry: 'entry file',
    },
  )
  .option('-o, --open', 'Open browser')
  .option('-s, --sync', 'Keep multiple browsers & devices in sync')
  .option('-c, --copy', 'Copy local url to clipboard')
  .action(entry => {
    singleServe(entry, program);
  })
  .parse(process.argv);

missingArgument();
