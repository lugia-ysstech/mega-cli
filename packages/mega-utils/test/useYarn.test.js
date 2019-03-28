/**
 * Created Date: Thursday, March 28th 2019, 3:11:09 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, March 28th 2019, 3:52:14 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { join } from 'path';
import {
  hasYarnLock,
  isYarnAvailable,
  getYarnResolved,
  isYarnWS,
} from '../lib/useYarn';
import is from '../lib/is';

describe('useYarn', () => {
  test('hasYarnLock(cwd)', () => {
    expect(hasYarnLock(join(__dirname, './fixtures/yarnLock'))).toBe(true);
  });

  test('isYarnWS(cwd)', () => {
    expect(isYarnWS(join(__dirname, './fixtures/yarnWS'), true)).toBe(true);
  });

  test('getYarnResolved()', () => {
    const p = getYarnResolved();
    if (is.null(p)) {
      expect(p).toBe(null);
      expect(isYarnAvailable()).toBe(false);
    } else {
      expect(p).toMatchSnapshot({
        yarn: expect.any(String),
        yarnpkg: expect.any(String),
      });
      expect(isYarnAvailable()).toBe(true);
    }
  });
});
