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

import dev from './dev';
import prod from './prod';
import test from './test';

describe('babel-preset-mega', () => {
  it('dev', () => {
    expect(dev().presets[0]).toEqual([
      'F:\\yssgitlab\\lugia-mega\\packages\\babel-preset-mega\\node_modules\\@babel\\preset-env\\lib\\index.js',
      {
        useBuiltIns: 'entry',
        modules: false,
        targets: { browsers: ['last 2 versions', 'ie 10'] },
        debug: undefined,
      },
    ]);
  });

  it('prod', () => {
    expect(prod().presets[0]).toEqual([
      'F:\\yssgitlab\\lugia-mega\\packages\\babel-preset-mega\\node_modules\\@babel\\preset-env\\lib\\index.js',
      {
        useBuiltIns: 'entry',
        modules: false,
        targets: { browsers: ['last 2 versions', 'ie 10'] },
        debug: undefined,
      },
    ]);
  });

  it('test', () => {
    expect(test().presets[0]).toEqual([
      'F:\\yssgitlab\\lugia-mega\\packages\\babel-preset-mega\\node_modules\\@babel\\preset-env\\lib\\index.js',
      {
        targets: { node: 'current' },
      },
    ]);
  });
});
