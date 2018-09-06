/**
 * Created Date: Tuesday, September 4th 2018, 4:06:28 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Tuesday, September 4th 2018, 4:26:56 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import ejs from 'ejs';
import { readFileSync } from 'fs-extra';
import { join } from 'path';

const tplPath = join(__dirname, '../templates/Page.jsx.ejs');
const tpl = readFileSync(tplPath, 'utf-8');

const pageJSX = ejs.render(tpl, {
  className: 'Dashboard',
  blocks: [
    {
      className: 'TextSearchListBlock',
      relativePath: './blocks/TextSearchListBlock',
    },
  ],
});

console.log(pageJSX);
