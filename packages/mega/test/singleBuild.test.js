import { join, parse } from 'path';
import { readdirSync } from 'fs';
import { exec } from 'child_process';
import assertBuildResult from '../../mega-webpack/test/assertBuildResult';

function testSingleBuild(cwd, done) {
  const { name } = parse(cwd);

  exec(
    `node ${join(__dirname, '../bin/mega.js')} build ${name}.js`,
    {
      cwd,
    },
    err => {
      if (err) {
        throw new Error(err);
      }

      try {
        assertBuildResult(cwd);
        done();
      } catch (e) {
        done(e);
      }
    },
  );
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
        testSingleBuild(cwd, done);
      });
    });
});
