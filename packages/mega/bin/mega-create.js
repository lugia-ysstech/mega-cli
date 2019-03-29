#!/usr/bin/env node

const program = require('commander');
const is = require('@lugia/mega-utils/lib/is');
const create = require('../lib/create');
const missingArgument = require('../lib/missingArgument');

program
  .name('create')
  .arguments('<app-name> [scaffolding]')
  .description('Create a new application from a scaffolding.', {
    'app-name':
      'Your application will be created in a directory called <app-name>.',
    scaffolding: 'Use the specified [scaffolding] when creating application.',
  })
  .option('-n, --no-auto-install', 'not auto install dependencies')
  .option('-l, --local', 'the specified is from a local path')
  .option('-v, --verbose', 'print additional logs')
  .option('-c, --clone', 'use git clone')
  .option('-p, --npm', 'the specified is from npm')
  .option(
    '-r, --npm-registry <url>',
    'registry url for npm (default: configuration file ~/.npmrc)',
  )
  .option('--use-npm', 'use npm run install|start|test|build')
  .action((appName, scaffolding) => {
    if (is.empty(appName)) program.missingArgument(appName);
    create(appName, scaffolding, program);
  })
  .parse(process.argv);

missingArgument();
