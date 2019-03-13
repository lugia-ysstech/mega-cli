/**
 * Created Date: Tuesday, August 28th 2018, 6:31:22 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, March 13th 2019, 9:44:58 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { isAbsolute, normalize, join } from 'path';

export function isLocalScaffolding(scaffolding) {
  return /^[./]|(^[a-zA-Z]:)/.test(scaffolding);
}

export function getScaffoldingPath(scaffolding, cwd = process.cwd()) {
  return isAbsolute(scaffolding)
    ? scaffolding
    : normalize(join(cwd, scaffolding));
}
