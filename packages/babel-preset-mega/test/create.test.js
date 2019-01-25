/**
 * Created Date: Friday, August 10th 2018, 3:27:58 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import dev from '../lib/dev';
import prod from '../lib/prod';
import test from '../lib/test';

describe('babel-preset-mega', () => {
  it('dev', () => {
    expect(dev().presets[0][1]).toEqual({
      useBuiltIns: false,
      modules: false,
      targets: { browsers: ['last 2 versions', 'ie 10'] },
      ignoreBrowserslistConfig: true,
    });
  });

  it('prod', () => {
    expect(prod().presets[0][1]).toEqual({
      useBuiltIns: false,
      modules: false,
      targets: { browsers: ['last 2 versions', 'ie 10'] },
      ignoreBrowserslistConfig: true,
    });
  });

  it('test', () => {
    expect(test().presets[0][1]).toEqual({
      targets: { node: 8 },
    });
  });
});
