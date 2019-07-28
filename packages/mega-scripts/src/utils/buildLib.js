/**
 * Created Date: Friday, July 26th 2019, 11:26:02 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, July 29th 2019, 2:12:39 am
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { join, parse } from 'path';
import { transform as babelTransform } from '@babel/core';
import chalk from 'chalk';
import vfs from 'vinyl-fs';
import rimraf from 'rimraf';
import { pathExists } from 'fs-extra';
import through from 'through2';
import Terser from 'terser';
import getUserConfig from '@lugia/mega-config';
import { replaceDefine } from '@lugia/mega-utils/lib/lugiaxModelDefine';
import lugiad2js from '@lugia/devtools-conversion';
import { createDesignInfo } from '@lugia/devtools-material';
import getPaths from './getPaths';
import registerBabel from './registerBabel';

const debug = require('debug')('@lugia/mega-scripts:buildLib');

async function validateMegaProject(paths) {
  const {
    appDirectory,
    appPages,
    appComponents,
    appAssets,
    appModels,
    appPackageJson,
    appConfigFile,
    appConfig
  } = paths;
  const needPaths = [
    appDirectory,
    appConfig,
    appPages,
    appComponents,
    appAssets,
    appModels,
    appConfigFile,
    appPackageJson
  ];
  let isExistsPath = true;

  /* eslint-disable */
  for (const p of needPaths) {
    const exists = await pathExists(p);
    if (!exists) {
      isExistsPath = false;
      break;
    }
  }
  /* eslint-enable */

  return isExistsPath;
}

function transformBabel(opts = {}) {
  const { babelConfig, content, fileName } = opts;
  const { sourceMaps } = babelConfig;
  const { code, map, ast } = babelTransform(content, {
    ...babelConfig,
    filename: fileName
  });
  return {
    code: sourceMaps ? `${code}\n//# sourceMappingURL=${fileName}.map` : code,
    map: sourceMaps ? { ...map, sources: [fileName], file: fileName } : map,
    ast
  };
}

function transformFile(opts = {}) {
  const {
    globs,
    cwd,
    destDir,
    transformFunction,
    flushFunction,
    sourcemap: sourcemaps = false
  } = opts;

  /* eslint-disable */
  return new Promise((resolve, reject) => {
    vfs
      .src(globs, { cwd, sourcemaps, dot: true })
      .pipe(
        through.obj(function(f, enc, cb) {
          try {
            transformFunction.bind(this)(f, enc, cb);
          } catch (error) {
            reject(error);
          }
        })
      )
      .pipe(vfs.dest(destDir, sourcemaps ? { sourcemaps: '.' } : undefined))
      .on('end', async () => {
        if (flushFunction) {
          try {
            await flushFunction();
          } catch (error) {
            reject(error);
          }
        } else {
          resolve();
        }
      });
  });
  /* eslint-enable */
}

