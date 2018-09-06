/**
 * Created Date: Tuesday, August 28th 2018, 6:31:22 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, August 29th 2018, 3:33:24 pm
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

export function getScaffoldingPath(scaffolding) {
  return isAbsolute(scaffolding)
    ? scaffolding
    : normalize(join(process.cwd(), scaffolding));
}
