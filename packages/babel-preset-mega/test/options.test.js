/**
 * Created Date: Friday, July 19th 2019, 6:42:32 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, September 20th 2019, 6:06:30 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { transformFileSync } from '@babel/core';
import { readdirSync } from 'fs';
import { join } from 'path';

const cwd = join(__dirname, '../');

function testEngine(engine, opts) {
  it(`engine: ${engine}, opts: ${JSON.stringify(opts)}`, () => {
    const fixtures = join(__dirname, './fixtures');
    const results = readdirSync(fixtures).map(file => {
      const { code } = transformFileSync(join(fixtures, file), {
        presets: [
          [
            require.resolve(join(__dirname, '../src')),
            {
              env: 'production',
              engine,
              cwd,
              autoInstall: true,
              ...opts
            }
          ]
        ]
      });
      return {
        file,
        code: code.replace(/from ".*babel-preset-mega.*"/g, 'from "..."')
      };
    });

    expect(results).toMatchSnapshot();
  });
}

describe('babel-preset-mega', () => {
  testEngine('webpackApp');
  testEngine('webpackApp', {
    imports: [
      {
        libraryName: '@lugia/lugia-web',
        libraryDirectory: 'dist'
      }
    ]
  });
  testEngine('webpackLib');
  testEngine('webpackLib', {
    browsers: 'chrome 70'
  });
  testEngine('nodeApp');
  testEngine('nodeLib');
  testEngine('nodeLib', {
    targets: {
      node: 4
    }
  });
});
