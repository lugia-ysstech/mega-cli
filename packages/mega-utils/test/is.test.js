/**
 * Created Date: Tuesday, July 3rd 2018, 11:52:35 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import is from '../lib/is';
import clearConsole from '../lib/clearConsole';

describe('[is]', () => {
  it('is(value)', () => {
    expect(is(null)).toBe('null');
    expect(is('string')).toBe('string');
    expect(is(new Map())).toBe('Map');
    expect(is(6)).toBe('number');
    expect(is(clearConsole)).toBe('Function');
  });

  it('is.function()', () => {
    expect(is.function(clearConsole)).toBe(true);
  });
});
