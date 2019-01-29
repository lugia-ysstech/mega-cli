/**
 * Created Date: Tuesday, January 29th 2019, 2:07:30 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Tuesday, January 29th 2019, 5:20:31 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

/*
 * webpack loader
 * .lugiad ==> .js
 */
import lugiad2code from './lugiad2code';

export default function(content, map, meta) {
  const callback = this.async();
  const result = lugiad2code(JSON.parse(content));
  callback(null, result, map, meta);
}