/**
 * Created Date: Thursday, March 28th 2019, 4:32:12 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, March 28th 2019, 4:44:45 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import { join } from 'path';
import getUserConfig, { getUserConfigPlugins } from '../lib';

describe('mega-config', () => {
  test('getUserConfigPlugins()', () => {
    expect(getUserConfigPlugins()).toMatchSnapshot();
  });

  test('getUserConfig()', () => {
    expect(
      getUserConfig({ cwd: join(__dirname, 'fixtures') }),
    ).toMatchSnapshot();
  });
});
