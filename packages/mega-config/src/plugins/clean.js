/**
 * Created Date: Wednesday, August 15th 2018, 5:29:25 pm
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
    name: 'clean',
    validate(val) {
      assert(is.array(val), `The clean config must be Array, but got ${val}`);
    },
  };
}
