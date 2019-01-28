/**
 * Created Date: Friday, January 25th 2019, 6:25:40 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, January 25th 2019, 6:26:28 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { join } from 'path';
import { existsSync } from 'fs-extra';

export default function getDefaultEntry(cwd) {
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
