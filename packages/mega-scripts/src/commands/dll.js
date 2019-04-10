/**
 * Created Date: Wednesday, April 10th 2019, 10:21:00 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, April 10th 2019, 3:07:56 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import chalk from 'chalk';

process.env.NODE_ENV = 'development';
require('../utils/dll')({
  cwd: process.cwd(),
}).catch(e => {
  console.error(chalk.red(`DLL failed: ${e.message}`));
  console.log(e);
});
