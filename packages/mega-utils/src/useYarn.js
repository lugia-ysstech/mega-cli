/*
 * Created Date: Monday, July 30th 2018, 7:42:38 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * Copyright (c) 2018 @lugia
 */

import which from 'which';
import findPkg from 'find-pkg';
import { resolve } from 'path';
import { existsSync } from 'fs';
import is from './is';

const envPath = process.env.PATH || process.env.Path || process.env.path;

export default function useYarn(cwd, needYarn = false) {
  needYarn = needYarn || (cwd && isYarnWS(cwd)) || (cwd && hasYarnLock(cwd));
  const yarnAvailable = isYarnAvailable();
  if (needYarn && !yarnAvailable) {
    throw new Error('Please install yarn[https://github.com/yarnpkg/yarn]!');
  }
  return yarnAvailable;
}

export function hasYarnLock(cwd = process.cwd()) {
  return existsSync(resolve(cwd, 'yarn.lock'));
}

export function isYarnAvailable() {
  return !is.empty(getYarnResolved());
}

export function getYarnResolved() {
  const yarnpkg = which.sync('yarnpkg', { nothrow: true, path: envPath });
  const yarn = which.sync('yarn', { nothrow: true, path: envPath });
  if (is.empty(yarnpkg) && is.empty(yarn)) return null;
  return { yarnpkg, yarn };
}

export function isYarnWS(cwd = process.cwd(), end = false) {
  // https://yarnpkg.com/lang/en/docs/workspaces/
  const pkgPath = findPkg.sync(resolve(cwd));
  const pkg = pkgPath && require(pkgPath); // eslint-disable-line
  const workspaces = pkg && pkg.private && pkg.workspaces;
  const patterns = (workspaces && workspaces.packages) || workspaces;
  return end ? Boolean(patterns) : isYarnWS(resolve(cwd, '..'), true);
}
