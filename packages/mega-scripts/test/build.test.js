import { join } from 'path';
import { readdirSync } from 'fs';
import build from '../lib/utils/build';
import assertBuildResult from '../../mega-webpack/test/assertBuildResult';

process.env.NODE_ENV = 'production';
process.env.COMPRESS = 'none';
process.env.ESLINT = 'none';
process.env.TSLINT = 'none';
process.env.__FROM_TEST = true;

function testBuild(cwd, done) {
  build({
    cwd,
  })
    .then(() => {
      try {
        assertBuildResult(cwd);
        done();
      } catch (e) {
        done(e);
      }
    })
    .catch(e => {
      throw new Error(e);
    });
}

describe('build', () => {
  const buildPath = join(__dirname, './fixtures/build');
  const dirs = readdirSync(buildPath);

  dirs.filter(dir => dir.charAt(0) !== '.').forEach(dir => {
    const fn = dir.indexOf('-only') > -1 ? test.only : test;
    fn(dir, done => {
      const cwd = join(buildPath, dir);
      process.chdir(cwd);
      testBuild(cwd, done);
    });
  });
});
