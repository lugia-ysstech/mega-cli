/**
 * Created Date: Monday, July 9th 2018, 5:08:36 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

export default function(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    memo[key] = JSON.stringify(obj[key]);
    return memo;
  }, {});
}
