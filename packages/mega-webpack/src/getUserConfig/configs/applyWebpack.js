/**
 * Created Date: Wednesday, November 7th 2018, 7:13:30 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, November 7th 2018, 7:15:23 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'applyWebpack',
    validate(val) {
      assert(
        is.function(val),
        `The applyWebpack config must be Function, but got ${val}`,
      );
    },
  };
}
