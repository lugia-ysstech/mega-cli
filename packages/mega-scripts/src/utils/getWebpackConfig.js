import { existsSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from '@lugia/mega-webpack';
import getEntry from './getEntry';

const defaultBrowsers = ['last 2 versions'];
const debug = require('debug')('@lugia/mega-scripts:getWebpackConfig');

const isDev = process.env.NODE_ENV === 'development';

export default function(opts = {}) {
  const { cwd, config, babel, paths, entry } = opts;

  const browserslist = config.browserslist || defaultBrowsers;
  debug(`babel: ${babel}`);
  debug(`browserslist: ${browserslist}`);

  if (!config.html) {
    config.html = {};
    const appPublicHtmlPath = resolve(paths.appPublic, 'index.html');
    if (existsSync(appPublicHtmlPath)) {
      config.html.template = appPublicHtmlPath;
    }
    const appSrcHtmlPath = resolve(paths.appSrc, 'index.html');
    if (existsSync(appSrcHtmlPath)) {
      config.html.template = appSrcHtmlPath;
    }
  }

  return getConfig(
    {
      cwd,
      hash: true,
      manifest: {},
      ...config,

      entry: getEntry({
        cwd: paths.appDirectory,
        entry: entry || config.entry,
        isBuild: !isDev,
      }),
      babel: config.babel || {
        presets: [
          [babel, { browsers: browserslist }],
          ...(config.extraBabelPresets || []),
        ],
        plugins: config.extraBabelPlugins || [],
      },
      browserslist,
    },
    config.applyWebpack,
  );
}
