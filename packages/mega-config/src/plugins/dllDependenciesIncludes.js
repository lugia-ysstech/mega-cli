/**
 * Created Date: Wednesday, April 10th 2019, 1:46:13 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, April 11th 2019, 3:24:41 pm
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
    name: 'dllDependenciesIncludes',
    validate(val) {
      assert(
        is.array(val),
        `The dllDependenciesIncludes config must be Array, but got ${val}`,
      );
    },
  };
}
