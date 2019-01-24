/**
 * Created Date: Wednesday, January 23rd 2019, 5:40:43 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, January 24th 2019, 5:35:49 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { join, parse } from 'path';
import { existsSync } from 'fs-extra';
import build from '@lugia/mega-scripts/lib/utils/build';

const cwd = process.cwd();

export default function singleBuild(
  entry = getDefaultEntry(cwd),
  { target = 'app', libName, dest = 'dist', sourceMap },
) {
  const { name: entryName } = parse(entry);
  const isLib = target === 'lib';
  const name = libName || entryName;
  const applyConfig = config => {
    if (config.html._fromMegaScriptsDefault) {
      config.html = {};
    }
    if (isLib) {
      return {
        devtool: sourceMap && 'source-map',
        ...config,
        commons: [],
        html: {
          template: join(__dirname, '../templates/html.ejs'),
          title: 'Lugia Mega Demo',
          filename: 'demo.html',
          ...config.html,
        },
        manifest: null,
      };
    }
    return {
      devtool: sourceMap && 'source-map',
      ...config,
      html: {
        template: join(__dirname, '../templates/html.ejs'),
        title: 'Lugia Mega App',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        ...config.html,
      },
    };
  };

  const applyWebpack = (webpackConfig, { merge }) => {
    return merge(webpackConfig, {
      output: {
        path: join(cwd, dest),
        ...(isLib
          ? {
              library: name,
              libraryTarget: 'umd',
              filename: `${name}.umd.js`,
            }
          : {}),
      },
      resolve: {
        alias: {
          react: require.resolve('react', [cwd, join(__dirname)]),
          'react-dom': require.resolve('react-dom', [cwd, join(__dirname)]),
        },
      },
    });
  };

  build({
    cwd,
    entry,
    applyConfig,
    applyWebpack,
  });
}

function getDefaultEntry(cwd) {
  if (existsSync(join(cwd, './main.js'))) {
    return './main.js';
  }
  if (existsSync(join(cwd, './index.js'))) {
    return './index.js';
  }
  if (existsSync(join(cwd, './App.jsx'))) {
    return './App.jsx';
  }

  console.log(`
  Failed to locate entry file in ${cwd}.
  Valid entry file should be one of: main.js, index.js or App.jsx.
`);
  process.exit(1);
}
