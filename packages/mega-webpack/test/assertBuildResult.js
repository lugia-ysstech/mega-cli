/**
 * Created Date: Tuesday, August 14th 2018, 11:44:35 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 * ------------------------------------
 * Javascript will save your soul!
 */

import { join } from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';

export default function assertBuildResult(cwd, dest = 'dist') {
  const actualDir = join(cwd, dest);
  const expectDir = join(cwd, 'expected');

  const actualFiles = glob.sync('**/*', { cwd: actualDir, nodir: true });
  const expectFiles = glob.sync('**/*', { cwd: expectDir, nodir: true });

  expect(actualFiles.length).toEqual(expectFiles.length);

  actualFiles.forEach(file => {
    const actualFile = readFileSync(join(actualDir, file), 'utf-8');
    const expectFile = readFileSync(join(expectDir, file), 'utf-8');
    expect(actualFile.trim()).toBe(expectFile.trim());
  });
}
