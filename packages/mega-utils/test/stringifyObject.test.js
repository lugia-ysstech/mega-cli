/**
 * Created Date: Monday, July 9th 2018, 5:10:51 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import stringifyObject from '../lib/stringifyObject';

describe('[stringifyObject]', () => {
  it('stringifyObject', () => {
    expect(stringifyObject({ a: 1, b: { c: 2 }, d: true })).toEqual({
      a: '1',
      b: '{"c":2}',
      d: 'true',
    });
  });
});
