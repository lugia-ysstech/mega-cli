/**
 * Created Date: Tuesday, January 29th 2019, 2:07:30 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, August 19th 2019, 3:07:09 pm
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
import loaderUtils from 'loader-utils';

export default function(content, map, meta) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this);
  const result = lugiad2js(
    JSON.parse(content),
    Object.assign({ resourcesHead: './' }, options)
  );
  callback(null, result, map, meta);
}
