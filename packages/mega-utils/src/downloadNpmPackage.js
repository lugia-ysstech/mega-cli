/**
 * Created Date: Friday, August 31st 2018, 6:11:20 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Monday, September 3rd 2018, 5:33:54 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import got from 'got';
import pipe from 'pump';
import { extract } from 'tar-fs';
import gunzipMaybe from 'gunzip-maybe';
import npa from 'npm-package-arg';
import getPackage, { getRegistryInfo } from './npmUtils';

export function downloadTarball({ url, dest, gotOpts, extractOpts }) {
  return new Promise((resolve, reject) => {
    pipe(
      got.stream(url, gotOpts),
      gunzipMaybe(),
      extract(dest, extractOpts),
      err => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      },
    );
  });
}

export default async function downloadNpmPackage(
  packageName,
  dest = process.cwd(),
  options,
) {
  const { scope } = npa(packageName);
  const { authorization } = getRegistryInfo(scope);
  const headers = authorization ? { authorization } : {};
  const pkg = await getPackage(packageName, options);
  const {
    dist: { tarball },
  } = pkg;
  await downloadTarball({
    url: tarball,
    dest,
    gotOpts: { headers },
    extractOpts: {
      map(header) {
        const originalDirName = header.name.split('/')[0];
        header.name = header.name.replace(`${originalDirName}/`, '');
        return header;
      },
    },
  });
}
