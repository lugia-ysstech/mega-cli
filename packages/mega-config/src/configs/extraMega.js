/**
 * Created Date: Thursday, March 21st 2019, 10:41:40 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, March 21st 2019, 10:52:54 am
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
    name: 'extraMega',
    validate(val) {
      assert(
        is.plainObject(val),
        `The extraMega config must be Plain Object, but got ${val}`,
      );
    },
  };
}
