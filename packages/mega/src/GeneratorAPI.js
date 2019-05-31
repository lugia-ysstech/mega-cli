/**
 * Created Date: Thursday, May 30th 2019, 4:08:16 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, May 31st 2019, 6:17:32 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import is from '@lugia/mega-utils/lib/is';
import logger from '@lugia/mega-utils/lib/logger';
import homeOrTmp from '@lugia/mega-utils/lib/homeOrTmp';
import mergeObj from '@lugia/mega-utils/lib/mergeDefaults';
import chalk from 'chalk';
import assert from 'assert';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import which from 'which';

export default class GeneratorAPI {
  constructor(app, isonline, verbose) {
    this.app = app;
    this.isonline = isonline;
    this.verbose = verbose;
  }

  getApp() {
    return this.app;
  }

  isOnline() {
    return this.isonline;
  }

  isVerbose() {
    return this.verbose;
  }

  mergePackage(toMerge) {
    const app = this.getApp();
    const { pkg } = app;
    if (is.function(toMerge)) {
      app.pkg = toMerge(pkg);
    } else if (is.object(toMerge)) {
      Object.keys(toMerge).forEach(key => {
        const value = toMerge[key];
        const existing = pkg[key];
        if (is.object(value) && is.object(existing)) {
          pkg[key] = mergeObj(existing, value);
        } else {
          pkg[key] = value;
        }
      });
    }
  }

  _successLog(log) {
    this.successLog = log;
  }

  _utils() {
    return {
      chalk,
      is,
      mergeObj,
      assert,
      fs,
      rimraf,
      which,
      logger,
      homeOrTmp,
    };
  }
}
