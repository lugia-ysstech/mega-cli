/**
 * Created Date: Wednesday, November 7th 2018, 7:19:03 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, November 7th 2018, 7:19:42 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

// webpack debug loader
export default function(source, map) {
  const { resourcePath } = this;
  const debugLoader = process.env.DEBUG_LOADER;
  if (debugLoader && resourcePath.indexOf(debugLoader) > -1) {
    console.log('');
    console.log('');
    console.log('-------------------------------');
    console.log(resourcePath);
    console.log('===');
    console.log(source);
    console.log('-------------------------------');
    console.log('');
    console.log('');
  }
  this.callback(null, source, map);
}
