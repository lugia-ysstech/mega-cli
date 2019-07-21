/**
 * Created Date: Friday, July 19th 2019, 6:42:32 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Sunday, July 21st 2019, 8:48:34 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { transformFileSync } from '@babel/core';
import { readdirSync } from 'fs';
import { join } from 'path';

function testEngine(engine, env = 'production') {
  it(`engine: ${engine}`, () => {
    const fixtures = join(__dirname, './fixtures');
    const results = readdirSync(fixtures).map(file => {
      const { code } = transformFileSync(join(fixtures, file), {
        presets: [
          [
            require.resolve(join(__dirname, '../src')),
            {
              env,
              engine
            }
          ]
        ]
      });
      return {
        file,
        code
      };
    });

    expect(results).toMatchSnapshot();
  });
}

describe('babel-preset-mega', () => {
  // testEngine('webpackApp');
  // testEngine('webpackLib');
  testEngine('nodeApp');
  // testEngine('nodeLib');
});
