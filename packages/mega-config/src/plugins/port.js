/**
 * Created Date: Monday, July 22nd 2019, 1:42:09 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, July 22nd 2019, 1:43:19 am
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
    name: 'port',
    validate(val) {
      assert(is.number(val), `The port config must be Number, but got ${val}`);
    }
  };
}
