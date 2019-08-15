/**
 * Created Date: Thursday, August 15th 2019, 7:07:59 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, August 15th 2019, 7:11:53 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'polyfills',
    validate(val) {
      assert(
        is.boolean(val) || is.array(val),
        `The polyfills config must be Boolean|Array, but got ${val}`
      );
    }
  };
}
