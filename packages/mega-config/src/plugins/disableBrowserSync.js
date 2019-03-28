/**
 * Created Date: Friday, August 17th 2018, 6:02:21 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import assert from 'assert';
import is from '@lugia/mega-utils/lib/is';

export default function() {
  return {
    name: 'disableBrowserSync',
    validate(val) {
      assert(
        is.boolean(val),
        `The disableBrowserSync config must be Boolean, but got ${val}`,
      );
    },
  };
}
