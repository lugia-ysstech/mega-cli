/**
 * Created Date: Wednesday, November 7th 2018, 7:13:30 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, May 30th 2019, 3:44:00 pm
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
    name: 'generator',
    validate(val) {
      assert(
        is.function(val),
        `The generator config must be Function, but got ${val}`,
      );
    },
  };
}