export default async function(opts = {}) {
  const { cwd = process.cwd(), dest, entry, minify, sourcemap } = opts;
  const paths = getPaths(cwd, entry);
  const {
    libBuild,
    appDirectory,
    appSrc,
    appPages,
    appComponents,
    appAssets,
    appModels,
    appConfigFile,
    resolveApp
  } = paths;
  const destDir = dest ? resolveApp(dest) : libBuild;
  const isMegaProject = await validateMegaProject(paths);

  debug(`opts: ${JSON.stringify(opts)}`);
  debug(`
    appPages: ${appPages}
    appComponents: ${appComponents}
    appAssets: ${appAssets}
    appModels: ${appModels}
    destDir: ${destDir}
  `);

  if (isMegaProject) {
    rimraf.sync(destDir);

    const defaultBabel = join(__dirname, './babel.js');

    // register babel for config files
    registerBabel(defaultBabel, {
      cwd,
      configOnly: true
    });

    // get user config
    const { config, userPKG } = getUserConfig({
      cwd,
      configFileName: appConfigFile
    });
    debug(`user config: ${JSON.stringify(config)}`);

    const {
      browserslist,
      babel: configBabel,
      extraBabelPresets,
      extraBabelPlugins,
      alias: userAlias = {}
    } = config;
    const { name: moduleName } = userPKG;
    const alias = {};
    Object.keys(userAlias).forEach(m => {
      alias[m] = userAlias[m]
        .replace(appSrc, destDir)
        .replace(appDirectory, moduleName);
    });

    const userBabel = configBabel || {
      presets: [
        [
          defaultBabel,
          {
            browsers: browserslist,
            autoInstall: true,
            engine: 'webpackLib',
            cwd,
            alias
          }
        ],
        ...(extraBabelPresets || [])
      ],
      plugins: extraBabelPlugins || [],
      babelrc: !!process.env.BABELRC
      // sourceMaps: sourcemap
    };

    debug(`
    browserslist: ${browserslist}
    userBabel: ${userBabel}
    `);

    console.log(
      `${chalk.green('[Lugia Mega]')} generator components design info......`
    );
    await createDesignInfo(appComponents);

    // transform js、jsx、ts、tsx
    console.log(
      `${chalk.green('[Lugia Mega]')} transform js、jsx、ts、tsx......`
    );
    await transformFile({
      globs: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
      cwd: appSrc,
      destDir,
      sourcemap,
      transformFunction(f, enc, cb) {
        const { contents, path } = f;
        const { base: fileName, name } = parse(path);

        const replaceLugiaxDefineContents = replaceDefine(
          contents.toString(),
          `${moduleName}_${name}`
            .split('')
            .map((s, idx) => {
              if (idx === 0) {
                if (/[$_a-zA-Z]/.test(s)) {
                  return s;
                }
                return '$';
              }
              if (/[$_a-zA-Z0-9]/.test(s)) {
                return s;
              }
              return '_';
            })
            .join('')
        );

        let { code: tcode } = transformBabel({
          babelConfig: userBabel,
          content: replaceLugiaxDefineContents,
          fileName
        });
        if (minify) {
          tcode = Terser.minify(tcode).code;
        }
        // eslint-disable-next-line
        f.contents = Buffer.from(tcode);
        cb(null, f);
      }
    });

    // transform lugiad
    console.log(`${chalk.green('[Lugia Mega]')} transform lugiad......`);
    await transformFile({
      globs: ['**/*.lugiad'],
      cwd: appSrc,
      destDir,
      sourcemap,
      transformFunction(f, enc, cb) {
        // eslint-disable-next-line
        f.extname = '.js';
        const { contents, path } = f;
        const { base: fileName } = parse(path);

        // lugiad ==> js
        const jsContent = lugiad2js(JSON.parse(contents));

        let { code: tcode } = transformBabel({
          babelConfig: userBabel,
          content: jsContent,
          fileName
        });
        if (minify) {
          tcode = Terser.minify(tcode).code;
        }
        // eslint-disable-next-line
        f.contents = Buffer.from(tcode);
        cb(null, f);
      }
    });

    // transform other files
    console.log(`${chalk.green('[Lugia Mega]')} transform other files......`);
    await transformFile({
      globs: [
        '**/*',
        '!**/*.js',
        '!**/*.jsx',
        '!**/*.ts',
        '!**/*.tsx',
        '!**/*.lugiad'
      ],
      cwd: appSrc,
      destDir,
      transformFunction(f, enc, cb) {
        // file => https://github.com/gulpjs/vinyl
        if (!f.stat.isFile()) {
          return cb();
        }
        this.push(f);
        cb();
      }
    });

    const designInfoPath = join(appComponents, './designInfo.js');
    console.log(
      `${chalk.green('[Lugia Mega]')} remove ${designInfoPath}......`
    );
    rimraf.sync(designInfoPath);

    console.log(`${chalk.green('[Lugia Mega]')} Build Lib successfully.`);
  }
}
