import { join } from 'path';
import { readdirSync } from 'fs';
import build from '../lib/utils/build';
import assertBuildResult from '../../mega-webpack/test/assertBuildResult';

process.env.NODE_ENV = 'production';
process.env.COMPRESS = 'none';
process.env.ESLINT = 'none';
process.env.TSLINT = 'none';
process.env.__FROM_TEST = true;

function dash2Camel(_str) {
  const str = _str[0].toUpperCase() + _str.substr(1);
  return str.replace(/-[a-zA-Z]/g, $1 => $1[1].toUpperCase());
}

function testBuild({ cwd, dir, singleTest }, done) {
  const applyConfig = singleTest
    ? config => {
        return { ...config, commons: [], html: null, manifest: null };
      }
    : null;

  const applyWebpack = singleTest
    ? webpackConfig => {
        webpackConfig.entry = join(cwd, `${dir}.js`);
        // webpackConfig.output.path = join(cwd, './.lugia');
        webpackConfig.output.library = dash2Camel(dir);
        webpackConfig.output.filename = `${dir}.js`;
        webpackConfig.externals = {
          react: 'React',
          'react-dom': 'ReactDom',
          '@lugia/lugiax': 'lugiax',
        };
        return webpackConfig;
      }
    : null;

  build({
    cwd,
    applyConfig,
    applyWebpack,
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

  dirs
    .filter(dir => dir.charAt(0) !== '.')
    .forEach(dir => {
      const fn = dir.indexOf('-only') > -1 ? test.only : test;
      const singleTest = dir.indexOf('single-') > -1;
      fn(dir, done => {
        const cwd = join(buildPath, dir);
        process.chdir(cwd);
        testBuild({ cwd, dir, singleTest }, done);
      });
    });
});
