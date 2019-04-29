/**
 * Created Date: Tuesday, January 29th 2019, 2:07:30 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, April 29th 2019, 5:26:25 pm
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
import lugiad2js from '@lugia/devtools-conversion';

export default function(content, map, meta) {
  const callback = this.async();
  const result = lugiad2js(JSON.parse(content));
  callback(null, result, map, meta);
}
