import { join, parse } from 'path';
import { readdirSync } from 'fs';
import { fork } from 'child_process';
import assertBuildResult from '../../mega-webpack/test/assertBuildResult';

function testSingleBuild(cwd, done) {
  const { name } = parse(cwd);
  const f = fork(join(__dirname, '../bin/mega.js'), ['build', `${name}.js`]);

  f.on('close', code => {
    if (code === 0) {
      try {
        assertBuildResult(cwd);
        done();
      } catch (e) {
        done(e);
      }
    } else {
      throw new Error(code);
    }
  });

  f.on('error', err => {
    throw new Error(err);
  });
}

describe('singleBuild', () => {
  const buildPath = join(__dirname, './fixtures/singleBuild');
  const dirs = readdirSync(buildPath);

  dirs
    .filter(dir => dir.charAt(0) !== '.')
    .forEach(dir => {
      const fn = dir.indexOf('-only') > -1 ? test.only : test;
      fn(dir, done => {
        const cwd = join(buildPath, dir);
        process.chdir(cwd);
        testSingleBuild(cwd, done);
      });
    });
});
