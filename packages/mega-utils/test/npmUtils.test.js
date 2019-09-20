/**
 * Created Date: Monday, September 3rd 2018, 10:46:46 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, September 20th 2019, 5:25:19 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import { execSync } from 'child_process';
import getPackageInfo, {
  getRegistryInfo,
  getRegistryUrl
} from '../lib/npmUtils';
import is from '../lib/is';

describe('npmUtils', () => {
  let registry = execSync('npm config get registry');
  registry = registry
    ? registry.toString().trim()
    : 'https://registry.npmjs.org/';

  it('getRegistryUrl', () => {
    expect(getRegistryUrl()).toBe(registry);
  });

  it('getRegistryInfo', () => {
    expect(Object.keys(getRegistryInfo())).toEqual([
      'registryUrl',
      'authToken',
      'authorization'
    ]);
    expect(getRegistryInfo().registryUrl).toBe(registry);
  });

  it('getPackageInfo("got")', async () => {
    const version = await getPackageInfo('got');
    expect(version.dist.tarball.indexOf('.tgz') > 0).toBe(true);
  });

  it('getPackageInfo("got@2.0.0")', async () => {
    const version = await getPackageInfo('got@2.0.0');
    expect(version.dist.tarball.indexOf('2.0.0') > 0).toBe(true);
  });

  it('getPackageInfo allVersions', async () => {
    const versions = await getPackageInfo('got@2.0.0', { allVersions: true });
    expect(is.object(versions)).toBe(true);
    expect(versions['2.0.0'].dist.tarball.indexOf('.tgz') > 0).toBe(true);
  });

  it('getPackageInfo allInfo', async () => {
    const info = await getPackageInfo('got', { allInfo: true });
    expect(is.object(info)).toBe(true);

    const infoItems = Object.keys(info);
    ['name', 'dist-tags', 'time', 'versions'].forEach(item => {
      expect(infoItems.includes(item)).toBe(true);
    });
  });

  it('getPackageInfo registry', async () => {
    const version = await getPackageInfo('got@2.0.0', {
      registry: 'https://registry.npmjs.org/'
    });
    expect(version.dist.tarball).toBe(
      'https://registry.npmjs.org/got/-/got-2.0.0.tgz'
    );
  });

  it('getPackageInfo reject', async () => {
    try {
      await getPackageInfo('got@2.0.1111111');
    } catch (error) {
      expect(() => {
        throw error;
      }).toThrow('Can not found version 2.0.1111111 of got.');
    }
  });
});
