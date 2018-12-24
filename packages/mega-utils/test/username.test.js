/**
 * Created Date: Monday, December 24th 2018, 5:25:33 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, December 24th 2018, 6:16:06 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { username, usernameSync, fullname } from '../src/username';
import is from '../src/is';

describe('username', () => {
  test('username()', done => {
    username().then(username => {
      expect(is.string(username)).toBe(true);
      done();
    });
  });

  test('usernameSync()', () => {
    expect(is.string(usernameSync())).toBe(true);
  });

  test('fullname()', done => {
    fullname().then(fullname => {
      expect(is.string(fullname)).toBe(true);
      done();
    });
  });
});
