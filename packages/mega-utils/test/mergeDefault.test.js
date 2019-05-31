/**
 * Created Date: Monday, July 2nd 2018, 6:24:06 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import merge from '../lib/mergeDefaults';

describe('[mergeDefaults]', () => {
  it('Object.assign', () => {
    const obj = { f: { c: 0 } };
    const src = { f: { a: 0 } };
    expect(Object.assign({}, obj, src)).toEqual({ f: { a: 0 } });
    expect(Object.assign(src, obj)).toEqual({ f: { c: 0 } });
    expect(src).toEqual({ f: { c: 0 } });
    expect(obj).toEqual({ f: { c: 0 } });
  });

  it('merge', () => {
    const obj = { f: { c: 0 } };
    const src = { f: { a: [0] } };
    const obj1 = { f: { a: [1] } };
    expect(merge(obj, src)).toEqual({ f: { c: 0, a: [0] } });
    expect(merge(src, obj)).toEqual({ f: { c: 0, a: [0] } });
    expect(merge(src, obj1)).toEqual({ f: { a: [1] } });
    expect(src).toEqual({ f: { a: [0] } });
    expect(obj).toEqual({ f: { c: 0 } });
  });
});
