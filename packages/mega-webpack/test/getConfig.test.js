/**
 * Created Date: Thursday, July 12th 2018, 3:37:37 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import getConfig from '../lib/getConfig';

describe('[mega-webpack]:getConfig', () => {
  test('getConfig({ cwd: __dirname })', () => {
    const config = getConfig({ cwd: __dirname });
    expect(config).toMatchSnapshot();
  });
});
