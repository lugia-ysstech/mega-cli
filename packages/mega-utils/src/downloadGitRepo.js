/**
 * Created Date: Tuesday, March 12th 2019, 2:06:51 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, March 27th 2019, 1:50:06 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import downloadUrl from 'download';
import rm from 'rimraf';
import gitclone from './gitClone';

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 * forked from https://github.com/flipxfx/download-git-repo
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */
export default function download(repo, dest, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = null;
  }
  opts = opts || {};
  const clone = opts.clone || false;

  repo = normalize(repo);
  const url = repo.url || getUrl(repo, clone);

  if (clone) {
    gitclone(
      url,
      dest,
      { checkout: repo.checkout, shallow: repo.checkout === 'master' },
      err => {
        if (err === undefined) {
          rm(`${dest}/.git`, error => {
            if (error) {
              fn(error);
            } else {
              fn();
            }
          });
        } else {
          fn(err);
        }
      },
    );
  } else {
    downloadUrl(url, dest, {
      extract: true,
      strip: 1,
      mode: '666',
      headers: { accept: 'application/zip' },
    })
      .then(() => {
        fn();
      })
      .catch(err => {
        fn(err);
      });
  }
}

/**
 * Normalize a repo string.
 *
 * @param {String} repo
 * @return {Object}
 */
export function normalize(repo) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);
  let checkout;

  if (match) {
    const url = match[2];
    checkout = match[3] || 'master';

    return {
      type: 'direct',
      url,
      checkout,
    };
  } else {
    regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/;
    match = regex.exec(repo);
    const type = match[1] || 'github';
    let origin = match[2] || null;
    const owner = match[3];
    const name = match[4];
    checkout = match[5] || 'master';

    if (origin == null) {
      if (type === 'github') {
        origin = 'github.com';
      } else if (type === 'gitlab') {
        origin = 'gitlab.com';
      } else if (type === 'bitbucket') {
        origin = 'bitbucket.com';
      }
    }

    return {
      type,
      origin,
      owner,
      name,
      checkout,
    };
  }
}

/**
 * Adds protocol to url in none specified
 *
 * @param {String} url
 * @return {String}
 */
export function addProtocol(origin, clone) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) {
      origin = `git@${origin}`;
    } else {
      origin = `https://${origin}`;
    }
  }

  return origin;
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */
export function getUrl(repo, clone) {
  let url;

  // Get origin with protocol and add trailing slash or colon (for ssh)
  let origin = addProtocol(repo.origin, clone);
  if (/^git\@/i.test(origin)) {
    origin += ':';
  } else {
    origin += '/';
  }

  // Build url
  if (clone) {
    url = `${origin + repo.owner}/${repo.name}.git`;
  } else if (repo.type === 'github') {
    url = `${origin + repo.owner}/${repo.name}/archive/${repo.checkout}.zip`;
  } else if (repo.type === 'gitlab') {
    url = `${origin + repo.owner}/${repo.name}/repository/archive.zip?ref=${
      repo.checkout
    }`;
  } else if (repo.type === 'bitbucket') {
    url = `${origin + repo.owner}/${repo.name}/get/${repo.checkout}.zip`;
  }

  return url;
}
