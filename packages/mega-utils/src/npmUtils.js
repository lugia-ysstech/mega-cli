/**
 * Created Date: Friday, August 31st 2018, 10:42:30 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Friday, September 20th 2019, 5:37:45 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * Javascript will save your soul!
 */

import rc from 'rc';
import getAuthToken from 'registry-auth-token';
import npa from 'npm-package-arg';
import got from 'got';
import semver from 'semver';
// import {maxSatisfying, validRange} from 'semver';

export function getRegistryUrl(
  scope,
  npmrc = rc('npm', { registry: 'https://registry.npmjs.org/' })
) {
  const url =
    npmrc[`${scope}:registry`] || npmrc.config_registry || npmrc.registry;
  return url.slice(-1) === '/' ? url : `${url}/`;
}

export function getRegistryInfo(scope) {
  const registryUrl = getRegistryUrl(scope);
  const authToken = getAuthToken(registryUrl);
  const authorization = authToken
    ? `${authToken.type} ${authToken.token}`
    : undefined;
  return {
    registryUrl,
    authToken,
    authorization
  };
}

export default function getPackageInfo(
  packageName,
  { registry, allVersions, allInfo } = {
    registry: undefined,
    allVersions: false,
    allInfo: false
  }
) {
  // npa('@dd/got@1.2.0') ==>
  // { type: 'version',
  //   registry: true,
  //   where: undefined,
  //   raw: '@dd/got@1.2.0',
  //   name: '@dd/got',
  //   escapedName: '@dd%2fgot',
  //   scope: '@dd',
  //   rawSpec: '1.2.0',
  //   saveSpec: null,
  //   fetchSpec: '1.2.0',
  //   gitRange: undefined,
  //   gitCommittish: undefined,
  //   hosted: undefined }
  //
  // npa('@dd/got@latest') ==>
  // { type: 'tag',
  //   registry: true,
  //   where: undefined,
  //   raw: '@dd/got@latest',
  //   name: '@dd/got',
  //   escapedName: '@dd%2fgot',
  //   scope: '@dd',
  //   rawSpec: 'latest',
  //   saveSpec: null,
  //   fetchSpec: 'latest',
  //   gitRange: undefined,
  //   gitCommittish: undefined,
  //   hosted: undefined }
  const { scope, escapedName, fetchSpec = 'latest', name } = npa(packageName);
  const { authorization, registryUrl } = getRegistryInfo(scope);
  const useRegistry = registry || registryUrl;
  const headers = authorization ? { authorization } : {};
  const url = `${useRegistry.replace(/\/$/, '')}/${escapedName}`;

  return new Promise((resolve, reject) => {
    got(url, {
      headers,
      json: true
    })
      .then(({ body }) => {
        const error = version =>
          new Error(`Can not found version ${version} of ${name}.`);
        if (!(body && body['dist-tags'] && body.versions)) {
          return reject(error(fetchSpec));
        }
        if (allInfo) {
          return resolve(body);
        }
        if (allVersions) {
          return resolve(body.versions);
        }
        const version = semver.valid(fetchSpec)
          ? fetchSpec
          : body['dist-tags'][fetchSpec];
        if (semver.valid(version) && body.versions[version]) {
          resolve(body.versions[version]);
        } else {
          reject(error(version));
        }
      })
      .catch(e => {
        reject(e);
      });
  });
}
