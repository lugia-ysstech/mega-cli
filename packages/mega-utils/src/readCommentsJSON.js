/**
 * Created Date: Thursday, July 12th 2018, 1:49:07 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import { readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';

// Strip comments from JSON. Lets you use comments in your JSON files!
export default function(path, encoding = 'utf-8') {
  const content = stripJsonComments(readFileSync(path, encoding));
  return JSON.parse(content);
}
