/**
 * Created Date: Wednesday, January 23rd 2019, 5:40:43 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, July 29th 2019, 2:44:55 am
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { join, parse } from 'path';
import build from '@lugia/mega-scripts/lib/utils/buildApp';
import getDefaultEntry from './getDefaultEntry';

const cwd = process.cwd();

export default function singleBuild(
  entry = getDefaultEntry(cwd),
  { target = 'app', libName, dest = 'dist', sourceMap }
) {
  const { name: entryName } = parse(entry);
  const isLib = target === 'lib';
  const name = libName || entryName;
  const applyConfig = config => {
    // eslint-disable-next-line
    if (config.html._fromMegaScriptsDefault) {
      // eslint-disable-next-line
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
          ...config.html
        },
        manifest: null
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
          useShortDoctype: true
        },
        ...config.html
      }
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
              filename: `${name}.umd.js`
            }
          : {})
      },
      resolve: {
        alias: {
          react: require.resolve('react', { paths: [cwd, join(__dirname)] }),
          'react-dom': require.resolve('react-dom', {
            paths: [cwd, join(__dirname)]
          })
        }
      }
    });
  };

  build({
    cwd,
    entry,
    applyConfig,
    applyWebpack
  });
}
