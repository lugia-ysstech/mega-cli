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
    name: 'contentBase',
    validate(val) {
      assert(
        is.string(val) || is.Array(val),
        `The contentBase config must be String|Array, but got ${val}`
      );
    }
  };
}
