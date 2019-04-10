/**
 * Created Date: Wednesday, April 10th 2019, 10:43:46 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, April 10th 2019, 11:20:50 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { readJsonSync } from 'fs-extra';

const debug = require('debug')('@lugia/mega-scripts:getDependenciesVersion');

export default function(dependencies = [], cwd = process.cwd()) {
  const dependenciesVersion = {};

  dependencies.forEach(d => {
    try {
      const pkgPath = require.resolve(`${d}/package.json`, { paths: [cwd] });
      const { version = '' } = readJsonSync(pkgPath);
      dependenciesVersion[d] = version;
    } catch (e) {
      debug(e);
      dependenciesVersion[d] = '';
    }
  });

  return dependenciesVersion;
}
