import { resolve } from 'path';
import { build, getUserConfig } from '@lugia/mega-webpack';
import getWebpackConfig from './getWebpackConfig';
import getPaths from './getPaths';
import registerBabel from './registerBabel';

const debug = require('debug')('@lugia/mega-scripts:build');

export default function(opts = {}) {
  const { cwd = process.cwd(), watch, entry } = opts;

  const babel = resolve(__dirname, './babel.js');
  const paths = getPaths(cwd);

  return new Promise(resolve => {
    // register babel for config files
    registerBabel(babel, {
      cwd,
      configOnly: true,
    });

    // get user config
    const { config } = getUserConfig({ cwd });
    debug(`user config: ${JSON.stringify(config)}`);

    // get webpack config
    const webpackConfig = getWebpackConfig({
      cwd,
      config,
      babel,
      paths,
      entry,
    });

    build({
      webpackConfig,
      watch,
      success: resolve,
    });
  });
}
