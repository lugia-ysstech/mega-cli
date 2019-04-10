/**
 * Created Date: Tuesday, April 9th 2019, 5:42:26 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, April 10th 2019, 11:07:33 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { resolve as pathResolve } from 'path';
import { writeJsonSync } from 'fs-extra';
import { build, applyWebpackConfig } from '@lugia/mega-webpack';
import getUserConfig from '@lugia/mega-config';
import getWebpackConfig from './getWebpackConfig';
import getPaths from './getPaths';
import registerBabel from './registerBabel';
import getDependenciesVersion from './getDependenciesVersion';
import { CONFIG_FILE_NAME, DLL_OUTPUT, DLL_NAME } from './constants';

const debug = require('debug')('@lugia/mega-scripts:dll');

export default function(opts = {}, cb) {
  const { cwd = process.cwd(), configFile } = opts;

  const babel = pathResolve(__dirname, './babel.js');
  const paths = getPaths(cwd);

  return new Promise((resolve, reject) => {
    // register babel for config files
    registerBabel(babel, {
      cwd,
      configOnly: true,
    });

    // get user config
    const { config, userPKG } = getUserConfig({
      cwd,
      configFileName: configFile || CONFIG_FILE_NAME,
    });
    debug(`user config: ${JSON.stringify(config)}`);

    const { dependencies = {} } = userPKG;
    const { dllDependenciesExcludes = [] } = config;
    const dist = pathResolve(cwd, DLL_OUTPUT);
    const dllDependencies = Object.keys(dependencies).filter(
      dependency => !dllDependenciesExcludes.includes(dependency),
    );
    const dependenciesVersion = getDependenciesVersion(dllDependencies, cwd);

    // get webpack config
    const webpackConfig = applyWebpackConfig(
      (webpackConfig, { webpack, merge }) => {
        return merge(webpackConfig, {
          output: {
            path: dist,
            library: '[name]_[hash]',
          },
          plugins: [
            new webpack.DllPlugin({
              path: pathResolve(dist, '[name].manifest.json'),
              name: '[name]_[hash]',
            }),
          ],
        });
      },
      getWebpackConfig(
        {
          cwd,
          config,
          babel,
          paths,
        },
        config => {
          return {
            ...config,
            entry: {
              [DLL_NAME]: dllDependencies,
            },
            devtool: 'eval',
            commons: [],
            html: null,
            manifest: null,
            clean: [dist],
          };
        },
      ),
    );

    build({
      webpackConfig,
      success: ({ stats, warnings, assets }) => {
        // 保存dllDependencies的版本信息，以便做缓存更新
        writeJsonSync(
          pathResolve(dist, `${DLL_NAME}.dependencies.json`),
          dependenciesVersion,
        );

        if (cb) {
          cb(undefined, { stats, warnings, assets });
        }
        resolve({ warnings, assets });
      },
      fail: err => {
        if (cb) {
          cb(err);
        }
        reject(err);
      },
    });
  });
}
