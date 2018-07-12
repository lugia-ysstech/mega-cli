/**
 * Created Date: Monday, July 9th 2018, 6:21:37 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

export default function(str) {
  return str.slice(-1) === '/' ? str.slice(0, -1) : str;
}
