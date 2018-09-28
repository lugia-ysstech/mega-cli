/**
 * Created Date: Friday, September 28th 2018, 3:43:11 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, September 28th 2018, 3:53:42 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { existsSync } from 'fs';
import homeOrTmp from '../lib/homeOrTmp';

describe('homeOrTmp', () => {
  test('homeOrTmp exists', () => {
    expect(existsSync(homeOrTmp)).toBe(true);
  });
});
