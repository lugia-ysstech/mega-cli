/**
 * Created Date: Wednesday, March 27th 2019, 9:44:41 am
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Wednesday, March 27th 2019, 5:33:42 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2019-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import spawn from './crossSpawn';

const envPath = process.env.PATH || process.env.Path || process.env.path;

export default function gitClone(repo, targetPath, opts = {}, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  const { git = 'git' } = opts;
  const args = ['clone'];

  if (opts.shallow) {
    args.push('--depth');
    args.push('1');
  }

  args.push('--');
  args.push(repo);
  args.push(targetPath);

  const process = spawn(git, args, { env: { PATH: envPath } });
  process.on('close', status => {
    if (status === 0) {
      if (opts.checkout) {
        _checkout();
      } else if (cb) {
        cb();
      }
    } else if (cb) {
      cb(new Error(`'git clone' failed with status ${status}`));
    }
  });

  function _checkout() {
    const args = ['checkout', opts.checkout];
    const process = spawn(git, args, {
      cwd: targetPath,
      env: { PATH: envPath },
    });
    process.on('close', status => {
      if (status === 0) {
        if (cb) {
          cb();
        }
      } else if (cb) {
        cb(new Error(`'git checkout' failed with status ${status}`));
      }
    });
  }
}
