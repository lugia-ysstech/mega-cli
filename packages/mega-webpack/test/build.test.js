import webpack from 'webpack';
import { join } from 'path';
// import { sync as rimraf } from 'rimraf';
import { readdirSync, existsSync } from 'fs';
import getUserConfig from '@lugia/mega-config';
import assertBuildResult from './assertBuildResult';
import getConfig from '../lib/getConfig';

process.env.NODE_ENV = 'production';
process.env.COMPRESS = 'none';
process.env.ESLINT = 'none';
process.env.TSLINT = 'none';
process.env.__FROM_TEST = true;

function getEntry(cwd) {
  if (existsSync(join(cwd, 'index.ts'))) {
    return join(cwd, 'index.ts');
  } else if (existsSync(join(cwd, 'index.lugiad'))) {
    return join(cwd, 'index.lugiad');
  } else {
    return join(cwd, 'index.js');
  }
}

function build(opts, done) {
  const { config: userConfig } = getUserConfig({
    cwd: opts.cwd,
  });
  const webpackConfig = getConfig(
    {
      ...opts,
      ...userConfig,
    },
    userConfig.applyWebpack,
  );
  webpackConfig.entry = {
    index: getEntry(opts.cwd),
  };
  webpackConfig.output.path = join(opts.cwd, 'dist');
  // rimraf(webpackConfig.output.path);
  const compiler = webpack(webpackConfig);
  compiler.run(err => {
    if (err) {
      throw new Error(err);
    } else {
      done();
    }
  });
}

describe('[mega-webpack]:build', () => {
  const fixtures = join(__dirname, './fixtures');
  readdirSync(fixtures)
    .filter(dir => dir.charAt(0) !== '.')
    .forEach(dir => {
      const fn = dir.indexOf('-only') > -1 ? test.only : test;
      fn(dir, done => {
        const cwd = join(fixtures, dir);
        process.chdir(cwd);
        build(
          {
            cwd,
            outputPath: join(cwd, 'dist'),
            disableCSSModules: dir.indexOf('cssModulesExcludes') === -1,
          },
          () => {
            try {
              assertBuildResult(cwd);
              done();
            } catch (e) {
              done(e);
            }
          },
        );
      });
    });
});
