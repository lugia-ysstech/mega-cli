/**
 * Created Date: Friday, March 22nd 2019, 3:00:41 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, March 29th 2019, 1:14:38 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { join } from 'path';
import requireindex from 'requireindex';

export default function() {
  const pluginsMap = requireindex(join(__dirname, './plugins'));
  return Object.keys(pluginsMap).map(key => {
    return pluginsMap[key]();
  });
}
