import { resolve } from 'path';
import { build, getUserConfig, applyWebpackConfig } from '@lugia/mega-webpack';
import getWebpackConfig from './getWebpackConfig';
import getPaths from './getPaths';
import registerBabel from './registerBabel';
import { CONFIG_FILE_NAME } from './constants';

const debug = require('debug')('@lugia/mega-scripts:build');

export default function(opts = {}) {
  const { cwd = process.cwd(), watch, entry, applyWebpack, applyConfig } = opts;

  const babel = resolve(__dirname, './babel.js');
  const paths = getPaths(cwd);

  return new Promise((resolve, reject) => {
    // register babel for config files
    registerBabel(babel, {
      cwd,
      configOnly: true,
    });

    // get user config
    const { config } = getUserConfig({ cwd, configFileName: CONFIG_FILE_NAME });
    debug(`user config: ${JSON.stringify(config)}`);

    // get webpack config
    const webpackConfig = applyWebpackConfig(
      applyWebpack,
      getWebpackConfig(
        {
          cwd,
          config,
          babel,
          paths,
          entry,
        },
        applyConfig,
      ),
    );

    build({
      webpackConfig,
      watch,
      success: resolve,
      fail: reject,
    });
  });
}
