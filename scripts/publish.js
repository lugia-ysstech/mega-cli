#!/usr/bin/env node

const shell = require('shelljs');
const { join } = require('path');
const { fork } = require('child_process');

const registry = 'http://192.168.102.79:5001/';

if (shell.exec('npm config get registry').stdout.indexOf(registry) === -1) {
  console.error(
    'Failed: ',
    `set npm / yarn registry to ${registry} first. You can use [nrm](https://github.com/Pana/nrm).`,
  );
  process.exit(1);
}

const cwd = process.cwd();
const ret = shell.exec('./node_modules/.bin/lerna updated').stdout;
const updatedRepos = ret
  .split('\n')
  .map(line => line.replace('- ', ''))
  .filter(line => line !== '');

if (updatedRepos.length === 0) {
  console.log('No package is updated.');
  process.exit(0);
}

const { code: buildCode } = shell.exec('yarn run build');
if (buildCode === 1) {
  console.error('Failed: yarn run build');
  process.exit(1);
}

const cp = fork(
  join(process.cwd(), 'node_modules/.bin/lerna'),
  ['publish', '--skip-npm'].concat(process.argv.slice(2)),
  {
    stdio: 'inherit',
    cwd: process.cwd(),
  },
);
cp.on('error', err => {
  console.log(err);
});
cp.on('close', code => {
  console.log('code', code);
  if (code === 1) {
    console.error('Failed: lerna publish');
    process.exit(1);
  }

  publishToNpm();
});

function publishToNpm() {
  console.log(`repos to publish: ${updatedRepos.join(', ')}`);
  updatedRepos.forEach(repo => {
    shell.cd(join(cwd, 'packages', repo));
    console.log(`[${repo}] npm publish`);
    shell.exec('npm publish');
  });
}
