/**
 * Created Date: Monday, September 3rd 2018, 11:27:17 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, September 3rd 2018, 11:39:15 am
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import getGitUser from '../lib/getGitUser';
import is from '../lib/is';

describe('getGitUser', () => {
  const getUser = getGitUser();
  const isNullOrString = v => is.null(v) || is.string(v);

  test('getGitUser() => {name, email}', () => {
    expect(Object.keys(getUser)).toEqual(['name', 'email']);
  });

  ['name', 'email'].forEach(v => {
    test(`${v} is null or string`, () => {
      expect(isNullOrString(getUser[v])).toBe(true);
    });
  });
});
