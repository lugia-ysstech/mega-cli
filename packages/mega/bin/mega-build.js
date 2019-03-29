#!/usr/bin/env node

process.env.NODE_ENV = 'production';

const program = require('commander');
const singleBuild = require('../lib/singleBuild');
const missingArgument = require('../lib/missingArgument');

program
  .name('build')
  .arguments('[entry]')
  .description('build a .js or .jsx file in production mode with zero config', {
    entry: 'entry file',
  })
  .option('-t, --target <target>', 'Build target (app | lib, default: app)')
  .option('-n, --lib-name <name>', 'name for lib (default: entry filename)')
  .option('-d, --dest <dir>', 'output directory (default: dist)')
  .option('-m, --source-map', 'use source map')
  .action(entry => {
    singleBuild(entry, program);
  })
  .parse(process.argv);

missingArgument();
