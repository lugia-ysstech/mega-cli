import { join } from 'path';
import { registerBabel } from '@lugia/mega-webpack';
import excapeRegExp from 'lodash.escaperegexp';

export default function(babelPreset, opts) {
  const { configOnly, disablePreventTest, ignore, cwd } = opts;
  const files = [
    'mock.config.js',
    '.webpackrc.js',
    'webpack.config.js',
    'mock',
    'src',
  ].map(file => excapeRegExp(join(cwd, file)));
  const only = configOnly ? [new RegExp(`(${files.join('|')})`)] : null;

  registerBabel({
    only,
    ignore,
    babelPreset,
    disablePreventTest,
  });
}
