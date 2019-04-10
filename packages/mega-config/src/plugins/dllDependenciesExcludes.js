/**
 * Created Date: Wednesday, April 10th 2019, 1:46:13 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, April 10th 2019, 1:47:33 pm
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
    name: 'dllDependenciesExcludes',
    validate(val) {
      assert(
        is.array(val),
        `The dllDependenciesExcludes config must be Array, but got ${val}`,
      );
    },
  };
}
