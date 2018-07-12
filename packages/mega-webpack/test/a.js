/**
 * Created Date: Thursday, July 12th 2018, 3:37:37 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

const getConfig = require('../lib/getConfig').default;

const cwd = process.cwd();
const config = getConfig({ cwd });

console.log(config.module.rules);
